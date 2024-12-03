import ShowItems from "../FileManagerShowItems/ShowItems"

// const folders = ["amar", "tomar", "tar", "kar"]


const FileManagerHomeComponent = ({items}) => {
  return (
    <>

        <ShowItems items={items}/>
    </>
  )
}

export default FileManagerHomeComponent