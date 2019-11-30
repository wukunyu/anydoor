module.exports = {
  "extends": "eslint:recommended",
  "rules": {
    "no-console": ["error", {
      "allow": ["warn", "error", "info"]
    }]
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "script",
  },
  "global": {
    "winddow": true
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "mocha": true
  }
}