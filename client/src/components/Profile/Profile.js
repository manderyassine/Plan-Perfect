import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [userData, setUserData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    location: {
      city: user?.location?.city || '',
      country: user?.location?.country || ''
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profileImage || 'https://ui-avatars.com/api/?name=User&background=random');

  // Initialize form with existing user data
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: {
          city: user.location?.city || '',
          country: user.location?.country || ''
        }
      });
      setPreviewImage(user.profileImage || 'https://ui-avatars.com/api/?name=User&background=random');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if user exists
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('username', userData.username);
      formData.append('bio', userData.bio);
      
      // Updated location handling with detailed logging
      const locationData = {
        city: userData.location.city,
        country: userData.location.country
      };

      formData.append('location', JSON.stringify(locationData));
      
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      console.log('Profile Update Payload:', {
        name: userData.name,
        username: userData.username,
        location: locationData,
        hasProfileImage: !!selectedFile
      });

      // Use updateProfile from AuthContext
      const response = await updateProfile(formData);

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error FULL:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      );
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <Card className="w-full">
        <h2 className="text-xl font-bold mb-6 text-text">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <label htmlFor="profileImage" className="cursor-pointer">
              <input 
                type="file" 
                id="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <img 
                src={previewImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-light hover:opacity-80 transition-opacity"
              />
            </label>
          </div>

          <Input
            type="text"
            label="Name"
            value={userData.name}
            onChange={(e) => setUserData({...userData, name: e.target.value})}
            placeholder="Enter your name"
            required
            maxLength={50}
          />

          <Input
            type="text"
            label="Username"
            value={userData.username}
            onChange={(e) => setUserData({...userData, username: e.target.value})}
            placeholder="Choose a username"
            required
            maxLength={20}
          />

          <Input
            type="textarea"
            label="Bio"
            value={userData.bio}
            onChange={(e) => setUserData({...userData, bio: e.target.value})}
            placeholder="Tell us about yourself"
            className="h-24"
            maxLength={200}
          />

          <div className="flex space-x-4">
            <Input
              type="text"
              label="City"
              value={userData.location.city}
              onChange={(e) => setUserData({
                ...userData, 
                location: {
                  ...userData.location, 
                  city: e.target.value
                }
              })}
              placeholder="Enter your city"
              maxLength={50}
            />
            <Input
              type="text"
              label="Country"
              value={userData.location.country}
              onChange={(e) => setUserData({
                ...userData, 
                location: {
                  ...userData.location, 
                  country: e.target.value
                }
              })}
              placeholder="Enter your country"
              maxLength={50}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
          >
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
