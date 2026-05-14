import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faMagnifyingGlass,
  faBell,
  faUser,
  faChevronDown,
  faUserGear,
  faRightFromBracket,
  faBullhorn,
  faBriefcase,
  faCalendarDays,
  faUserPlus,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../store/authStore';
import './header.css';

const Header = ({ onMenuClick, onLogout, onAddUser, onViewUsers }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" aria-label="Menu" onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} className="icon" style={{ fontSize: '20px' }} />
        </button>

        <div className="search-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <div className="notification-wrapper">
          <div className="notification-container" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <FontAwesomeIcon icon={faBell} className="bell-icon" style={{ fontSize: '20px' }} />
            <span className="notification-badge">12</span>
          </div>

          {isNotifOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <span className="mark-read">Mark all as read</span>
              </div>
              <div className="notification-list">
                <div className="notification-item unread">
                  <div className="notif-icon-wrapper text-blue">
                    <FontAwesomeIcon icon={faBullhorn} />
                  </div>
                  <div className="notif-content">
                    <p className="notif-title">New Notice Published</p>
                    <p className="notif-desc">Semester schedule has been updated</p>
                    <span className="notif-time">2 mins ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notif-icon-wrapper text-green">
                    <FontAwesomeIcon icon={faBriefcase} />
                  </div>
                  <div className="notif-content">
                    <p className="notif-title">Tender Approved</p>
                    <p className="notif-desc">Equipment procurement tender was approved</p>
                    <span className="notif-time">1 hour ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notif-icon-wrapper text-purple">
                    <FontAwesomeIcon icon={faCalendarDays} />
                  </div>
                  <div className="notif-content">
                    <p className="notif-title">Upcoming Event</p>
                    <p className="notif-desc">AI Seminar starts tomorrow at 10 AM</p>
                    <span className="notif-time">5 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="notification-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-wrapper">
          <div
            className="profile-container"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="avatar">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', marginTop: '6px' }} />
            </div>
            <div className="profile-info">
              <span className="profile-name">{user?.name || 'Admin User'}</span>
              <span className="profile-role">{user?.email || 'Administrator'}</span>
            </div>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`}
              style={{ fontSize: '12px' }}
            />
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item">
                <FontAwesomeIcon icon={faUserGear} className="dropdown-icon" />
                <span>My Profile</span>
              </button>
              {user?.role === 'admin' && (
                <>
                  <button className="dropdown-item" onClick={onAddUser}>
                    <FontAwesomeIcon icon={faUserPlus} className="dropdown-icon" />
                    <span>Add User</span>
                  </button>
                  <button className="dropdown-item" onClick={onViewUsers}>
                    <FontAwesomeIcon icon={faEye} className="dropdown-icon" />
                    <span>View Users</span>
                  </button>
                </>
              )}
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={onLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} className="dropdown-icon" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header >
  );
};

export default Header;
