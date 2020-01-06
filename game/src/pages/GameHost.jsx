import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import GameHostView from '../components/GameHostView';
import Loader from '../components/Loader';
import GameService from '../services/GameService';

function GameHost() {
  const { quiz } = useParams();
  const gameService = useRef();
  const [game, setGame] = useState(null);

  useEffect(() => {
    gameService.current = new GameService();
    gameService.current.create(quiz);
    gameService.current.getGame().subscribe((g) => {
      setGame({ ...g });
    });
  }, [quiz, gameService]);

  function handleStart() {
    gameService.current.fire('start');
  }

  function handleNext() {
    gameService.current.fire('nextRound');
  }

  return (
    game ? (
      <GameHostView
        game={game}
        handleStart={handleStart}
        handleNext={handleNext}
      />
    ) : <Loader />
  );
}

export default GameHost;
