const styled = require('esbuild-plugin-styled-components')

module.exports = (options) => {
  const isDev = !!options.watch
  return {
    bundle: true,
    target: ['es2020'],

    // 入口文件 或者可以使用 entryPoints 底层是 esbuild
    entry: ['src/index.ts'],

    // 打包类型  支持以下几种 'cjs' | 'esm' | 'iife'
    format: ['cjs', 'esm'],

    // 生成类型文件 xxx.d.ts
    dts: true,

    sourcemap: true,
    esbuildPlugins: [
      styled({
        displayName: isDev,
        minify: !isDev,
      }),
    ],
    esbuildOptions(options) {
      options.external = ['react', 'react-dom', '@everynote']
    },
  }
}
