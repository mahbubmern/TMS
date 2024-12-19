// ProgressBar.js

import  { useState, useEffect } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ startTime, endTime }) => {
  const [progress, setProgress] = useState(100); // Start with full progress

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const totalDuration = endTime - startTime;
      const remainingTime = endTime - currentTime;
      const remainingPercentage = (remainingTime / totalDuration) * 100;

      setProgress(Math.max(0, remainingPercentage)); // Ensure progress doesn't go below 0
    }, 1000); // Update progress every second

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const getColor = () => {
    if (progress >= 80) {
      return "green";
    } else if (progress >= 40) {
      return "yellow";
    } else {
      return "red";
    }
  };

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: getColor() }}>
      
      </div>
    </div>
  );
};

export default ProgressBar;
