import React, { useState, useRef, useEffect } from 'react';
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
  faFileImage,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/authStore';
import './seminar.css';
import { getWorkshopSeminars, createWorkshopSeminar } from '../../utils/api';

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  // Handle dd-mm-yyyy format from backend
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`);
    }
  }
  return new Date(dateStr);
};

const formatDate = (dateStr) => {
  const date = parseDate(dateStr);
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const mapWorkshopSeminar = (item) => {
  const startDate = item.start_date || item.date;
  const endDate = item.end_date || item.date;
  const startDateObj = parseDate(startDate);
  const startYear = startDateObj && !isNaN(startDateObj.getTime()) ? startDateObj.getFullYear().toString() : '';

  return {
    id: item.id,
    year: item.year || startYear,
    name: item.name || item.title,
    description: item.description,
    participants: item.participants || '0',
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    photo: item.photo,
    photoUrl: item.photo_url,
    broucher: item.broucher,
    broucherUrl: item.broucher_url,
    createDate: item.created_at || item.create_date,
    userName: item.user_name,
  };
};

const Seminar = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    participants: '',
    start_date: '',
    end_date: '',
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedBrochure, setSelectedBrochure] = useState(null);
  const photoInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const formatDateToApi = (value) => {
    if (!value) return '';
    // HTML date input gives yyyy-mm-dd. Backend expects d-m-Y.
    if (value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        const [year, month, day] = parts;
        return `${day}-${month}-${year}`;
      }
    }
    return value;
  };

  useEffect(() => {
    loadWorkshopSeminars();
  }, []);

  const loadWorkshopSeminars = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkshopSeminars();
      setItems(data.map(mapWorkshopSeminar));
    } catch (err) {
      setError(err.message || 'Failed to load workshop/seminar details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('participants', formData.participants);
    payload.append('start_date', formatDateToApi(formData.start_date));
    payload.append('end_date', formatDateToApi(formData.end_date));
    if (selectedPhoto) {
      payload.append('photo', selectedPhoto);
    }
    if (selectedBrochure) {
      payload.append('broucher', selectedBrochure);
    }

    try {
      const saved = await createWorkshopSeminar(payload);
      setItems(prev => [mapWorkshopSeminar(saved), ...prev]);
      setFormData({
        name: '',
        participants: '',
        start_date: '',
        end_date: '',
      });
      setSelectedPhoto(null);
      setSelectedBrochure(null);
      setEditingItem(null);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Workshop/Seminar saved successfully.',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      const validationErrors = err.data?.errors;
      const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;

      const rawMessage = err.data?.message || err.message;
      const sanitizedMessage = typeof rawMessage === 'string'
        ? rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors\)\s*$/i, '')
        : rawMessage;

      setError(firstError || sanitizedMessage || 'Unable to save workshop/seminar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      participants: item.participants || '',
      start_date: '',
      end_date: '',
    });
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      participants: '',
      start_date: '',
      end_date: '',
    });
    setSelectedPhoto(null);
    setSelectedBrochure(null);
    setError('');
  };

  return (
    <div className="seminar-page">
      <div className="seminar-header">
        <div className="seminar-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Workshop / Seminar Details</span>
          </div>
          <h1>Workshop / Seminar Details</h1>
          <p className="seminar-subtitle">Manage all workshop and seminar details organized by your department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-seminar" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Workshop / Seminar
          </button>
        )}
      </div>

      <div className="seminar-content">
        <div className="seminar-list-section">
          <div className="seminar-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search workshop/seminar..."
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

          <table className="seminar-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Year</th>
                <th style={{ width: '35%' }}>Name of Workshop / Seminar</th>
                <th>Number of Participants</th>
                <th>Start Date</th>
                <th>End Date</th>
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Loading workshop/seminar details...</td>
                </tr>
              )}
              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No workshop/seminar details found.</td>
                </tr>
              )}
              {!isLoading && items.map((item, index) => (
                <tr key={item.id}>
                  <td className="font-bold">{index + 1}</td>
                  <td className="font-medium text-dark">{item.year}</td>
                  <td className="font-medium text-dark">{item.name}</td>
                  <td className="text-muted">{item.participants}</td>
                  <td className="text-muted">{item.startDate}</td>
                  <td className="text-muted">{item.endDate}</td>
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
          <div className="add-seminar-section">
            <h2 className="form-title">{editingItem ? 'Edit Workshop / Seminar' : 'Add New Workshop / Seminar'}</h2>
            {error && (
              <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                {error}
              </div>
            )}
            <form className="seminar-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name of Workshop / Seminar <span className="required">*</span></label>
                <input type="text" name="name" placeholder="Enter workshop/seminar name" value={formData.name} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Number of Participants <span className="required">*</span></label>
                <input type="number" name="participants" placeholder="Enter number of participants" value={formData.participants} onChange={handleInputChange} />
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>Photo <span className="required">*</span></label>
                <div className="upload-zone" onClick={() => photoInputRef.current.click()}>
                  <input type="file" hidden ref={photoInputRef} accept="image/jpeg, image/png" onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)} />
                  {selectedPhoto ? (
                    <div style={{ padding: '8px 0', color: '#4f46e5', fontWeight: '600', fontSize: '13px' }}>
                      <FontAwesomeIcon icon={faFileImage} style={{ marginRight: '8px', color: '#0891b2' }} />
                      {selectedPhoto.name}
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                      <p>Click to upload <span>or drag and drop</span></p>
                      <span className="upload-hint">JPG, PNG (Max size: 5MB)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>Broucher <span className="required">*</span></label>
                <div className="upload-zone" onClick={() => pdfInputRef.current.click()}>
                  <input type="file" hidden ref={pdfInputRef} accept="application/pdf" onChange={(e) => setSelectedBrochure(e.target.files?.[0] || null)} />
                  {selectedBrochure ? (
                    <div style={{ padding: '8px 0', color: '#4f46e5', fontWeight: '600', fontSize: '13px' }}>
                      <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#dc2626' }} />
                      {selectedBrochure.name}
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                      <p>Click to upload <span>or drag and drop</span></p>
                      <span className="upload-hint">PDF (Max size: 10MB)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Start Date <span className="required">*</span></label>
                <div className="date-input-wrap">
                  <input type="text" name="start_date" placeholder="Select start date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }} value={formData.start_date} onChange={handleInputChange} />
                  <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label>End Date <span className="required">*</span></label>
                <div className="date-input-wrap">
                  <input type="text" name="end_date" placeholder="Select end date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }} value={formData.end_date} onChange={handleInputChange} />
                  <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={isSaving}>{isSaving ? 'Saving...' : (editingItem ? 'Update Workshop / Seminar' : 'Save Workshop / Seminar')}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {viewingItem && (
        <div className="modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Workshop / Seminar Details</h2>
              <button className="btn-close-modal" onClick={() => setViewingItem(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-details-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Name</span>
                  <span className="detail-value font-medium text-dark">{viewingItem.name}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{viewingItem.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year</span>
                  <span className="detail-value">{viewingItem.year}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Participants</span>
                  <span className="detail-value">{viewingItem.participants}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Start Date</span>
                  <span className="detail-value">{viewingItem.startDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">End Date</span>
                  <span className="detail-value">{viewingItem.endDate}</span>
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

export default Seminar;
