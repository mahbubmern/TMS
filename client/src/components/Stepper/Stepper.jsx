import "./Stepper.css";

const Stepper = ({ steps }) => {
  const totalSteps = 4; // Fixed number of steps

  return (
    <div className="stepper-container">
      {[...Array(totalSteps)].map((_, index) => (
        <div key={index} className="stepper-item">
          <div
            className={`stepper-circle ${
              index < steps.length ? "completed" : ""
            }`}
          >
            {index + 1}
          </div>
          <div className="stepper-label">{steps[index] || "Pending"}</div>
          {index < totalSteps - 1 && (
            <div
              className={`stepper-line ${
                index < steps.length ? "completed" : ""
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
