import React, { useEffect, useState } from "react";

import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UilTrashAlt } from "@iconscout/react-unicons";

import {
  createEventsApi,
  deleteAllEventsApi,
  deleteEventApi,
  getEventsApi,
} from "../../service/Events.service";

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

const Calender = () => {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");

  // const [radioBtn, setradioBtn] = useState("");

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);
  
  function tileClassName({date,view}){
    if(events.length){
      if(events.filter((event)=>sameDay(new Date(date),new Date(event.eventDate))).length){
        console.log(events,date);
        return "active-day"
      }
    }
  }

  // function tileContent({date,view}){
  //   if(events.length){
  //     const data = events.filter((event)=>sameDay(new Date(date),new Date(event.eventDate))); 
  //     if(data.length){
  //       return data[0].eventName
  //     }
  //   }
  // }

  const fetchEvents = async () => {
    const eventsResponse = await getEventsApi();
    setEvents(eventsResponse.data);
  };

  const addData = async (e) => {
    e.preventDefault();

    try {
      const body = {
        eventName: eventName,
        eventType: eventType,
        eventDate: eventDate,
      };
      await createEventsApi(body);

      toast.success("Event Added !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });

      navigate(fetchEvents());
    } catch (err) {
      console.log(err);
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  };

  const deleteEvent = async (id) => {
    try {
      console.log(id);
      const response = await deleteEventApi(id);
      console.log(response);
      toast.success("Event Deleted !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    } catch (err) {
      console.log(err);
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  }

  const dropEvents = async () => {
    try {
      await deleteAllEventsApi();
      setEvents([]);
      toast.success("All Events Deleted !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    } catch (err) {
      console.log(err);
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  };

  return (
    <div className="calender">
      <span>Calendar</span>
      <div className="calender2">
        <Calendar
          // defaultValue={date}
          className={"calendar"}
          // value={}
          selectRange={true}
          tileClassName={tileClassName}
          // tileContent={tileContent}
        />

        <div className="right">
          <div className="drop-events">
            <button onClick={dropEvents}>Drop all events</button>
            <div className="event-list" id="events-list">
              {events?.map((evt, index) => {
                return (
                  <li key={index} style={{ paddingLeft: "10px" }}>
                    <span>
                      <span>
                        {new Date(evt.eventDate).toString().substring(3, 15)}
                      </span>
                      <span>&ndash;</span>
                      <span>{evt.eventName}</span>
                      <span>&ndash;</span>
                      <span>{evt.eventType}</span>
                    </span>
                    <button
                    className="btn deletebtn"
                    // aria-label={`Delete ${task.taskDescription} Task`}
                    onClick={() => deleteEvent(evt._id)}
                  >
                    <span>
                      <UilTrashAlt className="deleteicon" />
                    </span>
                  </button>
                  </li>                  
                );
              })}
            </div>
          </div>

          <form action="" onSubmit={addData}>
            <input
              type="text"
              name="evt_Name"
              placeholder="Event name"
              onChange={(e) => setEventName(e.target.value)}
              required
              // value={eventName}
            />
            <input
              type="text"
              name="evt_Type"
              placeholder="Event Type"
              onChange={(e) => setEventType(e.target.value)}
              required
              // value={eventType}
            />
            <input
              type="date"
              name="evt_Date"
              placeholder="mm/dd/yy"
              onChange={(e) => setEventDate(e.target.value)}
              required
              // value={eventDate}
            />
            <button type="submit">Add Event</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Calender;
