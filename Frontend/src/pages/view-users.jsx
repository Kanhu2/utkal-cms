import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faEdit,
  faTrash,
  faUsers,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

import { getUsers, deleteUser } from '../../utils/api';
import './view-users.css';

const ViewUsers = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);

      const response = await getUsers();

      console.log(response);

      setUsers(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load users'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(userId);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete user'
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      user?.name?.toLowerCase().includes(search) ||
      user?.email?.toLowerCase().includes(search) ||
      user?.department?.name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="view-users-overlay">
      <div className="view-users-container">

        {/* Header */}
        <div className="view-users-header">
          <div className="header-left">
            <h2>
              <FontAwesomeIcon
                icon={faUsers}
                className="header-icon"
              />
              View Users
            </h2>

            <span className="user-count">
              {filteredUsers.length} users found
            </span>
          </div>

          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="search-container">
          <div className="search-input-group">
            <FontAwesomeIcon
              icon={faSearch}
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search by name, email or department..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-container">

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon
                icon={faUsers}
                className="empty-icon"
              />

              <h3>No users found</h3>

              <p>
                {searchTerm
                  ? 'No users match your search.'
                  : 'No users available.'}
              </p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Assigned Modules</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>

                    {/* Serial Number */}
                    <td className="user-id">
                      {index + 1}
                    </td>

                    {/* Name */}
                    <td className="user-name">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="user-email">
                      {user.email}
                    </td>

                    {/* Department */}
                    <td className="user-department">
                      {user.department?.name || 'N/A'}
                    </td>

                    <td className="user-modules">
                      <div className="modules-list">
                        {user.assigned_modules?.length > 0 ? (
                          user.assigned_modules.map((module, index) => (
                            <span key={index} className="module-badge">
                              {module}
                            </span>
                          ))
                        ) : (
                          <span className="no-modules">
                            No modules assigned
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="user-actions">

                      <button
                        className="action-btn edit-btn"
                        title="Edit User"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        title="Delete User"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewUsers;