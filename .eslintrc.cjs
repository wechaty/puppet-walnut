
const rules = {
  'sort-keys': 'off',
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      "checksVoidReturn": false
    }
  ]
}

module.exports = {
  extends: '@chatie',
  rules,
}
