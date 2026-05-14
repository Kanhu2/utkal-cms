import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faEdit,
  faEye,
  faTrash,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faUpload,
  faTimes,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../store/authStore';
import './supervisor.css';

const Supervisor = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const initialData = [
    { id: 1, name: 'Dr. Suresh Chandra Dash', email: 'suresh.dash@utkaluniversity.ac.in', intake: '10', docName: 'profile.pdf', docSize: '245 KB' },
    { id: 2, name: 'Dr. Priyanka Mohanty', email: 'priyanka.mohanty@utkaluniversity.ac.in', intake: '8', docName: 'profile.pdf', docSize: '210 KB' },
    { id: 3, name: 'Dr. Ranjan Kumar Panigrahi', email: 'ranjan.panigrahi@utkaluniversity.ac.in', intake: '6', docName: 'profile.pdf', docSize: '198 KB' },
    { id: 4, name: 'Dr. Sunita Patra', email: 'sunita.patra@utkaluniversity.ac.in', intake: '8', docName: 'profile.pdf', docSize: '224 KB' },
    { id: 5, name: 'Dr. Debasis Samantaray', email: 'debasis.samantaray@utkaluniversity.ac.in', intake: '5', docName: 'profile.pdf', docSize: '186 KB' },
    { id: 6, name: 'Dr. Ajit Kumar Behera', email: 'ajit.behera@utkaluniversity.ac.in', intake: '6', docName: 'profile.pdf', docSize: '205 KB' },
    { id: 7, name: 'Dr. Madhusmita Kar', email: 'madhusmita.kar@utkaluniversity.ac.in', intake: '4', docName: 'profile.pdf', docSize: '192 KB' },
    { id: 8, name: 'Dr. Bikash Ranjan Nayak', email: 'bikash.nayak@utkaluniversity.ac.in', intake: '5', docName: 'profile.pdf', docSize: '188 KB' },
  ];

  const [items, setItems] = useState(initialData);
  const fileInputRef = useRef(null);

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
  };

  return (
    <div className="supervisor-page">
      <div className="supervisor-header">
        <div className="supervisor-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Research Supervisors</span>
          </div>
          <h1>Research Supervisors</h1>
          <p className="supervisor-subtitle">Manage all research supervisors in your department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-supervisor" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Supervisor
          </button>
        )}
      </div>

      <div className="supervisor-content">
        <div className="supervisor-list-section">
          <div className="supervisor-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search supervisors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Intakes">
                  <option value="All Intakes">All Intakes</option>
                  <option value="Available">Available</option>
                  <option value="Full">Full</option>
                </select>
              </div>
              <button className="btn-filter-icon" type="button">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          <table className="supervisor-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ width: '40%' }}>Supervisor Name</th>
                <th>Intake</th>
                <th>Document</th>
                {user?.role !== 'admin' && (
                  <th className="text-right">Actions</th>
                )}
                {user?.role === 'admin' && (
                  <th>Updated by</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-bold">{item.id}</td>
                  <td>
                    <div className="supervisor-name-cell">
                      <img src={`https://ui-avatars.com/api/?name=${item.name.replace(/ /g, '+')}&background=random&color=fff`} alt={item.name} className="supervisor-avatar" />
                      <div className="supervisor-name-info">
                        <span className="supervisor-name-text">{item.name}</span>
                        <span className="supervisor-email-text">{item.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="intake-badge">{item.intake}</span>
                  </td>
                  <td>
                    <div className="document-cell">
                      <FontAwesomeIcon icon={faFilePdf} className="doc-icon-red" />
                      <div className="doc-info-sm">
                        <span className="doc-name-sm">{item.docName}</span>
                        <span className="doc-size-sm">{item.docSize}</span>
                      </div>
                    </div>
                  </td>
                  {user?.role !== 'admin' && (
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" type="button" onClick={() => setViewingItem(item)}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="action-btn" type="button" onClick={() => handleEditClick(item)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="action-btn delete-btn" type="button" onClick={() => handleDelete(item.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  )}

                  {user?.role === 'admin' && (
                    <td>{item.updated_by ?? 'N/A'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span className="pagination-text">Showing 1 to {items.length} of {items.length} entries</span>
            <div className="pagination-controls">
              <div className="page-btn">
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
              <div className="page-btn active">1</div>
              <div className="page-btn">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </div>
        </div>

        {user?.role !== 'admin' && (
          <div className="add-supervisor-section">
            <h2 className="form-title">{editingItem ? 'Edit Research Supervisor' : 'Add New Research Supervisor'}</h2>
            <form className="supervisor-form">
              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input type="text" placeholder="Enter supervisor full name" defaultValue={editingItem?.name || ''} />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" placeholder="Enter supervisor email" defaultValue={editingItem?.email || ''} />
              </div>

              <div className="form-group">
                <label>Intake (Number of Scholars) <span className="required">*</span></label>
                <input type="text" placeholder="Enter intake (e.g., 5)" defaultValue={editingItem?.intake || ''} />
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>File Attachment (PDF, DOC, DOCX)</label>
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                  <p>Click to upload <span>or drag and drop</span></p>
                  <span className="upload-hint">Max file size: 10MB</span>
                  <input type="file" hidden ref={fileInputRef} accept=".pdf,.doc,.docx" />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="button" className="btn-submit">{editingItem ? 'Update Supervisor' : 'Save Supervisor'}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {viewingItem && (
        <div className="modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Research Supervisor Details</h2>
              <button className="btn-close-modal" onClick={() => setViewingItem(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-details-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Supervisor Name</span>
                  <span className="detail-value font-medium text-dark">{viewingItem.name}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{viewingItem.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Intake Capacity</span>
                  <span className="detail-value"><span className="intake-badge">{viewingItem.intake}</span></span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Document</span>
                  <span className="detail-value text-link-primary">{viewingItem.docName} ({viewingItem.docSize})</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setViewingItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supervisor;
