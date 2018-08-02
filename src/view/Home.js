import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    this.state = {
      id: params.id
    };
  }

  componentDidMount(){
    
  }
  render() {
    return (
      <section>
        home
        <Link to='/sometrips/trip1/'>trip1</Link>
      </section>
    );
  }
}

export default Home;
