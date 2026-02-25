import axios from "axios";

export const fetchHeaders = async (target: string) => {
    const response = await axios.get(target, {
        maxRedirects: 5,
        timeout: 8000,
        validateStatus: () => true
    });

    return {
        headers: response.headers,
        finalUrl: response.request?.res?.responseUrl || target,
        status: response.status
    };
};