import { useEffect, useState } from "react";
import { Balance } from "../components/Balance";
import axios from "axios";
import { Loader } from "../components/Loader";
import { Layout } from "../components/Layout";

export const Dashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [balance, setBalance] = useState(null); // Use null to distinguish between "loading" and "zero balance"
  const [loading, setLoading] = useState(true); // Separate loading state for better control
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const fetchBalance = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/bank/balance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      setFirstName(data.firstName || "User");
      setBalance(data.balance || 0);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch
    fetchBalance();

    // refetch on window focus
    const onFocus = () => fetchBalance();
    window.addEventListener('focus', onFocus);

    // refetch when other pages dispatch refresh event
    const onRefresh = () => fetchBalance();
    window.addEventListener('payplus:refresh', onRefresh);

    // optional polling every 10s
    const interval = setInterval(fetchBalance, 10000);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('payplus:refresh', onRefresh);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  return (
    <Layout userInitial={firstName?.[0]} onLogout={handleLogout}>
      <div className="pb-8">
        <Balance Userbalance={balance} />
      </div>
    </Layout>
  );
};
