import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../features/auth/authSlice";
import "./Dashboard.css";

// import PendingDatatable from "../../components/Datatables/PendingDatatable";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import createToast from "../../utils/createToast";
import {
  createUserTodo,
  deleteTodo,
  updateTodo,
} from "../../features/todo/todoApiSlice";
import {
  setEmptyTodoMessage,
  todoSelector,
} from "../../features/todo/todoSlice";

import BarChart from "../../components/Chart/BarChart";
import API from "../../utils/api";
import Title from "../../components/Title/Title";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons-dt";
import Swal from "sweetalert2";

const Dashboard = () => {
  //Data form Databse for User, Incoming File, Outgoing File, Pending File
  // User Count
  const [userList, setUserList] = useState([]);
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/api/v1/user`);
        setUserList(response.data.user.length);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    fetchUser(); // Call fetchUser inside useEffect
  }, []);

  //incoming File Count
  const [incomingList, setIncomingList] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/api/v1/incoming`);
        setIncomingList(response.data.incomingFile.length);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    fetchUser(); // Call fetchUser inside useEffect
  }, []);

  //outgoing File Count
  const [outgoingList, setOutgoingList] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/api/v1/outgoing`);
        setOutgoingList(response.data.outgoingFile.length);
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    fetchUser(); // Call fetchUser inside useEffect
  }, []);

  const { user } = useSelector(authSelector);
  const { todoMessage, todoError } = useSelector(todoSelector);
  const dispatch = useDispatch();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [todo, setTodo] = useState(null);

  // user Wise Pending Task

  const [userWisePendingTask, setUserWisePendingTask] = useState([]);
  const [viewPendingTaskModal, setViewPendingTaskModal] = useState(false);
  const [viewPendingTask, setViewPendingTask] = useState([]);

  // api call

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/v1/user/users/pending-tasks`);

        // Updating the todo state with the newly fetched todo list
        setUserWisePendingTask(
          response.data.usersWithPendingTasks
            .filter((data) =>
              data.department.some((dept) => user.department.includes(dept))
            )
            .reverse()
        );
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleViewPendingTask = (item) => {
    setViewPendingTaskModal(true);
    setViewPendingTask(item.pendingTasks);
  };

  const pendingModalClose = () => {
    setViewPendingTaskModal(false);
  };

  // complete todo status and incomplete todo status count

  const TotalCount = todo ? todo.length : 0;
  const completedCount = todo
    ? todo.filter((item) => item.status === "complete").length
    : 0;
  const incompleteCount = todo
    ? todo.filter((item) => item.status === "incomplete").length
    : 0;

  // chart data
  const chartData = {
    labels: ["User", "Incoming", "Outgoing", "Todos"],
    datasets: [
      {
        label: "Number of Count",
        data: [userList, incomingList, outgoingList, TotalCount],
        borderWidth: 1,
      },
    ],
  };

  const [currentTodo, setCurrentTodo] = useState(null);

  const [input, setInput] = useState({
    id: user._id,
    title: "",
  });

  const handleInputChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle Todo Create form

  const handleTodoForm = async (e) => {
    e.preventDefault();
    // Dispatching the action to create a new todo
    await dispatch(createUserTodo(input));
    // Fetching updated todo list after adding a new todo
    const response = await API.get(`/api/v1/todo/${user._id}`);

    // Updating the todo state with the newly fetched todo list
    setTodo(response.data.userTodo.todos.reverse());
  };

  useEffect(() => {
    if (todoMessage) {
      createToast(todoMessage, "success");
      dispatch(setEmptyTodoMessage());
      setInput({
        id: user._id,
        title: "",
      });
    }
    if (todoError) {
      createToast(todoError);
      dispatch(setEmptyTodoMessage());
    }
  }, [todoMessage, todoError, dispatch]);

  // hande todo edit

  const handleEditTodo = (item) => {
    // Set the current todo being edited when the "Edit" button is clicked
    setCurrentTodo(item);
    modalOpen();
  };

  // edit todo form submit

  const handleEditTodoForm = async (e) => {
    e.preventDefault();
    await dispatch(updateTodo(currentTodo));
    // Fetching updated todo list after adding a new todo
    const response = await API.get(`/api/v1/todo/${user._id}`);
    // Updating the todo state with the newly fetched todo list
    setTodo(response.data.userTodo.todos.reverse());
    closeModal();
  };

  // handle delete Todo
  const handleDeleteTodo = async (item) => {
    // Merge user._id with item
    const data = {
      userId: user._id,
      todoId: item._id,
    };

    // Dispatch the delete action with the merged data

    const deleteResponse = await dispatch(deleteTodo(data));

    if (deleteResponse) {
      setTodo((prevTodo) => prevTodo.filter((todos) => todos._id !== item._id));
    }

    // Updating the todo state with the newly fetched todo list
    // setTodo(response.data.userTodo.todos.reverse());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/v1/todo/${user._id}`);
        // Updating the todo state with the newly fetched todo list
        setTodo(response.data.userTodo.todos.reverse());
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

    fetchData();
  });

  // const pendingTaskModalOpen = ()=>{
  //   setViewPendingTaskModal(true)
  // }

  const modalOpen = () => {
    // open the modal
    setEditModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setEditModalOpen(false);
  };

  const [viewFileModal, setViewFileModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  // const [pdfUrl, setPdfUrl] = useState(null);

  const handgleFileView = (fileUrl) => {
    const fileName = fileUrl;
    if (fileName == null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No PDF file is attached here.",
      });
      return;
    }
    const halffilepath = `http://localhost:5050/files`;
    const filePath = `${halffilepath}/${fileName}`;
    window.open(filePath, "_blank");
    // setViewFileModal(true);
    // setPdfUrl(fileUrl);
  };

  const viewFileModalClose = () => {
    setViewFileModal(false);
  };

  // handle View Button

  const handleView = (row) => {
    const fileName = row && row.file.props.children.props.children;
    if (fileName == null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No PDF file is attached here.",
      });
      return;
    }
    const halffilepath = `http://localhost:5050/files`;
    const filePath = `${halffilepath}/${fileName}`;
    window.open(filePath, "_blank");
  };

  // handle edit button

  return (
    <>
      <Title title={"TMS | Dashboard"} />

      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h4 className="page-title">Welcome {user.name}!</h4>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active">Dashboard</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Pending List Table Start*/}

          <div className="row">
            <div className="col-md-6 d-flex">
              <div
                style={{ padding: "15px 20px" }}
                className="card  card-table flex-fill"
              >
                {/* User wise Pending Data show start */}

                <div className="card  card-table flex-fill">
                  <h5>User Wise Pending List</h5>
                  <div className="todo-container">
                    <table className="table table-hover">
                      <thead style={{ backgroundColor: "#82CDFF" }}>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Count</th>
                          <th scope="col">View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userWisePendingTask &&
                          userWisePendingTask.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{item.name}</td>
                              <td>{item.pendingTasksCount}</td>
                              <td>
                                <button
                                  className="btn btn-sm bg-success"
                                  onClick={() => handleViewPendingTask(item)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <BarChart data={chartData} />
                {/* User wise Pending Data show end */}
              </div>
            </div>
            <div className="col-md-6 d-flex">
              {/* Recent Orders */}
              <div className="card card-table flex-fill">
                <div className="card-header">
                  <h4 className="card-title">Todo</h4>
                  <div className="form-container">
                    <form>
                      <div className="row">
                        <div className="col-12">
                          <input
                            type="text"
                            disabled
                            hidden
                            name="id"
                            value={user._id}
                          />
                        </div>
                        <div className="col-10">
                          <input
                            type="text"
                            name="title"
                            value={input.title}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-2">
                          <button
                            className="save-button"
                            type="submit"
                            onClick={handleTodoForm}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <hr />
                </div>
                <div className="card-body">
                  <div className="todo-container">
                    {todo &&
                      todo.map((item, index) => (
                        <div key={index} className="task-list-container">
                          <div className="left-item">
                            {item.status === "complete" && (
                              <i
                                style={{ fontWeight: "900", color: "green" }}
                                className="fe fe-check-circle"
                              ></i>
                            )}{" "}
                            &nbsp;
                            <span>{item.title}</span>
                          </div>
                          <div className="right-item">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEditTodo(item)}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteTodo(item)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Edit Modal Start */}
                <Modal
                  show={editModalOpen}
                  onHide={closeModal}
                  size="md"
                  aria-labelledby="example-modal-sizes-title-md"
                >
                  <Modal.Header closeButton>Edit Todo</Modal.Header>
                  <Modal.Body>
                    <form onSubmit={handleEditTodoForm}>
                      <div className="row">
                        {/* Populate the input field with the current todo title */}

                        <div className="col-12">
                          <input
                            disabled
                            hidden
                            type="text"
                            name="id"
                            className="form-control"
                            value={currentTodo ? currentTodo._id : ""} // Populate input with todo title
                          />
                        </div>

                        <div className="col-12">
                          <div className="mb-3">
                            <input
                              type="text"
                              name="todo"
                              className="form-control"
                              value={currentTodo ? currentTodo.title : ""} // Populate input with todo title
                              onChange={(e) =>
                                setCurrentTodo({
                                  ...currentTodo,
                                  title: e.target.value,
                                })
                              } // Update todo title in state
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="mb-2">
                              Status :{" "}
                              {currentTodo &&
                              currentTodo.status == "incomplete" ? (
                                <span style={{ color: "red" }}>
                                  {currentTodo && currentTodo.status}
                                </span>
                              ) : (
                                <span style={{ color: "green" }}>
                                  {currentTodo && currentTodo.status}
                                </span>
                              )}
                            </label>
                            <select
                              className="form-control"
                              name="status"
                              id=""
                              onChange={(e) =>
                                setCurrentTodo({
                                  ...currentTodo,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="complete">-Select-</option>
                              <option value="complete">Complete</option>
                              <option value="incomplete">Incomplete</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-sm bg-success-light w-100"
                      >
                        Save
                      </button>
                    </form>
                  </Modal.Body>
                </Modal>
                {/* Edit Modal End */}

                {/* view Pending Task Modal start */}
                {/* Edit Modal Start */}
                <Modal
                  show={viewPendingTaskModal}
                  onHide={pendingModalClose}
                  size="lg"
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    {" "}
                    <h5>Pending List</h5>{" "}
                  </Modal.Header>
                  <Modal.Body>
                    <div className="user-pending-list">
                      <table className="table table-success table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">From</th>
                            <th scope="col">Subject</th>
                            <th scope="col">DeadLine</th>
                            <th scope="col">View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewPendingTask &&
                            viewPendingTask.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td >{item.whereFrom}</td>
                                <td>{item.subject}</td>
                                <td>{item.deadLine}</td>
                                <td>
                                  <button
                                    className="btn btn-sm bg-info-light"
                                    onClick={() => handgleFileView(item.file)}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </Modal.Body>
                </Modal>
                {/* Edit Modal End */}

                {/* view Pending Task Modal end */}

                {/* view pdf file modal start */}
                <Modal
                  show={viewFileModal}
                  onHide={viewFileModalClose}
                  fullscreen={fullscreen}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body></Modal.Body>
                </Modal>
                {/* view pdf file modal End */}

                <div
                  className="card-footer"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <span style={{ fontWeight: "700", color: "#1B5990" }}>
                    Total Todos : {TotalCount}
                  </span>{" "}
                  &nbsp; | &nbsp;{" "}
                  <span style={{ fontWeight: "700", color: "green" }}>
                    Completed : {completedCount}
                  </span>{" "}
                  &nbsp; | &nbsp;{" "}
                  <span style={{ fontWeight: "700", color: "red" }}>
                    Incomplete : {incompleteCount}
                  </span>
                </div>
              </div>
              {/* /Recent Orders */}
            </div>
          </div>

          {/* Pending List Table End*/}
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon text-primary border-primary">
                      <i className="fe fe-users" />
                    </span>
                    <div className="dash-count">
                      <h3>{userList}</h3>
                    </div>
                  </div>
                  <div className="dash-widget-info">
                    <h6 className="text-muted">Users</h6>
                    <div className="progress progress-sm">
                      <div className="progress-bar bg-primary w-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon text-success">
                      <i className="fe fe-credit-card" />
                    </span>
                    <div className="dash-count">
                      <h3>{incomingList}</h3>
                    </div>
                  </div>
                  <div className="dash-widget-info">
                    <h6 className="text-muted">Incoming File</h6>
                    <div className="progress progress-sm">
                      <div className="progress-bar bg-success w-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon text-danger border-danger">
                      <i className="fe fe-money" />
                    </span>
                    <div className="dash-count">
                      <h3>{outgoingList}</h3>
                    </div>
                  </div>
                  <div className="dash-widget-info">
                    <h6 className="text-muted">Outgoing File</h6>
                    <div className="progress progress-sm">
                      <div className="progress-bar bg-danger w-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon text-warning border-warning">
                      <i className="fe fe-folder" />
                    </span>
                    <div className="dash-count">
                      <h3>{TotalCount}</h3>
                    </div>
                  </div>
                  <div className="dash-widget-info">
                    <h6 className="text-muted">Todos</h6>
                    <div className="progress progress-sm">
                      <div className="progress-bar bg-warning w-50" />
                    </div>
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

export default Dashboard;
