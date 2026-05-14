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
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/authStore';
import './research-project.css';
import { getResearchProjects, createResearchProject } from '../../utils/api';

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

const formatMonthYear = (dateStr) => {
  const date = parseDate(dateStr);
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const calculateMonths = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return 0;
  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, months);
};

const formatAmount = (amount) => {
  if (!amount) return '0';
  const num = parseInt(amount.toString().replace(/,/g, ''), 10) || 0;
  return num.toLocaleString('en-IN');
};

const mapResearchProject = (proj) => {
  const startFormatted = formatMonthYear(proj.start_date);
  const endFormatted = formatMonthYear(proj.end_date);
  const months = calculateMonths(proj.start_date, proj.end_date);

  return {
    id: proj.id,
    title: proj.title,
    agency: proj.funding_agency,
    amount: formatAmount(proj.amount),
    rawAmount: proj.amount,
    periodStr: `${startFormatted} - ${endFormatted}`,
    duration: `(${months} Months)`,
    pi: proj.coordinator_name,
    role: '',
    sanctionedLetter: proj.sanctioned_letter,
    sanctionedLetterUrl: proj.sanctioned_letter_url,
    startDate: proj.start_date,
    endDate: proj.end_date,
    createDate: proj.create_date,
    userName: proj.user_name,
  };
};

