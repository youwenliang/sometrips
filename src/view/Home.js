import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import loadImage from 'image-promise';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      current: "01"
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
    request.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=b5915b4e4a36d456caa767bdb9003cbc&user_id=129588168%40N02&format=json&nojsoncallback=1');
    request.setRequestHeader('Accept','application/json');

    var $this = this;

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        var albumData = JSON.parse(this.responseText);
        $this.setState({data: albumData.photosets.photoset});
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
          <Link to={{pathname:"/sometrips/"+(i+1)+"/"+url}}>{place}</Link>
        </li>
      );
    })}</ul>)
    }
  }

  render() {
    let total = 0;
    if(this.state.data !== null) {
      total = this.state.data.length;
    }
    return (
      <section id="cover" className="min-vh-100">
        <Helmet>
            <title>Some Trips</title>
        </Helmet>
        <nav className="pt3">
          <div className="mw1280 center ph3">
            <div className="flex ph2-ns space-between aic">
              <img src='/images/sometrips.svg' width='150' height='150' alt="some trips" />
              <div className="flex space-between aic ph2-ns">
                <p className="f4 fw5 ph4 cp" id="about">About</p>
                <i className="f2 material-icons db-ns dn cp">notes</i>
              </div>
            </div>
          </div>
        </nav>
        <div id="album" className="bg-light-gray">
         {this.albumList()}
        </div>
        <div className="mw8 center ph3 flex aic space-between pv4">
          <div className="ph3 db-ns dn">
            <p className="mv2 f5 fw7 dark">Discover the world</p>
            <p className="mv2 f6 fw5 muted">Scroll for more trips</p>
          </div>
          <div className="ph3 f3 fw7">
            <span id="number">{this.state.current}</span>
            <hr className="relative top5 w3 b--black mh3 dib"/>
            <span id="total">{total}</span>
          </div>
        </div>
      </section>
    );
  }
}

export default Home;
