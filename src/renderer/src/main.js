import App from './App.svelte'

const app = new App({
  target: document.body
})

const body = document.querySelector('body');

// Check if the user has a preference for dark mode stored in local storage
const isDarkModeEnabled = localStorage.getItem('isDarkModeEnabled');

// If there is a stored preference, apply it to the body class
if (isDarkModeEnabled === 'true') {
  body.classList.add('black-mode');
}

export default app
