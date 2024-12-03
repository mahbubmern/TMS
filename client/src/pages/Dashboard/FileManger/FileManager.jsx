import { useState } from "react";
import FileManagerHomeComponent from "../../../components/FileManagerHomeComponent/FileManagerHomeComponent";
import SubBar from "../../../components/FileManagerSubBar/SubBar";
import Title from "../../../components/Title/Title";


const FileManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items] = useState(["File1", "Folder2", "Document3", "Folder4"]); // Example data

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <Title title={"TMS | File Manager"} />
      <div className="page-wrapper">
        <div className="content container-fluid">
        <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
            <SubBar setSearchTerm={setSearchTerm}/>
            <FileManagerHomeComponent  items={filteredItems}/>
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



         