import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faLink,
  faFilePdf,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { createTender, getTenders } from '../../utils/api';
import { useAuthStore } from '../store/authStore';
import './tender.css';

const formatInputDateToApi = (value) => {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');
  return `${day}-${month}-${year}`;
};

const parseApiDate = (value) => {
  if (!value) {
    return null;
  }

  const [day, month, year] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getTenderStatus = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseApiDate(startDate);
  const end = parseApiDate(endDate);

  if (start && today < start) {
    return 'Upcoming';
  }

  if (end && today > end) {
    return 'Expired';
  }

  return 'Active';
};

const getFileName = (path) => path?.split('/').pop() || '';

const mapTender = (tender) => ({
  id: tender.id,
  title: tender.title,
  attachmentType: tender.file ? 'pdf' : 'link',
  attachmentName: tender.file ? getFileName(tender.file) : tender.link || 'No attachment',
  attachmentUrl: tender.file_url || tender.link || '#',
  startDate: tender.start_date,
  endDate: tender.end_date,
  preview: Number(tender.preview) === 0 ? 'Appr. Pending' : 'Published',
  status: getTenderStatus(tender.start_date, tender.end_date),
});

const Tender = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingTender, setEditingTender] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    link: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const loadTenders = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getTenders();
        setTenders(data.map(mapTender));
      } catch (err) {
        const validationErrors = err.data?.errors;
        const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
        setError(firstError || err.data?.message || err.message || 'Unable to load tenders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTenders();
  }, []);

  const handleAddNewClick = () => {
    setEditingTender(null);
    setSelectedFile(null);
    setFormData({ title: '', link: '', startDate: '', endDate: '' });
  };

  const handleEditClick = (tender) => {
    setEditingTender(tender);
    setSelectedFile(null);
    setFormData({
      title: tender.title,
      link: tender.attachmentType === 'link' ? tender.attachmentName : '',
      startDate: tender.startDate,
      endDate: tender.endDate
    });
  };

  const handleDelete = (id) => {
    setTenders((current) => current.filter((tender) => tender.id !== id));

    if (editingTender?.id === id) {
      handleAddNewClick();
    }
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
    payload.append('start_date', formatInputDateToApi(formData.startDate));
    payload.append('end_date', formatInputDateToApi(formData.endDate));

    if (formData.link) {
      payload.append('link', formData.link);
    }

    if (selectedFile) {
      payload.append('file', selectedFile);
    }

    setIsSaving(true);

    try {
      const savedTender = await createTender(payload);
      setTenders((current) => [mapTender(savedTender), ...current]);
      handleAddNewClick();

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Tender saved successfully.',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      const validationErrors = err.data?.errors;
      const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;

      const rawMessage = err.data?.message || err.message;
      const sanitizedMessage = typeof rawMessage === 'string'
        ? rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors\)\s*$/i, '')
        : rawMessage;

      const message = firstError || sanitizedMessage || 'Unable to save tender.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Upcoming': return 'status-upcoming';
      case 'Closed': return 'status-closed';
      case 'Expired': return 'status-expired';
      default: return '';
    }
  };

  const filteredTenders = tenders.filter((tender) =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPreviewClass = (value) => (value === 'Published' ? 'status-published' : 'status-pending');

  return (
    <div className="tender-page">
      <div className="tender-header">
        <div className="tender-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Tender</span>
          </div>
          <h1>Tenders</h1>
          <p className="tender-subtitle">Manage all tenders uploaded by your department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-tender" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Tender
          </button>
        )}
      </div>

      <div className="tender-content">
        <div className="tender-list-section">
          <div className="tender-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Status">
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Closed">Closed</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
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

          <table className="tender-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Preview</th>
                <th>Status</th>
                {/* {user?.role !== 'admin' && ( */}
                <th>Actions</th>
                {/*  )} */}

                {/* {user?.role === 'admin' && (
                  <th>Updated by</th>
                )} */}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Loading tenders...</td>
                </tr>
              )}
              {!isLoading && filteredTenders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No tenders found.</td>
                </tr>
              )}
              {!isLoading && filteredTenders.map((tender, index) => (
                <tr key={tender.id}>
                  <td className="col-id">{index + 1}</td>
                  <td>
                    <div className="tender-title-cell">
                      <span className="tender-title-text">{tender.title}</span>
                      <div className={`tender-attachment ${tender.attachmentType}`}>
                        {tender.attachmentType === 'pdf' ? (
                          <FontAwesomeIcon icon={faFilePdf} />
                        ) : (
                          <FontAwesomeIcon icon={faLink} />
                        )}
                        <a href={tender.attachmentUrl} className="attachment-name" target="_blank" rel="noreferrer">
                          {tender.attachmentName}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="col-date">{tender.startDate}</td>
                  <td className="col-date">{tender.endDate}</td>
                  <td>
                    <div className={`preview-indicator ${getPreviewClass(tender.preview)}`}>
                      <span className="status-dot"></span>
                      {tender.preview}
                    </div>
                  </td>
                  <td>
                    <div className={`status-indicator ${getStatusClass(tender.status)}`}>
                      <span className="status-dot"></span>
                      {tender.status}
                    </div>
                  </td>
                  {/* {user?.role !== 'admin' && ( */}
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" type="button" onClick={() => handleEditClick(tender)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="action-btn delete-btn" type="button" onClick={() => handleDelete(tender.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                  {/* )} */}

                  {/* {user?.role === 'admin' && (
                    <td>{tender.updated_by ?? 'N/A'}</td>
                  )} */}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span className="pagination-text">Showing {filteredTenders.length} of {tenders.length} entries</span>
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
        <div className="add-tender-section">
          <h2 className="form-title">{editingTender ? 'Edit Tender' : 'Add New Tender'}</h2>
          {error && (
            <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter tender title" />
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
                  <div style={{ padding: '8px 0', color: '#4f46e5', fontWeight: '600', fontSize: '13px' }}>
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
              <label>Start Date <span className="required">*</span></label>
              <div className="date-input-wrapper">
                <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              </div>
            </div>

            <div className="form-group">
              <label>End Date <span className="required">*</span></label>
              <div className="date-input-wrapper">
                <input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
              <button type="submit" className="btn-submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingTender ? 'Update Tender' : 'Save Tender'}
              </button>
            </div>
          </form>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Tender;
