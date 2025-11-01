import type { TIngredient } from '@utils/types';

export type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export type TBurgerIngredientsGridProps = {
  title: string;
  ingredients: TIngredient[];
};

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
};

export type TTab = 'bun' | 'main' | 'sauce';
