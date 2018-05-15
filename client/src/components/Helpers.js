/*
  Helpers contains helper functions that can be imported by other components.
*/

export default function fetchHelper(route, method, request) {
  return fetch(route, {
    method,
    body: JSON.stringify(request),
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.status_text);
    }
    return response.json();
  });
}
