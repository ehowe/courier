module.exports = {
  presets: [
    require('@babel/preset-flow'),
    require('@babel/preset-react'),
  ],
  plugins: [
    require('@babel/plugin-proposal-class-properties'),
    require('@babel/plugin-transform-runtime'),
    require('@babel/plugin-transform-async-to-generator'),
    [require('styled-jsx/babel'), { optimizeForSpeed: true }],
  ],
}