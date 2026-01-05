import { Link } from 'react-router-dom';

export function PostPreview({ post, openPost }) {
	return (
		<article className="post-preview" onClick={openPost}>
			<img src={post.imgUrl}></img>
		</article>
	);
}
