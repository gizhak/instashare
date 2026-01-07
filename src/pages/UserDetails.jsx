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

import { IoIosSettings } from 'react-icons/io';
import { GrGrid } from 'react-icons/gr';
import { RiBookmarkLine } from 'react-icons/ri';

import { SvgIcon } from '../cmps/SvgIcon';

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
			{user && (
				<section>
					<div className="user-header flex">
						<img src={user.imgUrl} style={{ width: '150px' }} />
						<div className="profile-user-info">
							<div className="user-handle">
								<h5>{user.username}</h5>
								<SvgIcon iconName="settingsCircle" />
							</div>

							<p>{user.fullname}</p>
							<div className="user-stats flex">
								<p>0 posts</p>
								<p>0 followers</p>
								<p>0 following</p>
							</div>
						</div>
					</div>
					<div className="btns-section">
						<button className="edit-btn">Edit profile</button>
						<button className="archive-btn">View archive</button>
					</div>
					<nav className="tab-bar">
						<ul>
							<li className="active">
								<GrGrid />
							</li>
							<li>
								<RiBookmarkLine />
							</li>
						</ul>
					</nav>
				</section>
			)}

			{/* <pre> {JSON.stringify(user, null, 2)} </pre> */}

			<PostList posts={myPosts} />
		</section>
	);
}
