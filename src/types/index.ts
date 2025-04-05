export type Category = {
  id: string;
  name: string;
};

export type Book = {
  name: string;
  id: string;
  author: string;
  imageUrl: string;
  price: number;
};

export type BookWithCategory = {
  name: string;
  id: string;
  author: string;
  categoryId: string;
  imageUrl: string;
  price: number;
  price2: number;
  price3: number;
};

export type OrdersType = {
  id: string;
  status: "NEW" | "INPROGRESS" | "CANCELED" | "COMPLETED";
  createdAt: Date;
  userId: string;
  phoneNumber: string;
  fullName: string;
  user: {
    id: string;
    telegramId: string;
    username?: string | null;
    firstName: string;
    lastName?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  orderItems: {
    id: string;
    orderId: string;
    bookId: string;
    quantity: number;
    book: {
      id: string;
      name: string;
      author: string;
      imageUrl: string;
      price: number;
      price2: number;
      price3: number;
    };
  }[];
};

export type PageWithSearchbooks = {
  products: Book[];
  totalPages: number;
  currentPage: number;
};

export type PageWithOrders = {
  products: OrdersType[];
  totalPages: number;
  currentPage: number;
};

// NEW TYPES

export type BookCategory = {
  id: string;
  name: string;
};
export type BookType = {
  id: string;
  name: string;
};

export type Author = {
  id: string;
  fullName: string;
  definition: string;
};

export type AdminBooks = {
  id: string;
  name: string;
  productType: {
    id: number;
    name: string;
  };
  productCategory: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    fullName: string;
    definition: string;
  };
  photo: {
    id: string;
    prefix: string;
    name: string;
  };
  price: number;
  salePrice: number;
  quantity: number;
  description: string;
  about: string;
};

export type Operator = {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  phoneNumber: string;
  role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR";
};
export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  phoneNumber: string;
  role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR";
};

export type BookPage = {
  id: string;
  book: {
    id: number;
    name: string;
    productType: {
      id: number;
      name: string;
    };
    productCategory: {
      id: number;
      name: string;
    };
    author: {
      id: number;
      fullName: string;
      definition: string;
    };
    photo: {
      id: string;
      prefix: string;
      name: string;
    };
    price: number;
    salePrice: number;
    quantity: number;
    description: string;
    about: string;
  };
  pageNumber: number;
  content: string;
};

export type HomeBook = {
  id: string;
  productCategoryId: string;
  quantity: number;
  salePrice: number;
  price: number;
  name: string;
  about: string;
  description: string;
  photo: {
    prefix: string;
    name: string;
  };
  authorId: string;
  productTypeId: string;
  rating: number;
};

export type BookWithType = {
  id: string;
  typeName: string;
  products: HomeBook[];
};

export type Review = {
  id: string;
  userFullName: string;
  product: {
    rating: number;
  };
  rating: number;
  review: string;
};

type OrderProduct = {
  price: number;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
};

export type Order = {
  orderId: string;
  customerFullName: string;
  customerPhoneNumber: string;
  products: OrderProduct[];
  totalPrice: number;
  status: "IN_PROGRESS" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
};

export type User = {
  firstName: string;
  lastName: string;
  birthYear: number;
  phoneNumber: string;
  role: "USER";
};
