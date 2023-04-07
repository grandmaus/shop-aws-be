export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface ProductsList {
  products: Array<Product>;
}

export interface Error {
  message: string;
}
