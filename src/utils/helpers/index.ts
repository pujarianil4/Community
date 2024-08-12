export const setToLocalStorage = (key: string, value: any) => {
  localStorage?.setItem(key, JSON.stringify(value));
};
export const removeFromLocalStorage = (key: string) => {
  localStorage?.removeItem(key);
};

export const timeAgo = (timestamp: string): string => {
  const currentDate = new Date();
  const pastDate = new Date(timestamp);
  const seconds = Math.floor(
    (currentDate.getTime() - pastDate.getTime()) / 1000
  );

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Iterate through intervals to find the appropriate time difference
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const intervalCount = Math.floor(seconds / secondsInUnit);
    if (intervalCount >= 1) {
      return `${intervalCount} ${unit}${intervalCount === 1 ? "" : "s"} ago`;
    }
  }
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }
  return "just now";
};

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getImageSource = (logo: string | null) => {
  if (
    logo &&
    (logo.startsWith("http://") ||
      logo.startsWith("https://") ||
      logo.startsWith("/"))
  ) {
    return logo;
  } else {
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }
};
