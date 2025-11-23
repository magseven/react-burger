export type TOrderRequest = {
  ingredients: string[];
};

export type TOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type OrderModalState = {
  isOpen: boolean;
  orderNumber: number | null;
};
