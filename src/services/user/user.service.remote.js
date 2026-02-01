import { httpService } from '../http.service';

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

export const userService = {
	login,
	logout,
	signup,
	getUsers,
	getById,
	remove,
	update,
	getLoggedinUser,
	saveLoggedinUser,
	getRemovedUser,
	saveRemovedUser,
	getRemovedUsers,
	reactivateUser,
};

function getUsers() {
	return httpService.get(`user`);
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`);
	return user;
}

async function remove(userId) {
	console.log('🔴 user.service.remote.js - remove called with:', userId);
	// Get user details before removing
	const user = await httpService.get(`user/${userId}`);
	if (user) {
		saveRemovedUser(user);
	}
	return httpService.delete(`user/${userId}`);
}

async function update(user) {
	const updatedUser = await httpService.put(`user/${user._id}`, user);

	// When admin updates other user's details, do not update loggedinUser
	const loggedinUser = getLoggedinUser();
	if (loggedinUser && loggedinUser._id === updatedUser._id) {
		saveLoggedinUser(updatedUser);
	}

	return updatedUser;
}

async function login(userCred) {
	const user = await httpService.post('auth/login', userCred);
	if (user) return saveLoggedinUser(user);
}

async function signup(userCred) {
	if (!userCred.imgUrl)
		userCred.imgUrl =
			'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png';
	userCred.score = 10000;

	const user = await httpService.post('auth/signup', userCred);
	return saveLoggedinUser(user);
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
	return await httpService.post('auth/logout');
}

function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

function getRemovedUser() {
	return JSON.parse(sessionStorage.getItem('removedUser'));
}

function saveRemovedUser(user) {
	sessionStorage.setItem('removedUser', JSON.stringify(user));
	return user;
}

function getRemovedUsers() {
	return httpService.get('user/removed');
}

async function reactivateUser(userId, password) {
	return httpService.post(`user/${userId}/reactivate`, { password });
}

function saveLoggedinUser(user) {
	user = {
		_id: user._id,
		fullname: user.fullname,
		imgUrl: user.imgUrl,
		score: user.score,
		following: user.following,
		followers: user.followers,
		savedPostIds: user.savedPostIds,
		isAdmin: user.isAdmin,
	};
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
	return user;
}
