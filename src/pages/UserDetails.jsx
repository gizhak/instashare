import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { loadUser } from '../store/actions/user.actions';
import { store } from '../store/store';
import { showSuccessMsg } from '../services/event-bus.service';
import {
	socketService,
	SOCKET_EVENT_USER_UPDATED,
	SOCKET_EMIT_USER_WATCH,
} from '../services/socket.service';

import { PostList } from '../cmps/PostList';

export function UserDetails() {
	const params = useParams();
	const user = useSelector((storeState) => storeState.userModule.watchedUser);

	const myPosts = [
		{
			_id: 's101',
			txt: 'Lake trip with the best 🩷',
			imgUrl:
				'https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg',
			by: {
				_id: 'u101',
				fullname: 'sunflower_power77',
				imgUrl: 'http://some-img',
			},
		},
		{
			_id: 's1012',
			txt: 'Lake  🩷',
			imgUrl:
				'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg',
			by: {
				_id: 'u101',
				fullname: 'sunflower_power77',
				imgUrl: 'http://some-img',
			},
		},
	];

	// here we will get them from collection
	// const myPosts = postsCollection
	// 	.find({ 'by._id': loggedinUser._id })
	// 	.sort({ _id: -1 });

	useEffect(() => {
		loadUser(params.id);

		socketService.emit(SOCKET_EMIT_USER_WATCH, params.id);
		socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate);

		return () => {
			socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate);
		};
	}, [params.id]);

	function onUserUpdate(user) {
		showSuccessMsg(
			`This user ${user.fullname} just got updated from socket, new score: ${user.score}`
		);
		store.dispatch({ type: 'SET_WATCHED_USER', user });
	}

	return (
		<section className="user-details">
			<h1>User Details</h1>
			{user && (
				<div>
					<h3>{user.fullname}</h3>
					<img src={user.imgUrl} style={{ width: '100px' }} />
					{/* <pre> {JSON.stringify(user, null, 2)} </pre> */}
				</div>
			)}
			<PostList posts={myPosts} />
		</section>
	);
}
