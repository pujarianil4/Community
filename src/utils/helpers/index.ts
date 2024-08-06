export const setToLocalStorage = (key: string, value: any) => {
  localStorage?.setItem(key, JSON.stringify(value));
};
export const removeFromLocalStorage = (key: string) => {
  localStorage?.removeItem(key);
};
