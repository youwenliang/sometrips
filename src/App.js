import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import Main from './Main'

class App extends Component {
  componentDidMount(){
  	var width = 100,
    perfData = window.performance.timing, // The PerformanceTiming interface represents timing-related performance information for the given page.
    EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
    time = parseInt((EstimatedTime/1000)%60)*100;
    document.body.classList.add('ds');

	$(".loadbar").animate({
	  width: width + "%"
	}, time);

	setTimeout(function(){
	  $('.preloader-wrap').fadeOut(300);
    document.body.classList.remove('ds');
	}, time);
  }
  render() {
    return (
      <div className="App">
      	<div className="preloader-wrap">
		  <div className="loader"><div className="trackbar"><div className="loadbar"></div></div></div>
		  <div id="logo"></div>
		  </div>
        <Main/>
      </div>
    );
  }
}

export default App;
