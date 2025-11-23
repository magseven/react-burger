import type { TIngredient } from '@/utils/types';

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};
