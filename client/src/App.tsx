import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import 'halfmoon/css/halfmoon-variables.min.css';

import Nav from './components/Nav';
import NavButtons from './components/NavButtons';
import SessionsByCinema from './pages/SessionsByCinema';
import SessionsByDate from './pages/SessionsByDate';
import SessionsByMovie from './pages/SessionsByMovie';


const App = () => {
  return (
    <div className="page-wrapper with-navbar">
      <Router>
        <Nav />
        <div className="content-wrapper">
          <NavButtons />
          <Switch>
            <Route exact path="/">
              <SessionsByDate />
            </Route>

            <Route exact path="/date">
              <SessionsByDate />
            </Route>

            <Route exact path="/movie">
              <SessionsByMovie />
            </Route>

            <Route exact path="/cinema">
              <SessionsByCinema />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
