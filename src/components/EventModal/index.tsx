import { useState } from "react";
import { v4 as uuid } from "uuid";
import { IDayEvent } from "../../types/calendarTypes";
import Close from "../Icons/Close";
import Delete from "../Icons/Delete";
import "../../styles/EventModal.css";

interface IEventModal {
  isUpdatingEvent: boolean;
  selectedEvent?: IDayEvent | null;
  handleToggleEventModal: (data: string | null, actino: "open" | "close") => void;
  handleEvent: (event: IDayEvent, action: "add" | "update" | "delete") => void;
};

function EventModal({
  isUpdatingEvent,
  selectedEvent,
  handleToggleEventModal,
  handleEvent
}: IEventModal): JSX.Element {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const [eventTitle, setEventTitle] = useState<string>(isUpdatingEvent && selectedEvent ? selectedEvent.title : "");
  const [eventStartTime, setEventStartTime] = useState<string>(isUpdatingEvent && selectedEvent ? selectedEvent.startTime : `${hours}:${minutes}`);
  const [eventEndTime, setEventEndTime] = useState<string>(isUpdatingEvent && selectedEvent ? selectedEvent.endTime : "");

  function _renderDeleteButton(): JSX.Element {
    if (isUpdatingEvent && selectedEvent) {
      return (
        <button
          type="button"
          className="EventModal__delete-button"
          onClick={() => {
            handleEvent(selectedEvent, "delete");
            handleToggleEventModal(null, "close");
          }}
        >
          <Delete />
        </button>
      );
    }

    return <></>;
  };

  return (
    <div className="EventModal__container">
      <div className="EventModal__wrapper">
        <div className="EventModal__header">
          {_renderDeleteButton()}
          <button type="button" className="EventModal__close-button" onClick={() => handleToggleEventModal(null, "close")}>
            <Close />
          </button>
        </div>
        <div className="EventModal__input-wrapper">
          <label className="EventModal__input-label">Event Title</label>
          <input
            value={eventTitle}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventTitle(event.currentTarget.value)}
            className="EventModal__title-input"
            type="text"
            placeholder="Prep meal for the week"
            required
          />
          <label className="EventModal__input-label">Event Time</label>
          <div className="EventModal__time-input-wrapper">
            <input
              value={eventStartTime}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventStartTime(event.currentTarget.value)}
              className="EventModal__time-input"
              type="time"
              required
            />
            <span className="EventModal__time-separator">-</span>
            <input
              value={eventEndTime}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventEndTime(event.currentTarget.value)}
              className="EventModal__time-input"
              type="time"
              required
            />
          </div>
        </div>
        <button
          className="EventModal__save-button"
          onClick={() => {
            handleToggleEventModal(null, "close");

            if (isUpdatingEvent && selectedEvent) {
              handleEvent({
                ...selectedEvent,
                title: eventTitle,
                startTime: eventStartTime,
                endTime: eventEndTime
              }, "update");
            } else {
              handleEvent({
                id: uuid(),
                title: eventTitle,
                startTime: eventStartTime,
                endTime: eventEndTime
              }, "add");
            }
          }}
          type="button"
          disabled={!eventTitle || !eventStartTime || !eventEndTime}
        >
          {isUpdatingEvent ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EventModal;