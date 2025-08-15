import { useNavigate } from "react-router-dom";

export const DisplayUser = ({ fullName, id }) => {
  const navigate = useNavigate();
  
  return (
    <div className="card p-6 hover:scale-105 transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        {/* User Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold rounded-full text-2xl shadow-lg flex items-center justify-center mb-4">
          {fullName[0].toUpperCase()}
        </div>

        {/* User Name */}
        <h3 className="text-lg font-semibold text-white mb-4">{fullName}</h3>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => {
              navigate(`/send?id=${id}&name=${fullName}`);
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Send Money
            </div>
          </button>
          
          <button
            onClick={() => {
              navigate(`/request?id=${id}&name=${fullName}`);
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Request Money
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
