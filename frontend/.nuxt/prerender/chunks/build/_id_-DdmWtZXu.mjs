import { inject, ref, mergeProps, withCtx, createVNode, createTextVNode, computed, watch, unref, useSSRContext } from 'file://C:/kos-finder/frontend/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'file://C:/kos-finder/frontend/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc, g as useRoute, d as _sfc_main$3 } from './server.mjs';
import { _ as __nuxt_component_3, f as fetchKosDetail, i as isHttpUrl, a as isFavorite } from './favorites-BkKNcSg9.mjs';
import { u as useHead } from './v3-Bg72EYXc.mjs';
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
import 'file://C:/kos-finder/frontend/node_modules/axios/index.js';

const _sfc_main$2 = {
  __name: "GallerySection",
  __ssrInlineRender: true,
  props: {
    photos: { type: Array, default: () => [] },
    name: { type: String, default: "" },
    rating: { type: Number, default: null },
    totalReviews: { type: Number, default: null }
  },
  setup(__props) {
    const props = __props;
    const activePhoto = ref("");
    const photoFailed = ref(false);
    const photoThumbs = computed(() => props.photos.filter(isHttpUrl).slice(0, 5));
    watch(photoThumbs, (p) => {
      if (!activePhoto.value || !p.includes(activePhoto.value)) {
        activePhoto.value = p[0] || "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gallery" }, _attrs))} data-v-3c7e2f64><div class="gallery-main" data-v-3c7e2f64>`);
      if (activePhoto.value && !photoFailed.value) {
        _push(`<img${ssrRenderAttr("src", activePhoto.value)}${ssrRenderAttr("alt", `Foto ${__props.name}`)} data-v-3c7e2f64>`);
      } else {
        _push(`<div class="gallery-fallback" data-v-3c7e2f64>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "buildings",
          size: 44
        }, null, _parent));
        _push(`<span class="fallback-title" data-v-3c7e2f64>Foto belum tersedia</span><span class="fallback-sub" data-v-3c7e2f64>Foto diambil langsung dari Google saat kuota aktif</span></div>`);
      }
      if (__props.rating) {
        _push(`<div class="gallery-rating" data-v-3c7e2f64>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "star",
          filled: "",
          size: 14
        }, null, _parent));
        _push(`<strong data-v-3c7e2f64>${ssrInterpolate(__props.rating.toFixed(1))}</strong>`);
        if (__props.totalReviews) {
          _push(`<span data-v-3c7e2f64>\xB7 ${ssrInterpolate(__props.totalReviews)} ulasan</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (photoThumbs.value.length > 1) {
        _push(`<div class="gallery-thumbs" data-v-3c7e2f64><!--[-->`);
        ssrRenderList(photoThumbs.value, (p, i) => {
          _push(`<button class="${ssrRenderClass([{ active: activePhoto.value === p }, "thumb"])}" data-v-3c7e2f64><img${ssrRenderAttr("src", p)}${ssrRenderAttr("alt", `Foto ${__props.name} ${i + 1}`)} loading="lazy" data-v-3c7e2f64></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/detail/GallerySection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const GallerySection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-3c7e2f64"]]);
function phoneToWa(phone) {
  if (!phone || typeof phone !== "string") return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  let intl = digits;
  if (intl.startsWith("0")) {
    intl = "62" + intl.slice(1);
  } else if (!intl.startsWith("62")) {
    intl = "62" + intl;
  }
  return `https://wa.me/${intl}`;
}
function directionsUrl(lat, lng) {
  if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return "";
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
const _sfc_main$1 = {
  __name: "InfoSection",
  __ssrInlineRender: true,
  props: { kos: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    inject("navigate");
    inject("toast");
    const confirmingDelete = ref(false);
    const isFav = computed(() => isFavorite(props.kos));
    const waUrl = computed(() => phoneToWa(props.kos.phone));
    const dirUrl = computed(() => directionsUrl(props.kos.latitude, props.kos.longitude));
    function prettyUrl(url) {
      try {
        return new URL(url).hostname.replace(/^www\./, "");
      } catch {
        return url;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-main" }, _attrs))} data-v-ab7562fa><h2 class="detail-title" data-v-ab7562fa>${ssrInterpolate(__props.kos.name)}</h2><p class="detail-address" data-v-ab7562fa>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: "map-pin",
        size: 16,
        class: "pin"
      }, null, _parent));
      _push(` ${ssrInterpolate(__props.kos.address || "Alamat tidak tersedia")}</p><div class="info-list" data-v-ab7562fa>`);
      if (__props.kos.phone) {
        _push(`<div class="info-item" data-v-ab7562fa><span class="info-icon" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "phone",
          size: 17
        }, null, _parent));
        _push(`</span><div data-v-ab7562fa><span class="info-label" data-v-ab7562fa>Telepon</span><a${ssrRenderAttr("href", `tel:${__props.kos.phone.replace(/\s/g, "")}`)} class="info-value link" data-v-ab7562fa>${ssrInterpolate(__props.kos.phone)}</a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isHttpUrl)(__props.kos.website)) {
        _push(`<div class="info-item" data-v-ab7562fa><span class="info-icon" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "globe",
          size: 17
        }, null, _parent));
        _push(`</span><div data-v-ab7562fa><span class="info-label" data-v-ab7562fa>Website</span><a${ssrRenderAttr("href", __props.kos.website)} target="_blank" rel="noopener" class="info-value link" data-v-ab7562fa>${ssrInterpolate(prettyUrl(__props.kos.website))} `);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "arrow-up-right",
          size: 13
        }, null, _parent));
        _push(`</a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.kos.price_range) {
        _push(`<div class="info-item" data-v-ab7562fa><span class="info-icon" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "tag",
          size: 17
        }, null, _parent));
        _push(`</span><div data-v-ab7562fa><span class="info-label" data-v-ab7562fa>Rentang harga</span><span class="info-value" data-v-ab7562fa>${ssrInterpolate(__props.kos.price_range)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.kos.opening_hours && __props.kos.opening_hours.length) {
        _push(`<div class="info-item info-item-hours" data-v-ab7562fa><span class="info-icon" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "clock",
          size: 17
        }, null, _parent));
        _push(`</span><div data-v-ab7562fa><span class="info-label" data-v-ab7562fa>Jam buka</span><ul class="hours-list" data-v-ab7562fa><!--[-->`);
        ssrRenderList(__props.kos.opening_hours, (hour) => {
          _push(`<li data-v-ab7562fa>${ssrInterpolate(hour)}</li>`);
        });
        _push(`<!--]--></ul></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="actions" data-v-ab7562fa>`);
      if (unref(isHttpUrl)(__props.kos.google_maps_url)) {
        _push(`<button class="btn btn-maps" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "map-pin",
          size: 17
        }, null, _parent));
        _push(` Buka di Google Maps `);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "arrow-up-right",
          size: 15
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (dirUrl.value) {
        _push(`<button class="btn btn-outline" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "navigation",
          size: 16
        }, null, _parent));
        _push(` Petunjuk arah </button>`);
      } else {
        _push(`<!---->`);
      }
      if (waUrl.value) {
        _push(`<button class="btn btn-wa" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "phone",
          size: 16
        }, null, _parent));
        _push(` WhatsApp </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="${ssrRenderClass([{ active: isFav.value }, "btn btn-fav"])}"${ssrRenderAttr("aria-pressed", isFav.value)} data-v-ab7562fa>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: "heart",
        size: 16,
        filled: isFav.value
      }, null, _parent));
      _push(` ${ssrInterpolate(isFav.value ? "Tersimpan" : "Simpan")}</button><button class="btn btn-outline" data-v-ab7562fa>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: "external",
        size: 16
      }, null, _parent));
      _push(` Salin tautan </button>`);
      if (!confirmingDelete.value) {
        _push(`<button class="btn btn-delete" data-v-ab7562fa>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "trash",
          size: 16
        }, null, _parent));
        _push(` Hapus </button>`);
      } else {
        _push(`<span class="confirm-pill" data-v-ab7562fa><span class="confirm-text" data-v-ab7562fa>Hapus kos ini?</span><button class="btn btn-confirm-yes" data-v-ab7562fa>Ya, hapus</button><button class="btn btn-confirm-no" data-v-ab7562fa>Batal</button></span>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/detail/InfoSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const InfoSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ab7562fa"]]);
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const kosId = route.params.id;
    inject("navigate");
    const kos = ref(null);
    const loading = ref(true);
    const error = ref("");
    useHead({
      title: "Detail kos \u2014 Kos Finder"
    });
    async function loadDetail() {
      var _a, _b;
      loading.value = true;
      error.value = "";
      try {
        kos.value = await fetchKosDetail(kosId);
      } catch (e) {
        error.value = ((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.detail) || e.message;
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "detail" }, _attrs))} data-v-1bfb9470><div class="detail-top" data-v-1bfb9470><button class="back-btn" data-v-1bfb9470>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        name: "arrow-left",
        size: 16
      }, null, _parent));
      _push(` Kembali </button>`);
      if (kos.value) {
        _push(`<div class="badges" data-v-1bfb9470><span class="${ssrRenderClass([`chip-source-${kos.value.source || "osm"}`, "chip chip-source"])}" data-v-1bfb9470>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          name: "layers",
          size: 12
        }, null, _parent));
        _push(` ${ssrInterpolate((kos.value.source || "osm") === "gmaps" ? "Google" : "OpenStreetMap")}</span>`);
        if (kos.value.city) {
          _push(`<span class="chip chip-city" data-v-1bfb9470>${ssrInterpolate(kos.value.city)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (kos.value.district) {
          _push(`<span class="chip chip-district" data-v-1bfb9470>${ssrInterpolate(kos.value.district)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (kos.value.price_range) {
          _push(`<span class="chip chip-price" data-v-1bfb9470>`);
          _push(ssrRenderComponent(_sfc_main$3, {
            name: "tag",
            size: 12
          }, null, _parent));
          _push(` ${ssrInterpolate(kos.value.price_range)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="detail-loading" data-v-1bfb9470><div class="skeleton skeleton-hero" data-v-1bfb9470></div><div class="detail-loading-body" data-v-1bfb9470><div class="skeleton skeleton-title" data-v-1bfb9470></div><div class="skeleton skeleton-line" data-v-1bfb9470></div><div class="skeleton skeleton-line short" data-v-1bfb9470></div></div></div>`);
      } else if (error.value) {
        _push(ssrRenderComponent(__nuxt_component_3, {
          type: "error",
          icon: "alert",
          title: "Gagal memuat detail",
          message: error.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="btn-retry" data-v-1bfb9470${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                name: "arrow-right",
                size: 16
              }, null, _parent2, _scopeId));
              _push2(` Coba lagi </button>`);
            } else {
              return [
                createVNode("button", {
                  class: "btn-retry",
                  onClick: loadDetail
                }, [
                  createVNode(_sfc_main$3, {
                    name: "arrow-right",
                    size: 16
                  }),
                  createTextVNode(" Coba lagi ")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (kos.value) {
        _push(`<div class="detail-card" data-v-1bfb9470><div class="detail-grid" data-v-1bfb9470>`);
        _push(ssrRenderComponent(GallerySection, {
          photos: kos.value.photos || [],
          name: kos.value.name,
          rating: kos.value.rating,
          "total-reviews": kos.value.total_reviews
        }, null, _parent));
        _push(ssrRenderComponent(InfoSection, { kos: kos.value }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kos/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1bfb9470"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DdmWtZXu.mjs.map
