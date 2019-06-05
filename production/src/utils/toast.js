import { message } from 'antd'

export default {
  success: (text) => {
    return message.success(text, 2)
  },
  error: (text) => {
    return message.error(text, 2)
  }
}
