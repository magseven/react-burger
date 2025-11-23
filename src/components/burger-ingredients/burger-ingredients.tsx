import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import { TabNames } from '@utils/const';

import BurgerIngredientsGrid from './burger-ingredients-grid';

import type { TBurgerIngredientsProps, TTab } from './types';

import styles from './burger-ingredients.module.css';

const tabs = [
  { value: TabNames.bun as TTab, label: 'Булки' },
  { value: TabNames.main as TTab, label: 'Начинки' },
  { value: TabNames.sauce as TTab, label: 'Соусы' },
];

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TTab>();
  const tabRef = useRef<HTMLUListElement | null>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setTabRef =
    (index: number) =>
    (el: HTMLDivElement | null): void => {
      categoryRefs.current[index] = el;
    };

  const handleTabClick = (tab: TTab): void => {
    setCurrentTab(tab);
  };

  const handleTabScroll: React.UIEventHandler<HTMLDivElement> = () => {
    if (!tabRef?.current) return;

    let minDistance = Infinity;
    let catIndex = -1;
    const tabBottom = tabRef.current.getBoundingClientRect().bottom;
    categoryRefs.current.forEach((el, index) => {
      if (el) {
        const catTop = el.getBoundingClientRect().top;
        const distance = Math.abs(catTop - tabBottom); // абсолютное расстояние

        if (distance < minDistance) {
          minDistance = distance;
          catIndex = index;
        }
      }
    });

    if (catIndex !== -1) setCurrentTab(tabs[catIndex].value);
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu} ref={tabRef}>
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
      <div className={styles.burger_tab} onScroll={handleTabScroll}>
        {tabs.map((tab, index) => (
          <div ref={setTabRef(index)} key={index}>
            <BurgerIngredientsGrid
              title={tab.label}
              ingredients={ingredients.filter((ingr) => ingr.type === tab.value)}
              key={tab.value}
              onIngredientClick={onIngredientClick}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
