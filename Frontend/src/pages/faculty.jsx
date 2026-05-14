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
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../store/authStore';
import './faculty.css';

const Faculty = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [viewingFaculty, setViewingFaculty] = useState(null);

  const initialData = [
    { id: 1, name: 'Dr. Suresh Chandra Dash', designation: 'Professor & HOD', email: 'scdash@uu.ac.in', phone: '94370 12345', image: 'https://randomuser.me/api/portraits/men/41.jpg' },
    { id: 2, name: 'Dr. Priyanka Mohanty', designation: 'Associate Professor', email: 'priyanka@uu.ac.in', phone: '94370 23456', image: 'https://randomuser.me/api/portraits/women/42.jpg' },
    { id: 3, name: 'Dr. Ranjan K. Panigrahi', designation: 'Associate Professor', email: 'rpanigrahi@uu.ac.in', phone: '94370 34567', image: 'https://randomuser.me/api/portraits/men/43.jpg' },
    { id: 4, name: 'Dr. Sunita Patra', designation: 'Assistant Professor', email: 'spatra@uu.ac.in', phone: '94370 45678', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 5, name: 'Dr. Debasis Samantaray', designation: 'Assistant Professor', email: 'dsamantaray@uu.ac.in', phone: '94370 56789', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { id: 6, name: 'Dr. Ajit Kumar Behera', designation: 'Assistant Professor', email: 'ajit.behera@uu.ac.in', phone: '94370 67890', image: 'https://randomuser.me/api/portraits/men/46.jpg' },
    { id: 7, name: 'Dr. Madhusmita Kar', designation: 'Assistant Professor', email: 'mkar@uu.ac.in', phone: '94370 78901', image: 'https://randomuser.me/api/portraits/women/47.jpg' },
    { id: 8, name: 'Dr. Bikash R. Nayak', designation: 'Assistant Professor', email: 'brnayak@uu.ac.in', phone: '94370 89012', image: 'https://randomuser.me/api/portraits/men/48.jpg' },
  ];

  const [faculties, setFaculties] = useState(initialData);

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleDelete = (id) => {
    setFaculties(faculties.filter(f => f.id !== id));
    if (editingFaculty && editingFaculty.id === id) {
      setEditingFaculty(null);
    }
  };

  const handleEditClick = (fac) => {
    setEditingFaculty(fac);
  };

  const handleAddNewClick = () => {
    setEditingFaculty(null);
  };

  const handleViewClick = (fac) => {
    setViewingFaculty(fac);
  };

  const closeModal = () => {
    setViewingFaculty(null);
  };

  return (
    <div className="faculty-page">
      <div className="faculty-header">
        <div className="faculty-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Faculty</span>
          </div>
          <h1>Faculty</h1>
          <p className="faculty-subtitle">Manage all faculty members in the department.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-faculty" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Faculty
          </button>
        )}
      </div>

      <div className="faculty-content">

        {/* LEFT SIDE */}
        <div className="faculty-list-section">

          <div className="faculty-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />

              <input
                type="text"
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Designations">
                  <option>All Designations</option>
                  <option>Professor</option>
                  <option>Associate Professor</option>
                  <option>Assistant Professor</option>
                </select>
              </div>

              <button className="btn-filter-icon">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          <table className="faculty-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Email ID</th>
                <th>Phone Number</th>
                {user?.role !== 'admin' && (
                  <th>Actions</th>
                )}

                {user?.role === 'admin' && (
                  <th>Updated by</th>
                )}
              </tr>
            </thead>

            <tbody>
              {faculties.map((fac) => (
                <tr key={fac.id}>
                  <td>{fac.id}</td>

                  <td>
                    <img
                      src={fac.image}
                      alt={fac.name}
                      className="faculty-avatar"
                    />
                  </td>

                  <td className="font-medium text-dark">{fac.name}</td>
                  <td className="text-muted">{fac.designation}</td>
                  <td className="text-muted">{fac.email}</td>
                  <td className="text-muted">{fac.phone}</td>

                  {user?.role !== 'admin' && (
                    <td>
                      <div className="action-buttons">

                        <button
                          className="action-btn"
                          onClick={() => setViewingFaculty(fac)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>

                        <button
                          className="action-btn"
                          onClick={() => setEditingFaculty(fac)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(fac.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                      </div>
                    </td>
                  )}

                  {user?.role === 'admin' && (
                    <td>
                      <div className="updated-by-info">
                        {fac.updated_by ?? 'N/A'}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* VIEW DETAILS */}
          {viewingFaculty && (
            <div className="faculty-view-section">

              <div className="faculty-view-header">
                <h2>Faculty Details</h2>

                <button
                  className="btn-close-view"
                  onClick={() => setViewingFaculty(null)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="faculty-view-profile">

                <img
                  src={viewingFaculty.image}
                  alt={viewingFaculty.name}
                  className="faculty-view-image"
                />

                <div>
                  <h3>{viewingFaculty.name}</h3>
                  <p>{viewingFaculty.designation}</p>
                </div>
              </div>

              <div className="faculty-view-grid">

                <div className="view-item">
                  <span>Email</span>
                  <p>{viewingFaculty.email}</p>
                </div>

                <div className="view-item">
                  <span>Phone</span>
                  <p>{viewingFaculty.phone}</p>
                </div>

                <div className="view-item">
                  <span>Qualification</span>
                  <p>Ph.D. in Computer Science</p>
                </div>

                <div className="view-item">
                  <span>Room No.</span>
                  <p>302</p>
                </div>

              </div>
            </div>
          )}

        </div>

        {user?.role !== 'admin' && (
          <div className="add-faculty-section">
            <h2 className="form-title">{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</h2>
            <form className="faculty-form">
              <div className="form-row">
                <div className="form-group half">
                  <label>Name <span className="required">*</span></label>
                  <input type="text" placeholder="Enter name" defaultValue={editingFaculty?.name || ''} />
                </div>
                <div className="form-group half">
                  <label>Designation <span className="required">*</span></label>
                  <input type="text" placeholder="Enter designation" defaultValue={editingFaculty?.designation || ''} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Email ID <span className="required">*</span></label>
                  <input type="email" placeholder="Enter email id" defaultValue={editingFaculty?.email || ''} />
                </div>
                <div className="form-group half">
                  <label>Phone Number <span className="required">*</span></label>
                  <input type="text" placeholder="Enter phone number" defaultValue={editingFaculty?.phone || ''} />
                </div>
              </div>

              <div className="form-group">
                <label>ORCID (Link)</label>
                <input type="text" placeholder="https://orcid.org/0000-0000-0000-0000" />
              </div>

              <div className="form-group">
                <label>Qualification <span className="required">*</span></label>
                <textarea placeholder="Enter qualification" rows="3"></textarea>
              </div>

              <div className="form-group">
                <label>Office Address <span className="required">*</span></label>
                <textarea placeholder="Enter office address" rows="2"></textarea>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Room No. <span className="required">*</span></label>
                  <input type="text" placeholder="Enter room number" />
                </div>
                <div className="form-group half">
                  <label>Webpage (Link)</label>
                  <input type="text" placeholder="https://example.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Image <span className="required">*</span></label>
                  <div className="upload-zone" onClick={() => imageInputRef.current.click()}>
                    <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                    <p>Click to upload <span>or drag and drop</span></p>
                    <span className="upload-hint">JPG, PNG (Max size: 2MB)</span>
                    <input type="file" hidden ref={imageInputRef} accept="image/jpeg, image/png" />
                  </div>
                </div>
                <div className="form-group half">
                  <label>Bio Sketch (PDF) <span className="required">*</span></label>
                  <div className="upload-zone" onClick={() => pdfInputRef.current.click()}>
                    <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                    <p>Click to upload <span>or drag and drop</span></p>
                    <span className="upload-hint">PDF (Max size: 5MB)</span>
                    <input type="file" hidden ref={pdfInputRef} accept="application/pdf" />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="button" className="btn-submit">{editingFaculty ? 'Update Faculty' : 'Save Faculty'}</button>
              </div>
            </form>
          </div>
        )}

      </div>

      {viewingFaculty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Faculty Details</h2>
              <button className="btn-close-modal" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-profile">
                <img src={viewingFaculty.image} alt={viewingFaculty.name} />
                <div className="modal-profile-info">
                  <h3>{viewingFaculty.name}</h3>
                  <p className="designation">{viewingFaculty.designation}</p>
                </div>
              </div>
              <div className="modal-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Email ID</span>
                  <span className="detail-value">{viewingFaculty.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">{viewingFaculty.phone}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">ORCID</span>
                  <span className="detail-value text-link">https://orcid.org/0000-0002-1825-0097</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Qualification</span>
                  <span className="detail-value">Ph.D. in Computer Science, M.Tech</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Office Address</span>
                  <span className="detail-value">Department of Computer Science, Utkal University, Bhubaneswar, Odisha 751004</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Room No.</span>
                  <span className="detail-value">302, 3rd Floor</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Webpage</span>
                  <span className="detail-value text-link">https://uu.ac.in/faculty/{viewingFaculty.id}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Faculty;
