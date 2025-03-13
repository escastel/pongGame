var game = function() {
	let	time = 30 // Tiempo de iteracion
	let movement = 10// Movimiento de la pelota
	let	paddle = 20 // Movimiento de las palas
	let	width = document.documentElement.clientWidth - movement // Colisiones
	let height =  document.documentElement.clientHeight - movement // Colisiones
	let controlGame
	class Player {
		constructor(){
			this.keyPress = false
			this.keyCode = null
			this.contador = 0
		}
	}
	let player1 = new Player()
	let player2 = new Player()

	function	start(){
		init()
		controlGame = setInterval(play, time)
	}

	function	init(){
		resetBall()
		takeDirection()
	}

	function	resetBall(){
		ball.style.left = "50%"
		ball.style.top = Math.floor(Math.random() * (100 - 0)) + "%"
		movement = 10
	}

	function	takeDirection(){
		if ((player1.contador + player2.contador) % 2 == 0){
			ball.state = Math.floor(Math.random() * (6 - 4) + 4)
			ball.direction = "left"
		}
		else {
			ball.state = Math.floor(Math.random() * (3 - 1) + 1)
			ball.direction = "right"
		}
	}

	function	stop(){
		clearInterval(controlGame);
	} 

	function	play(){
		moveBall()
		movePaddle()
		checkLost()
	}

	function checkLost(){
		if (ball.offsetLeft >= width){
			updateScore(1)
			if(player1.contador < 10)
				init()
			else
				stop()
		}
		if (ball.offsetLeft <= 0){
			updateScore(2)
			if(player2.contador < 10)
				init()
			else
				stop()
		}
	}

	function	updateScore(player){
		if (player == 1){
			player1.contador++
			document.getElementById('contador1').innerHTML = player1.contador
		}
		else {
			player2.contador++
			document.getElementById('contador2').innerHTML = player2.contador
		}
	}
	function	moveBall(){
		checkState()
		switch(ball.state){
			case 1: // Derecha, Abajo
				ball.style.left = (ball.offsetLeft + movement) + "px"
				ball.style.top = (ball.offsetTop + movement) + "px"
				break
			case 2: // Derecha, Arriba
				ball.style.left = (ball.offsetLeft + movement) + "px"
				ball.style.top = (ball.offsetTop - movement) + "px"
				break
			case 3: // Derecha, Recto
				ball.style.left = (ball.offsetLeft + movement) + "px"
				break
			case 4: // Izquierda, Abajo
				ball.style.left = (ball.offsetLeft - movement) + "px"
				ball.style.top = (ball.offsetTop + movement) + "px"
				break
			case 5: // Izquierda, Arriba
				ball.style.left = (ball.offsetLeft - movement) + "px"
				ball.style.top = (ball.offsetTop - movement) + "px"
				break
			case 6: // Izquierda, Recto
				ball.style.left = (ball.offsetLeft - movement) + "px"
		}
	}

	function	checkState(){
		if (collidePLayer1()){
			ball.direction = "right"
			if (ball.state == 4)
				ball.state = 1 // Math.floor(Math.random() * (3 - 1) + 1)
			if (ball.state == 5)
				ball.state = 2 // Math.floor(Math.random() * (3 - 1) + 1)
			/* if (ball.state = 6)
				ball.state = Math.floor(Math.random() * (4 - 1) + 1) */
			movement = 25
			ball.style.left = (paddleLeft.offsetLeft + paddleLeft.clientWidth) + "px"
		}
		else if (collidePLayer2()){
			ball.direction = "left"
			if (ball.state == 1)
				ball.state = 4 // Math.floor(Math.random() * (6 - 4) + 4)
			if (ball.state == 2)
				ball.state = 5 // Math.floor(Math.random() * (6 - 4) + 4)
			/* if (ball.state = 3)
				ball.state = Math.floor(Math.random() * (7 - 4) + 4) */
			movement = 25
			ball.style.left = (paddleRight.offsetLeft - ball.clientWidth) + "px"
		}
		if (ball.direction === "right"){
			if (ball.offsetTop >= height) ball.state = 2
			else if (ball.offsetTop <= 0) ball.state = 1
		}
		else {
			if (ball.offsetTop >= height) ball.state = 5
			else if (ball.offsetTop <= 0) ball.state = 4
		}
	}

	function	collidePLayer1(){
		if ((ball.offsetLeft <= (paddleLeft.clientWidth + paddleLeft.offsetLeft)) && 
		(ball.offsetTop >= paddleLeft.offsetTop) && 
		(ball.offsetTop <= (paddleLeft.offsetTop + paddleLeft.clientHeight)))
			return true
		return false
	}

	function	collidePLayer2(){
		if ((ball.offsetLeft + ball.clientWidth >= (paddleRight.offsetLeft)) && 
		(ball.offsetTop >= paddleRight.offsetTop) && 
		(ball.offsetTop <= (paddleRight.offsetTop + paddleRight.clientHeight)))
			return true
		return false
	}

	function	movePaddle(){
		if (player1.keyPress){
			if (player1.keyCode == "up" && paddleLeft.offsetTop >= 15)
				paddleLeft.style.top = (paddleLeft.offsetTop - paddle) + "px"
			if (player1.keyCode == "down" && (paddleLeft.offsetTop + paddleLeft.clientHeight) <= height)
				paddleLeft.style.top = (paddleLeft.offsetTop + paddle) + "px"
		}
		if (player2.keyPress){
			if (player2.keyCode == "up" && paddleRight.offsetTop >= 15)
				paddleRight.style.top = (paddleRight.offsetTop - paddle) + "px"
			if (player2.keyCode == "down" && (paddleRight.offsetTop + paddleRight.clientHeight) <= height)
				paddleRight.style.top = (paddleRight.offsetTop + paddle) + "px"
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