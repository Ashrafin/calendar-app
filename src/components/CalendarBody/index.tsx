import { IDay, IDayEvent } from "../../types/calendarTypes";
import CalendarCell from "../CalendarCell";
import "../../styles/CalendarBody.css";

interface ICalendarBody {
  daysInCurrentMonth: IDay[] | null;
  currentDay: number | null;
  isToday: boolean;
  handleToggleEventModal: (data: string | null, action: "open" | "close") => void;
  handleClickEvent: (calendarEvent: IDayEvent) => void;
};

function CalendarBody({
  daysInCurrentMonth,
  currentDay,
  isToday,
  handleToggleEventModal,
  handleClickEvent
}: ICalendarBody): JSX.Element {
  function _renderCalendarCells(): JSX.Element {
    if (daysInCurrentMonth) {
      return (
        <>
          {daysInCurrentMonth.map((day, index) => (
            <CalendarCell
              day={day}
              currentDay={currentDay}
              isToday={isToday}
              key={index}
              handleToggleEventModal={handleToggleEventModal}
              handleClickEvent={handleClickEvent}
            />
          ))}
        </>
      );
    }

    return <></>;
  };

  return (
    <div className="CalendarBody__container">
      <div className="CalendarBody__wrapper">
        {_renderCalendarCells()}
      </div>
    </div>
  );
};

export default CalendarBody;