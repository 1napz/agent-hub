const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx', // เปลี่ยนเป็น .jsx
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'development', // เปลี่ยนเป็น dev ตอน dev จะได้มี source map
  module: {
    rules: [
      {
        test: /\.jsx?$/, // รองรับทั้ง .js และ .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'] // สำคัญ: preset-react
          }
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'], // import ไม่ต้องใส่ .jsx
  },
  devServer: {
    static: './dist',
    hot: true,
  }
};