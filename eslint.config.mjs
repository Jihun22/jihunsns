import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            "@typescript-eslint/ban-ts-comment": [
                "warn", // ✅ 오류 대신 경고로 완화
                {
                    tsIgnore: false,       // ✅ @ts-ignore 허용
                    tsExpectError: true,
                    tsNocheck: true,
                    tsCheck: true,
                },
            ],
        },
    },
];