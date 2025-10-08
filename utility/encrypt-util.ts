// import * as cryptoES from "crypto-es"

// /**
//  * 加解密
//  * @summary 使用前需先安裝node.js, 後執行npm install crypto-es
//  */
// export class EncryptUtil {
//     /**
//      * md5加密
//      */
//     static toMD5(str: string): string {
//         return cryptoES.MD5(str).toString();
//     }

//     /**
//      * 取得iv
//      * @returns iv(initialization vector)
//      * @summary 一種固定長度的隨機數, 用於增強加密算法的安全性
//      */
//     static getIV(str: string): cryptoES.WordArray {
//         return cryptoES.Hex.parse(str);
//     }

//     /**
//      * aes加密
//      * @param key 密鑰
//      * @param iv this.getIV()
//      */
//     static toAes(str: string, key?: string, iv?: cryptoES.WordArray): string {
//         return cryptoES.AES.encrypt(
//             str,
//             key,
//             {
//                 iv: iv,
//                 format: this.formatter,
//             }
//         ).toString();
//     }

//     /**
//      * aes解密
//      * @param key 密鑰
//      * @param iv this.getIV()
//      */
//     static fromAes(str: string, key?: string, iv?: cryptoES.WordArray): string {
//         const func = cryptoES.AES.decrypt(
//             str,
//             key,
//             {
//                 iv: iv,
//                 format: this.formatter
//             }
//         );

//         return func.toString(cryptoES.Utf8);
//     }

//     /**
//      * 
//      */
//     private static formatter = {
//         /**
//          * 
//          */
//         stringify: function(params: any) {
//             const jsonObj: any = { ct: params.ciphertext.toString(cryptoES.Base64) };

//             if (params.iv) {
//                 jsonObj.iv = params.iv.toString();
//             }

//             if (params.salt) {
//                 jsonObj.s = params.salt.toString();
//             }

//             return JSON.stringify(jsonObj);
//         },

//         /**
//          * 
//          */
//         parse: function(str: any) {
//             const obj = JSON.parse(str);

//             const params = cryptoES.CipherParams.create(
//                 { ciphertext: cryptoES.Base64.parse(obj.ct) }
//             );

//             if (obj.iv) {
//                 params.iv = cryptoES.Hex.parse(obj.iv)
//             }

//             if (obj.s) {
//                 params.salt = cryptoES.Hex.parse(obj.s)
//             }

//             return params;
//         },
//     };
// }
