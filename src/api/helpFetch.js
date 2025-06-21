export const helpFetch = () => {
  const URL = 'http://localhost:3001'

  const customFetch = (endpoint, options = {}) => {
    options.method = options.method || 'GET'

    options.headers = {
      'content-type': 'application/json',
      authorization: 'Bearer token',
    }

    if (options.body) {
      options.body = JSON.stringify(options.body)
    }
    console.log(options)

    return fetch(`${URL}${endpoint}`, options)
      .then(async (response) => {
        const data = await response.json() // Leer JSON siempre
        if (response.ok) {
          return data // OK, devolver data directamente
        } else {
          // Rechazar con data para que contenga el msg del backend
          return Promise.reject(data)
        }
      })
      .catch((error) => error)
  }

  const get = (endpoint) => customFetch(endpoint)

  const post = (endpoint, options) => {
    options.method = 'POST'
    return customFetch(endpoint, options)
  }

  const put = (endpoint, options, id) => {
    options.method = 'PUT'
    return customFetch(`${endpoint}/${id}`, options)
  }

  const delet = (endpoint, id) => {
    const options = {
      method: 'DELETE',
    }
    return customFetch(`${endpoint}/${id}`, options)
  }

  return { get, post, put, delet }
}
