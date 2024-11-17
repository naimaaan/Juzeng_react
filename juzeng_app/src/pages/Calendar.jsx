import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import dayjs from "dayjs";
import moment from "moment";
import API_URL from "../utils/config";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null); // State for preview event
  const [addEventType, setAddEventType] = useState("lesson");
  const [teachers, setTeachers] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    group: "",
    studentsNumber: 0,
    teacherId: null,
    type: "lesson",
    participants: [],
    link: "",
    start: new Date(), // Default to the current date and time
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // Default to 1 hour later
  });

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  const fetchTeachers = async () => {
    if (!token) {
      alert("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users?role=teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);

      const fetchedTeachers = response.data.map((teacher) => ({
        id: teacher.id,
        name: `${teacher.first_name} ${teacher.last_name}`,
        email: teacher.email,
      }));
      console.log(fetchedTeachers);

      setTeachers(fetchedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!token) {
      alert("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedEvents = response.data.map((event) => ({
        id: event.id,
        title:
          event.event_type === "Lesson"
            ? `Lesson: ${event.group}`
            : `Meeting: ${event.name}`,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        allDay: false,
        flow: event.flow_number,
        color: event.event_type.toLowerCase() === "meeting" ? "green" : "blue",
        type: event.event_type.toLowerCase(),
        group: event.group,
        teacher_first_name: event.teacher_first_name,
        teacher_last_name: event.teacher_last_name,
        link: event.event_link,
      }));

      setEvents(fetchedEvents);
      if (role === "supervisor" || role === "superadmin") fetchTeachers(); // Fetch teachers again to update the list
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "5px",
      },
    };
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end }); // Set default times for the new event
    setIsAddModalOpen(true); // Open the modal to add the event
  };

  const handleAddEvent = async () => {
    const eventType = addEventType;
    const title =
      eventType === "meeting"
        ? `Meeting: ${newEvent.name}`
        : `Lesson: ${newEvent.group}`;
    const newEventData = {
      title: title,
      start: newEvent.start,
      end: newEvent.end,
      type: eventType,
      allDay: false,
      color: eventType === "lesson" ? "blue" : "green",
    };

    setEvents((prevEvents) => [...prevEvents, newEventData]); // Add the new event to the calendar

    const api_url = eventType === "lesson" ? "lessons" : "meetings";
    let eventData = {};
    if (eventType === "lesson") {
      eventData = {
        flow: 1,
        start_time: newEventData.start,
        end_time: newEventData.end,
        teacher: newEvent.teacherId,
        group: newEvent.group,
        number_of_students: newEvent.studentsNumber,
        event_link: newEvent.link,
      };
    } else {
      eventData = {
        start_time: newEventData.start,
        end_time: newEventData.end,
        name: newEvent.name,
        event_link: newEvent.link,
        participants: newEvent.participants,
      };
    }
    console.log(JSON.stringify(eventData));
    try {
      await axios.post(`${API_URL}/${api_url}/`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to save event to the server.");
    }
    // fetchEvents(); // Fetch events again to update the list

    setIsAddModalOpen(false); // Close the modal
    setNewEvent({ title: "", start: null, end: null }); // Reset the new event state
  };
  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" />

        <main className="flex-grow p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
            </div>
          </div>

          <div className="h-full rounded-lg bg-white shadow-md p-8">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <BigCalendar
                localizer={localizer}
                events={previewEvent ? [...events, previewEvent] : events}
                startAccessor="start"
                endAccessor="end"
                defaultView="day"
                scrollToTime={new Date()}
                style={{ height: "80vh", width: "100%" }}
                eventPropGetter={eventStyleGetter}
                selectable // Enable slot selection
                onSelectSlot={handleSelectSlot} // Show modal when selecting a slot
                onSelectEvent={(event) => {
                  setSelectedEvent(event); // Fetch detailed event data
                  setIsModalOpen(true);
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (role === "supervisor" || role === "superadmin") && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
            <h3 className="te xt-lg font-semibold mb-4">Add New Event</h3>
            <select
              value={addEventType}
              placeholder="Event type"
              onChange={(e) => {
                const eventType = e.target.value;
                setAddEventType(eventType);
                setNewEvent((prev) => ({ ...prev, type: eventType }));
              }}
              className="w-full mb-3 p-2 border border-gray-300 rounded bg-white text-black"
            >
              <option value="" disabled>
                Event type
              </option>
              <option value="lesson">Lesson</option>
              <option value="meeting">Meeting</option>
            </select>
            {addEventType === "lesson" && (
              <>
                <select
                  value={newEvent.teacherId || ""}
                  onChange={(e) => {
                    const teacherId = e.target.value;
                    setNewEvent((prev) => ({ ...prev, teacherId }));
                  }}
                  className="w-full mb-3 p-2 border border-gray-300 rounded bg-white text-black"
                >
                  <option value="" disabled>
                    Select a teacher
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Group Name"
                  value={newEvent.group}
                  onChange={(e) => {
                    const group = e.target.value;
                    setNewEvent((prev) => ({ ...prev, group }));
                    setPreviewEvent((prev) =>
                      prev ? { ...prev, group } : null
                    ); // Update preview group name
                  }}
                  className="w-full mb-3 p-2 border border-gray-300 rounded bg-white text-black"
                />
                <input
                  type="text"
                  placeholder="Number of students"
                  value={newEvent.studentsNumber}
                  onChange={(e) => {
                    const studentsNumber = e.target.value;
                    setNewEvent((prev) => ({ ...prev, studentsNumber }));
                  }}
                  className="w-full mb-3 p-2 border border-gray-300 rounded bg-white text-black"
                />
              </>
            )}
            {addEventType === "meeting" && (
              <>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewEvent((prev) => ({ ...prev, name })); // Update the name
                    setPreviewEvent((prev) =>
                      prev ? { ...prev, name } : null
                    ); // Optionally update preview
                  }}
                  className="w-full mb-3 p-2 border border-gray-300 rounded bg-white text-black"
                />
                <select
                  multiple
                  value={newEvent.participants || []} // Ensure it handles an array
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions
                    ).map((option) => option.value);
                    setNewEvent((prev) => ({
                      ...prev,
                      participants: selectedOptions,
                    })); // Update participants
                  }}
                  className="w-full mb-3 p-2 border border-gray-300 rounded bg-white text-black"
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            <input
              type="text"
              placeholder="Event link"
              onChange={(e) => {
                const link = e.target.value;
                setNewEvent((prev) => ({ ...prev, link }));
                setPreviewEvent((prev) => (prev ? { ...prev, link } : null));
              }}
              className="w-full mb-3 p-2 border border-gray-300 rounded bg-white text-black"
              value={newEvent.link}
            />

            <label className="block mb-2">
              <strong className="text-sm">Start Time:</strong>
              <input
                type="datetime-local"
                value={
                  newEvent.start
                    ? dayjs(newEvent.start).format("YYYY-MM-DDTHH:mm")
                    : ""
                }
                onChange={(e) => {
                  const start = new Date(e.target.value);
                  setNewEvent((prev) => ({ ...prev, start }));
                  setPreviewEvent((prev) =>
                    prev
                      ? { ...prev, start }
                      : { ...newEvent, start, color: "gray" }
                  ); // Update preview start time
                }}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
              />
            </label>
            <label className="block mb-2">
              <strong className="text-sm">End Time:</strong>
              <input
                type="datetime-local"
                value={
                  newEvent.end
                    ? dayjs(newEvent.end).format("YYYY-MM-DDTHH:mm")
                    : ""
                }
                onChange={(e) => {
                  const end = new Date(e.target.value);
                  setNewEvent((prev) => ({ ...prev, end }));
                  setPreviewEvent((prev) =>
                    prev
                      ? { ...prev, end }
                      : { ...newEvent, end, color: "gray" }
                  ); // Update preview end time
                }}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
              />
            </label>
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => {
                  setPreviewEvent(null); // Remove preview event
                  setIsAddModalOpen(false);
                }}
                className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3 className="text-xl font-semibold mb-4">
              {selectedEvent.title || "No Title"}
            </h3>
            <p>
              <strong>Start Time:</strong>{" "}
              {selectedEvent.start
                ? dayjs(selectedEvent.start).format("YYYY-MM-DD HH:mm")
                : "Not Available"}
            </p>
            <p>
              <strong>End Time:</strong>{" "}
              {selectedEvent.end
                ? dayjs(selectedEvent.end).format("YYYY-MM-DD HH:mm")
                : "Not Available"}
            </p>
            {selectedEvent.link && (
              <p>
                <strong>Link:</strong>{" "}
                <a href={selectedEvent.link}>{selectedEvent.link}</a>
              </p>
            )}
            {selectedEvent.type === "lesson" && (
              <>
                <p>
                  <strong>Group:</strong> {selectedEvent.group || "N/A"}
                </p>
                <p>
                  <strong>Flow:</strong> {selectedEvent.flow}.0
                </p>
                <p>
                  <strong>Teacher:</strong>{" "}
                  {`${selectedEvent.teacher_first_name || "N/A"} ${
                    selectedEvent.teacher_last_name || "N/A"
                  }`}
                </p>
              </>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
