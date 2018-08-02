import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { render } from 'react-snapshot';
import { BrowserRouter } from "react-browser-router";
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';

render((
<BrowserRouter basename="sometrips">
    <App />
</BrowserRouter>), 
document.getElementById('root'));
registerServiceWorker();