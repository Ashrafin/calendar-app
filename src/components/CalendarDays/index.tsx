import { DAYS } from "../../helpers/constants";
import "../../styles/CalendarDays.css";

function CalendarDays(): JSX.Element {
  return (
    <div className="CalendarDays__container">
      {DAYS.map(day => (
        <div className="CalendarDays__day-wrapper" key={day}>
          <p className="CalendarDays__day">{day.slice(0, 3)}</p>
        </div>
      ))}
    </div>
  );
};

export default CalendarDays;