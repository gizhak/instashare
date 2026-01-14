import { Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'



export function LoginSignup() {
    return (
        <div className="login-page">
            <nav>
                <NavLink to="login">Login</NavLink>
                <NavLink to="signup">Signup</NavLink>
            </nav>
            <Outlet />
        </div>
    )
}

export function Login() {
    const [users, setUsers] = useState([])
    const [showRemoveModal, setShowRemoveModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onRemoveUser(userId) {
        console.log('Removing user with ID:', userId)
        await userService.remove(userId)
        loadUsers()
    }

    return (
        <div className="login-page">
            {/* Remove Account Modal */}
            {showRemoveModal && (
                <div className="modal-overlay" onClick={() => setShowRemoveModal(false)}>
                    <div className="remove-modal" onClick={(e) => e.stopPropagation()}>
                        <button className='close-btn' onClick={() => setShowRemoveModal(false)}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true" class="close-btn-icon">
                                <path d="M5.707 4.293a1 1 0 1 0-1.414 1.414L10.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414L12 13.414l6.293 6.293a1 1 0 0 0 1.414-1.414L13.414 12l6.293-6.293a1 1 0 1 0-1.414-1.414L12 10.586 5.707 4.293z"></path></svg>
                        </button>
                        <h2>Remove profiles from this browser</h2>

                        <div className="remove-users-list">
                            {users.map(user => (
                                <div key={user._id} className="remove-user-item">
                                    <img src={user.imgUrl} alt={user.fullname} />
                                    <div className="user-info">
                                        <span className="username">{user.fullname}</span>
                                        <span className="app-name">InstaShare</span>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => onRemoveUser(user._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <p className="learn-more">
                            <a href="#">Learn more</a> about why you see profiles here and what it means to remove them.
                        </p>
                    </div>
                </div>
            )}

            {/* Left Side - Hero Section */}
            <div className="login-hero">
                <div className="instagram-logo">
                    <svg aria-label="Instagram" fill="url(#instagram-gradient)" height="60" viewBox="0 0 24 24" width="60">
                        <defs>
                            <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FFDC80" />
                                <stop offset="50%" stopColor="#F56040" />
                                <stop offset="100%" stopColor="#C13584" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2.982c2.937 0 3.285.011 4.445.064 1.072.049 1.655.228 2.042.379.514.2.88.438 1.265.823.385.385.623.751.823 1.265.151.387.33.97.379 2.042.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445c-.049 1.072-.228 1.655-.379 2.042-.2.514-.438.88-.823 1.265a3.398 3.398 0 0 1-1.265.823c-.387.151-.97.33-2.042.379-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064c-1.072-.049-1.655-.228-2.042-.379a3.398 3.398 0 0 1-1.265-.823 3.398 3.398 0 0 1-.823-1.265c-.151-.387-.33-.97-.379-2.042-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445c.049-1.072.228-1.655.379-2.042.2-.514.438-.88.823-1.265a3.398 3.398 0 0 1 1.265-.823c.387-.151.97-.33 2.042-.379 1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066-1.171.054-1.97.24-2.67.512a5.391 5.391 0 0 0-1.949 1.268 5.391 5.391 0 0 0-1.268 1.949c-.272.7-.458 1.499-.512 2.67C1.013 8.638 1 9.013 1 12s.013 3.362.066 4.535c.054 1.171.24 1.97.512 2.67a5.391 5.391 0 0 0 1.268 1.949 5.391 5.391 0 0 0 1.949 1.268c.7.272 1.499.458 2.67.512C8.638 22.987 9.013 23 12 23s3.362-.013 4.535-.066c1.171-.054 1.97-.24 2.67-.512a5.391 5.391 0 0 0 1.949-1.268 5.391 5.391 0 0 0 1.268-1.949c.272-.7.458-1.499.512-2.67.053-1.173.066-1.548.066-4.535s-.013-3.362-.066-4.535c-.054-1.171-.24-1.97-.512-2.67a5.391 5.391 0 0 0-1.268-1.949 5.391 5.391 0 0 0-1.949-1.268c-.7-.272-1.499-.458-2.67-.512C15.362 1.013 14.987 1 12 1Zm0 5.351a5.649 5.649 0 1 0 0 11.298 5.649 5.649 0 0 0 0-11.298Zm0 9.316a3.667 3.667 0 1 1 0-7.334 3.667 3.667 0 0 1 0 7.334Zm7.192-9.539a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z" />
                    </svg>
                </div>
                <div className="hero-content">

                    <h1>See everyday moments from your <span className="highlight">close friends</span>.</h1>
                    <div className="hero-image">
                        {/* <img src="/img/login-hero.png" alt="Instagram preview" /> */}

                        <img alt="Instagram preview" referrerPolicy="origin-when-cross-origin" src="https://static.cdninstagram.com/rsrc.php/v4/yt/r/pAv7hjq-51n.png"></img>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-form">
                {/* Mobile Logo - only shows on mobile */}
                {/* <div className="mobile-logo">
                    <svg aria-label="Instagram" fill="url(#instagram-gradient-mobile)" height="60" viewBox="0 0 24 24" width="60">
                        <defs>
                            <linearGradient id="instagram-gradient-mobile" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FFDC80" />
                                <stop offset="50%" stopColor="#F56040" />
                                <stop offset="100%" stopColor="#C13584" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2.982c2.937 0 3.285.011 4.445.064 1.072.049 1.655.228 2.042.379.514.2.88.438 1.265.823.385.385.623.751.823 1.265.151.387.33.97.379 2.042.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445c-.049 1.072-.228 1.655-.379 2.042-.2.514-.438.88-.823 1.265a3.398 3.398 0 0 1-1.265.823c-.387.151-.97.33-2.042.379-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064c-1.072-.049-1.655-.228-2.042-.379a3.398 3.398 0 0 1-1.265-.823 3.398 3.398 0 0 1-.823-1.265c-.151-.387-.33-.97-.379-2.042-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445c.049-1.072.228-1.655.379-2.042.2-.514.438-.88.823-1.265a3.398 3.398 0 0 1 1.265-.823c.387-.151.97-.33 2.042-.379 1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066-1.171.054-1.97.24-2.67.512a5.391 5.391 0 0 0-1.949 1.268 5.391 5.391 0 0 0-1.268 1.949c-.272.7-.458 1.499-.512 2.67C1.013 8.638 1 9.013 1 12s.013 3.362.066 4.535c.054 1.171.24 1.97.512 2.67a5.391 5.391 0 0 0 1.268 1.949 5.391 5.391 0 0 0 1.949 1.268c.7.272 1.499.458 2.67.512C8.638 22.987 9.013 23 12 23s3.362-.013 4.535-.066c1.171-.054 1.97-.24 2.67-.512a5.391 5.391 0 0 0 1.949-1.268 5.391 5.391 0 0 0 1.268-1.949c.272-.7.458-1.499.512-2.67.053-1.173.066-1.548.066-4.535s-.013-3.362-.066-4.535c-.054-1.171-.24-1.97-.512-2.67a5.391 5.391 0 0 0-1.268-1.949 5.391 5.391 0 0 0-1.949-1.268c-.7-.272-1.499-.458-2.67-.512C15.362 1.013 14.987 1 12 1Zm0 5.351a5.649 5.649 0 1 0 0 11.298 5.649 5.649 0 0 0 0-11.298Zm0 9.316a3.667 3.667 0 1 1 0-7.334 3.667 3.667 0 0 1 0 7.334Zm7.192-9.539a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z" />
                    </svg>
                </div> */}
                <div className="login-header">
                    <h2>Log into InstaShare</h2>
                    <span className="settings-icon" onClick={() => setShowRemoveModal(true)}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true" class="x1lliihq x2lah0s x1k90msu x2h7rmj x1qfuztq x198g3q0 xxk0z11 xvy4d1p"><path fill-rule="evenodd" clip-rule="evenodd" d="m19.967 11.267 2.224-2.06a1 1 0 0 0 .187-1.233l-1.702-2.948a1 1 0 0 0-1.162-.455l-2.895.896a7.99 7.99 0 0 0-1.27-.735l-.672-2.954A1 1 0 0 0 13.702 1H10.3a1 1 0 0 0-.975.778l-.672 2.954a7.992 7.992 0 0 0-1.27.735L4.487 4.57a1 1 0 0 0-1.162.455L1.623 7.974a1 1 0 0 0 .187 1.233l2.224 2.06a8.1 8.1 0 0 0 0 1.466l-2.224 2.06a1 1 0 0 0-.187 1.233l1.702 2.948a1 1 0 0 0 1.162.455l2.895-.896a8 8 0 0 0 1.27.735l.672 2.954a1 1 0 0 0 .975.778h3.403a1 1 0 0 0 .975-.778l.672-2.954a7.991 7.991 0 0 0 1.27-.735l2.895.896a1 1 0 0 0 1.162-.455l1.702-2.948a1 1 0 0 0-.187-1.233l-2.224-2.06a8.112 8.112 0 0 0 0-1.466zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>
                    </span>
                </div>

                <div className="users-list">
                    {users.map(user => (
                        <div
                            key={user._id}
                            className="user-login-item"
                            onClick={async () => {
                                await login({ username: user.username })
                                navigate('/')
                            }}
                        >
                            <img src={user.imgUrl} alt={user.fullname} />
                            <span>{user.fullname}</span>
                            <span className="arrow">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true" class="x1lliihq x2lah0s x1k90msu x2h7rmj x1qfuztq x198g3q0 xlup9mm x1kky2od"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.247 4.341a1 1 0 0 1 1.412-.094l8 7a1 1 0 0 1 0 1.506l-8 7a1 1 0 0 1-1.318-1.506L14.482 12l-7.14-6.247a1 1 0 0 1-.094-1.412z"></path></svg>
                            </span>
                        </div>
                    ))}
                </div>

                <button className="use-another-btn">
                    Use another profile
                </button>

                <NavLink to="/auth/signup" className="create-account-btn">
                    Create new account
                </NavLink>

                <div className="meta-logo">
                    <span className="meta-text">ⵔ Meta</span>
                </div>
            </div>

            {/* Footer */}
            <footer className="login-footer">
                <div className="footer-links">
                    <a href="#">Meta</a>
                    <a href="#">About</a>
                    <a href="#">Blog</a>
                    <a href="#">Jobs</a>
                    <a href="#">Help</a>
                    <a href="#">API</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
                <div className="footer-copyright">
                    © 2026 InstaShare from Meta
                </div>
            </footer>
        </div>
    )
}

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <div className="signup-page">
            <form className="signup-form" onSubmit={onSignup}>
                <div className="signup-container">
                    <NavLink to="/auth/login" className="back-btn">&lt;</NavLink>

                    <div className="meta-logo-signup">
                        <span className="meta-text">ⵔ Meta</span>
                    </div>

                    <h2>Get started on InstaShare</h2>
                    <p className="subtitle">Sign up to see photos and videos from your friends.</p>

                    {/* Mobile or Email */}
                    <label className="input-label">Mobile number or email</label>
                    <input
                        type="text"
                        name="mobileOrEmail"
                        value={credentials.mobileOrEmail || ''}
                        placeholder="Mobile number or email"
                        onChange={handleChange}
                        required
                    />
                    <p className="input-note">You may receive notifications from us. <a href="#">Learn why we ask for your contact information</a></p>

                    {/* Password */}
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    {/* Birthday */}
                    <label className="input-label">Birthday <span className="info-icon">ⓘ</span></label>
                    <div className="birthday-selects">
                        <select name="birthMonth" onChange={handleChange} defaultValue="">
                            <option value="" disabled>Month</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                        <select name="birthDay" onChange={handleChange} defaultValue="">
                            <option value="" disabled>Day</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select name="birthYear" onChange={handleChange} defaultValue="">
                            <option value="" disabled>Year</option>
                            {[...Array(100)].map((_, i) => (
                                <option key={2024 - i} value={2024 - i}>{2024 - i}</option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <label className="input-label">Name</label>
                    <input
                        type="text"
                        name="fullname"
                        value={credentials.fullname}
                        placeholder="Full name"
                        onChange={handleChange}
                        required
                    />

                    {/* Username */}
                    <label className="input-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />

                    {/* Legal text */}
                    <p className="legal-text">
                        People who use our service may have uploaded your contact information to InstaShare. <a href="#">Learn more</a>.
                    </p>
                    <p className="legal-text">
                        By tapping Submit, you agree to create an account and to InstaShare's <a href="#">Terms</a>, <a href="#">Privacy Policy</a> and <a href="#">Cookies Policy</a>.
                    </p>

                    {/* Submit Button */}
                    <button type="submit" className="submit-btn">Submit</button>

                    {/* Already have account */}
                    <NavLink to="/auth/login" className="login-link">I already have an account</NavLink>
                </div>
            </form>
        </div>
    )
}