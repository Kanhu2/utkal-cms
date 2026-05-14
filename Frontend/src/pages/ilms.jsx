import React, { useEffect, useState, useRef } from 'react';
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
  faFilePdf,
  faFileVideo,
  faFilePowerpoint,
  faFileWord,
  faFileArchive,
  faLink,
  faCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { createIlms, getIlms } from '../../utils/api';
import { useAuthStore } from '../store/authStore';
import './ilms.css';

const ILMS = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const fileInputRef = useRef(null);

  const getFileName = (path) => path?.split('/').pop() || '';

  const getTypeFromFileName = (value) => {
    const fileName = (value || '').toLowerCase();
    const extension = fileName.includes('.') ? fileName.split('.').pop() : '';

    if (extension === 'pdf') return 'pdf';
    if (extension === 'mp4' || extension === 'webm' || extension === 'mov') return 'video';
    if (extension === 'ppt' || extension === 'pptx') return 'ppt';
    if (extension === 'doc' || extension === 'docx') return 'doc';
    if (extension === 'zip' || extension === 'rar' || extension === '7z') return 'zip';

    return 'pdf';
  };

  const mapIlmsItem = (item) => {
    const fileName = getFileName(item.file);
    const type = getTypeFromFileName(fileName);

    return {
      id: item.id,
      type,
      title: item.title,
      description: item.description,
      fileName,
      fileUrl: item.file_url,
      date: item.create_date,
      preview: item.preview,
      approvalStatus: Number(item.preview) === 0 ? 'Appr. Pending' : 'Published',
    };
  };

  useEffect(() => {
    const loadIlms = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getIlms();
        setItems(data.map(mapIlmsItem));
      } catch (err) {
        const validationErrors = err.data?.errors;
        const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
        setError(firstError || err.data?.message || err.message || 'Unable to load ILMS resources.');
      } finally {
        setIsLoading(false);
      }
    };

    loadIlms();
  }, []);

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
    setSelectedFile(null);
    setFormData({ title: '', description: '' });
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedFile && selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be 100MB or less.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);

    if (selectedFile) {
      payload.append('file', selectedFile);
    }

    setIsSaving(true);

    try {
      const saved = await createIlms(payload);
      setItems((current) => [mapIlmsItem(saved), ...current]);
      handleAddNewClick();

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'ILMS saved successfully.',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      const validationErrors = err.data?.errors;
      const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;

      const rawMessage = err.data?.message || err.message;
      const sanitizedMessage = typeof rawMessage === 'string'
        ? rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors\)\s*$/i, '')
        : rawMessage;

      setError(firstError || sanitizedMessage || 'Unable to save ILMS.');
    } finally {
      setIsSaving(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'pdf': return { icon: faFilePdf, class: 'icon-pdf' };
      case 'video': return { icon: faFileVideo, class: 'icon-video' };
      case 'ppt': return { icon: faFilePowerpoint, class: 'icon-ppt' };
      case 'doc': return { icon: faFileWord, class: 'icon-doc' };
      case 'link': return { icon: faLink, class: 'icon-link' };
      case 'zip': return { icon: faFileArchive, class: 'icon-zip' };
      default: return { icon: faFilePdf, class: 'icon-pdf' };
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getApprovalBadgeClass = (approvalStatus) => (approvalStatus === 'Published' ? 'published' : 'pending');

  const renderFilePreview = (item) => {
    if (!item?.fileUrl) {
      return null;
    }

    if (item.type === 'pdf') {
      return (
        <iframe
          src={item.fileUrl}
          title={item.title}
          style={{ width: '100%', height: '360px', border: '1px solid #f1f5f9', borderRadius: '5px' }}
        />
      );
    }

    return (
      <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-link-primary font-medium">
        Open file
      </a>
    );
  };

  return (
    <div className="ilms-page">
      <div className="ilms-header">
        <div className="ilms-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">ILMS</span>
          </div>
          <h1>ILMS Resources</h1>
          <p className="ilms-subtitle">Manage all ILMS resources uploaded by your department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-ilms" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New ILMS
          </button>
        )}
      </div>

      <div className="ilms-content">
        <div className="ilms-list-section">
          <div className="ilms-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search ILMS resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Status">
                  <option value="All Status">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <button className="btn-filter-icon" type="button">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          <table className="ilms-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ width: '45%' }}>Title</th>
                <th>Uploaded On</th>
                <th>Status</th>
                {user?.role !== 'admin' && (
                  <th>Actions</th>
                )}

                {user?.role === 'admin' && (
                  <th>Updated by</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>Loading ILMS resources...</td>
                </tr>
              )}
              {!isLoading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No ILMS resources found.</td>
                </tr>
              )}
              {!isLoading && filteredItems.map((item, index) => {
                const typeInfo = getIconForType(item.type);
                return (
                  <tr key={item.id}>
                    <td className="font-bold">{index + 1}</td>
                    <td>
                      <div className="ilms-title-cell">
                        <div className={`ilms-icon-box ${typeInfo.class}`}>
                          <FontAwesomeIcon icon={typeInfo.icon} />
                        </div>
                        <div className="ilms-title-text">
                          <span className="font-medium text-dark">{item.title}</span>
                          <span className="text-light-muted">{item.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{item.date}</td>
                    <td>
                      <div className={`status-badge ${getApprovalBadgeClass(item.approvalStatus)}`}>
                        <FontAwesomeIcon icon={faCircle} className="status-dot" />
                        {item.approvalStatus}
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
                      <td>
                        {item.updated_by ?? 'N/A'}
                      </td>
                    )}
                  </tr>
                );
              })}
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
          <div className="add-ilms-section">
            <h2 className="form-title">{editingItem ? 'Edit ILMS' : 'Add New ILMS'}</h2>
            {error && (
              <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                {error}
              </div>
            )}
            <form className="ilms-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input type="text" name="title" placeholder="Enter ILMS title" value={formData.title} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea name="description" placeholder="Enter description of the resource" rows="4" value={formData.description} onChange={handleInputChange}></textarea>
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>File Attachment (PDF, DOC, DOCX, PPT, MP4 etc.) <span className="required">*</span></label>
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  {selectedFile ? (
                    <div style={{ padding: '8px 0', color: '#4f46e5', fontWeight: '600', fontSize: '13px' }}>
                      <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#dc2626' }} />
                      {selectedFile.name}
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                      <p>Click to upload <span>or drag and drop</span></p>
                      <span className="upload-hint">Max file size: 100MB</span>
                    </>
                  )}
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={isSaving}>{isSaving ? 'Saving...' : (editingItem ? 'Update ILMS' : 'Save ILMS')}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {viewingItem && (
        <div className="modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{viewingItem.type === 'video' ? 'VIDEO' : viewingItem.type === 'ppt' ? 'PPT' : viewingItem.type === 'doc' ? 'DOC' : viewingItem.type === 'zip' ? 'ZIP' : 'PDF'}</h2>
              <button className="btn-close-modal" onClick={() => setViewingItem(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-details-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">File</span>
                  <span className="detail-value">
                    <a href={viewingItem.fileUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline' }}>
                      <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#dc2626' }} />
                      {viewingItem.fileName || 'No File'}
                    </a>
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Title</span>
                  <span className="detail-value font-medium text-dark">{viewingItem.title}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{viewingItem.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">File Type</span>
                  <span className="detail-value" style={{ textTransform: 'uppercase' }}>{viewingItem.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Uploaded On</span>
                  <span className="detail-value">{viewingItem.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status-badge ${getApprovalBadgeClass(viewingItem.approvalStatus)}`} style={{ marginTop: '4px' }}><FontAwesomeIcon icon={faCircle} className="status-dot" /> {viewingItem.approvalStatus}</span>
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

export default ILMS;
