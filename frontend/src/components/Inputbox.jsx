export const Inputbox = ({ lable, val, onChange, type, error, className = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-slate-300 mb-2">
        {lable}
      </label>
      <div className="relative">
        <input
          onChange={onChange}
          type={type ? type : "text"}
          placeholder={val}
          className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};
