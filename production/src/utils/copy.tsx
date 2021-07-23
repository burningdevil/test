export const copyToClipboard = (url: string) => {
  document.addEventListener('copy', function handler(e: ClipboardEvent) {
    e.clipboardData.setData('text/plain', url);
    e.preventDefault();
    document.removeEventListener('copy', handler);
  });
  document.execCommand('copy');
}