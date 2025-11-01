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
}: TBurgerIngredientsGridProps): React.JSX.Element => {
  console.log(ingredients);

  return (
    <div className="mt-5 mb-5">
      <span className="text text_type_main-medium">{title}</span>
      <div className={styles.ingredients_grid}>
        {ingredients.map((ingr) => (
          <BurgerIngredient ingredient={ingr} key={ingr._id} />
        ))}
      </div>
    </div>
  );
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  console.log(ingredients);

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
          />
        ))}
      </div>
    </section>
  );
};
