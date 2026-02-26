import https from "https";
import { TLSSocket } from "tls";

export const fetchTLSInfo = async (target: string) => {
    return new Promise((resolve) => {
        const req = https.get(target, (res) => {
            const tlsSocket = res.socket as TLSSocket;
            const cert = tlsSocket.getPeerCertificate();
            const protocol = tlsSocket.getProtocol();

            resolve({
                cert,
                protocol
            });
        });

        req.on("error", () => {
            resolve(null);
        });
    });
};