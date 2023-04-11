export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count?: number
}

export interface ProductPost {
  title: string;
  description: string;
  price: number;
  count: number;
}

export type Stock = {
  product_id: Product['id'];
  count: number;
};

export interface ProductsList {
  products: Array<Product>;
}

export interface Error {
  message: string;
}

export interface InfoResponse {
  message: string
}
