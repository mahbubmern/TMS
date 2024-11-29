import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/frontend/img/sonali-bank-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setEmptyMessage } from "../../features/auth/authSlice";
import { useForm } from "../../hooks/useForm";
import { useEffect } from "react";
import createToast from "../../utils/createToast";
import { newActivationOTP } from "../../features/auth/authApiSlice";
import Title from "../../components/Title/Title";


const NewActivationOTP = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, error, message } = useSelector(authSelector);

  const { input, handleInputChange, formReset } = useForm({
    email: "",

  });

  const handleNewOTPForm = (e) => {
    e.preventDefault()
    dispatch(newActivationOTP(input))
    dispatch(formReset);
    // navigate("/account-activation-by-otp");
  };

  useEffect(() => {
    if (message) {
      createToast(message, "success");
      dispatch(setEmptyMessage());
      dispatch(formReset);
      navigate('/account-activation-by-otp')
    }
    if (error) {
      createToast(error);
      dispatch(setEmptyMessage());
    }
  }, [message, error, dispatch,formReset, navigate]);
  return (
    <>
     <Title title={"TMS | New Activation OTP"} />
    {/* Main Wrapper */}
    <div className="main-wrapper login-body">
      <div className="login-wrapper">
        <div className="container">
          <div className="loginbox">
            <div className="login-left">
              <img
                className="img-fluid"
                src={logo}
                alt="Logo"
              />
            </div>
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>New Activation OTP</h1>
                <p className="account-subtitle">
                  Enter your email to get OTP
                </p>
                {/* Form */}
                <form onSubmit={handleNewOTPForm}>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Email"
                      name="email"
                      value={input.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-0">
                    <button className="btn btn-primary w-100" >
                     {loader ? 'Sending...' : 'Submit'} 
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
  )
}

export default NewActivationOTP