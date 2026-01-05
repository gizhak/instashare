const { DEV, VITE_LOCAL } = import.meta.env;

import { getRandomIntInclusive, makeId } from '../util.service';

import { postService as local } from './post.service.local';
import { postService as remote } from './post.service.remote';

function getEmptyPost() {
	return {
		_id: '',
		txt: '',
		imgUrl: '',
		by: {},
		loc: {},
		comments: [],
		likedBy: [],
	};
}

function getDefaultFilter() {
	return {
		txt: '',
		likesCount: '',
		sortField: '',
		sortDir: '',
	};
}

const service = VITE_LOCAL === 'true' ? local : remote;
export const postService = { getEmptyPost, getDefaultFilter, ...service };

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.postService = postService;
