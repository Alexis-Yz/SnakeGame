class SnakeGame {
    constructor() {
        this.foundationNumber = 20;
        this.maxGrade = 10;
        this.score = 0;
        this.grade = 1;
        this.snake = [{ top: 0, left: 0 }];
        this.food = { top: 20, left: 20 };
        this.direction = null;
        this.interval = null;

        this.screen = document.querySelector(".screen");
        this.snakeHead = document.querySelector(".snake-head");
        this.snakeBody = document.querySelector(".snake-body");
        this.foodElement = document.querySelector(".food");
        this.gradeElement = document.querySelector(".grade");
        this.scoreElement = document.querySelector(".score");

        this.init();
    }

    init() {
        this.updateFoodPosition();
        this.updateScoreboard();
        this.handleKeyboard();
        this.startGame();
    }

    getRandomPosition() {
        return Math.floor(Math.random() * 20) * this.foundationNumber;
    }

    updateFoodPosition() {
        this.food.top = this.getRandomPosition();
        this.food.left = this.getRandomPosition();
        this.foodElement.style.top = `${this.food.top}px`;
        this.foodElement.style.left = `${this.food.left}px`;
    }

    updateScoreboard() {
        this.gradeElement.innerText = this.grade;
        this.scoreElement.innerText = this.score;
    }

    handleKeyboard() {
        document.addEventListener("keydown", (e) => {
            const newDirection = e.code;
            if (
                (newDirection === "ArrowUp" && this.direction !== "ArrowDown") ||
                (newDirection === "ArrowLeft" && this.direction !== "ArrowRight") ||
                (newDirection === "ArrowRight" && this.direction !== "ArrowLeft") ||
                (newDirection === "ArrowDown" && this.direction !== "ArrowUp")
            ) {
                this.direction = newDirection;
            }
        });
    }

    moveSnake() {
        if (!this.direction) return;

        let newHead = { ...this.snake[0] };

        switch (this.direction) {
            case "ArrowUp": newHead.top -= this.foundationNumber; break;
            case "ArrowLeft": newHead.left -= this.foundationNumber; break;
            case "ArrowRight": newHead.left += this.foundationNumber; break;
            case "ArrowDown": newHead.top += this.foundationNumber; break;
        }

        // Check for collision with walls
        if (newHead.top < 0 || newHead.left < 0 || newHead.left >= 400 || newHead.top >= 400) {
            alert("撞墙身亡！");
            this.resetGame();
            return;
        }

        // Check for collision with itself
        if (this.snake.some(segment => segment.top === newHead.top && segment.left === newHead.left)) {
            alert("把自己撞死了！");
            this.resetGame();
            return;
        }

        // Check for food
        if (newHead.top === this.food.top && newHead.left === this.food.left) {
            this.score++;
            this.grade = Math.min(Math.ceil(this.score / 10), this.maxGrade);
            this.updateScoreboard();
            this.updateFoodPosition();
        } else {
            this.snake.pop();
        }

        this.snake.unshift(newHead);
        this.renderSnake();
    }

    renderSnake() {
        this.snakeHead.style.top = `${this.snake[0].top}px`;
        this.snakeHead.style.left = `${this.snake[0].left}px`;

        this.snakeBody.innerHTML = "";
        for (let i = 1; i < this.snake.length; i++) {
            const segment = document.createElement("div");
            segment.style.top = `${this.snake[i].top}px`;
            segment.style.left = `${this.snake[i].left}px`;
            this.snakeBody.appendChild(segment);
        }
    }

    startGame() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.moveSnake(), 400 - (this.grade - 1) * 15);
    }

    resetGame() {
        clearInterval(this.interval);
        this.score = 0;
        this.grade = 1;
        this.snake = [{ top: 0, left: 0 }];
        this.direction = null;
        this.updateScoreboard();
        this.updateFoodPosition();
        this.renderSnake();
        this.startGame();
    }
}

document.addEventListener("DOMContentLoaded", () => new SnakeGame());
