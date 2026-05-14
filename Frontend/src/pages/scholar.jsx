import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faEdit,
  faEye,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faUpload,
  faTimes,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../store/authStore';
import './scholar.css';

const Scholar = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const initialData = [
    { id: 1, name: 'Priyanka Mohanty', email: 'priyanka.mohanty@utkaluniversity.ac.in', mentor: 'Dr. Suresh Chandra Dash', docName: 'profile.pdf', docSize: '245 KB', date: 'May 20, 2025' },
    { id: 2, name: 'Rohit Kumar Behera', email: 'rohit.behera@utkaluniversity.ac.in', mentor: 'Dr. Priyanka Mohanty', docName: 'profile.pdf', docSize: '210 KB', date: 'May 18, 2025' },
    { id: 3, name: 'Ananya Sahoo', email: 'ananya.sahoo@utkaluniversity.ac.in', mentor: 'Dr. Ranjan Kumar Panigrahi', docName: 'profile.pdf', docSize: '198 KB', date: 'May 15, 2025' },
    { id: 4, name: 'Subhra Jyoti Nayak', email: 'subhra.nayak@utkaluniversity.ac.in', mentor: 'Dr. Sunita Patra', docName: 'profile.pdf', docSize: '224 KB', date: 'May 12, 2025' },
    { id: 5, name: 'Madhusmita Kar', email: 'madhusmita.kar@utkaluniversity.ac.in', mentor: 'Dr. Debasis Samantaray', docName: 'profile.pdf', docSize: '186 KB', date: 'May 10, 2025' },
    { id: 6, name: 'Satyabrata Swain', email: 'satyabrata.swain@utkaluniversity.ac.in', mentor: 'Dr. Ajit Kumar Behera', docName: 'profile.pdf', docSize: '205 KB', date: 'May 08, 2025' },
    { id: 7, name: 'Kunal Pradhan', email: 'kunal.pradhan@utkaluniversity.ac.in', mentor: 'Dr. Bikash Ranjan Nayak', docName: 'profile.pdf', docSize: '192 KB', date: 'May 05, 2025' },
    { id: 8, name: 'Lipsa Lenka', email: 'lipsa.lenka@utkaluniversity.ac.in', mentor: 'Dr. Madhusmita Kar', docName: 'profile.pdf', docSize: '188 KB', date: 'May 02, 2025' },
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
    <div className="scholar-page">
      <div className="scholar-header">
        <div className="scholar-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Research Scholars</span>
          </div>
          <h1>Research Scholars</h1>
          <p className="scholar-subtitle">Manage all research scholars registered under your department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-scholar" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Scholar
          </button>
        )}
      </div>

      <div className="scholar-content">
        <div className="scholar-list-section">
          <div className="scholar-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search scholars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="scholar-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ width: '35%' }}>Scholar Name</th>
                <th>Mentor Name</th>
                <th>Document</th>
                <th>Date Added</th>
                {user?.role !== 'admin' && (
                  <th>Actions</th>
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
                    <div className="scholar-name-cell">
                      <img src={`https://ui-avatars.com/api/?name=${item.name.replace(/ /g, '+')}&background=random&color=fff`} alt={item.name} className="scholar-avatar" />
                      <div className="scholar-name-info">
                        <span className="scholar-name-text">{item.name}</span>
                        <span className="scholar-email-text">{item.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-dark">{item.mentor}</td>
                  <td>
                    <div className="document-cell">
                      <FontAwesomeIcon icon={faFilePdf} className="doc-icon-red" />
                      <div className="doc-info-sm">
                        <span className="doc-name-sm">{item.docName}</span>
                        <span className="doc-size-sm">{item.docSize}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{item.date}</td>
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
          < div className="add-scholar-section">
            <h2 className="form-title">{editingItem ? 'Edit Research Scholar' : 'Add New Research Scholar'}</h2>
            <form className="scholar-form">
              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input type="text" placeholder="Enter scholar full name" defaultValue={editingItem?.name || ''} />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" placeholder="Enter scholar email" defaultValue={editingItem?.email || ''} />
              </div>

              <div className="form-group">
                <label>Mentor Name <span className="required">*</span></label>
                <input type="text" placeholder="Enter mentor full name" defaultValue={editingItem?.mentor || ''} />
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>File Attachment (PDF, DOC, DOCX) <span className="required">*</span></label>
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                  <p>Click to upload <span>or drag and drop</span></p>
                  <span className="upload-hint">Max file size: 10MB</span>
                  <input type="file" hidden ref={fileInputRef} accept=".pdf,.doc,.docx" />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="button" className="btn-submit">{editingItem ? 'Update Scholar' : 'Save Scholar'}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {
        viewingItem && (
          <div className="modal-overlay" onClick={() => setViewingItem(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Research Scholar Details</h2>
                <button className="btn-close-modal" onClick={() => setViewingItem(null)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-details-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">Scholar Name</span>
                    <span className="detail-value font-medium text-dark">{viewingItem.name}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{viewingItem.email}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Mentor Name</span>
                    <span className="detail-value">{viewingItem.mentor}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date Added</span>
                    <span className="detail-value">{viewingItem.date}</span>
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
        )
      }
    </div >
  );
};

export default Scholar;
