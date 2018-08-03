import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './view/Home'
import Page from './view/Page'

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/sometrips' component={Home} />
          <Route path='/sometrips/:id/' component={Page} />
        </Switch>
      </main>
    );
  }
}

export default Main;
