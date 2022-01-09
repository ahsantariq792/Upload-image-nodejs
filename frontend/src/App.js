import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {

  const [file, setFile] = useState(null);



  function send() {
    console.log(file)
    axios.post("http://localhost:5000/name", file)
      .then((res) => {
        console.log("res", res.data);
      })

    
  }


  function handlefile(e) {
    console.log(e.target.files)
    console.log(e.target.files[0])
    setFile(e.target.files[0])
  }

  function handleupload(e) {
    console.log(file)

    var formData = new FormData();
    formData.append("File", file);

    axios({
      method: "post",
      url: "http://localhost:5000/post",
      data: formData,
      // headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res)=>
    {console.log(res)}, (err)=>{console.log(err)}
    )

  }




  return (
    <>
      <div>
        {/* <form onSubmit={send} enctype="multipart/form-data"> */}
        <input type="file" name="file" onChange={(e) => handlefile(e)} />
        <button type="submit" onClick={(e) => handleupload(e)}>Upload</button>
        {/* </form> */}
      </div>
    </>
  );
}

export default App;
