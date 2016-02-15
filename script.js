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
  const properties = {boardSize: 20, cellSize: 20, secondsPerGeneration: 0.3};
  const header = document.getElementById("header");
  const game = new Game(header, properties);
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const input = new Input(startButton, stopButton, game);
}
