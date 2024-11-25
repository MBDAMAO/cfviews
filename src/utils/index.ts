import { Md5 } from "ts-md5";

export function encodeForHTML(str: string) {
    return ("" + str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

export function getAvatarFromEmail(email: string) {
    return `https://www.gravatar.com/avatar/${Md5.hashStr(email)}?d=identicon`;
}

export function checkStringLength(str: string, min: number, max: number) {
    return str.length >= min && str.length <= max;
}
