import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { userService } from '../services/user';
import { PostPreview } from './PostPreview';

// load posts from the store
import {
	addPostComment,
	addPostLike,
	loadPosts,
} from '../store/actions/post.actions';

// Icons
import { FaHeart } from 'react-icons/fa';
import { BiSolidMessageRounded } from 'react-icons/bi';
import { use } from 'react';

export function PostList({ posts, isExplore = false }) {
	// const posts = useSelector((storeState) => storeState.postModule.posts);

	// useEffect(() => {
	// 	loadPosts();
	// }, []);

	function shouldShowActionBtns(post) {
		const user = userService.getLoggedinUser();

		if (!user) return false;
		if (user.isAdmin) return true;
		return post.owner?._id === user._id;
	}

	function openPost() { }

	return (
		<section>
			<div className={`post-list-grid ${isExplore ? 'explore-grid' : 'profile-grid'}`}>
				{posts.map((post, idx) => {
					if (!isExplore) {
						return (
							<div className="post" key={post._id}>
								<PostPreview post={post} openPost={openPost} />
							</div>
						);
					}

					// Explore mode - Instagram-like pattern
					// Every 7th item is big (2x2)
					const isBig = idx % 7 === 3;
					// Every 19th item is full width
					const isFullWidth = idx % 19 === 9;

					let className = 'post';
					if (isFullWidth) className += ' post-full-width';
					else if (isBig) className += ' post-big';

					return (
						<div className={className} key={post._id}>
							<PostPreview post={post} openPost={openPost} />
						</div>
					);
				})}
			</div>
		</section>
	);
}
