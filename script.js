var BOARD_SIZE=20;
var CELL_SIZE=20;
var SECONDS_PER_GENERATION = 0.3;
var canvas;
var context;
var shouldRun = false;
var framesDrawn = 0;
var lastFpsUpdate = 0;
var lastGeneration = 0;
var board;

window.onload=function(){init()};

function init()
{
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	canvas.addEventListener("mousedown", getPosition, false);
	board = createArray(BOARD_SIZE, BOARD_SIZE);
}

function start()
{
	document.getElementById("startButton").disabled=true;
	document.getElementById("stopButton").disabled=false;
	shouldRun = true;
	mainGameLoop();
}

function stop()
{
	document.getElementById("startButton").disabled=false;
	document.getElementById("stopButton").disabled=true;
	shouldRun = false;
}

/**
* Utility function for creating arrays of any dimension
* Usage: createArray(4, 10, 2);
*/
function createArray(length) {
	var arr = new Array(length || 0),
		i = length;

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while(i--) arr[length-1 - i] = createArray.apply(this, args);
	}

	return arr;
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
* This will loop as long as requestAnimFrame keeps getting called
*/
function mainGameLoop()
{
    if(!shouldRun)
    {
    	console.log("should run is false, stopping main loop")
    	return;
    }
    requestAnimFrame(mainGameLoop);

    nextGeneration();
    draw();
    updateFPS();
}

function nextGeneration()
{
	var d = new Date();
	var currentTime = d.getTime();
	if ((currentTime - lastGeneration) > (1000 * SECONDS_PER_GENERATION))
	{
		lastGeneration = currentTime;
		calculateNextGeneration();
	}
}

function calculateNextGeneration()
{
	var newBoard = createArray(BOARD_SIZE, BOARD_SIZE);
	for(var y = 0; y < BOARD_SIZE; y++)
	{
		for(var x = 0; x < BOARD_SIZE; x++)
		{
			calculateState(newBoard, x, y);
		}
	}
	board = newBoard;
}

function calculateState(newBoard, x, y)
{
	var neighbours = getNumberOfNeighbours(x, y);
	if(neighbours < 2)
	{
		//Death
		newBoard[y][x] = false;
		return;
	}
	if(neighbours == 2)
	{
		//Survival
		if(board[y][x] == true)
		{
			newBoard[y][x] = true;
			return;
		}
		newBoard[y][x] = false;
		return;
	}
	if(neighbours == 3)
	{
		//Revival
		newBoard[y][x] = true;
		return;
	}
	//Overpopulation
	newBoard[y][x] = false;
	return;
}

function getNumberOfNeighbours(x, y)
{
	var count = 0;
	//check north
	if(isAlive(x, y-1))
	{
		count++;
	}
	//check north-east
	if(isAlive(x+1, y-1))
	{
		count++;
	}
	//check east
	if(isAlive(x+1, y))
	{
		count++;
	}
	//check south east
	if(isAlive(x+1, y+1))
	{
		count++;
	}
	//check south
	if(isAlive(x, y+1))
	{
		count++;
	}
	//check south-west
	if(isAlive(x-1, y+1))
	{
		count++;
	}
	//check west
	if(isAlive(x-1, y))
	{
		count++;
	}
	//check north west
	if(isAlive(x-1, y-1))
	{
		count++;
	}
	return count;
}

function isAlive(x, y)
{
	//Outside the boundaries are considered to be dead for calculation
	if(x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE)
	{
		return false;
	}
	return board[y][x];
}

function updateFPS()
{
    var d = new Date();
    var currentTime = d.getTime();
	if((currentTime - lastFpsUpdate) > 1000)
	{
		var fps = Math.round(framesDrawn * 1000.0/(currentTime - lastFpsUpdate));
		lastFpsUpdate = currentTime;
		framesDrawn = 0;
		document.getElementById("header").innerHTML="FPS: " + fps;
	}
}



function draw()
{
	context.clearRect ( 0 , 0 , canvas.width , canvas.height );
	for(var y = 0; y < BOARD_SIZE; y++)
	{
		for(var x = 0; x < BOARD_SIZE; x++)
		{
			if(board[y][x] == true)
			{
				drawCell(y,x);
			}
		}
	}
	framesDrawn++;
}

function drawCell(y,x)
{
	context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function getPosition(event)
{
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("canvas");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  var cellY = Math.floor(y / CELL_SIZE);
  var cellX = Math.floor(x / CELL_SIZE);
  if(board[cellY][cellX] == true)
  {
  	board[cellY][cellX] = false;
  }
  else
  {
  	board[cellY][cellX] = true;
  }
  draw();
}
