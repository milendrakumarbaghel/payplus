import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

import { UserSearch } from "../components/UserSearch";
import { Layout } from "../components/Layout";
export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const defaultAmount = searchParams.get("amount");
  const requestId = searchParams.get("requestId");
  const [amount, setAmount] = useState(defaultAmount || "");
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
      const reqId = searchParams.get('requestId');

      if (reqId) {
        // Fulfill flow: server uses the stored requested amount and deletes the request
        await axios.post(
          `${apiUrl}/api/v1/bank/request/fulfill/${reqId}`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      } else {
        // Normal send money flow
        await axios.post(
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
      }

      setSuccess(true);
      // Notify other components to refresh (e.g., Appbar notifications)
      window.dispatchEvent(new Event('payplus:refresh'));
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Transfer failed:", error);
      setError("Transfer failed. Please try again.");
    } finally {
      setTracker(false);
    }
  }

  return (
    <Layout>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="text-sm text-slate-400">
            <button onClick={() => navigate('/dashboard')} className="hover:text-slate-200 transition-colors">Dashboard</button>
            <span className="px-2">/</span>
            <span className="text-slate-300">Send</span>
          </div>
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

          {/* Info banner */}
          <div className="glass rounded-xl p-4 border border-slate-700/50 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm">Select a user below to start a transfer. Use the search bar to quickly find friends by name or email.</p>
              </div>
            </div>
          </div>


          {/* User search */}
          <div className="mt-6">
            <UserSearch />
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
    </Layout>
  );
};
