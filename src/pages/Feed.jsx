import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import {
	addPostLike,
	loadPosts,
	loadPost,
	addPost,
} from '../store/actions/post.actions';
import { SvgIcon } from '../cmps/SvgIcon';
import { Modal } from '../cmps/Modal';
import { userService } from '../services/user';
import {
	showErrorMsg,
	showSuccessMsg,
	showGeneralMsg,
} from '../services/event-bus.service';
import { checkIsLiked } from '../services/util.service';
import { updateUser } from '../store/actions/user.actions';
// import { PostDetailsContent } from '../cmps/PostDetailsContent.jsx';
import { usePostNavigation } from '../customHooks/usePostNavigation.js';

import { socketService } from '../services/socket.service.js';
import { store } from '../store/store.js';
import { updatePostInStore } from '../store/actions/post.actions.js';
import { use } from 'react';

export function Feed() {
	const posts = useSelector((storeState) => storeState.postModule.posts);
	const post = useSelector((storeState) => storeState.postModule.post);
	const loggedInUser = useSelector((storeState) => storeState.userModule.user);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState('menu');
	const [selectedPost, setSelectedPost] = useState(null);
	const [selectedPostIndex, setSelectedPostIndex] = useState(null);

	// console.log('loggedInUser:', loggedInUser);

	console.log('Feed posts:', posts);
	if (posts && posts.length > 0) {
		console.log('First post by:', posts[0].by);
	}

	useEffect(() => {
		loadPosts();
	}, []);

	useEffect(() => {

		socketService.on('post-liked-updated', (updatedPost) => {

			console.log('Received post-liked-updated event:', updatedPost);

			updatePostInStore(updatedPost);
		})

		return () => {
			socketService.off('post-liked-updated');
		}

	}, []);

	// console.log('posts:', posts);
	const navigate = useNavigate();
	const { openPost } = usePostNavigation();

	// Function to open comments modal
	// const handleOpenComments = async (postId, index) => {
	// 	setModalType('comments');
	// 	setSelectedPostIndex(index);
	// 	await loadPost(postId);
	// 	setIsModalOpen(true);
	// };
	const handleOpenComments = (postId) => {
		openPost(postId); // This opens modal via URL routing!
	};

	// Function to open menu modal
	function handleOpenMenu(post, index) {
		setSelectedPost(post);
		setSelectedPostIndex(index);
		setModalType('menu');
		setIsModalOpen(true);
	}

	function handleCloseModal() {
		setIsModalOpen(false);
		setModalType('menu');
		setSelectedPost(null);
		setSelectedPostIndex(null);
	}

	function handleReportPost(user) {
		showErrorMsg(`Reported user: ${user.fullname}`);
		handleCloseModal();
	}

	async function handleNavigate(newIndex) {
		if (newIndex >= 0 && newIndex < posts.length) {
			setSelectedPostIndex(newIndex);
			await loadPost(posts[newIndex]._id);
		}
	}

	async function followUser(userId) {
		const userFollowed = await userService.getById(userId);
		await updateUser({
			following: [...loggedInUser.following, userId],
		});

		await updateUser(
			{
				followers: [...userFollowed.followers, loggedInUser._id],
			},
			userId,
		);
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
		<>
			<Outlet />
			<section className="home">
				<section className="feed-grid-container">
					{posts &&
						[...posts].reverse().map((feedPost, index) => {
							const isLiked = checkIsLiked(feedPost, loggedInUser);

							return (
								<article key={feedPost._id} className="post-article flex row">
									<div className="post-header">
										<img
											className="post-profile-img"
											src={feedPost.by?.imgUrl}
										// alt={feedPost.by?.fullname}
										/>
										<h4 onClick={() => navigate(`/user/${feedPost.by._id}`)}>
											{feedPost.by.fullname}
										</h4>
										<div>
											{loggedInUser &&
												loggedInUser.following &&
												!loggedInUser.following.includes(feedPost.by._id) &&
												loggedInUser._id !== feedPost.by._id && (
													<span onClick={() => followUser(feedPost.by._id)}>
														Follow
													</span>
												)}
											<SvgIcon
												iconName="postDots"
												className="icon"
												onClick={() => handleOpenMenu(feedPost, index)}
											/>
										</div>
									</div>

									{/* Make image clickable to open comments */}
									<img
										className="post-img"
										src={feedPost.imgUrl}
										onClick={() => handleOpenComments(feedPost._id)}
										style={{ cursor: 'pointer' }}
									/>

									<div className="post-actions">
										<SvgIcon
											iconName={isLiked ? 'likeFilled' : 'like'}
											fill={isLiked ? '#ff3040' : 'currentColor'}
											onClick={() => addPostLike(feedPost._id)}
										/>
										<span>{feedPost.likedBy.length}</span>

										{/* Update comment icon to use new function */}
										<SvgIcon
											iconName="comment"
											onClick={() => handleOpenComments(feedPost._id)}
											style={{ cursor: 'pointer' }}
										/>
										<span>{feedPost.comments.length}</span>

										<div className="bookmark-icon">
											<SvgIcon
												iconName={
													loggedInUser?.savedPostIds?.includes(feedPost._id)
														? 'bookmarkFilled'
														: 'bookmark'
												}
												onClick={() => toggleBookmark(feedPost._id)}
											/>
										</div>
									</div>

									<div className="post-desc">
										<h4 onClick={() => navigate(`/user/${feedPost.by._id}`)}>
											{feedPost.by.fullname}: <span>{feedPost.txt}</span>
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
									handleOpenComments(selectedPost._id, selectedPostIndex);
								}}
							>
								Go to post
							</div>
							<div
								className="modal-item"
								onClick={async () => {
									try {
										await navigator.clipboard.writeText(
											`${window.location.origin}/post/${selectedPost._id}`,
										);
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
					{/* {modalType === 'comments' && post && (
					<PostDetailsContent
						post={post}
						// posts={posts}
						// currentIndex={selectedPostIndex}
						// onNavigate={handleNavigate}
					/>
				)} */}
				</Modal>
			</section>
		</>
	);
}
