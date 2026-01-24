import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { addPost } from '../store/actions/post.actions';
import { uploadService } from '../services/upload.service';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service';
import { LoadingSpinner } from './LoadingSpinner';
import '../assets/styles/cmps/post/CreatePost.css';

export function CreatePost({ onClose }) {
    const [step, setStep] = useState('upload'); // 'upload', 'preview', 'caption'
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [caption, setCaption] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const fileInputRef = useRef(null);
    const loggedinUser = useSelector((storeState) => storeState.userModule.user);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setStep('preview');
            };
            reader.readAsDataURL(file);
        } else {
            showErrorMsg('Please select an image file');
        }
    };

    const handleFileInputChange = (ev) => {
        const file = ev.target.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDrop = (ev) => {
        ev.preventDefault();
        setIsDragging(false);
        const file = ev.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (ev) => {
        ev.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleNext = () => {
        setStep('caption');
    };

    const handleBack = () => {
        if (step === 'caption') {
            setStep('preview');
        } else if (step === 'preview') {
            setStep('upload');
            setPreviewUrl(null);
            setSelectedImage(null);
        }
    };

    const handleOverlayClick = () => {
        if (previewUrl || caption) {
            setShowDiscardModal(true);
        } else {
            onClose();
        }
    };

    const handleDiscard = () => {
        setShowDiscardModal(false);
        onClose();
    };

    const handleShare = async () => {
        if (!selectedImage || !loggedinUser) return;

        try {
            setIsUploading(true);
            const imgUrl = await uploadService.uploadImg(selectedImage);

            const newPost = {
                txt: caption,
                imgUrl: imgUrl,
                by: {
                    _id: loggedinUser._id,
                    fullname: loggedinUser.fullname,
                    imgUrl: loggedinUser.imgUrl,
                },
                likedBy: [],
                comments: [],
            };

            await addPost(newPost);
            onClose();
            window.location.reload();
        } catch (err) {
            console.error('Error creating post:', err);
            showErrorMsg('Failed to create post');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="create-post-overlay" onClick={handleOverlayClick}>
            {isUploading && <LoadingSpinner message="Uploading your post..." />}

            {/* Discard Modal */}
            {showDiscardModal && (
                <div className="discard-modal-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className="discard-modal">
                        <h3>Discard post?</h3>
                        <p>If you leave, your edits won't be saved.</p>
                        <button className="discard-btn" onClick={handleDiscard}>Discard</button>
                        <button className="cancel-discard-btn" onClick={() => setShowDiscardModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Close Button */}
            <button className="close-btn" onClick={handleOverlayClick}>✕</button>

            <div className={`create-post-modal ${step === 'caption' ? 'expanded' : ''}`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="create-post-header">
                    {step !== 'upload' && (
                        <button className="back-btn" onClick={handleBack}>←</button>
                    )}
                    <h2 className="create-post-title">Create new post</h2>
                    {step === 'preview' && (
                        <button className="next-btn" onClick={handleNext}>Next</button>
                    )}
                    {step === 'caption' && (
                        <button className="share-btn-header" onClick={handleShare}>Share</button>
                    )}
                </div>

                {/* Content */}
                <div className="create-post-content">
                    {step === 'upload' && (
                        <div
                            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <svg
                                aria-label="Icon to represent media"
                                className="media-icon"
                                fill="currentColor"
                                height="77"
                                role="img"
                                viewBox="0 0 97.6 77.3"
                                width="96"
                            >
                                <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path>
                                <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
                                <path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
                            </svg>
                            <p className="drag-text">Drag photos and videos here</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="select-button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Select from computer
                            </button>
                        </div>
                    )}

                    {(step === 'preview' || step === 'caption') && (
                        <div className="preview-layout">
                            <div className="image-preview">
                                <img src={previewUrl} alt="Preview" />
                            </div>

                            {step === 'caption' && (
                                <div className={`caption-panel ${step === 'caption' ? 'open' : ''}`}>
                                    <div className="user-info-create">
                                        <img src={loggedinUser?.imgUrl} alt={loggedinUser?.fullname} />
                                        <span>{loggedinUser?.fullname}</span>
                                    </div>
                                    <textarea
                                        className="caption-input"
                                        placeholder="Write a caption..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        maxLength={2200}
                                    />
                                    <div className="caption-count">{caption.length}/2,200</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Close Button */}
                {/* <button className="close-btn" onClick={handleOverlayClick}>✕</button> */}
            </div>
        </div>
    );
}
