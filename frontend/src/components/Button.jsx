

export const Button = ({ lable, onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="w-full bg-sky-600 rounded-md text-white text-center p-2 mt-5 hover:bg-sky-900 font-semibold"
      >
        {lable}
      </button>
    </div>
  );
};
