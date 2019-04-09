import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import loadImage from 'image-promise';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import logo from '../images/sometrips-white.svg';
import loading from '../images/spinner.svg';
import PropTypes from 'prop-types'
import Modal from 'react-responsive-modal';

import StackGrid, { transitions } from "react-stack-grid";
import Masonry from 'react-masonry-component';

const { scaleDown } = transitions;

const imagesLoadedOptions = { background: '.my-bg-image-el' }

// import mousewheel from 'jquery-mousewheel';
// import {TweenMax} from "gsap/all";
var countingPhotos = 0;

class Page extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    this.state = {
      data: null,
      photos: null,
      id: params.id,
      number: params.number,
      flag: false,
      data: null,
      description: null,
      url: null,
      open: false,
      current: null,
      mobile: false,
      loaded: false,
      done: false
    };
  }

  onOpenModal = (l) => {
    this.setState({ open: true, current: l });
    var img = new Image();
    img.onload = function () {
      console.log("????");
      $('.styles_modal__gNwvD').addClass('show');
    }
    img.src = l;
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  componentDidMount(){
    var $this = this;
    $(document).scrollTop(0);
    document.body.classList.add('ds');
    if($(window).width() <= 590) this.setState({mobile: true});
    function setHeight() {
      if($(window).width() <= 590) $this.setState({mobile: true});
      else $this.setState({mobile: false});
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
    request.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=4fc60f8bc0ad10bf8c16c2be6b8bc2fe&user_id=129588168%40N02&format=json&nojsoncallback=1');
    request.setRequestHeader('Accept','application/json');
    
    var $this = this;
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        var albumData = JSON.parse(this.responseText);
        var photoset_id = albumData.photosets.photoset[$this.state.number-1].id;
        console.log(albumData.photosets);
        $this.setState({url: albumData.photosets.photoset[$this.state.number-1].id,data: albumData.photosets.photoset, date: albumData.photosets.photoset[$this.state.number-1].description._content.split('@')[0], description: albumData.photosets.photoset[$this.state.number-1].description._content.split('@')[1]});

        var request2 = new XMLHttpRequest();
        request2.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=4fc60f8bc0ad10bf8c16c2be6b8bc2fe&photoset_id='+photoset_id+'&user_id=129588168%40N02&format=json&nojsoncallback=1');
        request2.setRequestHeader('Accept','application/json');

        request2.onreadystatechange = function () {
          if (this.readyState === 4) {
            var albumData = JSON.parse(this.responseText);
            $this.setState({photos: albumData.photoset.photo, loaded: true});
            console.log(albumData.photoset);
            console.log($this.state.photos);
            console.log("!");
          }
        }
        request2.send();
      }
    };
    request.send();
  }

  componentDidUpdate(prevProps, prevState) {
    $(document).ready(function(){
        $('.mask').addClass('hide');
        setTimeout(function(){
          $('.mask').removeClass('active');
        }, 800);
    });
  }

  static contextTypes = {
    router: PropTypes.object
  }

  redirectToTarget = () => {
    var $this = this;
    $('.preloader-wrap').fadeIn(300,function(){
      $this.context.router.history.push('/sometrips')
    });
  }

  layoutLoaded = () => {
    document.body.classList.remove('ds');
    $('#loadingPhotos').addClass('dn');
    console.log("done!");
  }

  render() {
    const { open } = this.state;
    let title = "";
    let year = "";
    let place = "";
    if(this.state.data !== null){
      title = this.state.data[this.state.number-1].title._content;
      year = title.split(' Trip ')[1];
      place = title.split(' Trip')[0];
      var data = this.state.data[this.state.number-1]
      console.log(data);
      var cover_url = "https://farm"+data.farm+".staticflickr.com/"+data.server+"/"+data.primary+"_"+data.secret+"_h.jpg";
      var bgStyle = {
        "backgroundImage": "url('"+cover_url+"')",
        "backgroundSize": "cover",
        "backgroundPosition": "center center",
        "top": 0,
        "left": 0,
        "opacity": .75
      }
    }

    function loadData(url) {
      var xhttp = new XMLHttpRequest();
      var orientation = null
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
           var photoData = JSON.parse(xhttp.responseText);
           if(photoData.sizes.size[2].width > photoData.sizes.size[2].height) orientation = "portrait";
           else orientation = "landscape";
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    }

    let photos = [];
    if(this.state.photos !== null) {
      for(var i = 0; i < this.state.photos.length; i++) {
        var data = this.state.photos[i];
        var orientation = loadData('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=a7a564b411d3c9fb8341e8a74c3da9b8&photo_id='+data.id+'&format=json&nojsoncallback=1');
        var link = "https://farm"+data.farm+".staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_n.jpg";
        console.log(data.rotation);
        var temp = this.state.mobile ? (
          <div className={"photo mh1-ns mb2 l0 mobile "+orientation}>
            <img src={link.replace('_n','_z')} width="100%" height="auto" className="cp" onClick={(e) => this.onOpenModal(e.target.src.replace('_n','_z'))}/>
          </div>
        ): (
          <div className={"photo mh1-ns mb2 l0 "+orientation}>
            <img src={link} width="240" height="auto" className="cp" onClick={(e) => this.onOpenModal(e.target.src.replace('_n','_h'))}/>
          </div>
        )
        photos.push(temp);
      }
    }

    var masonryOptions = {
        transitionDuration: '0.2s',
        isFitWidth: this.state.mobile ? false : true
    };

    var stack = (
      <Masonry
          className={'my-gallery-class'} // default ''
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          imagesLoadedOptions={imagesLoadedOptions} // default {}
          onImagesLoaded={this.layoutLoaded}
      >
          {photos}
      </Masonry>
    )

    return (
      <section className="bg-near-black">
        <Helmet>
            <title>{title}</title>
        </Helmet>
        <nav className="pt3 absolute z1 w-100">
          <div className="mw1280 center ph3">
            <div className="flex ph2 aic pn">
              <img className="auto cp" src={logo} width='150' height='150' alt="some trips" onClick={this.redirectToTarget}/>
            </div>
          </div>
        </nav>
        <div className="load fixed bg-black w-100 h-100 z10 pn"></div>
        <div id="page-cover" className="tc flex jcc aic relative">
          <div className="absolute w-100 h-100" style={bgStyle}></div>
          <div className="mw8 center ph3 pv6-l pv4 white z1">
            <div className="cf ph2-ns">
              <h1 className="f-headline-ns f1 lh-solid mv4">{place}</h1>
              <hr className="w2 f3 b--white" />
              <p className="f3 fw5">{year}</p>
              <img id="loadingPhotos" src={loading} width="60"/>
            </div>
          </div>
        </div>
        <div id="page-content" className="bg-white pt4-ns pt2">
          <nav className="pt3 h3">
            <div className="mw1280 center ph3">
              <div className="flex ph2 flex-end aic">
                <div className="flex space-between aic ph2-ns"  onClick={this.redirectToTarget}>
                  <p className="f4 fw5 ph4 cp db-ns dn" id="about">Home</p>
                  <i className="f2 material-icons cp">home</i>
                </div>
              </div>
            </div>
          </nav>
          <div className="mw1280 center pl5-l ph3 pt4-ns pt2">
            <div className="cf ph2-ns">
              <div className="fl w-100 w-third-l ph3 ph0-ns">
                <h2 className="fw7">{title}</h2>
                <h3 className="fw5 muted">{this.state.date}</h3>
                <hr className="o-10 mv4"/>
                <p className="lh-copy dark">
                  {this.state.description}
                </p>
                <div className="flex mv4">
                  <a href={"https://www.flickr.com/photos/youwenliang/sets/"+this.state.url} target="_blank">
                  <div className="button flex jcc aic mh2 cp" id="link">
                    <i className="material-icons flip">link</i>
                  </div>
                  </a>
                  <div className="button flex jcc aic mh2 cp" id="share">
                    <i className="material-icons">share</i>
                  </div>
                </div>
              </div>
              <div className="fl w-100 w-two-thirds-l pv3-ns pv0 bg-near-white ph0 overflow-hidden">
                <div className="photoList pb6">
                  {stack}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal open={open} onClose={this.onCloseModal} center>
          <img src={this.state.current}/>
        </Modal>
      </section>
    );
  }
}

export default Page;
