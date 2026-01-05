import { userService } from '../services/user';
import { PostPreview } from './PostPreview';

export function PostList({ posts, openPost }) {
	function shouldShowActionBtns(post) {
		const user = userService.getLoggedinUser();

		if (!user) return false;
		if (user.isAdmin) return true;
		return post.owner?._id === user._id;
	}

	return (
		<section>
			<ul className="post-list">
				{posts.map((post) => (
					<li key={post._id}>
						<PostPreview post={post} onClick={openPost} />
					</li>
				))}
			</ul>
		</section>
	);
}
