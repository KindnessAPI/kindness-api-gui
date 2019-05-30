export const load = ({ pageAt, perPage } = { perPage: 10, pageAt: 0 }) => {
  return fetch(`/www.wonglok.com/quotes/?as=json&offset=${pageAt * perPage}&limit=${perPage}`, {
  })
    .then(r => {
      if (r.ok) {
        return r.json()
      }
    })
}
