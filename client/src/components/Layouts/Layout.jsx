import logo from "../../assets/frontend/img/sonali-bank-logo.png";

import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../features/auth/authApiSlice";
import { useEffect, useState } from "react";
import createToast from "../../utils/createToast";
import { authSelector, setEmptyMessage } from "../../features/auth/authSlice";
import timeAgo from "../../../../utils/timeAgo.js";
import API from "../../utils/api.js";

import Avatar from "../../components/Avatar/Avatar";

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const pathParts = pathname.split("/");
  const lastPathPart = pathParts[pathParts.length - 1];

  const { error, message, user } = useSelector(authSelector);
  const dispatch = useDispatch();

  const [notification, setNotification] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [unReadCount, setUnReadCount] = useState(0);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // handle notification
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/v1/notification/${user._id}`);
        // Updating the todo state with the newly fetched todo list
        setNotification(
          response.data.userNotification.notification
            .reverse()
            .filter((notification) => notification.status === "pending")
        );
        const unread = response.data.userNotification.notification.filter(
          (notification) => notification.status === "pending"
        ).length;
        setUnReadCount(unread);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    fetchData();
  }),
    [notification];

  const handleLogout = () => {
    dispatch(userLogout());
  };

  useEffect(() => {
    if (message) {
      createToast(message, "success");
      dispatch(setEmptyMessage());
    }
    if (error) {
      createToast(error);
      dispatch(setEmptyMessage());
    }
  }, [message, error, dispatch]);

  const [activeItem, setActiveItem] = useState(lastPathPart);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <>
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          {/* Logo */}
          <div className="header-left">
            <Link to="/dashboard" className="logo">
              <img src={logo} alt="Logo" />
            </Link>
            <Link to="/dashboard" className="logo logo-small">
              <img src={logo} alt="Logo" width={30} height={30} />
            </Link>
          </div>
          {/* /Logo */}
          <a href="javascript:void(0);" id="toggle_btn">
            <i className="fe fe-text-align-left"></i>
          </a>
          <div className="top-nav-search">
            <form>
              <input
                type="text"
                className="form-control"
                placeholder="Search here"
              />
              <button className="btn" type="submit">
                <i className="fa fa-search" />
              </button>
            </form>
          </div>
          {/* Mobile Menu Toggle */}
          <a className="mobile_btn" id="mobile_btn">
            <i className="fa fa-bars" />
          </a>
          {/* /Mobile Menu Toggle */}
          {/* Header Right Menu */}
          <ul className="nav user-menu">
            {/* Notifications */}
            <li className="nav-item dropdown noti-dropdown">
              <a
                href="#"
                className="dropdown-toggle nav-link"
                data-bs-toggle="dropdown"
                onClick={handleDropdownToggle}
              >
                <i className="fe fe-bell" />{" "}
                {isDropdownOpen && unReadCount > 0 ? (
                  <span className="badge rounded-pill">
                    {unReadCount} Pending Task
                  </span>
                ) : (
                  ""
                )}
              </a>
              <div className="dropdown-menu notifications">
                <div className="topnav-dropdown-header">
                  <span className="notification-title">Notifications</span>
                  <a href="javascript:void(0)" className="clear-noti">
                    {" "}
                    Clear All{" "}
                  </a>
                </div>
                <div className="noti-content">
                  <ul className="notification-list">
                    {notification.map((item, index) => (
                      <li
                        key={index}
                        className="notification-message"
                        style={{
                          backgroundColor: "lightyellow",
                          marginTop: "7px",
                        }}
                      >
                        <a href="#">
                          <div className="notify-block d-flex">
                            {/* <span className="avatar avatar-sm flex-shrink-0">
                              <img
                                className="avatar-img rounded-circle"
                                alt="User Image"
                                src="assets/img/doctors/doctor-thumb-01.jpg"
                              />
                            </span> */}
                            <div className="media-body flex-grow-1">
                              <p className="noti-details">
                                <span className="noti-title">
                                  You Have an pending Task
                                </span>{" "}
                                Named{" "}
                                <span className="noti-title">
                                  {item.subject}
                                </span>
                              </p>
                              <p className="noti-time">
                                <span className="notification-time">
                                  {timeAgo(item.updatedAt)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="topnav-dropdown-footer">
                  <a href="#">View all Notifications</a>
                </div>
              </div>
            </li>
            {/* /Notifications */}
            {/* User Menu */}
            <li className="nav-item dropdown has-arrow">
              <a
                href="#"
                className="dropdown-toggle nav-link"
                data-bs-toggle="dropdown"
              >
                <span className="user-img">
                  <Avatar
                    className="rounded-circle"
                    width={31}
                    alt={user.name}
                    url={user.photo && user.photo}
                  />
                </span>
              </a>
              <div className="dropdown-menu">
                <div className="user-header">
                  <div className="avatar avatar-sm">
                    <Avatar
                      className="rounded-circle"
                      width={31}
                      alt={user.name}
                      url={user.photo && user.photo}
                    />
                  </div>
                  <div className="user-text">
                    <h6>{user.name}</h6>
                    <p className="text-muted mb-0">{user.role}</p>
                  </div>
                </div>
                {/* <Link className="dropdown-item" to="/dashboard/profile">
                  My Profile
                </Link> */}
                {/* <a className="dropdown-item" href="settings.html">
                  Settings
                </a> */}
                <Link
                  className="dropdown-item"
                  onClick={handleLogout}
                  to="/login"
                >
                  Logout
                </Link>
              </div>
            </li>
            {/* /User Menu */}
          </ul>
          {/* /Header Right Menu */}
        </div>
        {/* /Header */}
        {/* Sidebar */}
        <div className="sidebar" id="sidebar">
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {/* <li className="menu-title">
                  <span>Main</span>
                </li> */}
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => handleItemClick("dashboard")}
                    style={{
                      backgroundColor:
                        activeItem === "dashboard" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fe fe-home" /> <span>Dashboard</span>
                  </Link>
                </li>

                {user?.role === "super admin" ? (
                  <li>
                    <Link
                      to="/dashboard/department"
                      onClick={() => handleItemClick("department")}
                      style={{
                        backgroundColor:
                          activeItem === "department" ? "#00d0f1" : "",
                      }}
                    >
                      <i className="fe fe-users" /> <span>Department</span>
                    </Link>
                  </li>
                ) : (
                  ""
                )}

                <li>
                  <Link
                    to="/dashboard/todays-incoming"
                    onClick={() => handleItemClick("todays-incoming")}
                    style={{
                      backgroundColor:
                        activeItem === "todays-incoming" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fa-regular fa-folder-open"></i>{" "}
                    <span>Todays-Incoming</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/users"
                    onClick={() => handleItemClick("user")}
                    style={{
                      backgroundColor: activeItem === "user" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fe fe-users" /> <span>Users</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/task"
                    onClick={() => handleItemClick("task")}
                    style={{
                      backgroundColor: activeItem === "task" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fe fe-beginner" /> <span>Task List</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/incoming"
                    onClick={() => handleItemClick("incoming")}
                    style={{
                      backgroundColor:
                        activeItem === "incoming" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fe fe-activity" /> <span>Incoming</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/outgoing"
                    onClick={() => handleItemClick("outgoing")}
                    style={{
                      backgroundColor:
                        activeItem === "outgoing" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fe fe-activity" /> <span>Outgoing</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/file_Manager"
                    onClick={() => handleItemClick("file_Manager")}
                    style={{
                      backgroundColor:
                        activeItem === "file_Manager" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fe fe-user-plus" /> <span>File Manager</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => handleItemClick("profile")}
                    style={{
                      backgroundColor:
                        activeItem === "profile" ? "#00d0f1" : "",
                    }}
                  >
                    <i className="fe fe-user-plus" /> <span>Settings</span>
                  </Link>
                </li>

                {/* <li>
                  <Link to="/login" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" /> <span>Logout</span>
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* /Sidebar */}

        <Outlet />
      </div>
    </>
  );
};

export default Layout;
