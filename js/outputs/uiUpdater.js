// uiUpdater.js - Updated Version with Correct Export Names

let submitBtn, downloadBtn;

/**
 * Initializes references to UI buttons
 */
export function initUIStates() {
  submitBtn = document.querySelector('button[type="submit"]');
  downloadBtn = document.getElementById('downloadBtn');
}

/**
 * Sets the UI to a "Generating..." state
 */
export function setGeneratingState() {
  submitBtn.disabled = true;
  submitBtn.textContent = "Generating...";
  downloadBtn.disabled = true;
}

/**
 * Sets the UI to a successful "Done" state
 */
export function setSuccessState() {
  submitBtn.disabled = false;
  submitBtn.textContent = "Generate Policy";
  downloadBtn.disabled = false;
}

/**
 * Displays an error and resets UI
 * @param {string} message - The error message to show
 */
export function setErrorState(message) {
  submitBtn.disabled = false;
  submitBtn.textContent = "Try Again";
  downloadBtn.disabled = true;
  alert(`Error: ${message}`);
}
