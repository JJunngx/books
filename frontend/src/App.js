import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Root from "./layout/Root";
import SearchProvider from "./context/seachContext";
import { ToastContainer } from "react-toastify";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Cart = lazy(() => import("./pages/Cart"));
const SearchBook = lazy(() => import("./pages/SearchBook"));
const DetailBook = lazy(() => import("./pages/DetailBooks"));
const Checkout = lazy(() => import("./pages/Checkout"));
const History = lazy(() => import("./pages/History"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "cart", element: <Cart /> },
      { path: "searchBook", element: <SearchBook /> },
      { path: "detailbook/:id", element: <DetailBook /> },
      { path: "checkout", element: <Checkout /> },
      { path: "history", element: <History /> },
    ],
  },
]);
function App() {
  return (
    <Suspense>
      <HelmetProvider>
        <SearchProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </SearchProvider>
      </HelmetProvider>
    </Suspense>
  );
}

export default App;
