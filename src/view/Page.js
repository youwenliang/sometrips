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
    $(document).scrollTop(0);
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
        <nav className="pt3 absolute z1 w-100">
          <div className="mw1280 center ph3">
            <div className="flex ph2-ns aic">
              <img src='/images/sometrips-white.svg' width='150' height='150' alt="some trips" />
            </div>
          </div>
        </nav>
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
        <div id="page-content" className="bg-white pt4">
          <nav className="pt3 h3">
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
          <div className="mw1280 center pl5-l ph3 pt4">
            <div className="cf ph2-ns">
              <div className="fl w-100 w-third-l">
                <h2 className="fw7">{title}</h2>
                <h3 className="fw5 muted">2015.04.15 - 04.24</h3>
                <hr className="o-10 mv4"/>
                <p className="lh-copy dark">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolor
                </p>
                <div className="flex mv4">
                  <div className="button flex jcc aic mh2 cp" id="link">
                    <i className="material-icons flip">link</i>
                  </div>
                  <div className="button flex jcc aic mh2 cp" id="share">
                    <i className="material-icons">share</i>
                  </div>
                </div>
              </div>
              <div className="fl w-100 w-two-thirds-l pt3 pl5-l ph0">
                <div className="photoList bg-near-white w-100 pb6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Page;
