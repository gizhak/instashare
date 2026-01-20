import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
	addPostComment,
	addPostLike,
	loadPosts,
	loadPost,
} from '../store/actions/post.actions';
import { SvgIcon } from '../cmps/SvgIcon';
import { useState } from 'react';
import { Modal } from '../cmps/Modal';
import { postService } from '../services/post';
import { userService } from '../services/user'; // fix import path -guy
import {
	showErrorMsg,
	showSuccessMsg,
	showGeneralMsg,
} from '../services/event-bus.service';
import { PostWithComments } from '../cmps/PostWithComments';
import { store } from '../store/store';
import { checkIsLiked } from '../services/util.service';
import { updateUser } from '../store/actions/user.actions';

export function Feed() {
	const posts = useSelector((storeState) => storeState.postModule.posts);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState('menu'); // 'menu' or 'comments'
	const [selectedPost, setSelectedPost] = useState(null);

	const loggedInUser = userService.getLoggedinUser();
	console.log('loggedInUser:', loggedInUser);
	useEffect(() => {
		loadPosts();
	}, []);

	console.log('posts:', posts);
	const navigate = useNavigate();

	// Function to open comments modal
	const handleOpenComments = async (postId) => {
		setModalType('comments');
		await loadPost(postId);
		setIsModalOpen(true);
	};

	// Function to open menu modal
	function handleOpenMenu(post) {
		setSelectedPost(post);
		setModalType('menu');
		setIsModalOpen(true);
	}

	function handleCloseModal() {
		setIsModalOpen(false);
		setModalType('menu');
		setSelectedPost(null); // Clear selected post
	}

	function handleReportPost(user) {
		showErrorMsg(`Reported user: ${user.fullname}`);
		handleCloseModal();
	}

	// function handleGoToPost(postId) {
	// 	setModalType('comments');
	// 	loadPost(postId);
	// }

	async function followUser(userId) {
		const updates = {
			following: [...loggedInUser.following, userId],
		};
		await updateUser(updates);
		showSuccessMsg('You are now following this user');
	}

	async function toggleBookmark(postId) {
		const isBookmarked = loggedInUser?.savedPostIds?.includes(postId);
		const savedPostIds = loggedInUser.savedPostIds || [];

		const updates = {
			savedPostIds: isBookmarked
				? savedPostIds.filter((id) => id !== postId)
				: [...savedPostIds, postId],
		};

		await updateUser(updates);
		showSuccessMsg(isBookmarked ? 'Bookmark removed' : 'Post bookmarked');
	}

	return (
		<section className="home">
			<section className="feed-grid-container">
				{posts &&
					posts.map((post) => {
						const isLiked = checkIsLiked(post, loggedInUser);

						return (
							<article key={post._id} className="post-article flex row">
								<div className="post-header">
									<img className="post-profile-img" src={post.by.imgUrl} />
									<h4 onClick={() => navigate(`/user/${post.by._id}`)}>
										{post.by.fullname}
									</h4>
									<div>
										{loggedInUser && loggedInUser.following && !loggedInUser.following.includes(post.by._id) && (
											<span onClick={() => followUser(post.by._id)}>
												Follow
											</span>
										)}
										<SvgIcon
											iconName="postDots"
											className="icon"
											onClick={() => handleOpenMenu(post)}
										/>
									</div>
								</div>

								<img className="post-img" src={post.imgUrl} />

								<div className="post-actions">
									<SvgIcon
										iconName={isLiked ? 'likeFilled' : 'like'}
										fill={isLiked ? '#ff3040' : 'currentColor'}
										onClick={() => addPostLike(post._id)}
									/>
									<span>{post.likedBy.length}</span>

									<SvgIcon
										iconName="comment"
										onClick={() => handleOpenComments(post._id)}
									/>
									<span>{post.comments.length}</span>
									<div className="bookmark-icon">
										<SvgIcon
											iconName={
												loggedInUser?.savedPostIds?.includes(post._id)
													? 'bookmarkFilled'
													: 'bookmark'
											}
											onClick={() => toggleBookmark(post._id)}
										/>
									</div>
								</div>
								<div className="post-desc">
									<h4 onClick={() => navigate(`/user/${post.by._id}`)}>
										{post.by.fullname}: <span>{post.txt}</span>
									</h4>
								</div>
							</article>
						);
					})}
			</section>
			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				variant={modalType}
			>
				{modalType === 'menu' && selectedPost && (
					<>
						<div
							className="modal-item danger"
							onClick={() => handleReportPost(selectedPost.by)}
						>
							Report
						</div>

						<div
							className="modal-item"
							onClick={() => {
								handleCloseModal();
								handleOpenComments(selectedPost._id);
							}}
						>
							Go to post
						</div>
						<div
							className="modal-item"
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(
										`${window.location.origin}/post/${selectedPost._id}`
									);
									// Optional: Show a success message
									showGeneralMsg('Link copied to clipboard');
									handleCloseModal();
								} catch (err) {
									console.error('Failed to copy link:', err);
								}
							}}
						>
							Copy link
						</div>
						<div
							className="modal-item"
							onClick={() => {
								navigate(`/user/${selectedPost.by._id}`);
								handleCloseModal();
							}}
						>
							About this account
						</div>
						<div className="modal-item cancel" onClick={handleCloseModal}>
							Cancel
						</div>
					</>
				)}
				{modalType === 'comments' && (
					<PostWithComments onClose={handleCloseModal} />
				)}
			</Modal>
		</section>
	);
}
