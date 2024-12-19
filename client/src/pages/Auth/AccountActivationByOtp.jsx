import { Link, useNavigate } from "react-router-dom";
import otpImage from "../../assets/frontend/img/otp.png";
// import Cookies from "universal-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setEmptyMessage } from "../../features/auth/authSlice";
import { useForm } from "../../hooks/useForm";
import createToast from "../../utils/createToast";
import { accountActivation } from "../../features/auth/authApiSlice";
import Title from "../../components/Title/Title";

const AccountActivationByOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, error, message } = useSelector(authSelector);
  // const [formAction, setFormAction] = useState("");

  const { input, handleInputChange, formReset } = useForm({
    otp: "",
  });

  // useEffect(() => {
  //   const activationToken = new Cookies().get("activationToken");
  //   if (activationToken) {
  //     setFormAction(
  //       `http://localhost:5050/api/v1/auth/account-activate-by-otp/${activationToken}`
  //     );
  //   }
  // }, []);

  const handleOTP = (e) => {
    e.preventDefault();
    // Dispatching the accountActivation action with the token included in the request body
    // const activationToken = new Cookies().get("activationToken");
    // if (activationToken) {
    // }
    dispatch(accountActivation(input));
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
      dispatch(formReset);
    }
  }, [message, error, dispatch, formReset, navigate]);

  return (
    <>
    <Title title={"TMS | Account Activation"} />
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="container">
            <div className="loginbox">
              <div className="login-left">
                <img className="img-fluid" src={otpImage} alt="Logo" />
              </div>
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1>Account Activation By OTP</h1>
                  <p className="account-subtitle">Enter your OTP</p>
                  <form onSubmit={handleOTP}>
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
                    <div className="mb-0">
                      <button className="btn btn-primary w-100">
                        {loader ? "Checking..." : "Submit"}
                      </button>
                    </div>
                  </form>
                  <div className="text-center dont-have">
                    Need Resend Activation OTP?{" "}
                    <Link to="/resend-activation-link">Click</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountActivationByOtp;
