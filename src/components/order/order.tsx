import { selectIngredientsByIds } from '@/services/ingredients/reducer';
import { useAppSelector } from '@/services/store';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TOrderProps } from './types';

import styles from './order.module.css';
const MAX_INGREDIENTS_DISPLAYED = 6;
export const Order = (props: TOrderProps): React.JSX.Element => {
  const { number, createdAt, name, ingredients, statusFlag, status } = props;
  const ingredientsSelector = useAppSelector(selectIngredientsByIds(ingredients));
  const totalPrice = useMemo(
    () => ingredientsSelector.reduce((acc, ingr) => acc + ingr.price, 0),
    [ingredientsSelector]
  );
  const hiddenIngredientsCount = useMemo(
    () => Math.max(0, ingredientsSelector.length - MAX_INGREDIENTS_DISPLAYED),
    [ingredientsSelector]
  );
  return (
    <div className={styles.frame}>
      <div className={styles.order_num_data}>
        <p className="text text_type_digits-default">{`#${number}`}</p>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(createdAt)} />
        </p>
      </div>
      <div className="text text_type_main-small">{name}</div>
      {statusFlag && (
        <div className="text text_type_main-small text_color_inactive mb-2">
          {status}
        </div>
      )}
      <div className={styles.ingredients}>
        <div className={styles.images}>
          {ingredientsSelector.slice(0, MAX_INGREDIENTS_DISPLAYED).map((ingr, index) => (
            <div key={`${ingr._id}-${index}`} className={styles.ingredient_img}>
              <img
                src={ingr.image}
                className={
                  index === MAX_INGREDIENTS_DISPLAYED - 1 && hiddenIngredientsCount > 0
                    ? styles.hidden_img
                    : ''
                }
              />
              {index === MAX_INGREDIENTS_DISPLAYED - 1 && hiddenIngredientsCount > 0 && (
                <span className="text text_type_main-small">{`+${hiddenIngredientsCount}`}</span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
