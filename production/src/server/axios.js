const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const DATA = require('./mockdb.json')

// Configure axios instance
const instance = axios.create()
instance.defaults.withCredentials = true
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// Use mock data if MODE === 'mock'
// eslint-disable-next-line no-undef
if (__MOCK__) {
  const mock = new MockAdapter(instance)
  mock
    .onPost('/api/auth/login')
    .reply(204, {}, { 'x-mstr-authtoken': DATA.authToken })

    // Handle errors
    .onAny()
    .reply(404, {}, { 'x-mstr-taskerrorcode': 0 })
}

export default instance
