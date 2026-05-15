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
  faCalendarAlt,
  faTimes,
  faFilePdf,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../store/authStore';
import './award.css';

const Award = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const initialData = [
    { id: 1, name: 'Dr. Suresh Chandra Dash', regNo: 'CS15R001', guide: 'Prof. (Dr.) Ranjan K. Panigrahi', date: 'May 18, 2025', subject: 'Computer Science and Applications', docName: 'PhD_Award_SCD.pdf', docSize: '245 KB' },
    { id: 2, name: 'Dr. Priyanka Mohanty', regNo: 'CS16R003', guide: 'Prof. (Dr.) Madhusmita Kar', date: 'Apr 22, 2025', subject: 'Machine Learning', docName: 'PhD_Award_PM.pdf', docSize: '310 KB' },
    { id: 3, name: 'Dr. Ranjan K. Panigrahi', regNo: 'CS14R002', guide: 'Prof. (Dr.) Ajit Kumar Behera', date: 'Mar 10, 2025', subject: 'Data Mining', docName: 'PhD_Award_RKP.pdf', docSize: '198 KB' },
    { id: 4, name: 'Dr. Sunita Patra', regNo: 'CS17R007', guide: 'Prof. (Dr.) Debasis Samantaray', date: 'Feb 28, 2025', subject: 'Software Engineering', docName: 'PhD_Award_SP.pdf', docSize: '276 KB' },
    { id: 5, name: 'Dr. Debasis Samantaray', regNo: 'CS13R005', guide: 'Prof. (Dr.) Suresh Chandra Dash', date: 'Jan 15, 2025', subject: 'Artificial Intelligence', docName: 'PhD_Award_DS.pdf', docSize: '305 KB' },
    { id: 6, name: 'Dr. Ajit Kumar Behera', regNo: 'CS12R001', guide: 'Prof. (Dr.) Ranjan K. Panigrahi', date: 'Dec 30, 2024', subject: 'Data Science', docName: 'PhD_Award_AKB.pdf', docSize: '220 KB' },
    { id: 7, name: 'Dr. Madhusmita Kar', regNo: 'CS11R009', guide: 'Prof. (Dr.) Sunita Patra', date: 'Dec 12, 2024', subject: 'Web Development', docName: 'PhD_Award_MK.pdf', docSize: '180 KB' },
    { id: 8, name: 'Dr. Bikash R. Nayak', regNo: 'CS10R001', guide: 'Prof. (Dr.) Pramod K. Sahu', date: 'Nov 25, 2024', subject: 'Computer Networks', docName: 'PhD_Award_BRN.pdf', docSize: '212 KB' },
  ];

  const [items, setItems] = useState(initialData);
  const fileInputRef = useRef(null);

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
    }
  };

  const handlePublish = (id) => {
    setItems((current) => current.map((item) => (
      item.id === id ? { ...item, status: 'Published' } : item
    )));
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
  };

  return (
    <div className="award-page">
      <div className="award-header">
        <div className="award-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Achievements</span>
          </div>
          <h1>Achievements</h1>
          <p className="award-subtitle">Manage all PhD awards (doctoral degree awards) uploaded by the department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-award" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New PhD Award
          </button>
        )}
      </div>

      <div className="award-content">
        <div className="award-list-section">
          <div className="award-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search PhD awards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Years">
                  <option value="All Years">All Years</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <button className="btn-filter-icon" type="button">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          <table className="award-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name of Awardee</th>
                <th>Regd. No.</th>
                <th>Guide / Supervisor</th>
                <th>Date of Award</th>
                <th>Subject / Thesis Title</th>
                <th>Document</th>
                <th>Actions</th>
                <th>Updated by</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-bold">{item.id}</td>
                  <td className="font-medium text-dark">{item.name}</td>
                  <td className="text-muted">{item.regNo}</td>
                  <td className="font-medium text-dark">{item.guide}</td>
                  <td className="text-muted">{item.date}</td>
                  <td className="text-muted">{item.subject}</td>
                  <td>
                    <div className="document-action-cell">
                      <FontAwesomeIcon icon={faFilePdf} className="doc-icon" />
                      <div className="doc-info">
                        <span className="doc-name">{item.docName}</span>
                        <div className="doc-meta-actions">
                          <span className="doc-size">{item.docSize}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" type="button" onClick={() => setViewingItem(item)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {user?.role !== 'admin' && (
                        <button className="action-btn" type="button" onClick={() => handleEditClick(item)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                      <button className="action-btn delete-btn" type="button" onClick={() => handleDelete(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      {user?.role === 'admin' && item.status !== 'Published' && (
                        <button className="action-btn" type="button" onClick={() => handlePublish(item.id)}>
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    {item.updated_by ?? 'N/A'}
                  </td>
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
          <div className="add-award-section">
            <h2 className="form-title">{editingItem ? 'Edit PhD Award' : 'Add New PhD Award'}</h2>
            <form className="award-form">
              <div className="form-group">
                <label>Name of Awardee <span className="required">*</span></label>
                <input type="text" placeholder="Enter name of awardee" defaultValue={editingItem?.name || ''} />
              </div>

              <div className="form-group">
                <label>Regd. No. <span className="required">*</span></label>
                <input type="text" placeholder="Enter registration number" defaultValue={editingItem?.regNo || ''} />
              </div>

              <div className="form-group">
                <label>Guide / Supervisor <span className="required">*</span></label>
                <input type="text" placeholder="Enter guide / supervisor name" defaultValue={editingItem?.guide || ''} />
              </div>

              <div className="form-group">
                <label>Date of Award <span className="required">*</span></label>
                <div className="date-input-wrap">
                  <input type="text" placeholder="Select date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }} />
                  <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Subject / Thesis Title <span className="required">*</span></label>
                <input type="text" placeholder="Enter subject or thesis title" defaultValue={editingItem?.subject || ''} />
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>Document (PDF, DOC, DOCX) <span className="required">*</span></label>
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                  <p>Click to upload <span>or drag and drop</span></p>
                  <span className="upload-hint">Max file size: 10MB</span>
                  <input type="file" hidden ref={fileInputRef} accept=".pdf,.doc,.docx" />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="button" className="btn-submit">{editingItem ? 'Update PhD Award' : 'Save PhD Award'}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {viewingItem && (
        <div className="modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>PhD Award Details</h2>
              <button className="btn-close-modal" onClick={() => setViewingItem(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-details-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Name of Awardee</span>
                  <span className="detail-value font-medium text-dark">{viewingItem.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Regd. No.</span>
                  <span className="detail-value">{viewingItem.regNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Award</span>
                  <span className="detail-value">{viewingItem.date}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Guide / Supervisor</span>
                  <span className="detail-value">{viewingItem.guide}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Subject / Thesis Title</span>
                  <span className="detail-value">{viewingItem.subject}</span>
                </div>
                <div className="detail-item full-width">
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

export default Award;
