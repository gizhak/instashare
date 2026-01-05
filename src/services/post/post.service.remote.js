import { httpService } from '../http.service';

export const postService = {
	query,
	getById,
	save,
	remove,
	addPostComment,
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
	return savedComment;
}
