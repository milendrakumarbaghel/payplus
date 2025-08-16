import { Button } from "../components/Button";
import { Inputbox } from "../components/Inputbox";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { UserSearch } from "../components/UserSearch";
import { Layout } from "../components/Layout";

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
    <Layout>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="text-sm text-slate-400">
            <button onClick={() => navigate('/dashboard')} className="hover:text-slate-200 transition-colors">Dashboard</button>
            <span className="px-2">/</span>
            <span className="text-slate-300">Request</span>
          </div>
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

          {/* Info banner */}
          <div className="glass rounded-xl p-4 border border-slate-700/50 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm">Find a friend below and send them a payment request. They’ll be notified immediately.</p>
              </div>
            </div>
          </div>


          {/* User search */}
          <div className="mt-6">
            <UserSearch />
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
    </Layout>
  );
};
