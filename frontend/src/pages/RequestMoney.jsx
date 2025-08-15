import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { SendDisplayUser } from "../components/SendDisplayUser";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const RequestMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [amount, setAmount] = useState("");
  const [tracker, setTracker] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "localhost:4000";

  async function requestMoneyFun() {
    // Reset states
    setError("");
    setSuccess(false);
    
    // Validation
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setTracker(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${apiUrl}/api/v1/bank/create/request`,
        {
          amount: Number(amount),
          toId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error requesting money:", error);
      setError("Failed to send request. Please try again.");
    } finally {
      setTracker(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Request Money</h1>
          <p className="text-slate-400 text-lg">
            Ask your friends to send you money
          </p>
        </div>

        {/* Request Money Form */}
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
                <p className="text-green-400 text-sm">Request sent successfully! Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Recipient Info */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Request from</h3>
              <SendDisplayUser />
            </div>

            {/* Amount Input */}
            <Inputbox
              onChange={(e) => setAmount(e.target.value)}
              lable="Amount (₹)"
              val="Enter amount to request"
              type="number"
              error={error && !amount ? "Amount is required" : ""}
            />

            <Button
              onClick={requestMoneyFun}
              lable={
                tracker ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin inline-block w-5 h-5 mr-3 border-2 border-current border-t-transparent text-white rounded-full" />
                    <span>Sending request...</span>
                  </div>
                ) : (
                  "Send Request"
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
            The recipient will be notified of your request
          </div>
        </div>
      </div>
    </div>
  );
};
