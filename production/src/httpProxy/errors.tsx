import { desc } from '../utils/desc'

export const getErrorMessage: any = (code: string, message: string) => {
  if(code == 'ERR009') return desc(16602, 'Your session has expired, please connect to the environment.')
  else return message
}
