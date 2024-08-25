export function getFutureTimestamp(daysAhead: number, timeHH: number): Date {
  const now = new Date()
  now.setDate(now.getDate() + daysAhead)
  now.setHours(timeHH, 0, 0, 0)

  return now
}
export function addHoursToDate(date: Date, hoursToAdd: number): Date {
  const updatedDate = new Date(date);
  updatedDate.setHours(updatedDate.getHours() + hoursToAdd);

  return updatedDate;
}

export function getNextWeekDayAtHour(targetDayOfWeek: number, hour: number): Date {
  const now = new Date(); // Current date and time
  const currentDayOfWeek = now.getDay(); // Current day of the week (0 = Sunday, ..., 6 = Saturday)

  // Calculate days until the specified day of the next week
  const daysUntilNextWeekDay = (targetDayOfWeek - currentDayOfWeek + 7) % 7 || 7;

  // Create a new Date object for the next week day
  const nextWeekDay = new Date(now);
  nextWeekDay.setDate(now.getDate() + daysUntilNextWeekDay + 7); // Move to the next week
  nextWeekDay.setHours(hour, 0, 0, 0); // Set the time (0 minutes, 0 seconds, 0 milliseconds)

  return nextWeekDay;
}