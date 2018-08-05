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
      data: null,
      id: params.id,
      number: params.number,
      flag: false
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

    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=b5915b4e4a36d456caa767bdb9003cbc&user_id=129588168%40N02&format=json&nojsoncallback=1');
    request.setRequestHeader('Accept','application/json');
    
    var $this = this;
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        var albumData = JSON.parse(this.responseText);
        $this.setState({data: albumData});
      }
    };
    request.send();
  }
  render() {
    let title = null;
    if(this.state.data !== null){
      title = this.state.data.photosets.photoset[this.state.number-1].title._content;
    }
    return (
      <section className="bg-near-white pv6-l pv4">
        <div className="mw8 center ph3">
          <div className="cf ph2-ns">
            <p>{title}</p>
          </div>
        </div>
      </section>
    );
  }
}

export default Page;
