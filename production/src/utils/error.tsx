import { Modal } from 'antd'

export default function (message: string, okText = 'OK', title = 'Error') {
  return new Promise((resolve, reject) => {
    Modal.error({
      content: message,
      okText: okText,
      onOk: resolve,
      title
    })
  })
}
