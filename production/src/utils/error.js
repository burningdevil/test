import { Modal } from 'antd'

export default function ({ message, okText = 'OK', title = 'Error' }) {
  return new Promise((resolve, reject) => {
    Modal.error({
      content: message,
      okText: okText,
      onOk: resolve,
      title
    })
  })
}
