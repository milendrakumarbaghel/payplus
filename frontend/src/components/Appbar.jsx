import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const Appbar = ({ nameFirstLetter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const toUpdateUser = () => {
    navigate("/update-user");
  };

  const logOutFun = () => {
    localStorage.clear();
    navigate("/signin");
    window.location.reload(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handlePayPlus = (requestFromId, requesterName, amount, requestId) => {
    navigate(`/send?id=${requestFromId}&name=${requesterName}&amount=${amount}&requestId=${requestId}`);
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/bank/request/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { data } = response.data;

      const transformedNotifications = data.map((item) => {
        const requesterName = item.requestFromIdId?.firstName || "Someone";
        const requestFromId = item.requestFromIdId?._id || null;
        const amount = item.amountRequested || 0;
        return {
          id: item._id,
          message: `${requesterName} requested ₹${amount} from you`,
          requestFromId: requestFromId,
          requesterName: requesterName,
          amount: amount,
        };
      });

      setNotifications(transformedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    // initial fetch
    fetchNotifications();

    // refetch on window focus
    const onFocus = () => fetchNotifications();
    window.addEventListener('focus', onFocus);

    // refetch on custom refresh events (e.g., after payment)
    const onRefresh = () => fetchNotifications();
    window.addEventListener('payplus:refresh', onRefresh);

    // poll every 10s
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('payplus:refresh', onRefresh);
      clearInterval(interval);
    };
  }, []);

  const isActive = (path) => location.pathname === path;
  const navBtnClass = (path) => {
    const base = "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200";
    return isActive(path)
      ? `text-white bg-slate-700/50 ${base}`
      : `text-slate-300 hover:text-white hover:bg-slate-700/30 ${base}`;
  };

  return (
    <div className="sticky top-0 z-50 glass border-b border-slate-700/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <h1 className="flex items-center gap-3 text-2xl font-bold gradient-text cursor-default">
              PayPlus
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </h1>
          </div>

          {/* Center navigation */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="flex items-center space-x-1">
              <button onClick={() => navigate("/dashboard")} className={navBtnClass("/dashboard")}>Dashboard</button>
              <button onClick={() => navigate("/send")} className={navBtnClass("/send")}>Send</button>
              <button onClick={() => navigate("/request")} className={navBtnClass("/request")}>Request</button>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* User greeting */}
            <div className="hidden md:flex items-center space-x-2 text-slate-300">
              <span className="text-sm">Welcome back,</span>
            </div>

            {/* Profile Avatar */}
            <div className="relative group">
              <button
                onClick={toUpdateUser}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {nameFirstLetter?.toUpperCase()}
              </button>
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 text-xs text-white bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Update Profile
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Amount: ₹{notification.amount}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handlePayPlus(
                                  notification.requestFromId,
                                  notification.requesterName,
                                  notification.amount,
                                  notification.id
                                )
                              }
                              className="ml-3 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                            >
                              Pay
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-slate-400 text-sm">No notifications yet</p>
                        <p className="text-slate-500 text-xs mt-1">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logOutFun}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
