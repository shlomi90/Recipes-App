
import '../Style/commentsmodal.css';
import axios from 'axios';

const CommentModal = ({ comments, onClose, post, fetchComments }: { comments: any[], onClose: () => void, post: any, fetchComments: () => void }) => {
  const username = localStorage.getItem('userName');
  const postId = post._id;

  const handleDelete = async (commentId:any) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response=await axios.delete(`https://193.106.55.205/post/${postId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        
      });
      fetchComments();
      console.log (response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Comments</h2>
        <div className="comments">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <p className="author">{comment.author}</p>
              <p className="content">{comment.content}</p>
              {username === comment.author && (
                <button className='delete' onClick={() => handleDelete(comment._id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
