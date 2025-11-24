import { selectCtorCounter } from '@/services/ctor-ingredients/reducer';
import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import { TabNames, ingredientName } from '@utils/const';

import type { TBurgerIngredientProps } from './types';

import styles from './burger-ingredient.module.css';

export const BurgerIngredient = ({
  ingredient,
  onIngredientClick,
}: TBurgerIngredientProps): React.JSX.Element => {
  const counters = useSelector(selectCtorCounter);

  const [, dragRef] = useDrag(() => ({
    type: ingredient.type === TabNames.bun ? ingredient.type : ingredientName,
    item: ingredient,
  }));

  return (
    <div
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      className={styles.burger_ingredient}
      onClick={() => onIngredientClick(ingredient)}
    >
      {counters[ingredient._id] && (
        <Counter
          count={counters[ingredient._id]}
          size="small"
          extraClass={styles.burger_ingredient_counter}
        />
      )}
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
