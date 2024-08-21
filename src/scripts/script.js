/* eslint-disable no-debugger */
/* eslint-disable no-console */
import '../styles/reset.css';
import '../styles/style.css';

/* copy to clipboard logic */

const yankButtons = document.querySelectorAll('.contact__yank-button');

function showPopup() {
  let popupEl = document.querySelector('.popup');
  popupEl.hidden = false;
  setTimeout(() => {
    popupEl.hidden = true;
  }, 2000);
}

function updateButtonState(yankButton, yankIconEl, yankStatusEl) {
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

function copyToClipboard(href, yankButton) {
  navigator.clipboard
    .writeText(href)
    .then(() => {
      if (window.matchMedia('(width <= 900px)').matches) {
        showPopup();
      } else {
        const yankIconEl = yankButton.firstElementChild;
        const yankStatusEl = yankButton.nextElementSibling;
        updateButtonState(yankButton, yankIconEl, yankStatusEl);
      }
    })
    .catch((error) =>
      // eslint-disable-next-line no-console
      console.log('Ошибка при копировании в буфер обмена:', error),
    );
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

const onMouseMoveHandlerThrottled = throttle(onMouseMoveHandler, 200);
const onWindowResizeHandlerThrottled = throttle(onWindowResizeHandler, 200);

document.addEventListener('mousemove', onMouseMoveHandlerThrottled);
window.addEventListener('resize', onWindowResizeHandlerThrottled);

/* blur logic */

const BLUR_DEFAULT_VALUE = 1.25;

function blur(blurValue) {
  document.documentElement.style.setProperty('--blur', `${blurValue}rem`);
}

function toggleEye(blurMode) {
  if (blurMode == 'true') {
    document.removeEventListener('mousemove', onMouseMoveHandlerThrottled);
  } else {
    document.addEventListener('mousemove', onMouseMoveHandlerThrottled);
  }
}

const blurMode = localStorage.getItem('blurMode');
if (blurMode === null) {
  localStorage.setItem('blurMode', true);
  blur(BLUR_DEFAULT_VALUE);
} else if (blurMode === 'true') {
  blur(BLUR_DEFAULT_VALUE);
} else {
  blur(0);
}

function changeBlurMode(blurMode) {
  blur(blurMode === 'true' ? 0 : BLUR_DEFAULT_VALUE);
}

eyeballEl.addEventListener('click', () => {
  const blurMode = localStorage.getItem('blurMode');
  changeBlurMode(blurMode);
  toggleEye(blurMode);
  localStorage.setItem('blurMode', blurMode === 'true' ? 'false' : 'true');
});

/* theme switcher logic */

const themeSwitcherEl = document.querySelector('.theme-switcher');
themeSwitcherEl.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.checked = radio.value === localStorage.getItem('theme');
});
themeSwitcherEl.addEventListener('click', (event) => {
  localStorage.setItem('theme', event.target.value);
});
