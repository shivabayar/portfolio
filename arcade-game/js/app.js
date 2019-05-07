// Enemies our player must avoid
class Enemy {
    sprite = 'images/enemy-bug.png';
    width = 101;
    height = 83;

    constructor(x, y, dt) {
        this.x = x;
        this.y = y;
        this.dt = dt;
        this.randomInt = getRandomInt(100, 200);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        // console.log(this.randomInt);
        this.dt = dt;
        //when player touches the bug, the bug has to stop and start from the
        // 0th tile
        if(this.dt === 0) {
            this.x = 0;
            this.dt = 0;
        }
        this.x = this.x +  this.dt * this.randomInt;

        //when bug crosses the court
        if(this.x >= 505) {
            this.x = 0;
            return -1;
        }
        this.render();
        return this.x;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    sprite = 'images/char-boy.png';
    centeringConstant = 25;
    width = 101;
    height = 83;
    score = 0;
    steps = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.playerXPos = this.x * this.width;
        this.playerYPos = this.y * this.height - this.centeringConstant;
    }

    handleInput(key) {
        let newX, newY;
        switch(key) {
            case 'left':
                newX = this.x - 1;
                if(newX < 0)
                    return;
                this.x = newX;
                break
            case 'right':
                newX = this.x + 1;
                if(newX > 4)
                    return;
                this.x = newX;
                break;
            case 'up':
                newY = this.y - 1;
                if(newY < 0)
                    return;
                this.y = newY;
                break;
            case 'down':
                newY = this.y + 1;
                if(newY > 5)
                    return;
                this.y = newY;
                break;
        }

        if(this.y === 0) {
            this.score += 1;
            const scoreEle = document.getElementById('score');
            scoreEle.lastElementChild.innerText = `${this.score}`;
            console.log(this.score);
            this.y = 4;
        }
        this.steps += 1;
        const stepEle = document.getElementById('steps');
        stepEle.firstElementChild.innerText = `${this.steps}`;
        this.playerXPos = this.x * this.width;
        this.playerYPos = this.y * this.height - this.centeringConstant;
        this.update();
    }

    update() {
        this.render();
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.playerXPos, this.playerYPos);
    }

    //bring the player on the grass upon collision
    // reduce the lives and hearts
    resetOnCollision() {
        const hearts = doc.querySelectorAll('.heart ul');
        if(hearts[0].childElementCount > 1) {
            hearts[0].removeChild(hearts[0].lastElementChild);
        }
        else {
            hearts[0].removeChild(hearts[0].lastElementChild);
            const gameOver = doc.getElementsByClassName('game-over')[0];
            if(gameOver.classList.contains('game-over')) {
                gameOver.classList.remove('game-over');
                const gameOverText = doc.getElementById('game_over_text');
                gameOverText.innerText = 'Minions Sad!!! Please try again';
            }
        }
        this.y = 5;
        this.playerYPos = this.y * this.height - this.centeringConstant;
        this.update();
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    // let player = new Player();
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(e && e.keyCode && allowedKeys[e.keyCode])
        player.handleInput(allowedKeys[e.keyCode]);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
