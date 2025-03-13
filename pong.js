var game = function() {
	let	time = 30
	let speed = 25
	let	paddleSpeed = 20
	let	width = document.documentElement.clientWidth - speed
	let height =  document.documentElement.clientHeight - speed 
	let controlGame
	let angle
	class Player {
		constructor(){
			this.keyPress = false
			this.keyCode = null
			this.contador = 0
		}
	}
	let	ballData = {
		element: document.getElementById('ball'),
		velX: 0,
		velY: 0,
	}
	let player1 = new Player()
	let player2 = new Player()

	function	start(){
		init()
		controlGame = setInterval(play, time)
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
		clearInterval(controlGame)
	}

	function	resetBall(){
		ball.style.left = "50%"
	 	ball.style.top = Math.floor(Math.random() * 100) + "%"
		speed = 10
		angle = (Math.random() * Math.PI / 2) - Math.PI / 4

		if ((player1.contador + player2.contador) % 2 == 0)
			ballData.velX = speed * Math.cos(angle) * -1
		else
			ballData.velX = speed * Math.cos(angle) * 1
		ballData.velY = speed * Math.sin(angle)
	}

	function checkLost(){
		if (ball.offsetLeft >= width){
			updateScore(paddleLeft)
			if(player1.contador < 10)
				init()
			else
				stop()
		}
		if (ball.offsetLeft <= 0){
			updateScore(paddleRight)
			if(player2.contador < 10)
				init()
			else
				stop()
		}
	}

	function	updateScore(paddle){
		if (paddle == paddleLeft){
			player1.contador++
			document.getElementById('contador1').innerHTML = player1.contador
		}
		else {
			player2.contador++
			document.getElementById('contador2').innerHTML = player2.contador
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
		if (collidePLayer(paddleLeft))
			handlePaddleCollision(paddleLeft)
		else if (collidePLayer(paddleRight))
			handlePaddleCollision(paddleRight)
	}

	function	collidePLayer(paddle){
		if (paddle == paddleLeft){
			if ((ball.offsetLeft <= (paddleLeft.clientWidth + paddleLeft.offsetLeft)) && 
			(ball.offsetTop >= paddleLeft.offsetTop) && 
			(ball.offsetTop <= (paddleLeft.offsetTop + paddleLeft.clientHeight)))
				return true
		}
		else {
			if ((ball.offsetLeft + ball.clientWidth >= (paddleRight.offsetLeft)) && 
			(ball.offsetTop >= paddleRight.offsetTop) && 
			(ball.offsetTop <= (paddleRight.offsetTop + paddleRight.clientHeight)))
				return true
		}
		return false
	}

	function handlePaddleCollision(paddle) {
		let paddleCenter = paddle.offsetTop + paddle.clientHeight / 2
		let ballCenter = ball.offsetTop + ball.clientHeight / 2
		let offset = (ballCenter - paddleCenter) / (paddle.clientHeight / 2)
		let maxBounceAngle = Math.PI / 4
		
		speed = 25
		angle = offset * maxBounceAngle
		speed == Math.max(10, Math.sqrt(ballData.velX ** 2 + ballData.velY ** 2))
	
		let newVelX = speed * Math.cos(angle)
		if (Math.abs(newVelX) < 2)
			newVelX = newVelX > 0 ? 2 : -2
		ballData.velX = newVelX * (ballData.velX > 0 ? -1 : 1)
		ballData.velY = speed * Math.sin(angle)
		
		ball.style.left = (paddle === paddleLeft) 
		? (paddle.offsetLeft + paddle.clientWidth) + "px"
		: (paddle.offsetLeft - ball.clientWidth) + "px"
	}

	function	movePaddle(){
		if (player1.keyPress){
			if (player1.keyCode == "up" && paddleLeft.offsetTop >= 15)
				paddleLeft.style.top = (paddleLeft.offsetTop - paddleSpeed) + "px"
			if (player1.keyCode == "down" && (paddleLeft.offsetTop + paddleLeft.clientHeight) <= height)
				paddleLeft.style.top = (paddleLeft.offsetTop + paddleSpeed) + "px"
		}
		if (player2.keyPress){
			if (player2.keyCode == "up" && paddleRight.offsetTop >= 15)
				paddleRight.style.top = (paddleRight.offsetTop - paddleSpeed) + "px"
			if (player2.keyCode == "down" && (paddleRight.offsetTop + paddleRight.clientHeight) <= height)
				paddleRight.style.top = (paddleRight.offsetTop + paddleSpeed) + "px"
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
				player2.keyCode = "up"
				player2.keyPress = true
				break
			case "arrowdown": 
				player2.keyCode = "down"
				player2.keyPress = true
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