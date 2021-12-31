import { useDispatch } from "react-redux";
import * as Actions from '../../../../store/actions/ActionsCreator';

export const toHex = (d: string) => {
    // follow the sequence to transform: B G R into int.
    if(!d || d?.startsWith('#')) return d;
    let t =  parseInt(d, 10);
    let res = '#';
    let flag = (1 << 8);
    let cnt = 3;
    while(cnt > 0){
        res += (t % flag).toString(16).padStart(2, '0');
        t = (t >> 8);
        cnt--;
    }
    return res;
  }
export const hexToDecimal = (d: string) => {
    if(!d?.startsWith('#')) return '0';
    // RGB => BGR in int
    let res = 0;
    let cnt = 3;
    let flag = 65536;
    while(cnt > 0){
        let index = cnt * 2;
        res += parseInt(d.substring(index -1, index + 1), 16) * flag;
        flag /= 256;
        cnt--;
    }
    return res.toString();
}
export const getSupportSingleColorPalette = () => {
    return true;
}
