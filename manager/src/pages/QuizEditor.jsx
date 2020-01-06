import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import {
  TextField,
  Typography,
  makeStyles,
  Box,
  Checkbox,
  Grid,
  IconButton,
  Fab,
  Button,
  Divider,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { updateQuiz, getQuiz, createQuiz } from '../service/quizService';
import ErrorComponent from '../components/ErrorComponent';
import { makeCancelable } from '../utils/promises';

const useStyles = makeStyles((theme) => ({
  questionsHeader: {
    margin: theme.spacing(2, 0, 2),
  },
  questionBox: {
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2),
    margin: theme.spacing(0, 0, 2),
  },
  questionTextInput: {
    width: 'calc(100% - 80px)',
  },
  answersBox: {
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0, 0),
  },
  answerTextInput: {
    width: 'calc(100% - 125px)',
  },
  answerTitle: {
    fontSize: '1.1em',
    marginBottom: 10,
  },
  addAnswer: {
    position: 'relative',
    marginTop: 15,
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  addQuestion: {
    position: 'relative',
    left: '50%',
    marginBottom: 20,
    transform: 'translate(-50%, 0)',
  },
}));

function QuizEditor() {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();

  const { quizId } = useParams();
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState({
    name: '',
    questions: [],
  });

  function handleSubmit(ev) {
    ev.preventDefault();
    if (quizId) {
      updateQuiz(quizId, quiz).then(() => history.push('/')).catch(setError);
    } else {
      createQuiz(quiz).then(() => history.push('/')).catch(setError);
    }
  }

  function handleChange(ev) {
    const { name, value } = ev.target;
    setQuiz({ ...quiz, [name]: value });
  }

  function handleQuestionTextChange(questionIndex) {
    return (ev) => {
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions[questionIndex].text = ev.target.value;
      setQuiz(updatedQuiz);
    };
  }

  function handleAnswerTextChange(questionIndex, answerIndex) {
    return (ev) => {
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions[questionIndex].answers[answerIndex].text = ev.target.value;
      setQuiz(updatedQuiz);
    };
  }

  function handleAnswerValidChange(questionIndex, answerIndex) {
    return (ev) => {
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions[questionIndex].answers[answerIndex].valid = ev.target.checked;
      setQuiz(updatedQuiz);
    };
  }

  function handleAddQuestion() {
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions.push({ text: '', answers: [] });
    setQuiz(updatedQuiz);
  }

  function handleAddAnswer(questionIndex) {
    return () => {
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions[questionIndex].answers.push({ text: '', valid: false });
      setQuiz(updatedQuiz);
    };
  }

  function handleRemoveAnswer(questionIndex, answerIndex) {
    return () => {
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions[questionIndex].answers.splice(answerIndex, 1);
      setQuiz(updatedQuiz);
    };
  }

  function handleRemoveQuestion(questionIndex) {
    return () => {
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions.splice(questionIndex, 1);
      setQuiz(updatedQuiz);
    };
  }

  useEffect(() => {
    if (quizId) {
      const cancelablePromise = makeCancelable(getQuiz(quizId));
      cancelablePromise.promise.then(setQuiz).catch(setError);

      return () => {
        cancelablePromise.cancel();
      };
    }
    return () => {};
  }, [quizId]);

  if (error) {
    return (<ErrorComponent title={error} />);
  }

  return (
    <form data-testid="quiz-editor-component" onSubmit={handleSubmit} noValidate autoComplete="off">
      <Typography
        component="h1"
        variant="h4"
        className={classes.questionsHeader}
      >{t('Quiz')}
      </Typography>
      <TextField
        fullWidth
        name="name"
        data-testid="quiz-name-field"
        value={quiz.name}
        onChange={handleChange}
        label={t('Quiz name')}
      />
      <Typography
        component="h2"
        variant="h6"
        className={classes.questionsHeader}
      >{t('Questions')}
      </Typography>
      {quiz.questions.map((question, questionIndex) => {
        const qIndex = `question_${questionIndex}`;
        return (
          <Box
            data-testid={`quiz-question-${questionIndex}-box`}
            className={classes.questionBox}
            key={qIndex}
          >
            <Grid
              container
              spacing={2}
              direction="row"
            >
              <Grid item className={classes.questionTextInput}>
                <TextField
                  fullWidth
                  name="text"
                  value={question.text}
                  onChange={handleQuestionTextChange(questionIndex)}
                  label={t('Question title')}
                />
              </Grid>
              <Grid item>
                <IconButton onClick={handleRemoveQuestion(questionIndex)}>
                  <Delete color="error" />
                </IconButton>
              </Grid>
            </Grid>
            <Box
              className={classes.answersBox}
              data-testid={`quiz-question-${questionIndex}-answers-box`}
            >
              <Typography
                component="h3"
                variant="h6"
                className={classes.answerTitle}
              >
                {t('Answers')}
              </Typography>
              {question.answers.map((answer, answerIndex) => {
                const aIndex = `${qIndex}_answer_${answerIndex}`;
                return (
                  <Grid
                    key={aIndex}
                    data-testid={`quiz-question-${questionIndex}-answer-${answerIndex}`}
                    container
                    spacing={2}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item className={classes.answerTextInput}>
                      <TextField
                        fullWidth
                        name="text"
                        data-testid={`answer-${answerIndex}-text-field`}
                        key={answer.id}
                        value={answer.text}
                        onChange={handleAnswerTextChange(questionIndex, answerIndex)}
                        label={t('Answer')}
                      />
                    </Grid>
                    <Grid item>
                      <Checkbox
                        value
                        name="valid"
                        data-testid={`answer-${answerIndex}-valid-field`}
                        checked={answer.valid}
                        onChange={handleAnswerValidChange(questionIndex, answerIndex)}
                      />
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleRemoveAnswer(questionIndex, answerIndex)}>
                        <Delete color="error" />
                      </IconButton>
                    </Grid>
                  </Grid>
                );
              })}
              <Fab
                size="small"
                className={classes.addAnswer}
                color="secondary"
                aria-label="add"
                data-testid={`add-question-${questionIndex}-answer-button`}
                onClick={handleAddAnswer(questionIndex)}
              >
                <Add />
              </Fab>
            </Box>
          </Box>
        );
      })}
      <Fab
        className={classes.addQuestion}
        color="primary"
        aria-label="add"
        data-testid="quiz-add-question-button"
        onClick={handleAddQuestion}
      >
        <Add />
      </Fab>
      <Divider />
      <Button fullWidth type="submit" color="primary" variant="contained" size="large">
        {t('Save')}
      </Button>
    </form>
  );
}

export default QuizEditor;
