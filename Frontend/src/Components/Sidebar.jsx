import { Link, useLocation } from "react-router-dom";
import { FaImages, FaFolderMinus } from "react-icons/fa";
import { MdRocketLaunch } from "react-icons/md";

import "./sidebar.css";

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { name: "Sets", path: "/", icon: <FaFolderMinus /> },
        { name: "Launcher", path: "/launcher", icon: <MdRocketLaunch /> },
        { name: "Gallery", path: "/gallery", icon: <FaImages /> },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="sidebar">
                <h1 className="sidebar-title">Menu</h1>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? "active" : ""
                                }`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="bottom-bar">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`bottom-link ${location.pathname === item.path ? "active" : ""
                            }`}
                    >
                        {item.icon}
                    </Link>
                ))}
            </div>
        </>
    );
}