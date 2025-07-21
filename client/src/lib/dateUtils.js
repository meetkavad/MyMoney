// Helper function to get date range based on filter (Indian timezone)
// Converts dates to IST, calculates the range, then converts back to UTC for API calls

export const getDateRange = (date, range) => {
  // Convert to Indian timezone (IST = UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;

  // Get the date in IST
  const istDate = new Date(date.getTime() + istOffset);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();
  const day = istDate.getUTCDate();

  let start, end;

  switch (range) {
    case "daily":
      // Start and end of current day in IST (converted back to UTC for API)
      start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      start = new Date(start.getTime() - istOffset);
      end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
      end = new Date(end.getTime() - istOffset);
      break;
    case "weekly":
      // Last 7 days including today in IST
      start = new Date(Date.UTC(year, month, day - 6, 0, 0, 0, 0));
      start = new Date(start.getTime() - istOffset);
      end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
      end = new Date(end.getTime() - istOffset);
      break;
    case "monthly":
      // Entire month from 1st to last day in IST
      start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      start = new Date(start.getTime() - istOffset);
      end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
      end = new Date(end.getTime() - istOffset);
      break;
    case "yearly":
      // Entire year from January 1st to December 31st in IST
      start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
      start = new Date(start.getTime() - istOffset);
      end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
      end = new Date(end.getTime() - istOffset);
      break;
    default:
      // Default to current month in IST
      start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      start = new Date(start.getTime() - istOffset);
      end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
      end = new Date(end.getTime() - istOffset);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};
