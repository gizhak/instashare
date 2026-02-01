import { postService } from '../../services/post';
import { store } from '../store';
import {
	ADD_POST,
	REMOVE_POST,
	SET_POSTS,
	SET_POST,
	UPDATE_POST,
	ADD_POST_COMMENT,
	DELETE_POST_COMMENT,
	TOGGLE_LIKE_COMMENT,
} from '../reducers/post.reducer';

export async function loadPosts(filterBy) {
	try {
		const posts = await postService.query(filterBy);
		store.dispatch(getCmdSetPosts(posts));
	} catch (err) {
		console.log('Cannot load posts', err);
		throw err;
	}
}

export async function loadPost(postId) {
	try {
		const post = await postService.getById(postId);
		store.dispatch(getCmdSetPost(post));
		return post;
	} catch (err) {
		console.log('Cannot load post', err);
		throw err;
	}
}

export async function removePost(postId) {
	try {
		await postService.remove(postId);
		store.dispatch(getCmdRemovePost(postId));
	} catch (err) {
		console.log('Cannot remove post', err);
		throw err;
	}
}

export async function addPost(post) {
	try {
		const savedPost = await postService.save(post);
		console.log('Post added:', savedPost);
		store.dispatch(getCmdAddPost(savedPost));
		return savedPost;
	} catch (err) {
		console.log('Cannot add post', err);
		throw err;
	}
}

export async function updatePost(post) {
	try {
		const savedPost = await postService.save(post);
		store.dispatch(getCmdUpdatePost(savedPost));
		return savedPost;
	} catch (err) {
		console.log('Cannot save post', err);
		throw err;
	}
}

export async function addPostComment(postId, txt) {
	try {
		const data = await postService.addPostComment(postId, txt);
		console.log('Service returned:', data);

		store.dispatch(getCmdAddPostComment(data));
		return data.comment;
	} catch (err) {
		console.log('Cannot add post msg', err);
		throw err;
	}
}

export async function deletePostComment(postId, commentId) {
	try {
		await postService.deletePostComment(postId, commentId);
		console.log('Comment deleted:', commentId);

		store.dispatch(getCmdDeletePostComment(postId, commentId));
	} catch (err) {
		console.log('Cannot delete post comment', err);
		throw err;
	}
}

export async function addPostLike(postId) {
	try {
		const likedPost = await postService.togglePostLike(postId);
		store.dispatch(getCmdUpdatePost(likedPost));
		return likedPost;
	} catch (err) {
		console.log('Cannot like post', err);
		throw err;
	}
}

export async function toggleLikeComment(postId, commentId, userId) {
	try {
		const data = await postService.toggleLikeComment(postId, commentId, userId);
		console.log('Like toggled:', data);

		store.dispatch(getCmdToggleLikeComment(postId, commentId, userId));
		return data;
	} catch (err) {
		console.log('Cannot toggle like on comment', err);
		throw err;
	}
}

// Command Creators:
function getCmdSetPosts(posts) {
	return {
		type: SET_POSTS,
		posts,
	};
}
function getCmdSetPost(post) {
	return {
		type: SET_POST,
		post,
	};
}
function getCmdRemovePost(postId) {
	return {
		type: REMOVE_POST,
		postId,
	};
}
function getCmdAddPost(post) {
	return {
		type: ADD_POST,
		post,
	};
}
function getCmdUpdatePost(post) {
	return {
		type: UPDATE_POST,
		post,
	};
}
function getCmdAddPostComment(data) {
	return {
		type: ADD_POST_COMMENT,
		postId: data.postId,
		comment: data.comment,
	};
}

function getCmdDeletePostComment(postId, commentId) {
	return {
		type: DELETE_POST_COMMENT,
		postId,
		commentId,
	};
}

function getCmdToggleLikeComment(postId, commentId, userId) {
	return {
		type: TOGGLE_LIKE_COMMENT,
		postId,
		commentId,
		userId,
	};
}
// unitTestActions()
async function unitTestActions() {
	await loadPosts();
	await addPost(postService.getEmptyPost());
	await updatePost({
		_id: 'm1oC7',
		txt: 'Post-Good',
	});
	await removePost('m1oC7');
	// TODO unit test addPostMsg
}
