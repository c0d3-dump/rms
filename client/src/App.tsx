import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/local/dashboard";
import Employees from "./components/local/employees";
import Items from "./components/local/items";
import Tables from "./components/local/tables";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/local/header";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Dashboard,
    },
    {
      path: "/employees",
      Component: Employees,
    },
    {
      path: "/items",
      Component: Items,
    },
    {
      path: "/tables",
      Component: Tables,
    },
  ]);
  return (
    <>
      <Header></Header>

      <div className="ml-64 p-2">
        <RouterProvider router={router}></RouterProvider>
      </div>
      <Toaster></Toaster>
    </>
  );
}

export default App;
