import Swiper from "swiper";
import { Autoplay, Thumbs } from "swiper/modules";
import "swiper/swiper-bundle.css";
import type { CSSSelector, SwiperOptions } from "swiper/types";


export function swiper(node: CSSSelector | HTMLElement, options = {}) {
    let swiperInstance: Swiper;
    $effect(() => {
        swiperInstance = new Swiper(node, {
            modules: [Autoplay, Thumbs],
            ...options
        });

        return () => {
            swiperInstance.destroy();
        };
    });
    return {
        update(newOptions: SwiperOptions | undefined) {
            swiperInstance.destroy();
            swiperInstance = new Swiper(node, {
                modules: [Autoplay, Thumbs],
                ...newOptions
            });
        }
    };
}