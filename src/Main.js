import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './view/Home'
import Page from './view/Page'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  componentDidMount() {
    
  }
  render() {
    return (
      <main>
        <Switch>
          <Route path='/sometrips/:number/:id/' component={Page} />
          <Route exact path='/sometrips' component={Home} />
        </Switch>
      </main>
    );
  }
}

export default Main;
