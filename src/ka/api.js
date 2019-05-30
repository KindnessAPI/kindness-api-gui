export const load = ({ pageAt, perPage } = { perPage: 10, pageAt: 0 }) => {
  let url = `/.netlify/functions/wonglokcom/quotes/?as=json&offset=${pageAt * perPage}&limit=${perPage}`
  return fetch(url, {
    mode: 'cors'
  })
    .then(r => {
      if (r.ok) {
        return r.json()
      }
    })
}
