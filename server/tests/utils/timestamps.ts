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