import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Catalog } from "./components/Catalog";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Auth } from "./components/Auth";
import { Calculators } from "./components/Calculators";
import { About } from "./components/About";
import { Contacts } from "./components/Contacts";
import { NotFound } from "./components/NotFound";
import { Orders } from "./components/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "catalog", Component: Catalog },
      { path: "catalog/:category", Component: Catalog },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "auth", Component: Auth },
      { path: "calculators", Component: Calculators },
      { path: "about", Component: About },
      { path: "orders", Component: Orders },
      { path: "contacts", Component: Contacts },
      { path: "*", Component: NotFound },
    ],
  },
]);
