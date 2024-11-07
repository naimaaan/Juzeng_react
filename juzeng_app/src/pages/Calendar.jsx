import React from 'react';
import logo from '/public/images/juzenglogo.jpg';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
const CalendarPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
        <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title="Dashboard" />

        {/* Content Body */}
        <main className="flex-grow p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
              <p className="text-gray-500">Your events for today and upcoming days</p>
            </div>
          </div>
          {/* Placeholder for Calendar or other main content */}
          <div className="h-full border-dashed border-2 border-gray-300 flex items-center justify-center rounded-lg bg-white shadow-md p-8">
            <p className="text-gray-400 text-lg">Calendar will be here</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;
