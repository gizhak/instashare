import React from 'react';
import { Routes, Route } from 'react-router';

import { HomePage } from './pages/HomePage';
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs';
//import { CarIndex } from './pages/CarIndex.jsx';
import { ReviewIndex } from './pages/ReviewIndex.jsx';
import { ChatApp } from './pages/Chat.jsx';
import { AdminIndex } from './pages/AdminIndex.jsx';
import { ReelsIndex } from './pages/ReelsIndex.jsx';

import { CarDetails } from './pages/CarDetails';
import { UserDetails } from './pages/UserDetails';

import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { UserMsg } from './cmps/UserMsg.jsx';
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx';
import { PostIndex } from './pages/PostIndex.jsx';

export function RootCmp() {
	return (
		<div className="main-container">
			<AppHeader />

			<main>
				<UserMsg />
				<Routes>
					<Route path="" element={<HomePage />} />
					<Route path="reels" element={<ReelsIndex />} />

					<Route path="about" element={<AboutUs />}>
						<Route path="team" element={<AboutTeam />} />
						<Route path="vision" element={<AboutVision />} />
					</Route>

					<Route path="explore" element={<PostIndex />} />
					<Route path="car/:carId" element={<CarDetails />} />
					<Route path="user/:id" element={<UserDetails />} />
					<Route path="review" element={<ReviewIndex />} />
					<Route path="chat" element={<ChatApp />} />
					<Route path="admin" element={<AdminIndex />} />
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
