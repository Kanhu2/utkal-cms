import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoUU from '../../assets/image/logo-uu.png';
import {
    faChartLine,
    faCalendarDays,
    faBriefcase,
    faBullhorn,
    faUsers,
    faBook,
    faFileLines,
    faFlask,
    faChalkboardUser,
    faTrophy,
    faUserGraduate,
    faUserTie,
    faImage,
    faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { getAllowedPages, normalizeModuleName } from '../../utils/moduleAccess';
import { useAuthStore } from '../../store/authStore';
import './sidebar.css';

const navItems = [
    { id: 0, label: 'Dashboard', icon: faChartLine },
    { id: 1, label: 'Notice', icon: faBullhorn },
    { id: 2, label: 'Tender', icon: faBriefcase },
    { id: 3, label: 'Events & News', icon: faCalendarDays },
    { id: 4, label: 'Publication', icon: faFileLines },
    { id: 5, label: 'Faculty', icon: faUsers },
    { id: 6, label: 'ILMS', icon: faBook },
    { id: 7, label: 'Research Project', icon: faFlask },
    { id: 8, label: 'Workshop/ Seminar Details', icon: faChalkboardUser },
    { id: 9, label: 'Achievements', icon: faTrophy },
    { id: 10, label: 'Research Scholars', icon: faUserGraduate },
    { id: 11, label: 'Research Supervisors', icon: faUserTie },
    { id: 12, label: 'Photo Gallery', icon: faImage },
];

const Sidebar = ({ isCollapsed, isMobileOpen, isMobile, activePage, setActivePage }) => {
    const user = useAuthStore((state) => state.user);
    const allowedPages = getAllowedPages(user);
    const visibleNavItems = navItems.filter((item) =>
        allowedPages.includes(normalizeModuleName(item.label))
    );

    const sidebarClasses = [
        'sidebar',
        !isMobile && isCollapsed ? 'collapsed' : '',
        isMobile ? 'mobile' : '',
        isMobile && isMobileOpen ? 'mobile-open' : '',
    ].filter(Boolean).join(' ');

    const handleNavClick = (page) => {
        if (setActivePage) {
            setActivePage(page);
        }
        if (isMobile && isMobileOpen) {
            // Close mobile sidebar after navigation
        }
    };

    return (
        <aside className={sidebarClasses}>
            {/* Logo & Branding */}
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <img
                        src={logoUU}
                        alt="Utkal University Logo"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="logo-fallback" style={{ display: 'none' }}>
                        <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '32px', color: '#c7d2fe' }} />
                    </div>
                </div>
                {!isCollapsed && (
                    <div className="brand-text">
                        <span className="brand-name">UtkalAdmin</span>
                        <span className="brand-sub">Utkal University</span>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                {/* Menu Items */}
                {visibleNavItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activePage === normalizeModuleName(item.label) ? 'nav-item--active' : ''}`}
                        onClick={() => handleNavClick(normalizeModuleName(item.label))}
                        title={isCollapsed ? item.label : ""}
                        data-tooltip={isCollapsed ? item.label : ""}
                    >
                        <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                        {!isCollapsed && <span>{item.label}</span>}

                    </button>
                ))}
            </nav>

            {/* Department Card */}
            {/* <div 
                className="sidebar-dept-card"
                data-tooltip={isCollapsed ? "Department of Computer Science" : ""}
            >
                <div className="dept-card-header">
                    <div className="dept-shield">
                        <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '22px', color: '#818cf8' }} />
                    </div>
                    {!isCollapsed && (
                        <div className="dept-info">
                            <span className="dept-name">Department of<br />Computer Science</span>
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <div className="dept-card-footer">
                        <div className="dept-login-info">
                            <span className="dept-logged-label">Logged in as</span>
                            <span className="dept-user">Admin</span>
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} style={{ color: '#818cf8', fontSize: '14px' }} />
                    </div>
                )}
            </div> */}
        </aside>
    );
};

export default Sidebar;
