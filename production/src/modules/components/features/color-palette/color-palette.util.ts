export const COLOR_PALETTE_SELECTED_FORM = 'color_palette_selected_form';

export const toHex = (d: string) => {
    // follow the sequence to transform: B G R into int.
    if (!d || d?.startsWith('#')) return d;
    let t = parseInt(d, 10);
    if (t < 0) return '#000000';
    if (t > 16777215) return '#ffffff';
    let res = '#';
    let flag = 1 << 8;
    let cnt = 3;
    while (cnt > 0) {
        res += (t % flag).toString(16).padStart(2, '0');
        t = t >> 8;
        cnt--;
    }
    return res;
};
export const hexToDecimal = (d: string) => {
    if (!d?.startsWith('#')) return '0';
    // RGB => BGR in int
    let res = 0;
    let cnt = 3;
    let flag = 65536;
    while (cnt > 0) {
        let index = cnt * 2;
        res += parseInt(d.substring(index - 1, index + 1), 16) * flag;
        flag /= 256;
        cnt--;
    }
    return res.toString();
};
