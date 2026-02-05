import { selectIngredientsByType } from '@/services/ingredients/reducer';
import { useAppSelector } from '@/services/store';
import { shallowEqual } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { BurgerIngredient } from './burger-ingredient';

import type { TBurgerIngredientsGridProps } from './types';

import styles from './burger-ingredients-grid.module.css';

const BurgerIngredientsGrid = ({
  title,
  type,
  onIngredientClick,
}: TBurgerIngredientsGridProps): React.JSX.Element => {
  const ingredients = useAppSelector(selectIngredientsByType(type), shallowEqual);
  const location = useLocation();
  return (
    <div className="mt-5 mb-5">
      <span className="text text_type_main-medium">{title}</span>
      <div className={styles.ingredients_grid}>
        {ingredients.map((ingr) => (
          <Link
            style={{ textDecoration: 'none', color: 'white' }}
            key={ingr._id}
            to={`/ingredient/${ingr._id}`}
            state={{ backgroundLocation: location }}
            data-testid={`ingredient-${type}`}
          >
            <BurgerIngredient
              key={ingr._id}
              ingredient={ingr}
              onIngredientClick={onIngredientClick}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BurgerIngredientsGrid;
