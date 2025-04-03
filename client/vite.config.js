import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import path module


// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // secure:false,
      },
    },
  },
  publicDir: path.resolve(__dirname, '../server/public'),

});
