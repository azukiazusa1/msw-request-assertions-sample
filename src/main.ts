import { createApp } from "vue";
import App from "./App.vue";

const setup = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    worker.start();
  }
};

setup().then(() => createApp(App).mount("#app"));
