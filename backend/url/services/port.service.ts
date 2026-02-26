import net from "net";
import { URL } from "url";

export const scanCommonPorts = async (target: string) => {
    const hostname = new URL(target).hostname;
    const ports = [80, 443, 22, 21];
    const results: Record<number, boolean> = {};

    await Promise.all(
        ports.map(port => {
            return new Promise<void>((resolve) => {
                const socket = new net.Socket();
                socket.setTimeout(3000);

                socket.on("connect", () => {
                    results[port] = true;
                    socket.destroy();
                    resolve();
                });

                socket.on("timeout", () => {
                    results[port] = false;
                    socket.destroy();
                    resolve();
                });

                socket.on("error", () => {
                    results[port] = false;
                    resolve();
                });

                socket.connect(port, hostname);
            });
        })
    );

    return results;
};