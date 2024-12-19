import { useEffect, useRef, useState } from "react";
import "./ShowItems.css";

const ShowItems = ({ title, items, foldersId }) => {
  const [view, setView] = useState("list"); // Default to list view
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page



  // for checked items
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const [editingRowIndex, setEditingRowIndex] = useState(null); // To track the editing row
  const [editedName, setEditedName] = useState(""); // To hold the new name while editing

  const handleRenameFolder = (index, name, id) => {
   
    setEditingRowIndex(index); // Set the editing row index
    setEditedName(name); // Set the current name to the input field
    
  };
  const handleBlur = () => {
    setEditingRowIndex(null); // Deactivate editing when clicking outside
  };

  const handleNameChange = (event) => {
    setEditedName(event.target.value); // Update the edited name as the user types
  };

  const handleKeyDown = (event, itemId) => {
    if (event.key === "Enter") {
      // Handle the name update when Enter is pressed
      console.log(`Renaming item with ID ${itemId} to: ${editedName}`);
      // Trigger your API call or state update logic here
      setEditingRowIndex(null); // Exit edit mode
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
       setSelectAll(isChecked);

    const updatedCheckedItems = currentItems.reduce((acc, item, index) => {

      acc[index] = isChecked; // Mark all as checked/unchecked
      return acc;
    }, {});
    setCheckedItems(updatedCheckedItems);
  };

  const handleItemCheck = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // folder name extract from object


  // Calculate total pages
  const totalPages = Math.ceil(items.length / rowsPerPage);

  // Slice items for the current page
  const currentItems = items.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };




  // handle delete file or folder
  const handleDelete = (id) => {
    alert(`Delete item with ID: ${id}`);
    // Implement delete logic here
  };

  const handleMove = (id) => {
    alert(`Move item with ID: ${id}`);
    // Implement move logic here
  };

  return (
    <>
      <div
        style={{ marginBottom: "6px", display: "flex", justifyContent: "end" }}
      >
        <button
          onClick={() => setView("list")}
          style={{
            marginRight: "10px",
            border: view === "list" ? "2px solid blue" : "1px solid gray",
          }}
        >
          <i style={{ fontSize: "12px" }} className="fa-solid fa-list"></i>
        </button>
        <button
          onClick={() => setView("grid")}
          style={{
            border: view === "grid" ? "2px solid blue" : "1px solid gray",
          }}
        >
          <i style={{ fontSize: "12px" }} className="fa-regular fa-square"></i>
        </button>
      </div>

      {items.length > 0 ? (
        view === "list" ? (
          <table className="table" style={{ fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ width: "4%" }} scope="col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      checked={selectAll}
                      onChange={handleSelectAll}
                      id="flexCheckChecked"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckChecked"
                    ></label>
                  </div>
                </th>
                <th style={{ width: "33%" }} scope="col">
                  NAME
                </th>
                <th scope="col">SIZE</th>
                <th style={{ width: "10%" }} scope="col">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item,index) => {
           
                return (
                  
                  <tr key={item._id}>
                    <th scope="row">
                      {" "}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id={`checkbox-${item._id}`}
                          checked={!!checkedItems[index]} // Ensure checked state is boolean
                          onChange={() => handleItemCheck(index)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbox-${index}`}
                        ></label>
                      </div>
                      
                    </th>
                    <td>
              {editingRowIndex === index ? (
                <input
                  type="text"
                  value={editedName}
                  onBlur={handleBlur}
                  onChange={handleNameChange}
                  onKeyDown={(e) => handleKeyDown(e, item._id)}
                  autoFocus
                  style={{
                    backgroundColor: "#e8f0fe",
                    border: "1px solid #1a73e8",
                    borderRadius: "4px",
                    padding: "5px",
                  }}
                />
              ) : (
                <>
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
                      d="M10 4H21C21.6 4 22 4.4 22 5V7H10V4Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M9.2 3H3C2.4 3 2 3.4 2 4V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V7C22 6.4 21.6 6 21 6H12L10.4 3.60001C10.2 3.20001 9.7 3 9.2 3Z"
                      fill="currentColor"
                    ></path>
                  </svg>{" "}
                  &nbsp;&nbsp;
                  <span>{item.name}</span>
                </>
              )}
            </td>

                    <td>Otto</td>
                    <td>
                      <button
                        className="iconBtn"
                        style={{
                          width: "30px",
                          height: "30px",
                          border: "none",
                          marginRight: "10px",
                          textAlign: "center",
                          borderRadius: "5px",
                          backgroundColor: "#F1FAFF",
                        }}
                      >
                        <svg
                          className="iconSvg"
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 60 24"
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
                      </button>

                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenu2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        className="iconBtn"
                        style={{
                          backgroundColor: "#F1FAFF",
                          width: "30px",
                          height: "30px",
                          border: "none",
                          borderRadius: "5px",
                        }}
                      >
                        <svg
                          className="iconSvg"
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 65 24"
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
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenu2"
                      >
                        <li>
                          <button className="dropdown-item" type="button" onClick={()=> handleRenameFolder(index, item.name, item._id)}>
                            Rename
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" type="button">
                            Download
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" type="button">
                            Move to
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" type="button">
                            Delete
                          </button>
                        </li>
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {currentItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  position: "relative",
                }}
              >
                {/* Action icons */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => handleMove(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    📂
                  </button>
                </div>
                {/* Content */}
                <div>
                  <p>
                    <strong>ID:</strong> {item.id}
                  </p>
                  <p>
                    <strong>First Name:</strong> {item.first}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {item.last}
                  </p>
                  <p>
                    <strong>Handle:</strong> {item.handle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "16px",
            color: "#666",
          }}
        >
          No item found
        </div>
      )}

      <br />

      <nav aria-label="Page navigation example">
        <ul className="pagination pagination-sm justify-content-end">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default ShowItems;
