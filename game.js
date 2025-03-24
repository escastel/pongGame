var game = function() {
    class Player {
        constructor(paddle){
            this.keyPress = false;
            this.keyCode = null;
            this.paddle = paddle;
            this.paddleCenter = 0;
            this.counter = 0;
        }
    }

    let generalData = {
        time: 30,
        speed: 25,
        paddleSpeed: 20,
        controlGame: 0
    }

    let paddleCollisionData = {
        offset: 0,
        maxBounceAngle: 0,
        newVelX: 0
    }

    let ballData = {
        ball: document.getElementById('ball'),
        velX: 0,
        velY: 0,
        angle: 0,
        ballCenter: 0
    }

    let AIData = {
        timeToRefresh: 1000,
        targetY: 0,
        timeToReach: 0,
        activate: true,
        controlAI: 0
    }

    let width = document.getElementById('game').clientWidth - generalData.speed;
    let height = document.getElementById('game').clientHeight - generalData.speed;
    let player1 = new Player(paddleLeft);
    let player2 = new Player(paddleRight);
    
    /**
     * Inicia el juego y los intervalos de movimiento de la pelota y la IA.
     */
    function start() {
        init();
        generalData.controlGame = setInterval(play, generalData.time);
        if (AIData.activate) 
            AIData.controlAI = setInterval(moveAI, AIData.timeToRefresh);
    }

    /**
     * Inicializa la posición de la pelota.
     */
    function init() {
        resetBall();
    }

    /**
     * Controla el flujo principal del juego.
     */
    function play() {
        moveBall();
        movePaddle();
        checkLost();
    }

    /**
     * Detiene el juego y oculta la pelota.
     */
    function stop() {
        if (generalData.controlGame) 
            clearInterval(generalData.controlGame);
        if (AIData.activate)
            clearInterval(AIData.controlAI);
        ballData.ball.style.display = "none";
    }

    /**
     * Reinicia la posición y velocidad de la pelota.
     */
    function resetBall() {
        generalData.speed = 10;
        ballData.ball.style.left = "50%";
        ballData.ball.style.top = Math.floor(Math.random() * 100) + "%";
        ballData.angle = (Math.random() * Math.PI / 2) - Math.PI / 4;

        ballData.velX = generalData.speed * Math.cos(ballData.angle)
        if ((player1.counter + player2.counter) % 2 == 0)
            ballData.velX *= -1;
        ballData.velY = generalData.speed * Math.sin(ballData.angle);
    }

    /**
     * Verifica si la pelota ha salido del campo y actualiza el marcador.
     */
    function checkLost() {
        if (ballData.ball.offsetLeft >= width) {
            updateScore(paddleLeft);
            player1.counter < 10 ? init() : stop();
        }
        if (ballData.ball.offsetLeft <= 0) {
            updateScore(paddleRight);
            player2.counter < 10 ? init() : stop();
        }
    }

    /**
     * Actualiza el marcador del jugador correspondiente.
     * @param {HTMLElement} paddle La pala del jugador que ha anotado.
     */
    function updateScore(paddle) {
        if (paddle == paddleLeft) {
            player1.counter++;
            document.getElementById('counter1').innerHTML = player1.counter;
        } else {
            player2.counter++;
            document.getElementById('counter2').innerHTML = player2.counter;
        }
    }

    /**
     * Mueve la pelota y verifica colisiones.
     */
    function moveBall() {
        checkState();

        ballData.ball.style.left = (ballData.ball.offsetLeft + ballData.velX) + "px";
        ballData.ball.style.top = (ballData.ball.offsetTop + ballData.velY) + "px";

        if (ballData.ball.offsetTop <= 0) {
            ballData.ball.style.top = "0px";
            ballData.velY *= -1;
        } else if (ballData.ball.offsetTop + ballData.ball.clientHeight >= height) {
            ballData.ball.style.top = (height - ballData.ball.clientHeight) + "px";
            ballData.velY *= -1;
        }
    }

    /**
     * Verifica el estado de la pelota y maneja las colisiones con las palas.
     */
    function checkState() {
        if (collidePLayer(player1.paddle))
            handlePaddleCollision(player1, player1.paddle);
        else if (collidePLayer(player2.paddle))
            handlePaddleCollision(player2, player2.paddle);
    }

    /**
     * Verifica si la pelota ha colisionado con una pala.
     * @param {HTMLElement} paddle La pala a verificar.
     * @returns {boolean} 'true si la pelota ha colisionado con la pala, false en caso contrario.
     */
    function collidePLayer(paddle) {
        if (paddle == paddleLeft) {
            if ((ballData.ball.offsetLeft <= (paddle.clientWidth + paddle.offsetLeft)) && 
            (ballData.ball.offsetTop >= paddle.offsetTop) && 
            (ballData.ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
                return true;
        } else {
            if ((ballData.ball.offsetLeft + ballData.ball.clientWidth >= (paddle.offsetLeft)) && 
            (ballData.ball.offsetTop >= paddle.offsetTop) && 
            (ballData.ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
                return true;
        }
        return false;
    }

    /**
     * Actualiza los datos necesarios para calcular la colisión con la paleta.
     * @param {Player} player El jugador cuya pala ha colisionado con la pelota.
     * @param {HTMLElement} paddle La pala que ha colisionado con la pelota.
     */
    function setPaddleCollision(player, paddle){
        player.paddleCenter = paddle.offsetTop + paddle.clientHeight / 2;
        ballData.ballCenter = ballData.ball.offsetTop + ballData.ball.clientHeight / 2;
        generalData.speed = 25;

        paddleCollisionData.offset = (ballData.ballCenter - player.paddleCenter) / (paddle.clientHeight / 2);
        paddleCollisionData.maxBounceAngle = Math.PI / 4;

        ballData.angle = paddleCollisionData.offset * paddleCollisionData.maxBounceAngle;
        generalData.speed == Math.max(10, Math.sqrt(ballData.velX ** 2 + ballData.velY ** 2));
        paddleCollisionData.newVelX = generalData.speed * Math.cos(ballData.angle);
    }

    /**
     * Maneja la colisión de la pelota con una pala.
     * @param {Player} player El jugador cuya pala ha colisionado con la pelota.
     * @param {HTMLElement} paddle La pala que ha colisionado con la pelota.
     */
    function handlePaddleCollision(player, paddle) {
       setPaddleCollision(player, paddle);

        if (Math.abs(paddleCollisionData.newVelX) < 2){
            if (paddleCollisionData.newVelX > 0)
                paddleCollisionData.newVelX = 2;
            else
            	paddleCollisionData.newVelX = -2;
        }

        if (ballData.velX > 0)
            ballData.velX = paddleCollisionData.newVelX * -1;
        else
            ballData.velX = paddleCollisionData.newVelX * 1;
        ballData.velY = generalData.speed * Math.sin(ballData.angle);
        
        if (paddle === paddleLeft)
            ballData.ball.style.left = (paddle.offsetLeft + paddle.clientWidth) + "px"
        else if (paddle === paddleRight)
            ballData.ball.style.left = (paddle.offsetLeft - ballData.ball.clientWidth) + "px";
    }

    /**
     * Mueve las palas de los jugadores según las teclas presionadas.
     */
    function movePaddle() {
        if (player1.keyPress) {
            if (player1.keyCode == "up" && paddleLeft.offsetTop >= 15)
                paddleLeft.style.top = (paddleLeft.offsetTop - generalData.paddleSpeed) + "px";
            if (player1.keyCode == "down" && (paddleLeft.offsetTop + paddleLeft.clientHeight) <= height)
                paddleLeft.style.top = (paddleLeft.offsetTop + generalData.paddleSpeed) + "px";
        }
        if (player2.keyPress) {
            if (AIData.activate) {
                if ((AIData.targetY >= paddleRight.offsetTop) && (AIData.targetY <= (paddleRight.offsetTop + paddleRight.clientHeight)))
                    player2.keyPress = false;
            }
            if (player2.keyCode == "up" && paddleRight.offsetTop >= 15)
                paddleRight.style.top = (paddleRight.offsetTop - generalData.paddleSpeed) + "px";
            if (player2.keyCode == "down" && (paddleRight.offsetTop + paddleRight.clientHeight) <= height)
                paddleRight.style.top = (paddleRight.offsetTop + generalData.paddleSpeed) + "px";
        }
    }

    /**
     * Actualiza los datos necesarios para mover la paleta de la IA.
     */
    function setAI(){
        AIData.timeToReach = (paddleRight.offsetLeft - ballData.ball.offsetLeft) / ballData.velX;
        AIData.targetY = ballData.ball.offsetTop + ballData.velY * AIData.timeToReach;
        player2.paddleCenter = paddleRight.offsetTop + paddleRight.clientHeight / 2;  
    }

    /**
     * Mueve la pala de la IA para seguir la pelota.
     */
    function moveAI() {
        setAI();

        while (AIData.targetY < 0 || AIData.targetY > height) {
            if (AIData.targetY < 0) {
                AIData.targetY *= -1;
            } else if (AIData.targetY > height) {
                AIData.targetY = 2 * height - AIData.targetY;
            }
        }

        if (player2.paddleCenter < AIData.targetY) {
            player2.keyCode = "down";
            player2.keyPress = true;
        } else if (player2.paddleCenter > AIData.targetY) {
            player2.keyCode = "up";
            player2.keyPress = true;
        }
    }

    document.onkeydown = function(e) {
		const key = e.key.toLowerCase();
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
	}

	document.onkeyup = function(e) {
		const key = e.key.toLowerCase();
		if (key === "w" || key === "s") 
			player1.keyPress = false;
		if (key === "arrowup" || key === "arrowdown") 
			player2.keyPress = false;
	}

    start();
}()