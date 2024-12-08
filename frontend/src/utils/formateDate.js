const formatDate = (dateString) => {
  // Parse the date string into a JavaScript Date object
  const date = new Date(dateString);

  // Extract the day, month, year, hours, and minutes
  const day = date.getDate(); // Day of the month
  const year = date.getFullYear(); // Full year
  const hours = date.getHours().toString().padStart(2, "0"); // Hours (2 digits)
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes (2 digits)

  // Get the month name (short version)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()]; // Months are 0-indexed

  // Format the result
  return `${day},${month},${year},${hours}:${minutes}`;
};

export default formatDate;
