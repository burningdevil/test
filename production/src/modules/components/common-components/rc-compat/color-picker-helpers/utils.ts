import { DIRECTION } from './enums';

export const getGradientColorString = (gConfig: { colorA: string; colorB: string; direction: string; }) => `${gConfig.colorA.substr(1)},${gConfig.colorB.substr(1)},14,${gConfig.direction === DIRECTION.VERTICAL ? '0' : '90'},0,0`;
export const getGradientLinearBackgroundString = (gConfig: { direction: string; colorA: any; colorB: any; }) => `${gConfig.direction === DIRECTION.VERTICAL ? 'to right' : 'to bottom'}, ${gConfig.colorA}, ${gConfig.colorB}`;

/**
 * Check if a color is a gradient.
 * @param {string | object} color - The color whose value is being checked if it's a gradient.
 * @returns true if the color has an A color, a B color, and a direction. False otherwise.
 */
export const isColorGradient = (color: { colorA: any; colorB: any; direction: any; }) => (
  !!(typeof color === 'object'
  && color.colorA
  && color.colorB
  && color.direction)
);

/**
 * Check if two gradients are the same.
 * @param {object} gConfig1 - First gradient being compared.
 * @param {object} gConfig2 - Second gradient being compared.
 * @returns true if both gradients have the same color A, color B, and direction. False otherwise.
 */
export const gradientEquals = (gConfig1: { colorA: any; colorB: any; direction: any; }, gConfig2: { colorA: any; colorB: any; direction: any; }) => (
  isColorGradient(gConfig1)
  && isColorGradient(gConfig2)
  && gConfig1.colorA === gConfig2.colorA
  && gConfig1.colorB === gConfig2.colorB
  && gConfig1.direction === gConfig2.direction
);

/**
 * Break up the favorites into two lists: A list of solid colors and a list of gradient colors.
 * @param {array<string | object>} favorites - Array that can contain both solid and gradient colors.
 * @returns an object containing the list of solid colors and the list of gradient colors.
 */
export const getSplitFavorites = (favorites: any[]) => {
  const solidFavorites: any[] = [];
  const gradientFavorites: any[] = [];

  favorites.forEach((currColor: any) => {
    if (isColorGradient(currColor)) {
      gradientFavorites.push(currColor);
    } else {
      solidFavorites.push(currColor);
    }
  });

  return { solidFavorites, gradientFavorites };
};
