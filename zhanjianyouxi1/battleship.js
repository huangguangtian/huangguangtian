var view = {
  displayMessage: function (msg) {  //displayMessage是一个方法
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) { //location为td元素的id
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit"); //增加指定的属性，并为他赋指定的值
    //hit为特性
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};


view.displayMessage("Tap tap, is this thing on?");




var model = {
  boardSize: 7,//网格大小
  numShips: 3,//战舰数
  shipLength: 3,//战舰位置及被击中的部位
  shipsSunk: 0,//有多少战舰被击沉

  ships: [
    { locations: [0, 0, 0], hits: ['', '', ''] }, //location存储了战舰占据的单元格
    { locations: [0, 0, 0], hits: ['', '', ''] }, //hits指出战舰是否被击中
    { locations: [0, 0, 0], hits: ['', '', ''] }],


  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i]; //获取一个战舰

      var index = ship.locations.indexOf(guess); //indexOf为数组中的
      if (index >= 0) { //返回的值>=说明玩家击中了战舰
        ship.hits[index] = "hit";//将hits中的相应元素设置为"hit"
        view.displayHit(guess);//是否击中了战舰
        view.displayMessage("HIT!");//显示击中了战舰
        if (this.isSunk(ship)) { //判断战舰是否被击中
          view.displayMessage("you sank my battleship!");
          this.shipsSunk++;

        }

        return true;
      }

    }
    view.displayMiss(guess);//没有击中战舰
    view.displayMessage("you missed.");
    return false;
  },

  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") { //当i>3是返回true
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();

      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a lettle and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the borad.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops,that's off the borad!");
    } else {
      return row + column;
    }
  }
  return null;
}
var controller = {
  guesses: 0,
  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
      }
    }
  }
};

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}
function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}


window.onload = init;