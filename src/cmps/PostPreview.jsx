import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";
import { useState } from 'react';
import { useSelector } from "react-redux";

import { addPostComment, addPostLike } from "../store/actions/post.actions";

export function PostPreview({ post, openPost, posts, currentIndex, onNavigate }) {
	const loggedinUser = useSelector((storeState) => storeState.userModule.user)
	const [showDetails, setShowDetails] = useState(false);
	const [commentTxt, setCommentTxt] = useState('');

	const [comments, setComments] = useState(post.comments || []);

	const [deletePost, setDeletePost] = useState(null);

	const [isLiked, setIsLiked] = useState(() => {
		if (!loggedinUser) return false
		return post.likedBy?.some(user => user._id === loggedinUser._id)
	});

	async function handleLike(ev) {
		ev.stopPropagation()
		setIsLiked(!isLiked)
		const likedPost = await addPostLike(post._id)
		console.log('Liked post returned:', likedPost)
	}

	async function handleAddComment(ev) {
		ev.preventDefault()
		if (!commentTxt.trim()) return


		const newComment = {
			date: new Date().toTimeString().slice(0, 5),
			txt: commentTxt,
			by: {
				_id: loggedinUser._id,
				fullname: loggedinUser.fullname,
				imgUrl: loggedinUser.imgUrl
			}
		}


		setComments([...comments, newComment])
		setCommentTxt('')

		await addPostComment(post._id, commentTxt)
	}

	async function handleDeleteComment(ev, commentId) {
		ev.stopPropagation()
		console.log('Deleting comment with ID:', commentId)
		// כאן תוכל להוסיף את הלוגיקה למחיקת תגובה
		// לדוגמה, קריאה לפעולה שמוחקת את התגובה מה-DB ועדכון ה-UI
		const updatedComments = comments.filter(comment => comment.id !== commentId)
		console.log('Updated comments after deletion:', updatedComments)
		setComments(updatedComments)
		// קריאה לפעולה למחיקת התגובה מה-DB

		// const deleteResult = await deletePostComment(post._id, commentId)
		// console.log('Delete comment result:', deleteResult)

	}

	function handlePrev(ev) {
		ev.stopPropagation()
		if (currentIndex > 0 && onNavigate) {
			onNavigate(currentIndex - 1)
		}
	}

	function handleNext(ev) {
		ev.stopPropagation()
		if (posts && currentIndex < posts.length - 1 && onNavigate) {
			onNavigate(currentIndex + 1)
		}
	}

	function openDetails(ev) {
		ev.stopPropagation()
		setShowDetails(true)
	}

	function closeDetails(ev) {
		ev.stopPropagation()
		setShowDetails(false)
	}



	return (
		<article className="post-preview" onClick={openDetails}>

			{/* POST DETAILS MODAL */}
			{showDetails && (
				<div className="post-details-overlay" onClick={closeDetails}>

					{/* Close Button */}
					<button className="close-btn-post " onClick={closeDetails}>✕</button>

					{/* Prev Arrow */}
					{currentIndex > 0 && (
						<button className="nav-arrow prev" onClick={handlePrev}>❮</button>
					)}

					{/* Next Arrow */}
					{posts && currentIndex < posts.length - 1 && (
						<button className="nav-arrow next" onClick={handleNext}>❯</button>
					)}

					{/* Modal Content */}
					<div className="post-details-modal" onClick={(e) => e.stopPropagation()}>

						{/* Left - Image */}
						<div className="post-details-image">
							<img src={post.imgUrl} alt="post" />
						</div>

						{/* Right - Info */}
						<div className="post-details-info">

							{/* Header */}
							<div className="post-details-header">
								<div className="user-info">
									<img className="user-image-post" src={post.by?.imgUrl} alt={post.by?.fullname} />
									<span className="username">{post.by?.fullname}</span>
								</div>
								<button className="more-options">•••</button>
							</div>

							{/* Comments Section */}
							<div className="post-details-comments">
								{comments.length > 0 ? (
									comments.map((comment, idx) => (
										<div key={comment.id || idx} className="comment-item">
											<div className="comment-header">
												<img src={comment.by?.imgUrl} alt={comment.by?.fullname} />
												<div className="comment-meta">
													<span className="comment-time">{comment.date}</span>
													<span className="edit-comment" onClick={(ev) => handleDeleteComment(ev, comment.id)}>•••</span>
												</div>
											</div>
											<div className="comment-content">
												<span className="comment-username">{comment.by?.fullname}</span>
												<span className="comment-text">{comment.txt}</span>
											</div>
											{/* <div className="edit-comment">
												<span>...</span>
											</div> */}
										</div>
									))
								) : (
									<div className="no-comments">
										<h3>No comments yet.</h3>
										<p>Start the conversation.</p>
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="post-details-actions">
								<div className="action-buttons">
									<div className="left-actions">
										<button onClick={handleLike} className={isLiked ? 'liked' : ''}>
											{isLiked ? <FaHeart /> : <FaRegHeart />}
										</button>
										<button><BiSolidMessageRounded /></button>
										<button>
											<svg aria-label="Share Post" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share Post</title>
												<path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line></svg>
										</button>
									</div>
									<button className="save-btn">
										<svg aria-label="Save" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title>
											<polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
									</button>
								</div>

								<div className="likes-count">
									{isLiked ? 'You liked this' : 'Be the first to like this'}
								</div>

								<div className="post-date">
									{post.createdAt || '7 days ago'}
								</div>
							</div>

							{/* Add Comment */}
							<form className="add-comment" onSubmit={handleAddComment}>
								<span className="emoji-btn">
									<svg aria-label="Emoji" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Emoji</title>
										<path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
								</span>
								<input
									type="text"
									placeholder="  Add a comment..."
									value={commentTxt}
									onChange={(e) => setCommentTxt(e.target.value)}
								/>
								<button type="submit" disabled={!commentTxt.trim()}>Post</button>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Thumbnail Image */}
			<img src={post.imgUrl} alt="post" />

			{/* Hover Overlay */}
			<div className="post-overlay">
				<div className="post-stats">
					<div className="stat" onClick={(e) => { e.stopPropagation(); handleLike(e); }}>
						<FaHeart />
						<span>{post.likedBy?.length || 0}</span>
					</div>
					<div className="stat">
						<BiSolidMessageRounded />
						<span>{comments.length}</span>
					</div>
				</div>
			</div>
		</article>
	);
}