import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Swiper from "./swiper/swiper.ts";

let filename = []

for (let i = 0; i <= 8; i++) {
    filename.push({url: `/src/assets/${i}.jpg`})
}

Swiper({
    data: filename,
    success: data => {
        const urls: string[] = data.map(item => {
            if (typeof item === 'string') {
                return item;
            } else if (typeof item === 'object' && item.hasOwnProperty('url')) {
                return item.url;
            }
            return '';
        });
        return urls;
    }
})

createApp(App).mount('#app')
