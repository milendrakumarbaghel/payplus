import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const Balance = ({ Userbalance }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Balance Display */}
          <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Your Balance</h2>
            <div className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
              ₹{Userbalance?.toLocaleString() || '0'}
            </div>
            <p className="text-slate-400 text-sm">
              Available for transfers and payments
            </p>
          </div>

          {/* Wallet Icon */}
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <FontAwesomeIcon
                icon={faWallet}
                className="text-white text-3xl"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => navigate('/send')} className="text-center p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors duration-200">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Send Money</h3>
              <p className="text-xs text-slate-400">Transfer to friends</p>
            </button>

            <button onClick={() => navigate('/request')} className="text-center p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors duration-200">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Request Money</h3>
              <p className="text-xs text-slate-400">Ask for payment</p>
            </button>

            <div className="text-center p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors duration-200">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Transaction History</h3>
              <p className="text-xs text-slate-400">View all activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
