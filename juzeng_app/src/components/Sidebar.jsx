import React from "react";
import logo from "/public/images/juzenglogo.jpg";

const Sidebar = () => {
  const role = localStorage.getItem("role");
  return (
    <aside className="w-64 bg-white p-6 shadow-lg flex flex-col">
      <div className="flex items-center justify-center mb-8">
        <a href="/" className="flex items-center space-x-2">
          <img src={logo} alt="Juzeng Logo" className="w-24 h-auto" />
        </a>
      </div>
      <nav className="flex-1 space-y-4 text-gray-700">
        <ul className="space-y-4">
          <li>
            <a
              href="/calendar"
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>
          {(role === "superadmin" || role === "supervisor") && (
            <>
              <li>
                <a
                  href="/staff"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 transition-colors"
                >
                  <i className="fas fa-users"></i>
                  <span>Staff</span>
                </a>
              </li>

              <li>
                <a
                  href="/lessons"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 transition-colors"
                >
                  <i className="fas fa-book"></i>
                  <span>Lesson Links</span>
                </a>
              </li>
            </>
          )}
          <li>
            <a
              href="/documents"
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <i className="fas fa-file-alt"></i>
              <span>Documents</span>
            </a>
          </li>
        </ul>
      </nav>
      <button className="mt-auto px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
        + New Project
      </button>
    </aside>
  );
};

export default Sidebar;
