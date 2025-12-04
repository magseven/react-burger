import type { TIngredientDetailsProps } from '@utils/types.ts';

import styles from './ingredient-details.module.css';

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <img src={ingredient.image_large} alt={`Изображение ${ingredient.name}`} />
      <div className={`text text_type_main-default ${styles.textCenter}`}>
        {ingredient.name}
      </div>

      <div className={`${styles.macronutrients} ${styles.textCenter} mt-10 mb-10`}>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">
            Калории, ккал
          </div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </div>
        </div>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">Белки, г</div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </div>
        </div>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">Жиры, г</div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </div>
        </div>
        <div className={`${styles.macronutrient} ${styles.textCenter}`}>
          <div className="text text_type_main-small text_color_inactive">
            Углеводы, г
          </div>
          <div className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </div>
        </div>
      </div>
    </div>
  );
};
