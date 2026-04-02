/**
 * 设备指纹生成工具
 * 基于浏览器特征生成唯一标识
 */

export function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || '',
    navigator.maxTouchPoints || '',
    // 屏幕颜色深度
    screen.colorDepth || '',
  ];
  
  // 简单的哈希函数
  let hash = 0;
  const str = components.join('|');
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // 添加随机后缀确保唯一性
  return `fp_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
}