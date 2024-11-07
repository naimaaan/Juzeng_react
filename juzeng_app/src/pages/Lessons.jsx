import React from 'react';
import logo from '/public/images/juzenglogo.jpg';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
const LessonsPage = () => {
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lesson Links Parser</h2>
            <div className="flex space-x-4">
              {/* Left Section */}
              <div className="w-1/2 bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-4 space-x-2">
                  <i className="fas fa-info-circle text-blue-500"></i>
                  <p className="font-semibold text-gray-700">How to use?</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Write the link, the flow, the curator, the level and code of the group, the teacher, the time of the lesson, and the number of students.
                </p>
                <div className="bg-blue-100 p-3 rounded-lg text-sm text-blue-800">
                  Example
                  <div className="mt-2 p-2 bg-white rounded-lg text-blue-800 border border-blue-200">
                    https://meet.google.com/defg-hijk-lmn<br />
                    1.0 YENLIK ALIBAEVA ELEM EV-3<br />
                    N17 LESSON WITH YESTAY ANUARBEKOV<br />
                    20:15-21:15<br />
                    Кіру керек оқушы саны: 7
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="w-1/2">
                <textarea
                  placeholder="The links go here..."
                  className="w-full h-full p-4 bg-gray-100 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="mt-6 flex space-x-4">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-colors">
                Check
              </button>
              <button className="px-6 py-3 bg-blue-200 text-blue-500 rounded-lg font-semibold shadow-md cursor-not-allowed">
                Add to Calendars
              </button>
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 transition-colors">
                All good! :)
              </button>
              <button className="px-6 py-3 bg-green-200 text-green-500 rounded-lg font-semibold shadow-md cursor-not-allowed">
                Add to Calendars
              </button>
              <button className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors">
                Error
              </button>
              <button className="px-6 py-3 bg-blue-200 text-blue-500 rounded-lg font-semibold shadow-md cursor-not-allowed">
                Add to Calendars
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonsPage;
