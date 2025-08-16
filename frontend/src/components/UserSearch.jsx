import { useEffect, useState } from "react";
import { DisplayUser } from "./DisplayUser";
import axios from "axios";

/* eslint-disable react/prop-types */
export const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages available

  const fetchUsers = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "localhost:4000";

    try {
      setLoading(true);
      const res = await axios.get(
        `${apiUrl}/api/v1/user/getusers`,
        {
          params: {
            filter,
            page,
            limit: 12, // Number of users per page
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1); // Assuming backend returns total pages
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, page]);

  const handlePageChange = (direction) => {
    setPage((prevPage) =>
      Math.max(1, Math.min(prevPage + direction, totalPages))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Find Users</h2>
          <p className="text-slate-400">Search and connect with other PayPlus users</p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1); // Reset to the first page when filtering
              }}
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-slate-400 transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading users...
            </div>
          </div>
        ) : users.length > 0 ? (
          <div>
            {/* User Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {users.map((user) => (
                <DisplayUser
                  key={user._id}
                  fullName={`${user.firstName} ${user.lastName}`}
                  id={user._id}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 pt-6 border-t border-slate-700/50">
                <button
                  onClick={() => handlePageChange(-1)}
                  disabled={page === 1}
                  className={`px-4 py-2 mr-3 rounded-lg font-medium transition-all duration-200 ${page === 1
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      : "bg-slate-700/50 text-white hover:bg-slate-600/50 hover:scale-105"
                    }`}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${page === pageNum
                            ? "bg-blue-500 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page === totalPages}
                  className={`px-4 py-2 ml-3 rounded-lg font-medium transition-all duration-200 ${page === totalPages
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      : "bg-slate-700/50 text-white hover:bg-slate-600/50 hover:scale-105"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
            <p className="text-slate-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};
