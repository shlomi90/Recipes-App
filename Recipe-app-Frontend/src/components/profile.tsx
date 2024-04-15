import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/profile.css';
import { uploadImage } from '../services/uploadimg.tsx';

const ProfileModal = ({ onClose }: { onClose: () => void }) => {
    const [editedEmail, setEditedEmail] = useState('');
    const [editedUsername, setEditedUsername] = useState('');
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('email');
        const username = localStorage.getItem('userName');
        setEditedEmail(email ?? '');
        setEditedUsername(username ?? '');
    }, []);

    const handleEmailEdit = () => {
        setIsEditingEmail(true);
        setIsModified(true);
    };

    const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEditedEmail(e.target.value);
        setIsModified(true);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImage(file);
            setIsModified(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        const user_id = localStorage.getItem('userId');
        let imgUrl = localStorage.getItem('imgURL');
        const username = localStorage.getItem('userName');
    
        if (image) {
            imgUrl = await uploadImage(image);
        }
    
        try {
            await axios.put(`https://193.106.55.205/auth/${user_id}`, {
                email: editedEmail,
                imgURL: imgUrl,
                username: username,
            });
    
            localStorage.setItem('email', editedEmail);
            if (imgUrl) {
                localStorage.setItem('imgURL', imgUrl);
            }
    
            setIsEditingEmail(false);
            setIsModified(false);
        } catch (error) {
            console.error('Post failed', error);
        }
    };

    const numberOfPosts = JSON.parse(localStorage.getItem('posts') || '[]').length;

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Your Profile</h2>
                <div className="profile-container">
                    <div className="profile-details">
                        <p><strong>Email:</strong> {isEditingEmail ? <input type="text" value={editedEmail} onChange={handleEmailChange} /> : <span onClick={handleEmailEdit}>{editedEmail}</span>}</p>
                        <p><strong>Username:</strong> {editedUsername}</p>
                        <div className='number-of-posts'>
                            <p><strong>Number of Posts: </strong> {numberOfPosts}</p>
                        </div>

                        <div className="profile-image">
                            <p><strong>Your image: </strong></p>
                            <img src={imagePreview || localStorage.getItem('imgURL') || ''} alt="Your Profile " id='pic' style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                        <input type="file" onChange={handleFile} />
                    </div>
                    {isModified && (
                        <button className='Save' onClick={handleSaveChanges}>Save</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
