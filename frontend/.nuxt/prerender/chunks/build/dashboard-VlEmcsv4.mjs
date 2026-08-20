import { _ as _export_sfc, g as useRoute, d as _sfc_main$3$1, s as sanitizeTag } from './server.mjs';
import { inject, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, defineComponent, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, watch, reactive, useSSRContext } from 'file://C:/kos-finder/frontend/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'file://C:/kos-finder/frontend/node_modules/vue/server-renderer/index.mjs';
import { a as isFavorite, _ as __nuxt_component_3, b as fetchKos, t as triggerScrape, c as favoritesCount, d as favoriteIds, i as isHttpUrl } from './favorites-BkKNcSg9.mjs';
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

const STORAGE_KEY = "kos-recent";
const MAX_ITEMS = 5;
function readRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((r) => r && typeof r.city === "string" && r.city.trim()) : [];
  } catch {
    return [];
  }
}
const recent = reactive({ items: readRecent() });
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.items));
  } catch {
  }
}
function sameSearch(a, b) {
  return String(a.city || "").toLowerCase() === String(b.city || "").toLowerCase() && String(a.district || "").toLowerCase() === String(b.district || "").toLowerCase() && String(a.kelurahan || "").toLowerCase() === String(b.kelurahan || "").toLowerCase();
}
function addRecentSearch({ city, district, kelurahan, keyword }) {
  if (!city || !String(city).trim()) return;
  const entry = {
    city: String(city).trim(),
    district: district ? String(district).trim() : "",
    kelurahan: kelurahan ? String(kelurahan).trim() : "",
    keyword: keyword && String(keyword).trim() ? String(keyword).trim() : "kos kosan"
  };
  recent.items = recent.items.filter((r) => !sameSearch(r, entry));
  recent.items.unshift(entry);
  recent.items = recent.items.slice(0, MAX_ITEMS);
  persist();
}
function recentSearches() {
  return recent.items;
}
const _sfc_main$3 = {
  __name: "FilterBar",
  __ssrInlineRender: true,
  props: { loading: Boolean, scraping: Boolean, filters: Object, initialCity: String },
  emits: ["scrape", "filter"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const city = ref("");
    const keyword = ref("kos kosan");
    const scrapeDistrict = ref("");
    const scrapeKelurahan = ref("");
    const search = ref("");
    const filterCity = ref("");
    const filterDistrict = ref("");
    const filterKelurahan = ref("");
    const minRating = ref("");
    const sort = ref("created_at");
    const favoritesOnly = ref(false);
    const favCount = computed(() => favoritesCount());
    watch(() => props.filters, (f) => {
      if (!f) return;
      search.value = f.search || "";
      filterCity.value = f.city || "";
      filterDistrict.value = f.district || "";
      filterKelurahan.value = f.kelurahan || "";
      minRating.value = f.min_rating != null ? String(f.min_rating) : "";
      sort.value = f.sort || "created_at";
      favoritesOnly.value = !!f.favorites_only;
    }, { deep: true });
    const locationLabel = computed(() => {
      return [city.value, scrapeDistrict.value, scrapeKelurahan.value].filter(Boolean).join(", ");
    });
    const hasActiveFilter = computed(() => !!(search.value || filterCity.value || filterDistrict.value || filterKelurahan.value || minRating.value || sort.value !== "created_at" || favoritesOnly.value));
    const recentList = computed(() => recentSearches());
    function shortArea(v) {
      return (v || "").replace(/^(Kec\.|Kel\.|Kecamatan|Kelurahan)\s*/i, "");
    }
    function recentLabel(r) {
      return [r.city, r.district ? shortArea(r.district) : null, r.kelurahan ? shortArea(r.kelurahan) : null].filter(Boolean).join(" \xB7 ");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "filter-bar" }, _attrs))} data-v-be5ddc76><section class="scrape-section" aria-label="Cari kos baru" data-v-be5ddc76><header class="section-head" data-v-be5ddc76><span class="section-label" data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "compass",
        size: 16
      }, null, _parent));
      _push(` Cari kos baru </span></header><form class="scrape-form" data-v-be5ddc76><div class="form-group" data-v-be5ddc76><span class="group-label" data-v-be5ddc76>Lokasi</span><div class="group-fields group-location" data-v-be5ddc76><div class="field field-grow" data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "map-pin",
        class: "field-icon",
        size: 17
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", city.value)} class="input" placeholder="Kota \u2014 Bandung, Jakarta\u2026" aria-label="Nama kota" required data-v-be5ddc76></div><div class="field field-district" data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "buildings",
        class: "field-icon",
        size: 17
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", scrapeDistrict.value)} class="input" placeholder="Kecamatan (opsional)" aria-label="Kecamatan" data-v-be5ddc76></div><div class="field field-kelurahan" data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "map",
        class: "field-icon",
        size: 17
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", scrapeKelurahan.value)} class="input" placeholder="Kelurahan (opsional)" aria-label="Kelurahan" data-v-be5ddc76></div></div></div><div class="form-group" data-v-be5ddc76><span class="group-label" data-v-be5ddc76>Kata kunci</span><div class="group-fields group-keyword" data-v-be5ddc76><div class="field field-keyword" data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "search",
        class: "field-icon",
        size: 17
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", keyword.value)} class="input" placeholder="Kos kosan, kos putri, indekos\u2026" aria-label="Keyword pencarian" data-v-be5ddc76></div><button class="btn btn-primary" type="submit"${ssrIncludeBooleanAttr(__props.loading || __props.scraping || !city.value) ? " disabled" : ""} data-v-be5ddc76>`);
      if (__props.loading || __props.scraping) {
        _push(`<span class="spinner" data-v-be5ddc76></span>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "search",
          size: 17
        }, null, _parent));
      }
      _push(`<span data-v-be5ddc76>${ssrInterpolate(__props.loading || __props.scraping ? "Mencari\u2026" : "Cari")}</span></button></div></div></form>`);
      if ((__props.loading || __props.scraping) && city.value) {
        _push(`<p class="scrape-status" data-v-be5ddc76>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "compass",
          size: 13
        }, null, _parent));
        _push(` Mencari kos di ${ssrInterpolate(locationLabel.value)} \u2014 data ditarik langsung dari Google Maps, ini butuh beberapa saat. </p>`);
      } else {
        _push(`<!---->`);
      }
      if (recentList.value.length) {
        _push(`<div class="recent-row" data-v-be5ddc76><span class="recent-label" data-v-be5ddc76>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "clock",
          size: 12
        }, null, _parent));
        _push(` Pencarian terakhir </span><!--[-->`);
        ssrRenderList(recentList.value, (r, i) => {
          _push(`<button class="recent-chip"${ssrRenderAttr("title", `Cari lagi ${recentLabel(r)}`)} data-v-be5ddc76>${ssrInterpolate(recentLabel(r))}</button>`);
        });
        _push(`<!--]--><button class="recent-clear" title="Hapus semua riwayat pencarian" aria-label="Hapus riwayat pencarian" data-v-be5ddc76>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "close",
          size: 12
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><div class="divider" data-v-be5ddc76></div><section class="filter-section" aria-label="Filter dan urutkan" data-v-be5ddc76><header class="section-head" data-v-be5ddc76><span class="section-label" data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "filter",
        size: 15
      }, null, _parent));
      _push(` Filter &amp; urutkan </span></header><div class="filter-row" data-v-be5ddc76><div class="field field-search" data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "search",
        class: "field-icon",
        size: 16
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", search.value)} class="input" placeholder="Cari nama, alamat, atau area\u2026" aria-label="Cari kos" data-v-be5ddc76></div><div class="field" data-v-be5ddc76><input${ssrRenderAttr("value", filterCity.value)} class="input" placeholder="Kota" aria-label="Filter kota" data-v-be5ddc76></div><div class="field" data-v-be5ddc76><input${ssrRenderAttr("value", filterDistrict.value)} class="input" placeholder="Kecamatan" aria-label="Filter kecamatan" data-v-be5ddc76></div><div class="field" data-v-be5ddc76><input${ssrRenderAttr("value", filterKelurahan.value)} class="input" placeholder="Kelurahan" aria-label="Filter kelurahan" data-v-be5ddc76></div><select class="select" aria-label="Rating minimal" data-v-be5ddc76><option value="" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(minRating.value) ? ssrLooseContain(minRating.value, "") : ssrLooseEqual(minRating.value, "")) ? " selected" : ""}>Semua rating</option><option value="2" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(minRating.value) ? ssrLooseContain(minRating.value, "2") : ssrLooseEqual(minRating.value, "2")) ? " selected" : ""}>2\u2605 ke atas</option><option value="3" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(minRating.value) ? ssrLooseContain(minRating.value, "3") : ssrLooseEqual(minRating.value, "3")) ? " selected" : ""}>3\u2605 ke atas</option><option value="4" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(minRating.value) ? ssrLooseContain(minRating.value, "4") : ssrLooseEqual(minRating.value, "4")) ? " selected" : ""}>4\u2605 ke atas</option><option value="4.5" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(minRating.value) ? ssrLooseContain(minRating.value, "4.5") : ssrLooseEqual(minRating.value, "4.5")) ? " selected" : ""}>4,5\u2605 ke atas</option></select><select class="select" aria-label="Urutkan" data-v-be5ddc76><option value="created_at" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "created_at") : ssrLooseEqual(sort.value, "created_at")) ? " selected" : ""}>Terbaru</option><option value="rating" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "rating") : ssrLooseEqual(sort.value, "rating")) ? " selected" : ""}>Rating tertinggi</option><option value="name" data-v-be5ddc76${ssrIncludeBooleanAttr(Array.isArray(sort.value) ? ssrLooseContain(sort.value, "name") : ssrLooseEqual(sort.value, "name")) ? " selected" : ""}>Nama (A-Z)</option></select><button class="${ssrRenderClass([{ active: favoritesOnly.value }, "btn btn-fav"])}"${ssrRenderAttr("aria-pressed", favoritesOnly.value)}${ssrRenderAttr("title", favoritesOnly.value ? "Tampilkan semua kos" : "Tampilkan hanya kos favorit")} data-v-be5ddc76>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "heart",
        size: 14,
        filled: favoritesOnly.value
      }, null, _parent));
      _push(`<span data-v-be5ddc76>Favorit</span>`);
      if (favCount.value) {
        _push(`<span class="fav-count" data-v-be5ddc76>${ssrInterpolate(favCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (hasActiveFilter.value) {
        _push(`<button class="btn btn-reset" title="Reset filter" data-v-be5ddc76>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "close",
          size: 14
        }, null, _parent));
        _push(` Reset </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FilterBar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-be5ddc76"]]);
const _sfc_main$2 = {
  __name: "SkeletonGrid",
  __ssrInlineRender: true,
  props: { count: { type: Number, default: 6 } },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "loading-grid" }, _attrs))} data-v-6a65b950><!--[-->`);
      ssrRenderList(__props.count, (i) => {
        _push(`<div class="skeleton-card" data-v-6a65b950><div class="skeleton skeleton-photo" data-v-6a65b950></div><div class="skeleton skeleton-title" data-v-6a65b950></div><div class="skeleton skeleton-line" data-v-6a65b950></div><div class="skeleton skeleton-line short" data-v-6a65b950></div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SkeletonGrid.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-6a65b950"]]);
const _sfc_main$1 = {
  __name: "KosCard",
  __ssrInlineRender: true,
  props: { kos: Object },
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const photoFailed = ref(false);
    const hasPhoto = computed(() => {
      var _a;
      return isHttpUrl((_a = props.kos.photos) == null ? void 0 : _a[0]);
    });
    const isFav = computed(() => isFavorite(props.kos));
    const initial = computed(() => (props.kos.name || "?").trim().charAt(0).toUpperCase());
    const shortDistrict = computed(() => {
      const d = props.kos.district || "";
      return d.replace(/^Kec\.\s*/i, "");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "kos-card",
        role: "button",
        tabindex: "0"
      }, _attrs))} data-v-62642331><div class="card-photo" data-v-62642331>`);
      if (hasPhoto.value && !photoFailed.value) {
        _push(`<img${ssrRenderAttr("src", __props.kos.photos[0])}${ssrRenderAttr("alt", `Foto ${__props.kos.name}`)} loading="lazy" data-v-62642331>`);
      } else {
        _push(`<div class="card-photo-fallback" data-v-62642331><span class="fallback-mark" data-v-62642331>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "buildings",
          size: 92
        }, null, _parent));
        _push(`</span><span class="fallback-initial" data-v-62642331>${ssrInterpolate(initial.value)}</span></div>`);
      }
      _push(`<div class="photo-shade" data-v-62642331></div>`);
      if (__props.kos.rating) {
        _push(`<span class="rating-badge" data-v-62642331>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "star",
          filled: "",
          size: 12
        }, null, _parent));
        _push(`<span class="rating-num" data-v-62642331>${ssrInterpolate(__props.kos.rating.toFixed(1))}</span>`);
        if (__props.kos.total_reviews) {
          _push(`<span class="review-count" data-v-62642331>(${ssrInterpolate(__props.kos.total_reviews)})</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${ssrRenderClass([`source-${__props.kos.source || "osm"}`, "source-tag"])}" data-v-62642331>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "layers",
        size: 11
      }, null, _parent));
      _push(` ${ssrInterpolate((__props.kos.source || "osm") === "gmaps" ? "Google" : "OSM")}</span><button class="${ssrRenderClass([{ active: isFav.value }, "fav-btn"])}"${ssrRenderAttr("aria-label", isFav.value ? "Hapus dari favorit" : "Simpan ke favorit")}${ssrRenderAttr("aria-pressed", isFav.value)}${ssrRenderAttr("title", isFav.value ? "Hapus dari favorit" : "Simpan ke favorit")} data-v-62642331>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "heart",
        size: 16,
        filled: isFav.value
      }, null, _parent));
      _push(`</button><span class="card-arrow" data-v-62642331>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "arrow-up-right",
        size: 16
      }, null, _parent));
      _push(`</span></div><div class="card-body" data-v-62642331><h3 class="card-title" data-v-62642331>${ssrInterpolate(__props.kos.name)}</h3><p class="card-address" data-v-62642331>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "map-pin",
        size: 13,
        class: "pin"
      }, null, _parent));
      _push(`<span data-v-62642331>${ssrInterpolate(__props.kos.address || "Alamat tidak tersedia")}</span></p><div class="card-meta" data-v-62642331>`);
      if (__props.kos.price_range) {
        _push(`<span class="chip chip-price" data-v-62642331>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "tag",
          size: 11
        }, null, _parent));
        _push(` ${ssrInterpolate(__props.kos.price_range)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.kos.city) {
        _push(`<span class="chip chip-city" data-v-62642331>${ssrInterpolate(__props.kos.city)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.kos.district) {
        _push(`<span class="chip chip-district" data-v-62642331>${ssrInterpolate(shortDistrict.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (!__props.kos.rating) {
        _push(`<span class="chip chip-na" data-v-62642331>Belum ada rating</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></article>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/KosCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-62642331"]]);
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_5 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const PAGE_SIZE = 20;
const _sfc_main = {
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const navigate = inject("navigate");
    const toast = inject("toast");
    const kosList = ref([]);
    const loading = ref(false);
    const loadingMore = ref(false);
    const exporting = ref(false);
    const filtering = ref(false);
    const scraping = ref(false);
    const scrapingCity = ref("");
    const scrapeAreas = ref([]);
    const error = ref("");
    const filters = ref({});
    const page = ref(0);
    const total = ref(0);
    let requestSeq = 0;
    let scrapeSeq = 0;
    const initialCity = typeof route.query.city === "string" ? route.query.city : "";
    useHead({
      title: "Jelajahi \u2014 Kos Finder"
    });
    const activeCity = computed(() => filters.value.city || initialCity || "");
    const favoritesOnly = computed(() => !!filters.value.favorites_only);
    function withFavorites(params) {
      if (!params.favorites_only) return params;
      return { ...params, favorite_ids: [...favoriteIds()].join(",") };
    }
    const displayKos = computed(() => {
      if (!favoritesOnly.value) return kosList.value;
      return kosList.value.filter((k) => isFavorite(k));
    });
    const dashSub = computed(() => {
      if (loading.value || scraping.value) {
        return activeCity.value ? `Mencari data untuk ${activeCity.value} dari Google Maps \u2014 ini bisa butuh beberapa saat.` : "Memuat data\u2026";
      }
      if (activeCity.value) {
        return `Hasil pencarian untuk ${activeCity.value}`;
      }
      if (kosList.value.length > 0) {
        return `Menampilkan ${total.value} kos dari ${kosList.value.length} yang tersedia`;
      }
      return "Masukkan nama kota, lalu tekan Cari untuk menarik data dari Google Maps.";
    });
    const sourceCounts = computed(() => {
      const counts = { gmaps: 0 };
      kosList.value.forEach((k) => {
        if (k.source === "gmaps") counts.gmaps += 1;
      });
      return counts;
    });
    const avgRating = computed(() => {
      const rated = kosList.value.filter((k) => k.rating);
      if (!rated.length) return "\u2014";
      const avg = rated.reduce((sum, k) => sum + k.rating, 0) / rated.length;
      return avg.toFixed(1).replace(".", ",");
    });
    function shortDistrict(d) {
      return (d || "").replace(/^Kec\.\s*/i, "");
    }
    function openDetail(id) {
      navigate("detail", { id });
    }
    async function loadKos(params = {}, reset = true) {
      var _a, _b;
      const seq = ++requestSeq;
      if (reset) page.value = 0;
      loading.value = true;
      loadingMore.value = false;
      error.value = "";
      try {
        const res = await fetchKos(withFavorites({ ...params, limit: PAGE_SIZE, offset: page.value * PAGE_SIZE }));
        if (seq !== requestSeq) return;
        if (reset) {
          kosList.value = res.data;
        } else {
          kosList.value = kosList.value.concat(res.data);
        }
        total.value = res.total;
      } catch (e) {
        if (seq !== requestSeq) return;
        error.value = "Gagal memuat data: " + (((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.detail) || e.message);
      } finally {
        if (seq === requestSeq) loading.value = false;
      }
    }
    async function handleScrape({ city, keyword, district, kelurahan }) {
      var _a, _b, _c;
      const myScrape = ++scrapeSeq;
      scraping.value = true;
      scrapingCity.value = city;
      scrapeAreas.value = [];
      error.value = "";
      const params = { city, district: district || void 0, kelurahan: kelurahan || void 0 };
      try {
        const [scrapeRes] = await Promise.allSettled([
          triggerScrape(city, keyword, district, kelurahan),
          loadKos(params, true)
        ]);
        if (myScrape !== scrapeSeq) return;
        if (scrapeRes.status === "fulfilled") {
          addRecentSearch({ city, district, kelurahan, keyword });
          scrapeAreas.value = ((_a = scrapeRes.value) == null ? void 0 : _a.areas) || [];
          filters.value = {
            ...filters.value,
            city,
            district: params.district,
            kelurahan: params.kelurahan,
            search: void 0
          };
          await loadKos(filters.value, true);
        } else {
          const e = scrapeRes.reason;
          const msg = "Gagal scrape: " + (((_c = (_b = e.response) == null ? void 0 : _b.data) == null ? void 0 : _c.detail) || e.message);
          if (kosList.value.length) {
            toast(msg, "error");
          } else {
            error.value = msg;
          }
        }
      } finally {
        if (myScrape === scrapeSeq) scraping.value = false;
      }
    }
    function handleFilter(params) {
      filters.value = { ...params };
      page.value = 0;
      filtering.value = true;
      error.value = "";
      scrapeAreas.value = [];
      const seq = ++requestSeq;
      fetchKos(withFavorites({ ...params, limit: PAGE_SIZE, offset: 0 })).then((res) => {
        if (seq !== requestSeq) return;
        kosList.value = res.data;
        total.value = res.total;
      }).catch((e) => {
        var _a, _b;
        if (seq !== requestSeq) return;
        error.value = "Gagal memuat data: " + (((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.detail) || e.message);
      }).finally(() => {
        if (seq === requestSeq) filtering.value = false;
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppIcon = _sfc_main$3$1;
      const _component_FilterBar = __nuxt_component_1;
      const _component_SkeletonGrid = __nuxt_component_2;
      const _component_StateCard = __nuxt_component_3;
      const _component_KosCard = __nuxt_component_4;
      const _component_ClientOnly = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard" }, _attrs))} data-v-ae1914d5><div class="dash-head" data-v-ae1914d5><div class="dash-heading" data-v-ae1914d5><span class="eyebrow" data-v-ae1914d5>Jelajahi</span><h1 class="dash-title" data-v-ae1914d5>${ssrInterpolate(activeCity.value ? `${activeCity.value} \u2014 kos di sekitarmu` : "Kos-kosan di sekitarmu")}</h1><p class="dash-sub" data-v-ae1914d5>${ssrInterpolate(dashSub.value)}</p></div>`);
      if (!loading.value && kosList.value.length) {
        _push(`<div class="dash-stats" data-v-ae1914d5><div class="dash-stat" data-v-ae1914d5><span class="dash-stat-num" data-v-ae1914d5>${ssrInterpolate(total.value)}</span><span class="dash-stat-label" data-v-ae1914d5>kos tersedia</span></div><div class="dash-stat" data-v-ae1914d5><span class="dash-stat-num dash-stat-gmaps" data-v-ae1914d5>${ssrInterpolate(sourceCounts.value.gmaps)}</span><span class="dash-stat-label" data-v-ae1914d5>Google Maps</span></div><div class="dash-stat" data-v-ae1914d5><span class="dash-stat-num dash-stat-rating" data-v-ae1914d5>${ssrInterpolate(avgRating.value)}</span><span class="dash-stat-label" data-v-ae1914d5>rata-rata rating</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (kosList.value.length && !loading.value) {
        _push(`<button class="btn-export"${ssrIncludeBooleanAttr(!displayKos.value.length || exporting.value) ? " disabled" : ""} data-v-ae1914d5>`);
        if (exporting.value) {
          _push(`<span class="spinner-sm" data-v-ae1914d5></span>`);
        } else {
          _push(ssrRenderComponent(_component_AppIcon, {
            name: "arrow-down",
            size: 16
          }, null, _parent));
        }
        _push(`<span data-v-ae1914d5>${ssrInterpolate(exporting.value ? "Mengekspor\u2026" : "Ekspor CSV")}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_FilterBar, {
        loading: loading.value,
        scraping: scraping.value,
        filters: filters.value,
        "initial-city": unref(initialCity),
        onScrape: handleScrape,
        onFilter: handleFilter
      }, null, _parent));
      if (scrapeAreas.value.length && !loading.value && !scraping.value) {
        _push(`<div class="area-bar" data-v-ae1914d5><span class="area-bar-label" data-v-ae1914d5>`);
        _push(ssrRenderComponent(_component_AppIcon, {
          name: "map-pin",
          size: 13
        }, null, _parent));
        _push(` ${ssrInterpolate(scrapeAreas.value.length)} area ditemukan </span><!--[-->`);
        ssrRenderList(scrapeAreas.value, (area) => {
          _push(`<span class="area-chip" data-v-ae1914d5><span class="area-chip-name" data-v-ae1914d5>${ssrInterpolate(shortDistrict(area.district))}</span><span class="area-chip-count" data-v-ae1914d5>${ssrInterpolate(area.count)}</span></span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value || scraping.value && !kosList.value.length) {
        _push(ssrRenderComponent(_component_SkeletonGrid, null, null, _parent));
      } else if (error.value && !kosList.value.length) {
        _push(ssrRenderComponent(_component_StateCard, {
          type: "error",
          icon: "alert",
          title: "Terjadi kesalahan",
          message: error.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="btn-retry" data-v-ae1914d5${_scopeId}>`);
              _push2(ssrRenderComponent(_component_AppIcon, {
                name: "arrow-right",
                size: 16
              }, null, _parent2, _scopeId));
              _push2(` Coba lagi </button>`);
            } else {
              return [
                createVNode("button", {
                  class: "btn-retry",
                  onClick: ($event) => loadKos()
                }, [
                  createVNode(_component_AppIcon, {
                    name: "arrow-right",
                    size: 16
                  }),
                  createTextVNode(" Coba lagi ")
                ], 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (kosList.value.length) {
        _push(`<div class="content" data-v-ae1914d5><div class="list-wrap" data-v-ae1914d5><div class="${ssrRenderClass([{ "is-filtering": filtering.value || scraping.value && kosList.value.length }, "kos-list"])}" data-v-ae1914d5><!--[-->`);
        ssrRenderList(displayKos.value, (kos) => {
          _push(ssrRenderComponent(_component_KosCard, {
            key: kos.id,
            kos,
            onClick: ($event) => openDetail(kos.id)
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (total.value > kosList.value.length) {
          _push(`<button class="btn-load-more"${ssrIncludeBooleanAttr(loadingMore.value) ? " disabled" : ""} data-v-ae1914d5>`);
          if (loadingMore.value) {
            _push(`<span class="spinner-sm" data-v-ae1914d5></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span data-v-ae1914d5>${ssrInterpolate(loadingMore.value ? "Memuat\u2026" : `Muat lebih banyak (${kosList.value.length}/${total.value})`)}</span></button>`);
        } else {
          _push(`<!---->`);
        }
        if (favoritesOnly.value && !displayKos.value.length) {
          _push(ssrRenderComponent(_component_StateCard, {
            icon: "heart",
            title: "Belum ada kos favorit di daftar ini",
            message: "Klik ikon hati pada kartu kos untuk menyimpannya. Favorit tersimpan di perangkat ini."
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (filtering.value) {
          _push(`<div class="list-overlay" data-v-ae1914d5><span class="spinner-md" data-v-ae1914d5></span><span data-v-ae1914d5>Memfilter\u2026</span></div>`);
        } else if (scraping.value) {
          _push(`<div class="list-overlay" data-v-ae1914d5><span class="spinner-md" data-v-ae1914d5></span><span data-v-ae1914d5>Mencari data baru untuk ${ssrInterpolate(scrapingCity.value)}\u2026</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="map-container" data-v-ae1914d5>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(`</div></div>`);
      } else {
        _push(ssrRenderComponent(_component_StateCard, {
          icon: "buildings",
          title: "Belum ada data kos",
          message: "Masukkan nama kota lalu klik Cari untuk menarik kos-kosan terdekat dari Google Maps."
        }, null, _parent));
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ae1914d5"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-VlEmcsv4.mjs.map
