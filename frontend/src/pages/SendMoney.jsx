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
  const name = searchParams.get("name");
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
      <div className="min-h-[calc(100vh-64px)] overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text mb-1">Send Money</h1>
          </div>

          {/* Info banner */}
          {!id && (
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
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">Sending to {requestId && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20 align-middle">From request</span>
                      )}</p>
                      <h3 className="text-[15px] sm:text-base font-semibold text-white leading-tight">{name || "Unknown"}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] text-slate-400">Online now</span>
                      </div>
                    </div>
                  </div>
                  {/* Change recipient */}
                  <button onClick={() => navigate('/send')} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
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
                    <span>Transfer successful! Redirecting…</span>
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
                        disabled={Boolean(requestId)}
                        placeholder="0"
                        className="w-full h-12 px-3.5 pr-9 rounded-xl bg-slate-900/30 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    </div>
                    {requestId && (
                      <p className="mt-1.5 text-[11px] text-slate-400">This amount is set by the request and cannot be changed.</p>
                    )}
                  </div>

                  {!requestId && (
                    <div>
                      <p className="text-[13px] text-slate-300 mb-1.5">Quick amounts</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[100, 500, 1000, 2000, 5000].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setAmount(String(v))}
                            className="px-2.5 py-1.5 text-[11px] rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 border border-white/10 shadow-sm hover:shadow-md transition"
                          >
                            ₹{v.toLocaleString('en-IN')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary action */}
                  <div className="pt-2">
                    <button
                      onClick={sendMoneyFun}
                      disabled={tracker}
                      className={`w-full h-11 rounded-xl text-white font-semibold shadow-lg transition ${tracker ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'} bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center gap-2`}
                      aria-label="Send money"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21l11-11-4-4L5 17l4 4z" /></svg>
                      {tracker ? 'Sending…' : `Send ₹${(Number(amount) || 0).toLocaleString('en-IN')}`}
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
                      <span>Instant transfer</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <UserSearch compact limit={6} />
            )}
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
