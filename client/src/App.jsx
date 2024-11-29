import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./router/route";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLoggedInUser } from "./features/auth/authApiSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("loginUser")) {
      dispatch(getLoggedInUser());
    }
  }, [dispatch]);

  useEffect(() => {
    // Redirect from root route to login
    if (window.location.pathname === "/") {
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <ToastContainer
        style={{ zIndex: "999999999" }}
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <RouterProvider router={router} />
    </>
  );
}

export default App;
