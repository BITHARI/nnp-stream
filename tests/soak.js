import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '30m', target: 50 },
        { duration: '2m', target: 0 },
    ],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

export function main() { //Changed this
    http.get(`${BASE_URL}/api/videos`);
    sleep(2);
}