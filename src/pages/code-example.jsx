// Decided to present dynamic modal - This implementation demonstrates a single, reusable Modal component that supports multiple presentation modes (menu, comments) 
// while keeping modal behavior centralized and consistent across the application.
// --------------------------------------------------

import React from 'react';
import { Route } from 'react-router-dom';
// --------------------------------------------------
// basic modal structure -  The base Modal component is responsible solely for:
// Managing visibility via an isOpen flag
// Providing a backdrop and close behavior
// Rendering variant-specific UI (X close button)
// It does not own business logic, routing logic, or post-specific behavior
// --------------------------------------------------

export function Modal({ isOpen, onClose, children, variant = 'menu' }) {
    if (!isOpen) return null;

    return (
        <>
            {variant === 'comments' && (
                <button className="close-btn-modal" onClick={onClose}>
                    ✕
                </button>
            )}
            <div className="backdrop" onClick={onClose} />
            <div className={`modal modal-${variant}`}>
                {children}
            </div>
        </>
    );
}

// --------------------------------------------------
// DEMO / REFERENCE FUNCTION
// exists only so JS below is syntactically valid
// --------------------------------------------------

function xxx() {
    return (
        <>
 {/*  menu-variant modal
 -The menu variant represents a contextual action modal, typically opened from an ellipsis or overflow menu on a post within any feed. This variant is responsible for presenting post-level actions */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                variant={modalType}
            >
                {modalType === 'menu' && selectedPost && (
                    <>
                        <div className="modal-item danger" onClick={() => handleReportPost(selectedPost.by)}>
                            Report
                        </div>

                        <div className="modal-item" onClick={() => { handleCloseModal(); handleOpenComments(selectedPost._id,selectedPostInde )}}>
                            Go to post
                        </div>

                        <div className="modal-item"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(
                                        `${window.location.origin}/post/${selectedPost._id}`
                                    );
                                    showGeneralMsg('Link copied to clipboard');
                                    handleCloseModal();
                                } catch (err) {
                                    console.error('Failed to copy link:', err);
                                }
                            }}
                        >
                            Copy link
                        </div>

                        <div className="modal-item" onClick={() => { navigate(`/user/${selectedPost.by._id}`);
                                handleCloseModal();
                            }}
                        >
                            About this account
                        </div>

                        <div className="modal-item cancel" onClick={handleCloseModal}>
                            Cancel
                        </div>
                    </>
                )}
            </Modal>

           
  {/* comments-variant / aka PostModal  is opened via routing, not local UI state.
    Multiple routes can resolve to the same modal presentation, enabling consistent post interaction behavior from different sections of the application (e.g. explore, user profile, feed).   */}
            <>
                 <Route path="post/:postId" element={<PostModal />} />
            
                <Route path="explore" element={<PostIndex />}>
                    <Route path="post/:postId" element={<PostModal />} />
                </Route>

                <Route path="user/:id" element={<UserDetails />}>
                    <Route path="post/:postId" element={<PostModal />} />
                </Route>
            </>


{/* At this stage, the PostDetailsContent component becomes the primary owner of modal behavior
    This component is responsible for: 
        Determining the visual layout of the post modal
        Managing loading, navigation, and interaction state
        Enabling all post-related actions within the modal context
*/}

            <Modal isOpen={true} onClose={handleCloseModal} variant="comments">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-dots">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                ) : (
                    selectedPost && (
                        <PostDetailsContent
                            post={selectedPost}
                            posts={contextPosts}
                            currentIndex={currentIndex}
                            onNavigate={handleNavigate}
                            onClose={handleCloseModal}
                        />
                    )
                )}
            </Modal>
        </>
    );
}

// --------------------------------------------------
// This structure emphasizes:
// Separation of concerns
// Reusability of modal infrastructure
// Clear ownership of state and behavior
// Flexibility in how and where modals are triggered
// The file intentionally presents multiple modal usages in one place to clarify relationships and architectural intent
// --------------------------------------------------

// intentional non-export usage
export const MODAL_DEMO_ONLY = xxx;
