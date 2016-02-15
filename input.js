"use strict";
class Input
{
  constructor(startButton, stopButton, game)
  {
    this.startButton = startButton;
    this.stopButton = stopButton;
    this.game = game;
    startButton.onclick = this.start.bind(this);
    stopButton.onclick = this.stop.bind(this);
  }
  start()
  {
    this.startButton.disabled = true;
    this.stopButton.disabled = false;
    game.start();
  }
  stop()
  {
    this.startButton.disabled = false;
    this.stopButton.disabled = true;
    game.stop();
  }
}
