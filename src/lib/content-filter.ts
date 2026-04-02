/**
 * Content Filter - 敏感词过滤模块
 */

const SENSITIVE_PATTERNS = [
  // 色情
  /porn|xxx|sex|nude|naked|erotic|adult/i,
  /色情|黄色|裸体|性交|成人|av|毛片/i,
  // 暴力
  /kill|murder|torture|rape|assault/i,
  /杀人|谋杀|血腥|虐待|殴打|自杀/i,
];

export interface FilterResult {
  isValid: boolean;
  category?: string;
  message?: string;
}

export function checkContent(text: string): FilterResult {
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        category: 'sensitive',
        message: 'Your input contains inappropriate content. Please revise and try again.'
      };
    }
  }
  return { isValid: true };
}
