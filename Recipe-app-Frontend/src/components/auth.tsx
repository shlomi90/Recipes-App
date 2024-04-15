import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/auth.css';
import axios from 'axios';
import ErrorMessage from './error.tsx';
import avatar from '../assets/avatar.png';
import { uploadImage } from '../services/uploadimg.tsx';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import {googleSignIn} from '../services/user.tsx';


function Auth({ onLogin,fetchPosts }:{onLogin:any,fetchPosts:any}) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [, setUserId] = useState('');
  const [, setAccessToken] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [img, setImg] = useState<File>();
  


  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleRegisterModalOpen = () => setRegisterModalOpen(true);
  const handleModalClose = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(false);
    setErrorMessage('');
  }

  const handleLogin = async (e:any) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    try {
      const response = await axios.post("https://193.106.55.205/auth/login", {
        email: email,
        password: password
      });
      // Check if response.data is defined before accessing properties
      if (response.data && response.data['access token:']) {
        
        const access = response.data['access token:'];
        const refresh = response.data['refresh token:']
        const user =response.data['user id:'];
        const userName = response.data['username:'];
        const imageUrl = response.data['imgURL:'];
        const email = response.data['email:'];
        const posts = response.data.posts;
        console.log('user id:', user);
        console.log(response.data);
        console.log('access token:', access);
        setUserId(user);
        setAccessToken(access);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('userId', user);
        localStorage.setItem('userName', userName);
        localStorage.setItem('imgURL', imageUrl);
        localStorage.setItem('email', email);
        localStorage.setItem('posts', JSON.stringify(posts));
        console.log('refresh token:', refresh);
        onLogin(access, refresh);
        handleModalClose();
        fetchPosts(access);
      } else {
        // Handle the case where response.data is undefined or does not contain 'access token:'
        console.error('Unexpected response format:', response.data);
      }
    } catch (err:any) {
      setErrorMessage(err.response?.data + '😔');
      console.error(err);
    }
  }

  

  const handleRegister = async (e:any) => {
    e.preventDefault(); // Prevent default form submission behavior
    const url = await uploadImage(img!);
    try {
      const response = await axios.post("https://193.106.55.205/auth/register", {
        email: email,
        password: password,
        username: userName,
        imgURL: url,
      });
      console.log(response.data);
     
      handleModalClose();
      handleLogin(e);
    } catch (error:any) {
      setErrorMessage(error.response?.data + '😔');
      console.error('Registration failed', error);
    }
  };


const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
        if (files && files.length > 0) {
    const file = files[0];
    setImg(files[0]);
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

const onGoogleLoginSucess = async (credentialResponse:CredentialResponse) => {
  console.log (credentialResponse);
  try{
    const userData= await googleSignIn(credentialResponse);
    console.log(userData);
    localStorage.setItem('accessToken',userData['accessToken'])
    localStorage.setItem('refreshToken',userData['refreshToken'])
    const access = userData.accessToken;
    const refresh = userData.refreshToken;
    
    onLogin(access, refresh);
    console.log(access, refresh); 
  }
  catch (error){
    console.error('Google sign in failed', error);
  }
}

const onGoogleLoginFail = () => {
  console.log("google login failed");
}


  return (
    <div className="container background-container">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-6 col-sm-8 text-center">
          <div>
            <div className="center-text">
              <p className="font-style">It's all about the </p>
              <p className="taste-color">taste</p>
              <div className="button-container">
              <div style={{ marginRight: '16px',marginTop:'10px' }}>
              <GoogleLogin onSuccess={onGoogleLoginSucess} onError={onGoogleLoginFail} />
              </div>
                <button type="button" className="btn btn-success" onClick={handleLoginModalOpen}>
                  Login
                </button>
                <div className="button-space"></div> {/* Add a div for spacing */}
                <button type="button" className="btn btn-success" onClick={handleRegisterModalOpen}>
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoginModalOpen && (
  <div className="custom-modal">
    <div className="modal-content">
      <span className="close" onClick={handleModalClose}>
        &times;
      </span>
      {/* Login form */}
      <form>
        <label>Email address:</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ErrorMessage message={errorMessage} /> {/* Display error only when there is an error */}
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={handleLogin} className="modal-button">
          Login
        </button>
      </form>
    </div>
  </div>
)}
{isRegisterModalOpen && (
  <div className="custom-modal">
    <div className="modal-content">
      <span className="close" onClick={handleModalClose}>
        &times;
      </span>
      {/* Registration form */}
      <form>
        <label>Email address:</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ErrorMessage message={errorMessage} /> {/* Display error only when there is an error */}
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>User_name:</label>
        <input
          type="username"
          placeholder="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <img src={avatar} style = {{width: "100px", height: "100px"}} alt="avater"
          id = "avatar"
        />
        <input
        type="file"
        onChange={handleFile}
        >
        </input>
        <button type="submit" onClick={handleRegister} className="modal-button">
          Register
        </button>
      </form>
    </div>
  </div>
)};
    </div>
  );
}

export default Auth;
