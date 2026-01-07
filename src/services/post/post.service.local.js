import { storageService } from '../async-storage.service';
import { makeId } from '../util.service';
import { userService } from '../user';

const STORAGE_KEY = 'post';

export const postService = {
	query,
	getById,
	save,
	remove,
	addPostComment,
};
window.cs = postService;

_createPosts();

async function query(filterBy = { txt: '', likesCount: 0 }) {
	var posts = await storageService.query(STORAGE_KEY);
	const { txt, likesCount, sortField, sortDir } = filterBy;

	if (txt) {
		const regex = new RegExp(filterBy.txt, 'i');
		posts = posts.filter(
			(post) => regex.test(post.txt) || regex.test(post.description)
		);
	}
	if (likesCount) {
		posts = posts.filter((post) => post.likesCount >= likesCount);
	}
	if (sortField === 'txt') {
		posts.sort(
			(post1, post2) =>
				post1[sortField].localeCompare(post2[sortField]) * +sortDir
		);
	}
	if (sortField === 'likesCount') {
		posts.sort(
			(post1, post2) => (post1[sortField] - post2[sortField]) * +sortDir
		);
	}

	posts = posts.map(
		({ _id, txt, imgUrl, by, loc, comments, likedBy, tags }) => ({
			_id,
			txt,
			imgUrl,
			by,
			loc,
			comments,
			likedBy,
			tags,
		})
	);
	return posts;
}

function getById(postId) {
	return storageService.get(STORAGE_KEY, postId);
}

async function remove(postId) {
	// throw new Error('Nope')
	await storageService.remove(STORAGE_KEY, postId);
}

async function save(post) {
	var savedPost;
	if (post._id) {
		const postToSave = {
			_id: post._id,
			txt: post.txt,
		};
		savedPost = await storageService.put(STORAGE_KEY, postToSave);
	} else {
		const postToSave = {
			txt: post.txt,
			loc: post.loc,
			// Later, owner is set by the backend
			by: userService.getLoggedinUser(),
			comments: [],
			likedBy: [],
			tags: [],
		};
		savedpost = await storageService.post(STORAGE_KEY, postToSave);
	}
	return savedpost;
}

async function addPostComment(postId, txt) {
	// Later, this is all done by the backend
	const post = await getById(postId);

	const comment = {
		id: makeId(),
		by: userService.getLoggedinUser(),
		txt,
	};
	post.comments.push(comment);
	await storageService.put(STORAGE_KEY, post);

	return msg;
}
