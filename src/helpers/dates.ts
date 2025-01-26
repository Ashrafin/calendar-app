import { IDay } from "../types/calendarTypes";
import { DAYS } from "./constants";

function getCurrentYear(): number {
  return new Date().getFullYear();
};

function getAllMonths(): string[] {
  const currentYear: number = getCurrentYear();
  const months: string[] = [];

  for (let month = 1; month <= 12; month++) {
    const monthString: string = `${currentYear}-${String(month).padStart(2, "0")}`;
    months.push(monthString);
  }

  return months;
};

function getDaysInMonth(year: number, month: number): { days: string[], startDay: string } {
  const days: string[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const startDay = firstDay.toLocaleDateString("en-US", { weekday: "long" });
  const lastDay = new Date(year, month, 0);
  const totalDays = lastDay.getDate();

  for (let day = 1; day <= totalDays; day++) {
    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    days.push(dateString);
  }

  return { days, startDay };
}

function getCurrentDay(): string {
  const today: Date = new Date();

  return today.toISOString().split("T")[0];
};

function getPaddedDaysInMonth(days: string[], startDay: string): IDay[] {
  const daysInMonth: IDay[] = [];
  let count = 0;

  for (const day of DAYS) {
    if (day === startDay) break;

    const emptyStartDayObj: IDay = {
      id: count.toString(),
      dayNumber: "",
      events: []
    };

    daysInMonth.push(emptyStartDayObj);
    count++;
  }

  for (const day of days) {
    const dayObj: IDay = {
      id: count.toString(),
      dayNumber: day,
      events: []
    };

    daysInMonth.push(dayObj);
    count++;
  };

  const emptyEndDays = 7 - (daysInMonth.length % 7);

  if (emptyEndDays !== 0 && emptyEndDays !== 7) {
    for (let emptyDays = 0; emptyDays < emptyEndDays; emptyDays++) {
      const emptyEndDayObj: IDay = {
        id: count.toString(),
        dayNumber: "",
        events: []
      };

      daysInMonth.push(emptyEndDayObj);
      count++;
    }
  }

  return daysInMonth;
};

export {
  getCurrentYear,
  getAllMonths,
  getDaysInMonth,
  getCurrentDay,
  getPaddedDaysInMonth
};