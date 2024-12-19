import { useLocation } from "react-router-dom"
import {createBreadCrumb} from "../../helpers/helpers"



const Breadcrumb = () => {
    const {pathname} = useLocation();

  return (
    <>
         
         <nav aria-label="breadcrumb" className="page-breadcrumb">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item">
                            <a href="index.html">Dashboard</a>
                          </li>
                          <li className="breadcrumb-item" aria-current="page" style={{textTransform : 'Capitalize'}}>
                          {createBreadCrumb(pathname.split("/").pop())}
                          </li>
                        </ol>
                      </nav>
    </>
  )
}

export default Breadcrumb