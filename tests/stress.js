import http from 'k6/http';
import { check, sleep } from 'k6';

const VIDEO_SLUGS = [
    "odyssee-des-etoiles",
    "rires-en-cascade",
    "ombres-de-paris",
    "plein-gaz",
    "derniere-frontiere",
    "coeurs-brises",
    "monde-des-fourmis",
    "pixel-heroes",
    "operation-fantome",
    "rire-du-lundi",
    "abysses",
    "promesse-du-pere",
    "coup-de-theatre",
    "cite-des-ombres",
    "forets-primaires",
    "turbo-squad",
    "la-traque",
    "tempete-de-rires",
    "mars-2157",
    "batisseurs-de-cathedrales",
    "instinct-de-survie",
    "testament-du-roi",
    "voyage-au-bout-des-larmes",
    "dragon-island",
    "code-rouge",
    "amour-en-chantier",
    "requiem-pour-un-champion",
    "icebound",
];

export function getRandomVideoSlug() {
    return VIDEO_SLUGS[Math.floor(Math.random() * VIDEO_SLUGS.length)];
}

export const options = {
    stages: [
        { duration: '10s', target: 20 },
        { duration: '20s', target: 350 },
        { duration: '7m', target: 350 },
        { duration: '30s', target: 0 },
    ],
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