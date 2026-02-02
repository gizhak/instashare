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


import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EMIT_DELETE_MSG, SOCKET_EVENT_MSG_DELETED } from '../services/socket.service'



export function MessagesUser({ onClose, unreadFrom = [], clearUnreadFrom }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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

    // Check if mobile on resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        socketService.on(SOCKET_EVENT_MSG_DELETED, handleMsgDeleted);
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg);
            socketService.off(SOCKET_EVENT_MSG_DELETED, handleMsgDeleted);
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
        if (!currentSelectedUser) {
            // No chat open, just reload conversations to show new message indicator
            loadConversations();
            return;
        }

        // Check if this message is part of the current conversation
        // Message is relevant if it's between the logged-in user and the selected user
        const isRelevant =
            (newMsg.fromUserId === currentSelectedUser._id && newMsg.toUserId === loggedInUser._id) ||
            (newMsg.fromUserId === loggedInUser._id && newMsg.toUserId === currentSelectedUser._id) ||
            (newMsg.toUserId === currentSelectedUser._id && newMsg.fromUserId === loggedInUser._id) ||
            (newMsg.toUserId === loggedInUser._id && newMsg.fromUserId === currentSelectedUser._id);

        if (!isRelevant) {
            // Message is for a different conversation, just reload conversations list
            loadConversations();
            return;
        }

        setMsgs((prevMsgs) => {
            // Avoid duplicates by checking _id
            if (newMsg._id && prevMsgs.some(m => m._id === newMsg._id)) {
                return prevMsgs;
            }
            return [...prevMsgs, newMsg];
        });

        // Also reload conversations to update "last message" in the list
        loadConversations();
    }

    function handleMsgDeleted({ messageId }) {
        console.log('Message deleted:', messageId);
        setMsgs((prevMsgs) => prevMsgs.filter(m => m._id !== messageId));
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
        const messageToDelete = msgs[idx];
        if (!messageToDelete || !messageToDelete._id) {
            console.error('Cannot delete message - no ID found');
            return;
        }

        // Remove locally
        const updatedMsgs = msgs.filter((_, i) => i !== idx);
        setMsgs(updatedMsgs);

        // Notify other user via socket
        socketService.emit(SOCKET_EMIT_DELETE_MSG, {
            messageId: messageToDelete._id,
            toUserId: selectedUser._id
        });
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
        console.log('handleSelectConversation with:', convo);
        // Create a user object from conversation data
        const user = {
            _id: convo.otherUserId,
            fullname: convo.otherFullname,
            username: convo.username,
            imgUrl: convo.imgUrl || '/img/default-user.png'
        };
        console.log('Setting selectedUser to:', user);
        setSelectedUser(user);
    }

    function handleBackToList() {
        setSelectedUser(null);
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
            <div className={`select-users-container ${isMobile && selectedUser ? 'hide-on-mobile' : ''}`}>
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
                <div className={`chat-section ${selectedUser ? 'has-selected-user' : ''}`}>
                    <div className="chat-header">
                        <div className="chat-header-info">
                            {isMobile && (
                                <button className="back-button-mobile" onClick={handleBackToList}>
                                    ←
                                </button>
                            )}
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
                            inputMode="text"
                            enterKeyHint="send"
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