import { IDay, IDayEvent } from "../../types/calendarTypes";
import "../../styles/CalendarCell.css";

interface ICalendarCell {
  day: IDay;
  currentDay: number | null;
  isToday: boolean;
  handleToggleEventModal: (data: string | null, action: "open" | "close") => void;
  handleClickEvent: (calendarEvent: IDayEvent) => void;
};

function CalendarCell({
  day,
  currentDay,
  isToday,
  handleToggleEventModal,
  handleClickEvent
}: ICalendarCell): JSX.Element {
  function isCurrentActiveDay(): string {
    if (!currentDay || !isToday || day.dayNumber === "") return "";

    return currentDay === parseInt(day.dayNumber.split("-")[2]) ? "active" : "";
  };

  function _renderEvents(): JSX.Element {
    if (day.events.length > 0) {
      return (
        <div className="CalendarCell__events-wrapper">
          {day.events.map((calendarEvent, index) => (
            <div
              key={index}
              className="CalendarCell__event"
              onClick={
                (event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  handleClickEvent(calendarEvent);
                  handleToggleEventModal(day.dayNumber, "open");
                }
              }
            >
              <p className="CalendarCell__event-title">{calendarEvent.title}</p>
            </div>
          ))}
        </div>
      );
    }

    return <></>;
  };

  return (
    <div className="CalendarCell__item" onClick={day.dayNumber !== "" ? () => handleToggleEventModal(day.dayNumber, "open") : undefined}>
      <div className={`CalendarCell__date-container ${isCurrentActiveDay()}`}>
        <p className="CalendarCell__date">{day.dayNumber !== "" ? parseInt(day.dayNumber.split("-")[2], 10) : ""}</p>
      </div>
      {_renderEvents()}
    </div>
  );
};

export default CalendarCell;