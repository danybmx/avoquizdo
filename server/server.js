const { Server } = require('ws');
const mongoose = require('mongoose');
const winston = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid');
const http = require('http');
require('dotenv').config();
require('./model/Quiz');

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

mongoose.connect(
  process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    logger.info('connection with the database established');
  },
);

const { PORT } = process.env;
const START_COUNTDOWN_TIME = 5000;
const ROUND_COUNTDOWN_TIME = 9000;

const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
server.listen(PORT, () => {
  logger.info(`server listening on port ${PORT}`);
});

const wsServer = new Server({ server, path: '/ws' });

const pins = {};
const games = {};
const sessions = {};

const serializeMessage = (action, data) => JSON.stringify({ action, data });
const deseralizeMessage = (message) => {
  const { action, data } = JSON.parse(message);
  return { action, data };
};

const sendSerialized = (id, serializedMessage) => {
  logger.debug(`sending to ${id}: ${serializedMessage}`);
  const { session } = sessions[id];
  session.send(serializedMessage);
};

const send = (id, action, data) => {
  sendSerialized(id, serializeMessage(action, data));
};

const delay = (millis) => new Promise((resolve) => {
  logger.debug(`delaying ${millis} millis`);
  setTimeout(resolve, millis);
});

const broadcast = (targets, action, message) => {
  const serializedMessage = serializeMessage(action, message);
  logger.debug(`broadcasting to ${targets}: ${serializedMessage}`);
  targets.forEach((target) => {
    sendSerialized(target, serializedMessage);
  });
};

const disconnect = (targets) => {
  logger.info(`disconnecting ${targets}`);
  targets.forEach((target) => {
    if (sessions[target]) {
      const { session } = sessions[target];
      session.close();
    }
  });
};

const Quiz = mongoose.model('Quiz');
const generatePin = () => Math.random()
  .toString(36)
  .slice(-6);
const getQuiz = (id) => Quiz.findById(id);
const getQuizzes = () => Quiz.find();
const createQuiz = (quiz) => new Quiz(quiz).save();
const updateQuiz = (id, quiz) => Quiz.findByIdAndUpdate(id, quiz).exec();
const deleteQuiz = (id) => Quiz.findByIdAndDelete(id).exec();

const clearGame = (id) => () => {
  const game = games[id];
  disconnect(game.players);
  delete pins[game.pin];
  delete games[id];
};

const addEvent = (id, event, fn) => {
  const { session } = sessions[id];
  session.addEventListener(event, fn);
};

const createGame = (host, quiz) => {
  const id = uuid();
  addEvent(host, 'close', clearGame(id));
  const pin = generatePin();
  pins[pin] = id;
  const game = {
    id,
    quiz,
    host,
    pin,
    status: 'PREPARING',
    correct_answers: 0,
    answers: 0,
    current_question: -1,
    points: {},
    players: [],
  };
  game.broadcast = (action, message) => {
    const targets = game.players.concat([game.host]);
    broadcast(targets, action, message);
  };
  game.start = () => {
    game.status = 'RUNNING';
    game.players.forEach((p) => {
      game.points[p] = 0;
    });
  };
  game.addPlayer = (player) => {
    if (game.status === 'PREPARING') {
      game.players.push(player);
      game.updatePlayerList();
    } else {
      throw new Error('game already started or closed');
    }
  };
  game.removePlayer = (player) => {
    game.players.splice(game.players.indexOf(player), 1);
    game.updatePlayerList();
  };
  game.updatePlayerList = () => {
    const players = game.players.map((p) => sessions[p].nickname);
    send(game.host, 'update_players', { players });
  };
  game.sendQuestion = () => {
    game.answers = 0;
    game.correct_answers = 0;
    // eslint-disable-next-line no-plusplus
    const question = game.quiz.questions[++game.current_question];
    game.broadcast('question', {
      question: question.text,
      answers: question.answers.map((a) => a.text),
    });
  };
  game.getScores = () => Object.entries(game.points)
    .sort((a, b) => {
      if (a[1] > b[1]) return -1;
      if (a[1] < b[1]) return 1;
      return 0;
    })
    .map((a) => {
      const name = sessions[a[0]].nickname;
      const points = a[1];
      return { name, points };
    });
  game.registerAnswer = (playerId, answer) => {
    const question = game.quiz.questions[game.current_question];
    if (question.answers[answer].valid) {
      const score = 1000 * (1 - game.correct_answers / 10);
      // eslint-disable-next-line no-plusplus
      game.correct_answers++;
      game.points[playerId] += score;
    }
    // eslint-disable-next-line no-plusplus
    game.answers++;
    send(game.host, 'answers', { count: game.answers });
  };
  game.hasNextQuestion = () => game.current_question < game.quiz.questions.length - 1;
  return game;
};

