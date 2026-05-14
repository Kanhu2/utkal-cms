import { useMemo, useState, useEffect } from 'react';
import Layout from './componenets/layout/layout';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddUser from './pages/add-user';
import ViewUsers from './pages/view-users';
import Notice from './pages/notice';
import Tender from './pages/tender';
import Publication from './pages/publication';
import Faculty from './pages/faculty';
import ResearchProject from './pages/research-project';
import ILMS from './pages/ilms';
import Seminar from './pages/seminar';
import Award from './pages/award';
import Scholar from './pages/scholar';
import Supervisor from './pages/supervisor';
import Gallery from './pages/gallery';
import News from './pages/news';
import { logout as logoutApi } from '../utils/api';
import { useAuthStore } from './store/authStore';
import { canAccessPage, getAllowedPages } from './utils/moduleAccess';
import './index.css';
// import { useNavigate } from "react-router-dom";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const allowedPages = useMemo(() => getAllowedPages(user), [user]);
  const firstAllowedPage = allowedPages[0] || '';
  const [activePage, setActivePage] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showViewUsers, setShowViewUsers] = useState(false);
  const currentPage = canAccessPage(user, activePage) ? activePage : firstAllowedPage;
  // const navigate = useNavigate();

  // Check token validity on mount and when token changes
  useEffect(() => {
    if (token) {
      try {
        // Simple token validation - you can enhance this based on your JWT structure
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp < currentTime) {
          // Token expired
          useAuthStore.getState().logout();
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        // Invalid token format
        useAuthStore.getState().logout();
        localStorage.removeItem('access_token');
      }
    }
  }, [token]);

  const handleSetActivePage = (page) => {
    if (canAccessPage(user, page)) {
      setActivePage(page);
    }
  };


  const handleLogout = () => {
    logoutApi();
    setActivePage('');
    // navigate('/login');
  };

  const handleAddUser = () => {
    setShowAddUser(true);
    setShowViewUsers(false);
  };

  const handleViewUsers = () => {
    setShowViewUsers(true);
    setShowAddUser(false);
  };

  const handleCloseModals = () => {
    setShowAddUser(false);
    setShowViewUsers(false);
  };

  const renderPage = () => {
    if (!currentPage) {
      return null;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'notice':
        return <Notice />;
      case 'tender':
        return <Tender />;
      case 'publication':
        return <Publication />;
      case 'faculty':
        return <Faculty />;
      case 'research project':
        return <ResearchProject />;
      case 'ilms':
        return <ILMS />;
      case 'workshop/ seminar details':
        return <Seminar />;
      case 'achievements':
        return <Award />;
      case 'research scholars':
        return <Scholar />;
      case 'research supervisors':
        return <Supervisor />;
      case 'photo gallery':
        return <Gallery />;
      case 'events & news':
        return <News />;
      default:
        return null;
    }
  };

  // Set initial page to dashboard if authenticated and no active page
  useEffect(() => {
    if (isAuthenticated && !activePage) {
      setActivePage('dashboard');
    }
  }, [isAuthenticated, activePage]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <Layout activePage={currentPage} setActivePage={handleSetActivePage} onLogout={handleLogout} onAddUser={handleAddUser} onViewUsers={handleViewUsers}>
        {renderPage()}
      </Layout>
      
      {showAddUser && <AddUser onClose={handleCloseModals} />}
      {showViewUsers && <ViewUsers onClose={handleCloseModals} />}
    </>
  );
}

export default App;
