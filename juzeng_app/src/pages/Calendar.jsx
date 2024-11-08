import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import dayjs from "dayjs";
import moment from "moment";

const localizer = momentLocalizer(moment);
const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected event
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("access_token"); // Get the token from localStorage

  const fetchEvents = async () => {
    if (!token) {
      alert("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/events/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response received:", response.data);

      const fetchedEvents = response.data.map((event) => ({
        id: event.id,
        title:
          event.event_type === "Lesson"
            ? `Lesson: ${event.group}`
            : `Meeting: ${event.name}`,
        start: new Date(event.start_time), // Convert to Date object
        end: new Date(event.end_time), // Convert to Date object
        allDay: false,
        color: event.event_type.toLowerCase() === "meeting" ? "green" : "blue",
        type: event.event_type.toLowerCase(),
      }));

      setEvents(fetchedEvents);
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
  const fetchEventDetails = async (event) => {
    if (!token) {
      alert("No access token found. Please log in.");
      return;
    }

    try {
      // Check the event type to determine the API endpoint
      console.log(event);
      const url =
        event.type === "lesson"
          ? `http://localhost:8080/api/lessons/${event.id}`
          : `http://localhost:8080/api/meetings/${event.id}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const eventDetails = response.data;

      // Set event details to the modal
      setSelectedEvent({
        id: eventDetails.id,
        title: event.title, // Retain the title
        start: dayjs(eventDetails.start_time).format("YYYY-MM-DD HH:mm"),
        end: dayjs(eventDetails.end_time).format("YYYY-MM-DD HH:mm"),
        group: eventDetails.group || null,
        link: eventDetails.event_link || null,
        teacher_first_name: eventDetails.teacher_first_name || "N/A",
        teacher_last_name: eventDetails.teacher_last_name || "N/A",
        event_type: eventDetails.event_type.toLowerCase(),
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert("Failed to load event details.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      // Convert calendar date to YYYY-MM-DD format using dayjs
      const formattedDate = dayjs(date).format("YYYY-MM-DD");

      const dayEvents = events.filter((event) => {
        // Compare the event's start date with the calendar's date
        const eventDate = event.start_time.format("YYYY-MM-DD");
        return eventDate === formattedDate;
      });

      return dayEvents.map((event) => (
        <div
          key={event.id}
          onClick={() => fetchEventDetails(event)}
          className="p-1 rounded cursor-pointer"
          style={{
            backgroundColor: event.color,
            color: "white",
            marginBottom: "4px",
          }}
        >
          {event.event_type === "meeting" ? event.name : event.group}
        </div>
      ));
    }
    return null;
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
        {/* Header */}
        <Header title="Dashboard" />

        {/* Content Body */}
        <main className="flex-grow p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
              <p className="text-gray-500">
                Your events for today and upcoming days
              </p>
            </div>
          </div>

          <div className="h-full rounded-lg bg-white shadow-md p-8">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "75vh" }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => {
                  fetchEventDetails(event); // Fetch detailed event data
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3 className="text-xl font-semibold mb-4">
              {selectedEvent.title}
            </h3>
            <p>
              <strong>Start Time:</strong> {selectedEvent.start}
            </p>
            <p>
              <strong>End Time:</strong> {selectedEvent.end}
            </p>
            <p>
              <strong>Link:</strong> <a>{selectedEvent.link || "N/A"}</a>
            </p>
            {selectedEvent.event_type === "lesson" && (
              <>
                <p>
                  <strong>Group:</strong> {selectedEvent.group || "N/A"}
                </p>
                <p>
                  <strong>Teacher:</strong>{" "}
                  {`${selectedEvent.teacher_first_name} ${selectedEvent.teacher_last_name}`}
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
