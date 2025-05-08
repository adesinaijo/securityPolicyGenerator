import { sanitize } from '../utilities/sanitizer.js';
import { validateTemplate } from '../utilities/templateValidator.js';

/**
 * Main template processing engine.
 * @param {string} template - Raw template content
 * @param {object} data - Data fields for template substitution
 * @returns {string} Final policy output
 */
export const processTemplate = (template, data) => {
  const validation = validateTemplate(template);
  if (!validation.isValid) {
    throw new Error(`Template validation failed:\n${validation.errors.join('\n')}`);
  }

  // Basic replacements
  let processed = template
    .replace(/{{org_name}}/g, sanitize(data.org_name))
    .replace(/{{employee_count}}/g, sanitize(data.employee_count))
    .replace(/{{work_model}}/g, sanitize(data.work_model))
    .replace(/{{compliance_standard}}/g, sanitize(data.compliance_standard))
    .replace(/{{employee_tier}}/g, data.employee_tier)
    .replace(/{{date}}/g, new Date().toLocaleDateString());

  // Process logic blocks
  processed = processIfBlocks(processed, data);
  processed = processSwitchBlocks(processed, data);

  return processed;
};

// --- Helper: Evaluates a simple condition ---
function evalCondition(condition, data) {
  const [key, operator, valueRaw] = condition.trim().split(/\s+/);
  const actualValue = data[key];
  const expectedValue = valueRaw?.replace(/['"]/g, '');

  switch (operator) {
    case '==': return actualValue == expectedValue;
    case '!=': return actualValue != expectedValue;
    default:
      throw new Error(`Unsupported operator in condition: ${operator}`);
  }
}

// --- Helper: Processes {{#if}}, {{#elif}}, {{#else}} blocks ---
function processIfBlocks(template, data) {
  return template.replace(
    /{{#if ([^{}]+)}}([\s\S]*?)((?:{{#elif ([^{}]+)}}([\s\S]*?))*)?(?:{{#else}}([\s\S]*?))?{{\/if}}/g,
    (_, ifCond, ifBody, _elifBlock, elifCond, elifBody, elseBody) => {
      if (evalCondition(ifCond, data)) return ifBody;
      if (elifCond && evalCondition(elifCond, data)) return elifBody;
      return elseBody || '';
    }
  );
}

// --- Helper: Processes {{#switch}} and {{#case}}, {{#default}} blocks ---
function processSwitchBlocks(template, data) {
  return template.replace(
    /{{#switch ([^{}]+)}}([\s\S]*?){{\/switch}}/g,
    (_, variable, content) => {
      const value = data[variable.trim()];
      const caseRegex = /{{#case '([^']+)'}}([\s\S]*?)(?={{#case|{{#default|$)/g;
      let match, matchedCase = '';

      while ((match = caseRegex.exec(content))) {
        const [_, caseValue, caseBody] = match;
        if (value === caseValue) {
          matchedCase = caseBody;
          break;
        }
      }

      if (!matchedCase) {
        const defaultMatch = content.match(/{{#default}}([\s\S]*)/);
        return defaultMatch ? defaultMatch[1] : '';
      }

      return matchedCase;
    }
  );
}
