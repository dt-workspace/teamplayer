module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // Base directory for resolving aliases
        alias: {
          '@database': './src/database',
          '@models': './src/models',
          '@services': './src/services',
          '@controllers': './src/controllers',
          '@screens': './src/screens',
          '@store': './src/store',
          '@types': './src/types',
          '@components': './src/components',
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
        },
      },
    ],
  ],
}