import axios, { AxiosResponse } from "axios";

export const fetchHeaders = async (target: string): Promise<{
    headers: Record<string, any>;
    finalUrl: string;
    status: number;
}> => {
    const response = await axios.get(target, {
        maxRedirects: 5,
        timeout: 8000,
        validateStatus: () => true
    });

    return {
        headers: response.headers as Record<string, any>,
        finalUrl: response.request?.res?.responseUrl || target,
        status: response.status
    };
};