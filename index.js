import Boid from "./boid.js";
import sliders from "./sliders.js";

const flock = [];

const settings = sliders()
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let temp
let globalBirdCounter = 0

const setup = () => {
  for (let i = 0; i < 50; i++) {
    flock.push(new Boid(globalBirdCounter))
    globalBirdCounter++
  }
};

const update = () => {
  const {circles: {amount}} = settings;
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  for (let bird of flock) {
    bird.movement(); 
    bird.draw();
    bird.collision(flock)
    bird.flock(flock , settings)
  }
  if(temp<amount)
  {
    for (let i = 0; i <= (amount - temp); i++) {
      flock.push(new Boid(globalBirdCounter))
      globalBirdCounter++
    }
  }
  else{
    for (let i = 0; i < temp - amount; i++) {
      flock.pop()
      globalBirdCounter--
    }
  }
  temp = amount
  console.log(flock.length)
  requestAnimationFrame(update); 
};

setup();
update();