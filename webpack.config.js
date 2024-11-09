const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = 'style-loader';

const config = {
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
            'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY),
        }),
    ],
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
