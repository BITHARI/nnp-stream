import http from 'k6/http';
import { check, sleep } from 'k6';
import { getRandomVideoSlug } from './stress.js';

export const options = {
    // Config test
    stages: [
        { duration: '30s', target: 50 },   // Montée vers 50 VUs
        { duration: '7m', target: 50 },   // Maintien 5 min
        { duration: '30s', target: 0 },    // Descente
    ],

    // Seuils
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.05'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

export default function () {
    // 1. Liste vidéos
    let res = http.get(`${BASE_URL}/api/videos`);
    check(res, {
        'status 200': (r) => r.status === 200,
        'temps < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(Math.random() * 3 + 1);

    // 2. Catégories
    res = http.get(`${BASE_URL}/api/categories`);
    check(res, { 'status 200': (r) => r.status === 200 });
    sleep(Math.random() * 2 + 1);

    // 3. Détails vidéo
    res = http.get(`${BASE_URL}/api/videos/slug/${getRandomVideoSlug()}`);
    check(res, { 'retrieved': (r) => r.status === 200 || r.status === 404 });
    sleep(Math.random() * 5 + 2);
}