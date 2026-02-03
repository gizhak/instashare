import { httpService } from '../http.service';

export const postService = {
	query,
	getById,
	save,
	remove,
	addPostComment,
	deletePostComment,
	togglePostLike,
	toggleLikeComment,
};

async function query(filterBy = { txt: '', likesCount: 0 }) {
	return httpService.get(`post`, filterBy);
}

function getById(postId) {
	return httpService.get(`post/${postId}`);
}

async function remove(postId) {
	return httpService.delete(`post/${postId}`);
}
async function save(post) {
	var savedPost;
	if (post._id) {
		savedPost = await httpService.put(`post/${post._id}`, post);
	} else {
		savedPost = await httpService.post('post', post);
	}
	return savedPost;
}

async function addPostComment(postId, txt) {
	const savedComment = await httpService.post(`post/${postId}/comment`, {
		txt,
	});
	return { postId, comment: savedComment };
}

async function deletePostComment(postId, commentId) {
	const response = await httpService.delete(
		`post/${postId}/comment/${commentId}`,
	);
	return response;
}

async function togglePostLike(postId) {
	// POST because it changes state
	return httpService.post(`post/${postId}/like`);
}
async function toggleLikeComment(postId, commentId, userId) {
	const response = await httpService.put(
		`post/${postId}/comment/${commentId}/like`,
		{ userId },
	);
	return response;
}
