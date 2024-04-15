// ErrorMessage.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/error.css';

const ErrorMessage = ({ message }:{message:any}) => {
  // Render the error message only when the message prop is present
  return (
    <>
      {message && (
        <div className="auth-error-message">
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default ErrorMessage;
