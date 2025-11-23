import type { TabNames } from '@utils/const';
import type { TIngredient } from '@utils/types';

export type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingr: TIngredient) => void;
};

export type TBurgerIngredientsGridProps = {
  title: string;
  ingredients: TIngredient[];
  onIngredientClick: (ingr: TIngredient) => void;
};

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  onIngredientClick: (ingr: TIngredient) => void | null;
};

//export type TTab = 'bun' | 'main' | 'sauce';

export type TTab = (typeof TabNames)[keyof typeof TabNames];
