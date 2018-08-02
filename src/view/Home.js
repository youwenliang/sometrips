import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import ColorThief from 'color-thief';

class Home extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    this.state = {
      id: params.id
    };
  }

  componentDidMount(){
    

$(document).ready(function(){
  var sourceImage = new Image();
  sourceImage.crossOrigin = "Anonymous";
  var src = $('.demo-img').css('background-image').split('(')[1].split(')')[0];
  sourceImage.src = src;
  sourceImage.onload = function(){
    var colorThief = new ColorThief();
    var color = colorThief.getColor(sourceImage);
    var rgb = "rgb("+color[0]+","+color[1]+","+color[2]+")";
    $('.color-overlay, .circle-overlay, body').css('background', rgb);
  };
});

(function() {
    // Init
    var container = document.getElementById("container"),
        inner = document.getElementById("inner");

    // Mouse
    var mouse = {
        _x: 0,
        _y: 0,
        x: 0,
        y: 0,
        updatePosition: function(event) {
            var e = event || window.event;
            this.x = e.clientX - this._x;
            this.y = (e.clientY - this._y) * -1;
        },
        setOrigin: function(e) {
            this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
            this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
        },
        show: function() {
            return "(" + this.x + ", " + this.y + ")";
        }
    };

    // Track the mouse position relative to the center of the container.
    mouse.setOrigin(container);

    //----------------------------------------------------

    var counter = 0;
    var refreshRate = 10;
    var isTimeToUpdate = function() {
        return counter++ % refreshRate === 0;
    };

    //----------------------------------------------------

    var onMouseEnterHandler = function(event) {
        update(event);
    };

    var onMouseLeaveHandler = function() {
        inner.style = "";
    };

    var onMouseMoveHandler = function(event) {
        if (isTimeToUpdate()) {
            update(event);
        }
    };

    //----------------------------------------------------

    var update = function(event) {
        mouse.updatePosition(event);
        updateTransformStyle(
            (mouse.y / inner.offsetHeight / 5).toFixed(2),
            (mouse.x / inner.offsetWidth / 5).toFixed(2)
        );
    };

    var updateTransformStyle = function(x, y) {
        var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
        if (!inner.classList.contains('expand')) {
            inner.style.transform = style;
            inner.style.webkitTransform = style;
            inner.style.mozTranform = style;
            inner.style.msTransform = style;
            inner.style.oTransform = style;
        }
    };

    //--------------------------------------------------------

    container.onmousemove = onMouseMoveHandler;
    container.onmouseleave = onMouseLeaveHandler;
    container.onmouseenter = onMouseEnterHandler;

    $('#inner').click(function() {
        $(this).toggleClass("expand");
        inner.style = "";
    });
    })();
  }
  render() {
    return (
      <section>
        <div id="container">
          <div id="inner">
            <div className="color-overlay"></div>
            <div className="demo-img"></div>
          </div>
        </div>
        <Link to='/sometrips/trip1/'>trip1</Link>
      </section>
    );
  }
}

export default Home;
