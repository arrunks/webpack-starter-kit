import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssVariables from 'postcss-advanced-variables';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssMediaMinMax from 'postcss-media-minmax';
import postcssColorFunction from 'postcss-color-function';
import postcssNesting from 'postcss-nesting';
import postcssNested from 'postcss-nested';
import postcssAtRoot from 'postcss-atroot';
import postcssPropertyLookup from 'postcss-property-lookup';
import postcssExtend from 'postcss-extend';
import postcssSelectorMatches from 'postcss-selector-matches';
import postcssSelectorNot from 'postcss-selector-not';
import postcssCalc from 'postcss-calc';
import cssMqpacker from 'css-mqpacker';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssClearfix from 'postcss-clearfix';
import postcssColorGray from 'postcss-color-gray';
import postcssColorHexAlpha from 'postcss-color-hex-alpha';
import postcssColorHwb from 'postcss-color-hwb';
import postcssColorRebeccapurple from 'postcss-color-rebeccapurple';
import postcssEasings from 'postcss-easings';
import postcssFontVariant from 'postcss-font-variant';
import postcssHexrgba from 'postcss-hexrgba';
import postcssInitial from 'postcss-initial';
import postcssInputStyle from 'postcss-input-style';
import postcssPosition from 'postcss-position';
import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postcssPseudoelements from 'postcss-pseudoelements';
import postcssQuantityQueries from 'postcss-quantity-queries';
import postcssReporter from 'postcss-reporter';

const NODE_ENV = process.env.NODE_ENV || 'development';
const extractStyles = new ExtractTextPlugin('./css/[name].css');
const supportedBrowsers = [
  '> 0.5%',
  'last 2 versions',
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.1',
  'bb >= 10'
];
const postcssProcessors = [
  postcssImport,
  postcssMixins,
  postcssVariables,
  postcssCustomSelectors,
  postcssCustomMedia,
  postcssCustomProperties,
  postcssMediaMinMax,
  postcssColorFunction,
  postcssColorGray,
  postcssColorHexAlpha,
  postcssColorHwb,
  postcssColorRebeccapurple,
  postcssEasings,
  postcssFontVariant,
  postcssHexrgba,
  postcssPseudoClassAnyLink,
  postcssInputStyle,
  postcssPosition,
  postcssNesting,
  postcssNested,
  postcssAtRoot,
  postcssPropertyLookup,
  postcssExtend,
  postcssSelectorMatches,
  postcssSelectorNot,
  postcssClearfix,
  postcssQuantityQueries,
  postcssPseudoelements,
  postcssCalc,
  postcssInitial,
  postcssFlexbugsFixes,
  autoprefixer({
    browsers: supportedBrowsers,
    cascade: false
  }),
  cssMqpacker({ sort: true }),
  postcssReporter({ clearMessages: true })
];

module.exports = () => {
  return {
    context: path.resolve(__dirname, 'src'),

    entry: {
      main: './app.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
      filename: './js/[name].js'
    },

    watch: NODE_ENV === 'development',

    devtool: NODE_ENV == 'development' ? 'cheap-module-eval-source-map' : null,

    devServer: {
      contentBase: "./"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: __dirname + '/src/js',
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'es2016'],
            cacheDirectory: true,
            plugins: ['transform-runtime']
          }
        },
        {
          test: /\.css$/,
          use: extractStyles.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: 'inline',
                  plugins: () => postcssProcessors,
                  syntax: 'postcss-scss'
                }
              }
            ]
          })
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'src/fonts'),
          use: extractStyles.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                  import: false
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: 'inline',
                  plugins: () => postcssProcessors,
                  syntax: 'postcss-scss'
                }
              }
            ]
          })
        },
        {
          test: /\.pug$/,
          use: [
            'html-loader',
            {
              loader: 'pug-html-loader',
              options: {
                exports: false
              }
            }
          ]
        },
        {
          test: /.*\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              query: {
                name: './assets/[name].[ext]'
              }
            },
            {
              loader: 'image-webpack-loader',
              query: {
                progressive: true,
                pngquant: {
                  quality: '75-90',
                  speed: 4
                },
                mozjpeg: {
                  quality: 75
                },
                gifsicle: {
                  interlaced: true
                }
              }
            }
          ]
        },
        {
          test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              query: {
                name: './assets/[name].[ext]'
              }
            }
          ]
        },
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV),
        LANG: JSON.stringify("en")
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "common"
      }),
      new HtmlWebpackPlugin({
        template: 'pug/main.pug'
      }),
      extractStyles
    ]
  }
};

if (NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}
