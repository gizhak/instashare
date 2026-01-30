import { useNavigate, useLocation } from 'react-router-dom';

export function usePostNavigation() {
	const navigate = useNavigate();
	const location = useLocation();

	function openPost(postId, contextPosts) {
		let currentPath = location.pathname.replace(/\/post\/[^/]+$/, '');
		if (currentPath.endsWith('/')) currentPath = currentPath.slice(0, -1);

		// Pass the posts array in navigation state
		navigate(`${currentPath}/post/${postId}`, {
			state: { contextPosts: contextPosts?.map((p) => p._id) || [] },
		});
	}

	return { openPost };
}
