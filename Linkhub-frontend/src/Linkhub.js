import { useRef,useState,useEffect } from "react";
import './index.css';
import axios from 'axios';

const handleLogout = () => {
    window.localStorage.clear();
    window.location.href = "./login";
}

const uploadFile=async(data)=>{
   try{
    const result = await axios.post('https://linkhub-server.onrender.com/fileUpload', data);
    return result.data;
   }
   catch(err){
    console.log(err);
   }
}


function Linkhub() {
    const[result,setResult]=useState("");
    const [file, setFile] = useState('');
    const fileInputRef = useRef();

    const onUploadClick = () => {
        fileInputRef.current.click();
    }
  
    useEffect(() => {

        const create = async() => {
        if(file){
            const data=new FormData();
            data.append("name",file.name)
            data.append("file",file)
          let response=  await uploadFile(data);
          setResult(response.path);
        }
        };
    
        create();
      }, [file]);

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
        <div ><div className="info">Please wait for sometime for the link to be generated after uploading a file.</div></div>
        <div className="upload-btn-box"><button onClick={onUploadClick} className="btn btn-dark upload-btn">Upload</button></div>
          <div><input className="file-input" type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileInputRef}></input></div>  
           <div className="link-box">
           <div className="link-inner">
           <a  className="link" href={result} target="_blank" >{result}</a>
           </div>
           
           </div> 
            <div className="logout-btn-box"><button onClick={handleLogout} className="btn btn-outline-danger logout-btn">LogOut</button></div>
        </div>
        </div>
        </div>
            
        </div>
    )
}
export default Linkhub;