export type TOrderRequest = {
  ingredients: string[];
};

export type TOrderResponse = {
  success: boolean;
  name: string;
  order: {
    createdAt: string;
    ingredients: string[];
    name: string;
    number: number;
  };
  _id: string;
  owner: {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

export type TOrderSummary = {
  _id: string;
  ingredients: string[];
  owner?: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  __v?: number;
};

export type TOrderSummaryRequest = {
  number: string;
};

export type TOrderSummaryResponse = {
  success: boolean;
  orders: TOrderSummary[];
};

export type OrderModalState = {
  isOpen: boolean;
  orderNumber: number | null;
};
