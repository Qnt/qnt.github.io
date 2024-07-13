/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import '../styles/reset.css';
import '../styles/style.css';

/* copy to clipboard logic */

const yankButtons = document.querySelectorAll('.contact__yank-button');

function copyToClipboard(href, yankButton) {
  try {
    navigator.clipboard
      .writeText(href)
      .then(() => {
        try {
          if (window.matchMedia('(width <= 800px)').matches) {
            let popupEl = document.querySelector('.popup');
            popupEl.hidden = false;
            setTimeout(() => {
              popupEl.hidden = true;
            }, 2000);
          } else {
            const yankIconEl = yankButton.firstElementChild;
            const yankStatusEl = yankButton.nextElementSibling;
            yankButton.disabled = true;
            yankIconEl.outerHTML = `<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="contact__yank-icon"
                >
                  <path d="M20 6 9 17l-5-5"/>
                </svg>`;
            yankStatusEl.hidden = false;
            yankStatusEl.textContent = 'Скопировано';
            setTimeout(() => {
              yankButton.disabled = false;
              yankButton.firstElementChild.outerHTML = yankIconEl.outerHTML;
              yankStatusEl.hidden = true;
              yankStatusEl.textContent = '';
            }, 2000);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
}

yankButtons.forEach((yankButton) => {
  yankButton.addEventListener('click', () => {
    let href = yankButton.parentElement
      .querySelector('.contact__link')
      .getAttribute('href');

    if (href.includes('mailto:')) {
      href = href.replace('mailto:', '');
    }

    copyToClipboard(href, yankButton);
  });
});

/* throttle function */

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

/* all-seeing eye logic*/

const eyeballEl = document.querySelector('.eyeball');
const irisEl = document.querySelector('.eyeball__iris');

const eye = {
  x: eyeballEl.getBoundingClientRect().x,
  y: eyeballEl.getBoundingClientRect().y,
  eyeWidth: eyeballEl.getBoundingClientRect().width,
  eyeHeight: eyeballEl.getBoundingClientRect().height,
  centerX: 0,
  centerY: 0,
  updateX() {
    this.x = eyeballEl.getBoundingClientRect().x;
  },
  updateY() {
    this.y = eyeballEl.getBoundingClientRect().y;
  },
  updateWidth() {
    this.eyeWidth = eyeballEl.getBoundingClientRect().width;
  },
  updateHeight() {
    this.eyeHeight = eyeballEl.getBoundingClientRect().height;
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

eye.updateAll();

const maxValueX = Math.max(window.innerWidth - eye.centerX, eye.centerX);
const maxValueY = Math.max(window.innerHeight - eye.centerY, eye.centerY);

function onMouseMoveHandler(event) {
  let mouseXNormalized = (event.clientX - eye.centerX) / maxValueX;
  let mouseYNormalized = (event.clientY - eye.centerY) / maxValueY;

  // mapping window coordinates to circle coordinates
  // credits to https://mathproofs.blogspot.com/2005/07/mapping-square-to-circle.html
  let translateX =
    mouseXNormalized * Math.sqrt(1 - Math.pow(mouseYNormalized, 2) * 0.5);
  let translateY =
    mouseYNormalized * Math.sqrt(1 - Math.pow(mouseXNormalized, 2) * 0.5);

  irisEl.style.setProperty('--translate-x', translateX);
  irisEl.style.setProperty('--translate-y', translateY);
}

function onWindowResizeHandler() {
  eye.updateAll();
}
document.addEventListener('mousemove', throttle(onMouseMoveHandler, 200));
window.addEventListener('resize', throttle(onWindowResizeHandler, 200));
