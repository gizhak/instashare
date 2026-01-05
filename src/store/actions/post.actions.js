import { postService } from '../../services/post';
import { store } from '../store';
import {
	ADD_POST,
	REMOVE_POST,
	SET_POSTS,
	SET_POST,
	UPDATE_POST,
	ADD_POST_COMMENT,
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
		const msg = await postService.addPostComment(postId, txt);
		store.dispatch(getCmdAddPostMsg(msg));
		return msg;
	} catch (err) {
		console.log('Cannot add post msg', err);
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
function getCmdAddPostMsg(msg) {
	return {
		type: ADD_POST_MSG,
		msg,
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
