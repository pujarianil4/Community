export const LocalStore = {
  get: (key: string) => {
    if (localStorage) {
      const value = localStorage?.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  },
  set: (key: string, value: any) => {
    if (localStorage) localStorage?.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    if (localStorage) localStorage?.removeItem(key);
  },
};
