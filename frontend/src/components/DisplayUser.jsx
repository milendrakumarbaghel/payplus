import { useNavigate } from "react-router-dom";

export const DisplayUser = ({ fullName = "User", id, square = false, small = false }) => {
  const navigate = useNavigate();

  if (square) {
    return (
      <div className={`card ${small ? 'p-3' : 'p-4='} h-40 w-50 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus-within:ring-1 focus-within:ring-blue-500/40`} role="group" aria-label={`${fullName} quick actions`}>
        <div className="flex flex-col items-center text-center">
          <div className={`${small ? 'w-10 h-10 text-lg mb-2' : 'w-14 h-14 text-xl mb-3'} bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-lg flex items-center justify-center ring-2 ring-white/10`} title={fullName}>
            {fullName?.[0]?.toUpperCase()}
          </div>
          <h3 className={`${small ? 'text-xs' : 'text-sm'} font-semibold text-slate-100 leading-snug line-clamp-2`}>{fullName}</h3>
        </div>
        <div className={`w-full grid grid-cols-2 ${small ? 'gap-1.5' : 'gap-2'}`}>
          <button
            onClick={() => navigate(`/send?id=${id}&name=${fullName}`)}
            aria-label={`Send money to ${fullName}`}
            title={`Send money to ${fullName}`}
            className={`${small ? 'py-1.5 text-[10px]' : 'py-2 text-xs'} px-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-green-600 hover:to-green-700`}
          >
            Send
          </button>
          <button
            onClick={() => navigate(`/request?id=${id}&name=${fullName}`)}
            aria-label={`Request money from ${fullName}`}
            title={`Request money from ${fullName}`}
            className={`${small ? 'py-1.5 text-[10px]' : 'py-2 text-xs'} px-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700`}
          >
            Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* User Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold rounded-full text-xl shadow-lg flex items-center justify-center ring-2 ring-white/10" title={fullName}>
            {fullName?.[0]?.toUpperCase()}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-tight">{fullName}</h3>
        </div>

        {/* Action Buttons */}
        <div className="w-full sm:w-auto grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <button
            onClick={() => {
              navigate(`/send?id=${id}&name=${fullName}`);
            }}
            aria-label={`Send money to ${fullName}`}
            className="py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
            aria-label={`Request money from ${fullName}`}
            className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
