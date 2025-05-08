/**
 * Categorizes company by employee count
 * @param {string} count - Form input value
 * @returns {object} { tier: string, exactCount: number }
 */
export function getEmployeeTier(count) {
    const num = parseInt(count);
    if (isNaN(num)) throw new Error("Invalid employee count");
  
    return {
      tier: num <= 10 ? 'micro' :
            num <= 50 ? 'small' :
            num <= 100 ? 'medium' :
            num <= 500 ? 'large' : 'enterprise',
      exactCount: num
    };
  }
  
  /**
   * Formats policy dates consistently
   */
  export function formatPolicyDate(date = new Date()) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }