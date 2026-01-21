import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useSelector } from 'react-redux'

import { HomePage } from './pages/HomePage';
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs';
//import { CarIndex } from './pages/CarIndex.jsx';
import { ReviewIndex } from './pages/ReviewIndex.jsx';
import { ChatApp } from './pages/Chat.jsx';
import { AdminIndex } from './pages/AdminIndex.jsx';
import { ReelsIndex } from './pages/ReelsIndex.jsx';
import { Feed } from './pages/Feed.jsx';
import { EditUser } from './cmps/EditUser.jsx';


import { CarDetails } from './pages/CarDetails';
import { UserDetails } from './pages/UserDetails';


import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { UserMsg } from './cmps/UserMsg.jsx';
import { CreatePost } from './cmps/CreatePost.jsx';

import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx';
import { PostIndex } from './pages/PostIndex.jsx';
// import { EditUser } from './cmps/EditUser.jsx';

export function RootCmp() {

	const loggedInUser = useSelector((storeState) => storeState.userModule.user)

	return (
		<div className="main-container">
			<AppHeader />
			<UserMsg />
			<main>
				<Routes>
					<Route path="/" element={
						loggedInUser ? <HomePage />
							: <Navigate to="/auth/login" replace />
					}>
						{/* <Route path="/" element={<HomePage />}> */}
						<Route index element={<Feed />} />
						<Route path="reels" element={<ReelsIndex />} />
						<Route path="explore" element={<PostIndex />} />
						<Route path="user/:id" element={<UserDetails />} />
						<Route path="chat" element={<ChatApp />} />
						<Route path="review" element={<ReviewIndex />} />
						<Route path="create" element={<CreatePost />} />

						{/* element from More button */}
						<Route path="setting" element={<EditUser />} />
					</Route>


					<Route path="auth" element={<LoginSignup />}>
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<Signup />} />
					</Route>
				</Routes>

				{/* <AppFooter /> */}
			</main>
		</div>
	);
}

