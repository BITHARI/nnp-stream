import http from 'k6/http';
import { check, sleep } from 'k6';
import { getRandomVideoSlug } from './stress.js';

export const options = {
    stages: [

        { duration: '30s', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '15s', target: 180 },
        { duration: '10s', target: 250 },
        { duration: '10s', target: 250 },
        { duration: '10s', target: 180 },
        { duration: '15s', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '30s', target: 0 },
    ],

    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.05'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

export default function () {

    let res = http.get(`${BASE_URL}/api/videos/slug/${getRandomVideoSlug()}`);
    check(res, { 'video by slug: 200 ou 404': (r) => r.status === 200 || r.status === 404 });
    sleep(Math.random() * 5 + 2);

    res = http.get(`${BASE_URL}/api/videos`);
    check(res, {
        'videos list: status 200': (r) => r.status === 200,
        'videos list: < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(Math.random() * 3 + 1);

    res = http.get(`${BASE_URL}/api/categories`);
    check(res, { 'categories: status 200': (r) => r.status === 200 });
    sleep(Math.random() * 2 + 1);
}