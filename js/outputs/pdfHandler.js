// js/outputs/pdfHandler.js

const PDF_CONFIG = {
  margin: 0.5,
  filename: 'security_policy.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
};

export const initPDFGenerator = (outputElement, buttonElement) => {
  buttonElement.addEventListener('click', () => {
    try {
      if (!outputElement.textContent.trim()) {
        throw new Error('No policy content to download');
      }

      html2pdf().set(PDF_CONFIG).from(outputElement).save();
    } catch (error) {
      console.error('PDF Error:', error);
      alert(error.message);
    }
  });
};
