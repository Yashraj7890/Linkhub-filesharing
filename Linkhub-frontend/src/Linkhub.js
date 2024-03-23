import { useRef, useState, useEffect } from "react";
import './index.css';
import axios from 'axios';
import swal from 'sweetalert';

const MAX_FILE_SIZE = 45 * 1024 * 1024;

const handleLogout = () => {
  window.localStorage.clear();
  window.location.href = "./login";
};

function Linkhub() {
  const [result, setResult] = useState("");
  const [file, setFile] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setuploadHistory] = useState([]);
  const [userName, setUser] = useState("");
  const fileInputRef = useRef();

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const uploadFile = async (data) => {
    try {
      const result = await axios.post(process.env.REACT_APP_SERVER_URL + '/fileUpload', data);
      const arr = result.data.history.map(obj => Object.values(obj));
      setuploadHistory(arr);
      return result.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const create = async () => {
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          swal("File too large!", "Please upload a file less than 45MB", "error");
          setFile('');
          return;
        }
        setUploading(true);
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);
        data.append("owner", window.localStorage.getItem("user"));
        let response = await uploadFile(data);
        setUploading(false);
        setResult(response.path);
        swal("Link created!", "Share the download link to share the file", "success");
      }
    };
    create();
  }, [file]);

  useEffect(() => {
    const userName = window.localStorage.getItem("user");
    setUser(userName);

    const fetchData = async () => {
      try {
        const data = {
          username: userName
        };
        const history = await axios.post(process.env.REACT_APP_SERVER_URL + "/getHistory", data);
        const twoDArray = history.data.map(obj => Object.values(obj));
        setuploadHistory(twoDArray);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  async function deleteFile(id) {
    const data = { fileId: id };
    await axios.post(process.env.REACT_APP_SERVER_URL + "/deleteFile", data);
  }

  const handleDelete = (index, id) => {
    const updatedHistory = [...uploadHistory];
    updatedHistory.splice(index, 1);
    setuploadHistory(updatedHistory);
    deleteFile(id);
  };
  return (
    <div className="linkhub-box">
      <div>
        <div className='heading-main'>LinkHub<span className='cursor'></span></div>
      </div>
      <div className='subheading'>
        <div>Upload your files and share using the generated link.</div>
      </div>
      <div className="linkhub-box-inner">
        <div className="box">
          <div className="box-inner">
            <div><div className="info">Please wait for sometime for the link to be generated after uploading a file.</div></div>
            <div className="upload-btn-box"><button onClick={onUploadClick} className="btn btn-dark upload-btn">Upload</button></div>
            <div><input className="file-input" type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileInputRef}></input></div>

            <div className="link-box">
              {uploading ?(
                <div className="link-inner" style={{paddingBottom:"1rem"}}>
                  <span className="loading-text"><i className="fa-solid fa-link fa-fade" style={{fontSize: '2rem'}}></i></span>
                </div>
              ) : result ? (
                <div className="link-inner" style={{paddingBottom:"1rem"}}>
                  <a className="link" href={result} target="_blank" >{result}</a>
                </div>
              ) : (
                <div className="link-inner">
                  
                </div>
              )}
            </div>

            <div className="logout-btn-box"><button onClick={handleLogout} className="btn btn-outline-danger logout-btn">LogOut</button></div>
            <div className="accordion accordion-flush" id="accordionFlushExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    Your previous uploads
                  </button>
                </h2>
                <div id="flush-collapseOne" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <div className="history-list">
                      {uploadHistory.map((item, index) => (
                        <div key={index} className="container upload-history-element-box"><div className="row">
                          <span className="upload-history-element-name col-sm-12 ">File Name: {item[2]}</span>
                          <div className="container">
                            <div className="row">
                              <span className=" col-lg-6 col-md-6 col-sm-12 "><span style={{ color: "black" }}>Link:</span> <span className="upload-history-element-link">{process.env.REACT_APP_SERVER_URL+"/userFiles/" + item[0]}</span></span>
                              <span className="delete-icon-box col-lg-6 col-md-6 col-sm-12"><i className="fa-solid fa-trash delete-icon" onClick={() => handleDelete(index, item[0])}></i></span>
                            </div>
                          </div>

                        </div></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Linkhub;