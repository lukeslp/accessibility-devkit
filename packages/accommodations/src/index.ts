import colorBlind from 'color-blind';

export const simulateColorBlindness = (hexColor: string, type: 'protan' | 'deutan' | 'tritan') => {
  return colorBlind[type](hexColor);
};

console.log('Accessibility Devkit Accommodations package loaded.');
