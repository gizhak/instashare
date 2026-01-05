import { userService } from '../services/user';
import { PostPreview } from './PostPreview';

export function PostList({ posts, openPost }) {
	function shouldShowActionBtns(post) {
		const user = userService.getLoggedinUser();

		if (!user) return false;
		if (user.isAdmin) return true;
		return post.owner?._id === user._id;
	}

	function openPost() {}

	return (
		<section>
			<div className="post-list-grid">
				{posts.map((post) => (
					<div className="post" key={post._id}>
						<PostPreview post={post} openPost={openPost} />
					</div>
				))}
			</div>
		</section>
	);
}
