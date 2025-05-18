import QRCode from "qrcode";

export class QrGenerator {

    static async generateAsDataUrl(content: string): Promise<string> {
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(content, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            })
        })
    }

}