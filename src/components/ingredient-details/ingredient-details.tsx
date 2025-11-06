import type { TIngredientDetailsProps } from '@utils/types.ts';

import styles from './ingredient-details.module.css';

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  return (
    <>
      <img src={ingredient.image_large} alt={`Изображение ${ingredient.name}`} />
      <span className="text text_type_main-default">{ingredient.name}</span>
      <div className={`${styles.macronutrients} mt-10 mb-10`}>
        <div className={styles.macronutrient}>
          <span className="text text_type_main-small text_color_inactive">
            Калории, ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </span>
        </div>
        <div className={styles.macronutrient}>
          <span className="text text_type_main-small text_color_inactive">Белки, г</span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </span>
        </div>
        <div className={styles.macronutrient}>
          <span className="text text_type_main-small text_color_inactive">Жиры, г</span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </span>
        </div>
        <div className={styles.macronutrient}>
          <span className="text text_type_main-small text_color_inactive">
            Углеводы, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </span>
        </div>
      </div>
    </>
  );
};
