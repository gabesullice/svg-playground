(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Library = function () {
  function Library() {
    _classCallCheck(this, Library);

    this.lib = {
      square: this._shapeMaker("0,0 100,0 100,100 0,100"),
      rightTriangle: this._shapeMaker("0,0 100,0 0,100")
    };
  }

  _createClass(Library, [{
    key: "make",
    value: function make(type) {
      return this.lib[type]();
    }
  }, {
    key: "_shapeMaker",
    value: function _shapeMaker(points) {
      return function () {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttribute("points", points);
        return shape;
      };
    }
  }]);

  return Library;
}();

var Spawner = function () {
  function Spawner(type, options) {
    _classCallCheck(this, Spawner);

    this.type = type;
    this.frame = options.frame;
    this.library = options.library;
    this.shapeDefaults = options.defaults;
    this.node = this._makeNode(this.type, options.spawnAttributes);
  }

  _createClass(Spawner, [{
    key: "spawn",
    value: function spawn() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var shape = this.library.make(this.type);
      options = this.shapeDefaults;
      options.style = this.node.getAttribute("style");
      for (var attr in options) {
        shape.setAttribute(attr, options[attr]);
      }
      var replaced = false;
      this._setDraggable(shape, function (event) {
        if (!replaced) {
          _this.spawn();
          replaced = true;
        }
        console.log(event);
      });
      this.frame.appendChild(shape);
      return shape;
    }
  }, {
    key: "_setDraggable",
    value: function _setDraggable(shape, onDragEnd) {
      Draggable.create(shape, {
        bounds: this.frame.parent,
        onDragEnd: onDragEnd
      });
    }
  }, {
    key: "_makeNode",
    value: function _makeNode(type, attrs) {
      var node = this.library.make(this.type);
      for (var name in attrs) {
        node.setAttribute(name, attrs[name]);
      }
      return node;
    }

    //_clickHandler() {
    //  return (event => {
    //    this.spawn();
    //  });
    //}

  }]);

  return Spawner;
}();

var Game = function () {
  function Game(options) {
    _classCallCheck(this, Game);

    this.container = options.container;
    this.boardHeight = 600;
    this.boardWidth = 1200;
    if (options.hasOwnProperty('board')) this.board(options.board);
  }

  _createClass(Game, [{
    key: "initialize",
    value: function initialize(options) {
      this.library = options.library;
      this._initializeBoard();
      this._initializeSpawns(options.spawns);
    }
  }, {
    key: "_initializeBoard",
    value: function _initializeBoard() {
      this.container.appendChild(this.board());
    }
  }, {
    key: "_initializeSpawns",
    value: function _initializeSpawns(spawns) {
      var _this2 = this;

      this.spawns = [];
      spawns.forEach(function (settings) {
        var spawn = new Spawner(settings.type, {
          frame: _this2.board(),
          library: _this2.library,
          spawnAttributes: settings.spawnAttributes,
          defaults: settings.defaults
        });
        _this2.board().appendChild(spawn.node);
        _this2.spawns.push(spawn);
        spawn.spawn();
      });
    }
  }, {
    key: "board",
    value: function board(_board) {
      if (_board !== undefined) {
        this._board = _board;
      } else if (this._board === undefined) {
        this._board = this._makeBoard({
          height: this.boardHeight,
          width: this.boardWidth
        });
      }
      return this._board;
    }
  }, {
    key: "_makeBoard",
    value: function _makeBoard(options) {
      var board = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      board.setAttribute("height", options.height);
      board.setAttribute("width", options.width);
      board.setAttribute("viewPort", "0 0 " + options.width + " " + options.height);
      return board;
    }
  }]);

  return Game;
}();

document.addEventListener("DOMContentLoaded", function () {
  var game = new Game({
    container: document.getElementById("frame-wrapper")
  });

  game.initialize({
    library: new Library(),
    spawns: [{
      type: "rightTriangle",
      spawnAttributes: {
        fill: "blue",
        style: "transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 200, 0, 1);"
      },
      defaults: {
        fill: "lime"
      }
    }, {
      type: "square",
      spawnAttributes: {
        fill: "purple"
      },
      defaults: {
        fill: "red"
      }
    }]
  });
});

},{}]},{},[1]);
