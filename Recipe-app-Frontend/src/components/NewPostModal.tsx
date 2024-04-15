import  { useState } from 'react';
import '../Style/newpostmodal.css';
import chef from '../assets/preview.png';
import { uploadImage } from '../services/uploadimg.tsx';
import axios from 'axios';

const NewPostModal = ({onClose,fetchPosts}:{onClose:any,fetchPosts:any}) => {
  // State variables for storing form data
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File>();

  const handleSubmit = async () => {
    const url=await uploadImage(image!);
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    console.log(accessToken);
    try{
      const response = await axios.post('https://193.106.55.205/post', {
        user_id: userId,
        title: title,
        message: message,
        image: url,
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      fetchPosts();
      onClose();
  
      
    
    }catch(error){
      console.error('Post failed', error);
    }
  };

  const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
    const file = files[0];
    setImage(files[0]);
    console.log(e.target.value);
    const reader = new FileReader();
    reader.onloadend = () => {
        const avatarElement: HTMLImageElement | null = document.getElementById('avatar') as HTMLImageElement | null;
        if (avatarElement && reader.result) { // Add null check for reader.result
            avatarElement.src = reader.result.toString();
        }
    }
    reader.readAsDataURL(file);
  }
}


  const handleModalClose = () => {
    onClose();
  };
  
  return (
    <div className="custom-modal">
    <div className="modal-content">
      <span className="close" onClick={handleModalClose}>
        &times;
      </span>
      <form>
        <label>Recipe:</label>
        <input
          placeholder="write your title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Write your recipe here:</label>
        <textarea
          placeholder="write your recipe here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
         <img src={chef} style = {{width: "100px", height: "100px"}} alt="avater"
          id = "avatar"
        />
        <input
        type="file"
        onChange={handleFile}
        >
        </input>
        <button type="submit" onClick={handleSubmit} className="modal-button">
          Post
        </button>
      </form>
    </div>
  </div>
  );
};

export default NewPostModal;
