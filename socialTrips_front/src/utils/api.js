let apiUrl = 'http://10.0.2.2:8082'; // IP especial para emulador Android

export function getApiUrl(path) {
  return `${apiUrl}/${path}`;
}

export function setApiUrl(newUrl) {
  apiUrl = newUrl;
}