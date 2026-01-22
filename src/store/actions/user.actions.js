import { userService } from '../../services/user';
import { socketService } from '../../services/socket.service';
import { store } from '../store';

import { showErrorMsg } from '../../services/event-bus.service';
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer';
import {
	REMOVE_USER,
	SET_USER,
	SET_USERS,
	SET_WATCHED_USER,
	UPDATE_WATCHED_USER,
	UPDATE_USER,
} from '../reducers/user.reducer';

export async function loadUsers() {
	try {
		store.dispatch({ type: LOADING_START });
		const users = await userService.getUsers();
		store.dispatch({ type: SET_USERS, users });
	} catch (err) {
		console.log('UserActions: err in loadUsers', err);
	} finally {
		store.dispatch({ type: LOADING_DONE });
	}
}

export async function removeUser(userId) {
	try {
		await userService.remove(userId);
		store.dispatch({ type: REMOVE_USER, userId });
	} catch (err) {
		console.log('UserActions: err in removeUser', err);
	}
}

export async function login(credentials) {
	try {
		const user = await userService.login(credentials);
		store.dispatch({
			type: SET_USER,
			user,
		});
		socketService.login(user._id);
		return user;
	} catch (err) {
		console.log('Cannot login', err);
		throw err;
	}
}

export async function signup(credentials) {
	try {
		const user = await userService.signup(credentials);
		store.dispatch({
			type: SET_USER,
			user,
		});
		socketService.login(user._id);
		return user;
	} catch (err) {
		console.log('Cannot signup', err);
		throw err;
	}
}

export async function logout() {
	try {
		await userService.logout();
		store.dispatch({
			type: SET_USER,
			user: null,
		});
		socketService.logout();
	} catch (err) {
		console.log('Cannot logout', err);
		throw err;
	}
}

export async function loadUser(userId) {
	try {
		const user = await userService.getById(userId);
		store.dispatch({ type: SET_WATCHED_USER, user });
	} catch (err) {
		showErrorMsg('Cannot load user');
		console.log('Cannot load user', err);
	}
}

// export async function updateUser(updates) {
// 	try {
// 		const loggedinUser = userService.getLoggedinUser();
// 		const updatedUser = { ...loggedinUser, ...updates };
// 		await userService.update(updatedUser);
// 		store.dispatch({ type: UPDATE_USER, updates: updatedUser });
// 	} catch (err) {
// 		console.log('UserActions: err in updateUser', err);
// 		throw err;
// 	}
// }

export async function updateUser(updates, userId = null) {
	try {
		const loggedinUser = userService.getLoggedinUser();
		const targetUserId = userId || loggedinUser._id;

		// Fetch the current user data
		let userToUpdate;
		if (targetUserId === loggedinUser._id) {
			userToUpdate = loggedinUser;
		} else {
			userToUpdate = await userService.getById(targetUserId);
		}

		const updatedUser = { ...userToUpdate, ...updates };
		await userService.update(updatedUser);

		// Dispatch to appropriate store location
		if (targetUserId === loggedinUser._id) {
			store.dispatch({ type: UPDATE_USER, updates: updatedUser });
		} else {
			store.dispatch({ type: UPDATE_WATCHED_USER, user: updatedUser });
		}

		return updatedUser;
	} catch (err) {
		console.log('UserActions: err in updateUser', err);
		throw err;
	}
}
