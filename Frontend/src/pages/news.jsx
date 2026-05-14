import { useEffect, useState, useRef } from 'react';
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
    faFilePdf,
    faLink
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { createNewsEvent, getNewsEvents } from '../../utils/api';
import { useAuthStore } from '../store/authStore';
import './news.css';

const getFileName = (path) => path?.split('/').pop() || '';

const mapNewsEvent = (item) => ({
    id: item.id,
    departmentId: item.department_id,
    title: item.title,
    date: item.create_date,
    updatedAt: item.updated_at,
    status: Number(item.preview) === 0 ? 'Appr. Pending' : 'Published',
    image: item.image_url,
    imageName: getFileName(item.image),
    file: item.file,
    fileUrl: item.file_url,
    fileName: item.file ? getFileName(item.file) : '',
    link: item.link || '',
    userName: item.user_name || '',
});

const News = () => {
    const user = useAuthStore((state) => state.user);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        link: '',
    });
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        const loadNewsEvents = async () => {
            setIsLoading(true);
            setError('');

            try {
                const data = await getNewsEvents();
                setItems(data.map(mapNewsEvent));
            } catch (err) {
                const validationErrors = err.data?.errors;
                const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
                setError(firstError || err.data?.message || err.message || 'Unable to load news & events.');
            } finally {
                setIsLoading(false);
            }
        };

        loadNewsEvents();
    }, []);

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
        if (editingItem && editingItem.id === id) {
            setEditingItem(null);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setSelectedFile(null);
        setSelectedImage(null);
        setError('');
        setFormData({
            title: item.title,
            link: item.link || '',
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const handleAddNewClick = () => {
        setEditingItem(null);
        setSelectedFile(null);
        setSelectedImage(null);
        setError('');
        setFormData({ title: '', link: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
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

        if (selectedImage && selectedImage.size > 2 * 1024 * 1024) {
            setError('Image size must be 2MB or less.');
            return;
        }

        const payload = new FormData();
        payload.append('title', formData.title);

        if (formData.link) {
            payload.append('link', formData.link);
        }

        if (selectedFile) {
            payload.append('file', selectedFile);
        }

        if (selectedImage) {
            payload.append('image', selectedImage);
        }

        setIsSaving(true);

        try {
            const savedNewsEvent = await createNewsEvent(payload);
            setItems((current) => [mapNewsEvent(savedNewsEvent), ...current]);
            handleAddNewClick();

            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'News & event published successfully.',
                confirmButtonText: 'OK',
            });
        } catch (err) {
            const validationErrors = err.data?.errors;
            const firstError = validationErrors ? Object.values(validationErrors).flat()[0] : null;

            const rawMessage = err.data?.message || err.message;
            const sanitizedMessage = typeof rawMessage === 'string'
                ? rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors\)\s*$/i, '')
                : rawMessage;

            const message = firstError || sanitizedMessage || 'Unable to save news & event.';
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="news-page">
            <div className="news-header">
                <div className="news-header-left">
                    <div className="breadcrumb">
                        <span className="breadcrumb-link">Dashboard</span>
                        <span className="breadcrumb-separator">&gt;</span>
                        <span className="breadcrumb-current">News & Event</span>
                    </div>
                    <h1>News & Event</h1>
                    <p className="news-subtitle">Manage all news & event published by your department.</p>
                </div>
                {user?.role !== 'admin' && (
                    <button className="btn-add-news" onClick={handleAddNewClick}>
                        <FontAwesomeIcon icon={faPlus} />
                        Add New News & Event
                    </button>
                )}
            </div>

            <div className="news-content">
                <div className="news-list-section">
                    <div className="news-list-header">
                        <div className="search-box">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search news..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <div className="filter-box">
                                <select defaultValue="All Status">
                                    <option value="All Status">All Status</option>
                                    <option value="Published">Published</option>
                                    <option value="Appr. Pending">Appr. Pending</option>
                                </select>
                            </div>
                            <button className="btn-filter-icon" type="button">
                                <FontAwesomeIcon icon={faFilter} />
                            </button>
                        </div>
                    </div>

                    <table className="news-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th style={{ width: '45%' }}>Title</th>
                                <th>Published Date</th>
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
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>Loading news & events...</td>
                                </tr>
                            )}
                            {!isLoading && filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No news & events found.</td>
                                </tr>
                            )}
                            {!isLoading && filteredItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="font-bold">{index + 1}</td>
                                    <td>
                                        <div className="news-title-cell">
                                            {item.image ? (
                                                <img src={item.image} alt="Thumbnail" className="news-thumbnail" />
                                            ) : (
                                                <div className="news-thumbnail news-thumbnail-placeholder">N</div>
                                            )}
                                            <div className="news-title-info">
                                                <span className="news-title-text">{item.title}</span>
                                                {item.fileUrl ? (
                                                    <a href={item.fileUrl} className="news-desc-text news-attachment-link" target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faFilePdf} /> {item.fileName}
                                                    </a>
                                                ) : item.link ? (
                                                    <a href={item.link} className="news-desc-text news-attachment-link" target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faLink} /> {item.link}
                                                    </a>
                                                ) : (
                                                    <span className="news-desc-text">No attachment</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-muted">{item.date}</td>
                                    <td>
                                        <div className="status-cell">
                                            <span className={`status-dot ${item.status === 'Published' ? '' : 'pending'}`}></span>
                                            <span className={`status-text ${item.status === 'Published' ? '' : 'pending'}`}>{item.status}</span>
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
                                        <td>{item.updated_by || 'N/A'}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <span className="pagination-text">Showing {filteredItems.length} of {items.length} entries</span>
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
                    <div className="add-news-section">
                        <h2 className="form-title">{editingItem ? 'Edit News' : 'Add New News & Event'}</h2>
                        {error && (
                            <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
                                {error}
                            </div>
                        )}
                        <form className="news-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title <span className="required">*</span></label>
                                <input type="text" name="title" placeholder="Enter news title" value={formData.title} onChange={handleInputChange} />
                            </div>

                            <div className="form-group" style={{ marginTop: '4px' }}>
                                <label>File Attachment <span className="label-hint">(PDF, DOC, DOCX)</span></label>
                                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    />
                                    {selectedFile ? (
                                        <div className="selected-file">
                                            <FontAwesomeIcon icon={faFilePdf} />
                                            {selectedFile.name}
                                        </div>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faUpload} className="upload-icon-blue" />
                                            <p>Click to upload <span>or drag and drop</span></p>
                                            <span className="upload-hint">Max file size: 5MB</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '4px' }}>
                                <label>Link <span className="label-hint">(Optional)</span></label>
                                <input type="text" name="link" placeholder="https://example.com" value={formData.link} onChange={handleInputChange} />
                            </div>

                            <div className="form-group" style={{ marginTop: '4px' }}>
                                <label>News Image <span className="required">*</span></label>
                                <div className="upload-zone" onClick={() => imageInputRef.current.click()}>
                                    <input
                                        type="file"
                                        hidden
                                        ref={imageInputRef}
                                        accept=".jpg,.jpeg,.png,.svg"
                                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                                    />
                                    {selectedImage ? (
                                        <div className="selected-file">
                                            <FontAwesomeIcon icon={faUpload} />
                                            {selectedImage.name}
                                        </div>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faUpload} className="upload-icon-blue" />
                                            <p>Click to upload <span>or drag and drop</span></p>
                                            <span className="upload-hint">Recommended size: 1200x600px (Max 2MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions" style={{ marginTop: '24px' }}>
                                <button type="button" className="btn-cancel" onClick={handleAddNewClick}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : editingItem ? 'Update News' : 'Publish News'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {viewingItem && (
                <div className="modal-overlay" onClick={() => setViewingItem(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>News Details</h2>
                            <button className="btn-close-modal" onClick={() => setViewingItem(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-details-grid">
                                <div className="detail-item full-width">
                                    {viewingItem.image && (
                                        <img src={viewingItem.image} alt={viewingItem.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '5px', marginBottom: '16px' }} />
                                    )}
                                </div>
                                <div className="detail-item full-width">
                                    <span className="detail-label">Title</span>
                                    <span className="detail-value font-medium text-dark">{viewingItem.title}</span>
                                </div>
                                <div className="detail-item full-width">
                                    <span className="detail-label">Attachment</span>
                                    <span className="detail-value">
                                        {viewingItem.fileUrl ? (
                                            <a href={viewingItem.fileUrl} target="_blank" rel="noreferrer">
                                                <FontAwesomeIcon icon={faFilePdf} /> {viewingItem.fileName}
                                            </a>
                                        ) : viewingItem.link ? (
                                            <a href={viewingItem.link} target="_blank" rel="noreferrer">
                                                <FontAwesomeIcon icon={faLink} /> {viewingItem.link}
                                            </a>
                                        ) : (
                                            'No attachment'
                                        )}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Create Date</span>
                                    <span className="detail-value">{viewingItem.date}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Status</span>
                                    <span className={`detail-value ${viewingItem.status === 'Published' ? 'text-success' : 'text-pending'}`}>{viewingItem.status}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Updated By</span>
                                    <span className="detail-value">{viewingItem.userName || 'N/A'}</span>
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

export default News;
