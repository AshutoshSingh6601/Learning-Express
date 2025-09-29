import React, { useEffect, useState } from 'react'

const StoreFiles = () => {

    const [files, setFiles] = useState([])

    const handleAllFiles = async() => {
        const resp = await fetch("http://localhost:4000", {
            method: "GET"})
        const data = await resp.json()
        console.log(data)
        setFiles(data)
    }

    useEffect(() => {
handleAllFiles()
    }, [])
    

  return (
    <div>
        <h1>My Files</h1>
        <p>Store and manage your files with ease.</p>

        <input type="file" />
        <p>progress: 0%</p>
{
    files.map((file, i) => (
        <div key={i}>
            <span>{file}</span>
            <a href={`http://localhost:4000/${file}?action=open`}>Open</a>
            <a href={`http://localhost:4000/${file}?action=download`}>Download</a>
            <button>Rename</button>
            <button>Save</button>
            <button>Delete</button>
        </div>
    )
)
}

    </div>
  )
}

export default StoreFiles