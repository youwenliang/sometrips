import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import loadImage from 'image-promise';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import logo from '../images/sometrips-white.svg';
import PropTypes from 'prop-types'
import StackGrid from "react-stack-grid";
import Modal from 'react-responsive-modal';
// import mousewheel from 'jquery-mousewheel';
// import {TweenMax} from "gsap/all";


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
      current: null
    };
  }

  onOpenModal = (l) => {
    this.setState({ open: true, current: l });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

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
            $this.setState({photos: albumData.photoset.photo});
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
          document.body.classList.remove('ds');
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

    let photos = [];
    if(this.state.photos !== null) {
      for(var i = 0; i < this.state.photos.length; i++) {
        var data = this.state.photos[i];
        var link = "https://farm"+data.farm+".staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_n.jpg";
        var temp = (
          <img src={link} width="150" height="auto" className="cp" onClick={(e) => this.onOpenModal(e.target.src.replace('_n','_h'))}/>
        )
        photos.push(temp);
      }
    }

    return (
      <section className="bg-near-black">
        <Helmet>
            <title>{title}</title>
        </Helmet>
        <nav className="pt3 absolute z1 w-100">
          <div className="mw1280 center ph3">
            <div className="flex ph2-ns aic pn">
              <img className="auto cp" src={logo} width='150' height='150' alt="some trips" onClick={this.redirectToTarget}/>
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
                <div className="flex space-between aic ph2-ns"  onClick={this.redirectToTarget}>
                  <p className="f4 fw5 ph4 cp db-ns dn" id="about">Home</p>
                  <i className="f2 material-icons cp">home</i>
                </div>
              </div>
            </div>
          </nav>
          <div className="mw1280 center pl5-l ph3 pt4">
            <div className="cf ph2-ns">
              <div className="fl w-100 w-third-l">
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
              <div className="fl w-100 w-two-thirds-l pt3 pl5-l ph0 overflow-hidden">
                <div className="photoList pb6">
                  <StackGrid
                    columnWidth={160}
                    monitorImagesLoaded={true}
                  >
                    {photos}
                  </StackGrid>
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
