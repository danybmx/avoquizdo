import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import GamePlayView from '../components/GamePlayView';
import Loader from '../components/Loader';
import GameService from '../services/GameService';

function GamePlay() {
  const { pin, nickname } = useParams();
  const gameService = useRef();
  const [game, setGame] = useState(null);

  useEffect(() => {
    gameService.current = new GameService();
    gameService.current.join(pin, nickname);
    gameService.current.getGame().subscribe((g) => {
      setGame(g);
    });
  }, [pin, nickname, gameService]);

  function handleAnswer(answer) {
    return () => {
      gameService.current.fire('answer', answer);
    };
  }

  return (
    game ? (
      <GamePlayView
        game={game}
        handleAnswer={handleAnswer}
      />
    ) : <Loader />
  );
}

export default GamePlay;
