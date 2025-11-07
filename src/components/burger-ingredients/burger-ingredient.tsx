import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import type { TBurgerIngredientProps } from './burger-ingredients.types';

import styles from './burger-ingredient.module.css';

export const BurgerIngredient = ({
  ingredient,
  onIngredientClick,
}: TBurgerIngredientProps): React.JSX.Element => {
  return (
    <div
      className={styles.burger_ingredient}
      onClick={() => onIngredientClick(ingredient)}
    >
      <Counter count={123} size="small" extraClass={styles.burger_ingredient_counter} />
      <img src={ingredient.image} alt={`Изображение ${ingredient.name}`} />
      <div className={styles.burger_ingredient_price}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <span className="text text_type_main-default text-align-center">
        {ingredient.name}
      </span>
    </div>
  );
};
