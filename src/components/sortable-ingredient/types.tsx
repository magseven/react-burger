import type { TIngredient } from '../../utils/types';

export type SortableIngredientProps = {
  ingredient: TIngredient;
  index: number;
  moveIngredient: (from: number, to: number) => void;
  onIngredientClick?: (ingr: TIngredient) => void;
};
