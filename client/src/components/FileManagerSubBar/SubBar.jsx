import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SubBar.css";
import { createFolder } from "../../features/fileFolder/fileFolderApiSlice";
import { authSelector } from "../../features/auth/authSlice";


const SubBar = ({ setSearchTerm }) => {
  const [showFolderCreatePopUp, setShowFolderCreatePopUp] = useState("none");
  const [name, setName] = useState(""); // State for the input value
  const inputRef = useRef(null); // Reference to the input field

  // Auth selector
  const { user, loader, error, message } = useSelector(authSelector);

  //dispatch

  const dispatch = useDispatch();

  const handleCreateNewFolder = () => {
    setName("New Folder"); // Set default text
    setShowFolderCreatePopUp("block"); // Show the pop-up
    setTimeout(() => inputRef.current?.focus(), 0); // Focus on the input field
  };

  //handle confirm create new folder

  const handleConfirmCreateNewFolder = (e) => {
    e.preventDefault();
    dispatch(createFolder({ name, userId : user._id }));

    setShowFolderCreatePopUp("none"); // Hide the pop-up
  };

  const handleCloseFolderPopup = (e) => {
    e.preventDefault();
    setShowFolderCreatePopUp("none"); // Hide the pop-up
    setName(""); // Clear the input value
  };

  return (
    <>
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={handleCreateNewFolder}
            >
              <i className="fa-solid fa-folder-plus"></i>&nbsp; New Folder
            </button>
            &nbsp;&nbsp;&nbsp;
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
              <i className="fa-solid fa-file-arrow-up"></i> &nbsp; Upload Files
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="file-manager-breadcrum py-3">
          <div className="breadcrum-left">
            <span className="svg-icon svg-icon-2x svg-icon-primary me-3">
              <svg
                style={{ color: "#00B2FF" }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  opacity="0.3"
                  d="M14.1 15.013C14.6 16.313 14.5 17.813 13.7 19.113C12.3 21.513 9.29999 22.313 6.89999 20.913C5.29999 20.013 4.39999 18.313 4.39999 16.613C5.09999 17.013 5.99999 17.313 6.89999 17.313C8.39999 17.313 9.69998 16.613 10.7 15.613C11.1 15.713 11.5 15.813 11.9 15.813C12.7 15.813 13.5 15.513 14.1 15.013ZM8.5 12.913C8.5 12.713 8.39999 12.513 8.39999 12.313C8.39999 11.213 8.89998 10.213 9.69998 9.613C9.19998 8.313 9.30001 6.813 10.1 5.513C10.6 4.713 11.2 4.11299 11.9 3.71299C10.4 2.81299 8.49999 2.71299 6.89999 3.71299C4.49999 5.11299 3.70001 8.113 5.10001 10.513C5.80001 11.813 7.1 12.613 8.5 12.913ZM16.9 7.313C15.4 7.313 14.1 8.013 13.1 9.013C14.3 9.413 15.1 10.513 15.3 11.713C16.7 12.013 17.9 12.813 18.7 14.113C19.2 14.913 19.3 15.713 19.3 16.613C20.8 15.713 21.8 14.113 21.8 12.313C21.9 9.513 19.7 7.313 16.9 7.313Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M9.69998 9.61307C9.19998 8.31307 9.30001 6.81306 10.1 5.51306C11.5 3.11306 14.5 2.31306 16.9 3.71306C18.5 4.61306 19.4 6.31306 19.4 8.01306C18.7 7.61306 17.8 7.31306 16.9 7.31306C15.4 7.31306 14.1 8.01306 13.1 9.01306C12.7 8.91306 12.3 8.81306 11.9 8.81306C11.1 8.81306 10.3 9.11307 9.69998 9.61307ZM8.5 12.9131C7.1 12.6131 5.90001 11.8131 5.10001 10.5131C4.60001 9.71306 4.5 8.91306 4.5 8.01306C3 8.91306 2 10.5131 2 12.3131C2 15.1131 4.2 17.3131 7 17.3131C8.5 17.3131 9.79999 16.6131 10.8 15.6131C9.49999 15.1131 8.7 14.1131 8.5 12.9131ZM18.7 14.1131C17.9 12.8131 16.7 12.0131 15.3 11.7131C15.3 11.9131 15.4 12.1131 15.4 12.3131C15.4 13.4131 14.9 14.4131 14.1 15.0131C14.6 16.3131 14.5 17.8131 13.7 19.1131C13.2 19.9131 12.6 20.5131 11.9 20.9131C13.4 21.8131 15.3 21.9131 16.9 20.9131C19.3 19.6131 20.1 16.5131 18.7 14.1131Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            <a href="#" style={{ color: "#00B2FF", fontWeight: "800" }}>
              Dashboard
            </a>{" "}
            <span className="breadcrum-angle">
              <i
                style={{ color: "#00B2FF" }}
                className="fa-solid fa-angle-right"
              ></i>
            </span>
            <a href="#" style={{ color: "#00B2FF", fontWeight: "800" }}>
              File Manager
            </a>{" "}
            <span className="breadcrum-angle">
              <i
                style={{ color: "#00B2FF" }}
                className="fa-solid fa-angle-right"
              ></i>
            </span>
            <a href="#" style={{ color: "#00B2FF", fontWeight: "800" }}>
              New Folder
            </a>{" "}
            <span className="breadcrum-angle">
              <i
                style={{ color: "#00B2FF" }}
                className="fa-solid fa-angle-right"
              ></i>
            </span>
            <a href="#" style={{ color: "#00B2FF", fontWeight: "800" }}>
              New Folder 1
            </a>{" "}
            <span className="breadcrum-angle">
              <i
                style={{ color: "#00B2FF" }}
                className="fa-solid fa-angle-right"
              ></i>
            </span>
            <a href="#" style={{ color: "#00B2FF", fontWeight: "800" }}>
              New Folder 2
            </a>{" "}
            <span className="breadcrum-angle">
              <i
                style={{ color: "#00B2FF" }}
                className="fa-solid fa-angle-right"
              ></i>
            </span>
          </div>
          <div className="item-amount">
            <button>66 Items</button>
          </div>
        </div>
      </div>

      <div className="row">
        <table style={{ margin: "0px 0px 0px" }}>
          <thead></thead>
          <tbody>
            <tr className="odd">
              <td>
                <form>
                  <div
                    className="folder-create-popup"
                    style={{
                      marginLeft: "50px",
                      display: showFolderCreatePopUp, // Dynamically set the display property
                    }}
                  >
                    <i
                      className="fa-solid fa-folder-plus"
                      style={{ fontSize: "16px", color: "#01B2FF" }}
                    ></i>
                    <input
                      ref={inputRef} // Attach the reference to the input field
                      type="text"
                      name="name"
                      value={name} // Controlled input
                      onChange={(e) => setName(e.target.value)} // Update state on change
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px 15px",
                        borderRadius: "5px",
                        marginRight: "12px",
                        marginLeft: "20px",
                        width: "25%",
                        backgroundColor: "#FFF",
                        fontSize: "14px",
                      }}
                      placeholder="Enter the folder name"
                    />
                    <input
                      type="text"
                      name="userId"
                      value={user._id} // Controlled inputl
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px 15px",
                        borderRadius: "5px",
                        marginRight: "12px",
                        marginLeft: "20px",
                        width: "25%",
                        backgroundColor: "#FFF",
                        fontSize: "14px",
                      }}
                    />
                    <button
                      style={{
                        border: "none",
                        width: "30px",
                        height: "30px",
                        textAlign: "center",
                        borderRadius: "5px",
                        backgroundColor: "#F1FAFF",
                        color: "#45A79B",
                      }}
                      onClick={handleConfirmCreateNewFolder}
                    >
                      <i
                        className="fa-solid fa-check"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </button>
                    &nbsp;
                    <button
                      style={{
                        border: "none",
                        width: "30px",
                        height: "30px",
                        textAlign: "center",
                        borderRadius: "5px",
                        backgroundColor: "#F1FAFF",
                        color: "red",
                      }}
                      onClick={handleCloseFolderPopup} // Close button functionality
                    >
                      <i
                        className="fa-solid fa-x"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </button>
                  </div>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SubBar;
