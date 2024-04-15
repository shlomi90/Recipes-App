// AddComment.jsx
import axios from 'axios';
import  { useState } from 'react';

const AddComment = ({post, onClose }:{post:any,onClose:any}) => {
  const [commentText, setCommentText] = useState('');

  const handleInputChange = (event:any) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const user_id = localStorage.getItem('userId');
    const post_id = post._id;
    console.log(post_id);
    console.log(user_id);
    try {
      const response = await axios.post(`https://193.106.55.205/post/${post_id}/comments`, {
        content: commentText,
        author: user_id,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        });
        console.log(response);
        onClose();
        } catch (error) {
            console.error('Comment failed', error);}
  };

  return (
    <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2>Add Comment</h2>
        <textarea
            value={commentText}
            onChange={handleInputChange}
            placeholder="Enter your comment here"
        />
        <button onClick={handleSubmit}>Submit</button>
        </div>
        </div>
    );
};

export default AddComment;
