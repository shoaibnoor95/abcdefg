const path=require('path');
const webpack=require('webpack');
//const htmlWebPackPlugin=require('html-webpack-plugin');
const StyleExtHtmlWebpackPlugin=require('style-ext-html-webpack-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const preloadWebpackPlugin=require('preload-webpack-plugin');
const CompressionPlugin=require('compression-webpack-plugin');
module.exports={
    devtool: 'source-map',
    entry:{
       vendor:['react','react-dom',
       'redux','react-redux',
       'react-router-dom','redux-thunk','redux-logger','react-router-redux','timeago-react','react-scroll-to-bottom',
  'axios','jquery','@material-ui/core','image-compressor.js','@material-ui/icons','react-autosuggest','react-chips','react-datepicker','react-select','react-linkify'],
        app:'./src/index.js'
    },
     output:{
        filename:"[name].bundle.js",
        path:path.join(__dirname,"public"),
        publicPath:'/'
    },  
    
    module:{
        rules:[
            {
            test:/\.js$/,
             exclude:/(node_modules)/,
             use:{
                 loader:'babel-loader',
                 options:{
                     presets:["react","es2015","stage-2"]
                 }
             }   
            
            },
            {
                test:/\.css$/,
                 use:[
                    {loader:'style-loader'},
                    {loader:'css-loader'} 
                ]
            },{
                test:/\.jsx$/,
                loader:'jsx-loader'
            }
            ,{

                test:/\.scss$/,
                
                use:[
                    {loader:'style-loader'},
                    {loader:'css-loader'},
                    {loader:'sass-loader'}
                ]
            }
            ,{

                test:/\.less$/,
                include:/node_modules/,
                use:[
                    {loader:'style-loader'},
                    {loader:'css-loader'},
                    {loader:'less-loader'}
                ]
            },
            {
                test:/\.ttf$/,
                use:[
                    {
                        loader:'ttf-loader',
                        options:{
                            name:'/font/[hash].[ext]'
                        },
                    },
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use:[
                  'url-loader?limit=100000',
                  'img-loader',
                  'file-loader?name=/icons/[name].[ext]'
                ]
              },
              {test: /\.(eot|woff|woff2)$/, 
                loader: "file-loader"}
                // ,{
                //     test: /\.ttf$/,
                //     use: [
                //       {
                //         loader: 'ttf-loader',
                //         options: {
                //           name: './font/[hash].[ext]',
                //         },
                //       },
                 //   ]
                //}
            ]
    },
    // plugins:[
    //     new webpack.DefinePlugin({
    //         'process.browser':true
    //     }),
    //     new webpack.optimize.CommonsChunkPlugin({
    //         name:'vendor',
    //         filename:'vendor.bundle.js',
    //         minChunks(module){
    //             return module.context &&
    //             module.context.indexOf('node_modules')>=0;
    //         }
    //     }),
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress:{
    //             warnings:false,
    //             screw_ie8:true,
    //             conditionals:true,
    //             unused:true,
    //             comparisons:true,
    //             sequences:true,
    //             dead_code:true,
    //             evaluate:true,
    //             if_return:true,
    //             join_vars:true,
        
    //         },
    //             comments:false,
    //     }),
    //     new webpack.HashedModuleIdsPlugin(),
    //     new webpack.DefinePlugin({
    //         'process.env.NODE_ENV':JSON.stringify('production')
    //     }),
    //     // new ExtractTextPlugin({
    //     //     filename:(getPath)=>{
    //     //         return getPath('css/[name].css').replace('css/js','css')
    //     //     },
    //     //     allchunks:true,
    //     // }),
    //     new StyleExtHtmlWebpackPlugin({
    //         minify:true
    
    //     }),
    //     new ScriptExtHtmlWebpackPlugin({
    //         defaultAttribute:'defer'
            
    //     }),
    
    //     new preloadWebpackPlugin({
    //         rel:'preload',
    //         as:'script',
    //         include:'all',
    //         fileBlacklist:[/\.(css|map)$/,/base?.+/]
        
    //     }),
    //     new CompressionPlugin({
    //         algorithm:'gzip',
    //         asset:'[path].gz[query]',
    //         //deleteOriginalAssets:/\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    //         threshold:10240,
    //         minRatio:0.8
    //     })
    // ]
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor',
            filename:'vendor.bundle.js'
        }),
       // new htmlWebPackPlugin()
    ]
}