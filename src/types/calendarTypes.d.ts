export interface IDate {
  currentDay: number | null;
  currentMonth: number | null;
  currentYear: number | null;
};

export interface IDayEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
};

export interface IDay {
  id: string;
  dayNumber: string;
  events: IDayEvent[];
};

export interface IDays {
  [day: string]: IDayEvent[];
};

export interface IMonths {
  [month: string]: IDays;
};

export interface ICalendarData {
  [year: string]: Partial<IMonths>;
};