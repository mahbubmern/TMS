import { useEffect, useState } from "react";
import FileManagerHomeComponent from "../../../components/FileManagerHomeComponent/FileManagerHomeComponent";
import SubBar from "../../../components/FileManagerSubBar/SubBar";
import Title from "../../../components/Title/Title";
import { foldersSelector } from "../../../features/fileFolder/fileFolderSlice";
import { useDispatch, useSelector } from "react-redux";
import { getuserFolders } from "../../../features/fileFolder/fileFolderApiSlice";
import API from "../../../utils/api";


const FileManager = () => {
  const { folders, loader, error, message } = useSelector(foldersSelector);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]); // State for folder names
  


  useEffect(()=>{
   dispatch(getuserFolders())
   const foldersName = folders.map((data)=> data.name)
   setItems(foldersName)


  },[folders]) 

  const [searchTerm, setSearchTerm] = useState("");
 

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
            <FileManagerHomeComponent  items={folders} />
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



         