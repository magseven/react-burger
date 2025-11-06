import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { BurgerIngredient } from './burger-ingredient';

import type {
  TBurgerIngredientsProps,
  TBurgerIngredientsGridProps,
  TTab,
} from './burger-ingredients.types';

import styles from './burger-ingredients.module.css';

const tabs = [
  { value: 'bun' as TTab, label: 'Булки' },
  { value: 'main' as TTab, label: 'Начинки' },
  { value: 'sauce' as TTab, label: 'Соусы' },
];

export const BurgerIngredientsGrid = ({
  ingredients,
  title,
  onIngredientClick,
}: TBurgerIngredientsGridProps): React.JSX.Element => {
  return (
    <div className="mt-5 mb-5">
      <span className="text text_type_main-medium">{title}</span>
      <div className={styles.ingredients_grid}>
        {ingredients.map((ingr) => (
          <BurgerIngredient
            key={ingr._id}
            ingredient={ingr}
            onIngredientClick={onIngredientClick}
          />
        ))}
      </div>
    </div>
  );
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const handleTabClick = (tab: TTab): void => {
    setCurrentTab(tab);
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              active={currentTab === tab.value}
              onClick={() => handleTabClick(tab.value)}
            >
              {tab.label}
            </Tab>
          ))}
        </ul>
      </nav>
      <div className={styles.burger_tab}>
        {tabs.map((tab) => (
          <BurgerIngredientsGrid
            title={tab.label}
            ingredients={ingredients.filter((ingr) => ingr.type === tab.value)}
            key={tab.value}
            onIngredientClick={onIngredientClick}
          />
        ))}
      </div>
    </section>
  );
};
