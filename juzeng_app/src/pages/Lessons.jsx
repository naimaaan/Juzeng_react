import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import api from "../assets/api";
import API_URL from "../utils/config";

const LessonsPage = () => {
  const [inputValue, setInputValue] = useState(""); // Tracks textarea value
  const [buttonState, setButtonState] = useState("check"); // Tracks button states: "check", "allGood", "error"
  const [isAddToCalendarActive, setIsAddToCalendarActive] = useState(false); // Tracks Add to Calendar button activity
  const [error, setError] = useState(null); // Tracks errors
  const [lessons, setLessons] = useState([]); // Tracks parsed lessons

  // Handles textarea change
  const handleInputChange = (e) => {
    setError(null);
    setInputValue(e.target.value);
    // Reset to "check" state whenever user types
    setButtonState("check");
    setIsAddToCalendarActive(false);
    lessons.length > 0 && setLessons([]);
  };
  const token = localStorage.getItem("access_token");

  // Handles the Check button click
  const handleCheckClick = async (check) => {
    let api_url = `${API_URL}/lessons/check_parsing/`;
    if (check === true) {
      console.log("Check is true");
      api_url = `${API_URL}/lessons/check_parsing/`;
    } else {
      console.log("Check is false");
      api_url = `${API_URL}/lessons/parse_lessons/`;
    }
    try {
      // Ensure the token is available
      if (!token) {
        console.error("No token found. Please log in.");
        setButtonState("error");
        return;
      }

      // Format input to replace actual newlines with literal \n characters

      // Make the API request
      const response = await axios.post(
        api_url,
        { text: inputValue }, // Use the formatted input
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response data:", response.data);

      if (response.status === 200 || response.status === 201) {
        setLessons(response.data.lessons);
        setButtonState("allGood");
        setIsAddToCalendarActive(true);
      } else {
        console.log(response.data.details);
        setButtonState("error");
      }
    } catch (error) {
      // Handle network errors or unexpected issues
      if (error.response) {
        console.error(
          "API error:",
          error.response.data.details || error.response.statusText
        );
        const rawDetails = error.response.data.details;

        // Remove [' and '] from the string
        const cleanedDetails = rawDetails.replace(/^\['|'\]$/g, "");
        setError(cleanedDetails || "Unexpected error occurred.");
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received from the server:", error.request);
      } else {
        // Other unexpected errors
        console.error("Error occurred during request setup:", error.message);
      }
      setButtonState("error");
    }
  };

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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Lesson Links Parser
            </h2>

            {/* Top Row: Left and Right Sections */}
            <div className="flex flex-wrap lg:flex-nowrap space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Left Section */}
              <div className="lg:w-1/2 w-full bg-gray-100 p-4 rounded-lg shadow-sm h-auto">
                <div className="flex items-center mb-4 space-x-2">
                  <i className="fas fa-info-circle text-blue-500"></i>
                  <p className="font-semibold text-gray-700">How to use?</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Write the link, the flow, the curator, the level and code of
                  the group, the teacher, the time of the lesson, and the number
                  of students.
                </p>
                <div className="bg-blue-100 p-3 rounded-lg text-sm text-blue-800">
                  Example
                  <div className="mt-2 p-2 bg-white rounded-lg text-blue-800 border border-blue-200">
                    https://meet.google.com/defg-hijk-lmn
                    <br />
                    1.0 YENLIK ALIBAEVA ELEM-EV-3
                    <br />
                    N17 LESSON WITH YESTAY ANUARBEKOV
                    <br />
                    20:15-21:15
                    <br />
                    Кіру керек оқушы саны: 7
                  </div>
                </div>
                <div className="mt-12 flex flex-wrap justify-center lg:justify-start space-y-4 lg:space-y-0 lg:space-x-4">
                  {/* Dynamic Button */}
                  {buttonState === "check" && (
                    <button
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-colors"
                      onClick={() => handleCheckClick(true)}
                    >
                      Check
                    </button>
                  )}
                  {buttonState === "allGood" && (
                    <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-md">
                      All good! :)
                    </button>
                  )}
                  {buttonState === "error" && (
                    <button className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow-md">
                      Error
                    </button>
                  )}

                  {/* Add to Calendar Button */}
                  <button
                    className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors ${
                      isAddToCalendarActive
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-blue-200 text-blue-500 cursor-not-allowed"
                    }`}
                    disabled={!isAddToCalendarActive}
                    onClick={() => handleCheckClick(false)}
                  >
                    Add to Calendars
                  </button>
                </div>
                {error && (
                  <div className="mt-4 p-4 border border-red-400 rounded-lg bg-red-50">
                    <div className="flex items-start space-x-3">
                      <svg
                        className="h-6 w-6 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-12.707a1 1 0 00-1.414 0L6.586 8l-1.293-1.293a1 1 0 00-1.414 1.414L5.172 10l-1.293 1.293a1 1 0 101.414 1.414L6.586 12l1.707 1.707a1 1 0 001.414-1.414L8.414 10l1.293-1.293a1 1 0 000-1.414zm-3.293 3.293a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-lg font-medium text-red-800">
                          Error
                        </h3>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {lessons.length > 0 && (
                  <div className="mt-4 p-4 border border-green-400 rounded-lg bg-green-50">
                    <div className="flex items-start space-x-3">
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v5a1 1 0 01-2 0V7zm1 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-lg font-medium text-green-800">
                          Success
                        </h3>
                        <p className="text-sm text-green-700">
                          {lessons.map((lesson, index) => (
                            <div
                              key={index}
                              className="mt-2 p-2 bg-white rounded-lg border border-green-200"
                            >
                              <p>
                                <strong>Teacher:</strong>{" "}
                                {lesson.teacher_first_name}{" "}
                                {lesson.teacher_last_name}
                              </p>
                              <p>
                                <strong>Teacher Email:</strong>{" "}
                                {lesson.teacher_email}
                              </p>
                              <p>
                                <strong>Start Time:</strong>{" "}
                                {new Date(lesson.start_time).toLocaleString()}
                              </p>
                              <p>
                                <strong>End Time:</strong>{" "}
                                {new Date(lesson.end_time).toLocaleString()}
                              </p>
                              <p>
                                <strong>Event Link:</strong>{" "}
                                <a
                                  href={lesson.event_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {lesson.event_link}
                                </a>
                              </p>
                              <p>
                                <strong>Group:</strong> {lesson.group}
                              </p>
                              <p>
                                <strong>Number of Students:</strong>{" "}
                                {lesson.number_of_students}
                              </p>
                              <p>
                                <strong>Flow:</strong> {lesson.flow_number}.0
                              </p>
                            </div>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="lg:w-1/2 w-full">
                <textarea
                  placeholder="The links go here..."
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full h-[300px] lg:h-[520px] p-4 bg-gray-100 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Buttons Section */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonsPage;
