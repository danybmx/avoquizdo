import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CenterContainer from './CenterContainer';
import Title from './Title';
import Button from './Button';
import Player from './Player';
import { question as questionAnimation } from '../utils/animations';

const GameQuestionStyledComponent = styled(CenterContainer)`
  animation: ${questionAnimation} 0.3s ease-in-out;
`;

function GameQuestion({
  question, answers, answered, players, handleNext, handleAnswer, host,
}) {
  return (
    <GameQuestionStyledComponent fullHeight>
      <Title>{question}</Title>
      { host ? (
        <div>
          <CenterContainer>
            {answers.map((p) => (
              <Player key={p}>{p}</Player>
            ))}
          </CenterContainer>
          <CenterContainer style={{ marginTop: 40 }}>
            <strong>{answered} / {players} han contestado</strong>
          </CenterContainer>
          <Button style={{ marginTop: 40 }} onClick={handleNext}>Siguiente!</Button>
        </div>
      ) : answers.map((p, i) => (
        <Button style={{ marginBottom: 10 }} key={p} onClick={handleAnswer(i)}>{p}</Button>
      ))}

    </GameQuestionStyledComponent>
  );
}
GameQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(String).isRequired,
  answered: PropTypes.number.isRequired,
  players: PropTypes.number.isRequired,
  host: PropTypes.bool,
  handleNext: PropTypes.func,
  handleAnswer: PropTypes.func,
};
GameQuestion.defaultProps = {
  host: false,
  handleNext: () => {},
  handleAnswer: () => {},
};

export default GameQuestion;
