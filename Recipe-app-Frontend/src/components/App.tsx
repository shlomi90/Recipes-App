
import '../Style/app.css';
import Navbar from './navbar.tsx';
import Auth from './auth.tsx';
import Homepage from './home_page.tsx';
import axios from 'axios';
import { useState } from 'react';
import Edamam from './edamam.tsx';


function App() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  
  const handleLogin = (access:any, refresh:any) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
    console.log('access token:', access);
    console.log(isAuthenticated)
  };

  const handleLogout = async (refreshToken:any) => {
    try {
      console.log('refresh token:', refreshToken);
      const response = await axios.get(`https://193.106.55.205/auth/logout`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      console.log(response.data);
      setAccessToken('');
      setIsAuthenticated(false);
      localStorage.clear();
    } catch (error) {
      console.error('Logout failed', error);
    }
    
  }

  const fetchPosts = async () => {
    const acc=localStorage.getItem('accessToken');

      
    try {
      const response = await axios.get(`https://193.106.55.205/post`, {
        headers: {
          Authorization: `Bearer ${acc}`,
        },
      });
      console.log(accessToken);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  

  return (
    <div className="app-background">
      {isAuthenticated && <Navbar handleLogout={handleLogout} refreshToken={refreshToken} setPosts={setPosts} fetchPosts={fetchPosts} 
      />} {/* Render Navbar only if authenticated */}
      {isAuthenticated && <Edamam handleLogout={handleLogout} />} {/* Render Edamam only if authenticated */}
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} fetchPosts={fetchPosts}  />
      ) : (
        <Homepage accessToken={accessToken} posts={posts} setPosts={setPosts} fetchPosts={fetchPosts}  />

      )}
    </div>
  );
}

export default App;
