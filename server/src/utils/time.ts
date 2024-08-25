export function isValidFutureDate(date: Date): boolean {
  // Get the current date and time
  const now = new Date()

  // Calculate the threshold, which is one hour into the future from the current time
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

  // Check if the given date is after one hour from now
  return date > oneHourFromNow
}