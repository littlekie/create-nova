module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  rules: {
    'prettier/prettier': 'error',
    semi: [2, 'never'], // 禁止尾部使用分号“ ; ”
    'no-mixed-spaces-and-tabs': 'error', // 不能空格与tab混用
    quotes: [2, 'single'], // 使用单引号
    camelcase: 0,
    'no-return-assign': 0, // return 语句中不能有赋值表达式,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/html-closing-bracket-newline': 'off', // 不强制换行
    'vue/singleline-html-element-content-newline': 'off', // 不强制换行
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 5 },
        multiline: { max: 5 }
      }
    ],
    'vue/multi-word-component-names': 0
  }
}
