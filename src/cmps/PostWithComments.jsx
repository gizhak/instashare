import { postService } from '../services/post';
import { SvgIcon } from './SvgIcon';
import { useState } from 'react';
import { addPostComment } from '../store/actions/post.actions';
import { useSelector } from 'react-redux';
import { addPostLike } from '../store/actions/post.actions';
import { checkIsLiked } from '../services/util.service';
import { userService } from '../services/user';

export function PostWithComments({ handleCloseModal }) {
	const [commentText, setCommentText] = useState('');
	const post = useSelector((storeState) => storeState.postModule.post);
	const loggedInUser = userService.getLoggedinUser();

	const isLiked = checkIsLiked(post, loggedInUser);

	if (!post) {
		return <div className="post-modal">Post not found</div>;
	}
	console.log('Post in PostWithComments:', post);

	const handleSubmitComment = async () => {
		if (!commentText.trim()) return;
		await addPostComment(post._id, commentText);
		setCommentText('');
	};

	return (
		<article className="post-modal">
			<img className="post-img-modal" src={post.imgUrl} alt="post" />
			<div className="post-comments-section">
				<div className="post-header-modal">
					<img src={post.by.imgUrl} alt={post.by.fullname} />
					<h4>{post.by.fullname}</h4>
				</div>

				<ul className="post-comments-list">
					<li className="comment-item">
						<img src={post.by.imgUrl} alt={post.by.fullname} />
						<div className="comment-content">
							<div>
								<strong>{post.by.fullname}</strong>
								<span>{post.txt}</span>
							</div>
						</div>
					</li>

					{post.comments.map((comment) => (
						<li key={comment.id} className="comment-item">
							<img src={comment.by.imgUrl} alt={comment.by.fullname} />
							<div className="comment-content">
								<div>
									<strong>{comment.by.fullname}</strong>
									<span>{comment.txt}</span>
								</div>
							</div>
							<span className="comment-like">♡</span>
						</li>
					))}
				</ul>

				<div className="post-actions-modal">
					<SvgIcon
						iconName={isLiked ? 'likeFilled' : 'like'}
						fill={isLiked ? '#ff3040' : 'currentColor'}
						onClick={() => addPostLike(post._id)}
					/>
					<SvgIcon iconName="comment" />
					<SvgIcon iconName="share" />
				</div>

				<div className="post-likes">{post.likedBy.length} likes</div>

				<div className="add-comment-section">
					<SvgIcon iconName="emmoji" />
					<textarea
						placeholder="Add a comment..."
						value={commentText}
						onChange={(ev) => setCommentText(ev.target.value)}
						rows={1}
					/>
					<button onClick={handleSubmitComment} disabled={!commentText.trim()}>
						Post
					</button>
				</div>
			</div>
		</article>
	);
}


