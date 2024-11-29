import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { authSelector } from "../../../features/auth/authSlice";

import { setEmptyMessage } from "../../../features/userCred/userCredSlice";

import {
  setPersonalEmptyMessage,
  userPersonalSelector,
} from "../../../features/userPersonal/userPersonalSlice";
import Avatar from "../../../components/Avatar/Avatar";

// modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useForm } from "../../../hooks/useForm";
import createToast from "../../../utils/createToast";
import { userCredSelector } from "../../../features/userCred/userCredSlice";
import { updateUserCred } from "../../../features/userCred/userCredApiSlice";
import { updateUserPersonal } from "../../../features/userPersonal/userPersonalApiSlice";
import { updateUserPhoto } from "../../../features/userPhoto/userPhotoApiSlice";
import {
  setPhotoEmptyMessage,
  userPhotoSelector,
} from "../../../features/userPhoto/userPhotoSlice";
import axios from "axios";
import API from "../../../utils/api";
import Title from "../../../components/Title/Title";

const Profile = () => {
  const { user } = useSelector(authSelector);
  const { message, error } = useSelector(userCredSelector);
  const { personalmessage, personalerror } = useSelector(userPersonalSelector);
  const { photomessage, photoerror } = useSelector(userPhotoSelector);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalModalOpen, setPersonalModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  // change password
  const { input, handleInputChange, formReset } = useForm({
    _id: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // change details Start

  const [personalInput, setPersonalInput] = useState({
    _id: user._id,
    division: "",
    department: "",
    phone: "",
    designation: "",
  });

  // change photo input
  const [image, setImage] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setImage(file);
    }
  };

  const handlePhotoChangeModal = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("photo", image);
    await API.patch(`/api/v1/userphoto/${user._id}`, formData)
      .then((res) => {})
      .catch((err) => console.log(err));

    closeModal();
  };

  useEffect(() => {
    if (photomessage) {
      createToast(photomessage, "success");
      dispatch(setPhotoEmptyMessage());
    }
    if (photoerror) {
      createToast(photoerror);
      dispatch(setPhotoEmptyMessage());
    }
  }, [photomessage, photoerror, dispatch]);

  const handlePersonalInputChange = (e) => {
    setPersonalInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePersonalDetailForm = (e) => {
    e.preventDefault();
    dispatch(updateUserPersonal(personalInput));
  };
  //Change personal Change Use Effect
  useEffect(() => {
    if (personalmessage) {
      createToast(personalmessage, "success");
      dispatch(setPersonalEmptyMessage());
      PersonalInputformReset();
      personalEditCloseModal();
    }
    if (personalerror) {
      createToast(personalerror);
      dispatch(setPersonalEmptyMessage());
    }
  }, [personalmessage, personalerror, dispatch]);

  // form Reset
  const PersonalInputformReset = () => {
    setPersonalInput({
      division: "",
      department: "",
      phone: "",
      designation: "",
    });
  };
  // change details End

  // const [input, setInput] = useState({
  //   id: '',
  //   photo: null,
  // });

  // change password handler

  const changePassword = (e) => {
    e.preventDefault();
    dispatch(updateUserCred(input));
  };

  useEffect(() => {
    if (message) {
      createToast(message, "success");
      dispatch(setEmptyMessage());
      dispatch(formReset);
    }
    if (error) {
      createToast(error);
      dispatch(setEmptyMessage());
    }
  }, [message, error, dispatch, formReset]);

  const modalOpen = () => {
    // open the modal
    setIsModalOpen(true);
  };

  const personalEditModalOpen = () => {
    // open the modal
    setPersonalModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  const personalEditCloseModal = () => {
    // Close the modal
    setPersonalModalOpen(false);
  };
  return (
    <>
      <Title title={"TMS | Profile"} />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <Breadcrumb />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="profile-header">
                <div className="row align-items-center">
                  <div className="col-auto profile-image">
                    <a href="#">
                      <Avatar
                        className="rounded-circle"
                        url={user.photo && user.photo}
                      />
                    </a>
                  </div>

                  <div className="col ml-md-n2 profile-user-info">
                    <h4 className="user-name mb-0">{user.name}</h4>
                    <h6 className="text-muted">{user.email}</h6>
                    <div className="user-Location">
                      {user.division && (
                        <>
                          <i className="fa-solid fa-location-dot" />{" "}
                          {user.division}{" "}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-auto profile-btn"></div>
                </div>
                <br />
                <button
                  onClick={modalOpen}
                  className="btn btn bg-success-light"
                >
                  Change Profile Photo
                </button>
              </div>

              {/* Photo Modal Start */}

              <Modal
                show={isModalOpen}
                onHide={closeModal}
                size="md"
                aria-labelledby="example-modal-sizes-title-md"
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <Form
                    onSubmit={handlePhotoChangeModal}
                    encType="multipart/form-data"
                  >
                    <Form.Group as={Col} controlId="formGridId" disabled hidden>
                      <Form.Control
                        type="text"
                        placeholder="Id"
                        name="id"
                        value={user._id}
                        style={{ backgroundColor: "lightyellow" }}
                      />
                    </Form.Group>

                    {selectedFile && (
                      <Row className="mb-3">
                        <Col className="d-flex justify-content-center">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt=""
                            style={{ width: "200px", height: "200px" }}
                          />
                        </Col>
                      </Row>
                    )}

                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="formGridImage">
                        <Form.Label></Form.Label>
                        <Form.Control
                          type="file"
                          name="photo"
                          onChange={handleFileChange}
                          style={{ backgroundColor: "lightyellow" }}
                        />
                      </Form.Group>
                    </Row>

                    <Button
                      type="submit"
                      className="btn btn-sm bg-success-light w-100"
                    >
                      Set Photo
                    </Button>
                  </Form>
                </Modal.Body>
                {/* Render PDFViewer component only if pdfUrl is not null */}
                {/* {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />} */}
              </Modal>
              {/* Photo Modal End */}

              <div className="profile-menu">
                <ul className="nav nav-tabs nav-tabs-solid">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#per_details_tab"
                    >
                      About
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#password_tab"
                    >
                      Password
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-content profile-tab-cont">
                {/* Personal Details Tab */}
                <div className="tab-pane fade show active" id="per_details_tab">
                  {/* Personal Details */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title d-flex">
                            <span>
                              Personal Details &nbsp; &nbsp;{" "}
                              <button
                                onClick={personalEditModalOpen}
                                className="btn btn bg-success-light"
                              >
                                Add More Details
                              </button>
                            </span>
                          </h5>
                          <br />
                          <div className="row">
                            <p className="col-sm-2 text-muted">Name</p>
                            <p className="col-sm-10">{user.name}</p>
                          </div>

                          <div className="row">
                            {user.designation && (
                              <>
                                {" "}
                                <p className="col-sm-2 text-muted">
                                  Designation
                                </p>{" "}
                                <p className="col-sm-10 mb-0">
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {user.designation}
                                </p>{" "}
                              </>
                            )}
                          </div>

                          <div className="row">
                            <p className="col-sm-2 text-muted">Email ID</p>
                            <p className="col-sm-10">{user.email}</p>
                          </div>
                          <div className="row">
                            <p className="col-sm-2 text-muted">Index</p>
                            <p className="col-sm-10">{user.index}</p>
                          </div>
                          <div className="row">
                            {user.division && (
                              <>
                                {" "}
                                <p className="col-sm-2 text-muted">
                                  Division/Branch
                                </p>{" "}
                                <p className="col-sm-10 mb-0">
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {user.division}
                                </p>{" "}
                              </>
                            )}
                          </div>

                          <div className="row">
                            {user.department && (
                              <>
                                {" "}
                                <p className="col-sm-2 text-muted">
                                  Section
                                </p>{" "}
                                <p className="col-sm-10 mb-0">
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {user.department}
                                </p>{" "}
                              </>
                            )}
                          </div>
                          <div className="row">
                            {user.phone && (
                              <>
                                {" "}
                                <p className="col-sm-2 text-muted">
                                  Mobile
                                </p>{" "}
                                <p className="col-sm-10 mb-0">
                                  <i className="fa-solid fa-phone" />{" "}
                                  {user.phone}
                                </p>{" "}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Edit Details Modal */}

                      <Modal
                        show={personalModalOpen}
                        onHide={personalEditCloseModal}
                        size="md"
                        aria-labelledby="example-modal-sizes-title-md"
                      >
                        <Modal.Header closeButton>
                          {" "}
                          <h6>Fill up Your Official Data</h6>
                        </Modal.Header>
                        <Modal.Body>
                          <form onSubmit={handlePersonalDetailForm}>
                            <div className="row">
                              <div className="col-12">
                                <div className="mb-3">
                                  <input
                                    type="text"
                                    name="id"
                                    disabled
                                    hidden
                                    value={user._id}
                                    className="form-control"
                                  />
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="mb-2">Designation</label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    name="designation"
                                    value={input.designation}
                                    onChange={handlePersonalInputChange}
                                  />
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="mb-2">
                                    Division/Branch
                                  </label>

                                  <input
                                    type="text"
                                    name="division"
                                    value={input.division}
                                    onChange={handlePersonalInputChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="mb-2">
                                    Department/Section
                                  </label>
                                  <input
                                    type="text"
                                    name="department"
                                    value={input.department}
                                    onChange={handlePersonalInputChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="mb-3">
                                  <label className="mb-2">Mobile</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={input.phone}
                                    onChange={handlePersonalInputChange}
                                    className="form-control"
                                  />
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
                        {/* Render PDFViewer component only if pdfUrl is not null */}
                        {/* {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />} */}
                      </Modal>
                    </div>
                  </div>
                  {/* /Personal Details */}
                </div>
                {/* /Personal Details Tab */}
                {/* Change Password Tab */}
                <div id="password_tab" className="tab-pane fade">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Change Password</h5>
                      <div className="row">
                        <div className="col-md-10 col-lg-6">
                          <form onSubmit={changePassword}>
                            <div className="mb-3">
                              <label className="mb-2"></label>
                              <input
                                type="text"
                                disabled
                                hidden
                                name="id"
                                value={user._id}
                                className="form-control"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="mb-2">Old Password</label>
                              <input
                                type="password"
                                name="oldPassword"
                                value={input.oldPassword}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </div>

                            <div className="mb-3">
                              <label className="mb-2">New Password</label>
                              <input
                                type="password"
                                name="newPassword"
                                value={input.newPassword}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="mb-2">Confirm Password</label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={input.confirmPassword}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </div>
                            <button
                              className="btn btn-sm bg-success-light"
                              type="submit"
                            >
                              Save Changes
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Change Password Tab */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
