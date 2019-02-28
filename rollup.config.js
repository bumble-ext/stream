/* eslint-env node */

// import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
// import json from 'rollup-plugin-json'

export default [
  {
    input: 'src/main.js',
    output: [
      {
        file: 'build/bundle-esm.js',
        format: 'esm',
        sourcemap: 'inline',
      },
      {
        file: 'build/bundle-cjs.js',
        format: 'cjs',
        sourcemap: 'inline',
      },
    ],
    external: ['ms', 'lodash/fp/flow', 'lodash/fp/isEqual'],
    // plugins: [resolve(), commonjs(), json()],
  },
]
