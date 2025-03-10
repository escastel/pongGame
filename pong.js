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
		controlGame = setInterval(player1, time)
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
		
	}
	
	document.onkeydown = function(e){
		e = e
		switch(e.keyCode){
			case 
		}
	}

	document.onkeyup = function(e){

	}
	start()
}