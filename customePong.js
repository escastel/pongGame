function game() {
    const gameElement = document.getElementById('game');
    if (!gameElement)
        throw new Error("HTML 'game' element not found.");
    
    let width = gameElement.clientWidth;
    let height = gameElement.clientHeight;

    class Player {
        keyPress;
        keyCode;
        paddle;
        paddleCenter;
        counter;
        keysAffected;
        constructor(paddle) {
            this.keyPress = false;
            this.keyCode = null;
            this.paddle = paddle;
            this.paddleCenter = 0;
            this.counter = 0;
            this.keysAffected = false;
            this.paddleSpeed = 0.04;
        }
    }

    const player1 = new Player(document.getElementById('paddleLeft'));
    const player2 = new Player(document.getElementById('paddleRight'));
    
    const generalData = {
        time: 30,
        speed: 0.02,
        paddleSpeed: 0.04,
        paddleMargin: height * 0.03,
        controlGame: null
    };

    const paddleCollisionData = {
        offset: 0,
        maxBounceAngle: 0,
        newVelX: 0
    };

    const ballData = {
        ball: document.getElementById('ball'),
        velX: 0,
        velY: 0,
        angle: 0,
        ballCenter: 0
    };
    const AIData = {
        timeToRefresh: 1000,
        targetY: 0,
        timeToReach: 0,
        errorRate: 0,
        activate: true,
        controlAI: null
    };

    const onresizeData = {
        ballRelativeLeft: 0,
        ballRelativeTop: 0,
        player1RelativeTop: 0,
        player2RelativeTop: 0,
        powerUpRelativeLeft: 0,
        powerUpRelativeTop: 0,
        newSpeed: 0
    };

    const powerUpData = {
        powerUp: document.getElementById('powerUp'),
        types: ['paddleSize', 'ballSpeed', 'paddleSpeed', 'reverse'],
        active: false,
        timeout: 6000,
        controlPowerUp: null
    }

    function start() {
        init();
        generalData.controlGame = setInterval(play, generalData.time);
        powerUpData.controlPowerUp = setInterval(spawnPowerUp, 5000);
        if (AIData.activate)
            AIData.controlAI = setInterval(moveAI, AIData.timeToRefresh);
    }

    function init() {
        resetBall();
    }

    function saveGameState() {
        const gameState = {
            player1: {
                counter: player1.counter,
                paddleTop: player1.paddle.offsetTop
            },
            player2: {
                counter: player2.counter,
                paddleTop: player2.paddle.offsetTop
            },
            ball: {
                posX: ballData.ball.offsetLeft,
                posY: ballData.ball.offsetTop,
                velX: ballData.velX,
                velY: ballData.velY,
                angle: ballData.angle
            },
            powerUp: {
                active: powerUpData.active,
                type: powerUpData.type,
                timeout: powerUpData.timeout
            },
            generalData: {
                time: generalData.time,
                speed: generalData.speed,
                paddleSpeed: generalData.paddleSpeed
            },
            AIData: {
                activate: AIData.activate,
                targetY: AIData.targetY
            }
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
    
    function loadGameState() {
        const savedState = localStorage.getItem('gameState');
    
        if (savedState) {
            const gameState = JSON.parse(savedState);
    
            player1.counter = gameState.player1.counter;
            player2.counter = gameState.player2.counter;
    
            player1.paddle.style.top = `${gameState.player1.paddleTop}px`;
            player2.paddle.style.top = `${gameState.player2.paddleTop}px`;
    
            ballData.ball.style.left = `${gameState.ball.posX}px`;
            ballData.ball.style.top = `${gameState.ball.posY}px`;
            ballData.velX = gameState.ball.velX;
            ballData.velY = gameState.ball.velY;
            ballData.angle = gameState.ball.angle;

            powerUpData.active = gameState.powerUp.active;
            powerUpData.type = gameState.powerUp.type;
            powerUpData.timeout = gameState.powerUp.timeout;
    
            generalData.time = gameState.generalData.time;
            generalData.speed = gameState.generalData.speed;
            generalData.paddleSpeed = gameState.generalData.paddleSpeed;
    
            AIData.activate = gameState.AIData.activate;
            AIData.targetY = gameState.AIData.targetY;

            document.getElementById('counter1').innerText = player1.counter;
            document.getElementById('counter2').innerText = player2.counter;
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadGameState();
    });
    
    /* Controlar en un futuro cuando se cambia de pestaña. */

    function play() {
        if (document.visibilityState !== "hidden"){
            saveGameState();
            setOnresize();
            moveBall();
            movePaddle();
            if (checkLost())
            return;
        }
        else{
            console.log("Game paused");
        }
    }

    function stop() {
		if (generalData.controlGame) 
			clearInterval(generalData.controlGame);
		if (AIData.activate && AIData.controlAI) 
			clearInterval(AIData.controlAI);
        if (powerUpData.controlPowerUp)
            clearInterval(powerUpData.controlPowerUp);
		ballData.ball.style.display = "none";
	}

    function resetBall() {
		generalData.speed = 0.01;
		ballData.ball.style.left = "50%";
		ballData.ball.style.top = Math.floor(Math.random() * 100) + "%";
		ballData.angle = (Math.random() * Math.PI / 2) - Math.PI / 4;

		ballData.velX = width * generalData.speed * Math.cos(ballData.angle)
		if ((player1.counter + player2.counter) % 2 === 0)
			ballData.velX *= -1;
		ballData.velY = width * generalData.speed * Math.sin(ballData.angle);
	}


    function checkLost() {
        if (ballData.ball.offsetLeft >= width) {
            updateScore(player1.paddle);
            if (player1.counter < 10)
                init()
            else{
                stop();
                return 1;
            }
        }
        if (ballData.ball.offsetLeft <= 0) {
            updateScore(player2.paddle);
            if (player2.counter < 10)
                init()
            else{
                stop();
                return 1;
            }
        }
        return 0;
    }

    function updateScore(paddle) {
        if (paddle === player1.paddle) {
            player1.counter++;
            document.getElementById('counter1').innerHTML = player1.counter.toString();
        }
        else {
            player2.counter++;
            document.getElementById('counter2').innerHTML = player2.counter.toString();
        }
    }
    
    function moveBall() {
        checkBallPowerUpCollision();
		checkState();

		ballData.ball.style.left = `${ballData.ball.offsetLeft + ballData.velX}px`;
		ballData.ball.style.top = `${ballData.ball.offsetTop + ballData.velY}px`;

		if (ballData.ball.offsetTop <= 0) {
            ballData.ball.style.top = `0px`;
            ballData.velY *= -1;
        } else if (ballData.ball.offsetTop + ballData.ball.clientHeight >= height) {
            ballData.ball.style.top = `${height - ballData.ball.clientHeight}px`;
            ballData.velY *= -1;
        }
	}

    function checkState() {
		if (collidePlayer(player1.paddle)) 
			handlePaddleCollision(player1, player1.paddle);
		else if (collidePlayer(player2.paddle))
			handlePaddleCollision(player2, player2.paddle);
	}

    function collidePlayer(paddle) {
		if (((ballData.ball.offsetLeft + ballData.ball.clientWidth) >= paddle.offsetLeft) &&
			(ballData.ball.offsetLeft <= (paddle.offsetLeft + paddle.clientWidth)) &&
			((ballData.ball.offsetTop + ballData.ball.clientHeight) >= paddle.offsetTop) &&
			(ballData.ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
			return true;
		return false;
	}

    function setPaddleCollision(player, paddle) {
        player.paddleCenter = paddle.offsetTop + paddle.clientHeight / 2;
        ballData.ballCenter = ballData.ball.offsetTop + ballData.ball.clientHeight / 2;

        paddleCollisionData.offset = (ballData.ballCenter - player.paddleCenter) / (paddle.clientHeight / 2);
        paddleCollisionData.maxBounceAngle = Math.PI / 4;

		generalData.speed = 0.02;
        ballData.angle = paddleCollisionData.offset * paddleCollisionData.maxBounceAngle;
        paddleCollisionData.newVelX = width * generalData.speed * Math.cos(ballData.angle);
    }

    function handlePaddleCollision(player, paddle) {
		setPaddleCollision(player, paddle);

        if (Math.abs(paddleCollisionData.newVelX) < 2)
			paddleCollisionData.newVelX = paddleCollisionData.newVelX > 0 ? 2 : -2

		ballData.velX = ballData.velX > 0 ? paddleCollisionData.newVelX * -1 : paddleCollisionData.newVelX * 1;
        ballData.velY = height * generalData.speed * Math.sin(ballData.angle);
		ballData.ball.style.left = paddle === player1.paddle ? `${paddle.offsetLeft + paddle.clientWidth}px` : `${paddle.offsetLeft - ballData.ball.clientWidth}px`;
    }


    function movePaddle() {
        if (player1.keyPress) {
            if (player1.keyCode === "up" && player1.paddle.offsetTop >= generalData.paddleMargin){
                player1.paddle.style.top = `${player1.paddle.offsetTop - height * player1.paddleSpeed}px`;
                if (player1.paddle.offsetTop < generalData.paddleMargin)
                    player1.paddle.style.top = `${generalData.paddleMargin}px`;
            }
            if (player1.keyCode === "down" && (player1.paddle.offsetTop + player1.paddle.clientHeight) <= height - generalData.paddleMargin){
                player1.paddle.style.top = `${player1.paddle.offsetTop + height * player1.paddleSpeed}px`;
                if (player1.paddle.offsetTop + player1.paddle.clientHeight > height - generalData.paddleMargin)
                    player1.paddle.style.top = `${height - generalData.paddleMargin - player1.paddle.clientHeight}px`;
            }
        }
        if (player2.keyPress) {
            if (AIData.activate) {
                if ((AIData.targetY >= player2.paddle.offsetTop) && (AIData.targetY <= (player2.paddle.offsetTop + player2.paddle.clientHeight)))
                    player2.keyPress = false;
            }
            if (player2.keyCode === "up" && player2.paddle.offsetTop >= generalData.paddleMargin){
                player2.paddle.style.top = `${player2.paddle.offsetTop - height * player2.paddleSpeed}px`;
                if (player2.paddle.offsetTop < generalData.paddleMargin)
                    player2.paddle.style.top = `${generalData.paddleMargin}px`;
            }
            if (player2.keyCode === "down" && (player2.paddle.offsetTop + player2.paddle.clientHeight) <= height - generalData.paddleMargin){
                player2.paddle.style.top = `${player2.paddle.offsetTop + height * player2.paddleSpeed}px`;
                if (player2.paddle.offsetTop + player2.paddle.clientHeight > height - generalData.paddleMargin)
                    player2.paddle.style.top = `${height - generalData.paddleMargin - player2.paddle.clientHeight}px`;
            }
        }
    }

    function setAI() {
        AIData.timeToReach = (player2.paddle.offsetLeft - ballData.ball.offsetLeft) / ballData.velX;
        AIData.targetY = ballData.ball.offsetTop + ballData.velY * AIData.timeToReach;
		AIData.errorRate = player2.paddleCenter < AIData.targetY ? Math.random() * height - player2.paddleCenter : Math.random() * player2.paddleCenter - 0;
        player2.paddleCenter = player2.paddle.offsetTop + player2.paddle.clientHeight / 2; 
    }

    function moveAI() {
        let random = Math.random();
        setAI();

       AIData.targetY = random < 0.03 ? AIData.errorRate : AIData.targetY; // Tasa de error

        while (AIData.targetY < 0 || AIData.targetY > height) {
            AIData.targetY = AIData.targetY < 0 ? AIData.targetY * -1 : 2 * height - AIData.targetY;
        }
        if (player2.paddleCenter < AIData.targetY) {
            if (!player2.keysAffected)
                player2.keyCode = "down";
            else
                player2.keyCode = "up";
            player2.keyPress = true;
        }
        else if (player2.paddleCenter > AIData.targetY) {
            if (!player2.keysAffected)
                player2.keyCode = "up";
            else
                player2.keyCode = "down";
            player2.keyPress = true;
        }
    }

    document.onkeydown = function (e) {
        const key = e.key.toLowerCase();
        if (key === "w") {
            if (!player1.keysAffected)
                player1.keyCode = "up";
            else
                player1.keyCode = "down";
            player1.keyPress = true;
        }
        if (key === "s") {
            if (!player1.keysAffected)
                player1.keyCode = "down";
            else
                player1.keyCode = "up";
            player1.keyPress = true;
        }
        if (key === "arrowup" && !AIData.activate) {
            if (!player2.keysAffected)
                player2.keyCode = "up";
            else
                player2.keyCode = "down";
            player2.keyPress = true;
        }
        if (key === "arrowdown" && !AIData.activate && !player2.keysAffected) {
            if (!player2.keysAffected)
                player2.keyCode = "down";
            else
                player2.keyCode = "up";
            player2.keyPress = true;
        }
    };

    document.onkeyup = function (e) {
        const key = e.key.toLowerCase();
        if (key === "w" || key === "s")
            player1.keyPress = false;
        if (key === "arrowup" || key === "arrowdown")
            player2.keyPress = false;
    };

    function setOnresize() {
        onresizeData.ballRelativeLeft = ballData.ball.offsetLeft / width;
        onresizeData.ballRelativeTop = ballData.ball.offsetTop / height;
        onresizeData.player1RelativeTop = player1.paddle.offsetTop / height;
        onresizeData.player2RelativeTop = player2.paddle.offsetTop / height;
        
        if (powerUpData.powerUp.style.display !== "none") {
            onresizeData.powerUpRelativeLeft = powerUpData.powerUp.offsetLeft / width;
            onresizeData.powerUpRelativeTop = powerUpData.powerUp.offsetTop / height;
        }

        if (gameElement) {
            width = gameElement.clientWidth;
            height = gameElement.clientHeight;
        }
        generalData.paddleMargin = height * 0.03;

        onresizeData.newSpeed = 0.01;
    }

    window.onresize = function () {
        setOnresize();
        
        ballData.velX = Math.sign(ballData.velX) * width * onresizeData.newSpeed;
        ballData.velY = Math.sign(ballData.velY) * height * onresizeData.newSpeed;
        
        ballData.ball.style.left = `${onresizeData.ballRelativeLeft * width}px`;
        ballData.ball.style.top = `${onresizeData.ballRelativeTop * height}px`;
        
        player1.paddle.style.top = `${onresizeData.player1RelativeTop * height}px`;
        player2.paddle.style.top = `${onresizeData.player2RelativeTop * height}px`;
        
        if (powerUpData.powerUp.style.display !== "none") {
            powerUpData.powerUp.style.left = `${onresizeData.powerUpRelativeLeft * width}px`;
            powerUpData.powerUp.style.top = `${onresizeData.powerUpRelativeTop * height}px`;
        }

        if (ballData.ball.offsetLeft < 0) {
            updateScore(player2.paddle);
            resetBall();
            return;
        }
        else if (ballData.ball.offsetLeft + ballData.ball.clientWidth > width) {
            updateScore(player1.paddle);
            resetBall();
            return;
        }
        if (ballData.ball.offsetTop < 0) {
            ballData.ball.style.top = `0px`;
            ballData.velY = Math.abs(ballData.velY);
        }
        else if (ballData.ball.offsetTop + ballData.ball.clientHeight > height) {
            ballData.ball.style.top = `${height - ballData.ball.clientHeight}px`;
            ballData.velY = -Math.abs(ballData.velY);
        }
    };

    /* PowerUp setup */

    function spawnPowerUp() {
        if (powerUpData.active) return;

        powerUpData.active = true;
        const paddleLeft = player1.paddle.offsetLeft + player1.paddle.clientWidth;
        const paddleRight = player2.paddle.offsetLeft - 40;

        const x = Math.random() * (paddleRight - paddleLeft) + paddleLeft;
        const y = Math.random() * (height - 40);

        if (x < paddleLeft || x > paddleRight - paddleLeft || y > height || y < 40) {
            powerUpData.active = false;
            return;
        }

        powerUpData.powerUp.style.left = `${x}px`;
        powerUpData.powerUp.style.top = `${y}px`;
        powerUpData.powerUp.style.display = "block";

        powerUpData.powerUp.classList.remove('powerUpAppear', 'powerUpBlink');
        void powerUpData.powerUp.offsetWidth;
        powerUpData.powerUp.classList.add('powerUpAppear');

        powerUpData.timeout = setTimeout(() => {
        powerUpData.powerUp.classList.add('powerUpBlink');
        setTimeout(() => {
            powerUpData.powerUp.classList.remove('powerUpBlink');
            powerUpData.powerUp.classList.add('powerUpDisappear');
            setTimeout(() => {
                powerUpData.powerUp.style.display = "none";
                powerUpData.powerUp.classList.remove('powerUpAppear', 'powerUpDisappear');
                powerUpData.active = false;
            }, 400);
        }, 600);
    }, powerUpData.timeout);
    }

    function checkBallPowerUpCollision() {
        const ballRect = ballData.ball.getBoundingClientRect();
        const powerRect = powerUpData.powerUp.getBoundingClientRect();

        if (ballRect.left < powerRect.right &&
            ballRect.right > powerRect.left &&
            ballRect.top < powerRect.bottom &&
            ballRect.bottom > powerRect.top)
            activatePowerUp();
    }

    function activatePowerUp() {
        /* const power = powerUpData.types[Math.floor(Math.random() * powerUpData.types.length)]; */
        const power = 'paddleSize'; // For testing purposes

        switch (power) {
            case 'paddleSize':
                activePaddleSize();
                break;
            case 'ballSpeed':
                activeBallSpeed();
                break;
            case 'paddleSpeed':
                activePaddleSpeed();
                break;
            case 'reverse':
                activeReverseControl();
                break;
        }

        powerUpData.powerUp.style.display = "none";
        powerUp.classList.remove('powerUpAnimate', 'powerUpDisappear');
        clearTimeout(powerUpData.timeout);
        powerUpData.active = false;
    }

    function activePaddleSize(){
        const paddle = ballData.velX < 0 ? player2.paddle : player1.paddle;
        const paddleAffected = ballData.velX < 0 ? player1.paddle : player2.paddle;
        paddle.classList.add('paddleGrowEffect');
        paddleAffected.classList.add('paddleLittleEffect');
        generalData.paddleMargin = height * 0.05;

        if (paddle.offsetTop < generalData.paddleMargin)
            paddle.style.top = `${generalData.paddleMargin}px`;
        else if (paddle.offsetTop + paddle.clientHeight > height - generalData.paddleMargin)
            paddle.style.top = `${height - generalData.paddleMargin - paddle.clientHeight}px`;

        if (paddleAffected.offsetTop < generalData.paddleMargin)
            paddleAffected.style.top = `${generalData.paddleMargin}px`;
        else if (paddleAffected.offsetTop + paddleAffected.clientHeight > height - generalData.paddleMargin)
            paddleAffected.style.top = `${height - generalData.paddleMargin - paddleAffected.clientHeight}px`;

        setTimeout(() => {
            generalData.paddleMargin = height * 0.03;

            paddle.classList.remove('paddleGrowEffect');
            paddle.classList.add('paddleGrowToNormalEffect');
            if (paddle.offsetTop < generalData.paddleMargin)
                paddle.style.top = `${generalData.paddleMargin}px`;
            else if (paddle.offsetTop + paddle.clientHeight > height - generalData.paddleMargin)
                paddle.style.top = `${height - generalData.paddleMargin - paddle.clientHeight}px`;

            paddleAffected.style.height = "120px";
            paddleAffected.classList.remove('paddleLittleEffect');
            paddleAffected.classList.add('paddleLittleToNormalEffect');
            if (paddleAffected.offsetTop < generalData.paddleMargin)
                paddleAffected.style.top = `${generalData.paddleMargin}px`;
            else if (paddleAffected.offsetTop + paddleAffected.clientHeight > height - generalData.paddleMargin)
                paddleAffected.style.top = `${height - generalData.paddleMargin - paddleAffected.clientHeight}px`;
        }, 5000);
        setTimeout(() => {
            paddle.classList.remove('paddleGrowToNormalEffect');
            paddleAffected.classList.remove('paddleLittleToNormalEffect');
        }, 1500);
    }

    function activeBallSpeed(){
        ballData.velX *= 1.5;
        ballData.velY *= 1.5;

        const trailInterval = setInterval(() => {
            const trail = document.createElement("div");
            trail.className = "ballTrailClone";
    
            trail.style.left = `${ballData.ball.offsetLeft - ballData.velX}px`
            trail.style.top = `${ballData.ball.offsetTop - ballData.velY}px`;
    
            document.getElementById("game").appendChild(trail);
    
            setTimeout(() => trail.remove(), 400);
        }, 50);

        setTimeout(() => {
            ballData.velX /= 1.5;
            ballData.velY /= 1.5;
            clearInterval(trailInterval);
        }, 5000);
    }

    function activePaddleSpeed(){
        const playerAffected = ballData.velX < 0 ? player1 : player2;
        playerAffected.paddleSpeed = 0.06;

        setTimeout(() => {
            playerAffected.paddleSpeed = 0.04;
        }, 5000);
    }

    function activeReverseControl(){
        const playerAffected = ballData.velX < 0 ? player1 : player2;
        playerAffected.keysAffected = true;

        setTimeout(() => {
            playerAffected.keysAffected = false;
        }, 5000);
    }

    start();
}

game();