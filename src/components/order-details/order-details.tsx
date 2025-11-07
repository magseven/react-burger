import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  return (
    <>
      <span className="text text_type_digits-large mb-4">034536</span>
      <span className="text text_type_main-default mb-6">Идентификатор заказа</span>
      <div className={styles.circle}>
        <CheckMarkIcon type="primary" />
      </div>
      <span className="text text_type_digits-small mt-6">Ваш заказ начали готовить</span>
      <span className="text text_type_main-small text_color_inactive mb-10">
        Дождитесь готовности на орбитальной станции
      </span>
    </>
  );
};
