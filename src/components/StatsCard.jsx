import React from "react";

const StatsCard = ({ title, amount, color }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  };

  return (
    <div className={`p-4 rounded shadow ${colorClasses[color]}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{amount} $</p>
    </div>
  );
};

export default StatsCard;
