// main.js - Clean Entry Point
import { initPDFGenerator } from './js/outputs/pdfHandler.js';
import { initUIStates } from './js/outputs/uiUpdater.js';
import { initFormHandlers } from './js/core/formHandler.js'; // ✅ make sure this path is correct

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('output');
  const downloadBtn = document.getElementById('downloadBtn');

  // Initialize UI states and components
  initUIStates();                      // Initialize UI state references
  initPDFGenerator(output, downloadBtn);  // PDF handler
  initFormHandlers();                  // ✅ Gemini-powered form handler
});
