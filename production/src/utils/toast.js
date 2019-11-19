import { message } from 'antd'

export default {
  success: (text) => message.success(text, 2),
  error: (text) => message.error(text, 2)
}
