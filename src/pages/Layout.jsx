import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

import '../styles/index.css'

const Layout = () => {
    return (
        <>
            <nav>
                <ul style={{ display: "flex", listStyle: "none", alignItems: "center" }}>
                    <li className="site-title" style={{ marginRight: "1rem" }}>
                        The Road to React
                    </li>
                    <li style={{ marginRight: "1rem" }}>
                        <Link to="/">
                            <button className="material-button">Home</button>
                        </Link>
                    </li>
                    <li style={{ marginRight: "1rem" }}>
                        <Link to="/simple-list-items">
                            <button className="material-button">Simple list items</button>
                        </Link>
                    </li>
                    <li style={{ marginRight: "1rem" }}>
                        <Link to="/todos">
                            <button className="material-button">Todos</button>
                        </Link>
                    </li>
                    <li style={{ marginRight: "1rem" }}>
                        <Link to="/games-list">
                            <button className="material-button">Games list</button>
                        </Link>
                    </li>
                    <li style={{ marginRight: "1rem" }}>
                        <Link to="/hacker-news">
                            <button className="material-button">Hacker News</button>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
};

export default Layout;