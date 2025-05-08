/**
 * Validates template structure and required tags
 * @param {string} template - Raw template content
 * @returns {object} { isValid: bool, errors: string[] }
 */
export const validateTemplate = (template) => {
    const errors = [];
    
    // 1. Required Tag Check
    const requiredTags = [
      'org_name', 
      'employee_count',
      'work_model',
      'compliance_standard',
      'employee_tier'
    ];
    
    requiredTags.forEach(tag => {
      if (!template.includes(`{{${tag}}}`) && 
          !template.includes(`{{#if ${tag}`)) {
        errors.push(`Missing required tag: {{${tag}}}`);
      }
    });
  
    // 2. Conditional Block Validation
    const ifBlocks = (template.match(/{{#if/g) || []).length;
    const endIfBlocks = (template.match(/{{\/if}}/g) || []).length;
    
    if (ifBlocks !== endIfBlocks) {
      errors.push(`Mismatched conditional blocks (Found ${ifBlocks} ifs, ${endIfBlocks} ends)`);
    }
  
    // 3. Switch Statement Validation
    const switchBlocks = (template.match(/{{#switch/g) || []).length;
    const endSwitchBlocks = (template.match(/{{\/switch}}/g) || []).length;
    
    if (switchBlocks !== endSwitchBlocks) {
      errors.push(`Mismatched switch blocks (Found ${switchBlocks} switches, ${endSwitchBlocks} ends)`);
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };