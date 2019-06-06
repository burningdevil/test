export default (url: any) => {
  return new Promise((resolve, reject) => {
    var element = document.createElement('script')

    // Important success and error for the promise
    element.onload = function () {
      resolve(url)
    }
    element.onerror = function () {
      reject(url)
    }
    element.type = 'text/javascript'
    element.async = true
    element.src = url
    document.body.appendChild(element)
  })
}
