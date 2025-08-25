import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // useEffect の依存配列に対する過剰な警告をOFF
      "react-hooks/exhaustive-deps": "off",

      // レベル選択などで <img> を使いたい場合はONにしておくと楽
      "next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
