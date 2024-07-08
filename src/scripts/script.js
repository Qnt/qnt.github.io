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
