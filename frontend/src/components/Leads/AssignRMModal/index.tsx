import React, { useState, useEffect } from 'react';
import { userService, User } from '../../../services/user.service';
import './AssignRMModal.css';

interface AssignRMModalProps {
  onClose: () => void;
  onAssign: (userId: string) => void;
  onRemove: (userId: string) => void;
  assignedRMIds?: string[];
}

const AssignRMModal: React.FC<AssignRMModalProps> = ({ onClose, onAssign, onRemove, assignedRMIds = [] }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Filter by search query
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddRM = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      // Show "Adding X as RM" message
      setProcessingUserId(userId);
      setSuccessMessage(`Adding ${user.name} as RM...`);
      setShowSuccessMessage(true);

      await onAssign(userId);
      
      // Show "Added X as RM" message
      setAddedUserIds(prev => [...prev, userId]);
      setSuccessMessage(`Added ${user.name} as RM`);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to add RM:', error);
      setSuccessMessage(`Failed to add ${user.name} as RM. Please try again.`);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleRemoveRM = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      // Show "Removing X as RM" message
      setProcessingUserId(userId);
      setSuccessMessage(`Removing ${user.name} as RM...`);
      setShowSuccessMessage(true);

      await onRemove(userId);
      
      // Show "Removed X as RM" message
      setAddedUserIds(prev => prev.filter(id => id !== userId));
      setSuccessMessage(`Removed ${user.name} as RM`);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to remove RM:', error);
      setSuccessMessage(`Failed to remove ${user.name} as RM. Please try again.`);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } finally {
      setProcessingUserId(null);
    }
  };

  const isAssignedRM = (userId: string) => {
    return assignedRMIds.includes(userId) || addedUserIds.includes(userId);
  };

  return (
    <div className="assign-rm-modal-overlay" onClick={onClose}>
      <div className="assign-rm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="assign-rm-modal-header">
          <h3>Manage Relationship Manager</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {showSuccessMessage && (
          <div className="success-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {successMessage}
          </div>
        )}

        <div className="assign-rm-modal-body">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading-state">Loading users...</div>
          ) : (
            <div className="users-list">
              {filteredUsers.length === 0 ? (
                <div className="empty-state">No users found</div>
              ) : (
                filteredUsers.map((user) => {
                  const isAssigned = isAssignedRM(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`user-item ${isAssigned ? 'assigned' : ''}`}
                    >
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.name}
                        </div>
                        <div className="user-contact">
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                      {isAssigned ? (
                        <button
                          className="remove-user-btn"
                          onClick={() => handleRemoveRM(user.id)}
                          title="Remove RM"
                          disabled={processingUserId === user.id}
                        >
                          {processingUserId === user.id ? (
                            <div className="spinner-small"></div>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          )}
                        </button>
                      ) : (
                        <button
                          className="add-user-btn"
                          onClick={() => handleAddRM(user.id)}
                          disabled={processingUserId === user.id}
                        >
                          {processingUserId === user.id ? (
                            <>
                              <div className="spinner-small"></div>
                              Adding...
                            </>
                          ) : (
                            'Add'
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="assign-rm-modal-footer">
          <button className="done-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRMModal;
