import { BrowserRouter, Route, Routes } from "react-router-dom";
import DirectoryView from "./DirectoryView";


function App() {
 
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/*" element={<DirectoryView />} />
      </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;
