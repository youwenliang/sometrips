import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './view/Home';
import Page from './view/Page';
import './App.css';
import $ from 'jquery';
import loadImage from 'image-promise';

class App extends Component {
  constructor(props) {
    super(props);
    
  }
  componentDidMount() {
    var images  = [];
    loadImage(images)
    .then(function (allImgs) {
      console.log(allImgs.length, 'images loaded!', allImgs);
      setTimeout(function(){
        var width = 100,
            perfData = window.performance.timing, // The PerformanceTiming interface represents timing-related performance information for the given page.
            EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
            time = parseInt((EstimatedTime/1000)%60)*100;

        $('.loadbar').animate({
          width: width + "%"
        }, time+600);

        setTimeout(function(){
          $('.preloader-wrap').addClass('fade');
        }, time+600);
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
      <div className="App">
        <div className="preloader-wrap">
          <div className="loader">
            <div className="trackbar">
              <div className="loadbar"></div>
            </div>
          </div>
          <div id="logo"></div>
        </div>
        <main>
          <Switch>
            <Route exact path='/sometrips' component={Home} />
            <Route path='/sometrips/:id/' component={Page} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
