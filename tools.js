export const addVectors = (vector1, vector2) => {
  const result = {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y,
  };
  return result;
};

export const multiplyVector = (vector1, vector2) => {
  const result = {
    x: vector1.x * vector2.x,
    y: vector1.y * vector2.y,
  };
  return result;
};

export const subtractVectors = (vector1, vector2) => {
  const result = {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
  };
  return result;
};

export const divideVectors = (vector, divisor) => {
  var result = {
    x: vector.x / divisor,
    y: vector.y / divisor,
  };
  return result;
};

export const setMagnitude = (vector, magnitude) => {
  var currentMagnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  var scaleFactor = magnitude / currentMagnitude;

  var result = {
    x: vector.x * scaleFactor,
    y: vector.y * scaleFactor,
  };

  return result;
};

export const limitMagnitude = (vector, maxMagnitude) => {
  var currentMagnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (currentMagnitude > maxMagnitude) {
    var scaleFactor = maxMagnitude / currentMagnitude;
    vector.x *= scaleFactor;
    vector.y *= scaleFactor;
  }
  return vector;
};
