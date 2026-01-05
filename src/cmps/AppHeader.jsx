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
			<nav>
				<NavLink to="/" className="logo">
					<RiCamera2Line className="icon" />
					<span className="text"></span>
				</NavLink>
				<NavLink to="about">
					<div className="nav-item">
						<GoHome className="icon" />
						<span className="text">Home</span>
					</div>
				</NavLink>
				<NavLink to="about">
					<div className="nav-item">
						<CgArrowRightR className="icon" />
						<span className="text">Reels</span>
					</div>
				</NavLink>
				<NavLink to="chat">
					<div className="nav-item">
						<BsSend className="icon" />
						<span className="text">Messages</span>
					</div>
				</NavLink>
				<NavLink to="about">
					<div className="nav-item">
						<IoSearchOutline className="icon" />
						<span className="text">Search</span>
					</div>
				</NavLink>
				<NavLink to="explore">
					<div className="nav-item">
						<MdOutlineExplore className="icon" />
						<span className="text">Explore</span>
					</div>
				</NavLink>
				<NavLink to="chat">
					<div className="nav-item">
						<IoMdHeartEmpty className="icon" />
						<span className="text">Notifications</span>
					</div>
				</NavLink>
				<NavLink to="review">
					<div className="nav-item">
						<FaPlus className="icon" />
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
						<Link to={`user/${user._id}`}>
							{user.imgUrl && <img src={user.imgUrl} />}
							<div className="user-name">{user.fullname}</div>
						</Link>
						<span className="score">{user.score?.toLocaleString()}</span>
						<button onClick={onLogout}>logout</button>
					</div>
				)}
			</nav>
		</header>
	);
}