const ResearchProject = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    funding_agency: '',
    amount: '',
    start_date: '',
    end_date: '',
    coordinator_name: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getResearchProjects();
      setProjects(data.map(mapResearchProject));
    } catch (err) {
      setError(err.message || 'Failed to load research projects');
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
    payload.append('title', formData.title);
    payload.append('funding_agency', formData.funding_agency);
    payload.append('amount', formData.amount);
    payload.append('start_date', formData.start_date);
    payload.append('end_date', formData.end_date);
    payload.append('coordinator_name', formData.coordinator_name);
    if (selectedFile) {
      payload.append('sanctioned_letter', selectedFile);
    }

    try {
      const saved = await createResearchProject(payload);
      setProjects(prev => [mapResearchProject(saved), ...prev]);
      setFormData({
        title: '',
        funding_agency: '',
        amount: '',
        start_date: '',
        end_date: '',
        coordinator_name: '',
      });
      setSelectedFile(null);
      setEditingProject(null);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Research project saved successfully.',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      const validationErrors = err.data?.errors;
      const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;

      const rawMessage = err.data?.message || err.message;
      const sanitizedMessage = typeof rawMessage === 'string'
        ? rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors\)\s*$/i, '')
        : rawMessage;

      setError(firstError || sanitizedMessage || 'Unable to save research project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (editingProject && editingProject.id === id) {
      setEditingProject(null);
    }
  };

  const handleEditClick = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      funding_agency: proj.agency || '',
      amount: proj.amount?.replace(/,/g, '') || '',
      start_date: '',
      end_date: '',
      coordinator_name: proj.pi || '',
    });
  };

  const handleAddNewClick = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      funding_agency: '',
      amount: '',
      start_date: '',
      end_date: '',
      coordinator_name: '',
    });
    setSelectedFile(null);
    setError('');
  };

  return (
    <div className="rp-page">
      <div className="rp-header">
        <div className="rp-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Research Projects</span>
          </div>
          <h1>Research Projects</h1>
          <p className="rp-subtitle">Manage all research projects uploaded by your department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-rp" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Project
          </button>
        )}
      </div>

      <div className="rp-content">
        <div className="rp-list-section">
          <div className="rp-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Projects">
                  <option value="All Projects">All Projects</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>
              <button className="btn-filter-icon" type="button">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          <table className="rp-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ width: '25%' }}>Project Title</th>
                <th>Funding Agency</th>
                <th>Amount (₹)</th>
                <th>Period</th>
                <th>PI / Coordinator</th>
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Loading research projects...</td>
                </tr>
              )}
              {!isLoading && projects.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No research projects found.</td>
                </tr>
              )}
              {!isLoading && projects.map((proj, index) => (
                <tr key={proj.id}>
                  <td className="font-bold">{index + 1}</td>
                  <td className="font-medium text-dark rp-title-cell">{proj.title}</td>
                  <td className="text-muted">{proj.agency}</td>
                  <td className="text-muted">{typeof proj.amount === 'string' && proj.amount.trim() ? proj.amount : formatAmount(proj.rawAmount ?? proj.amount)}</td>
                  <td>
                    <div className="rp-period">
                      <span>{proj.periodStr}</span>
                      <span className="text-light-muted">{proj.duration}</span>
                    </div>
                  </td>
                  <td>
                    <div className="rp-pi">
                      <span className="font-medium text-dark">{proj.pi}</span>
                      <span className="text-light-muted">{proj.role}</span>
                    </div>
                  </td>
                  {user?.role !== 'admin' && (
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" type="button" onClick={() => setViewingProject(proj)}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="action-btn" type="button" onClick={() => handleEditClick(proj)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="action-btn delete-btn" type="button" onClick={() => handleDelete(proj.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  )}

                  {user?.role === 'admin' && (
                    <td>{proj.updated_by ?? 'N/A'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span className="pagination-text">Showing 1 to {projects.length} of {projects.length} entries</span>
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
          <div className="add-rp-section">
            <h2 className="form-title">{editingProject ? 'Edit Research Project' : 'Add New Research Project'}</h2>
            {error && (
              <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                {error}
              </div>
            )}
            <form className="rp-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input type="text" name="title" placeholder="Enter project title" value={formData.title} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Funding Agency <span className="required">*</span></label>
                <input type="text" name="funding_agency" placeholder="Enter funding agency" value={formData.funding_agency} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Amount (₹) <span className="required">*</span></label>
                <input type="number" name="amount" placeholder="Enter amount" value={formData.amount} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Period <span className="required">*</span></label>
                <div className="period-inputs">
                  <div className="date-input-wrap">
                    <input type="date" name="start_date" placeholder="Start Date" value={formData.start_date} onChange={handleInputChange} />
                  </div>
                  <span className="period-separator">-</span>
                  <div className="date-input-wrap">
                    <input type="date" name="end_date" placeholder="End Date" value={formData.end_date} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>PI / Co-PI / Coordinator (Add Name) <span className="required">*</span></label>
                <input type="text" name="coordinator_name" placeholder="Enter name" value={formData.coordinator_name} onChange={handleInputChange} />
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>Sanctioned Letter (PDF) <span className="required">*</span></label>
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <input type="file" hidden ref={fileInputRef} accept="application/pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  {selectedFile ? (
                    <div style={{ padding: '8px 0', color: '#4f46e5', fontWeight: '600', fontSize: '13px' }}>
                      <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#dc2626' }} />
                      {selectedFile.name}
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                      <p>Click to upload <span>or drag and drop</span></p>
                      <span className="upload-hint">PDF files only. Max size: 10MB</span>
                    </>
                  )}
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={isSaving}>{isSaving ? 'Saving...' : (editingProject ? 'Update Project' : 'Save Project')}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {viewingProject && (
        <div className="modal-overlay" onClick={() => setViewingProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project Details</h2>
              <button className="btn-close-modal" onClick={() => setViewingProject(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-details-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Sanctioned Letter</span>
                  <span className="detail-value">
                    <a href={viewingProject.sanctionedLetterUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline' }}>
                      <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#dc2626' }} />
                      {viewingProject.sanctionedLetter || 'No File'}
                    </a>
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Project Title</span>
                  <span className="detail-value font-medium text-dark">{viewingProject.title}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Funding Agency</span>
                  <span className="detail-value">{viewingProject.agency}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value">{viewingProject.amount}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Period</span>
                  <span className="detail-value">{viewingProject.periodStr} <span className="text-light-muted">{viewingProject.duration}</span></span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">PI / Coordinator</span>
                  <span className="detail-value">{viewingProject.pi} <span className="text-light-muted">{viewingProject.role}</span></span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setViewingProject(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchProject;
