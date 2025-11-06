import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  bun: TIngredient;
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  bun,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const cost = useMemo(
    () => ingredients.reduce((acc, ingr) => acc + ingr.price, 0) + 2 * bun.price,
    [ingredients, bun]
  );

  return (
    <section className={styles.burger_constructor}>
      <ConstructorElement
        extraClass="ml-7"
        text={bun.name}
        price={bun.price}
        thumbnail={bun.image}
        type="top"
        isLocked={true}
      />
      <div className={styles.burger_constructor_frame}>
        {ingredients
          .filter((ingr) => ingr.type !== 'bun')
          .map((ingr) => (
            <div className={styles.burger_constructor_line} key={ingr._id}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={ingr.name}
                price={ingr.price}
                thumbnail={ingr.image}
              />
            </div>
          ))}
      </div>
      <ConstructorElement
        extraClass="ml-7"
        text={bun.name}
        price={bun.price}
        thumbnail={bun.image}
        type="bottom"
        isLocked={true}
      />
      <div className={styles.burger_constructor_total}>
        <div className={styles.burger_constructor_cost}>
          <span className="text text_type_digits-medium">{cost}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="medium" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
