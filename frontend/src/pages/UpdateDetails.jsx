/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UpdateDetails = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setpassword] = useState("");
  const [tracker, setTracker] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const getPayload = () => {
    const payload = {};
    if (password) payload.password = password;
    if (firstName) payload.firstName = firstName;
    if (lastName) payload.lastName = lastName;
    return payload;
  };

  const apiUrl = import.meta.env.VITE_API_URL || "localhost:4000";

  async function updateFun() {
    // Reset states
    setError("");
    setSuccess(false);
    
    // Validation
    const payload = getPayload();
    if (Object.keys(payload).length === 0) {
      setError("Please fill in at least one field to update");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setTracker(true);
      const res = await axios.put(
        `${apiUrl}/api/v1/user/user-update`,
        {
          payload,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload(false);
      }, 2000);
      
      setTracker(false);
    } catch (error) {
      console.log("Update failed:", error);
      setError("Failed to update profile. Please try again.");
      setTracker(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Update Profile</h1>
          <p className="text-slate-400 text-lg">
            Update your account information
          </p>
        </div>

        {/* Update Form */}
        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-400 text-sm">Profile updated successfully! Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inputbox
                onChange={(e) => setFirstName(e.target.value)}
                lable="First Name"
                val="Enter new first name"
              />
              <Inputbox
                onChange={(e) => setLastName(e.target.value)}
                lable="Last Name"
                val="Enter new last name"
              />
            </div>
            
            <Inputbox
              onChange={(e) => setpassword(e.target.value)}
              lable="New Password"
              val="Enter new password (optional)"
              type="password"
            />

            <Button
              onClick={updateFun}
              variant="secondary"
              lable={
                tracker ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin inline-block w-5 h-5 mr-3 border-2 border-current border-t-transparent text-white rounded-full" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Profile"
                )
              }
              disabled={tracker || success}
            />
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-400 hover:text-slate-300 font-medium transition-colors duration-200"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Info Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center text-slate-500 text-xs">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Leave fields empty if you don't want to change them
          </div>
        </div>
      </div>
    </div>
  );
};
