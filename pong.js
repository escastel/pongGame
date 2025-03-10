var game = function() {
	let	time = 30 // Tiempo de iteracion
	let movement = 20 // Movimiento de la pelota
	let	movePaddle = 20 // Movimiento de las palas
	let	width = document.documentElement.clientWidth - movement // Colisiones
	let height =  document.documentElement.clientHeight - movement // Colisiones
	let controlGame
	let player1
	let player2

	function	start(){
		init()
		controlGame = setInterval(play, time)
	}

	function	init(){
		ball.style.left = 0
		ball.state = 1
		ball.direction = 1  // right 1, left 2
		player1 = new Object()
		player2 = new Object()
		player1.keyPress = false
		player1.keyCode = null
		player2.keyPress = false
		player2.keyCode = null
	}

	function	stop(){
		clearInterval(controlGame);
		document.body.style.background = "red"
	} 

	function	play(){
		moverBall()
		moverPaddle()
	}

	function	moverBall(){
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
			case 3: // Izquierda, Abajo
				ball.style.left = (ball.offsetLeft - movement) + "px"
				ball.style.top = (ball.offsetTop + movement) + "px"
				break
			case 4: // Izquierda, Arriba
				ball.style.left = (ball.offsetLeft - movement) + "px"
				ball.style.top = (ball.offsetTop - movement) + "px"
				break
		}
	}

	function	checkState(){
		if (ball.direction === 1){
			if (ball.offsetTop >= height) ball.state = 2
			else if (ball.offsetTop <= 0) ball.state = 1
		}
	}

	function	collidePLayer1(){
		return false
	}

	function	collidePLayer2(){
		return false
	}

	function	moverPaddle(){
		if (player1.keyPress){
			if ((player1.keyCode == "W" || player1.keyCode == "w") && paddleLeft.offsetTop >= 15)
				paddleLeft.style.top = (paddleLeft.offsetTop - movePaddle) + "px"
			if ((player1.keyCode == "S" || player1.keyCode == "s") && (paddleLeft.offsetTop + paddleLeft.clientHeight) <= height)
				paddleLeft.style.top = (paddleLeft.offsetTop + movePaddle) + "px"
		}
		if (player2.keyPress){
			if ((player2.keyCode == "ArrowUp") && paddleRight.offsetTop >= 15)
				paddleRight.style.top = (paddleRight.offsetTop - movePaddle) + "px"
			if ((player2.keyCode == "ArrowDown") && (paddleRight.offsetTop + paddleRight.clientHeight) <= height)
				paddleRight.style.top = (paddleRight.offsetTop + movePaddle) + "px"
		}
	}
	
	document.onkeydown = function(e){
		e = e
		switch(e.key){   
			case "W":
			case "w":
			case "s":
			case "S": 
				player1.keyCode = e.key
				player1.keyPress = true
				break
			case "ArrowUp":
			case "ArrowDown": 
				player2.keyCode = e.key
				player2.keyPress = true
				break
		}
	}

	document.onkeyup = function(e){
		if (e.key == "W" || e.key == "w" || e.key == "S" || e.key == "s")
			player1.keyPress = false
		if (e.key == "ArrowUp" || e.key == "ArrowDown")
			player2.keyPress = false
	}
	start()
}()
