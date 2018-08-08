import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import loadImage from 'image-promise';
import { Link } from 'react-router-dom';
import mousewheel from 'jquery-mousewheel'; // eslint-disable-line no-unused-vars
import dragscroll from 'dragscroll'; // eslint-disable-line no-unused-vars

class About extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
   
  }
  render() {
    let display = "";
    if(!this.props.display) display = " dn";
    return (
      <section id="about" className={"min-vh-100 absolute top-left w-100 z1" + display}>
        <nav className="pt3">
          <div className="mw1280 center ph3">
            <div className="flex ph2-ns flex-end aic">
              <div className="flex space-between aic ph2-ns h-150" onClick={this.props.handler}>
                <p className="f4 fw5 ph4 cp db-ns dn">Close</p>
                <i className="f2 material-icons cp">close</i>
              </div>
            </div>
          </div>
        </nav>
        <div id="about-content" className="relative">
          <div className="flex aic mw8 center ph5-ns ph3 absolute h-100 w-100 absolute-center z1">
            <div className="cf ph2-ns">
              <div className="fl w-100 w-50-l ph2">
                <h2 className="fw7 f2 mt0">About Sometrips</h2>
                <p className="lh-copy dark">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolor </p>
                <div className="flex mv4">
                  <div className="button flex jcc aic mh2 cp" id="link">
                    <i className="material-icons flip">link</i>
                  </div>
                  <div className="button flex jcc aic mh2 cp" id="share">
                    <i className="material-icons">share</i>
                  </div>
                </div>
              </div>
              <div className="fl w-100 w-50-l ph2 pl6-l">
                <div className="flex aic">
                  <figure className="h3 w3 bg-light-gray ma0 mr3 br-100"></figure>
                  <div>
                    <p className="fw7 dark f5 mt0 mb2">Mark Liang</p>
                    <p className="fw5 muted f6 ma0">UX Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default About;
