import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faSave,
    faBuildingColumns,
    faEnvelope,
    faLock,
    faCheckSquare,
    faSquare,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { getDepartments, createUser } from '../../utils/api';
import './add-user.css';

const AddUser = ({ onClose }) => {
    const [departments, setDepartments] = useState([]);
    const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department_id: '',
        assigned_modules: []
    });

    const modules = [
        // 'notice',
        // 'tender',
        'events & news',
        'publication',
        'faculty',
        'ilms',
        'research project',
        'workshop/ seminar details',
        'achievements',
        'research scholars',
        'research supervisors',
        'photo gallery'
    ];

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const response = await getDepartments();
                setDepartments(response);
            } catch {
                setError('Unable to load departments. Please check the API server.');
            } finally {
                setIsDepartmentsLoading(false);
            }
        };

        loadDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleModuleToggle = (module) => {
        setFormData(prev => ({
            ...prev,
            assigned_modules: prev.assigned_modules.includes(module)
                ? prev.assigned_modules.filter(m => m !== module)
                : [...prev.assigned_modules, module]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await createUser(formData);
            setSuccess('User created successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                department_id: '',
                assigned_modules: []
            });
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Failed to create user. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="add-user-overlay">
            <div className="add-user-container">
                <div className="add-user-header">
                    <h2>Add New User</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="add-user-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <div className="input-group">
                                {/* <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span> */}
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-group">
                                {/* <span className="input-group-text">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span> */}
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="you@utkal.ac.in"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                {/* <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span> */}
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <div className="input-group">
                                {/* <span className="input-group-text">
                  <FontAwesomeIcon icon={faBuildingColumns} />
                </span> */}
                                <select
                                    name="department_id"
                                    className="form-select"
                                    value={formData.department_id}
                                    onChange={handleInputChange}
                                    disabled={isDepartmentsLoading}
                                    required
                                >
                                    <option value="" disabled>
                                        {isDepartmentsLoading ? 'Loading departments...' : 'Select department'}
                                    </option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Assigned Modules</label>
                        <div className="modules-grid">
                            {modules.map((module) => (
                                <div
                                    key={module}
                                    className={`module-checkbox ${formData.assigned_modules.includes(module) ? 'selected' : ''}`}
                                    onClick={() => handleModuleToggle(module)}
                                >
                                    <FontAwesomeIcon
                                        icon={formData.assigned_modules.includes(module) ? faCheckSquare : faSquare}
                                        className="checkbox-icon"
                                    />
                                    <span className="module-label">{module}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading || isDepartmentsLoading}>
                            <FontAwesomeIcon icon={faSave} className="btn-icon" />
                            {isLoading ? 'Creating User...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
