import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';

import { loadUser } from '../store/actions/user.actions';
import { store } from '../store/store';
import { showSuccessMsg } from '../services/event-bus.service';
import {
	socketService,
	SOCKET_EVENT_USER_UPDATED,
	SOCKET_EMIT_USER_WATCH,
} from '../services/socket.service';

//for image upload
import { uploadService } from '../services/upload.service';
import { userService } from '../services/user';

import { PostList } from '../cmps/PostList';
import { Modal } from '../cmps/Modal';
import { SvgIcon } from '../cmps/SvgIcon';

import { loadPosts } from '../store/actions/post.actions';

export function UserDetails() {
	const params = useParams();
	const user = useSelector((storeState) => storeState.userModule.watchedUser);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const posts = useSelector((storeState) => storeState.postModule.posts);

	const userPosts = posts.filter((post) => post.by._id === user?._id);

	// here we will get them from collection
	// const myPosts = postsCollection
	// 	.find({ 'by._id': loggedinUser._id })
	// 	.sort({ _id: -1 });

	useEffect(() => {
		loadUser(params.id);
		loadPosts();
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

	async function handleImageChange(ev) {
		console.log('ev:', ev.target.files[0]);
		// console.log('File name:', file.name)
		// console.log('File size:', file.size)
		// console.log('File type:', file.type)
		const file = ev.target.files[0];
		if (!file) return;
		console.log('Uploading file...');

		const imgUrl = await uploadService.uploadImg(file);
		console.log('Uploaded file URL:', imgUrl);

		const updatedUser = { ...user, imgUrl: imgUrl };
		await userService.update(updatedUser);
		store.dispatch({ type: 'SET_WATCHED_USER', user: updatedUser });
		store.dispatch({ type: 'SET_USER', user: updatedUser });

		console.log('User image updated successfully');

		setIsModalOpen(false);
	}

	async function handleRemoveImage(ev) {
		const DEFAULT_USER_IMG =
			'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png';
		window.confirm('Are you sure you want to remove your profile photo?');
		const updatedUser = { ...user, imgUrl: DEFAULT_USER_IMG };
		await userService.update(updatedUser);
		store.dispatch({ type: 'SET_WATCHED_USER', user: updatedUser });
		store.dispatch({ type: 'SET_USER', user: updatedUser });

		setIsModalOpen(false);
	}

	return (
		<section className="user-details">
			{user && (
				<section>
					<div className="user-header">
						<div className="profile-img-container">
							<img src={user.imgUrl} onClick={() => setIsModalOpen(true)} />
							<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
								{/* <img src={user.imgUrl} /> */}
								<h3 lassName="modal-title">Change Profile Photo</h3>

								<label htmlFor="profile-img" className="modal-item upload">
									<h4>Upload Photo</h4>
								</label>
								<input
									type="file"
									id="profile-img"
									hidden
									accept="image/*"
									onChange={handleImageChange}
								/>

								<div
									className="modal-item remove"
									onClick={() => handleRemoveImage()}
								>
									Remove Current Photo
								</div>
								<div
									className="modal-item cancel"
									onClick={() => setIsModalOpen(false)}
								>
									Cancel
								</div>
							</Modal>
						</div>

						<div className="profile-user-info">
							<div className="user-handle">
								<h5>{user.username}</h5>
								<SvgIcon iconName="settingsCircle" />
							</div>

							{/* <p>{user.fullname}</p> */}
							<div className="user-stats">
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
					<div className="nav-bar">
						<NavLink to="posts" end className="tab-link">
							<div className="tab-bar">
								<svg
									clicked
									viewBox="0 0 24 24"
									width="24"
									height="24"
									fill="currentColor"
									class="x14rh7hd"
								>
									<title>Posts</title>
									<path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2px"
										d="M3 3H21V21H3z"
									></path>
									<path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2px"
										d="M9.01486 3 9.01486 21"
									></path>
									<path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2px"
										d="M14.98514 3 14.98514 21"
									></path>
									<path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2px"
										d="M21 9.01486 3 9.01486"
									></path>
									<path
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2px"
										d="M21 14.98514 3 14.98514"
									></path>
								</svg>
								<span className="text"></span>
							</div>
						</NavLink>
						<NavLink to="saved" end className="tab-link">
							<div className="tab-bar">
								<svg
									aria-label="Saved"
									class="x1lliihq x1n2onr6 x5n08af"
									fill="currentColor"
									height="18"
									role="img"
									viewBox="0 0 24 24"
									width="18"
								>
									<title>Saved</title>
									<polygon
										fill="none"
										points="20 21 12 13.44 4 21 4 3 20 3 20 21"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
									></polygon>
								</svg>
								<span className="text"></span>
							</div>
						</NavLink>
						<NavLink to="tagged" end className="tab-link">
							<div className="tab-bar">
								<svg
									viewBox="0 0 24 24"
									width="24"
									height="24"
									fill="currentColor"
									class="x14rh7hd"
								>
									<title>Tagged</title>
									<path
										d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465z"
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2px"
									></path>
									<g
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2px"
									>
										<path
											d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603"
											fill="none"
										></path>
										<circle
											cx="12.07211"
											cy="11.07515"
											r="3.55556"
											fill="none"
										></circle>
									</g>
								</svg>
								<span className="text"></span>
							</div>
						</NavLink>
					</div>
				</section>
			)}

			{/* <pre> {JSON.stringify(user, null, 2)} </pre> */}

			<PostList posts={userPosts} />

			<footer className="login-footer">
				<div className="footer-links">
					<a href="#">Meta</a>
					<a href="#">About</a>
					<a href="#">Blog</a>
					<a href="#">Jobs</a>
					<a href="#">Help</a>
					<a href="#">API</a>
					<a href="#">Privacy</a>
					<a href="#">Terms</a>
				</div>
				<div className="footer-copyright">© 2026 InstaShare from Meta</div>
			</footer>
		</section>
	);
}
