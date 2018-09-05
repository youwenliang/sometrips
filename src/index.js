import React from 'react';
import { BrowserRouter } from "react-browser-router";
import { render } from 'react-snapshot';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';
// import {TweenMax} from "gsap/all";
import ScrollMagic from 'scrollmagic'; // eslint-disable-line no-unused-vars

render((
<BrowserRouter basename="sometrips">
	<App />
</BrowserRouter>), 
document.getElementById('root'));
registerServiceWorker();