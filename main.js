const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");

const POINT_SIZE = 30;
const MAX_X = c.width / POINT_SIZE;
const MAX_Y = c.height / POINT_SIZE;
const INIT_X = 9;
const INIT_Y = 9;
const TIME = 100;
const BORDER_SIZE = 2;

const drawPoint = (x, y, color = "#ccc") => {
  ctx.fillStyle = color;
  // ctx.fillStyle = "#fff";
  ctx.fillRect(x * POINT_SIZE, y * POINT_SIZE, POINT_SIZE, POINT_SIZE);
  // ctx.fillRect(
  //   x * POINT_SIZE + BORDER_SIZE,
  //   y * POINT_SIZE + BORDER_SIZE,
  //   POINT_SIZE - 2 * BORDER_SIZE,
  //   POINT_SIZE - 2 * BORDER_SIZE
  // );
};

class Food {
  constructor() {
    this.state = {
      x: INIT_X + 3,
      y: INIT_Y + 3,
    };
  }
  randomFood() {
    this.state = {
      x: Math.floor(Math.random() * MAX_X),
      y: Math.floor(Math.random() * MAX_Y),
    };
  }
  draw() {
    drawPoint(this.state.x, this.state.y, "red");
  }
}

class Snake {
  constructor() {
    this.state = [
      { x: INIT_X, y: INIT_Y },
      { x: INIT_X - 1, y: INIT_Y },
      { x: INIT_X - 2, y: INIT_Y },
    ];
    this.direction = "right";
  }
  move(food) {
    const head = this.state[0];
    const newHead = { x: head.x, y: head.y };
    switch (this.direction) {
      case "left":
        newHead.x -= 1;
        newHead.x = newHead.x < 0 ? MAX_X - 1 : newHead.x;
        break;
      case "right":
        newHead.x += 1;
        newHead.x = newHead.x > MAX_X - 1 ? 0 : newHead.x;
        break;
      case "up":
        newHead.y -= 1;
        newHead.y = newHead.y < 0 ? MAX_Y - 1 : newHead.y;
        break;
      case "down":
        newHead.y += 1;
        newHead.y = newHead.y > MAX_Y - 1 ? 0 : newHead.y;
      default:
        break;
    }
    this.state.unshift(newHead);
    if (food.state.x != newHead.x || food.state.y != newHead.y) {
      this.state.pop();
    } else {
      do {
        food.randomFood();
      } while (
        this.state.includes((point) => {
          return point.x == food.state.x && point.y == food.state.y;
        })
      );
    }
  }
  draw() {
    this.state.forEach((point, index) => {
      if (index == 0) {
        drawPoint(point.x, point.y, "green");
      } else {
        drawPoint(point.x, point.y);
      }
    });
  }
}

class Game {
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.start();
  }

  start() {
    this.draw();
    this.loop();
  }

  loop() {
    this.clear();
    this.draw();
    this.event();
    setTimeout(() => {
      this.loop();
    }, TIME);
  }
  draw() {
    this.snake.draw();
    this.food.draw();
  }
  clear() {
    ctx.clearRect(0, 0, c.width, c.height);
  }
  event() {
    this.snake.move(this.food);
    const temp = window.addEventListener("keydown", (e) => {
      if (e.keyCode == 37 && this.snake.direction != "right") {
        this.snake.direction = "left";
      } else if (e.keyCode == 38 && this.snake.direction != "down") {
        // up arrow
        this.snake.direction = "up";
      } else if (e.keyCode == 39 && this.snake.direction != "left") {
        // right arrow
        this.snake.direction = "right";
      } else if (e.keyCode == 40 && this.snake.direction != "up") {
        // down arrow
        this.snake.direction = "down";
      }
      window.removeEventListener("keydown", temp);
    });
  }
}

new Game();
