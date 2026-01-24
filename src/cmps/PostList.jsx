import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PostDetailsContent } from './PostDetailsContent';
import { userService } from '../services/user';
import { SvgIcon } from './SvgIcon';
import { Modal } from './Modal';
import { loadPost } from '../store/actions/post.actions';

export function PostList({ posts, isExplore = false, handleLike }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPostIndex, setSelectedPostIndex] = useState(null);
	const post = useSelector((storeState) => storeState.postModule.post);

	function shouldShowActionBtns(post) {
		const user = userService.getLoggedinUser();

		if (!user) return false;
		if (user.isAdmin) return true;
		return post.owner?._id === user._id;
	}

	function checkIfLiked(post) {
		const user = userService.getLoggedinUser();
		if (!user) return false;
		return post?.likedBy?.some((likedUser) => likedUser._id === user._id);
	}

	async function handleOpenPost(postId, index) {
		setSelectedPostIndex(index);
		await loadPost(postId);
		setIsModalOpen(true);
	}

	function handleCloseModal() {
		setIsModalOpen(false);
		setSelectedPostIndex(null);
	}

	async function handleNavigate(newIndex) {
		if (newIndex >= 0 && newIndex < posts.length) {
			setSelectedPostIndex(newIndex);
			await loadPost(posts[newIndex]._id);
		}
	}

	return (
		<section className="post-list-container">
			<div
				className={`post-list-grid ${
					isExplore ? 'explore-grid' : 'profile-grid'
				}`}
			>
				{posts.map((post, index) => {
					const isLiked = checkIfLiked(post);

					return (
						<div
							className="post"
							key={post._id}
							style={{ position: 'relative' }}
						>
							{/* Thumbnail Image */}
							<img
								src={post?.imgUrl}
								alt="post"
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									display: 'block',
								}}
							/>

							{/* Hover Overlay */}
							<div
								className="post-overlay"
								onClick={() => handleOpenPost(post._id, index)}
							>
								<div className="post-stats">
									{/* <div className={`stat ${isLiked ? 'liked' : ''}`}>
										<SvgIcon iconName={isLiked ? 'likeFilled' : 'like'} />
										<span>{post?.likedBy?.length || 0}</span>
									</div> */}
									<div className="stat">
										<SvgIcon iconName="commentFilled" />
										<span>{post?.comments?.length || 0}</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Post Details Modal */}
			<Modal isOpen={isModalOpen} onClose={handleCloseModal} variant="comments">
				{post && (
					<PostDetailsContent
						post={post}
						posts={posts}
						currentIndex={selectedPostIndex}
						onNavigate={handleNavigate}
					/>
				)}
			</Modal>
		</section>
	);
}
