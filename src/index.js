import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { render } from 'react-snapshot';
import { BrowserRouter } from "react-browser-router";
import registerServiceWorker from './registerServiceWorker';

render((
<BrowserRouter basename="sometrips">
	<App />
</BrowserRouter>), 
document.getElementById('root'));
registerServiceWorker();