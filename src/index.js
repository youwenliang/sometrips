import React from 'react';
import { render } from 'react-snapshot';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-browser-router";
import registerServiceWorker from './registerServiceWorker';
// import $ from 'jquery';
// import {TweenMax} from "gsap/all";
import ScrollMagic from 'scrollmagic'; // eslint-disable-line no-unused-vars

render((
<BrowserRouter basename="ourisland">
	<App />
</BrowserRouter>), 
document.getElementById('root'));
registerServiceWorker();

