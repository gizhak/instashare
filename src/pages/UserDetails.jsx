import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router';

import { loadUser, loadUsers } from '../store/actions/user.actions';
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

//navigate to other user details
import { EditUser } from '../cmps/EditUser';

import { PostList } from '../cmps/PostList';
import { Modal } from '../cmps/Modal';
import { SvgIcon } from '../cmps/SvgIcon';
import { LoadingSpinner } from '../cmps/LoadingSpinner';

import { loadPosts } from '../store/actions/post.actions';
// for follow functionality
import { updateUser } from '../store/actions/user.actions';

export function UserDetails() {
	//get user id from params
	const params = useParams();
	const user = useSelector((storeState) => storeState.userModule.watchedUser);
	const loggedInUser = useSelector((storeState) => storeState.userModule.user);
	const users = useSelector((storeState) => storeState.userModule.users);
	const isFollowing = loggedInUser.following?.includes(user?._id);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	//tab state
	const [activeTab, setActiveTab] = useState('posts');
	//get all posts from store
	const posts = useSelector((storeState) => storeState.postModule.posts);

	//filter posts for this user
	const userPosts = posts.filter((post) => post.by._id === user?._id);
	const otherUsers = users.filter((u) => u._id !== user?._id);
	const bookmarkedPosts = posts.filter((post) => user?.savedPostIds?.includes(post._id));

	const navigate = useNavigate()

	// console.log('userPosts:', userPosts);
	// console.log('otherUsers:', otherUsers);
	// console.log('bookmarkedPosts:', bookmarkedPosts);


	// here we will get them from collection
	// const myPosts = postsCollection
	// 	.find({ 'by._id': loggedinUser._id })
	// 	.sort({ _id: -1 });


	//load user on params change
	useEffect(() => {
		loadUser(params.id);
		loadUsers();
		loadPosts();
		socketService.emit(SOCKET_EMIT_USER_WATCH, params.id);
		socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate);


		return () => {
			socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate);
		};
	}, [params.id]);

	//socket function
	function onUserUpdate(user) {
		showSuccessMsg(
			`This user ${user.fullname} just got updated from socket, new score: ${user.score}`
		);
		store.dispatch({ type: 'SET_WATCHED_USER', user });
	}

	//image upload functions
	async function handleImageChange(ev) {
		setIsUploading(true);
		// console.log('ev:', ev.target.files[0]);
		const file = ev.target.files[0];
		if (!file) return;

		try {
			setIsUploading(true);
			console.log('Uploading file...');

			const imgUrl = await uploadService.uploadImg(file);
			console.log('Uploaded file URL:', imgUrl);

			if (!imgUrl) {
				throw new Error('Failed to upload image - no URL returned');
			}

			const updatedUser = { ...user, imgUrl: imgUrl };
			await userService.update(updatedUser);
			store.dispatch({ type: 'SET_WATCHED_USER', user: updatedUser });
			store.dispatch({ type: 'SET_USER', user: updatedUser });

			console.log('User image updated successfully');
			setIsModalOpen(false);
		} catch (err) {
			console.error('Error uploading image:', err);
			alert('Failed to upload image. Please try again.');
		} finally {
			setIsUploading(false);
		}

	}

	//remove image function
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

	async function handleFollow() {
			try {
				if (isFollowing) {
				// Update logged-in user (remove from following)
				await updateUser({
					following: loggedInUser.following.filter(id => id !== user._id),
				});

				// Update watched user (remove from followers)
				await updateUser({
					followers: user.followers.filter(id => id !== loggedInUser._id),
				}, user._id);

				showSuccessMsg('You unfollowed this user');
				} else {
				// Update logged-in user (add to following)
				await updateUser({
					following: [...loggedInUser.following, user._id],
				});

				// Update watched user (add to followers)
				await updateUser({
					followers: [...user.followers, loggedInUser._id],
				}, user._id);

				showSuccessMsg('You are now following this user');
				}
			} catch (error) {
				console.error('Error following/unfollowing user:', error);
				showErrorMsg('Failed to update follow status');
			}
			}


