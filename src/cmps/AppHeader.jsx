import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service';
import { logout } from '../store/actions/user.actions';

import { useState } from 'react';

// Icons
import { FaInstagram } from "react-icons/fa6";

export function AppHeader({ onCreatePostClick, onSearchClick }) {
	const user = useSelector((storeState) => storeState.userModule.user);
	const navigate = useNavigate();

	// console.log('user in AppHeader:', user);

	const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

	async function onLogout() {
		try {
			await logout();
			navigate('auth/login', { replace: true });
			// showSuccessMsg(`Bye now`);
		} catch (err) {
			showErrorMsg('Cannot logout');
		}
	}

	if (!user) {
		return (
			<header className="app-header full">
				<nav className="nav-bar">
					<NavLink to="/" className="logo">
						<FaInstagram className="icon" />
					</NavLink>
					<NavLink to="auth/login">
						<div className="nav-item">
							<span className="text">Login</span>
						</div>
					</NavLink>
				</nav>
			</header>
		)
	}

	const toggleMoreMenu = () => {
		setIsMoreMenuOpen(!isMoreMenuOpen);
	}

	const closeMoreMenu = () => {
		setIsMoreMenuOpen(false);
	}

	function toggleTheme() {
		const root = document.documentElement;
		const currentTheme = root.getAttribute('data-theme');
		const newTheme = currentTheme === 'light' ? 'dark' : 'light';

		root.setAttribute('data-theme', newTheme);


		// Optional: Save preference to localStorage	
		// localStorage.setItem('theme', newTheme);
	}

	// Optional: Load saved theme on page load
	// document.addEventListener('DOMContentLoaded', () => {
	// 	const savedTheme = localStorage.getItem('theme');
	// 	if (savedTheme) {
	// 		document.documentElement.setAttribute('data-theme', savedTheme);
	// 	}
	// });

	return (
		<header className={`app-header full ${isMoreMenuOpen ? 'menu-open' : ''}`}>
			<nav className="nav-bar">
				<NavLink to="/" className="logo" onClick={closeMoreMenu}>
					<FaInstagram className="icon" />
					<span className="text"></span>
				</NavLink>
				<NavLink to="/" onClick={closeMoreMenu}>
					<div className="nav-item">
						<svg aria-label="Home" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Home</title>
							<path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z"></path></svg>
						<span className="text">Home</span>
					</div>
				</NavLink>
				<NavLink to="" onClick={closeMoreMenu}>
					<div className="nav-item">
						<svg aria-label="Reels" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Reels</title>
							<path d="M22.935 7.468c-.063-1.36-.307-2.142-.512-2.67a5.341 5.341 0 0 0-1.27-1.95 5.345 5.345 0 0 0-1.95-1.27c-.53-.206-1.311-.45-2.672-.513C15.333 1.012 14.976 1 12 1s-3.333.012-4.532.065c-1.36.063-2.142.307-2.67.512-.77.298-1.371.69-1.95 1.27a5.36 5.36 0 0 0-1.27 1.95c-.206.53-.45 1.311-.513 2.672C1.012 8.667 1 9.024 1 12s.012 3.333.065 4.532c.063 1.36.307 2.142.512 2.67.297.77.69 1.372 1.27 1.95.58.581 1.181.974 1.95 1.27.53.206 1.311.45 2.672.513C8.667 22.988 9.024 23 12 23s3.333-.012 4.532-.065c1.36-.063 2.142-.307 2.67-.512a5.33 5.33 0 0 0 1.95-1.27 5.356 5.356 0 0 0 1.27-1.95c.206-.53.45-1.311.513-2.672.053-1.198.065-1.555.065-4.531s-.012-3.333-.065-4.532Zm-1.998 8.972c-.05 1.07-.228 1.652-.38 2.04-.197.51-.434.874-.82 1.258a3.362 3.362 0 0 1-1.258.82c-.387.151-.97.33-2.038.379-1.162.052-1.51.063-4.441.063s-3.28-.01-4.44-.063c-1.07-.05-1.652-.228-2.04-.38a3.354 3.354 0 0 1-1.258-.82 3.362 3.362 0 0 1-.82-1.258c-.151-.387-.33-.97-.379-2.038C3.011 15.28 3 14.931 3 12s.01-3.28.063-4.44c.05-1.07.228-1.652.38-2.04.197-.51.434-.875.82-1.26a3.372 3.372 0 0 1 1.258-.819c.387-.15.97-.329 2.038-.378C8.72 3.011 9.069 3 12 3s3.28.01 4.44.063c1.07.05 1.652.228 2.04.38.51.197.874.433 1.258.82.385.382.622.747.82 1.258.151.387.33.97.379 2.038C20.989 8.72 21 9.069 21 12s-.01 3.28-.063 4.44Zm-4.584-6.828-5.25-3a2.725 2.725 0 0 0-2.745.01A2.722 2.722 0 0 0 6.988 9v6c0 .992.512 1.88 1.37 2.379.432.25.906.376 1.38.376.468 0 .937-.123 1.365-.367l5.25-3c.868-.496 1.385-1.389 1.385-2.388s-.517-1.892-1.385-2.388Zm-.993 3.04-5.25 3a.74.74 0 0 1-.748-.003.74.74 0 0 1-.374-.649V9a.74.74 0 0 1 .374-.65.737.737 0 0 1 .748-.002l5.25 3c.341.196.378.521.378.652s-.037.456-.378.651Z"></path></svg>
						<span className="text">Reels</span>
					</div>
				</NavLink>
				<NavLink to="" onClick={closeMoreMenu}>
					<div className="nav-item">
						<svg aria-label="Messages" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Messages</title>
							<path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line></svg>
						<span className="text">Messages</span>
					</div>
				</NavLink>
				<div className="nav-item" onClick={() => { onSearchClick(); closeMoreMenu(); }}>
					<svg aria-label="Search" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Search</title>
						<path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
					<span className="text">Search</span>
				</div>
				<NavLink to="explore" onClick={closeMoreMenu}>
					<div className="nav-item">
						<svg aria-label="Explore" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Explore</title>
							<path d="m13.173 13.164 1.491-3.829-3.83 1.49ZM12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.35 7.443-2.478 6.369a1 1 0 0 1-.57.569l-6.36 2.47a1 1 0 0 1-1.294-1.294l2.48-6.369a1 1 0 0 1 .57-.569l6.359-2.47a1 1 0 0 1 1.294 1.294Z"></path></svg>
						<span className="text">Explore</span>
					</div>
				</NavLink>
				<NavLink to="" onClick={closeMoreMenu}>
					<div className="nav-item">
						<svg aria-label="Notifications" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Notifications</title>
							<path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
						<span className="text">Notifications</span>
					</div>
				</NavLink>
				<div className="nav-item create-nav-item" onClick={(e) => { e.preventDefault(); onCreatePostClick(); closeMoreMenu(); }}>
					<svg aria-label="New post" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>New post</title>
						<path d="M21 11h-8V3a1 1 0 1 0-2 0v8H3a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-8h8a1 1 0 1 0 0-2Z"></path></svg>
					<span className="text">Create</span>
				</div>
				<NavLink to={`user/${user._id}`} className="user-link nav-item" onClick={closeMoreMenu}>
					<img className="icon" src={user.imgUrl} />
					<div className="user-name text" title={user.fullname}>Profile</div>
				</NavLink>

				<div className="more-menu-items">
					<NavLink >
						<div className="nav-item" onClick={toggleMoreMenu}>
							<svg aria-label="Settings" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Settings</title><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="4" y2="4"></line>
								<line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="12" y2="12"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="20" y2="20"></line></svg>
							<span className="text">More</span>
						</div>
						{isMoreMenuOpen &&
							<div className="more-dropdown">
								<NavLink to="setting" >
									<div className="dropdown-item" onClick={toggleMoreMenu}>
										<svg aria-label="Settings" className="icon" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Settings</title><circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
											<path d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
										<span className='text'>Settings</span>
									</div>
								</NavLink>
								<NavLink  >
									<div className="dropdown-item" onClick={toggleMoreMenu}>
										<svg aria-label="Your activity" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Your activity</title>
											<path d="M19 1H5C2.794 1 1 2.794 1 5v14c0 2.206 1.794 4 4 4h14c2.206 0 4-1.794 4-4V5c0-2.206-1.794-4-4-4ZM5 3h14c1.103 0 2 .897 2 2v6h-2.382l-2.723-5.447c-.34-.678-1.45-.678-1.79 0L9 15.764l-2.105-4.211A1 1 0 0 0 6 11H3V5c0-1.103.897-2 2-2Zm14 18H5c-1.103 0-2-.897-2-2v-6h2.382l2.723 5.447a1 1 0 0 0 1.79 0L15 8.236l2.105 4.211A1 1 0 0 0 18 13h3v6c0 1.103-.897 2-2 2Z"></path></svg>
										<span className='text'>Your activity</span>
									</div>
								</NavLink>
								<NavLink  >
									<div className="dropdown-item" onClick={toggleMoreMenu}>
										<svg aria-label="Saved" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Saved</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
										<span className='text'>Saved</span>
									</div>
								</NavLink>
								<NavLink  >
									<div className="dropdown-item" onClick={toggleMoreMenu}>
										<svg aria-label="Theme icon" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Theme icon</title>
											<path d="M11.502,22.99805A11.4313,11.4313,0,0,1,.49512,14.83691a.99889.99889,0,0,1,.251-.998,1.01148,1.01148,0,0,1,.99707-.249,9.43041,9.43041,0,0,0,2.75879.40821A9.5082,9.5082,0,0,0,13.5957,1.74023a1.00039,1.00039,0,0,1,1.24707-1.248A11.501,11.501,0,0,1,11.502,22.99805ZM3.08984,15.91211A9.49991,9.49991,0,0,0,21.002,11.498,9.57875,9.57875,0,0,0,15.916,3.08594,11.5083,11.5083,0,0,1,3.08984,15.91211Z"></path></svg>
										<span className='text' onClick={toggleTheme}>Switch appearance</span>
									</div>
								</NavLink>
								<NavLink  >
									<div className="dropdown-item" onClick={toggleMoreMenu}>
										<svg aria-label="Report a problem" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Report a problem</title>
											<path d="M18.001 1h-12a5.006 5.006 0 0 0-5 5v9.005a5.006 5.006 0 0 0 5 5h2.514l2.789 2.712a1 1 0 0 0 1.394 0l2.787-2.712h2.516a5.006 5.006 0 0 0 5-5V6a5.006 5.006 0 0 0-5-5Zm3 14.005a3.003 3.003 0 0 1-3 3h-2.936a1 1 0 0 0-.79.387l-2.274 2.212-2.276-2.212a1 1 0 0 0-.79-.387H6a3.003 3.003 0 0 1-3-3V6a3.003 3.003 0 0 1 3-3h12a3.003 3.003 0 0 1 3 3Zm-9-1.66a1.229 1.229 0 1 0 1.228 1.228A1.23 1.23 0 0 0 12 13.344Zm0-8.117a1.274 1.274 0 0 0-.933.396 1.108 1.108 0 0 0-.3.838l.347 4.861a.892.892 0 0 0 1.77 0l.348-4.86a1.106 1.106 0 0 0-.3-.838A1.272 1.272 0 0 0 12 5.228Z"></path></svg>

										<span className='text'>Report a problem</span>
									</div>
								</NavLink>
								<NavLink >
									<div className="dropdown-item switch-accounts-item" onClick={toggleMoreMenu}>
										<nav className='text'>Switch accounts</nav>
									</div>
								</NavLink>
								<NavLink  >
									<div className="dropdown-item logout-item" onClick={toggleMoreMenu}>
										<nav className='text' onClick={onLogout}>Log out</nav>
									</div>
								</NavLink>
							</div>}
					</NavLink>

					<NavLink to="more-from-meta" onClick={closeMoreMenu}>
						<div className="nav-item">
							<svg aria-label="Also from Meta" className="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Also from Meta</title>
								<path d="M9.5 11h5c1.379 0 2.5-1.122 2.5-2.5v-5C17 2.122 15.879 1 14.5 1h-5A2.503 2.503 0 0 0 7 3.5v5C7 9.878 8.12 11 9.5 11ZM9 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5ZM8.499 13h-5a2.503 2.503 0 0 0-2.5 2.5v5c0 1.378 1.12 2.5 2.5 2.5h5c1.379 0 2.5-1.122 2.5-2.5v-5c0-1.378-1.121-2.5-2.5-2.5Zm.5 7.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5Zm11.5-7.5h-5a2.503 2.503 0 0 0-2.5 2.5v5c0 1.378 1.12 2.5 2.5 2.5h5c1.379 0 2.5-1.122 2.5-2.5v-5c0-1.378-1.121-2.5-2.5-2.5Zm.5 7.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5Z"></path></svg>
							<span className="text">Also from Meta</span>
						</div>
					</NavLink>
				</div>

				{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

				{!user && (
					<NavLink to="auth" className="login-link">
						Login
					</NavLink>
				)}
			</nav>
		</header>
	);
}
