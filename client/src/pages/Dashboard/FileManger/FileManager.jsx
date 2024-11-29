import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const FileManager = () => {
  return (
    <>
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
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="file_manager_header_section d-flex  justify-content-between ">
                      <div
                        className="header-section-left mr-auto"
                        style={{
                          padding: "5px",
                          borderRadius: "5px",
                          backgroundColor: "#EEF3F7",
                        }}
                      >
                        <i
                          className="fa fa-search"
                          style={{ color: "#A2A6B9", padding: "0px 10px" }}
                        ></i>
                        <input
                          type="text"
                          style={{
                            border: "none",
                            backgroundColor: "#EEF3F7",
                            fontSize: "14px",
                          }}
                          placeholder="Search Files & Folders"
                        />
                      </div>
                      <div className="header-section-right ">
                        <button
                          style={{
                            border: "none",
                            padding: "5px 15px",
                            fontSize: "14px",
                            borderRadius: "5px",
                            backgroundColor: "#EEF3F7",
                            color: "#0098DA",
                          }}
                        >
                          {" "}
                          <i className="fa-solid fa-folder-plus"></i> &nbsp; New
                          Folder
                        </button>{" "}
                        &nbsp;
                        <button
                          style={{
                            border: "none",
                            padding: "5px 15px",
                            fontSize: "14px",
                            borderRadius: "5px",
                            backgroundColor: "#0098DA",
                            color: "#FFFF",
                          }}
                        >
                          {" "}
                          <i className="fa-solid fa-file-arrow-up"></i> &nbsp;
                          Upload Files
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <table style={{margin : '20px 0px'}}>
                      <thead></thead>
                      <tbody >
                        <tr className="odd">
                          <td>
                            <div className="form-check form-check-sm form-check-custom form-check-solid">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="1"
                              />
                            </div>
                          </td>

                          <td data-order="account">
                            <div className="d-flex align-items-center">
                              <span className="svg-icon svg-icon-2x svg-icon-primary me-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    opacity="0.3"
                                    d="M10 4H21C21.6 4 22 4.4 22 5V7H10V4Z"
                                    fill="currentColor"
                                  ></path>
                                  <path
                                    d="M9.2 3H3C2.4 3 2 3.4 2 4V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V7C22 6.4 21.6 6 21 6H12L10.4 3.60001C10.2 3.20001 9.7 3 9.2 3Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </span>
                              <a
                                href="/jet-html-free/apps/file-manager/files/.html"
                                className="text-gray-800 text-hover-primary"
                              >
                                account
                              </a>
                            </div>
                          </td>

                          <td>-</td>

                          <td data-order="Invalid date">-</td>

                          <td
                            className="text-end"
                            data-kt-filemanager-table="action_dropdown"
                          >
                            <div className="d-flex justify-content-end">
                              <div
                                className="ms-2"
                                data-kt-filemanger-table="copy_link"
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-icon btn-light btn-active-light-primary"
                                  data-kt-menu-trigger="click"
                                  data-kt-menu-placement="bottom-end"
                                >
                                  <span className="svg-icon svg-icon-5 m-0">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        opacity="0.3"
                                        d="M18.4 5.59998C18.7766 5.9772 18.9881 6.48846 18.9881 7.02148C18.9881 7.55451 18.7766 8.06577 18.4 8.44299L14.843 12C14.466 12.377 13.9547 12.5887 13.4215 12.5887C12.8883 12.5887 12.377 12.377 12 12C11.623 11.623 11.4112 11.1117 11.4112 10.5785C11.4112 10.0453 11.623 9.53399 12 9.15698L15.553 5.604C15.9302 5.22741 16.4415 5.01587 16.9745 5.01587C17.5075 5.01587 18.0188 5.22741 18.396 5.604L18.4 5.59998ZM20.528 3.47205C20.0614 3.00535 19.5074 2.63503 18.8977 2.38245C18.288 2.12987 17.6344 1.99988 16.9745 1.99988C16.3145 1.99988 15.661 2.12987 15.0513 2.38245C14.4416 2.63503 13.8876 3.00535 13.421 3.47205L9.86801 7.02502C9.40136 7.49168 9.03118 8.04568 8.77863 8.6554C8.52608 9.26511 8.39609 9.91855 8.39609 10.5785C8.39609 11.2384 8.52608 11.8919 8.77863 12.5016C9.03118 13.1113 9.40136 13.6653 9.86801 14.132C10.3347 14.5986 10.8886 14.9688 11.4984 15.2213C12.1081 15.4739 12.7616 15.6039 13.4215 15.6039C14.0815 15.6039 14.7349 15.4739 15.3446 15.2213C15.9543 14.9688 16.5084 14.5986 16.975 14.132L20.528 10.579C20.9947 10.1124 21.3649 9.55844 21.6175 8.94873C21.8701 8.33902 22.0001 7.68547 22.0001 7.02551C22.0001 6.36555 21.8701 5.71201 21.6175 5.10229C21.3649 4.49258 20.9947 3.93867 20.528 3.47205Z"
                                        fill="currentColor"
                                      ></path>
                                      <path
                                        d="M14.132 9.86804C13.6421 9.37931 13.0561 8.99749 12.411 8.74695L12 9.15698C11.6234 9.53421 11.4119 10.0455 11.4119 10.5785C11.4119 11.1115 11.6234 11.6228 12 12C12.3766 12.3772 12.5881 12.8885 12.5881 13.4215C12.5881 13.9545 12.3766 14.4658 12 14.843L8.44699 18.396C8.06999 18.773 7.55868 18.9849 7.02551 18.9849C6.49235 18.9849 5.98101 18.773 5.604 18.396C5.227 18.019 5.0152 17.5077 5.0152 16.9745C5.0152 16.4413 5.227 15.93 5.604 15.553L8.74701 12.411C8.28705 11.233 8.28705 9.92498 8.74701 8.74695C8.10159 8.99737 7.5152 9.37919 7.02499 9.86804L3.47198 13.421C2.52954 14.3635 2.00009 15.6417 2.00009 16.9745C2.00009 18.3073 2.52957 19.5855 3.47202 20.528C4.41446 21.4704 5.69269 21.9999 7.02551 21.9999C8.35833 21.9999 9.63656 21.4704 10.579 20.528L14.132 16.975C14.5987 16.5084 14.9689 15.9544 15.2215 15.3447C15.4741 14.735 15.6041 14.0815 15.6041 13.4215C15.6041 12.7615 15.4741 12.108 15.2215 11.4983C14.9689 10.8886 14.5987 10.3347 14.132 9.86804Z"
                                        fill="currentColor"
                                      ></path>
                                    </svg>
                                  </span>
                                </button>

                                {/* <div
                                  className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-300px"
                                  data-kt-menu="true"
                                >
                                  <div className="card card-flush">
                                    <div className="card-body p-5">
                                      <div
                                        className="d-flex"
                                        data-kt-filemanger-table="copy_link_generator"
                                      >
                                        <div
                                          className="me-5"
                                          data-kt-indicator="on"
                                        >
                                          <span className="indicator-progress">
                                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                          </span>
                                        </div>

                                        <div className="fs-6 text-dark">
                                          Generating Share Link...
                                        </div>
                                      </div>

                                      <div
                                        className="d-flex flex-column text-start d-none"
                                        data-kt-filemanger-table="copy_link_result"
                                      >
                                        <div className="d-flex mb-3">
                                          <span className="svg-icon svg-icon-2 svg-icon-success me-3">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24"
                                              height="24"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                            >
                                              <path
                                                d="M9.89557 13.4982L7.79487 11.2651C7.26967 10.7068 6.38251 10.7068 5.85731 11.2651C5.37559 11.7772 5.37559 12.5757 5.85731 13.0878L9.74989 17.2257C10.1448 17.6455 10.8118 17.6455 11.2066 17.2257L18.1427 9.85252C18.6244 9.34044 18.6244 8.54191 18.1427 8.02984C17.6175 7.47154 16.7303 7.47154 16.2051 8.02984L11.061 13.4982C10.7451 13.834 10.2115 13.834 9.89557 13.4982Z"
                                                fill="currentColor"
                                              ></path>
                                            </svg>
                                          </span>
                                          <div className="fs-6 text-dark">
                                            Share Link Generated
                                          </div>
                                        </div>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value="https://path/to/file/or/folder/"
                                        />
                                        <div className="text-muted fw-normal mt-2 fs-8 px-3">
                                          Read only.{" "}
                                          <a
                                            href="/jet-html-free/apps/file-manager/settings/.html"
                                            className="ms-2"
                                          >
                                            Change permissions
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div> */}
                              </div>

                              <div className="ms-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                                  data-kt-menu-trigger="click"
                                  data-kt-menu-placement="bottom-end"
                                >
                                  <span className="svg-icon svg-icon-5 m-0">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <rect
                                        x="10"
                                        y="10"
                                        width="4"
                                        height="4"
                                        rx="2"
                                        fill="currentColor"
                                      ></rect>
                                      <rect
                                        x="17"
                                        y="10"
                                        width="4"
                                        height="4"
                                        rx="2"
                                        fill="currentColor"
                                      ></rect>
                                      <rect
                                        x="3"
                                        y="10"
                                        width="4"
                                        height="4"
                                        rx="2"
                                        fill="currentColor"
                                      ></rect>
                                    </svg>
                                  </span>
                                </button>
{/* 
                                <div
                                  className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-150px py-4"
                                  data-kt-menu="true"
                                >
                                  <div className="menu-item px-3">
                                    <a
                                      href="/jet-html-free/apps/file-manager/files.html"
                                      className="menu-link px-3"
                                    >
                                      View
                                    </a>
                                  </div>

                                  <div className="menu-item px-3">
                                    <a
                                      href="#"
                                      className="menu-link px-3"
                                      data-kt-filemanager-table="rename"
                                    >
                                      Rename
                                    </a>
                                  </div>

                                  <div className="menu-item px-3">
                                    <a href="#" className="menu-link px-3">
                                      Download Folder
                                    </a>
                                  </div>

                                  <div className="menu-item px-3">
                                    <a
                                      href="#"
                                      className="menu-link px-3"
                                      data-kt-filemanager-table-filter="move_row"
                                      data-bs-toggle="modal"
                                      data-bs-target="#kt_modal_move_to_folder"
                                    >
                                      Move to folder
                                    </a>
                                  </div>

                                  <div className="menu-item px-3">
                                    <a
                                      href="#"
                                      className="menu-link text-danger px-3"
                                      data-kt-filemanager-table-filter="delete_row"
                                    >
                                      Delete
                                    </a>
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                   
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

export default FileManager;
