import { useEffect, useState } from 'react';
import './login.css';
import logo from '../assets/image/logo-uu.png';
import securityImg from '../assets/image/security.png';
import { getDepartments, login as loginApi } from '../../utils/api';

function Login() {
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginApi({
        // department_id: Number(departmentId),
        email,
        password,
      });
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="login-inner-container">

        {/* LEFT SECTION */}
        <div className="login-left-section">
          <div className="content-section">

            {/* BRAND */}
            <div className="brand">
              <img src={logo} alt="Logo" />
              <div className="brand-text">
                <h2>UtkalAdmin</h2>
                <p>Utkal University • Administration Portal</p>
              </div>
            </div>

            <div className="other-content">

              {/* HERO */}
              <h1 className="hero-title">
                Monitor. Manage.<br />
                Stay Informed.
              </h1>

              <p className="hero-description">
                A unified admin platform for tracking department-wise
                website activity, content freshness, alerts, and
                performance across the entire university digital
                ecosystem.
              </p>

              {/* STATS */}
              <div className="stats-wrapper">

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h3>65+</h3>
                  <h5>Departments</h5>
                  <p>Connected across the university</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <h3>1,248</h3>
                  <h5>Updates</h5>
                  <p>Website and content updates tracked</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <h3>94%</h3>
                  <h5>Activity</h5>
                  <p>Average performance across departments</p>
                </div>

              </div>

              {/* SECURITY */}
              <div className="secure-box">
                <div className="secure-icon">
                  <img src={securityImg} alt="Security" />
                </div>
                <div className="secure-text">
                  <h4>Secure. Reliable. Always Accessible.</h4>
                  <p>Your trusted platform for efficient university administration.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="login-right-section">
          <div className="login-card">
            <h1>Welcome back 👋</h1>
            <p className="subtitle">
              Sign in to your admin account to continue.
            </p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  padding: '10px 12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px'
                }}>
                  {error}
                </div>
              )}

              {/* Department */}
              {/* <label className="form-label">Department</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-building-columns"></i>
                  </span>
                  <select
                    className="form-select"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    disabled={isDepartmentsLoading}
                    required
                  >
                    <option value="" disabled>
                      {isDepartmentsLoading ? 'Loading departments...' : 'Select your department'}
                    </option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div> */}

              {/* Email */}
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@utkal.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-eye"
                  onClick={() => setShowPass(!showPass)}
                >
                  <i className={showPass ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
                </button>
              </div>

              {/* OPTIONS */}
              <div className="options">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <a href="#" className="forgot">
                  Forgot password?
                </a>
              </div>

              {/* BUTTON */}
              <button type="submit" className="login-btn" disabled={isLoading || isDepartmentsLoading}>
                {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                {!isLoading && <i className="fa-solid fa-arrow-right"></i>}
              </button>
            </form>

            {/* FOOTER */}
            <div className="footer-text">
              © 2026 Utkal University • All rights reserved.<br />
              Authorized access only. Unauthorized use is prohibited.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
