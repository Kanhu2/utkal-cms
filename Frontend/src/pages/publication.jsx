import React, { useState } from 'react';
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
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { Editor } from '@tinymce/tinymce-react';
import { useAuthStore } from '../store/authStore';
import './publication.css';

const Publication = () => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingPub, setEditingPub] = useState(null);
  const [formData, setFormData] = useState({ content: '' });

  const initialData = [
    {
      id: 1,
      content: `
        <h4>Journal Publications</h4>
        <p>An Efficient Algorithm for Data Classification</p>
      `,
      date: 'May 20, 2025',
      status: 'Appr. Pending'
    },
    {
      id: 2,
      content: `
        <h4>Conference Publications</h4>
        <p>Deep Learning Approaches for Big Data Analytics</p>
      `,
      date: 'May 15, 2025',
      status: 'Appr. Pending'
    }
  ];

  const [publications, setPublications] = useState(initialData);

  const handleDelete = (id) => {
    setPublications(publications.filter((p) => p.id !== id));

    if (editingPub && editingPub.id === id) {
      setEditingPub(null);
      setFormData({ content: '' });
    }
  };

  const handlePublish = (id) => {
    setPublications((current) => current.map((pub) => (
      pub.id === id ? { ...pub, status: 'Published' } : pub
    )));
  };

  const handleEditClick = (pub) => {
    setEditingPub(pub);
    setFormData({
      content: pub.content
    });
  };

  const handleAddNewClick = () => {
    setEditingPub(null);
    setFormData({
      content: ''
    });
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  return (
    <div className="pub-page">

      {/* HEADER */}
      <div className="pub-header">
        <div className="pub-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Publication</span>
          </div>

          <h1>Publications</h1>

          <p className="pub-subtitle">
            Manage all publications added in the department.
          </p>
        </div>

        {user?.role !== 'admin' && (
          <button className="btn-add-pub" onClick={handleAddNewClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add New Publication
          </button>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="pub-content">

        {/* LEFT TABLE */}
        <div className="pub-list-section">

          <div className="pub-list-header">

            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />

              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">

              <div className="filter-box">
                <select defaultValue="All Years">
                  <option>All Years</option>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>

              <button className="btn-filter-icon">
                <FontAwesomeIcon icon={faFilter} />
              </button>

            </div>
          </div>

          {/* TABLE */}
          <table className="pub-table">
            <tbody>

              {publications.map((pub) => (
                <tr key={pub.id}>

                  <td className="col-id">
                    {pub.id}
                  </td>

                  <td
                    className="col-content-data"
                    dangerouslySetInnerHTML={{ __html: pub.content }}
                  />

                  <td className="col-date">
                    {pub.date}
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">

                        {/* <button className="action-btn">
                        <FontAwesomeIcon icon={faEye} />
                      </button> */}

                      {user?.role !== 'admin' && (
                        <button
                          className="action-btn"
                          onClick={() => handleEditClick(pub)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(pub.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

                      {user?.role === 'admin' && pub.status !== 'Published' && (
                        <button
                          className="action-btn"
                          onClick={() => handlePublish(pub.id)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}

                    </div>
                  </td>

                  <td>{pub.updated_by ?? 'N/A'}</td>

                </tr>
              ))}

            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">

            <span className="pagination-text">
              Showing 1 to {publications.length} of {publications.length} entries
            </span>

            <div className="pagination-controls">

              <div className="page-btn">
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>

              <div className="page-btn active">
                1
              </div>

              <div className="page-btn">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        {user?.role !== 'admin' && (
          <div className="add-pub-section">

            <h2 className="form-title">
              {editingPub ? 'Edit Publication' : 'Add New Publication'}
            </h2>

            <form>

              <div className="form-group">

                <label>
                  Content <span className="required">*</span>
                </label>

                <div className="editor-container">

                  <Editor
                    apiKey="your-api-key"
                    value={formData.content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 400,
                      menubar: false,
                      branding: false,

                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'table',
                        'code',
                        'help'
                      ],

                      toolbar:
                        'blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table | undo redo',

                      content_style:
                        'body { font-family:Inter,sans-serif; font-size:14px }'
                    }}
                  />

                </div>

                <p className="editor-hint">
                  Use the editor to add publication details.
                </p>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleAddNewClick}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn-submit"
                >
                  {editingPub ? 'Update Publication' : 'Save Publication'}
                </button>

              </div>

            </form>

          </div>
        )}
      </div>
    </div>
  );
};

export default Publication;
