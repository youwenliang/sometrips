import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Page extends Component {
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
        {this.state.id}
        <Link to='/sometrips/'>home</Link>
      </section>
    );
  }
}

export default Page;
