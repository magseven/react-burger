import { getIngredients } from '@/api/ingredients';
import { useState, useEffect, useCallback } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@utils/types.ts';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState([] as TIngredient[]);
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState<null | TIngredient>(null);
  const [orderClicked, setOrderCLicked] = useState(false);

  const handleIngredientClick = (ingredient: TIngredient): void => {
    setSelectedIngredient(ingredient);
  };

  const handleOrderClick = (): void => {
    setOrderCLicked(true);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedIngredient(null);
    setOrderCLicked(false);
  }, []);

  useEffect(() => {
    async function loadIngredients(): Promise<void> {
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (err) {
        console.log('Отсутствует список ингредиентов', err);
      } finally {
        setLoading(false);
      }
    }

    void loadIngredients();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients
          ingredients={ingredients}
          onIngredientClick={handleIngredientClick}
        />
        <BurgerConstructor
          ingredients={ingredients}
          bun={ingredients[0]}
          onOrderClick={handleOrderClick}
        />
      </main>
      {selectedIngredient && (
        <Modal isOpen={true} onClick={handleCloseModal} title="Детали ингредиента">
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {orderClicked && (
        <Modal isOpen={true} onClick={handleCloseModal} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
