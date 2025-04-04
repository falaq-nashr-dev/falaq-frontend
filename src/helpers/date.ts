export function formatDate(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long", // January, February, etc.
    day: "numeric",
    hour12: true, // AM/PM format
  };

  return new Date(date).toLocaleString("en-US", options);
}
