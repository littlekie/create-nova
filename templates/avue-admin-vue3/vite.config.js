import eslintPlugin from 'vite-plugin-eslint'
import { viteMockServe } from 'vite-plugin-mock'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')
// https://vitejs.dev/config/
export default ({ mode }) => {
  const config = loadEnv(mode, './')
  return defineConfig({
    base: config.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        components: resolve(__dirname, './src/components'),
        styles: resolve(__dirname, './src/styles'),
        utils: resolve(__dirname, './src/utils')
      }
    },
    plugins: [
      vue(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
      }),
      viteMockServe({
        mockPath: 'mock',
        prodEnabled: true,
        injectCode: `
        import { setupProdMockServer } from './mockProdServer';
        setupProdMockServer();
      `
      })
    ]
  })
}
