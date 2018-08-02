import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './view/Home'
import Page from './view/Page'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/sometrips' component={Home} />
          <Route path='/sometrips/:id/' component={Page} />
        </Switch>
      </div>
    );
  }
}

export default App;
