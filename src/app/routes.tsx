import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { TableDetail } from "./pages/TableDetail";
import { CounterSale } from "./pages/CounterSale";
import { Products } from "./pages/Products";
import { Reports } from "./pages/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "table/:id", Component: TableDetail },
      { path: "counter", Component: CounterSale },
      { path: "products", Component: Products },
      { path: "reports", Component: Reports },
    ],
  },
]);
