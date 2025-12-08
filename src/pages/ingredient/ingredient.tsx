import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@/utils/types';

export const IngredientPage = ({
  ingredients,
}: {
  ingredients: TIngredient[];
}): React.JSX.Element => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (!ingredients.length) return <div>Загружается список ингредиентов...</div>;

  const ingredientShowDetails = ingredients.find((ing) => ing._id === id);

  if (!ingredientShowDetails) return <div>Ингредиент не найден</div>;

  return <IngredientDetails ingredient={ingredientShowDetails} />;
};
