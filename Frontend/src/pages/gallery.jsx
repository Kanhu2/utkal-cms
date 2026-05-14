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
  faCalendarAlt,
  faCloudUploadAlt,
  faTimes,
  faInfoCircle,
  faGripVertical,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../store/authStore';
import './gallery.css';

const Gallery = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [photoInputs, setPhotoInputs] = useState([1, 2, 3, 4, 5]); // Starting with 5 slots to match design

  const initialData = [
    { id: 1, title: 'Industrial Visit to TCS Bhubaneswar', date: 'Feb 05, 2025', count: '20', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Guest Lecture on Cloud Computing', date: 'Jan 20, 2025', count: '17', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Department Annual Day 2024', date: 'Dec 18, 2024', count: '30', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Department Sports Meet 2024', date: 'Nov 25, 2024', count: '15', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80' },
    { id: 5, title: 'International Conference on AI & ML', date: 'May 20, 2024', count: '18', image: 'https://images.unsplash.com/photo-1427504494785-319ce51d8c98?auto=format&fit=crop&w=400&q=80' },
    { id: 6, title: 'Workshop on Data Science Tools', date: 'Apr 15, 2024', count: '24', image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80' },
    { id: 7, title: 'Faculty Achievement Awards 2024', date: 'Mar 10, 2024', count: '16', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80' },
    { id: 8, title: 'Student Hackathon 2024', date: 'Feb 28, 2024', count: '22', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80' },
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

  const addPhotoInput = () => {
    setPhotoInputs([...photoInputs, Date.now()]);
  };

  const removePhotoInput = (indexToRemove) => {
    setPhotoInputs(photoInputs.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="gallery-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Photo Gallery</span>
          </div>
          <h1>Photo Gallery</h1>
          <p className="gallery-subtitle">Manage all photos and albums in the department gallery.</p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-add-gallery" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Photo Gallery
          </button>
        )}
      </div>

      <div className="gallery-content">
        <div className="gallery-list-section">
          <div className="gallery-list-header">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <div className="filter-box">
                <select defaultValue="All Albums">
                  <option value="All Albums">All Albums</option>
                  <option value="Recent">Recent</option>
                  <option value="Oldest">Oldest</option>
                </select>
              </div>
              <button className="btn-filter-icon" type="button">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          <div className="gallery-grid">
            {items.map((item) => (
              <div className="gallery-card" key={item.id}>
                <div className="gallery-card-image">
                  <img src={item.image} alt={item.title} />
                  <span className="photo-count-badge">{item.count} Photos</span>
                </div>
                <div className="gallery-card-content">
                  <h3 className="gallery-card-title">{item.title}</h3>
                  <div className="gallery-card-date">
                    <FontAwesomeIcon icon={faCalendarAlt} /> {item.date}
                  </div>
                </div>
                <div className="gallery-card-actions">
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
              </div>
            ))}
          </div>

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
          <div className="add-gallery-section">
            <h2 className="form-title">{editingItem ? 'Edit Photo Gallery' : 'Add New Photo Gallery'}</h2>
            <form className="gallery-form">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input type="text" placeholder="Enter gallery title" defaultValue={editingItem?.title || ''} />
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label>Display Image <span className="required">*</span></label>
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
                  <p>Click to upload <span>or drag and drop</span></p>
                  <span className="upload-hint">JPG, PNG, WEBP (Max size: 2MB)</span>
                  <input type="file" hidden ref={fileInputRef} accept=".jpg,.jpeg,.png,.webp" />
                </div>
                <p className="field-help-text">This image will be shown as cover.</p>
              </div>

              <div className="form-group" style={{ marginTop: '8px' }}>
                <label>Gallery Photos <span className="required">*</span></label>

                <div className="info-banner">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  <span>Upload multiple photos for this gallery. You can add, remove or reorder photos.</span>
                </div>

                <div className="photo-list-container">
                  <label className="sub-label">Photos</label>
                  <div className="photo-list">
                    {photoInputs.map((key, index) => (
                      <div className="photo-list-item" key={key}>
                        <FontAwesomeIcon icon={faGripVertical} className="drag-handle" />
                        <FontAwesomeIcon icon={faImage} className="item-icon" />
                        <div className="file-input-wrapper">
                          <span className="file-name">No file chosen</span>
                          <button type="button" className="btn-choose-file">Choose File</button>
                        </div>
                        <button type="button" className="btn-remove-item" onClick={() => removePhotoInput(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button type="button" className="btn-add-more" onClick={addPhotoInput}>
                    <FontAwesomeIcon icon={faPlus} /> Add More Photos
                  </button>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '16px' }}>
                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                <button type="button" className="btn-submit">{editingItem ? 'Update Gallery' : 'Save Gallery'}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {viewingItem && (
        <div className="modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Photo Gallery Details</h2>
              <button className="btn-close-modal" onClick={() => setViewingItem(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-details-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Title</span>
                  <span className="detail-value font-medium text-dark">{viewingItem.title}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date Created</span>
                  <span className="detail-value">{viewingItem.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Photos</span>
                  <span className="detail-value">{viewingItem.count}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Cover Image</span>
                  <img src={viewingItem.image} alt={viewingItem.title} style={{ width: '100%', borderRadius: '5px', marginTop: '8px' }} />
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

export default Gallery;
