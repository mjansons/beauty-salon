export function isValidFutureDate(date: Date): boolean {
  // Get the current date and time
  const now = new Date()

  // Calculate the threshold, which is one hour into the future from the current time
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

  // Check if the given date is after one hour from now
  return date > oneHourFromNow
}

export function isWithinTimeRange(
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string
): boolean {
  // Extract the hours, minutes, and seconds from start and end date objects
  const startHours = startDate.getHours()
  const startMinutes = startDate.getMinutes()
  const startSeconds = startDate.getSeconds()

  const endHours = endDate.getHours()
  const endMinutes = endDate.getMinutes()
  const endSeconds = endDate.getSeconds()

  // Convert startTime and endTime strings to Date objects for comparison
  const [startHour, startMinute, startSecond] = startTime.split(':').map(Number)
  const [endHour, endMinute, endSecond] = endTime.split(':').map(Number)

  // Create time numbers for comparison (HHMMSS)
  const startTimeNumber = startHours * 10000 + startMinutes * 100 + startSeconds
  const endTimeNumber = endHours * 10000 + endMinutes * 100 + endSeconds

  const rangeStartTimeNumber =
    startHour * 10000 + startMinute * 100 + startSecond
  const rangeEndTimeNumber = endHour * 10000 + endMinute * 100 + endSecond

  // Check if the start time is within the time range and the end time is within the time range
  return (
    startTimeNumber >= rangeStartTimeNumber &&
    endTimeNumber <= rangeEndTimeNumber
  )
}

export function getDayOfWeek(date: Date): number {
  return date.getDay()
}
