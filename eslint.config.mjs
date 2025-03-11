import eslint from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import tseslint from "typescript-eslint";

export default tseslint.config(
    gitignore(),
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
        },
    },
    {
        files: ["**/*.mjs"],
        extends: [tseslint.configs.disableTypeChecked],
    },
);
