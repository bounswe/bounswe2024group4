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
        label: "Weight",
        data: weights,
        borderColor: "rgba(75,192,192,1)", // Light blue for the line
        tension: 0.4,
        backgroundColor: 'rgba(211, 211, 211, 0.2)', // Light gray background for the area under the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: 'rgba(169, 169, 169, 1)', // Light gray color for the legend font
        },
      },
      title: {
        display: false,
        text: "Weight Progress",
        color: 'rgba(169, 169, 169, 1)', // Light gray color for the title font
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: 'rgba(169, 169, 169, 1)', // Light gray color for x-axis title font
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: 'rgba(169, 169, 169, 1)', // Light gray color for x-axis ticks
        },
        grid: {
          color: 'rgba(169, 169, 169, 0.5)', // Light gray grid lines for x-axis
        },
        border: {
          color: 'rgba(169, 169, 169, 1)', // Light gray color for x-axis border (line)
        },
      },
      y: {
        title: {
          display: true,
          text: "Weight (kg)",
          color: 'rgba(169, 169, 169, 1)', // Light gray color for y-axis title font
        },
        suggestedMin: Math.min(...weights) - 2,
        suggestedMax: Math.max(...weights) + 2,
        ticks: {
          color: 'rgba(169, 169, 169, 1)', // Light gray color for y-axis ticks
        },
        grid: {
          color: 'rgba(169, 169, 169, 0.5)', // Light gray grid lines for y-axis
        },
        border: {
          color: 'rgba(169, 169, 169, 1)', // Light gray color for y-axis border (line)
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2, // Adjust line thickness
      },
      point: {
        radius: 3, // Adjust point size if needed
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: 'rgb(31, 41, 55)' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeightGraph;
