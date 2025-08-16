import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Inputbox } from "../components/Inputbox";
import { Subheading } from "../components/Subheading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthLayout } from "../components/AuthLayout";

const apiUrl = import.meta.env.VITE_API_URL || "localhost:4000";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [tracker, setTracker] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function signInFun() {
    // Reset errors
    setErrors({});

    // Validation
    if (!username.trim()) {
      setErrors(prev => ({ ...prev, username: "Email is required" }));
      return;
    }
    if (!password.trim()) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      setTracker(true);
      const res = await axios.post(
        `${apiUrl}/api/v1/user/signin`,
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      window.location.reload(false);
      setTracker(false);
    } catch (error) {
      setErrors({ general: "Invalid credentials. Please try again." });
      setTracker(false);
    }
  }

  return (
    <AuthLayout quote="Fast, secure, and effortless payments—anytime, anywhere." author="PayPlus">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-lg">Sign in to your PayPlus account</p>
        </div>

        <div className="card p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            <Inputbox
              onChange={(e) => setUsername(e.target.value)}
              lable="Email Address"
              val="Enter your email"
              error={errors.username}
            />

            <Inputbox
              onChange={(e) => setpassword(e.target.value)}
              lable="Password"
              val="Enter your password"
              type="password"
              error={errors.password}
            />

            <Button
              onClick={signInFun}
              lable={
                tracker ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin inline-block w-5 h-5 mr-3 border-2 border-current border-t-transparent text-white rounded-full" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )
              }
              disabled={tracker}
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const token = credentialResponse.credential;

                  try {
                    const res = await axios.post(`${apiUrl}/api/v1/user/google-auth`, {
                      token,
                    });

                    localStorage.setItem("token", res.data.token);
                    navigate("/dashboard");
                    window.location.reload(false);
                  } catch (err) {
                    console.error("Google Sign-In Failed", err);
                    setErrors({ general: "Google sign-in failed. Please try again." });
                  }
                }}
                onError={() => {
                  console.log("Google Login Failed");
                  setErrors({ general: "Google login failed. Please try again." });
                }}
              />
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-xs">By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </AuthLayout>
  );
};
