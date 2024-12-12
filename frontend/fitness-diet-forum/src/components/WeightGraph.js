import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightGraph = ({ weightData }) => {
  if (!Array.isArray(weightData) || weightData.length === 0) {
    return <p>No data available to display the weight graph.</p>;
  }

  const dates = weightData.map((entry) => entry.date.slice(0, 10)); 
  const weights = weightData.map((entry) => entry.weight);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Weight Over Time",
        data: weights,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weight Progress",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
        },
        suggestedMin: Math.min(...weights) - 2,
        suggestedMax: Math.max(...weights) + 2,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeightGraph;
