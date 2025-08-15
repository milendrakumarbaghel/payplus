import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { SendDisplayUser } from "../components/SendDisplayUser";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [amount, setAmount] = useState("");
  const [tracker, setTracker] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "localhost:4000";

  async function sendMoneyFun() {
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
      const res = await axios.post(
        `${apiUrl}/api/v1/bank/transfer`,
        {
          amount_to_transfer: Number(amount),
          paye_id: id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      
      if (res.data.msg === "Transfer successful") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Transfer failed:", error);
      setError("Transfer failed. Please try again.");
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Send Money</h1>
          <p className="text-slate-400 text-lg">
            Transfer money to your friends instantly
          </p>
        </div>

        {/* Send Money Form */}
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
                <p className="text-green-400 text-sm">Money transferred successfully! Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Recipient Info */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Recipient</h3>
              <SendDisplayUser />
            </div>

            {/* Amount Input */}
            <Inputbox
              onChange={(e) => setAmount(e.target.value)}
              lable="Amount (₹)"
              val="Enter amount to send"
              type="number"
              error={error && !amount ? "Amount is required" : ""}
            />

            <Button
              onClick={sendMoneyFun}
              variant="success"
              lable={
                tracker ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin inline-block w-5 h-5 mr-3 border-2 border-current border-t-transparent text-white rounded-full" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Send Money"
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

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center text-slate-500 text-xs">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure transfer powered by PayPlus
          </div>
        </div>
      </div>
    </div>
  );
};
