import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Root from "./layout/Root";
const Books = lazy(() => import("./pages/Books"));
const Login = lazy(() => import("./pages/Login"));
const CreateBook = lazy(() => import("./pages/CreateBook"));
const EditBook = lazy(() => import("./pages/EditBook"));
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Books /> },
        { path: "editBook/:id", element: <EditBook /> },
        { path: "createBook", element: <CreateBook /> },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);
  return (
    <HelmetProvider>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
