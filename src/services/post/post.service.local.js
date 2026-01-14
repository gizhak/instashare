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
	togglePostLike,
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
			imgUrl: post.imgUrl,
			loc: post.loc,
			// Later, owner is set by the backend
			by: post.by || userService.getLoggedinUser(),
			comments: post.comments || [],
			likedBy: post.likedBy || [],
			tags: post.tags || [],
		};
		savedPost = await storageService.post(STORAGE_KEY, postToSave);
	}
	return savedPost;
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

	return { postId, comment };
}

async function togglePostLike(postId) {
	// Later this should be handled by the backend
	const post = await getById(postId);
	const user = userService.getLoggedinUser();

	if (!user) throw new Error('User not logged in');

	const liker = {
		_id: user._id,
		fullname: user.fullname,
		imgUrl: user.imgUrl,
	};

	const likeIdx = post.likedBy.findIndex((u) => u._id === user._id);

	if (likeIdx !== -1) {
		// 👎 User already liked → cancel like
		post.likedBy.splice(likeIdx, 1);
	} else {
		// 👍 User has not liked yet → add like
		post.likedBy.push(liker);
	}

	await storageService.put(STORAGE_KEY, post);
	return post;
}

export function _createPosts() {
	const postsFromStorage = localStorage.getItem(STORAGE_KEY);
	if (!postsFromStorage) {
		const defaultPosts = [
			{
				_id: 's201',
				txt: 'Sunset reflections at the lake 🌅',
				imgUrl:
					'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
				by: {
					_id: 'u201',
					fullname: 'wanderlust_amy',
					imgUrl:
						'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
				},
				loc: { lat: 39.0, lng: -120.0, name: 'Lake Tahoe' },
				comments: [
					{
						id: 'c2001',
						by: {
							_id: 'u205',
							fullname: 'sunny_days',
							imgUrl:
								'https://images.unsplash.com/photo-1502767089025-6572583495b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
						},
						txt: 'Absolutely postcard perfection!',
					},
				],
				likedBy: [
					{
						_id: 'u205',
						fullname: 'sunny_days',
						imgUrl:
							'https://images.unsplash.com/photo-1502767089025-6572583495b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
					},
				],
				tags: ['sunset', 'lake', 'travel'],
			},
			{
				_id: 's202',
				txt: 'Clear blue skies & calm waters 💙',
				imgUrl:
					'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
				by: {
					_id: 'u202',
					fullname: 'nature_seeker',
					imgUrl:
						'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
				},
				comments: [],
				likedBy: [],
				tags: ['nature', 'lake', 'sky'],
			},
			{
				_id: 's203',
				txt: 'Chilling by the water 🌊',
				imgUrl:
					'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
				by: {
					_id: 'u203',
					fullname: 'cool_vibes',
					imgUrl:
						'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
				},
				comments: [],
				likedBy: [],
				tags: ['chill', 'travel'],
			},
			{
				_id: 's204',
				txt: 'Morning mist over the lake 🌫️',
				imgUrl:
					'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
				by: {
					_id: 'u204',
					fullname: 'early_bird',
					imgUrl:
						'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
				},
				comments: [],
				likedBy: [],
				tags: ['mist', 'peace'],
			},
			// {
			// 	_id: 's205',
			// 	txt: 'Weekend getaway vibes ✨',
			// 	imgUrl:
			// 		'https://images.unsplash.com/photo-1526779259212-7c2e1b1cf378?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
			// 	by: {
			// 		_id: 'u205',
			// 		fullname: 'weekend_lover',
			// 		imgUrl:
			// 			'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
			// 	},
			// 	comments: [],
			// 	likedBy: [],
			// 	tags: ['weekend', 'trip'],
			// },
			{
				_id: 's206',
				txt: 'Loving this view 💫',
				imgUrl:
					'https://images.unsplash.com/photo-1493558103817-58b2924bce98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
				by: {
					_id: 'u206',
					fullname: 'viewfinder',
					imgUrl:
						'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
				},
				comments: [],
				likedBy: [],
				tags: ['adventure', 'lake'],
			},
			{
				_id: 's207',
				txt: 'Nature’s mirror 🌿',
				imgUrl:
					'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
				by: {
					_id: 'u207',
					fullname: 'reflective_soul',
					imgUrl:
						'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
				},
				comments: [],
				likedBy: [],
				tags: ['reflection', 'nature'],
			},
			{
				_id: 's208',
				txt: 'Golden hour glow ✨',
				imgUrl:
					'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
				by: {
					_id: 'u208',
					fullname: 'sunset_chaser',
					imgUrl:
						'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
				},
				comments: [],
				likedBy: [],
				tags: ['goldenhour', 'travel'],
			},
		];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));

		return defaultPosts;
	}
	return JSON.parse(postsFromStorage);
}
