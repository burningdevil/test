export function validateHttpUrl(url: string) {
    let newUrl;
    try {
        newUrl = new URL(url);
    } catch (err) {
        return false;
    }

    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
}