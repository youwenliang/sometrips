import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import loadImage from 'image-promise';
import $ from 'jquery';
// import mousewheel from 'jquery-mousewheel';
// import {TweenMax} from "gsap/all";


class Page extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    this.state = {
      id: params.id
    };
  }

  componentDidMount(){
    var images  = [];
    loadImage(images)
    .then(function (allImgs) {
      console.log(allImgs.length, 'images loaded!', allImgs);
      setTimeout(function(){
        
      },600);
    })
    .catch(function (err) {
      console.error('One or more images have failed to load :(');
      console.error(err.errored);
      console.info('But these loaded fine:');
      console.info(err.loaded);
    });
  }
  render() {
    return (
      <section className="bg-near-white pv6-l pv4">
        <div className="mw8 center ph3">
          <div className="cf ph2-ns">
            <p>Page</p>
          </div>
        </div>
      </section>
    );
  }
}

export default Page;
