import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router for navigation

const Header = ({ title }) => {
  const [userData, setUserData] = useState({ first_name: '', last_name: '', role: '' });
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate(); // Use navigate for redirection after logout

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.log("No access token found in localStorage.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch user data: ' + response.statusText);
        }

        setUserData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          role: response.data.role,
        });
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert(`Failed to fetch user data: ${error.message}`);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    // Clear the token and user data
    localStorage.removeItem('access_token');
    setUserData({ first_name: '', last_name: '', role: '' });

    // Redirect to the login page or refresh the page
    navigate('/login'); // Change to the path where your login page is located
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            className="px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="relative text-gray-600 hover:text-blue-500">
          <i className="fas fa-envelope"></i>
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">6</span>
        </button>
        <button className="relative text-gray-600 hover:text-blue-500">
          <i className="fas fa-bell"></i>
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">4</span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="header-info">
            <p className="font-semibold text-gray-800">
              {userData.first_name} {userData.last_name}
            </p>
            <p className="text-sm text-gray-500">{userData.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
