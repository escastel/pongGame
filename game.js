var game = function() {
	class Player {
		constructor(paddle){
			this.keyPress = false
			this.keyCode = null
			this.paddle = paddle
			this.paddleCenter = 0
			this.counter = 0
		}
	}

	let player1 = new Player(paddleLeft)
	let player2 = new Player(paddleRight)

	let	generalData = {
		time: 30,
		speed: 25,
		paddleSpeed: 20,
		controlGame: 0
	}

	let	width = document.documentElement.clientWidth - generalData.speed
	let height =  document.documentElement.clientHeight - generalData.speed

	let	ballData = {
		element: document.getElementById('ball'),
		velX: 0,
		velY: 0,
		angle: 0
	}

	let AIData = {
		targetY: 0,
		timeToReach: 0,
		paddleCenter: 0,
		activate: true,
		controlAI: 0
	}

	function	start(){
		init()
		generalData.controlGame = setInterval(play, generalData.time)
		if (AIData.activate) 
			AIData.controlAI = setInterval(moveAI, 1000)
	}

	function	init(){
		resetBall()
	}

	function	play(){
		moveBall()
		movePaddle()
		checkLost()
	}

	function	stop(){
		clearInterval(generalData.controlGame)
		if (AIData.activate)
			clearInterval(AIData.controlAI)
	}

	function	resetBall(){
		ball.style.left = "50%"
	 	ball.style.top = Math.floor(Math.random() * 100) + "%"
		generalData.speed = 10
		ballData.angle = (Math.random() * Math.PI / 2) - Math.PI / 4

		if ((player1.counter + player2.counter) % 2 == 0)
			ballData.velX = generalData.speed * Math.cos(ballData.angle) * -1
		else
			ballData.velX = generalData.speed * Math.cos(ballData.angle) * 1
		ballData.velY = generalData.speed * Math.sin(ballData.angle)
	}

	function checkLost(){
		if (ball.offsetLeft >= width){
			updateScore(paddleLeft)
			if(player1.counter < 10)
				init()
			else
				stop()
		}
		if (ball.offsetLeft <= 0){
			updateScore(paddleRight)
			if(player2.counter < 10)
				init()
			else
				stop()
		}
	}

	function	updateScore(paddle){
		if (paddle == paddleLeft){
			player1.counter++
			document.getElementById('counter1').innerHTML = player1.counter
		}
		else {
			player2.counter++
			document.getElementById('counter2').innerHTML = player2.counter
		}
	}

	function moveBall() {
		checkState()
		ball.style.left = (ball.offsetLeft + ballData.velX) + "px"
		ball.style.top = (ball.offsetTop + ballData.velY) + "px"

	 	if (ball.offsetTop <= 0 || ball.offsetTop >= height)
			ballData.velY *= -1
	}

	function checkState() {
		if (collidePLayer(player1.paddle))
			handlePaddleCollision(player1.paddle)
		else if (collidePLayer(player2.paddle))
			handlePaddleCollision(player2.paddle)
	}

	function	collidePLayer(paddle){
		if (paddle == paddleLeft){
			if ((ball.offsetLeft <= (paddle.clientWidth + paddle.offsetLeft)) && 
			(ball.offsetTop >= paddle.offsetTop) && 
			(ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
				return true
		}
		else {
			if ((ball.offsetLeft + ball.clientWidth >= (paddle.offsetLeft)) && 
			(ball.offsetTop >= paddle.offsetTop) && 
			(ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
				return true
		}
		return false
	}

	function handlePaddleCollision(paddle) {
		let paddleCenter = paddle.offsetTop + paddle.clientHeight / 2
		let ballCenter = ball.offsetTop + ball.clientHeight / 2
		let offset = (ballCenter - paddleCenter) / (paddle.clientHeight / 2)
		let maxBounceAngle = Math.PI / 4
		
		generalData.speed = 25
		ballData.angle = offset * maxBounceAngle
		generalData.speed == Math.max(10, Math.sqrt(ballData.velX ** 2 + ballData.velY ** 2))
	
		let newVelX = generalData.speed * Math.cos(ballData.angle)
		if (Math.abs(newVelX) < 2)
			newVelX = newVelX > 0 ? 2 : -2
		ballData.velX = newVelX * (ballData.velX > 0 ? -1 : 1)
		ballData.velY = generalData.speed * Math.sin(ballData.angle)
		
		ball.style.left = (paddle === paddleLeft) 
		? (paddle.offsetLeft + paddle.clientWidth) + "px"
		: (paddle.offsetLeft - ball.clientWidth) + "px"
	}

	function	movePaddle(){
		if (player1.keyPress){
			if (player1.keyCode == "up" && paddleLeft.offsetTop >= 15)
				paddleLeft.style.top = (paddleLeft.offsetTop - generalData.paddleSpeed) + "px"
			if (player1.keyCode == "down" && (paddleLeft.offsetTop + paddleLeft.clientHeight) <= height)
				paddleLeft.style.top = (paddleLeft.offsetTop + generalData.paddleSpeed) + "px"
		}
		if (player2.keyPress){
			if (AIData.activate){
				if ((AIData.targetY >= paddleRight.offsetTop) && (AIData.targetY <= (paddleRight.offsetTop + paddleRight.clientHeight)))
					player2.keyPress = false
			}
			if (player2.keyCode == "up" && paddleRight.offsetTop >= 15)
				paddleRight.style.top = (paddleRight.offsetTop - generalData.paddleSpeed) + "px"
			if (player2.keyCode == "down" && (paddleRight.offsetTop + paddleRight.clientHeight) <= height)
				paddleRight.style.top = (paddleRight.offsetTop + generalData.paddleSpeed) + "px"
		}
	}
	
	function moveAI() {
		// if (ballData.velX > 0) {
		AIData.timeToReach = (paddleRight.offsetLeft - ball.offsetLeft) / ballData.velX
		AIData.targetY = ball.offsetTop + ballData.velY * AIData.timeToReach

		while (AIData.targetY < 0 || AIData.targetY > height) {
			if (AIData.targetY < 0) {
				AIData.targetY = -AIData.targetY
			} else if (ballFutureY > height) {
				AIData.targetY = 2 * height - AIData.targetY
			}
		}
		// } 
		player2.paddleCenter = paddleRight.offsetTop + paddleRight.clientHeight / 2
		// let errorFactor = Math.random() * 10 - 10
		// AIData.targetY += errorFactor

		if (player2.paddleCenter < AIData.targetY) {
			player2.keyCode = "down"
			player2.keyPress = true
		} else if (player2.paddleCenter > AIData.targetY) {
			player2.keyCode = "up"
			player2.keyPress = true
		}
	}
	

	document.onkeydown = function(e){
		e = e
		switch(e.key.toLowerCase()){   
			case "w":
				player1.keyCode = "up"
				player1.keyPress = true
				break
			case "s":
				player1.keyCode = "down"
				player1.keyPress = true
				break
			case "arrowup":
				if (!AIData.activate){
					player2.keyCode = "up"
					player2.keyPress = true
				}
				break
			case "arrowdown":
				if (!AIData.activate){
					player2.keyCode = "down"
					player2.keyPress = true
				}
				break
		}
	}

	document.onkeyup = function(e){
		if (e.key.toLowerCase() == "w" || e.key.toLowerCase() == "s")
			player1.keyPress = false
		if (e.key == "ArrowUp" || e.key == "ArrowDown")
			player2.keyPress = false
	}

	start()
}()