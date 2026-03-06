declare module 'color-blind' {
  /**
   * Simulates color blindness on a hex color string.
   * Each function returns the transformed hex string as perceived by
   * someone with the corresponding color vision deficiency.
   */
  const colorBlind: {
    protanopia(hex: string): string;
    deuteranopia(hex: string): string;
    tritanopia(hex: string): string;
    achromatopsia(hex: string): string;
    protanomaly(hex: string): string;
    deuteranomaly(hex: string): string;
    tritanomaly(hex: string): string;
  };
  export = colorBlind;
}
