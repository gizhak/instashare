import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service';
import { logout } from '../store/actions/user.actions';

// Icons
import { RiCamera2Line } from 'react-icons/ri';
import { GoHome } from 'react-icons/go';
import { CgArrowRightR } from 'react-icons/cg';
import { BsSend } from 'react-icons/bs';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineExplore } from 'react-icons/md';
import { IoMdHeartEmpty } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';
import { FaInstagram } from "react-icons/fa6";



export function AppHeader() {
	const user = useSelector((storeState) => storeState.userModule.user);
	const navigate = useNavigate();

	async function onLogout() {
		try {
			await logout();
			navigate('/');
			showSuccessMsg(`Bye now`);
		} catch (err) {
			showErrorMsg('Cannot logout');
		}
	}

	return (
		<header className="app-header full">
			<nav className="nav-bar">
				<NavLink to="/" className="logo">
					<FaInstagram className="icon" />
					<span className="text"></span>
				</NavLink>
				<NavLink to="/">
					<div className="nav-item">
						<svg aria-label="Home" class="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Home</title>
							<path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z"></path></svg>
						<span className="text">Home</span>
					</div>
				</NavLink>
				<NavLink to="reels">
					<div className="nav-item">
						<svg aria-label="Reels" class="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Reels</title>
							<path d="M22.935 7.468c-.063-1.36-.307-2.142-.512-2.67a5.341 5.341 0 0 0-1.27-1.95 5.345 5.345 0 0 0-1.95-1.27c-.53-.206-1.311-.45-2.672-.513C15.333 1.012 14.976 1 12 1s-3.333.012-4.532.065c-1.36.063-2.142.307-2.67.512-.77.298-1.371.69-1.95 1.27a5.36 5.36 0 0 0-1.27 1.95c-.206.53-.45 1.311-.513 2.672C1.012 8.667 1 9.024 1 12s.012 3.333.065 4.532c.063 1.36.307 2.142.512 2.67.297.77.69 1.372 1.27 1.95.58.581 1.181.974 1.95 1.27.53.206 1.311.45 2.672.513C8.667 22.988 9.024 23 12 23s3.333-.012 4.532-.065c1.36-.063 2.142-.307 2.67-.512a5.33 5.33 0 0 0 1.95-1.27 5.356 5.356 0 0 0 1.27-1.95c.206-.53.45-1.311.513-2.672.053-1.198.065-1.555.065-4.531s-.012-3.333-.065-4.532Zm-1.998 8.972c-.05 1.07-.228 1.652-.38 2.04-.197.51-.434.874-.82 1.258a3.362 3.362 0 0 1-1.258.82c-.387.151-.97.33-2.038.379-1.162.052-1.51.063-4.441.063s-3.28-.01-4.44-.063c-1.07-.05-1.652-.228-2.04-.38a3.354 3.354 0 0 1-1.258-.82 3.362 3.362 0 0 1-.82-1.258c-.151-.387-.33-.97-.379-2.038C3.011 15.28 3 14.931 3 12s.01-3.28.063-4.44c.05-1.07.228-1.652.38-2.04.197-.51.434-.875.82-1.26a3.372 3.372 0 0 1 1.258-.819c.387-.15.97-.329 2.038-.378C8.72 3.011 9.069 3 12 3s3.28.01 4.44.063c1.07.05 1.652.228 2.04.38.51.197.874.433 1.258.82.385.382.622.747.82 1.258.151.387.33.97.379 2.038C20.989 8.72 21 9.069 21 12s-.01 3.28-.063 4.44Zm-4.584-6.828-5.25-3a2.725 2.725 0 0 0-2.745.01A2.722 2.722 0 0 0 6.988 9v6c0 .992.512 1.88 1.37 2.379.432.25.906.376 1.38.376.468 0 .937-.123 1.365-.367l5.25-3c.868-.496 1.385-1.389 1.385-2.388s-.517-1.892-1.385-2.388Zm-.993 3.04-5.25 3a.74.74 0 0 1-.748-.003.74.74 0 0 1-.374-.649V9a.74.74 0 0 1 .374-.65.737.737 0 0 1 .748-.002l5.25 3c.341.196.378.521.378.652s-.037.456-.378.651Z"></path></svg>
						<span className="text">Reels</span>
					</div>
				</NavLink>
				<NavLink to="chat">
					<div className="nav-item">
						<svg aria-label="Messages" class="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Messages</title>
							<path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line></svg>
						<span className="text">Messages</span>
					</div>
				</NavLink>
				<NavLink to="about">
					<div className="nav-item">
						<svg aria-label="Search" class="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Search</title>
							<path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
						<span className="text">Search</span>
					</div>
				</NavLink>
				<NavLink to="explore">
					<div className="nav-item">
						<svg aria-label="Explore" class="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Explore</title>
							<path d="m13.173 13.164 1.491-3.829-3.83 1.49ZM12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.35 7.443-2.478 6.369a1 1 0 0 1-.57.569l-6.36 2.47a1 1 0 0 1-1.294-1.294l2.48-6.369a1 1 0 0 1 .57-.569l6.359-2.47a1 1 0 0 1 1.294 1.294Z"></path></svg>
						<span className="text">Explore</span>
					</div>
				</NavLink>
				<NavLink to="chat">
					<div className="nav-item">
						<svg aria-label="Notifications" class="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Notifications</title>
							<path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
						<span className="text">Notifications</span>
					</div>
				</NavLink>
				<NavLink to="review">
					<div className="nav-item">
						<svg aria-label="New post" class="icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>New post</title>
							<path d="M21 11h-8V3a1 1 0 1 0-2 0v8H3a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-8h8a1 1 0 1 0 0-2Z"></path></svg>
						<span className="text">Create</span>
					</div>
				</NavLink>




				{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

				{!user && (
					<NavLink to="auth/login" className="login-link">
						Login
					</NavLink>
				)}
				{user && (
					<div className="user-info">
						{/* <Link to={`user/${user._id}`}>
							{user.imgUrl && <img src={user.imgUrl} />}
							<div className="user-name">{user.fullname}</div>
						</Link> */}
						{
							<NavLink to={`user/${user._id}`} className="user-link nav-item">
								<img className="icon" src={user.imgUrl} />
								<div className="user-name text" title={user.fullname}>Profile</div>
							</NavLink>
						}
						{/* <span className="score">{user.score?.toLocaleString()}</span> */}
						{/* <button onClick={onLogout}>logout</button> */}
					</div>
				)}
			</nav>
		</header>
	);
}
