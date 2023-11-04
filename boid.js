import {
  multiplyVector,
  addVectors,
  subtractVectors,
  divideVectors,
  setMagnitude,
  limitMagnitude,
} from "./tools.js";

export default class Boid {
  constructor(number) {
    this.id = number;
    this.velocity = {
      x: Math.random() * 2 - 1, // Random x velocity between -1 and 1
      y: Math.random() * 2 - 1, // Random y velocity between -1 and 1
    };
    this.maxSpeed = 2;
    this.position = {
      x: Math.floor(Math.random() * 1200),
      y: Math.floor(Math.random() * 1200),
    };
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.radius = 6
    this.maxForce = 0.2;;
    this.acceleration = {
      x: 0,
      y: 0,
    };
  }

  updateMaxSpeed(setting){
    let {speed: {value}} = setting
    this.maxSpeed = value;
  }
  getDistance(pidgeons) {
    const distance = Math.sqrt(
      Math.pow(this.position.x - pidgeons.position.x, 2) +
        Math.pow(this.position.y - pidgeons.position.y, 2)
    );
    return distance;
  }

  collision(birds) {
    for (let pidgeon of birds) {
      if (pidgeon.id !== this.id) {
        const distance = this.getDistance(pidgeon);

        if (distance < this.radius + this.radius) {
          const dx = this.position.x - pidgeon.position.x;
          const dy = this.position.y - pidgeon.position.y;
          const angle = Math.atan2(dy, dx);

          const oppositeAngle = angle + Math.PI;

          const newX =
            pidgeon.position.x + Math.cos(oppositeAngle) * this.radius;
          const newY =
            pidgeon.position.y + Math.sin(oppositeAngle) * this.radius;

          pidgeon.position.x = newX;
          pidgeon.position.y = newY;
        }
      }
    }
  }

  align(birds) {
    let perceptionRadius = 25;
    let steering = { x: 0, y: 0 };
    let total = 0;
    for (let bird of birds) {
      const distance = this.getDistance(bird);
      if (bird.id != this.id && distance < perceptionRadius) {
        steering = addVectors(steering, bird.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering = divideVectors(steering, total);
      steering = setMagnitude(steering, this.maxSpeed);
      steering = subtractVectors(steering, this.velocity);
      steering = limitMagnitude(steering, this.maxSpeed);
    }
    return steering;
  }

  cohesion(birds) {
    let perceptionRadius = 50;
    let steering = { x: 0, y: 0 };
    let total = 0;

    for (let bird of birds) {
      const distance = this.getDistance(bird);
      if (bird.id != this.id && distance < perceptionRadius) {
        steering = addVectors(steering, bird.position);
        total++;
      }
    }
    if (total > 0) {
      steering = divideVectors(steering, total);
      steering = subtractVectors(steering, this.position);
      steering = setMagnitude(steering, this.maxSpeed);
      steering = subtractVectors(steering, this.velocity);
      steering = limitMagnitude(steering, this.maxForce);
    }
    return steering;
  }

  separation(birds) {
    let perceptionRadius = 50;
    let steering = { x: 0, y: 0 };
    let total = 0;

    for (let pidgeon of birds) {
      const distance = this.getDistance(pidgeon);
      if (pidgeon.id !== this.id && distance < perceptionRadius) {
        let difference = {
          x: this.position.x - pidgeon.position.x,
          y: this.position.y - pidgeon.position.y,
        };

        let distanceSquared = Math.pow(distance,2);
        difference.x /= distanceSquared;
        difference.y /= distanceSquared;
        steering.x += difference.x;
        steering.y += difference.y;
        total++;
      }
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;

      let magnitude = Math.sqrt(
        steering.x * steering.x + steering.y * steering.y
      );

      steering.x *= this.maxSpeed / magnitude;
      steering.y *= this.maxSpeed / magnitude;
      steering.x -= this.velocity.x;
      steering.y -= this.velocity.y;

      let steeringMagnitude = Math.sqrt(
        steering.x * steering.x + steering.y * steering.y
      );

      if (steeringMagnitude > this.maxForce) {
        steering.x = (steering.x / steeringMagnitude) * this.maxForce;
        steering.y = (steering.y / steeringMagnitude) * this.maxForce;
      }
    }
    return steering;
  }

  flock(flock, settings) {
    let alignment = this.align(flock);
    let cohesion = this.cohesion(flock);
    let separation = this.separation(flock);

    this.updateMaxSpeed(settings)
    separation = multiplyVector(separation, settings.separation);
    cohesion = multiplyVector(cohesion, settings.cohesion);
    alignment = multiplyVector(alignment, settings.aligment);


    (() => {
      // Update the acceleration of the current object
      this.acceleration.x += separation.x;
      this.acceleration.y += separation.y;
      this.acceleration.x += cohesion.x;
      this.acceleration.y += cohesion.y;
      this.acceleration.x += alignment.x;
      this.acceleration.y += alignment.y;
    })();
  }

  draw() {
    let { x, y } = this.position;
    //this.ctx.fillStyle = "red"; // !Not changin color
    this.ctx.strokeStyle = "white";
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  edgesScreen() {
    const { width, height } = this.canvas.getBoundingClientRect();
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  movement() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.position.x += this.velocity.x * this.maxSpeed;
    this.position.y += this.velocity.y * this.maxSpeed;
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.edgesScreen();
  }
}
