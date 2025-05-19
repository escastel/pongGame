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
        constructor(paddle) {
            this.keyPress = false;
            this.keyCode = null;
            this.paddle = paddle;
            this.paddleCenter = 0;
            this.counter = 0;
        }
    }

    const player1 = new Player(document.getElementById('paddleLeft'));
    const player2 = new Player(document.getElementById('paddleRight'));
    
    const generalData = {
        time: 30,
        speed: 0.02,
        paddleSpeed: 0.04,
        paddleMargin: height * 0.03,
        controlGame: null,
        isPaused: false
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
        newSpeed: 0
    };

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function showCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) {
            console.error("Elemento 'countdown' no encontrado en el HTML");
            return Promise.resolve();
        }
        countdownElement.classList.remove('hidden');
        ballData.ball.style.display = 'none';
        
        for (let i = 3; i > 0; i--) {
            countdownElement.textContent = i.toString();
            countdownElement.style.animation = 'countdownPulse 1s ease-in-out';
            await delay(1000);
            void countdownElement.offsetWidth;
        }
        
        countdownElement.textContent = '¡GO!';
        await delay(500);
        countdownElement.style.animation = 'fadeOut 0.5s';
        await delay(500);
        countdownElement.classList.add('hidden');
        ballData.ball.style.display = 'block';
        
        return Promise.resolve();
    }

    function togglePause() {
        generalData.isPaused = !generalData.isPaused;
    
        if (generalData.isPaused) {
            pauseMessage.style.display = 'block';
        } else {
            if (pauseMessage)
                pauseMessage.style.display = 'none';
        }
    }

    async function start() {
        await showCountdown()
        init();
        generalData.controlGame = setInterval(play, generalData.time);
        if (AIData.activate)
            AIData.controlAI = setInterval(moveAI, AIData.timeToRefresh);
    }

    function init() {
        resetBall();
    }

    async function play() {
        if (generalData.isPaused) return;
        moveBall();
        movePaddle();
        checkLost();
    }

    function stop() {
		if (generalData.controlGame) 
			clearInterval(generalData.controlGame);
		if (AIData.activate && AIData.controlAI) 
			clearInterval(AIData.controlAI);
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
            player1.counter < 10 ? init() : stop();
        }
        if (ballData.ball.offsetLeft <= 0) {
            updateScore(player2.paddle);
            player2.counter < 10 ? init() : stop();
        }
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
            if (player1.keyCode === "up" && player1.paddle.offsetTop >= generalData.paddleMargin)
                player1.paddle.style.top = `${player1.paddle.offsetTop - height * generalData.paddleSpeed}px`;
            if (player1.keyCode === "down" && (player1.paddle.offsetTop + player1.paddle.clientHeight) <= height - generalData.paddleMargin)
                player1.paddle.style.top = `${player1.paddle.offsetTop + height * generalData.paddleSpeed}px`;
        }
        if (player2.keyPress) {
            if (AIData.activate) {
                if ((AIData.targetY >= player2.paddle.offsetTop) && (AIData.targetY <= (player2.paddle.offsetTop + player2.paddle.clientHeight)))
                    player2.keyPress = false;
            }
            if (player2.keyCode === "up" && player2.paddle.offsetTop >= generalData.paddleMargin)
                player2.paddle.style.top = `${player2.paddle.offsetTop - height * generalData.paddleSpeed}px`;
            if (player2.keyCode === "down" && (player2.paddle.offsetTop + player2.paddle.clientHeight) <= height - generalData.paddleMargin)
                player2.paddle.style.top = `${player2.paddle.offsetTop + height * generalData.paddleSpeed}px`;
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
            player2.keyCode = "down";
            player2.keyPress = true;
        }
        else if (player2.paddleCenter > AIData.targetY) {
            player2.keyCode = "up";
            player2.keyPress = true;
        }
    }

    document.onkeydown = function (e) {
        const key = e.key.toLowerCase();
         // Tecla de pausa
        if (key === "p") {
            togglePause();
            return;
        }
        
        // Si el juego está pausado, no procesar más teclas
        if (generalData.isPaused) return;
        if (key === "w") {
            player1.keyPress = true;
            player1.keyCode = "up";
        }
        if (key === "s") {
            player1.keyPress = true;
            player1.keyCode = "down";
        }
        if (key === "arrowup" && !AIData.activate) {
            player2.keyPress = true;
            player2.keyCode = "up";
        }
        if (key === "arrowdown" && !AIData.activate) {
            player2.keyPress = true;
            player2.keyCode = "down";
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

    setOnresize();
    start();
}
game();