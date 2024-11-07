import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const token = localStorage.getItem("access_token");

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        alert('Failed to load staff data');
      }
    };

    fetchUserData();
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaff((prevStaff) => prevStaff.filter((member) => member.id !== userId));
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title="Staff Dashboard" />

        {/* Content Body */}
        <main className="flex-grow p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Staff</h2>
            <button
              onClick={() => alert('Add staff functionality coming soon!')}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Add Staff
            </button>
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">First Name</th>
                  <th className="p-3 border-b">Last Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  staff.map((member) => (
                    <tr key={member.id} className="text-sm text-gray-700">
                      <td className="p-3 border-b">{member.id}</td>
                      <td className="p-3 border-b">{member.first_name || "N/A"}</td>
                      <td className="p-3 border-b">{member.last_name || "N/A"}</td>
                      <td className="p-3 border-b">{member.email}</td>
                      <td className="p-3 border-b">{member.role}</td>
                      <td className="p-3 border-b">
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-500 hover:text-red-700 ml-3"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
