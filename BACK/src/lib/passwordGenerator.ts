import { randomBytes } from 'crypto';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SPECIAL = '@$!%*?&#';
const ALL = LOWER + UPPER + DIGITS + SPECIAL;

function getRandomChar(chars: string): string {
    const idx = randomBytes(1)[0] % chars.length;
    return chars.charAt(idx);
}

function shuffleString(str: string): string {
    return str.split('')
        .sort(() => 0.5 - Math.random())
        .join('');
}

export function generatePassword(length: number = 8): string {
    if (length < 8) {
        throw new Error('Password must be at least 8 characters long.');
    }
    const required = [
        getRandomChar(LOWER),
        getRandomChar(UPPER),
        getRandomChar(DIGITS),
        getRandomChar(SPECIAL)
    ];

    const remainingLength = length - required.length;
    const remaining = Array.from({ length: remainingLength }, () => getRandomChar(ALL));

    const password = shuffleString([...required, ...remaining].join(''));
    return password;
}
