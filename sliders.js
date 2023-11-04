const slider = document.getElementsByClassName("slider");
const separation_slider = slider[0];
const aligment_slider = slider[1];
const cohesion_slider = slider[2];
const speed_slider = slider[3]
const circles_slider = slider[4]

let settings = {
  separation: {
    x: 0,
    y: 0,
  },
  aligment: {
    x: 0,
    y: 0,
  },
  cohesion: {
    x: 0,
    y: 0,
  },
  speed: {
    value: 2
  },
  circles: {
    amount: 100
  },
};

const sliders = () => {
  separation_slider.oninput = () => {
    settings.separation.x = separation_slider.value * 0.1;
    settings.separation.y = separation_slider.value * 0.1;
  };
  aligment_slider.oninput = () => {
    settings.aligment.x = aligment_slider.value * 0.1;
    settings.aligment.y = aligment_slider.value * 0.1;
  };
  cohesion_slider.oninput = () => {
    settings.cohesion.x = cohesion_slider.value * 0.1;
    settings.cohesion.y = cohesion_slider.value * 0.1;
  };
  speed_slider.oninput = () => {
    settings.speed.value= speed_slider.value * 0.1;
  };
  circles_slider.oninput = () => {
    settings.circles.amount= circles_slider.value;
  };

  return settings;
};

export default sliders;
