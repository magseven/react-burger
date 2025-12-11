import { Preloader } from '@krgaa/react-developer-burger-ui-components';

export const OrderLoading = (): React.JSX.Element => {
  return (
    <>
      <div className={'text text_type_main-medium mb-4'}>Оформляем заказ ...</div>
      <div>
        <Preloader />
      </div>
    </>
  );
};
