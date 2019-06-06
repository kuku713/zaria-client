module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry'
      }
    ]
  ],
  // plugins: [
  //   [
  //     "import",
  //     { libraryName: "ant-design-vue", libraryDirectory: "lib", style: "css" },
  //   ],
  // ],
};
