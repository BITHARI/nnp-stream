import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [

    {
        ignores: [
            "node_modules",
            ".next",
            "public",
            "dist",
            "out",
            "coverage",
            "*.config.mjs",
        ],
    },

    ...compat.extends("next/core-web-vitals", "next/typescript"),

    {
        rules: {
            "react-hooks/exhaustive-deps": "off",
            "no-useless-escape": "off",
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-explicit-any": "off",
            '@next/next/no-img-element': 'off',
        },
    },
];

export default eslintConfig;
N