import { Link, useNavigate } from "react-router-dom";
import resetpasswordicon from "../../assets/frontend/img/resetpasswordicon.png";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setEmptyMessage } from "../../features/auth/authSlice";
import { useForm } from "../../hooks/useForm";
import { useEffect } from "react";
import createToast from "../../utils/createToast";
import { retrievePasswordByOTP } from "../../features/auth/authApiSlice";
import Title from "../../components/Title/Title";

const RetrievePasswordByOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, error, message } = useSelector(authSelector);

  const { input, handleInputChange, formReset } = useForm({
    otp: "",
    password: "",
  });

  const handleForgotPasswordByOTP = (e) => {
    e.preventDefault();
    dispatch(retrievePasswordByOTP(input));
  };

  useEffect(() => {
    if (message) {
      createToast(message, "success");
      dispatch(setEmptyMessage());
      dispatch(formReset);
      navigate("/login");
    }
    if (error) {
      createToast(error);
      dispatch(setEmptyMessage());
    }
  }, [message, error, dispatch, formReset, navigate]);

  return (
    <>
      <Title title={"TMS | Retrieve Password By OTP"} />
      {/* Main Wrapper */}
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="container">
            <div className="loginbox">
              <div className="login-left">
                <img className="img-fluid" src={resetpasswordicon} alt="Logo" />
              </div>
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1>Retrieve Password By OTP</h1>
                  <p className="account-subtitle">
                    Enter your OTP and Password
                  </p>
                  {/* Form */}

                  <form onSubmit={handleForgotPasswordByOTP}>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="OTP"
                        name="otp"
                        value={input.otp}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={input.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-0">
                      <button className="btn btn-primary w-100">
                        {loader ? "Checking..." : "Submit"}
                      </button>
                    </div>
                  </form>
                  {/* /Form */}
                  <div className="text-center dont-have">
                    Remember your password? <Link to="/login">Login</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default RetrievePasswordByOtp;
