import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      "node_modules/**",
      "design_handoff_shelter_cove_redesign/**",
      "cloudflare-env.d.ts",
    ],
  },
];

export default eslintConfig;
