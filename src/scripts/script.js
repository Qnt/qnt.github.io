/* eslint-disable no-console */
import '../styles/reset.css';
import '../styles/style.css';

const yankButtons = document.querySelectorAll('.yank-icon');

yankButtons.forEach((yankButton) => {
  yankButton.addEventListener('click', () => {
    const anchorEl = yankButton.parentElement.querySelector(
      '.contact-item__link',
    );
    let href = anchorEl.getAttribute('href');
    if (href.includes('mailto:')) {
      href = href.replace('mailto:', '');
    }
    navigator.clipboard.writeText(href);
  });
});

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}

const eyeEl = document.querySelector('.eye');
const eyeIrisEl = document.querySelector('.eye__iris');

const eye = {
  x: eyeEl.getBoundingClientRect().x,
  y: eyeEl.getBoundingClientRect().y,
  eyeWidth: eyeEl.getBoundingClientRect().width,
  eyeHeight: eyeEl.getBoundingClientRect().height,
  centerX: 0,
  centerY: 0,
  updateX() {
    this.x = eyeEl.getBoundingClientRect().x;
  },
  updateY() {
    this.y = eyeEl.getBoundingClientRect().y;
  },
  updateHeight() {
    this.eyeHeight = eyeEl.getBoundingClientRect().height;
  },
  updateWidth() {
    this.eyeWidth = eyeEl.getBoundingClientRect().width;
  },
  updateCenterX() {
    this.centerX = this.x + this.eyeWidth / 2;
  },
  updateCenterY() {
    this.centerY = this.y + this.eyeHeight / 2;
  },
  updateAll() {
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
    this.updateCenterX();
    this.updateCenterY();
  },
};

const mouse = {
  x: 0,
  y: 0,

  updateX(event) {
    this.x = event.clientX;
  },
  updateY(event) {
    this.y = event.clientY;
  },
};

eye.updateAll();

function onWindowResizeHandler() {
  eye.updateAll();
}

function onMouseMoveHandler(event) {
  mouse.updateX(event);
  mouse.updateY(event);

  let translateX;
  let translateY;
  let coefficient = 50;

  if (eye.centerX >= mouse.x) {
    translateX = ((mouse.x - eye.centerX) / eye.centerX) * coefficient;
  } else {
    translateX =
      ((eye.centerX - mouse.x) / (eye.centerX - window.innerWidth)) *
      coefficient;
  }

  if (eye.centerY >= mouse.y) {
    translateY = ((mouse.y - eye.centerY) / eye.centerY) * coefficient;
  } else {
    translateY =
      ((eye.centerY - mouse.y) / (eye.centerY - window.innerHeight)) *
      coefficient;
  }

  eyeIrisEl.style.transform = `translate(${translateX}%, ${translateY}%)`;
  // console.log('eye', eye.x, eye.y);
  // console.log('mouse', mouse.x, mouse.y);
}

document.addEventListener('mousemove', throttle(onMouseMoveHandler, 100));
window.addEventListener('resize', throttle(onWindowResizeHandler, 50));
