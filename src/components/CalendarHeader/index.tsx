import { useMemo } from "react";
import { getCurrentYear } from "../../helpers/dates";
import { MONTHS } from "../../helpers/constants";
import ChevronLeft from "../Icons/ChevronLeft";
import ChevronRight from "../Icons/ChevronRight";
import "../../styles/CalendarHeader.css";

interface ICalendarHeader {
  currentMonth: number | null;
  currentYear: number | null;
  handleDisplayPrevMonth: () => void;
  handleDisplayNextMonth: () => void;
  handleDisplayToday: () => void;
};

function CalendarHeader({
  currentMonth,
  currentYear,
  handleDisplayPrevMonth,
  handleDisplayNextMonth,
  handleDisplayToday
}: ICalendarHeader): JSX.Element {
  const isToday = useMemo((): boolean => {
    if (currentMonth === null || currentYear === null) return false;

    return new Date().getMonth() === currentMonth && getCurrentYear() === currentYear;
  }, [currentMonth, currentYear]);

  return (
    <div className="CalendarHeader__container">
      <button
        type="button"
        className="CalendarHeader__today-button"
        onClick={() => handleDisplayToday()}
        disabled={isToday}
      >
        Today
      </button>
      <div className="CalendarHeader__navigation-container">
        <button type="button" className="CalendarHeader__navigation-button" onClick={() => handleDisplayPrevMonth()}>
          <ChevronLeft />
        </button>
        <button type="button" className="CalendarHeader__navigation-button" onClick={() => handleDisplayNextMonth()}>
          <ChevronRight />
        </button>
      </div>
      <h2 className="CalendarHeader__current-date">
        {currentMonth !== null && currentYear !== null ? `${MONTHS[currentMonth]} ${currentYear}` : ""}
      </h2>
    </div>
  );
};

export default CalendarHeader;