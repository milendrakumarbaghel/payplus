import { useSearchParams } from "react-router-dom";

export const SendDisplayUser = () => {
  const [searchParams] = useSearchParams();
  const fullName = searchParams.get("name");
  
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-lg">
        {fullName?.[0]?.toUpperCase() || "U"}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">{fullName || "Unknown User"}</h3>
        <p className="text-slate-400 text-sm">Recipient</p>
      </div>
    </div>
  );
};
