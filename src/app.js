class Library {
  
  constructor() {
    this.lib = {
      square:   this._shapeMaker("0,0 100,0 100,100 0,100"),
      rightTriangle: this._shapeMaker("0,0 100,0 0,100")
    };
  }

  make(type) {
    return this.lib[type]();
  }

  _shapeMaker(points) {
    return (() => {
      const shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      shape.setAttribute("points", points);
      return shape;
    })
  }

}

class Spawner {

  constructor(type, options) {
    this.type = type;
    this.frame = options.frame;
    this.library = options.library;
    this.shapeDefaults = options.defaults;
    this.node = this._makeNode(this.type, options.spawnAttributes);
  }

  spawn(options = {}) {
    const shape = this.library.make(this.type);
    options = this.shapeDefaults;
    options.style = this.node.getAttribute("style");
    for (var attr in options) {
      shape.setAttribute(attr, options[attr]);
    }
    let replaced = false;
    this._setDraggable(shape, event => {
      if (!replaced) {
        this.spawn();
        replaced = true;
      }
      console.log(event);
    });
    this.frame.appendChild(shape);
    return shape;
  }

  _setDraggable(shape, onDragEnd) {
    Draggable.create(shape, {
      bounds: this.frame.parent,
      onDragEnd: onDragEnd
    });
  }

  _makeNode(type, attrs) {
    const node = this.library.make(this.type);
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

}

class Game {

  constructor(options) {
    this.container = options.container;
    this.boardHeight = 600;
    this.boardWidth = 1200;
    if (options.hasOwnProperty('board')) this.board(options.board);
  }

  initialize(options) {
    this.library = options.library;
    this._initializeBoard();
    this._initializeSpawns(options.spawns);
  }

  _initializeBoard() {
    this.container.appendChild(this.board());
  }

  _initializeSpawns(spawns) {
    this.spawns = [];
    spawns.forEach(settings => {
      const spawn = new Spawner(settings.type, {
        frame: this.board(),
        library: this.library,
        spawnAttributes: settings.spawnAttributes,
        defaults: settings.defaults
      });
      this.board().appendChild(spawn.node);
      this.spawns.push(spawn);
      spawn.spawn();
    });
  }

  board(board) {
    if (board !== undefined) {
      this._board = board;
    } else if (this._board === undefined) {
      this._board = this._makeBoard({
        height: this.boardHeight,
        width: this.boardWidth
      });
    }
    return this._board;
  }

  _makeBoard(options) {
    const board = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    board.setAttribute("height", options.height);
    board.setAttribute("width", options.width);
    board.setAttribute("viewPort", `0 0 ${options.width} ${options.height}`);
    return board;
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game({
    container: document.getElementById("frame-wrapper")
  });

  game.initialize({
    library: new Library(),
    spawns: [
      {
        type: "rightTriangle",
        spawnAttributes: {
          fill: "blue",
          style: "transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 200, 0, 1);"
        },
        defaults: {
          fill: "lime",
        }
      },
      {
        type: "square",
        spawnAttributes: {
          fill: "purple",
        },
        defaults: {
          fill: "red"
        }
      }
    ]
  });
});
