import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


function DirectoryView() {
  // const URL = "http://[2406:7400:113:15d9:63f6:84:b0fb:5bfd]/";
  const URL = "http://localhost:4000";
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFilename, setNewFilename] = useState("");
  const [newDirname, setNewDirname] = useState("");
  const {'*': dirname} = useParams()
  // console.log(dirname)

  async function getDirectoryItems() {
    const response = await fetch(`${URL}/directory/${dirname}`);
    const data = await response.json();
    setDirectoryItems(data);
  }
  useEffect(() => {
    getDirectoryItems();
  }, [dirname]);

  async function uploadFile(e) {
    const file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${URL}/files/${dirname}/${file.name}`, true);
    xhr.setRequestHeader("filename", file.name);
    xhr.addEventListener("load", () => {
      // console.log('loaded File',xhr.response);
      console.log('loaded File',xhr);
      getDirectoryItems();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed(2));
    });
    xhr.send(file);
  }

  async function handleDelete(filename) {
    const response = await fetch(`${URL}/files/${dirname}/${filename}`, {
      method: "DELETE",
      body: filename,
    });
    const data = await response.text();
    console.log(data);
    getDirectoryItems();
  }

  async function renameFile(oldFilename) {
    console.log({ oldFilename, newFilename });
    setNewFilename(oldFilename);
  }

  async function saveFilename(oldFilename) {
    setNewFilename(oldFilename);
    const response = await fetch(`${URL}/files/${dirname}/${oldFilename}`, {
      method: "PATCH",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ oldFilename, newFilename: `${dirname}/${newFilename}` }),
    });
    const data = await response.text();
    console.log(data);
    setNewFilename("");
    getDirectoryItems();
  }

  const handleFolder = async(e) => {
    e.preventDefault()
    let url = `${URL}/directory${dirname ? `/${dirname}` : ''}/${newDirname}`
    let response = await fetch(url, {
      method: 'POST'
    })
    const data = await response.json()
    if(response.status === 200){
      setNewDirname("")
      getDirectoryItems();
    }
  }

  return (
    <>
      <h1>My Files</h1>
      <input type="file" onChange={uploadFile} />
      <input
        type="text"
        onChange={(e) => setNewFilename(e.target.value)}
        value={newFilename}
      />
      <p>Progress: {progress}%</p>
      <form onSubmit={handleFolder}>
        <input type="text" onChange={(e)=>setNewDirname(e.target.value)} value={newDirname} />
        <button>Create Folder</button>
      </form>
      {directoryItems.map(({name, isDirectory}, i) => (
        <div key={i}>
          {name} {isDirectory ? <Link to={`./${name}`}>Open</Link> : <a href={`${URL}/files/${dirname}/${name}?action=open`}>Open</a>}{" "}
          {!isDirectory && <a href={`${URL}/files/${dirname}/${name}?action=download`}>Download</a>}
          <button onClick={() => renameFile(name)}>Rename</button>
          <button onClick={() => saveFilename(name)}>Save</button>
          <button
            onClick={() => {
              handleDelete(name);
            }}
          >
            Delete
          </button>
          <br />
        </div>
      ))}
    </>
  );
}

export default DirectoryView;
