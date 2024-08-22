/* eslint-env node */
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        parserOptions: {
            ecmaVersion: "latest",
            project: "./tsconfig.eslint.json",
            tsconfigRootDir: __dirname,
        },
        ignorePatterns: ["**/*.js", "**/*.cjs", "**/*.mjs"],
        files: ["**/*.{js,mjs,cjs,ts}"],
        rules: {
            "import/extensions": "off",
            "import/no-extraneous-dependencies": "off",
            "import/order": [
                "error",
                {
                    pathGroups: [
                        {
                            pattern: "@server/**",
                            group: "internal",
                        },
                        {
                            pattern: "@tests/**",
                            group: "internal",
                        },
                    ],
                },
            ],
            "no-use-before-define": ["error", { functions: false }],
            "@typescript-eslint/no-use-before-define": [
                "error",
                { functions: false },
            ],

            "import/prefer-default-export": "off",
        },
    },
    {
        languageOptions: { globals: globals.browser },
    },
    {
        name: "kysely_any_db",
        files: ["**/database/migrat*/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];
