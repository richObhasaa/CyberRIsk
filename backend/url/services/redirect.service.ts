import axios from "axios";

export const analyzeRedirectChain = async (target: string) => {
    try {
        const response = await axios.get(target, {
            maxRedirects: 10,
            timeout: 8000,
            validateStatus: () => true
        });

        const finalUrl = response.request?.res?.responseUrl || target;

        return {
            original: target,
            final: finalUrl
        };

    } catch {
        return null;
    }
};