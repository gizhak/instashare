export const SET_POSTS = 'SET_POSTS';
export const SET_POST = 'SET_POST';
export const REMOVE_POST = 'REMOVE_POST';
export const ADD_POST = 'ADD_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const ADD_POST_COMMENT = 'ADD_POST_COMMENT';

const initialState = {
	posts: [],
	post: null,
};

export function postReducer(state = initialState, action) {
	var newState = state;
	var posts;
	switch (action.type) {
		case SET_POSTS:
			newState = { ...state, posts: action.posts };
			break;
		case SET_POST:
			newState = { ...state, post: action.post };
			break;
		case REMOVE_POST:
			const lastRemovedPost = state.posts.find(
				(post) => post._id === action.postId
			);
			posts = state.posts.filter((post) => post._id !== action.postId);
			newState = { ...state, posts, lastRemovedPost };
			break;
		case ADD_POST:
			newState = { ...state, posts: [...state.posts, action.post] };
			break;
		case UPDATE_POST:
			posts = state.posts.map((post) =>
				post._id === action.post._id ? action.post : post
			);
			newState = { ...state, posts };
			break;
		case ADD_POST_COMMENT:
			if (action.comment && state.post) {
				newState = {
					...state,
					post: {
						...state.post,
						msgs: [...(state.post.comments || []), action.comment],
					},
				};
				break;
			}
		default:
	}
	return newState;
}

// unitTestReducer()

function unitTestReducer() {
	var state = initialState;
	const post1 = {
		_id: 'b101',
		vendor: 'Car ' + parseInt('' + Math.random() * 10),
		speed: 12,
		owner: null,
		msgs: [],
	};
	const post2 = {
		_id: 'b102',
		vendor: 'Car ' + parseInt('' + Math.random() * 10),
		speed: 13,
		owner: null,
		msgs: [],
	};

	state = postReducer(state, { type: SET_POSTS, posts: [post1] });
	console.log('After SET_POSTS:', state);

	state = postReducer(state, { type: ADD_POST, post: post2 });
	console.log('After ADD_POST:', state);

	state = postReducer(state, {
		type: UPDATE_POST,
		post: { ...post2, vendor: 'Good' },
	});
	console.log('After UPDATE_POST:', state);

	state = postReducer(state, { type: REMOVE_POST, postId: post2._id });
	console.log('After REMOVE_POST:', state);

	state = postReducer(state, { type: SET_POST, post: post1 });
	console.log('After SET_POST:', state);

	const comment = {
		id: 'm' + parseInt('' + Math.random() * 100),
		txt: 'Some msg',
		by: { _id: 'u123', fullname: 'test' },
	};
	state = postReducer(state, {
		type: ADD_POST_MSG,
		postId: post1._id,
		comment,
	});
	console.log('After ADD_POST_MSG:', state);
}
