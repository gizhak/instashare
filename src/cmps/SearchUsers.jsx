import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import { userService } from '../services/user/index.js';
import '../assets/styles/cmps/Search.css';

export function SearchUsers({ onUserSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const navigate = useNavigate();

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
        onUserSelect(user);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
    };
    return (
        <div className="search-users-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder="Find users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button className="search-clear-btn" onClick={clearSearch}>X</button>
                )}
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <ul className="search-results-list">
                    {searchResults.map(user => (
                        <li key={user._id} onClick={() => handleUserClick(user)}>
                            {<img src={user.imgUrl} alt={user.fullname} />} {user.fullname} (@{user.username})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}