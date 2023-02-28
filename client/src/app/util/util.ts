import Cookies from "js-cookie";

// Get cookie from the browser application storage
export function getCookie(key: string): string | undefined {
  const cookie = Cookies.get(key);
  return cookie;
}
