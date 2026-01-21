import { Outlet } from 'react-router-dom';

export function HomePage() {
	return (
		<section className="home">
			<Outlet />
		</section>
	);
}
