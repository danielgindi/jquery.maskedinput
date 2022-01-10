module.exports = {
    env: {
        es6: true,
        browser: true,
        node: false,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    globals: {},
    extends: ["eslint:recommended"],
    rules: {
        "semi": ["warn", "always"], // Require (but only warn). In some cases this could actually prevent bugs.
        "comma-dangle": ["warn", "always-multiline"],
        "comma-style": ["warn", "last"],
        "no-var": ["warn"],
        "arrow-spacing": ["warn", { "before": true, "after": true }],
        "space-infix-ops": ["warn", { "int32Hint": true }],
        "keyword-spacing": ["warn", { "before": true, "after": true }],
        "space-unary-ops": [
            "warn",
            {
                "words": true,
                "nonwords": false,
            },
        ],
        "comma-spacing": ["warn", { "before": false, "after": true }],
        "object-curly-spacing": ["warn", "always"],
        //"arrow-parens": ["warn", "as-needed"],
        "no-unused-vars": ["warn", {
            "vars": "all",
            "args": "after-used",
            "varsIgnorePattern": "[iIgnored]|^_", // except variables declared as "ignored" or prefixed with "_"
            "ignoreRestSiblings": false,
            "argsIgnorePattern": "^_", // except arguments explicitly prefixed with a _ prefix,
            "caughtErrors": "all",
            "caughtErrorsIgnorePattern": "^ignore", // if an error object should be ignored, call it "ignore/d"
        }],
        "no-console": "warn", // Could indicate leftovers in code. Error by default, set to warn.
        "no-extra-semi": "warn", // A styling issue. Error by default, set to warn.
        "no-unreachable": "warn", // In most cases it's a `break` after a `return`, but could point to a bug
        "no-fallthrough": ["error", { "commentPattern": "break[\\s\\w]*omitted|fallthrough" }],
        "no-useless-escape": "warn", // Could point out a bug in the regex due to typo or misunderstancing
        "no-constant-condition": "warn", // might be used in `while (true)`, but could indicate a bug in other cases
        "no-return-await": "warn", // a performance issue
        "no-async-promise-executor": "warn", // in most cases this would be a mistake and will lead to hard-to-catch bugs
    },

    overrides: [
        {
            files: [
                "tests/**/*tests.js",
                "test/**/*tests.js",
                "tests/**/*_test.js",
                "test/**/*_test.js",
            ],
            env: {
                es6: true,
                browser: false,
                node: true,
                mocha: true,
                jest: true,
            },
            rules: {
                "no-console": "off",
            },
        },
        {
            files: [
                "*db*/**/migrations/**/*.js",
            ],
            rules: {
                "no-console": "off",
            },
        },
        {
            files: [
                "scripts/**/*.js",
                ".eslintrc.js",
            ],
            env: {
                es6: true,
                browser: false,
                node: true,
            },
        },
    ],
};
