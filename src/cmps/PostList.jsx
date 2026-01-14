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

export function PostList({ posts }) {
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
			<div className="post-list-grid">
				{posts.map((post, idx) => {
					// Every 3rd and 10th item (0-indexed: 2, 9, 11, 20, 22...)
					const isBig = (idx % 10 === 2 || idx % 10 === 9);
					return (
						<div className={`post ${isBig ? 'post-big' : ''}`} key={post._id}>
							<PostPreview post={post} openPost={openPost} />
						</div>
					);
				})}
			</div>
		</section>
	);
}
