var BOARD_SIZE=20;
var CELL_SIZE=20;
var SECONDS_PER_GENERATION = 0.3;
var canvas;
var context;
var shouldRun = false;
var framesDrawn = 0;
var lastFpsUpdate = 0;
var lastGeneration = 0;


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

window.onload = () =>
{
	const game = new Game();
	const startButton = document.getElementById("startButton");
	const stopButton = document.getElementById("stopButton");
	const input = new Input(startButton, stopButton, game);

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
