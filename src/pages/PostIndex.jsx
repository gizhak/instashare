import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePostNavigation } from '../customHooks/usePostNavigation';
import {
	loadPosts,
	addPost,
	updatePost,
	removePost,
	addPostComment,
} from '../store/actions/post.actions';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service';
import { postService } from '../services/post';
import { userService } from '../services/user';

// Icons
import { IoSearchOutline } from 'react-icons/io5';

import { PostList } from '../cmps/PostList';
import { Outlet } from 'react-router';
//import { PostFilter } from '../cmps/PostFilter';

export function PostIndex() {
	const [filterBy, setFilterBy] = useState(postService.getDefaultFilter());
	const posts = useSelector((storeState) => storeState.postModule.posts);
	const { openPost } = usePostNavigation();

	useEffect(() => {
		loadPosts(filterBy);
	}, [filterBy]);

	function onSearch(ev) {
		ev.preventDefault();
		loadPosts(filterBy);
	}

	function handlePostClick(postId) {
		openPost(postId);
	}

	return (
		<>
			<Outlet />
			<section className="post-index">
				<header>
					<div className="search-container">
						<IoSearchOutline className="search-icon" />
						<input
							className="search-bar"
							onChange={onSearch}
							placeholder="Search"
						/>
					</div>
					{/* {userService.getLoggedinUser() && (
					<button onClick={onAddPost}>Add a Post</button>
				)} */}
				</header>
				{/* <PostFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}

				<PostList
					posts={posts}
					isExplore={true}
					onPostClick={handlePostClick}
				/>
			</section>
		</>
	);
}
