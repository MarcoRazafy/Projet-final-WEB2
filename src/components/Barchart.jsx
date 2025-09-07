import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: "Dépenses",
        data: data.map(item => item.expenses),
        backgroundColor: "#F87171"
      },
      {
        label: "Revenus",
        data: data.map(item => item.income),
        backgroundColor: "#34D399"
      }
    ]
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Revenus vs Dépenses par mois</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
