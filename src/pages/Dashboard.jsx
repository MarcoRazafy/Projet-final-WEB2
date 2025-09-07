import React from "react";
import StatsCard from "../components/StatsCard.jsx";
import PieChart from "../components/Piechart.jsx";
import BarChart from "../components/Barchart.jsx";
import AlertToast from "../components/AlertToast.jsx";

export default function Dashboard() {
  // Données mockées
  const totalIncome = 5000;
  const totalExpenses = 3200;
  const balance = totalIncome - totalExpenses;
  const alertMessage = totalExpenses > totalIncome 
    ? `Vous avez dépassé votre budget de ${totalExpenses - totalIncome} $` 
    : "";

  const pieData = [
    { category: "Food", amount: 500 },
    { category: "Transport", amount: 200 },
    { category: "Rent", amount: 1200 },
    { category: "Entertainment", amount: 300 },
    { category: "Others", amount: 1000 }
  ];

  const barData = [
    { month: "Jan", income: 4000, expenses: 2500 },
    { month: "Feb", income: 4500, expenses: 3000 },
    { month: "Mar", income: 5000, expenses: 3200 },
    { month: "Apr", income: 4800, expenses: 2900 }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {alertMessage && <AlertToast message={alertMessage} />}

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard title="Income" amount={totalIncome} color="green" />
        <StatsCard title="Expenses" amount={totalExpenses} color="red" />
        <StatsCard title="Balance" amount={balance} color="blue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart data={pieData} />
        <BarChart data={barData} />
      </div>
    </div>
  );
}
