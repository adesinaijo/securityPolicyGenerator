import { setGeneratingState, setSuccessState, setErrorState } from '../outputs/uiUpdater.js';
import { sanitize } from '../utilities/sanitizer.js';
import { getEmployeeTier, formatPolicyDate } from '../utilities/helpers.js';

const GEMINI_API_KEY = "AIzaSyAzKi6UryY34ovFbOcQAbHJndX79sBLdsg"; // Use the actual API key

async function listAvailableModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.error?.message || "Failed to list models");
    }
    const result = await response.json();
    return result.models;
  } catch (error) {
    setErrorState("Error listing available models: " + error.message);
    return null;
  }
}

export function initFormHandlers() {
  const form = document.getElementById('policyForm');
  const output = document.getElementById('output');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setGeneratingState();

    try {
      const geminiProModelName = 'gemini-1.5-pro';
      const generateContentEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiProModelName}:generateContent?key=${GEMINI_API_KEY}`;

      const formData = new FormData(form);
      const data = {
        org_name: sanitize(formData.get('org_name').trim()),
        employee_count: sanitize(formData.get('employee_count').trim()),
        work_model: sanitize(formData.get('work_model')),
        compliance_standard: sanitize(
          formData.get('compliance_standard') === 'Other'
            ? formData.get('custom_standard').trim() || "industry best practices"
            : formData.get('compliance_standard').trim()
        ),
        policy_type: formData.get('policy_type'),
        employee_tier: getEmployeeTier(formData.get('employee_count')).tier,
        date: formatPolicyDate()
      };

      const prompt = `
You are a cybersecurity policy generator. Create a detailed and professional security policy for:

Organization: ${data.org_name}
Employees: ${data.employee_count} (${data.employee_tier} tier)
Work Model: ${data.work_model}
Compliance: ${data.compliance_standard}

Format the policy with clear sections and headings, appropriate to the company's size and work model.
`;

      const response = await fetch(
        generateContentEndpoint,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        const errorResult = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorResult}`);
      }

      const result = await response.json();
      const candidate = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (candidate && candidate.trim()) {
        output.textContent = candidate;
        setSuccessState();
      } else {
        throw new Error("Gemini returned an unexpected or empty response.");
      }

    } catch (error) {
      setErrorState("Gemini API error: " + error.message);
    }
  });
}

// Call initFormHandlers to set up the form submission listener
initFormHandlers();