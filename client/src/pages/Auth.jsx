import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Auth = () => {
  const [state, setState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const handleFormValidation = () => {
    let isValid = true;

    if (state === "Sign Up" && name.trim() === "") {
      setNameError(true);
      toast.warn("Name is required");
      isValid = false;
      return;
    } else {
      setNameError(false);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError(true);
      toast.warn("Enter a valid email");
      isValid = false;
      return;
    } else {
      setEmailError(false);
    }

    if (password.length < 6) {
      setPasswordError(true);
      toast.warn("Password must be at least 6 characters");
      isValid = false;
      return;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const isValid = handleFormValidation();

    if (!isValid) return;

    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-300">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-200 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign In" ? "Sign In" : "Create Account"}
        </h2>

        <p className="text-center text-sm mb-6">
          {state === "Sign In"
            ? "Sign in to your account"
            : "Create your account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <>
              <div
                className={`mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ${
                  nameError ? "border-1 border-red-500" : ""
                }`}
              >
                <img src={assets.person_icon} alt="" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                  className="bg-transparent outline-none"
                />
              </div>
            </>
          )}

          <div
            className={`mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ${
              emailError ? "border-1 border-red-500" : ""
            }`}
          >
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email id"
              required
              className="bg-transparent outline-none"
            />
          </div>

          <div
            className={`mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ${
              passwordError ? "border-1 border-red-500" : ""
            }`}
          >
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
            />
          </div>

          <p
            className="mb-4 text-indigo-400 cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => {
                setState("Sign In");
                setName("");
                setEmail("");
                setPassword("");
              }}
            >
              Sign in
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline"
              onClick={() => {
                setState("Sign Up");
                setName("");
                setEmail("");
                setPassword("");
              }}
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
