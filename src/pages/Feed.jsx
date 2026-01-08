import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import { loadPosts } from '../store/actions/post.actions';
import { SvgIcon } from '../cmps/SvgIcon';

export function Feed() {
	const posts = useSelector((storeState) => storeState.postModule.posts);

	useEffect(() => {
		loadPosts();
	}, []);

	console.log('posts:', posts);

	return (
		<section className="home">
			Feed
			<section className="feed-grid-container">
				{posts &&
					posts.map((post) => (
						<article key={post._id} className="post-article flex row">
							<div className="post-header">
								<img className="post-profile-img" src={post.by.imgUrl}></img>
								<h4>{post.by.fullname}</h4>
								<SvgIcon iconName="postDots" />
							</div>
							<img className="post-img" src={post.imgUrl}></img>
							<div className="post-desc">
								<h4>
									{post.by.fullname}: <span>{post.txt}</span>
								</h4>
								<SvgIcon iconName="like" />
								<SvgIcon iconName="comment" />
							</div>
						</article>
					))}
			</section>
		</section>
	);
}
