import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PostDetailsContent } from '../cmps/PostDetailsContent.jsx';
import { loadPost } from '../store/actions/post.actions.js';
import { Modal } from '../cmps/Modal.jsx';

export function ContainerPage() {
	return (
		<section className="home">
			<Outlet />
		</section>
	);
}
