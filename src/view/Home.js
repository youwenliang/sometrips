import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import loadImage from 'image-promise';
import { Link } from 'react-router-dom';
import mousewheel from 'jquery-mousewheel'; // eslint-disable-line no-unused-vars
import dragscroll from 'dragscroll'; // eslint-disable-line no-unused-vars

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      current: 17
    };
  }
  componentDidMount(){
    $(document).scrollTop(0);
    $('.photosets').scrollLeft(0);

    // Horizontal Scroll
    $('.photosets').mousewheel(function(event, change) {
      this.scrollLeft -= (change * 1); //need a value to speed up the change
      event.preventDefault();
    });

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
        console.log($this.state.data);
      }
    };
    request.send();
  }

  albumList = () => {
    if(this.state.data !== null ) {
      return (<ul className="photosets list ph0 pv3 mv0 nowrap overflow-x-scroll h-100">{this.state.data.map((a, i) => { 
        var place = a.title._content.split(' Trip')[0];
        var url = place.replace(/\s+/, "").toLowerCase();
        var data = this.state.data[i];
        var cover_url = "https://farm"+data.farm+".staticflickr.com/"+data.server+"/"+data.primary+"_"+data.secret+"_h.jpg";
        var bgStyle = {
          "backgroundImage": "url('"+cover_url+"')",
          "backgroundSize": "cover",
          "top": 0,
          "left": 0,
          "opacity": .75
        }
        return (
          <li className="photoset dib pa2 mh2 bg-white cp ph4 tc h-100 w-75 relative" key={i}>
            <Link to={{pathname:"/sometrips/"+(i+1)+"/"+url}}>
              <div className="absolute w-100 h-100" style={bgStyle}></div>
            </Link>
            <div className="flex aic w-100 h-100 jcc relative z1 white f1 pn o-0">{place}</div>
          </li>
        );
      })}</ul>)
    }
  }

  render() {
    let total = 0;
    let year = 0;
    let place = "";
    if(this.state.data !== null) {
      total = this.state.data.length;
      year = this.state.data[this.state.current-1].title._content.split('Trip ')[1];
      place = this.state.data[this.state.current-1].title._content.split('Trip ')[0];
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
        <div id="album" className="relative">
          <div className="flex aic mw8 center ph5-ns ph3 absolute h-100 w-100 absolute-center z1">
            <div>
              <div className="flex ph2"><span className="f3 fw5">{year}</span><hr className="relative top5 w3 b--black mh3 dib"/></div>
              <h1 className="f-headline lh-solid">{place}</h1>
              <div className="flex">
                <div className="button flex jcc aic mh2 cp" id="prev">
                  <i className="material-icons flip">arrow_right_alt</i>
                </div>
                <div className="button flex jcc aic mh2 cp" id="next">
                  <i className="material-icons">arrow_right_alt</i>
                </div>
              </div>
            </div>
          </div>
         {this.albumList()}
        </div>
        <div className="mw8 center ph5-ns ph3 flex aic space-between pv4">
          <div className="ph3 db-ns dn">
            <p className="mv2 f5 fw7 dark">Discover the world</p>
            <p className="mv2 f6 fw5 muted">Scroll for more trips</p>
          </div>
          <div className="ph3 f3 fw7">
            <span id="number">{('0'+this.state.current).slice(-2)}</span>
            <hr className="relative top5 w3 b--black mh3 dib"/>
            <span id="total">{total}</span>
          </div>
        </div>
      </section>
    );
  }
}

export default Home;
