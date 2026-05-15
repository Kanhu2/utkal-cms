import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faEdit,
  faEllipsisV,
  faLink,
  faFilePdf,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faTrash,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { createNotice, deleteNotice, getNotices, updateNotice } from '../../utils/api';
import { useAuthStore } from '../store/authStore';
import './notice.css';

const getFileName = (path) => path?.split('/').pop() || '';

const mapNotice = (notice) => ({
  id: notice.id,
  title: notice.title,
  attachmentType: notice.file ? 'pdf' : 'link',
  attachmentName: notice.file ? getFileName(notice.file) : notice.link || 'No attachment',
  attachmentUrl: notice.file_url || notice.link || '#',
  category: notice.category,
  publishedDate: notice.publish_date,
  lastDate: notice.last_date,
  status: Number(notice.preview) === 0 ? 'Appr. Pending' : 'Published',
  updated_by: notice.updated_by || 'N/A',
});

const Notice = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    link: '',
    publishedDate: '',
    lastDate: ''
  });
  const menuRef = useRef(null);

  useEffect(() => {
    const loadNotices = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getNotices();
        setNotices(data.map(mapNotice));
      } catch (err) {
        const validationErrors = err.data?.errors;
        const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
        setError(firstError || err.data?.message || err.message || 'Unable to load notices.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddNewClick = () => {
    setEditingNotice(null);
    setSelectedFile(null);
    setError('');
    setFormData({ title: '', category: '', link: '', publishedDate: '', lastDate: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditClick = (notice) => {
    setEditingNotice(notice);
    setSelectedFile(null);
    setFormData({
      title: notice.title,
      category: notice.category,
      link: notice.attachmentType === 'link' ? notice.attachmentName : '',
      publishedDate: notice.publishedDate,
      lastDate: notice.lastDate
    });
    setActiveMenuId(null);
  };

  const handleDelete = async (id) => {
    setError('');

    try {
      await deleteNotice(id);
      setNotices((current) => current.filter((notice) => notice.id !== id));
      setActiveMenuId(null);

      if (editingNotice?.id === id) {
        handleAddNewClick();
      }
    } catch (err) {
      const message = err.data?.message || err.message || 'Unable to delete notice.';
      setError(message);
    }
  };

  const handlePublish = (id) => {
    setNotices((current) => current.map((notice) => (
      notice.id === id ? { ...notice, status: 'Published' } : notice
    )));
    setActiveMenuId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be 5MB or less.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('category', formData.category);
    payload.append('publish_date', formData.publishedDate);
    payload.append('last_date', formData.lastDate);

    if (formData.link) {
      payload.append('link', formData.link);
    }

    if (selectedFile) {
      payload.append('file', selectedFile);
    }

    setIsSaving(true);

    try {
      const savedNotice = editingNotice
        ? await updateNotice(editingNotice.id, payload)
        : await createNotice(payload);
      const mappedNotice = mapNotice(savedNotice);
      setNotices((current) => editingNotice
        ? current.map((notice) => (notice.id === mappedNotice.id ? mappedNotice : notice))
        : [mappedNotice, ...current]);
      handleAddNewClick();

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: editingNotice ? 'Notice updated successfully.' : 'Notice published successfully.',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      const validationErrors = err.data?.errors;
      const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;

      const rawMessage = err.data?.message || err.message;
      const sanitizedMessage = typeof rawMessage === 'string'
        ? rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors\)\s*$/i, '')
        : rawMessage;

      const message = firstError || sanitizedMessage || 'Unable to save notice.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryClass = (cat) => {
    switch (cat) {
      // case 'Academic': return 'cat-academic';
      case 'General': return 'cat-general';
      case 'Examination': return 'cat-examination';
      case 'Admission': return 'cat-admission';
      default: return '';
    }
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="notice-page">
      <div className="notice-header">
        <div className="notice-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Notice</span>
          </div>
          <h1>Notices</h1>
          <p className="notice-subtitle">Manage all notices published by your department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-notice" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Notice
          </button>
        )}
      </div>

      <div className="notice-content">
        <div className="notice-list-section">
          <div className="notice-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Categories">
                  <option value="All Categories">All Categories</option>
                  {/* <option value="Academic">Academic</option> */}
                  <option value="General">General</option>
                  <option value="Examination">Examination</option>
                  <option value="Admission">Admission</option>
                </select>
              </div>
              <div className="filter-box">
                <select defaultValue="All Status">
                  <option value="All Status">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          <table className="notice-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Last Date</th>
                <th>Status</th>
                <th>Actions</th>

                {/* {user?.role === 'admin' && (
                  <th>Updated by</th>
                )} */}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Loading notices...</td>
                </tr>
              )}
              {!isLoading && filteredNotices.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No notices found.</td>
                </tr>
              )}
              {!isLoading && filteredNotices.map((notice, index) => (
                <tr key={notice.id}>
                  <td className="col-id">{index + 1}</td>
                  <td>
                    <div className="notice-title-cell">
                      <span className="notice-title-text">{notice.title}</span>
                      <div className={`notice-attachment ${notice.attachmentType}`}>
                        {notice.attachmentType === 'pdf' ? (
                          <FontAwesomeIcon icon={faFilePdf} />
                        ) : (
                          <FontAwesomeIcon icon={faLink} />
                        )}
                        <a href={notice.attachmentUrl} className="attachment-name" target="_blank" rel="noreferrer">
                          {notice.attachmentName}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`category-badge ${getCategoryClass(notice.category)}`}>
                      {notice.category}
                    </span>
                  </td>
                  <td className="col-date">{notice.publishedDate}</td>
                  <td className="col-last-date">{notice.lastDate}</td>
                  <td>
                    <div className={`status-indicator ${notice.status === 'Published' ? 'status-published' : 'status-pending'}`}>
                      <span className="status-dot"></span>
                      {notice.status}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" type="button" onClick={() => handleEditClick(notice)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <div className="action-menu-container" ref={activeMenuId === notice.id ? menuRef : null}>
                        <button className="action-btn" type="button" onClick={() => setActiveMenuId(activeMenuId === notice.id ? null : notice.id)}>
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>
                        {activeMenuId === notice.id && (
                          <div className="action-dropdown">
                            <button className="dropdown-item delete-item" type="button" onClick={() => handleDelete(notice.id)}>
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            {user?.role === 'admin' && notice.status !== 'Published' && (
                              <button className="dropdown-item" type="button" onClick={() => handlePublish(notice.id)}>
                                <FontAwesomeIcon icon={faCheck} /> Publish
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* {user?.role === 'admin' && (
                    <td>
                      <div className="updated-by-info">
                        {notice.updated_by}
                      </div>
                    </td>
                  )} */}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span className="pagination-text">Showing {filteredNotices.length} of {notices.length} entries</span>
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

        {/* {user?.role !== 'admin' && ( */}
        <div className="add-notice-section">
          <h2 className="form-title">{editingNotice ? 'Edit Notice' : 'Add New Notice'}</h2>
          {error && (
            <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter notice title" />
            </div>

            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select className="form-control form-select" name="category" value={formData.category} onChange={handleInputChange}>
                <option value="" disabled hidden>Select category</option>
                {/* <option value="Academic">Academic</option> */}
                <option value="General">General</option>
                <option value="Examination">Examination</option>
                <option value="Admission">Admission</option>
              </select>
            </div>

            <div className="form-group">
              <label>File Attachment <span style={{ color: '#64748b', fontWeight: '400' }}>(PDF, DOC, DOCX)</span></label>
              <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                {selectedFile ? (
                  <div style={{ padding: '8px 0', color: '#6366f1', fontWeight: '600', fontSize: '13px' }}>
                    <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#dc2626' }} />
                    {selectedFile.name}
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="upload-text">Click to upload <span>or drag and drop</span></p>
                    <p className="upload-hint">Max file size: 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Link (Optional)</label>
              <input type="text" className="form-control" name="link" value={formData.link} onChange={handleInputChange} placeholder="https://example.com" />
            </div>

            <div className="form-group">
              <label>Publish Date <span className="required">*</span></label>
              <div className="date-input-wrapper">
                <input type="date" className="form-control" name="publishedDate" value={formData.publishedDate} onChange={handleInputChange} />
                <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              </div>
            </div>

            <div className="form-group">
              <label>Last Date <span className="required">*</span></label>
              <div className="date-input-wrapper">
                <input type="date" className="form-control" name="lastDate" value={formData.lastDate} onChange={handleInputChange} />
                <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
              <button type="submit" className="btn-submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingNotice ? 'Update Notice' : 'Publish Notice'}
              </button>
            </div>
          </form>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Notice;
