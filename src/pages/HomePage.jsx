import { Outlet } from 'react-router-dom';
import { AppHeader } from '../cmps/AppHeader';

export function HomePage() {
	return (
		<section className="home">
			<AppHeader />
			<Outlet />
		</section>
	);
}
