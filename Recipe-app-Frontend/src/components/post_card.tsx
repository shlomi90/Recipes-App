
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/postcard.css';

const PostCard = ({ post, onPostClick }: {post:any,onPostClick:any}) => {
  const handleClick = () => {
    console.log(post.image);
    onPostClick(post);
  };
  const image = post.image;
  return (
    <div className="card" style={{ backgroundImage: `url(${image})` }} onClick={handleClick}>
      <div className="content-wrapper">
        <div className="post-content">
          <h2>{post.title}</h2>
          {/* Add more content here if needed */}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
