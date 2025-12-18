import React, { useEffect, useState } from 'react'

const StoreFiles = () => {

    const [files, setFiles] = useState([])

    const [isRename, setIsRename] = useState(false)

    const [renamedValue, setRenamedValue] = useState({
        oldName: '',
        newName: ''
    })

    const handleAllFiles = async() => {
        const resp = await fetch("http://localhost:4000", {
            method: "GET"})
        const data = await resp.json()
        console.log(data)
        setFiles(data)
    }

    const handleDeleteFiles = async(filename) => {
        const resp = await fetch(`http://localhost:4000/${filename}`, {
            method: "DELETE"})
        const data = await resp.json()
        console.log(data)
        handleAllFiles()
    }

    const handleUpdateFiles = async(filename) => {
        setRenamedValue({...renamedValue, newName: renamedValue.oldName})
        const resp = await fetch(`http://localhost:4000/${renamedValue.oldName}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({newName: renamedValue.newName})
        })
        const data = await resp.json()
        console.log('patch data',data)
        console.log('patch data',renamedValue.newName)
        handleAllFiles()
    }

    const handleRenameFiles = async(filename) => {
        setIsRename(true)
        setRenamedValue({...renamedValue, oldName: filename, newName: filename})
    }

    useEffect(() => {
handleAllFiles()
    }, [])
    
    
  return (
    <div>
        <h1>My Files</h1>
        <p>Store and manage your files with ease.</p>

        <input type="file" />
        {isRename && <input type="text" name='renamedValue' value={renamedValue.newName} onChange={(e)=>setRenamedValue({...renamedValue, newName: e.target.value})} />}
        <p>progress: 0%</p>
{
    files.map((file, i) => (
        <div key={i}>
            <span>{file}</span>
            <a href={`http://localhost:4000/${file}?action=open`}>Open</a>
            <a href={`http://localhost:4000/${file}?action=download`}>Download</a>
            <button onClick={()=>handleRenameFiles(file)}>Rename</button>
            <button onClick={()=>handleUpdateFiles(file)}>Save</button>
            <button onClick={()=>handleDeleteFiles(file)}>Delete</button>
        </div>
    )
)
}

    </div>
  )
}

export default StoreFiles