import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux'

import { userService } from '../services/user/index.js';
import { messageService } from '../services/message/index.js';
import { Search } from './Search.jsx';
import { SearchUsers } from './SearchUsers.jsx';
// import { send } from 'vite';

// import { socketService } from '../services/socket.service.js';

// import React, { useState, useEffect, useRef } from 'react'


import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_REVIEW_REMOVED } from '../services/socket.service'



export function MessagesUser({ onClose, unreadFrom = [], clearUnreadFrom }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    const containerRef = useRef(null)
    const messagesEndRef = useRef(null)
    const selectedUserRef = useRef(null)

    // Chat state
    const [msg, setMsg] = useState({ txt: '' });
    const [msgs, setMsgs] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const botTimeoutRef = useRef();

    // Load conversations on mount
    useEffect(() => {
        loadConversations();
    }, []);

    async function loadConversations() {
        try {
            const convos = await messageService.getConversations();
            setConversations(convos);
        } catch (err) {
            console.error('Failed to load conversations:', err);
        }
    }

    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg);
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg);
            botTimeoutRef.current && clearTimeout(botTimeoutRef.current);
        };
    }, []);

    // Load chat history when user is selected
    useEffect(() => {
        selectedUserRef.current = selectedUser;
        if (!selectedUser) return;
        loadMessages();
        // Clear unread indicator when opening chat with this user
        if (clearUnreadFrom) {
            clearUnreadFrom(selectedUser._id);
        }
    }, [selectedUser]);

    async function loadMessages() {
        try {
            const messages = await messageService.getMessages(selectedUser._id);
            setMsgs(messages);
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    }

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
        // Only add messages that are part of current conversation
        const currentSelectedUser = selectedUserRef.current;
        if (!currentSelectedUser) return;
        const isRelevant =
            (newMsg.fromUserId === currentSelectedUser._id) ||
            (newMsg.toUserId === currentSelectedUser._id) ||
            (newMsg.to === currentSelectedUser._id);
        if (!isRelevant) return;

        setMsgs((prevMsgs) => {
            // Avoid duplicates by checking _id
            if (newMsg._id && prevMsgs.some(m => m._id === newMsg._id)) {
                return prevMsgs;
            }
            return [...prevMsgs, newMsg];
        });
    }

    function sendMsg(ev) {
        console.log('Sending message to:', selectedUser);
        ev.preventDefault();
        if (!msg.txt.trim()) return;
        const newMsg = {
            fromUserId: loggedInUser._id,
            from: loggedInUser?.fullname || 'Me',
            fromImgUrl: loggedInUser?.imgUrl,
            to: selectedUser._id,
            toFullname: selectedUser.fullname,
            toImgUrl: selectedUser.imgUrl,
            txt: msg.txt
        };
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

    async function handleDeleteChat() {
        if (!selectedUser) return;
        try {
            await messageService.deleteConversation(selectedUser._id);
            setMsgs([]);
            setShowDeleteConfirm(false);
            // Refresh conversations list
            loadConversations();
        } catch (err) {
            console.error('Failed to delete conversation:', err);
        }
    }

    function handleSelectConversation(convo) {
        // Create a user object from conversation data
        const user = {
            _id: convo.otherUserId,
            fullname: convo.otherFullname,
            username: convo.username,
            imgUrl: convo.imgUrl || '/img/default-user.png'
        };
        setSelectedUser(user);
    }

    // Auto-select user with unread messages when opening
    useEffect(() => {
        if (unreadFrom.length > 0 && conversations.length > 0 && !selectedUser) {
            const unreadConvo = conversations.find(c => unreadFrom.includes(c.otherUserId));
            if (unreadConvo) {
                handleSelectConversation(unreadConvo);
            }
        }
    }, [unreadFrom, conversations]);

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

                {/* Recent conversations */}
                {conversations.length > 0 && (
                    <div className="conversations-list">
                        <h4>Recent Chats</h4>
                        <ul>
                            {conversations.map(convo => (
                                <li
                                    key={convo.otherUserId}
                                    onClick={() => handleSelectConversation(convo)}
                                    className={selectedUser?._id === convo.otherUserId ? 'selected' : ''}
                                >
                                    <img
                                        src={convo.imgUrl || '/img/default-user.png'}
                                        alt={convo.otherFullname}
                                        className="convo-img"
                                    />
                                    <div className="convo-info">
                                        <span className="convo-name">{convo.otherFullname}</span>
                                        <span className="convo-preview">{convo.lastMessage?.substring(0, 20)}...</span>
                                    </div>
                                    {unreadFrom.includes(convo.otherUserId) && (
                                        <span className="unread-dot"></span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {/* chat area */}
            {selectedUser && (
                <div className="chat-section">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <img src={selectedUser.imgUrl} alt={selectedUser.fullname} />
                            <span>{selectedUser.fullname} {selectedUser.username && `(@${selectedUser.username})`}</span>
                        </div>
                        <button className="delete-chat-btn" onClick={() => setShowDeleteConfirm(true)}>
                            Delete Chat
                        </button>
                    </div>

                    {/* Delete confirmation modal */}
                    {showDeleteConfirm && (
                        <div className="delete-confirm-modal">
                            <div className="delete-confirm-content">
                                <p>Are you sure you want to delete this conversation?</p>
                                <p className="delete-warning">This action cannot be undone.</p>
                                <div className="delete-confirm-buttons">
                                    <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                    <button className="confirm-delete-btn" onClick={handleDeleteChat}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <ul className="chat-messages">
                        {msgs.map((msg, idx) => {
                            const isMyMsg = msg.fromUserId === loggedInUser._id || msg.from === loggedInUser.fullname;
                            return (
                                <li key={msg._id || idx} className={`message-item ${isMyMsg ? 'my-message' : 'other-message'}`}>
                                    {isMyMsg && (
                                        <button className='more-message-btn' onClick={() => onDeleteMessage(idx)}>...</button>
                                    )}
                                    <span className="message-text">{msg.txt}</span>
                                </li>
                            );
                        })}
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