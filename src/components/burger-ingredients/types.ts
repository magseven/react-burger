import type { TabNames } from '@utils/const';
import type { TIngredient } from '@utils/types';

export type TBurgerIngredientsProps = {
  onIngredientClick: (ingr: TIngredient) => void;
};

export type TBurgerIngredientsGridProps = {
  title: string;
  type: TTab;
  onIngredientClick: (ingr: TIngredient) => void;
};

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  onIngredientClick: (ingr: TIngredient) => void | null;
};

export type TTab = (typeof TabNames)[keyof typeof TabNames];
