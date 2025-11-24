import { selectIngredientsByType } from '@/services/ingredients/api';
import { useSelector } from 'react-redux';

import { BurgerIngredient } from './burger-ingredient';

import type { TBurgerIngredientsGridProps } from './types';

import styles from './burger-ingredients-grid.module.css';

const BurgerIngredientsGrid = ({
  title,
  type,
  onIngredientClick,
}: TBurgerIngredientsGridProps): React.JSX.Element => {
  const ingredients = useSelector(selectIngredientsByType(type));

  return (
    <div className="mt-5 mb-5">
      <span className="text text_type_main-medium">{title}</span>
      <div className={styles.ingredients_grid}>
        {ingredients.map((ingr) => (
          <BurgerIngredient
            key={ingr._id}
            ingredient={ingr}
            onIngredientClick={onIngredientClick}
          />
        ))}
      </div>
    </div>
  );
};

export default BurgerIngredientsGrid;
