import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux'

import { userService } from '../services/user/index.js';
import { Search } from './Search.jsx';
import { SearchUsers } from './SearchUsers.jsx';
// import { send } from 'vite';

// import { socketService } from '../services/socket.service.js';

// import React, { useState, useEffect, useRef } from 'react'


import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_REVIEW_REMOVED } from '../services/socket.service'



export function MessagesUser({ onClose }) {
    const [selectedUser, setSelectedUser] = useState(null);
    // console.log('selectedUser:', selectedUser);
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    // console.log('MessagesUser loggedInUser:', loggedInUser);
    // console.log('talking to user:', selectedUser);

    const containerRef = useRef(null)
    const messagesEndRef = useRef(null)



    {/* Chat state */ }
    const [msg, setMsg] = useState({ txt: '' });
    const [msgs, setMsgs] = useState([]);
    const [deleteMsgId, setDeleteMsgId] = useState(null);

    const botTimeoutRef = useRef();

    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg);
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg);
            botTimeoutRef.current && clearTimeout(botTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        }

        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, msgs]);


    function addMsg(newMsg) {
        setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
    }

    function sendMsg(ev) {
        console.log('Sending message to:', selectedUser);
        ev.preventDefault();
        const from = loggedInUser?.fullname || 'Me';
        const newMsg = { from, to: selectedUser._id, txt: msg.txt };
        socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg);
        setMsg({ txt: '' });
    }

    function onDeleteMessage(idx) {
        console.log('Deleting message at index:', idx);
        const updatedMsgs = msgs.filter((_, i) => i !== idx);
        setMsgs(updatedMsgs);

        socketService.emit(SOCKET_EVENT_REVIEW_REMOVED, { idx, to: selectedUser._id });

    }

    function handleFormChange(ev) {
        const { name, value } = ev.target;
        setMsg((prevMsg) => ({ ...prevMsg, [name]: value }));
    }

    return (
        <div className="messages-container" ref={containerRef}>

            {/* search user */}
            <div className="select-users-container">
                <div className="logged-in-user-profile">
                    <img src={loggedInUser.imgUrl} alt={loggedInUser.fullname} />
                    <p>{loggedInUser.fullname}</p>
                </div>
                <div>
                    <SearchUsers onUserSelect={setSelectedUser} />
                </div>
            </div>
            {/* chat area */}
            {selectedUser && (
                <div className="chat-section">
                    <div className="chat-header">
                        {<img src={selectedUser.imgUrl} alt={selectedUser.fullname} />} {selectedUser.fullname} (@{selectedUser.username})
                    </div>

                    <ul className="chat-messages">
                        {msgs.map((msg, idx) => (
                            <li key={idx} className="message-item">
                                {msg.from === loggedInUser.fullname && (
                                    <button className='more-message-btn' onClick={() => onDeleteMessage(idx)}>...</button>
                                )}
                                <span className="message-text">{msg.txt}</span>
                            </li>
                        ))}
                        <div ref={messagesEndRef} />
                    </ul>

                    {/* Here you can integrate the ChatApp component or any chat UI */}
                    <form className="chat-input-wrapper" onSubmit={sendMsg}>
                        <input
                            type="text"
                            name="txt"
                            value={msg.txt}
                            onChange={handleFormChange}
                            placeholder="Message..."
                            autoComplete='off'
                        />
                        <button type="submit">Send</button>
                    </form>

                </div>
            )}

            {/* <div className="messages-overlay" onClick={onClose}>
                <div className="messages-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-messages-btn" onClick={onClose}>✕</button>
                </div>
            </div> */}
            {/* <button className="close-messages-btn" onClick={onClose}>Close</button> */}
        </div>
    )
}