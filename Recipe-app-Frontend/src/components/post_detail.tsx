import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/postdetail.css';
import axios from 'axios';
import CommentModal from './commentsmodal.tsx';
import AddComment from './addcomment.tsx';
import { uploadImage } from '../services/uploadimg.tsx';

const PostDetail = ({ post, onClose, fetchPosts }: { post: any, onClose: any, fetchPosts: any }) => {
  interface Comment {
    _id: string;
    content: string;
    author: string;
    post_id: string;
    createdAt: string;
    author_id: string;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.message);
  const [numOfComments, setNumOfComments] = useState(post.numOfComments);
  const username = localStorage.getItem('userName');
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>('');

  const fetchComments = async () => {
    const post_id = post._id;
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`https://193.106.55.205/post/${post_id}/comments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setComments(response.data);
      setNumOfComments(response.data.length); // Update the number of comments
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when the component mounts
  }, []);

  const onShowCommentClick = () => {
    setShowModal(true);
  };

  const handleAddComment = () => {
    setShowAddComment(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setComments([]); 
    fetchComments(); // Fetch comments again to update the number of comments
  };

  const handleAddCommentClose = () => {
    setShowAddComment(false);
    fetchComments(); // Fetch comments again to update the number of comments
  };

  const handleDelete = async (post_id:string) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.delete(`https://193.106.55.205/post/${post_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchPosts();
      onClose();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  const handleEdit = async () => {
    setIsEditing(true);
    setImagePreview(post.image);
  }

  
  const handleSaveEdit = async (post_id:string) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(post_id);
    try {
      let updatedData: any = {};
  
      if (editedTitle !== post.title) {
        updatedData.title = editedTitle;
      }
  
      if (editedContent !== post.message) {
        updatedData.message = editedContent;
      }
  
      if (image) {
        const url = await uploadImage(image!);
        updatedData.image = url;
      }
    

      await axios.put(
        `https://193.106.55.205/post/${post_id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // If edit is successful, update the post details and exit edit mode
      if (updatedData.title) {
        post.title = updatedData.title;
      }
  
      if (updatedData.message) {
        post.message = updatedData.message;
      }
  
      setIsEditing(false);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleCancelEdit = () => {
    // Reset edited title and content to original values
    setEditedTitle(post.title);
    setEditedContent(post.message);
    setIsEditing(false);
  };

  const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
    const file = files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
        setImagePreview(reader.result as string);
    }
    reader.readAsDataURL(file);
  }
}

return (
  <div className="post-detail" style={{ backgroundImage: `url(${post.image})`, position: 'fixed', top: '120px', left: 0, right: 0, bottom: 0, zIndex: 999 }}>
    {username === post.owner && (
      <>
        {!isEditing && (
          <>
            <button className='delete' onClick={() => handleDelete(post._id)}>Delete</button>
            <button className='edit' onClick={handleEdit}>Edit</button>
          </>
        )}
        {isEditing && (
          <>
            <button className='save' onClick={()=>handleSaveEdit(post._id)}>Save</button>
            <button className='cancel' onClick={handleCancelEdit}>Cancel</button>
          </>
        )}
      </>
    )}
    {!isEditing && (
      <div className="title">
        <h3>{post.title}</h3>
        <div className="content-scroll">
        <p dangerouslySetInnerHTML={{__html: post.message.replace(/\n/g, '<br>')}}></p>
      </div>
      </div>
    )}
    {isEditing && (
      <>
        <div className="title">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </div>
        <div className="contentedit">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
           
            
          ></textarea>
        </div>
      </>
    )}
    {isEditing && (
      <div className="image-upload">
        <img src={imagePreview} alt="Your image " id='pic' style={{ maxWidth: '10%', maxHeight: '10%' }} />
        <input type="file" onChange={handleFile} />
      </div>
    )}
    <div className='attributes'>
      <div className='owner'>
        <p>Recipe publish by:  {post.owner}</p>
      </div>
      <div className='comments'>
        <p>Number of Comments:<button className='showcomments' onClick={onShowCommentClick}>{numOfComments}</button> </p>
      </div>
      <div className='createdAt'>
        <p>Created at: {post.createdAt}</p>
      </div>
      <button className='addcomment' onClick={handleAddComment}>Add Comment</button>
    </div>
    <span className="close-button" onClick={onClose}>
      &times;
    </span>
    {showModal && <CommentModal comments={comments} onClose={handleCloseModal} post={post} fetchComments={fetchComments} />}
    {showAddComment && <AddComment onClose={handleAddCommentClose} post={post} />}
  </div>
);

};
export default PostDetail;
