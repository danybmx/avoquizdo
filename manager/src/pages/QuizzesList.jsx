import React, { useEffect, useState } from 'react';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Add from '@material-ui/icons/Add';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Table,
  TableBody,
  IconButton,
  Fab,
  makeStyles,
} from '@material-ui/core';

import { GAME_URL } from '../env';
import { deleteQuiz, getQuizzes } from '../service/quizService';
import ErrorComponent from '../components/ErrorComponent';
import { makeCancelable } from '../utils/promises';

const useStyles = makeStyles({
  addQuiz: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
});

function QuizzesList() {
  const classes = useStyles();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    const cancelablePromise = makeCancelable(getQuizzes());
    cancelablePromise.promise.then(setQuizzes).catch(setError);

    return () => {
      cancelablePromise.cancel();
    };
  }, []);

  function handleDeleteQuiz(quizId) {
    deleteQuiz(quizId).then(() => {
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    }).catch(setError);
  }

  function handlePlayQuiz(quizId) {
    window.location.assign(`${GAME_URL}/host/${quizId}`);
  }

  function handleCreateQuiz() {
    history.push('/create');
  }

  if (error) {
    return (<ErrorComponent title={error} />);
  }

  return (
    <div data-testid="quizzes-list-component">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {t('Quiz name')}
              </TableCell>
              <TableCell width="100" align="center">
                {t('Played times')}
              </TableCell>
              <TableCell width="100" align="center">
                {t('Questions')}
              </TableCell>
              <TableCell width="150" align="right">
                {t('Options')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((row) => (
              <TableRow data-testid="quizzes-list-item" key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell align="center">{row.played_times}</TableCell>
                <TableCell align="center">{row.questions.length}</TableCell>
                <TableCell align="right">
                  <IconButton data-testid="play-quiz-button" onClick={() => handlePlayQuiz(row._id)}>
                    <PlayArrow />
                  </IconButton>
                  <IconButton data-testid="edit-quiz-button" component={Link} to={`/edit/${row._id}`}>
                    <Edit />
                  </IconButton>
                  <IconButton data-testid="delete-quiz-button" onClick={() => handleDeleteQuiz(row._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        className={classes.addQuiz}
        color="primary"
        aria-label="add"
        data-testid="add-button"
        onClick={() => handleCreateQuiz()}
      >
        <Add />
      </Fab>
    </div>
  );
}

export default QuizzesList;
