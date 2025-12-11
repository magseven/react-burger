import {
  selectCtorIngredients,
  selectBun,
  addBun,
  addIngredient,
  deleteIngredient,
} from '@/services/ctor-ingredients/reducer';
import { useAppSelector, useAppDispatch } from '@/services/store';
import {
  ConstructorElement,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { bunTopText, bunBottomText, TabNames } from '@utils/const';

import DropTarget from '../drop-target/drop-target';
import { SortableIngredient } from '../sortable-ingredient/sortable-ingredient';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  orderLoading: boolean;
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  orderLoading,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [bunTargetHovered, setBunTargetHovered] = useState(false);
  const ingredients = useAppSelector(selectCtorIngredients);
  const bun = useAppSelector(selectBun);

  useEffect(() => {
    if (bun) setBunTargetHovered(false);
  }, [bun]);
  const cost = useMemo(
    () =>
      ingredients.reduce((acc, ingr) => acc + ingr.price, 0) + (bun ? 2 * bun.price : 0),
    [ingredients, bun]
  );

  const dispatch = useAppDispatch();

  const handleDrop = (ingredient: TIngredient): void => {
    if (ingredient.type === TabNames.bun) dispatch(addBun(ingredient));
    else dispatch(addIngredient(ingredient));
  };

  const handleHover = (flag: boolean): void => {
    setBunTargetHovered(flag);
  };

  const handleClose = (id: string): void => {
    dispatch(deleteIngredient(id));
  };

  return (
    <section className={styles.burger_constructor}>
      {!bun ? (
        <DropTarget
          type={TabNames.bun}
          onDropHandler={handleDrop}
          onHoverHandler={handleHover}
        >
          <div
            className={`${styles['burger-constructor_blank_element']} 
                         ${styles['burger-constructor__top_blank_element']} 
                         text text_type_main-small ml-7 ${bunTargetHovered ? styles.hover_bun_border : ''}`}
          >
            Выберите булки
          </div>
        </DropTarget>
      ) : (
        <DropTarget type={TabNames.bun} onDropHandler={handleDrop}>
          <ConstructorElement
            extraClass={`${styles['burger-constructor__element-min-height']} ${styles.bun_text} ml-7`}
            text={`${bun.name}\n${bunTopText}`}
            price={bun.price}
            thumbnail={bun.image}
            type="top"
            isLocked={true}
          />
        </DropTarget>
      )}

      {!ingredients.length ? (
        <DropTarget type="ingredient" onDropHandler={handleDrop}>
          <div className={styles.burger_constructor_frame}>
            <div
              className={`${styles['burger-constructor_blank_element']} 
                         ${styles['burger-constructor__middle_blank_element']}  
                         text text_type_main-small ml-7`}
            >
              Выберите начинку
            </div>
          </div>
        </DropTarget>
      ) : (
        <DropTarget
          type="ingredient"
          onDropHandler={handleDrop}
          className={`${styles['burger-constructor__element-min-height']}`}
        >
          <div className={styles.burger_constructor_frame}>
            {ingredients
              .filter((ingr) => ingr.type !== TabNames.bun)
              .map((ingr, index) => (
                <SortableIngredient
                  extraClass={`${styles['burger-constructor__element-max-height']}`}
                  id={ingr.id!}
                  key={ingr.id}
                  text={ingr.name}
                  price={ingr.price}
                  thumbnail={ingr.image}
                  index={index}
                  handleClose={() => handleClose(ingr.id!)}
                />
              ))}
          </div>
        </DropTarget>
      )}
      {!bun ? (
        <DropTarget
          type={TabNames.bun}
          onDropHandler={handleDrop}
          onHoverHandler={handleHover}
        >
          <div
            className={`${styles['burger-constructor_blank_element']} 
                         ${styles['burger-constructor__bottom_blank_element']} 
                         text text_type_main-small ml-7 ${bunTargetHovered ? styles.hover_bun_border : ''}`}
          >
            Выберите булки
          </div>
        </DropTarget>
      ) : (
        <DropTarget type={TabNames.bun} onDropHandler={handleDrop}>
          <ConstructorElement
            extraClass={`${styles['burger-constructor__element-min-height']} ${styles.bun_text} ml-7`}
            text={`${bun.name}\n${bunBottomText}`}
            price={bun.price}
            thumbnail={bun.image}
            type="bottom"
            isLocked={true}
          />
        </DropTarget>
      )}
      <div className={styles.burger_constructor_total}>
        <div className={styles.burger_constructor_cost}>
          <span className="text text_type_digits-medium">{cost}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="medium"
          disabled={bun === null}
          onClick={onOrderClick}
        >
          {orderLoading ? 'Заказ оформляется' : 'Оформить заказ'}
        </Button>
      </div>
    </section>
  );
};
