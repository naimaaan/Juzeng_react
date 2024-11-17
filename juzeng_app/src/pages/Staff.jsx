import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import API_URL from "../utils/config";

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "teacher",
  });

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  const fetchUserData = async () => {
    if (!token) {
      console.error("No access token found");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          // Removed Cache-Control, Pragma, and Expires
        },
      });

      console.log("Response received:", response.data);
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      alert("Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token, isModalOpen]); // Add isModalOpen to re-fetch data when modal closes

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_URL}/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Instead of directly updating state, re-fetch data to ensure consistency
        await fetchUserData();
        alert("User deleted successfully!");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response from adding user:", response.data);

      if (response.status === 201) {
        // Brief delay before re-fetching to ensure data persistence
        setTimeout(fetchUserData, 200); // Delay by 200ms to allow backend to update

        setNewUser({
          first_name: "",
          last_name: "",
          email: "",
          role: "teacher",
        });
        setIsModalOpen(false);
        alert("User added successfully!");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert(
        `Failed to add user: ${error.response?.data?.detail || error.message}`
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUser({ first_name: "", last_name: "", email: "", role: "teacher" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Staff Dashboard" />

        <main className="flex-grow p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Staff</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Add Staff
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
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
                        <td className="p-3 border-b">
                          {member.first_name || "N/A"}
                        </td>
                        <td className="p-3 border-b">
                          {member.last_name || "N/A"}
                        </td>
                        <td className="p-3 border-b">{member.email}</td>
                        <td className="p-3 border-b">{member.role}</td>
                        <td className="p-3 border-b">
                          <button className="text-blue-500 bg-white border border-blue-500 hover:bg-blue-500 hover:text-white rounded px-3 py-1 transition">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-500 bg-white border border-red-500 hover:bg-red-500 hover:text-white rounded px-3 py-1 transition ml-3"
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
          )}

          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
              onKeyDown={(e) => e.key === "Escape" && closeModal()}
              tabIndex={-1}
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  Add New Staff Member
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddUser();
                  }}
                >
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newUser.first_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, first_name: e.target.value })
                    }
                    className="w-full p-2 mb-3 border rounded bg-white text-black"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newUser.last_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, last_name: e.target.value })
                    }
                    className="w-full p-2 mb-3 border rounded bg-white text-black"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full p-2 mb-3 border rounded bg-white text-black"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value.toLowerCase(),
                      })
                    }
                    className="w-full p-2 mb-3 border rounded bg-white text-black"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="curator">Curator</option>
                    {role === "superadmin" && (
                      <option value="supervisor">Supervisor</option>
                    )}
                  </select>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded bg-white text-black"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
