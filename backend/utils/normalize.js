export const normalizePrice = (str) => {
  if (!str) return null;
  const num = str.replace(/[^0-9]/g, "");
  return num ? Number(num) : null;
};

export const normalizeTitle = (str) =>
  str ? str.replace(/\s+/g, " ").trim() : "";

export const normalizeImage = (url, baseUrl) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (baseUrl) return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  return url;
};