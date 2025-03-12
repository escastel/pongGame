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
/* 		paddleLeft.style.top = "50%"
		paddleRight.style.top = "50%" */
		init()
		controlGame = setInterval(play, time)
	}

	function	init(){
		ball.style.left = "50%"
		ball.style.top = "50%"
		movement = 10
		if ((player1.contador + player2.contador) % 2 == 0){
			ball.state = Math.floor(Math.random() * (5 - 3) + 3)
			ball.direction = "left"
		}
		else {
			ball.state = Math.floor(Math.random() * (3 - 1) + 1)
			ball.direction = "right"
		}
		/* console.log(ball.state) */
	}

	function	stop(){
		clearInterval(controlGame);
		document.body.style.background = "red"
	} 

	function	play(){
		moveBall()
		movePaddle()
		checkLost()
	}

	function checkLost(){
		if (ball.offsetLeft >= width){
			player1.contador++
			if(player1.contador < 10)
				init()
			else
				stop()
			document.getElementById('contador1').innerHTML = player1.contador
		}
		if (ball.offsetLeft <= 0){
			player2.contador++
			if(player2.contador < 10)
				init()
			else
				stop()
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
		if (collidePLayer1()){
			ball.direction = "right"
			if (ball.state == 3)
				ball.state = 1
			if (ball.state == 4)
				ball.state = 2
			movement = 15
		}
		else if (collidePLayer2()){
			ball.direction = "left"
			if (ball.state == 1)
				ball.state = 3
			if (ball.state == 2)
				ball.state = 4
			movement = 15
		}
		if (ball.direction === "right"){
			if (ball.offsetTop >= height) ball.state = 2
			else if (ball.offsetTop <= 0) ball.state = 1
		}
		else {
			if (ball.offsetTop >= height) ball.state = 4
			else if (ball.offsetTop <= 0) ball.state = 3
		}
	}

	function	collidePLayer1(){
		if ((ball.offsetLeft <= paddleLeft.clientWidth) && 
		(ball.offsetTop >= paddleLeft.offsetTop) && 
		(ball.offsetTop <= (paddleLeft.offsetTop + paddleLeft.clientHeight)))
			return true
		return false
	}

	function	collidePLayer2(){
		if ((ball.offsetLeft >= (width - paddleRight.clientWidth)) && 
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