//navigation to other user details
async function handleNavigate(userId) {
	setIsLoading(true);
		// console.log('Navigating to user with ID:', userId);
		navigate(`/user/${userId}`)
		window.location.reload()
	}

	return (
		<section className="user-details">
			{isUploading && <LoadingSpinner message="Uploading profile photo..." />}
			{user && (
				<section>
					<div className="user-header">
						<div className="profile-img-container">
							<img src={user.imgUrl} onClick={() => setIsModalOpen(true)} />
							<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
								{/* <img src={user.imgUrl} /> */}
								<h3 className="modal-title">Change Profile Photo</h3>

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
								<h5>{user.fullname}</h5>
								<SvgIcon iconName="settingsCircle" />
							</div>

							<div className="user-stats">
								<p>{userPosts.length || 0} {userPosts.length === 1 ? 'post' : 'posts'}</p>
								<p>{user?.followers?.length || 0} {user?.followers?.length === 1 ? 'follower' : 'followers'}</p>
								<p>{user?.following?.length || 0} following</p>
							</div>
						</div>
					</div>

				
						{loggedInUser._id === user._id ? (
						<section className="btns-section">
						<button className="edit-btn" onClick={() => navigate(`/setting`)}>
							Edit profile
						</button>
						<button className="archive-btn">View archive</button>
                        </section>
						) : (
						<section className="btns-section">
						<button className={isFollowing ? '' : 'follow-btn'} onClick={handleFollow}>
							{isFollowing ? 'Following' : 'Follow'}
					
						</button>
						<button className="message-btn">Message</button>
					    </section>
						)}

					{/* other users */}
					{isLoading && (
						<div className="loading-overlay">
							<div className="loading-dots">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					)}
					<div className="suggestions-users">
						{otherUsers.map((u) => (
							<div className="suggestion-user" key={u._id} onClick={() => handleNavigate(u._id)}>
								<img className="suggestion-user-img" src={u.imgUrl} />
								<h4>
									{u.fullname}
								</h4>
							</div>
						))}
					</div>

					<div className="nav-bar">
						<div
							className={`tab-link ${activeTab === 'posts' ? 'active' : ''}`}
							onClick={() => setActiveTab('posts')}
						>
							<div className="tab-bar">
								<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
									<title>Posts</title>
									<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px" d="M3 3H21V21H3z"></path>
									<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px" d="M9.01486 3 9.01486 21"></path>
									<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px" d="M14.98514 3 14.98514 21"></path>
									<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px" d="M21 9.01486 3 9.01486"></path>
									<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px" d="M21 14.98514 3 14.98514"></path>
								</svg>

							</div>
						</div>

						<div
							className={`tab-link ${activeTab === 'saved' ? 'active' : ''}`}
							onClick={() => setActiveTab('saved')}
						>
							<div className="tab-bar">
								<svg aria-label="Saved" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
									<title>Saved</title>
									<polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
								</svg>

							</div>
						</div>

						<div
							className={`tab-link ${activeTab === 'tagged' ? 'active' : ''}`}
							onClick={() => setActiveTab('tagged')}
						>
							<div className="tab-bar">
								<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
									<title>Tagged</title>
									<path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px"></path>
									<path d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px"></path>
									<circle cx="12.07211" cy="11.07515" r="3.55556" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2px"></circle>
								</svg>

							</div>
						</div>
					</div>

				</section>
			)}

			{/* <pre> {JSON.stringify(user, null, 2)} </pre> */}

			{activeTab === 'posts' && <PostList posts={userPosts} />}
			{activeTab === 'saved' && <PostList posts={bookmarkedPosts} />}
			{/* <footer className="login-footer">
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
			</footer> */}
		</section>
	);
}
