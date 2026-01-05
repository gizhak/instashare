import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

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

import { PostList } from '../cmps/PostList';
//import { PostFilter } from '../cmps/PostFilter';

export function PostIndex() {
	const [filterBy, setFilterBy] = useState(postService.getDefaultFilter());
	const posts = useSelector((storeState) => storeState.postModule.posts);

	useEffect(() => {
		loadPosts(filterBy);
	}, [filterBy]);

	// async function onRemovePost(postId) {
	// 	try {
	// 		await removePost(postId);
	// 		showSuccessMsg('Post removed');
	// 	} catch (err) {
	// 		showErrorMsg('Cannot remove post');
	// 	}
	// }

	// async function onAddPost() {
	// 	const post = postService.getEmptyPost();
	// 	post.vendor = prompt('Vendor?', 'Some Vendor');
	// 	try {
	// 		const savedPost = await addPost(post);
	// 		showSuccessMsg(`Post added (id: ${savedPost._id})`);
	// 	} catch (err) {
	// 		showErrorMsg('Cannot add post');
	// 	}
	// }

	// async function onUpdatePost(post) {
	// 	const speed = +prompt('New speed?', post.speed) || 0;
	// 	if (speed === 0 || speed === post.speed) return;

	// 	const postToSave = { ...post, speed };
	// 	try {
	// 		const savedPost = await updatePost(postToSave);
	// 		showSuccessMsg(`Post updated, new speed: ${savedPost.speed}`);
	// 	} catch (err) {
	// 		showErrorMsg('Cannot update post');
	// 	}
	// }

	function openPost() {}

	return (
		<section className="post-index">
			<header>
				<h2>Posts</h2>
				{userService.getLoggedinUser() && (
					<button onClick={onAddPost}>Add a Post</button>
				)}
			</header>
			{/* <PostFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
			<PostList posts={posts} openPost={openPost} />
		</section>
	);
}
