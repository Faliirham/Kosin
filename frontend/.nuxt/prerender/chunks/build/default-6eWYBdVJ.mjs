import { mergeProps, unref, ref, inject, useSSRContext } from 'file://C:/kos-finder/frontend/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'file://C:/kos-finder/frontend/node_modules/vue/server-renderer/index.mjs';
import { h as useActiveView, f as useAppNavigation, d as _sfc_main$3, _ as _export_sfc } from './server.mjs';
import 'file://C:/kos-finder/frontend/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file://C:/kos-finder/frontend/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://C:/kos-finder/frontend/node_modules/h3/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/ufo/dist/index.mjs';
import '../_/nitro.mjs';
import 'file://C:/kos-finder/frontend/node_modules/destr/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/hookable/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/node-mock-http/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/unstorage/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/unstorage/drivers/fs.mjs';
import 'file:///C:/kos-finder/frontend/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js';
import 'file://C:/kos-finder/frontend/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://C:/kos-finder/frontend/node_modules/ohash/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/klona/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/defu/dist/defu.mjs';
import 'file://C:/kos-finder/frontend/node_modules/scule/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://C:/kos-finder/frontend/node_modules/pathe/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/unhead/dist/server.mjs';
import 'node:async_hooks';
import 'file://C:/kos-finder/frontend/node_modules/devalue/index.js';
import 'file://C:/kos-finder/frontend/node_modules/unhead/dist/utils.mjs';
import 'file://C:/kos-finder/frontend/node_modules/unhead/dist/plugins.mjs';
import 'file://C:/kos-finder/frontend/node_modules/unctx/dist/index.mjs';
import 'file://C:/kos-finder/frontend/node_modules/vue-router/vue-router.node.mjs';

const STORAGE_KEY = "kos-theme";
function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function getSystemTheme() {
  return "light";
}
function resolveTheme() {
  const stored = getStoredTheme();
  return stored === "light" || stored === "dark" ? stored : getSystemTheme();
}
const _sfc_main$2 = {
  __name: "SiteHeader",
  __ssrInlineRender: true,
  props: { activeView: { type: String, default: "" } },
  emits: ["navigate"],
  setup(__props) {
    const isDark = ref(resolveTheme() === "dark");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "site-header" }, _attrs))}><div class="header-inner"><button class="brand"><svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#2563EB"></rect><path d="M9 15.5 16 9.5l7 6V24a1.5 1.5 0 0 1-1.5 1.5h-3.5V19h-4v6.5H10.5A1.5 1.5 0 0 1 9 24z" fill="#fff"></path></svg><span class="brand-text"><span class="brand-name">Kos Finder</span><span class="brand-sub">Temukan kos impianmu</span></span></button><nav class="site-nav" aria-label="Navigasi utama"><button class="${ssrRenderClass([{ active: __props.activeView === "landing" }, "nav-link"])}">Beranda</button><button class="${ssrRenderClass([{ active: __props.activeView === "dashboard" }, "nav-link"])}">Jelajahi</button></nav><div class="header-actions"><button class="theme-toggle"${ssrRenderAttr("aria-label", isDark.value ? "Aktifkan mode terang" : "Aktifkan mode gelap")}${ssrRenderAttr("title", isDark.value ? "Mode terang" : "Mode gelap")}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: isDark.value ? "sun" : "moon",
        size: 18
      }, null, _parent));
      _push(`</button><button class="btn-cta">`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: "search",
        size: 16
      }, null, _parent));
      _push(`<span>Cari kos</span></button></div></div></header>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "SiteFooter",
  __ssrInlineRender: true,
  emits: ["navigate"],
  setup(__props) {
    inject("toast");
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "site-footer" }, _attrs))} data-v-717f7168><div class="footer-inner" data-v-717f7168><div class="footer-brand" data-v-717f7168><button class="footer-logo" aria-label="Kos Finder \u2014 kembali ke beranda" data-v-717f7168><svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" data-v-717f7168><rect width="32" height="32" rx="9" fill="#2563EB" data-v-717f7168></rect><path d="M9 15.5 16 9.5l7 6V24a1.5 1.5 0 0 1-1.5 1.5h-3.5V19h-4v6.5H10.5A1.5 1.5 0 0 1 9 24z" fill="#fff" data-v-717f7168></path></svg><span class="footer-brand-name" data-v-717f7168>Kos Finder</span></button><p class="footer-tagline" data-v-717f7168>Temukan kos yang terasa seperti rumah \u2014 data langsung dari Google Maps, gratis tanpa daftar.</p></div><nav class="footer-nav" aria-label="Navigasi footer" data-v-717f7168><span class="footer-label" data-v-717f7168>Jelajahi</span><button data-v-717f7168>Beranda</button><button data-v-717f7168>Jelajahi kos</button></nav><div class="footer-legal" data-v-717f7168><span class="footer-label" data-v-717f7168>Legal</span><a href="#" rel="noopener" data-v-717f7168>Kebijakan Privasi</a><a href="#" rel="noopener" data-v-717f7168>Syarat &amp; Ketentuan</a></div><div class="footer-attribution" data-v-717f7168><span class="footer-label" data-v-717f7168>Sumber data</span><p class="footer-note" data-v-717f7168> Data kos diambil dari <a href="https://developers.google.com/maps/terms" target="_blank" rel="noopener" data-v-717f7168>Google Maps</a> (\xA9 Google) dan geocode fallback dari <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" data-v-717f7168>OpenStreetMap</a> (\xA9 kontributor, lisensi ODbL). </p></div></div><div class="footer-bottom" data-v-717f7168><p class="footer-copy" data-v-717f7168> \xA9 ${ssrInterpolate(unref(year))} Kos Finder \u2014 Dibuat dengan FastAPI &amp; Vue 3 </p></div></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-717f7168"]]);
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { activeView } = useActiveView();
    const { navigate } = useAppNavigation();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SiteHeader = _sfc_main$2;
      const _component_SiteFooter = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SiteHeader, {
        "active-view": unref(activeView),
        onNavigate: unref(navigate)
      }, null, _parent));
      _push(`<main id="main-content">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_SiteFooter, { onNavigate: unref(navigate) }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-6eWYBdVJ.mjs.map
