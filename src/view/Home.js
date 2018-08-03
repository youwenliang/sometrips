import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import loadImage from 'image-promise';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  componentDidMount(){
    $(document).scrollTop(0);
    function setHeight() {
      var windowHeight = $(window).height(),
        $block = $('#cover');
        if(windowHeight > 550) { // 550px is your css min-height for this block
          $block.css('min-height', windowHeight + 'px') 
        } else {
          $block.css('min-height': '') 
        }
    }
    setHeight();
    $(window).on('resize orientationchange', setHeight);

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
    request.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=85835727dcc382e27ffa1b1a406f9360&user_id=129588168%40N02&format=json&nojsoncallback=1&api_sig=26ecaa59783b3a68d2ce302a3b7b9389');
    request.setRequestHeader('Accept','application/json');

    var $this = this;

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        var albumData = JSON.parse(this.responseText);
        $this.setState({data: albumData.photosets.photoset});
        console.log($this.state.data);
      }
    };
    request.send();
  }

  albumList = () => {
    if(this.state.data !== null ) {
    return (<ul className="list pa0 ph2-ns">{this.state.data.map((a, i) => { 
      var place = a.title._content.split(' Trip')[0];
      var url = place.replace(/\s+/, "").toLowerCase();
      return (
        <li className="dib pa2 ma2 bg-white cp ph4 tc" key={i}>
          <Link to={"/sometrips/"+url}>{place}</Link>
        </li>
      );
    })}</ul>)
    }
  }

  render() {
    return (
      <section id="cover" className="min-vh-100 bg-light-gray">
        <Helmet>
            <title>Some Trips</title>
        </Helmet>
        <nav className="bg-white pv3">
          <div className="mw8 center ph3">
            <div className="cf ph2-ns">
              <p>Sometrips</p>
            </div>
          </div>
        </nav>
        {this.albumList()}
      </section>
    );
  }
}

export default Home;