const actions = {
  create: async (id, data) => {
    if (!data.quiz_id) {
      throw new Error('quiz_id must be present');
    }
    const quiz = await getQuiz(data.quiz_id);
    if (quiz === null) {
      throw new Error(`quiz for quiz_id ${data.quiz_id} does not exists`);
    }
    const game = createGame(id, quiz);
    games[game.id] = game;
    send(id, 'created', { pin: game.pin, id: game.id });
  },
  join: (id, data) => {
    if (!data.game_pin) {
      throw new Error('game_pin must be present');
    }
    if (!data.nickname) {
      throw new Error('nickname must be present');
    }
    if (!pins[data.game_pin]) {
      throw new Error(`game_pin ${data.game_pin} does not exists`);
    }
    const gameId = pins[data.game_pin];
    const game = games[gameId];
    sessions[id].nickname = data.nickname;
    game.addPlayer(id);
    send(id, 'joined', {
      game: gameId,
    });
  },
  start: (id) => {
    const game = Object.values(games).filter((g) => g.host === id)[0] || null;
    if (game === null) {
      throw new Error('you are not a game host');
    }
    game.start();
    game.broadcast('starting', { countdown: START_COUNTDOWN_TIME });
    delay(START_COUNTDOWN_TIME).then(() => {
      game.sendQuestion();
    });
  },
  next_round: async (id) => {
    const game = Object.values(games).filter((g) => g.host === id)[0] || null;
    if (game === null) {
      throw new Error('you are not a game host');
    }
    if (game.hasNextQuestion()) {
      game.broadcast('round_resume', {
        countdown: ROUND_COUNTDOWN_TIME,
        scores: game.getScores(),
      });
      delay(ROUND_COUNTDOWN_TIME).then(() => {
        game.sendQuestion();
      });
    } else {
      const q = await getQuiz(game.quiz._id);
      updateQuiz(game.quiz._id, { played_times: q.played_times + 1 });

      game.broadcast('results', {
        scores: game.getScores(),
      });
      clearGame(game);
    }
  },
  answer: (id, data) => {
    const game = Object.values(games).filter((g) => g.players.indexOf(id) >= 0)[0] || null;
    if (game === null) {
      throw new Error('you are not a player');
    }
    game.registerAnswer(id, data.answer);
  },
};

const openHandler = (id) => () => {
  const { session } = sessions[id];
  session.send(serializeMessage('connected', { id }));
};

const closeHandler = (id) => () => {
  const game = Object.values(games).filter((g) => g.players.indexOf(id) >= 0)[0] || null;
  if (game) {
    game.removePlayer(id);
  }
  delete sessions[id];
};

const errorHandler = (id) => () => {
  closeHandler(id)();
};

const messageHandler = (id) => (message) => {
  logger.debug(`received from ${id}: ${message.data}`);
  const { session } = sessions[id];
  if (message.type === 'message') {
    try {
      const { action, data } = deseralizeMessage(message.data);
      if (Object.keys(actions).indexOf(action) >= 0) {
        if (actions[action].constructor.name === 'AsyncFunction') {
          actions[action](id, data).catch((ex) => {
            session.send(serializeMessage('error', { message: ex.message }));
          });
        } else {
          actions[action](id, data);
        }
      } else {
        throw new Error(`Action ${action} does not exists.`);
      }
    } catch (ex) {
      session.send(serializeMessage('error', { message: ex.message }));
    }
  }
};

wsServer.on('connection', (session) => {
  const id = uuid();
  sessions[id] = {
    session,
    nickname: null,
  };

  session.addEventListener('open', openHandler(id));
  session.addEventListener('close', closeHandler(id));
  session.addEventListener('error', errorHandler(id));
  session.addEventListener('message', messageHandler(id));
});

// Quizz management
app.use(cors({
  origin: '*',
}));
app.get('/quizzes', async (req, res) => {
  const quizzes = await getQuizzes();
  res.send(quizzes);
});

app.get('/quizzes/:quizId', async (req, res) => {
  const quiz = await getQuiz(req.params.quizId);
  res.send(quiz);
});

app.post('/quizzes', async (req, res) => {
  const quiz = await createQuiz(req.body);
  res.send(quiz);
});

app.put('/quizzes/:quizId', async (req, res) => {
  const { quizId } = req.params;
  const quiz = await updateQuiz(quizId, req.body);
  res.send(quiz);
});

app.delete('/quizzes/:quizId', async (req, res) => {
  const { quizId } = req.params;
  logger.info(`deleting quiz ${quizId}`);
  try {
    await deleteQuiz(quizId);
    res.status(204).send();
  } catch (e) {
    logger.error(e);
    res.status(500).send(e.message);
  }
});
