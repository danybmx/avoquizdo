import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GameSelect from './pages/GameSelect';
import GameHost from './pages/GameHost';
import GamePlay from './pages/GamePlay';
import AppContainer from './components/AppContainer';

function App() {
  return (
    <AppContainer>
      <Router>
        <Switch>
          <Route path="/host/:quiz">
            <GameHost />
          </Route>
          <Route path="/play/:pin/:nickname">
            <GamePlay />
          </Route>
          <Route path="/play/:pin">
            <GameSelect join />
          </Route>
          <Route exact path="/">
            <GameSelect />
          </Route>
        </Switch>
      </Router>
    </AppContainer>
  );
}

export default App;
