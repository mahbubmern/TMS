// export default Register;

import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/frontend/img/sonali-bank-logo.png";
import { useForm } from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { createUserRegister } from "../../features/auth/authApiSlice";
import { authSelector, setEmptyMessage } from "../../features/auth/authSlice";

import { useEffect, useState } from "react";
import createToast from "../../utils/createToast";
import API from "../../utils/api";
import Form from "react-bootstrap/Form";
import Title from "../../components/Title/Title";

const stations = [
  {
    name: "Head Office",
    subStations: [
      {
        name: "Head Office",
        division: [
          "99341-Information Security, IT Risk Management & Fraud Control Division",
          "99342-Information Technology Division (Business IT)",
          "99343-Information Technology Division (Infrastructure IT)",
          "99344-Information Technology Division (IT Service Management)",
          "99345-Information Technology Division (IT Procurement)",
        ],
      },
    ],
  },
  {
    name: "GMO",
    subStations: [
      {
        name: "Dhaka South",
        division: [
          "Sadarghat",
          "Naya Bazar",
          "Bangshal",
          "Armanitola",
          "Jatrabari",
        ],
      },
      {
        name: "Dhaka North",
        division: ["Banani", "Dhanmondi", "Gulshan", "Badda", "Kafrul"],
      },
    ],
  },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [station, setStation] = useState("");
  const [subStation, setSubStation] = useState("");

  const [division, setDivision] = useState("");

  const [secondStation, setSecondStation] = useState([]);
  const [thirdStation, setThirdStation] = useState([]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [findAdmin, setFindAdmin] = useState(0);
  const { loader, error, message } = useSelector(authSelector);
  const { input, setInput, handleInputChange, formReset } = useForm({
    index: "",
    name: "",
    email: "",
    password: "",
  });

  const handleStationChange = (e) => {
    const selectedStation = e.target.value;
    setStation(selectedStation);
    if (selectedStation !== "-Select-") {
      setSecondStation(
        stations.find((data) => data.name === selectedStation).subStations
      );
      setThirdStation([]);
      setInput(() => ({
        po: "",
        branch: "",
      }));
    } else {
      setSecondStation([]);
      setSubStation("");
      setThirdStation([]);
      setInput(() => ({
        po: "",
        branch: "",
      }));

      // setDivision("");
    }
  };

  const handleSubStationChange = (e) => {
    const selectedSubStation = e.target.value;
    setSubStation(selectedSubStation);
    if (selectedSubStation !== "-Select-") {
      setThirdStation(
        secondStation.find((data) => data.name === selectedSubStation).division
      );
      setDivision("");
      setInput((prevState) => ({
        ...prevState,
        branch: "",
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        branch: "",
      }));
      setThirdStation([]);
    }
  };

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleRegisterForm = (e) => {
    e.preventDefault();
    dispatch(createUserRegister(input));

    // navigate("/account-activation-by-otp");
  };

  // find admin User

  useEffect(() => {
    const adminUser = async () => {
      try {
        const response = await API.get(`/api/v1/user`);

        const findAdmin = response.data.user.filter(
          (data) => (data.role == "super admin") & (data.branch == division)
        );

        setFindAdmin(findAdmin.length);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    adminUser();
  });

  useEffect(() => {
    if (message) {
      createToast(message, "success");
      dispatch(setEmptyMessage());
      dispatch(formReset);
      navigate("/account-activation-by-otp");
    }
    if (error) {
      createToast(error);
      dispatch(setEmptyMessage());
    }
  }, [message, error, dispatch, formReset, navigate]);

  return (
    <>
      <Title title={"TMS | Register"} />
      {/* Main Wrapper */}
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="container">
            <div className="loginbox">
              <div className="login-left">
                <img className="img-fluid" src={logo} alt="Logo" />
              </div>
              <div className="login-right">
                <div
                  className="login-right-wrap"
                  style={{ position: "relative" }}
                >
                  <h1>User Register</h1>
                  <p className="account-subtitle">Access to DMS dashboard</p>
                  {/* Form */}
                  <form onSubmit={handleRegisterForm}>
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <select
                            className="form-control"
                            name="gmo"
                            value={station}
                            onChange={(e) => {
                              handleStationChange(e);
                              handleSelectChange(e);
                            }}
                          >
                            <option>-Select-</option>
                            {stations.map((item, index) => (
                              <option key={index} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <select
                            className="form-control"
                            name="po"
                            value={subStation}
                            onChange={(e) => {
                              handleSubStationChange(e);
                              handleSelectChange(e);
                            }}
                          >
                            <option>-Select-</option>
                            {secondStation?.map((item, index) => (
                              <option key={index} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <select
                            className="form-control"
                            name="branch"
                            value={division}
                            onChange={(e) => {
                              handleDivisionChange(e);
                              handleSelectChange(e);
                            }}
                          >
                            {thirdStation && (
                              <>
                                <option>-Select-</option>
                                {thirdStation.map((item, index) => (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        {findAdmin == 0 ? (
                          <div className="mb-3">
                            {/* <input
                        className="form-control"
                        type="text"
                        placeholder="role"
                        name="role"
                        value={input.role}
                        onChange={handleInputChange}
                      /> */}
                            <select
                              className="form-control"
                              name="role"
                              value={input.role}
                              onChange={handleSelectChange}
                            >
                              <option value="select">-Select-</option>
                              <option value="super admin">Super Admin</option>
                            </select>
                            {/* <Form.Check // prettier-ignore
                          type="switch"
                          id="custom-switch"
                          label="Admin"
                        /> */}
                          </div>
                        ) : (
                          <div className="mb-3">
                            {/* <input
                    className="form-control"
                    type="text"
                    placeholder="role"
                    name="role"
                    value={input.role}
                    onChange={handleInputChange}
                  /> */}
                            <select
                              className="form-control"
                              name="role"
                              value={input.role}
                              onChange={handleSelectChange}
                            >
                              <option value="select">-Select-</option>
                              <option value="user">User</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Index"
                        name="index"
                        value={input.index}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={input.name}
                        onChange={handleInputChange}
                      />
                    </div>
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
                    <div className="mb-3" style={{ position: "relative" }}>
                      <input
                        className="form-control"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={input.password}
                        onChange={handleInputChange}
                      />
                      <button
                        style={{
                          border: "none",
                          outline: "none",
                          backgroundColor: "white",
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          color: "#A8A8A8",
                        }}
                        type="button"
                        onClick={togglePassword}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <i className="fa fa-eye"></i>
                        ) : (
                          <i className="fa fa-eye-slash"></i>
                        )}
                      </button>
                    </div>

                    <div className="mb-0">
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleRegisterForm}
                      >
                        {loader ? "Creating..." : "Register"}
                      </button>
                    </div>
                  </form>
                  <div className="text-center dont-have">
                    Already have an account? <Link to="/login">Login</Link>
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

export default Register;
