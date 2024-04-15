// Navbar.tsx
import  { useState } from 'react';
import axios from 'axios';
import '../Style/navbar.css';
import NewPostModal from './NewPostModal.tsx';
import ProfileModal from './profile.tsx';

const Navbar = ({ handleLogout, refreshToken, setPosts,fetchPosts }:{handleLogout:any,refreshToken:any,setPosts:any,fetchPosts:any}) => {
  const onLogOutClick = () => {
    handleLogout(refreshToken);
  };
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleNewPostClick = () => {
    setShowNewPostModal(true);
    console.log('clicked');
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    console.log('clicked');
  };

  const handleHomeClick =async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('https://193.106.55.205/post', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  const handleYourRecipesClick = async () => {
    try {
      const userId = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`https://193.106.55.205/post/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <button className="navbar-btn" onClick={onLogOutClick}>
          Logout
        </button>
        <div className="ml-auto d-flex">
          <a className="nav-link" href="#" onClick={handleNewPostClick}>
            Create recipe
          </a>
          <a className="nav-link" href="#" onClick={handleYourRecipesClick}>
            Your recipes
          </a>
          <a className="nav-link" href="#" onClick={handleProfileClick}>
            Your Profile
          </a>
          <a className="nav-link" href="#" onClick={handleHomeClick}>
           Home
          </a>
        </div>
      </div>
      {showNewPostModal && <NewPostModal onClose={() => setShowNewPostModal(false)} fetchPosts={fetchPosts}  />}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </nav>
  );
};

export default Navbar;
