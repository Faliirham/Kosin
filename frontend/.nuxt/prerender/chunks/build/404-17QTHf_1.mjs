import { inject, mergeProps, useSSRContext } from 'file://C:/kos-finder/frontend/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'file://C:/kos-finder/frontend/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc, d as _sfc_main$3 } from './server.mjs';
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

const _sfc_main = {
  __name: "404",
  __ssrInlineRender: true,
  setup(__props) {
    inject("navigate");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "notfound" }, _attrs))} data-v-80a1b45e><span class="code" data-v-80a1b45e>404</span><h1 class="title" data-v-80a1b45e>Halaman tidak ditemukan</h1><p class="sub" data-v-80a1b45e>Alamat yang kamu tuju tidak ada atau sudah dipindahkan.</p><button class="btn-home" data-v-80a1b45e>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: "arrow-left",
        size: 16
      }, null, _parent));
      _push(` Kembali ke beranda </button></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/404.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _404 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-80a1b45e"]]);

export { _404 as default };
//# sourceMappingURL=404-17QTHf_1.mjs.map
