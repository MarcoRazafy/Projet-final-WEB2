import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: ["#34D399", "#F87171", "#60A5FA", "#FBBF24", "#A78BFA"],
        hoverOffset: 4
      }
    ]
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Dépenses par catégorie</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
