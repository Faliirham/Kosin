import axios from 'file://C:/kos-finder/frontend/node_modules/axios/index.js';
import { mergeProps, reactive, useSSRContext } from 'file://C:/kos-finder/frontend/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'file://C:/kos-finder/frontend/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc, d as _sfc_main$3 } from './server.mjs';

const api = axios.create({
  baseURL: "/api",
  timeout: 6e4
});
function isHttpUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
async function fetchKos(params = {}) {
  const res = await api.get("/kos", { params });
  return res.data;
}
async function fetchKosDetail(id) {
  const res = await api.get(`/kos/${id}`);
  return res.data;
}
async function triggerScrape(city, keyword = "kos kosan", district, kelurahan) {
  const res = await api.post(
    "/scrape",
    { city, keyword, district, kelurahan },
    { timeout: 12e4 }
  );
  return res.data;
}

const _sfc_main = {
  __name: "StateCard",
  __ssrInlineRender: true,
  props: {
    type: { type: String, default: "empty" },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["state-card", `state-${__props.type}`]
      }, _attrs))} data-v-6c22f980><span class="state-mark" data-v-6c22f980>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: __props.icon,
        size: 30
      }, null, _parent));
      _push(`</span><h3 data-v-6c22f980>${ssrInterpolate(__props.title)}</h3><p data-v-6c22f980>${ssrInterpolate(__props.message)}</p>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StateCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6c22f980"]]);
const STORAGE_KEY = "kos-favorites";
function readFavorites() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((f) => f && (f.id || f.place_id)) : [];
  } catch {
    return [];
  }
}
const favorites = reactive({ items: readFavorites() });
function matchesAny(f, kos) {
  return !!((kos == null ? void 0 : kos.id) && f.id === kos.id) || !!((kos == null ? void 0 : kos.place_id) && f.place_id === kos.place_id);
}
function isFavorite(kos) {
  if (!kos || !kos.id && !kos.place_id) return false;
  return favorites.items.some((f) => matchesAny(f, kos));
}
function favoritesCount() {
  return favorites.items.length;
}
function favoriteIds() {
  return new Set(favorites.items.map((f) => f.id).filter(Boolean));
}

export { __nuxt_component_3 as _, isFavorite as a, fetchKos as b, favoritesCount as c, favoriteIds as d, fetchKosDetail as f, isHttpUrl as i, triggerScrape as t };
//# sourceMappingURL=favorites-BkKNcSg9.mjs.map
