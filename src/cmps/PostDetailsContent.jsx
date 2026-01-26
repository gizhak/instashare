import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
	addPostComment,
	deletePostComment,
	toggleLikeComment,
	addPostLike,
	removePost,
} from '../store/actions/post.actions.js';
import { SvgIcon } from './SvgIcon.jsx';
import { Modal } from '../cmps/Modal';

export function PostDetailsContent({
	post,
	posts,
	currentIndex,
	onNavigate,
	onClose,
}) {
	const loggedinUser = useSelector((storeState) => storeState.userModule.user);

	const [commentTxt, setCommentTxt] = useState('');
	const [showDeleteMenu, setShowDeleteMenu] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [comments, setComments] = useState(post?.comments || []);
	const [isLiked, setIsLiked] = useState(() => {
		if (!loggedinUser) return false;
		return post?.likedBy?.some((user) => user._id === loggedinUser._id);
	});

	// Update comments when post changes (for navigation)
	useEffect(() => {
		setComments(post?.comments || []);
		setIsLiked(() => {
			if (!loggedinUser) return false;
			return post?.likedBy?.some((user) => user._id === loggedinUser._id);
		});
	}, [post, loggedinUser]);

	async function handleLike(ev) {
		ev.stopPropagation();
		setIsLiked(!isLiked);
		const likedPost = await addPostLike(post._id);
		console.log('Liked post returned:', likedPost);
	}

	async function handleAddComment(ev) {
		ev.preventDefault();
		if (!commentTxt.trim()) return;

		const newComment = {
			date: new Date().toTimeString().slice(0, 5),
			txt: commentTxt,
			by: {
				_id: loggedinUser._id,
				fullname: loggedinUser.fullname,
				imgUrl: loggedinUser.imgUrl,
			},
		};

		setComments([...comments, newComment]);
		setCommentTxt('');

		await addPostComment(post._id, commentTxt);
	}

	async function handleDeleteComment(ev, commentId) {
		ev.stopPropagation();
		console.log('Post ID:', post._id, 'Comment ID:', commentId);

		try {
			const updatedComments = comments.filter((c) => c.id !== commentId);
			setComments(updatedComments);

			await deletePostComment(post._id, commentId);
		} catch (error) {
			console.error('Failed to delete comment:', error);
		}
	}

	async function handleDeletePost() {
		setIsDeleting(true);
		await removePost(post._id);
		setShowDeleteMenu(false);
		if (onClose) onClose();
		window.location.reload();
	}

	function toggleDeleteMenu(ev) {
		ev.stopPropagation();
		setShowDeleteMenu(!showDeleteMenu);
	}
	function handlePrev(ev) {
		ev.stopPropagation();
		if (currentIndex > 0 && onNavigate) {
			onNavigate(currentIndex - 1);
		}
	}

	function handleNext(ev) {
		ev.stopPropagation();
		if (posts && currentIndex < posts.length - 1 && onNavigate) {
			onNavigate(currentIndex + 1);
		}
	}

	async function handleToggleLikeComment(ev, commentId) {
		try {
			// Optimistically update UI immediately
			const updatedComments = comments.map((comment) => {
				if (comment.id === commentId) {
					const isLiked = comment.likedBy?.includes(loggedinUser._id);
					return {
						...comment,
						likedBy: isLiked
							? comment.likedBy.filter((id) => id !== loggedinUser._id)
							: [...(comment.likedBy || []), loggedinUser._id],
					};
				}
				return comment;
			});
			setComments(updatedComments);

			// Then update the database
			await toggleLikeComment(post._id, commentId, loggedinUser._id);
		} catch (error) {
			console.error('Failed to toggle like:', error);
			// Optionally revert the optimistic update on error
		}
	}

	function getTimeAgo(createdAt) {
		console.log('Calculating time ago for:', createdAt);
		if (!createdAt) return '';

		const now = new Date();
		const postDate = new Date(createdAt);
		const diffInMs = now - postDate;
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		const diffInWeeks = Math.floor(diffInDays / 7);
		const diffInMonths = Math.floor(diffInDays / 30);
		const diffInYears = Math.floor(diffInDays / 365);

		if (diffInMinutes < 1) return 'now';
		if (diffInMinutes === 1) return '1 minute ago';
		if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
		if (diffInHours === 1) return '1 hour ago';
		if (diffInHours < 24) return `${diffInHours} hours ago`;
		if (diffInDays === 1) return '1 day ago';
		if (diffInDays < 7) return `${diffInDays} days ago`;
		if (diffInWeeks === 1) return '1 week ago';
		if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
		if (diffInMonths === 1) return '1 month ago';
		if (diffInMonths < 12) return `${diffInMonths} months ago`;
		if (diffInYears === 1) return '1 year ago';
		return `${diffInYears} years ago`;
	}

	return (
		<div className="post-details-content">
			{isDeleting && (
				<div className="deleting-overlay">
					<div className="deleting-dots">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			)}

			{/* Navigation Arrows */}
			{posts && currentIndex > 0 && (
				<button className="nav-arrow prev" onClick={handlePrev}>
					❮
				</button>
			)}

			{posts && currentIndex < posts.length - 1 && (
				<button className="nav-arrow next" onClick={handleNext}>
					❯
				</button>
			)}

			{/* Modal Content */}
			<div className="post-details-modal">
				{/* Left - Image */}
				<div className="post-details-image">
					<img src={post.imgUrl} alt="post" />
				</div>

				{/* Right - Info */}
				<div className="post-details-info">
					{/* Header */}
					<div className="post-details-header">
						<div className="user-info">
							<img
								className="user-image-post"
								src={post.by?.imgUrl}
								alt={post.by?.fullname}
							/>
							<span className="username">{post.by?.fullname}</span>
						</div>
						<div className="more-options">
							<SvgIcon iconName="postDots" onClick={toggleDeleteMenu} />
						</div>
					</div>

					{/* Delete Menu Modal */}
					<Modal isOpen={showDeleteMenu} onClose={() => setShowDeleteMenu(false)} variant="menu">
						<div className="modal-header">
							<h3>Delete post?</h3>
							<p>Are you sure you want to delete this post?</p>
						</div>
						<div className="modal-actions">
							<div className="modal-item danger" onClick={handleDeletePost}>
								Delete
							</div>
							<div
								className="modal-item cancel"
								onClick={() => setShowDeleteMenu(false)}
							>
								Cancel
							</div>
						</div>
					</Modal>

					{/* Comments Section  */}
					<div className="post-details-comments">
						{comments.length > 0 ? (
							comments.map((comment, idx) => (
								<div key={comment.id || idx} className="comment-item">
									<img src={comment.by?.imgUrl} alt={comment.by?.fullname} />
									<div className="comment-body">
										<div className="comment-header">
											<span className="comment-username">
												{comment.by?.fullname}
											</span>
											<span className="comment-text">{comment.txt}</span>
											<span
												className={`comment-like ${comment.likedBy?.includes(loggedinUser._id)
													? 'liked'
													: ''
													}`}
												onClick={(e) => handleToggleLikeComment(e, comment.id)}
											>
												{comment.likedBy?.includes(loggedinUser._id) ? <SvgIcon className="liked" iconName="likeFilled" height="12" fill="#ff3040" /> : <SvgIcon iconName="like" height="12" />
												}
											</span>
										</div>
										{/* Guy - fixed comment meta likes count */}
										<div className="comment-meta">
											<span className="comment-time">{comment.date}</span>
											<span className="comment-likes">
												{comment?.likedBy?.length || 0} {comment?.likedBy?.length === 1 ? 'like' : 'likes'}
											</span>
											{loggedinUser && comment.by?._id === loggedinUser._id && (
												<SvgIcon
													iconName="postDots"
													onClick={(ev) => handleDeleteComment(ev, comment.id)}
												/>
											)}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="no-comments">
								<h3>No comments yet.</h3>
								<p>Start the conversation.</p>
							</div>
						)}
					</div>

					{/* Actions Section */}
					<div className="post-details-actions">
						<div className="post-actions-modal">
							<SvgIcon
								iconName={isLiked ? 'likeFilled' : 'like'}
								fill={isLiked ? '#ff3040' : 'currentColor'}
								onClick={(e) => handleLike(e)}
							/>
							<SvgIcon iconName="comment" />
							<SvgIcon iconName="share" />
						</div>
						{/* Guy - Added likes count display */}
						<div className="likes-count">
							{post.likedBy && post.likedBy.length > 0 ? (
								<div className="post-likes">{post?.likedBy?.length || 0} {post?.likedBy?.length === 1 ? 'like' : 'likes'}</div>
							) : (
								'Be the first to like this'
							)}
						</div>

						<div className="post-date">{getTimeAgo(post.createdAt)}</div>
					</div>

					{/* Add Comment Form */}
					<form className="add-comment" onSubmit={handleAddComment}>
						<span className="emoji-btn">
							<SvgIcon iconName="emmoji" />
						</span>

						<input
							type="text"
							placeholder="  Add a comment..."
							value={commentTxt}
							onChange={(e) => setCommentTxt(e.target.value)}
						/>
						<button
							className="post-comment-btn"
							type="submit"
							disabled={!commentTxt.trim()}
						>
							Post
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
