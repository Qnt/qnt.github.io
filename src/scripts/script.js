import '../styles/reset.css';
import '../styles/style.css';

const previewEl = document.querySelector('.hero__preview');
const projectsListEl = document.querySelector('.projects-list');

const projectItemListener = (e) => {
  const projectEl = e.target.closest('.project-item');
  if (projectEl) {
    previewEl.textContent = projectEl.querySelector(
      '.project-item__title',
    ).textContent;
  }
};

projectsListEl.addEventListener('mouseover', projectItemListener);
