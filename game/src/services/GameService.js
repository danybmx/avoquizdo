import { BehaviorSubject, Subject } from "rxjs";
import { serializeMessage, deseralizeMessage } from "../utils/messages";
import { gameStatus } from "../utils/constants";
import { GAME_WS_URL } from "../env";

class GameService {
  constructor() {
    this.trigger = new Subject();
    this.game = new BehaviorSubject({
      id: "",
      pin: "",
      status: gameStatus.CREATING,
      players: [],
      countdown: 0,
      scores: [],
      question: "",
      answers: [],
      answered: 0
    });
    this.connect();
  }

  connect() {
    this.connection = new WebSocket(GAME_WS_URL);
    this.bindEvents();
  }

  connected() {
    return this.connection.readyState === this.connection.OPEN;
  }

  create(quizId) {
    if (this.connected()) {
      this.connection.send(serializeMessage("create", { quiz_id: quizId }));
    } else {
      setTimeout(() => {
        this.create(quizId);
      }, 100);
    }
  }

  join(gamePin, nickname) {
    if (this.connected()) {
      this.connection.send(
        serializeMessage("join", { game_pin: gamePin, nickname })
      );
    } else {
      setTimeout(() => {
        this.join(gamePin, nickname);
      }, 100);
    }
  }

  bindEvents() {
    this.connection.addEventListener("message", message => {
      if (message.data) {
        this.process(message.data);
      }
    });
    this.trigger.subscribe(({ action, data }) => {
      this[action](data);
    });
  }

  fire(action, data) {
    this.trigger.next({ action, data });
  }

  getGame() {
    return this.game.asObservable();
  }

  start() {
    this.connection.send(serializeMessage("start"));
  }

  nextRound() {
    this.connection.send(serializeMessage("next_round"));
  }

  answer(answer) {
    this.connection.send(serializeMessage("answer", { answer }));
    this.game.next({ ...this.game, state: gameStatus.WAITING });
  }

  process(message) {
    const { action, data } = deseralizeMessage(message);
    switch (action) {
      case "error":
        this.game.next({
          ...this.game.value,
          status: gameStatus.ERROR,
          error: data.message
        });
        break;
      case "created":
        this.game.next({
          ...this.game.value,
          id: data.id,
          pin: data.pin,
          status: gameStatus.READY
        });
        break;
      case "joined":
        this.game.next({
          ...this.game.value,
          status: gameStatus.WAITING
        });
        break;
      case "update_players":
        this.game.next({
          ...this.game.value,
          players: data.players
        });
        break;
      case "starting":
        this.game.next({
          ...this.game.value,
          countdown: data.countdown,
          status: gameStatus.STARTING
        });
        break;
      case "round_resume":
        this.game.next({
          ...this.game.value,
          countdown: data.countdown,
          scores: data.scores,
          status: gameStatus.RESUME
        });
        break;
      case "question":
        this.game.next({
          ...this.game.value,
          question: data.question,
          answers: data.answers,
          answered: 0,
          status: gameStatus.QUESTION
        });
        break;
      case "results":
        this.game.next({
          ...this.game.value,
          scores: data.scores,
          status: gameStatus.FINISHED
        });
        break;
      case "answers":
        this.game.next({
          ...this.game.value,
          answered: data.count
        });
        if (this.game.value.answered >= this.game.value.players.length) {
          setTimeout(() => {
            this.nextRound();
          }, 200);
        }
        break;

      default:
        // eslint-disable-next-line no-console
        console.info(
          `Unhandled ${action} message: ${JSON.stringify(data, null, 2)}`
        );
        break;
    }
  }
}

export default GameService;
