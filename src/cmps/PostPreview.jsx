import { FaHeart } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";

export function PostPreview({ post, openPost }) {
	return (
		<article className="post-preview" onClick={openPost}>
			<img src={post.imgUrl} alt="post" />

			<div className="post-overlay">
				<div className="post-stats">
					<div className="stat">
						<FaHeart />
						<span>{post.likesCount?.toLocaleString() || 0}</span>
					</div>
					<div className="stat">
						<BiSolidMessageRounded />
						<span>{post.commentsCount?.toLocaleString() || 0}</span>
					</div>
				</div>
			</div>
		</article>
	);
}