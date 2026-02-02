import type { TFeedSummaryProps } from './types';

import styles from './feed-summary.module.css';
export const FeedSummary = (props: TFeedSummaryProps): React.JSX.Element => {
  const { orders, total, totalToday } = props;
  const doneOrders = orders.filter((ord) => ord.status === 'done').slice(0, 20);
  const firstColumn = doneOrders.slice(0, 10);
  const secondColumn = doneOrders.slice(10, 20);

  return (
    <div className={styles.frame}>
      <div className={styles.orders}>
        <div className={styles.ready_orders}>
          <div className="text text_type_digits-small">Готовы:</div>
          <div className={styles.ready_columns}>
            <div className={styles.ready_column}>
              {firstColumn.map((ord) => (
                <div
                  className="text text_type_digits-small text_color_inactive"
                  key={ord._id}
                >
                  {ord.number}
                </div>
              ))}
            </div>

            {secondColumn.length > 0 && (
              <div className={styles.ready_column}>
                {secondColumn.map((ord) => (
                  <div
                    className="text text_type_digits-small text_color_inactive"
                    key={ord._id}
                  >
                    {ord.number}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.doing_orders}>
          <div className="text text_type_digits-small">В работе:</div>
          <div className={styles.ready_column}>
            {orders
              .filter((ord) => ord.status === 'pending')
              .map((ord) => {
                return (
                  <div className="text text_type_digits-small" key={ord._id}>
                    {ord.number}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className={`${styles.alltime}}`}>
        <div className="text text_type_main-small mt-6">Выполнено за все время:</div>
        <div className="text text_type_digits-medium">{total}</div>
      </div>
      <div className={`${styles.today} mt-6`}>
        <div className="text text_type_main-small mt-12">Выполнено за сегодня:</div>
        <div className="text text_type_digits-medium">{totalToday}</div>
      </div>
    </div>
  );
};
