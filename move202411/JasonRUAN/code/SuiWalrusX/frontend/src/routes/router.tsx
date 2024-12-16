import { createBrowserRouter, Navigate } from "react-router-dom";

import { Root } from "./root";
import WalrusXDashboard from "./WalrusXDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <WalrusXDashboard />,
      },
    ],
  },
]);
