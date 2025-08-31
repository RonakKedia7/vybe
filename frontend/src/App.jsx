import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useUser } from "./context/userContext";

import LoadingScreen from "./components/LoadingScreen";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import Loops from "./pages/Loops";
import Story from "./pages/Story";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import Search from "./pages/Search";

const App = () => {
  const { userData, loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#020202", // Slightly lighter black for contrast
          color: "#ffffff",
          borderRadius: "0px", // Softer rounded corners
          fontFamily: "'Inter', sans-serif",
          fontSize: "19px",
          fontWeight: 400, // Normal weight for readability
          padding: "12px 16px", // Balanced padding
        }}
        closeButton={false}
      />
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" replace />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile/:userName"
          element={userData ? <Profile /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/story/:userName"
          element={userData ? <Story /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/upload"
          element={userData ? <Upload /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/editprofile"
          element={
            userData ? <EditProfile /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/messages"
          element={userData ? <Messages /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/message/:receiverId"
          element={
            userData ? <MessageArea /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/loops"
          element={userData ? <Loops /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/search"
          element={userData ? <Search /> : <Navigate to="/signin" replace />}
        />
      </Routes>
    </>
  );
};

export default App;
