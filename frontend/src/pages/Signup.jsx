/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [tracker, setTracker] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "localhost:4000";

  async function signUpFun() {
    // Reset errors
    setErrors({});
    
    // Validation
    if (!firstName.trim()) {
      setErrors(prev => ({ ...prev, firstName: "First name is required" }));
      return;
    }
    if (!lastName.trim()) {
      setErrors(prev => ({ ...prev, lastName: "Last name is required" }));
      return;
    }
    if (!username.trim()) {
      setErrors(prev => ({ ...prev, username: "Email is required" }));
      return;
    }
    if (!password.trim()) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return;
    }
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
      return;
    }

    try {
      setTracker(true);
      const res = await axios.post(
        `${apiUrl}/api/v1/user/signup`,
        {
          username,
          password,
          firstName,
          lastName,
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      window.location.reload(false);
      setTracker(false);
    } catch (error) {
      console.log("Invalid credentials");
      setErrors({ general: "Failed to create account. Please try again." });
      setTracker(false);
    }
  }

  function toSignIn() {
    navigate("/signin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Join PayPlus</h1>
          <p className="text-slate-400 text-lg">
            Create your account and start sending money instantly
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="card p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inputbox
                onChange={(e) => setFirstName(e.target.value)}
                lable="First Name"
                val="Enter your first name"
                error={errors.firstName}
              />
              <Inputbox
                onChange={(e) => setLastName(e.target.value)}
                lable="Last Name"
                val="Enter your last name"
                error={errors.lastName}
              />
            </div>
            
            <Inputbox
              onChange={(e) => setUsername(e.target.value)}
              lable="Email Address"
              val="Enter your email"
              error={errors.username}
            />
            
            <Inputbox
              onChange={(e) => setpassword(e.target.value)}
              lable="Password"
              val="Create a password"
              type="password"
              error={errors.password}
            />

            <Button
              onClick={signUpFun}
              lable={
                tracker ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin inline-block w-5 h-5 mr-3 border-2 border-current border-t-transparent text-white rounded-full" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )
              }
              disabled={tracker}
            />
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={toSignIn}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-500 text-xs">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
