import { PostDetailsContent } from './PostDetailsContent.jsx';
import { Modal } from './Modal.jsx';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadPost } from '../store/actions/post.actions';

export function PostModal() {
	const { postId, id: userId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const allPosts = useSelector((storeState) => storeState.postModule.posts);

	const [selectedPost, setSelectedPost] = useState(null);
	const [currentIndex, setCurrentIndex] = useState(null);
	const [loading, setLoading] = useState(false);

	// Get the specific post IDs that were passed via state
	const contextPostIds = location.state?.contextPosts || [];

	// Filter to get the actual post objects
	const contextPosts =
		contextPostIds.length > 0
			? allPosts.filter((p) => contextPostIds.includes(p._id))
			: allPosts; // Default to all posts if no context provided

	// Load post when postId changes
	useEffect(() => {
		if (postId) {
			loadPostById(postId);
		} else {
			setSelectedPost(null);
			setCurrentIndex(null);
		}
	}, [postId]);

	async function loadPostById(id) {
		try {
			setLoading(true);

			const postInList = contextPosts.find((p) => p._id === id);
			if (postInList) {
				const index = contextPosts.findIndex((p) => p._id === id);
				setSelectedPost(postInList);
				setCurrentIndex(index);
			} else {
				const post = await loadPost(id);
				setSelectedPost(post);
				setCurrentIndex(null);
			}
		} catch (error) {
			console.error('Failed to load post:', error);
			navigate(-1);
		} finally {
			setLoading(false);
		}
	}

	function handleCloseModal() {
		setSelectedPost(null);
		setCurrentIndex(null);
		navigate(-1);
	}

	function handleNavigate(newIndex) {
		if (contextPosts && contextPosts[newIndex]) {
			const newPost = contextPosts[newIndex];
			setSelectedPost(newPost);
			setCurrentIndex(newIndex);

			let basePath = location.pathname.replace(/\/post\/[^/]+$/, '');
			const newPath = `${basePath}/post/${newPost._id}`;

			// Keep the same context when navigating
			navigate(newPath, {
				replace: true,
				state: { contextPosts: contextPostIds },
			});
		}
	}

	return (
		<Modal isOpen={true} onClose={handleCloseModal} variant="comments">
			{loading ? (
				<div className="loading-container">
					<div className="loading-dots">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			) : (
				selectedPost && (
					<PostDetailsContent
						post={selectedPost}
						posts={contextPosts}
						currentIndex={currentIndex}
						onNavigate={handleNavigate}
						onClose={handleCloseModal}
					/>
				)
			)}
		</Modal>
	);
}
