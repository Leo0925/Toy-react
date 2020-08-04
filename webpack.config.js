module.exports = {
  entry: {
    main: './main.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // 高版本语法转移成低版本语法
            presets: ['@babel/preset-env'],
            // 处理 jsx 语法的插件
            plugins: [[
              "@babel/plugin-transform-react-jsx",
              {pragma: "ToyReact.createElement"}
            ]]
          }
        }
      }
    ]
  },
  optimization: {
    minimize: false
  },
//   devServer:{
// 		contentBase:'./dist',  //设置服务器访问的基本目录
// 		host:'localhost', //服务器的ip地址
// 		port:8080,  //端口
// 		open:true  //自动打开页面
// }
}