import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import cameraIcon from '../assets/Camera.png';
import ellipseBackground from '../assets/Ellipse 253.png';
import editIcon from '../assets/Edit_fill.png';
import emailIcon from '../assets/Message_duotone.png';
import phoneIcon from '../assets/Phone_duotone.png';
import locationIcon from '../assets/Pin_alt_light.png';
import './ProfilePage.css';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  department: string;
  position: string;
  employeeId: string;
  directManager: string;
  picture?: string;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    department: '',
    position: '',
    employeeId: '',
    directManager: '',
    picture: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data?.user) {
        const user = response.data.user;

        // Parse name into first and last name
        const nameParts = user.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setProfile({
          id: user.id,
          firstName,
          lastName,
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          dateOfBirth: user.dateOfBirth || '',
          department: user.department || '',
          position: user.position || '',
          employeeId: user.employeeId || user.id.substring(0, 8),
          directManager: user.directManager || '',
          picture: user.picture || ''
        });

        // Update localStorage
        authService.setUser(user);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Fallback to localStorage
      const user = authService.getUser();
      if (user) {
        const nameParts = user.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setProfile({
          id: user.id,
          firstName,
          lastName,
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          dateOfBirth: user.dateOfBirth || '',
          department: user.department || '',
          position: user.position || '',
          employeeId: user.employeeId || user.id.substring(0, 8),
          directManager: user.directManager || '',
          picture: user.picture || ''
        });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSavingProfile(true);
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      const response = await authService.updateProfile({
        name: fullName,
        phone: profile.phone,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth,
        department: profile.department,
        position: profile.position,
        employeeId: profile.employeeId,
        directManager: profile.directManager,
      });

      if (response.success && response.data?.user) {
        const updatedUser = response.data.user;
        authService.setUser(updatedUser);

        // Update profile state with all fields from the response
        const nameParts = updatedUser.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setProfile({
          id: updatedUser.id,
          firstName,
          lastName,
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          address: updatedUser.address || '',
          dateOfBirth: updatedUser.dateOfBirth || '',
          department: updatedUser.department || '',
          position: updatedUser.position || '',
          employeeId: updatedUser.employeeId || profile.employeeId,
          directManager: updatedUser.directManager || '',
          picture: updatedUser.picture || '',
        });

        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile();
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await authService.uploadProfilePicture(file);

      if (response.success && response.data?.user) {
        const updatedUser = response.data.user;
        authService.setUser(updatedUser);

        // Update profile state with new picture
        setProfile(prev => ({
          ...prev,
          picture: updatedUser.picture || ''
        }));

        alert('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploadingImage(false);
      // Reset the file input so the same file can be selected again
      event.target.value = '';
    }
  };

  const getInitials = (): string => {
    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    return 'NA';
  };

  return (
    <DashboardLayout>
      <div className="profile-page">
        {/* Loading Overlay */}
        {(isUploadingImage || isSavingProfile) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            minHeight: '100vh',
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px 50px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3B82F6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}></div>
              <p style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '500',
                color: '#333',
              }}>
                {isUploadingImage ? 'Uploading profile picture...' : 'Updating profile...'}
              </p>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="profile-header-card">
          <div className="profile-header-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <img src={ellipseBackground} alt="Background" className="profile-avatar-ellipse" />
                {profile.picture ? (
                  <img src={profile.picture} alt="Profile" className="profile-avatar-image" />
                ) : (
                  <div className="profile-avatar-fallback">{getInitials()}</div>
                )}
                <input
                  type="file"
                  id="profile-picture-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
                <button
                  className="profile-avatar-edit-btn"
                  onClick={() => document.getElementById('profile-picture-upload')?.click()}
                  type="button"
                  disabled={isUploadingImage}
                >
                  <img src={cameraIcon} alt="Edit" className="camera-icon" />
                </button>
              </div>
            </div>

            <div className="profile-header-info">
              <div className="profile-header-top">
                <h1 className="profile-name">{profile.firstName} {profile.lastName}</h1>
                <button className="profile-edit-btn" onClick={isEditing ? handleSave : handleEdit}>
                  <img src={editIcon} alt="Edit" className="edit-icon" />
                  <span>{isEditing ? 'Save' : 'Edit'}</span>
                </button>
              </div>

              <p className="profile-employee-id">Employee ID: {profile.employeeId}</p>

              <div className="profile-contact-info">
                <div className="profile-contact-row">
                  <div className="profile-contact-item">
                    <img src={emailIcon} alt="Email" width="16" height="16" />
                    <span>{profile.email || 'ousname.diallo@redteam.com'}</span>
                  </div>
                  <div className="profile-contact-item">
                    <img src={phoneIcon} alt="Phone" width="16" height="16" />
                    <span>{profile.phone || '+33 6 12 34 56 78'}</span>
                  </div>
                </div>
                <div className="profile-contact-loc">
                  <div className="profile-contact-item">
                    <img src={locationIcon} alt="Location" width="16" height="16" />
                    <span>{profile.address || '45 Avenue des Champs-Élysées, Paris'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="profile-info-card">
          <div className="profile-info-header">
            <h2 className="profile-info-title">Personal Information</h2>
            <p className="profile-info-subtitle">Update Your Personal Information</p>
          </div>

          <div className="profile-info-grid">
            <div className="profile-field">
              <label className="profile-label">First Name</label>
              <input
                type="text"
                className="profile-input"
                value={profile.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                disabled={!isEditing}
                placeholder="Name"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Last Name</label>
              <input
                type="text"
                className="profile-input"
                value={profile.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                disabled={!isEditing}
                placeholder="Name"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Email</label>
              <input
                type="email"
                className="profile-input"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                placeholder="Mail@gmail.com"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Phone</label>
              <input
                type="tel"
                className="profile-input"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="58585858"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Address</label>
              <input
                type="text"
                className="profile-input"
                value={profile.address}
                onChange={(e) => handleChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="home, ally building locality, city, state"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Date of birth</label>
              <input
                type="text"
                className="profile-input"
                value={profile.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                placeholder="11/11/1111"
              />
            </div>
          </div>
        </div>

        {/* Professional Information Card */}
        <div className="profile-info-card">
          <div className="profile-info-header">
            <h2 className="profile-info-title">Professional Information</h2>
            <p className="profile-info-subtitle">Update Your Professional Information</p>
          </div>

          <div className="profile-info-grid">
            <div className="profile-field">
              <label className="profile-label">Department</label>
              <input
                type="text"
                className="profile-input"
                value={profile.department}
                onChange={(e) => handleChange('department', e.target.value)}
                disabled={!isEditing}
                placeholder="Finance"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Position</label>
              <input
                type="text"
                className="profile-input"
                value={profile.position}
                onChange={(e) => handleChange('position', e.target.value)}
                disabled={!isEditing}
                placeholder="CEO"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Employee ID</label>
              <input
                type="text"
                className="profile-input"
                value={profile.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                disabled={!isEditing}
                placeholder="123456789"
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Direct Manager</label>
              <input
                type="text"
                className="profile-input"
                value={profile.directManager}
                onChange={(e) => handleChange('directManager', e.target.value)}
                disabled={!isEditing}
                placeholder="MR MK Gandhi"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button
              className="profile-cancel-btn"
              onClick={handleCancel}
              disabled={isSavingProfile}
            >
              Cancel
            </button>
            <button
              className="profile-save-btn"
              onClick={handleSave}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
