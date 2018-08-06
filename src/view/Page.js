import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import loadImage from 'image-promise';
import { Link } from 'react-router-dom';
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

    function setHeight() {
      var windowHeight = $(window).height(),
        $block = $('#page-cover');
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
  render() {
    let title = "";
    let year = "";
    let place = "";
    if(this.state.data !== null){
      title = this.state.data[this.state.number-1].title._content;
      year = title.split(' Trip ')[1];
      place = title.split(' Trip')[0];
      var data = this.state.data[this.state.number-1]
      var cover_url = "https://farm"+data.farm+".staticflickr.com/"+data.server+"/"+data.primary+"_"+data.secret+"_h.jpg";
      var bgStyle = {
        "backgroundImage": "url('"+cover_url+"')",
        "backgroundSize": "cover",
        "top": 0,
        "left": 0,
        "opacity": .75
      }
    }
    return (
      <section className="bg-near-black">
        <div id="page-cover" className="tc flex jcc aic relative">
          <div className="absolute w-100 h-100" style={bgStyle}></div>
          <div className="mw8 center ph3 pv6-l pv4 white z1">
            <div className="cf ph2-ns">
              <h1 className="f-headline lh-solid mv4">{place}</h1>
              <hr className="w2 f3 b--white" />
              <p className="f3 fw5">{year}</p>
            </div>
          </div>
        </div>
        <div id="page-content" className="bg-white pv4">
          <nav className="pt3">
            <div className="mw1280 center ph3">
              <div className="flex ph2-ns flex-end aic">
                <Link to="/sometrips">
                <div className="flex space-between aic ph2-ns">
                  <p className="f4 fw5 ph4 cp db-ns dn" id="about">Home</p>
                  <i className="f2 material-icons cp">home</i>
                </div>
                </Link>
              </div>
            </div>
          </nav>
          <div className="mw8 center ph3 pv4">
            <div className="cf ph2-ns">
              <h2>{title}</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Page;
