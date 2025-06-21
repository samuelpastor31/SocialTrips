let apiUrl = 'http://13.39.163.169:8082'; // IP actual del servidor

export function getApiUrl(path) {
  return `${apiUrl}/${path}`;
}

export function setApiUrl(newUrl) {
  apiUrl = newUrl;
}