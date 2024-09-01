import { parseCookies, setCookie, destroyCookie } from "nookies";

export function setClientSideCookie(
  name: string,
  value: any,
  force: boolean = false
) {
  if (force) {
    setCookie(null, name, value);
  } else {
    const user = getClientSideCookie(name);
    console.log("setClientSideCookie", user, value, !user);

    !user && setCookie(null, name, value);
  }
}

export function getClientSideCookie(name: string) {
  const cookies = parseCookies();
  return cookies[name] && JSON.parse(cookies[name]);
}

export function deleteClientSideCookie(name: string) {
  destroyCookie(null, name);
}

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

export const getImageSource = (logo: string | null, user: boolean = false) => {
  if (
    logo &&
    (logo.startsWith("http://") ||
      logo.startsWith("https://") ||
      logo.startsWith("/"))
  ) {
    return logo;
  } else {
    if (user) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    return getRandomImageLink();
  }
};

export function getRandomImageLink(): string {
  const imageUrls = [
    "https://picsum.photos/300/300?random=1",
    "https://picsum.photos/200/300?random=2",
    "https://picsum.photos/300/300?random=3",
    "https://picsum.photos/200/300?random=4",
    "https://picsum.photos/300/300?random=5",
  ];

  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

export function getRandomPost(): string {
  const imageUrls = [
    "https://picsum.photos/300/300?random=1",
    "https://picsum.photos/200/300?random=2",
    "https://picsum.photos/300/300?random=3",
    "https://picsum.photos/200/300?random=4",
    "https://picsum.photos/300/300?random=5",
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "https://media.w3.org/2010/05/bunny/movie.mp4",
    "https://media.w3.org/2010/05/video/movie_300.mp4",
    "https://media.w3.org/2010/05/video/movie.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
    "https://filesamples.com/samples/video/mp4/sample_960x540.mp4",
    "https://filesamples.com/samples/video/mp4/sample_1280x720.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4",
  ];

  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

export function identifyMediaType(url: string): "image" | "video" | "unknown" {
  // Define common image and video extensions
  const imageExtensions: string[] = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
  ];
  const videoExtensions: string[] = [
    "mp4",
    "webm",
    "ogg",
    "mov",
    "avi",
    "mkv",
    "flv",
  ];

  // Extract the file extension from the URL
  const extension: string =
    url.split(".").pop()?.split(/\#|\?/)[0].toLowerCase() || "";

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "image";
  }
}
