import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import loadImage from 'image-promise';
import { Link } from 'react-router-dom';
import mousewheel from 'jquery-mousewheel'; // eslint-disable-line no-unused-vars
import dragscroll from 'dragscroll'; // eslint-disable-line no-unused-vars
import About from './About';
import Swiper from 'swiper';
import logo from '../images/sometrips.svg';
import PropTypes from 'prop-types'

var mySwiper = null;
var total_num = 0;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      current: 1,
      about: false
    };
    this.handler = this.handler.bind(this)
  }
  componentDidMount(){
    document.body.classList.add('ds');
    mySwiper = null;
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

    var $this = this;
    $('#prev').click(function(){
      mySwiper.slidePrev();
      var i = mySwiper.activeIndex%total_num + 1;
      $this.setState({current: i});
    })
    $('#next').click(function(){
      mySwiper.slideNext();
      var i = mySwiper.activeIndex%total_num + 1;
      $this.setState({current: i});
    })
    
    var images  = [];
    loadImage(images)
    .then(function (allImgs) {
      console.log(allImgs.length, 'images loaded!', allImgs);
      setTimeout(function(){
        
        // $(window).mousewheel(function(event) {
        //   if(!flag) {
        //       if (event.originalEvent.wheelDelta >= 0) {
        //           mySwiper.slidePrev();
        //           var i = mySwiper.activeIndex;
        //           if(i === 0) i = $this.state.data.length;
        //           if(i === $this.state.data.length + 1) i = 1;
        //           $this.setState({current: i});
        //           flag = true;
        //       }
        //       else {
        //           mySwiper.slideNext();
        //           var i = mySwiper.activeIndex;
        //           if(i === 0) i = $this.state.data.length;
        //           if(i === $this.state.data.length + 1) i = 1;
        //           $this.setState({current: i});
        //           flag = true;
        //       }
        //   }
        //   clearTimeout($.data(this, 'timer'));
        //     $.data(this, 'timer', setTimeout(function() {
        //        flag = false;
        //   }, 50));
        // });
        
      },0);
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

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        var albumData = JSON.parse(this.responseText);
        $this.setState({data: albumData.photosets.photoset});
        total_num = $this.state.data.length;
      }
    };
    request.send();
  }

  componentDidUpdate(prevProps, prevState) {
    $('.mask').removeClass('hide');
    $(document).ready(function(){
        var left;
        if($(window).width() >= 480) {
          left = 'calc(50vw - 200px)'
        } else {
          left = 0;
        }
        $(window).resize(function(){
          if($(window).width() >= 480) {
            left = 'calc(50vw - 200px)'
          } else {
            left = 0;
          }
          $('.mask').css({
            'width': $('.swiper-slide-active .absolute').width(),
            'height': $('.swiper-slide-active .absolute').height(),
            'top': '166px',
            'left': left
          });
        })
        document.body.classList.remove('ds');
        if($('.swiper-container').length !== 0) {
            if(mySwiper === null) {
                mySwiper = new Swiper('.swiper-container', {
                speed: 400,
                spaceBetween: 50,
                slidesPerView: 'auto',
                loop: true,
                simulateTouch: false,
                navigation: {
                  nextEl: '#next',
                  prevEl: '#prev',
                }
              });
            }
            $('.mask').css({
              'background-image': $('.swiper-slide-active .absolute').css('background-image'),
              'width': $('.swiper-slide-active .absolute').width(),
              'height': $('.swiper-slide-active .absolute').height(),
              'top': '166px',
              'left': left
            });
          }
        });
  }

  static contextTypes = {
    router: PropTypes.object
  }

  redirectToTarget = (e,a) => {
    var p = $(e.target.parentElement);
    var $this = this;
    if(p.hasClass('swiper-slide-active')) {
      $('.mask').addClass('active');
      setTimeout(function(){
        $this.context.router.history.push(a)
      },800);
    } else {
      mySwiper.slideNext();
      var i = mySwiper.activeIndex%total_num + 1;
      $this.setState({current: i});
    }
  }

  albumList = () => {
    if(this.state.data !== null ) {
      return (<div className="swiper-container h-100 z2 photosets"><div className="swiper-wrapper h-100">{this.state.data.map((a, i) => { 
        var place = a.title._content.split(' Trip')[0];
        var url = place.replace(/\s+/, "").toLowerCase();
        var data = this.state.data[i];
        var cover_url = "https://farm"+data.farm+".staticflickr.com/"+data.server+"/"+data.primary+"_"+data.secret+"_h.jpg";
        var bgStyle = {
          "backgroundImage": "url('"+cover_url+"')",
          "backgroundSize": "cover",
          "backgroundPosition": "center center",
          "top": 0,
          "left": 0,
          "opacity": .75
        }
        var link = '/sometrips/'+(i+1)+"/"+url+'/';

        if(i === 0) {
          var img = new Image();
          img.onload = function () {
            setTimeout(function(){
              $('.preloader-wrap').fadeOut(300);
            }, 700);
          }
          img.src = cover_url;
        }
        return (
          <div className="swiper-slide w-70-ns w-100 cp" key={i}>
            <div className="absolute w-100 h-100" style={bgStyle} onClick={(e) => this.redirectToTarget(e,link)}></div>
            <div className="flex aic w-100 h-100 jcc relative z1 white f1 pn o-0">{place}</div>
          </div>
        );
      })}</div></div>)
    }
  }

  handler(e) {
    e.preventDefault()
    this.setState({about: false});
  }

  openAbout = () => {
    this.setState({about: true});
  }

  render() {
    let total = 0;
    let year = 0;
    let place = "";
    if(this.state.data !== null) {
      total = this.state.data.length;
      year = this.state.data[this.state.current-1].title._content.split(' Trip ')[1];
      place = this.state.data[this.state.current-1].title._content.split(' Trip ')[0];
    }
    return (
      <section id="cover" className="min-vh-100">
        <Helmet>
            <title>Some Trips</title>
        </Helmet>
        <nav className="pt3">
          <div className="mw1280 center ph3">
            <div className="flex ph2-ns space-between aic">
              <img src={logo} width='150' height='150' alt="some trips" />
              <div className="flex space-between aic ph2-ns">
                <p className="f4 fw5 ph4 cp" onClick={this.openAbout.bind(this)}>About</p>
              </div>
            </div>
          </div>
        </nav>
        <div id="album" className="relative bg-white">
          <div className="flex aic mw8 center ph5-ns ph3 absolute h-100 w-100 absolute-center z4 pn">
            <div className="pn">
              <div className="flex ph2"><span className="f3 fw5">{year}</span><hr className="relative top5 w3 b--black mh3 dib"/></div>
              <Link to={"/sometrips/"+(this.state.current)+"/"+place.toLowerCase()+'/'}>
                <h1 className="f-headline-ns f1 lh-solid auto">{place}</h1>
              </Link>
              <div className="flex auto">
                <div className="button flex jcc aic mh2 cp z4" id="prev">
                  <i className="material-icons flip">arrow_right_alt</i>
                </div>
                <div className="button bg-white flex jcc aic mh2 cp z4" id="prev">
                  <i className="material-icons">apps</i>
                </div>
                <div className="button flex jcc aic mh2 cp z4" id="next">
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
        <About display={this.state.about} handler={this.handler}/>
      </section>
    );
  }
}

export default Home;


