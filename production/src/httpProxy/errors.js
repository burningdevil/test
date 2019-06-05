import desc from '../utils/desc'

export const getErrorMessage = (code, message) => {
  return {
    'ERR009': desc(16602, 'Your session has expired, please connect to the environment.')
  }[code] || message
}
