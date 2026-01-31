import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { userService } from '../services/user/index.js';
import '../assets/styles/cmps/Search.css';

export function Search({ onClose, onUserSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            searchUsers();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const searchUsers = async () => {
        try {
            setIsLoading(true);
            const users = await userService.getUsers();
            const filtered = users.filter(user =>
                (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) && user._id !== userService.getLoggedinUser()?._id
            );
            setSearchResults(filtered);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserClick = (user) => {
        // Add to recent searches
        const updated = [user, ...recentSearches.filter(u => u._id !== user._id)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));

        if (onUserSelect) {
            // console.log('Selecting user from Search:', user);
            onUserSelect(user);
            // console.log('Closing Search after user selection');
            // onClose();
        } else {
            // Navigate to user profile
            navigate(`/user/${user._id}`);
            onClose();
        }

    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
    };

    const clearAllRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const removeFromRecent = (userId) => {
        const updated = recentSearches.filter(u => u._id !== userId);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    return (
        <div className="search-panel">
            <div className="search-panel-content">
                {/* Header */}
                <div className="search-header">
                    <h2 className="search-title">Search</h2>
                    <button className="search-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Search Input */}
                <div className="search-input-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="search-clear-btn" onClick={clearSearch}>
                            <svg aria-label="Clear" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
                                <path d="M13.414 12l5.793-5.793a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 0 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414z"></path>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="search-divider"></div>

                {/* Results or Recent */}
                {searchTerm ? (
                    <div className="search-results">
                        {isLoading ? (
                            <div className="search-loading">Searching...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(user => (
                                <div key={user._id} className="search-result-item" onClick={() => handleUserClick(user)}>
                                    <img src={user.imgUrl} alt={user.username} className="search-result-img" />
                                    <div className="search-result-info">
                                        <div className="search-result-username">{user.username}</div>
                                        <div className="search-result-fullname">{user.fullname}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="search-no-results">No results found.</div>
                        )}
                    </div>
                ) : (
                    <div className="search-recent">
                        <div className="search-recent-header">
                            <h3 className="search-recent-title">Recent</h3>
                            {recentSearches.length > 0 && (
                                <button className="search-clear-all-btn" onClick={clearAllRecent}>Clear all</button>
                            )}
                        </div>
                        {recentSearches.length > 0 ? (
                            <div className="search-recent-list">
                                {recentSearches.map(user => (
                                    <div key={user._id} className="search-recent-item">
                                        <div className="search-recent-content" onClick={() => handleUserClick(user)}>
                                            <img src={user.imgUrl} alt={user.username} className="search-recent-img" />
                                            <div className="search-recent-info">
                                                <div className="search-recent-username">{user.username}</div>
                                                <div className="search-recent-fullname">{user.fullname}</div>
                                            </div>
                                        </div>
                                        <button
                                            className="search-recent-remove"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromRecent(user._id);
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="search-no-recent">No recent searches.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
