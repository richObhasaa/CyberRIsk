import dns from "dns/promises";
import { URL } from "url";
import { Finding } from "../types";

export const checkDNS = async (target: string): Promise<Finding[]> => {
    try {
        const hostname = new URL(target).hostname;
        await dns.lookup(hostname);
        return [];
    } catch {
        return [{ 
            type: "DNS_ERROR",
            severity: "High",
            description: "DNS resolution failed"
        }];
    }
};