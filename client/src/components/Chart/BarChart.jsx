import  { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  let myChart = useRef(null);

  useEffect(() => {
    // Check if a chart instance already exists and destroy it
    if (myChart.current) {
      myChart.current.destroy();
    }

    // Create a new chart instance
    const ctx = chartRef.current.getContext('2d');
    myChart.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Clean up function
    return () => {
      if (myChart.current) {
        myChart.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
