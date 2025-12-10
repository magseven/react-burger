import { selectIngredientById } from '@/services/ingredients/reducer';
import { useAppSelector } from '@/services/store';
import { useParams } from 'react-router-dom';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredientSelector = useAppSelector(selectIngredientById(id));

  if (!ingredientSelector) return <div>Ингредиент не найден!</div>;
  return (
    <div className={styles.container}>
      <img
        src={ingredientSelector.image_large}
        alt={`Изображение ${ingredientSelector.name}`}
      />
      <div className={`text text_type_main-default ${styles.textCenter}`}>
        {ingredientSelector.name}
      </div>

      <div className={`${styles.macronutrients} ${styles.textCenter} mt-10 mb-10`}>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">
            Калории, ккал
          </div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredientSelector.calories}
          </div>
        </div>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">Белки, г</div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredientSelector.proteins}
          </div>
        </div>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">Жиры, г</div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredientSelector.fat}
          </div>
        </div>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">
            Углеводы, г
          </div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredientSelector.carbohydrates}
          </div>
        </div>
      </div>
    </div>
  );
};
