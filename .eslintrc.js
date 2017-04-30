module.exports = {
  "extends": [ "eslint:recommended", "plugin:import/errors", "plugin:import/warnings", "plugin:node/recommended", "standard" ],
  "plugins": [
    "import",
    "node",
    "promise",
    "standard"
  ],
  "rules": {
    "no-console": 0,
    "semi": [2, "always"],
    "no-extra-semi": 2,
  },
  "env": {
    "browser": true,
    "es6": true
  }
};
