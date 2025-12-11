export type TOrderRequest = {
  ingredients: string[];
};

// export type TOrderResponse = {
//   name: string;
//   order: {
//     number: number;
//   };
//   success: boolean;
// };

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

export type OrderModalState = {
  isOpen: boolean;
  orderNumber: number | null;
};
