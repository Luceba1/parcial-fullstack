import { createBrowserRouter } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import CategoriasPage from "../pages/CategoriasPage";
import IngredientesPage from "../pages/IngredientesPage";
import ProductoDetallePage from "../pages/ProductoDetallePage";
import ProductosPage from "../pages/ProductosPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <ProductosPage /> },
      { path: "categorias", element: <CategoriasPage /> },
      { path: "ingredientes", element: <IngredientesPage /> },
      { path: "productos", element: <ProductosPage /> },
      { path: "productos/:id", element: <ProductoDetallePage /> }
    ]
  }
]);
