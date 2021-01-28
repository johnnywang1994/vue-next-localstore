import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const isProd = process.env.NODE_ENV === 'production';

const config = {
  input: 'src/index.js',
  output: {
    name: 'VueLocalStore',
    file: `dist/vue-localstore${isProd ? '.min' : ''}.js`,
    format: 'umd',
    // exports: 'default',
    compact: isProd,
    globals: {
      vue: 'Vue',
    },
  },
  external: ['vue'],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    (isProd && terser()),
    nodeResolve(),
    commonjs()
  ],
};

export default config;
