let game = function() {
	let	time = 30 // Tiempo de iteracion
	let move = 20 // Movimiento de la pelota
	let	movePaddle = 20 // Movimiento de las palas
	let	width = document.documentElement.clientWidth - move // Colisiones
	let height =  document.documentElement.clientHeight - move // Colisiones
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
		moverPaddle()
	}

	function	moverPaddle(){
		if (player1.keyPress){
			if (player1.keyCode == 38)
				paddleLeft.style.top = (paddleLeft.offsetTop - movePaddle) + "px"
			if (player1.keyCode == 40)
				paddleLeft.style.top = (paddleLeft.offsetTop + movePaddle) + "px"
		}
		if (player2.keyPress){
			if (player1.keyCode == 87)
				paddleLeft.style.top = (paddleLeft.offsetTop - movePaddle) + "px"
			if (player1.keyCode == 83)
				paddleLeft.style.top = (paddleLeft.offsetTop + movePaddle) + "px"
		}
	}
	
	document.onkeydown = function(e){
		e = e
		switch(e.keyCode){
			case 38: // Flecha para arriba
			case 40:   // Flecha para abajo 
				player1.keyCode = e.keyCode
				player1.keyPress = true   
			case 83:  // Tecla S 83
			case 87: // Tecla W 87
				player2.keyCode = e.keyCode
				player2.keyPress = true
			break
		}
	}

	document.onkeyup = function(e){
		if (e.keyCode == 38 || e.keyCode == 40)
			player1.keyPress = false
		if (e.keyCode == 83 || e.keyCode == 87)
			player2.keyPress = false
	}
	start()
}
