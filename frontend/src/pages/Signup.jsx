/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";

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
    <AuthLayout quote="Money moves at the speed of trust—built into every PayPlus transfer." author="PayPlus">
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-4xl font-bold gradient-text mb-2">Join PayPlus</div>
          <p className="text-slate-400 text-lg">Create your account and start sending money instantly</p>
        </div>

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

        <div className="text-center">
          <p className="text-slate-500 text-xs">By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </AuthLayout>
  );
};
