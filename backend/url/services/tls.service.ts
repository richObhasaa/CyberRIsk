import https from "https";

export const fetchTLSInfo = async (target: string) => {
    return new Promise((resolve) => {
        const req = https.get(target, (res) => {
            const cert = res.socket.getPeerCertificate();
            const protocol = res.socket.getProtocol();

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