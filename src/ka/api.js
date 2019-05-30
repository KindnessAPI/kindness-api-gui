export const load = ({ pageAt, perPage } = { perPage: 10, pageAt: 0 }) => {
  return fetch(`https://kindnessapi.com/www.wonglok.com/quotes/?as=json&offset=${pageAt * perPage}&limit=${perPage}`, {
    mode: 'cors'
  })
    .then(r => {
      if (r.ok) {
        return r.json()
      }
    })
}
