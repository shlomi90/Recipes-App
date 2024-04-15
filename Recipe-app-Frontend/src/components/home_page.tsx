// Homepage.tsx
import { useState, useEffect } from 'react';
import PostCard from './post_card.tsx';
import PostDetail from './post_detail.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/homepage.css';


function Homepage({ accessToken, posts, fetchPosts,setPosts}: { accessToken: string, posts: any[],setPosts:any, fetchPosts: () => void }) {
  const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
      fetchPosts();
      setPosts(posts);
    }, [accessToken]);

  const handlePostClick = (post:any) => {
    setSelectedPost(post);
  };

  const handlePostDetailClose = () => {
    setSelectedPost(null);
  };

  return (
    <div className="container">
      <div className='posts-container'>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onPostClick={handlePostClick} />
        ))}
      </div>
      {selectedPost && (
        <PostDetail post={selectedPost} onClose={handlePostDetailClose} fetchPosts={fetchPosts} />
      )}
      
    </div>
  );
}

export default Homepage;
