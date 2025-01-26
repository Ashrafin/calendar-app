import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentYear, getDaysInMonth, getPaddedDaysInMonth } from "./helpers/dates";
import { ICalendarData, IDate, IDay, IDayEvent } from "./types/calendarTypes";
import CalendarHeader from "./components/CalendarHeader";
import CalendarDays from "./components/CalendarDays";
import CalendarBody from "./components/CalendarBody";
import EventModal from "./components/EventModal";

function App() {
  const [date, setDate] = useState<IDate>({
    currentDay: null,
    currentMonth: null,
    currentYear: null
  });
  const [daysInMonth, setDaysInMonth] = useState<IDay[] | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [isUpdatingEvent, setIsUpdatingEvent] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<IDayEvent | null>(null);
  const [activeEventModal, setActiveEventModal] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<ICalendarData>({});

  const isToday: boolean = useMemo(() => {
    return new Date().getMonth() === date.currentMonth && getCurrentYear() === date.currentYear;
  }, [date.currentMonth, date.currentYear]);

  function handleToggleEventModal(data: string | null, action: "open" | "close") {
    setIsEventModalOpen(action === "open");
    setActiveEventModal(data);
  };

  function handleUpdateCalendarData(
    year: number,
    month: number,
    day: number,
    action: "add" | "update" | "delete",
    event: IDayEvent
  ) {
    const calendarDataClone = { ...calendarData };
  
    if (!calendarDataClone[year]) calendarDataClone[year] = {};
    if (!calendarDataClone[year]?.[month]) calendarDataClone[year]![month] = {};
    if (!calendarDataClone[year]?.[month]?.[day]) calendarDataClone[year]![month]![day] = [];

    if (action === "add") {
      calendarDataClone[year]![month]![day]!.push(event);
    }

    const eventIndex = calendarDataClone[year]![month]![day]!.findIndex((dayEvent) => dayEvent.id === event.id);

    if (action === "update" && eventIndex !== -1) {
      calendarDataClone[year]![month]![day]![eventIndex] = event;
    }

    if (action === "delete" && eventIndex !== -1) {
      calendarDataClone[year]![month]![day]!.splice(eventIndex, 1);
    }

    calendarDataClone[year]![month]![day]!.sort((a, b) => {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      if (a.endTime < b.endTime) return -1;
      if (a.endTime > b.endTime) return 1;

      return 0;
    });

    setCalendarData(calendarDataClone);
  };
  
  function handleClickEvent(calendarEvent: IDayEvent) {
    setIsUpdatingEvent(true);
    setSelectedEvent(calendarEvent);
  };

  function handleEvent(event: IDayEvent, action: "add" | "update" | "delete") {
    if (!daysInMonth || !activeEventModal) return;

    const daysShallowClone = [...daysInMonth];
    const modifiedDay = daysShallowClone.find((day) => day.dayNumber === activeEventModal);
    const [year, month, day] = activeEventModal.split("-");

    if (!modifiedDay) return;

    if (action === "add") {
      modifiedDay.events.push(event as IDayEvent);
    }

    if (action === "update") {
      const eventIndex = modifiedDay.events.findIndex((dayEvent) => dayEvent.id === event.id);

      if (eventIndex !== -1) {
        modifiedDay.events[eventIndex] = event;
      }
    }

    if (action === "delete") {
      const eventIndex = modifiedDay.events.findIndex((dayEvent) => dayEvent.id === event.id);

      if (eventIndex !== -1) {
        modifiedDay.events.splice(eventIndex, 1);
      }
    }

    modifiedDay.events.sort((a, b) => {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      if (a.endTime < b.endTime) return -1;
      if (a.endTime > b.endTime) return 1;

      return 0;
    });

    setDaysInMonth(daysShallowClone);
    handleUpdateCalendarData(
      parseInt(year, 10),
      parseInt(month, 10),
      parseInt(day, 10),
      action,
      event as IDayEvent
    );
  };

  const _renderEventModal = useCallback(() => {
    if (isEventModalOpen) {
      return (
        <EventModal
          isUpdatingEvent={isUpdatingEvent}
          selectedEvent={selectedEvent}
          handleToggleEventModal={handleToggleEventModal}
          handleEvent={handleEvent}
        />
      );
    }

    return <></>;
  }, [isEventModalOpen, isUpdatingEvent]);

  function handleDisplayToday() {
    const day: number = new Date().getDate();
    const month: number = new Date().getMonth();
    const year: number = getCurrentYear();

    setDate({
      currentDay: day,
      currentMonth: month,
      currentYear: year,
    });
  };

  const handleDisplayPrevMonth = useCallback(() => {
    const { currentMonth, currentYear } = date;

    if (currentMonth !== null && currentYear !== null) {
      let displayMonth: number | null = null;
      let displayYear: number | null = null;

      if (currentMonth === 0) {
        displayMonth = 11;
        displayYear = currentYear - 1;
      } else {
        displayMonth = currentMonth - 1;
        displayYear = currentYear;
      }

      setDate({
        ...date,
        currentMonth: displayMonth,
        currentYear: displayYear
      });
    }
  }, [date.currentMonth, date.currentYear]);

  const handleDisplayNextMonth = useCallback(() => {
    const { currentMonth, currentYear } = date;

    if (currentMonth !== null && currentYear !== null) {
      let displayMonth: number | null = null;
      let displayYear: number | null = null;

      if (currentMonth === 11) {
        displayMonth = 0;
        displayYear = currentYear + 1;
      } else {
        displayMonth = currentMonth + 1;
        displayYear = currentYear;
      }

      setDate({
        ...date,
        currentMonth: displayMonth,
        currentYear: displayYear
      });
    }
  }, [date.currentMonth, date.currentYear]);

  function calibrateCalendarCells(eventsData?: ICalendarData) {
    const { currentMonth, currentYear } = date;

    if (currentMonth === null || currentYear === null) return;

    const { days, startDay } = getDaysInMonth(currentYear, currentMonth + 1);
    const getFullDaysInMonth = getPaddedDaysInMonth(days, startDay);

    if (eventsData !== undefined) {
      getFullDaysInMonth.map(day => {
        const dayNum = parseInt(day.dayNumber.split("-")[2], 10);
        const dayEvents = new Set(eventsData[currentYear]?.[currentMonth + 1]?.[dayNum]);
  
        if (dayEvents) {
          day.events = Array.from(dayEvents);
        }
      });
    }

    setDaysInMonth(getFullDaysInMonth);
  };

  useEffect(() => {
    handleDisplayToday();
  }, []);

  useEffect(() => {
    calibrateCalendarCells()
  }, [date.currentMonth, date.currentYear]);

  useEffect(() => {
    const { currentDay, currentMonth, currentYear } = date;

    if (
      currentDay === null ||
      currentMonth === null ||
      currentYear === null ||
      daysInMonth === null
    ) return;

    if (calendarData[currentYear]?.[currentMonth + 1]) {
      calibrateCalendarCells(calendarData);
    }
  }, [
    date.currentDay,
    date.currentMonth,
    date.currentYear,
    calendarData
  ]);

  return (
    <>
      <CalendarHeader
        currentMonth={date.currentMonth}
        currentYear={date.currentYear}
        handleDisplayPrevMonth={handleDisplayPrevMonth}
        handleDisplayNextMonth={handleDisplayNextMonth}
        handleDisplayToday={handleDisplayToday}
      />
      <CalendarDays />
      <CalendarBody
        daysInCurrentMonth={daysInMonth}
        currentDay={date.currentDay}
        isToday={isToday}
        handleToggleEventModal={handleToggleEventModal}
        handleClickEvent={handleClickEvent}
      />
      {_renderEventModal()}
    </>
  )
};

export default App;