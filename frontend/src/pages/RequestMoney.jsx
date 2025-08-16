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
  const name = searchParams.get("name");
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
      <div className="min-h-[calc(100vh-64px)] overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text mb-1">Request Money</h1>
          </div>

          {/* Info banner */}
          {!id && (
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
          )}


          {/* Recipient form or user search */}
          <div className="mt-4">
            {id ? (
              <div className="card p-5 md:p-6 rounded-xl bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  {/* Recipient */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-xl text-base shadow-lg flex items-center justify-center ring-2 ring-white/20">
                        {(name || "U")[0].toUpperCase()}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-slate-900"></span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">Requesting from</p>
                      <h3 className="text-[15px] sm:text-base font-semibold text-white leading-tight">{name || "Unknown"}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] text-slate-400">Online now</span>
                      </div>
                    </div>
                  </div>
                  {/* Change recipient */}
                  <button onClick={() => navigate('/request')} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Change
                  </button>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.84A2 2 0 004.53 20h14.94a2 2 0 001.74-3.3L13.82 3.86a2 2 0 00-3.53 0z" /></svg>
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Request sent! Redirecting…</span>
                  </div>
                )}

                {/* Amount input */}
                <div className="mt-5 space-y-3.5">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">Amount (₹)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full h-12 px-3.5 pr-9 rounded-xl bg-slate-900/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[13px] text-slate-300 mb-1.5">Quick amounts</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[100, 500, 1000, 2000, 5000].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAmount(String(v))}
                          className="px-2.5 py-1.5 text[11px] rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 border border-white/10 shadow-sm hover:shadow-md transition"
                        >
                          ₹{v.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary action */}
                  <div className="pt-2">
                    <button
                      onClick={requestMoneyFun}
                      disabled={tracker}
                      className={`w-full h-11 rounded-xl text-white font-semibold shadow-lg transition ${tracker ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'} bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center gap-2`}
                      aria-label="Request money"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M4 10l6-6M20 14l-6 6" /></svg>
                      {tracker ? 'Requesting…' : `Request ₹${(Number(amount) || 0).toLocaleString('en-IN')}`}
                    </button>
                  </div>

                  {/* Footer info */}
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span>Secure transfer via encrypted connection</span>
                    </div>
                    <div className="text-right">
                      <span>Fee: ₹0</span>
                      <span className="mx-2">•</span>
                      <span>Instant request</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <UserSearch compact limit={6} />
            )}
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
