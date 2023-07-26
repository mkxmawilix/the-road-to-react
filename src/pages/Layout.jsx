import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/games-list">Games list</Link>
                    </li>
                    <li>
                        <Link to="/hacker-news">Hacker News</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
};


export default Layout;