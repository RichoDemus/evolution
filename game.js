"use strict";
class Game
{
  constructor(fpsHeader, properties)
  {
    this.properties = properties;
    this.header = fpsHeader;
    this.lastFpsUpdate = 0;
    this.framesDrawn = 0;
    this.lastGeneration = 0;
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("mousedown", this.getPosition.bind(this), false);
    this.board = this.createArray(this.properties.boardSize, this.properties.boardSize);
  }
  start()
  {
    this.shouldRun = true;
    this.mainGameLoop();
  }
  stop()
  {
    this.shouldRun = false;
  }

  mainGameLoop()
  {
    if(!this.shouldRun)
    {
    	console.log("should run is false, stopping main loop")
    	return;
    }
    requestAnimFrame(this.mainGameLoop.bind(this));

    this.nextGeneration();
    this.draw();
    this.updateFPS();
  }

  nextGeneration()
  {
  	var d = new Date();
  	var currentTime = d.getTime();
  	if ((currentTime - this.lastGeneration) > (1000 * this.properties.secondsPerGeneration))
  	{
  		this.lastGeneration = currentTime;
  		this.calculateNextGeneration();
  	}
  }

  calculateNextGeneration()
  {
  	var newBoard = this.createArray(this.properties.boardSize, this.properties.boardSize);
  	for(var y = 0; y < this.properties.boardSize; y++)
  	{
  		for(var x = 0; x < this.properties.boardSize; x++)
  		{
  			this.calculateState(newBoard, x, y);
  		}
  	}
  	this.board = newBoard;
  }

  calculateState(newBoard, x, y)
  {
  	var neighbours = this.getNumberOfNeighbours(x, y);
  	if(neighbours < 2)
  	{
  		//Death
  		newBoard[y][x] = false;
  		return;
  	}
  	if(neighbours == 2)
  	{
  		//Survival
  		if(this.board[y][x] == true)
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

  getNumberOfNeighbours(x, y)
  {
  	var count = 0;
  	//check north
  	if(this.isAlive(x, y-1))
  	{
  		count++;
  	}
  	//check north-east
  	if(this.isAlive(x+1, y-1))
  	{
  		count++;
  	}
  	//check east
  	if(this.isAlive(x+1, y))
  	{
  		count++;
  	}
  	//check south east
  	if(this.isAlive(x+1, y+1))
  	{
  		count++;
  	}
  	//check south
  	if(this.isAlive(x, y+1))
  	{
  		count++;
  	}
  	//check south-west
  	if(this.isAlive(x-1, y+1))
  	{
  		count++;
  	}
  	//check west
  	if(this.isAlive(x-1, y))
  	{
  		count++;
  	}
  	//check north west
  	if(this.isAlive(x-1, y-1))
  	{
  		count++;
  	}
  	return count;
  }

  isAlive(x, y)
  {
  	//Outside the boundaries are considered to be dead for calculation
  	if(x < 0 || y < 0 || x >= this.properties.boardSize || y >= this.properties.boardSize)
  	{
  		return false;
  	}
  	return this.board[y][x];
  }

  updateFPS()
  {
    var d = new Date();
    var currentTime = d.getTime();
  	if((currentTime - this.lastFpsUpdate) > 1000)
  	{
  		var fps = Math.round(this.framesDrawn * 1000.0/(currentTime - this.lastFpsUpdate));
  		this.lastFpsUpdate = currentTime;
  		this.framesDrawn = 0;
  		this.header.innerHTML="FPS: " + fps;
  	}
  }

  draw()
  {
  	this.context.clearRect ( 0 , 0 , this.canvas.width , this.canvas.height );
  	for(var y = 0; y < this.properties.boardSize; y++)
  	{
  		for(var x = 0; x < this.properties.boardSize; x++)
  		{
  			if(this.board[y][x] == true)
  			{
  				this.drawCell(y,x);
  			}
  		}
  	}
  	this.framesDrawn++;
  }

  drawCell(y,x)
  {
  	this.context.fillRect(x * this.properties.cellSize, y * this.properties.cellSize, this.properties.cellSize, this.properties.cellSize);
  }

  getPosition(event)
  {
    var x = event.x;
    var y = event.y;

    x -= this.canvas.offsetLeft;
    y -= this.canvas.offsetTop;

    var cellY = Math.floor(y / this.properties.cellSize);
    var cellX = Math.floor(x / this.properties.cellSize);
    if(this.board[cellY][cellX] == true)
    {
    	this.board[cellY][cellX] = false;
    }
    else
    {
    	this.board[cellY][cellX] = true;
    }
    this.draw();
  }

  /**
  * Utility function for creating arrays of any dimension
  * Usage: createArray(4, 10, 2);
  */
  createArray(length) {
  	var arr = new Array(length || 0),
  		i = length;

  	if (arguments.length > 1) {
  		var args = Array.prototype.slice.call(arguments, 1);
  		while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
  	}

  	return arr;
  }
}
