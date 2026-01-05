import { Link } from 'react-router-dom';

export function PostPreview({ post }) {
	return (
		<article className="post-preview">
			<img src={post.imgUrl}></img>
		</article>
	);
}
