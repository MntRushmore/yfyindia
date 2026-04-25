import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        gallery: resolve(__dirname, "gallery.html"),
        artworks: resolve(__dirname, "artworks.html"),
        work: resolve(__dirname, "work.html"),
        project: resolve(__dirname, "project.html"),
        contact: resolve(__dirname, "contact.html"),
        hareKrishna: resolve(__dirname, "hare-krishna.html"),
        radheRadhe: resolve(__dirname, "radhe-radhe.html"),
        radheKrishna: resolve(__dirname, "radhe-krishna.html"),
        jaiShreeKrishna: resolve(__dirname, "jai-shree-krishna.html"),
      },
    },
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
  },
});
