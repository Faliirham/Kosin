import { ref, mergeProps, inject, computed, watch, resolveDirective, useSSRContext } from 'file://C:/kos-finder/frontend/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrGetDirectiveProps } from 'file://C:/kos-finder/frontend/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc, f as useAppNavigation, d as _sfc_main$3$1 } from './server.mjs';
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

const heroImg = "https://picsum.photos/seed/kos-finder-hero/900/1150";
const altHero = "Suasana kamar kos yang hangat dan nyaman";
const _sfc_main$6 = {
  __name: "HeroSection",
  __ssrInlineRender: true,
  emits: ["go-city"],
  setup(__props, { emit: __emit }) {
    inject("toast");
    const city = ref("");
    const popularCities = ["Bandung", "Jakarta", "Yogyakarta", "Surabaya", "Malang", "Semarang"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero" }, _attrs))} data-v-3b21a231><div class="hero-bg" aria-hidden="true" data-v-3b21a231><img class="hero-photo"${ssrRenderAttr("src", heroImg)} alt="" data-v-3b21a231><div class="hero-tint" data-v-3b21a231></div><div class="aurora" data-v-3b21a231><span class="aurora-blob" style="${ssrRenderStyle({ "width": "460px", "height": "460px", "left": "-160px", "top": "-140px", "background": "radial-gradient(circle, rgba(96, 165, 250, 0.5), transparent 70%)" })}" data-v-3b21a231></span><span class="aurora-blob" style="${ssrRenderStyle({ "width": "380px", "height": "380px", "right": "26%", "top": "-80px", "background": "radial-gradient(circle, rgba(129, 140, 248, 0.4), transparent 70%)" })}" data-v-3b21a231></span><span class="aurora-blob" style="${ssrRenderStyle({ "width": "340px", "height": "340px", "right": "-60px", "bottom": "-140px", "background": "radial-gradient(circle, rgba(37, 99, 235, 0.5), transparent 70%)" })}" data-v-3b21a231></span></div></div><div class="hero-inner" data-v-3b21a231><div class="hero-copy" data-v-3b21a231><span class="hero-badge" data-v-3b21a231>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "map-pin",
        size: 14
      }, null, _parent));
      _push(` Data langsung dari Google Maps </span><h1 class="hero-title" data-v-3b21a231> Temukan kos yang <em class="shine" data-v-3b21a231>terasa seperti rumah</em></h1><p class="hero-sub" data-v-3b21a231> Telusuri ribuan kos-kosan di seluruh Indonesia \u2014 lengkap dengan rating asli, foto, dan lokasi presisi. Tidak perlu jalan keliling lagi. </p><form class="hero-search" data-v-3b21a231>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "search",
        class: "search-mark",
        size: 20
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", city.value)} type="text" placeholder="Masukkan kota \u2014 Bandung, Jakarta, Yogyakarta\u2026" aria-label="Nama kota" data-v-3b21a231><button type="submit" data-v-3b21a231> Cari kos `);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "arrow-right",
        size: 17
      }, null, _parent));
      _push(`</button></form><div class="hero-popular" data-v-3b21a231><span class="popular-label" data-v-3b21a231>Populer:</span><!--[-->`);
      ssrRenderList(popularCities, (c) => {
        _push(`<button class="popular-chip" data-v-3b21a231>${ssrInterpolate(c)}</button>`);
      });
      _push(`<!--]--></div></div><div class="hero-visual" data-v-3b21a231><div class="hero-card-main" data-v-3b21a231><img${ssrRenderAttr("src", heroImg)}${ssrRenderAttr("alt", altHero)} data-v-3b21a231><div class="hero-card-shade" data-v-3b21a231></div><div class="hero-card-live" data-v-3b21a231><span class="live-dot" data-v-3b21a231></span> Live dari Google Maps </div></div><div class="float-card float-top" data-v-3b21a231><span class="float-icon" data-v-3b21a231>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "star",
        filled: "",
        size: 18
      }, null, _parent));
      _push(`</span><div data-v-3b21a231><strong data-v-3b21a231>4,6</strong><span data-v-3b21a231>rata-rata rating</span></div></div><div class="float-card float-bottom" data-v-3b21a231><span class="float-icon" data-v-3b21a231>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "map-pin",
        size: 18
      }, null, _parent));
      _push(`</span><div data-v-3b21a231><strong data-v-3b21a231>30+ kota</strong><span data-v-3b21a231>tercakup di Indonesia</span></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/HeroSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-3b21a231"]]);
const _sfc_main$5 = {
  __name: "StatsBand",
  __ssrInlineRender: true,
  props: {
    stats: { type: Object, default: () => ({ total: "1.200+", cities: "30+", rating: "4,6" }) }
  },
  setup(__props) {
    const props = __props;
    const items = computed(() => [
      { key: "total", label: "kos tercatat", raw: props.stats.total },
      { key: "cities", label: "kota tercakup", raw: props.stats.cities },
      { key: "rating", label: "rata-rata rating", raw: props.stats.rating },
      { key: "cache", label: "cache detail Google", raw: "24 jam" }
    ]);
    const sectionRef = ref(null);
    ref({});
    function display(it) {
      return it.raw;
    }
    watch(
      () => props.stats,
      () => {
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_reveal = resolveDirective("reveal");
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "sectionRef",
        ref: sectionRef,
        class: "stats-band",
        "aria-label": "Statistik"
      }, _attrs))} data-v-57c4e295><div${ssrRenderAttrs(mergeProps({ class: "stats-inner" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-57c4e295><!--[-->`);
      ssrRenderList(items.value, (it, i) => {
        _push(`<!--[--><div class="stat-item" data-v-57c4e295><span class="stat-value" data-v-57c4e295>${ssrInterpolate(display(it))}</span><span class="stat-label" data-v-57c4e295>${ssrInterpolate(it.label)}</span></div>`);
        if (i < items.value.length - 1) {
          _push(`<div class="stat-divider" aria-hidden="true" data-v-57c4e295></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/StatsBand.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const StatsBand = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-57c4e295"]]);
const imgRoom1 = "https://picsum.photos/seed/kos-room-1/1000/700";
const imgRoom2 = "https://picsum.photos/seed/kos-room-2/800/1000";
const altRoom1 = "Kamar kos dengan pencahayaan alami";
const altRoom2 = "Sudut kamar kos yang rapi dan modern";
const _sfc_main$4 = {
  __name: "FeaturesSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_reveal = resolveDirective("reveal");
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "section",
        id: "fitur"
      }, _attrs))} data-v-aac62a6a><div${ssrRenderAttrs(mergeProps({ class: "section-head" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-aac62a6a><span class="eyebrow" data-v-aac62a6a>Kenapa Kos Finder</span><h2 class="section-title" data-v-aac62a6a>Cari kos lebih pintar,<br data-v-aac62a6a>bukan lebih capek</h2><p class="section-sub" data-v-aac62a6a> Kami menggabungkan data Google Maps dengan tampilan yang jujur, supaya kamu bisa membandingkan kos tanpa harus keliling kota satu per satu. </p></div><div class="bento" data-v-aac62a6a><article${ssrRenderAttrs(mergeProps({ class: "bento-card bento-photo" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-aac62a6a><img${ssrRenderAttr("src", imgRoom1)}${ssrRenderAttr("alt", altRoom1)} data-v-aac62a6a><div class="bento-shade" data-v-aac62a6a></div><div class="bento-caption" data-v-aac62a6a><h3 data-v-aac62a6a>Lihat kondisi kos sebelum datang</h3><p data-v-aac62a6a>Foto di-resolve langsung dari Google saat kamu membuka detail kos.</p></div></article><article${ssrRenderAttrs(mergeProps({ class: "bento-card bento-accent spotlight" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-aac62a6a><span class="bento-icon" data-v-aac62a6a>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "star",
        filled: "",
        size: 22
      }, null, _parent));
      _push(`</span><h3 data-v-aac62a6a>Rating asli</h3><p data-v-aac62a6a>Penilaian dan ulasan diambil langsung dari Google Maps \u2014 bukan angka rekaan.</p></article><article${ssrRenderAttrs(mergeProps({ class: "bento-card spotlight" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-aac62a6a><span class="bento-icon" data-v-aac62a6a>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "map-pin",
        size: 22
      }, null, _parent));
      _push(`</span><h3 data-v-aac62a6a>Peta presisi</h3><p data-v-aac62a6a>Google Maps menampilkan posisi tiap kos secara akurat, dekat dengan kampus atau kantormu.</p></article><article${ssrRenderAttrs(mergeProps({ class: "bento-card spotlight" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-aac62a6a><span class="bento-icon" data-v-aac62a6a>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "layers",
        size: 22
      }, null, _parent));
      _push(`</span><h3 data-v-aac62a6a>Update otomatis</h3><p data-v-aac62a6a>Re-scrape menyegarkan data lama secara langsung, tanpa duplikat dan tanpa data basi.</p></article><article${ssrRenderAttrs(mergeProps({ class: "bento-card bento-photo bento-photo-tall" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-aac62a6a><img${ssrRenderAttr("src", imgRoom2)}${ssrRenderAttr("alt", altRoom2)} data-v-aac62a6a><div class="bento-shade" data-v-aac62a6a></div><div class="bento-caption" data-v-aac62a6a><h3 data-v-aac62a6a>Bandingkan dalam satu tampilan</h3><p data-v-aac62a6a>Rating, harga, dan lokasi tersaji berdampingan.</p></div></article></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/FeaturesSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const FeaturesSection = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-aac62a6a"]]);
const _sfc_main$3 = {
  __name: "HowItWorks",
  __ssrInlineRender: true,
  emits: ["go-city"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_reveal = resolveDirective("reveal");
      const _directive_magnetic = resolveDirective("magnetic");
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "section section-alt",
        id: "cara-kerja"
      }, _attrs))} data-v-827c9637><div class="section-head" data-v-827c9637><span class="eyebrow" data-v-827c9637>Cara kerja</span><h2 class="section-title" data-v-827c9637>Tiga langkah sederhana</h2></div><div class="steps" data-v-827c9637><article${ssrRenderAttrs(mergeProps({ class: "step spotlight" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-827c9637><span class="step-num" data-v-827c9637>01</span><div class="step-body" data-v-827c9637><h3 data-v-827c9637>Masukkan kota</h3><p data-v-827c9637>Tulis kota atau kecamatan tujuanmu. Kosongkan jika ingin melihat semua.</p></div></article><div class="step-connector" aria-hidden="true" data-v-827c9637><span class="connector-line" data-v-827c9637></span>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "arrow-right",
        size: 18
      }, null, _parent));
      _push(`<span class="connector-line" data-v-827c9637></span></div><article${ssrRenderAttrs(mergeProps({ class: "step spotlight" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-827c9637><span class="step-num" data-v-827c9637>02</span><div class="step-body" data-v-827c9637><h3 data-v-827c9637>Kami cari dari Google Maps</h3><p data-v-827c9637>Scraper menarik data kos terdekat \u2014 nama, alamat, rating, hingga rentang harga.</p></div></article><div class="step-connector" aria-hidden="true" data-v-827c9637><span class="connector-line" data-v-827c9637></span>`);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "arrow-right",
        size: 18
      }, null, _parent));
      _push(`<span class="connector-line" data-v-827c9637></span></div><article${ssrRenderAttrs(mergeProps({ class: "step spotlight" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-827c9637><span class="step-num" data-v-827c9637>03</span><div class="step-body" data-v-827c9637><h3 data-v-827c9637>Bandingkan &amp; pilih</h3><p data-v-827c9637>Filter rating, urutkan, dan buka detail kos favoritmu dalam hitungan detik.</p></div></article></div><div${ssrRenderAttrs(mergeProps({ class: "cta-row" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-827c9637><button${ssrRenderAttrs(mergeProps({ class: "btn-primary-lg" }, ssrGetDirectiveProps(_ctx, _directive_magnetic)))} data-v-827c9637> Mulai cari kos `);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "arrow-right",
        size: 18
      }, null, _parent));
      _push(`</button></div></section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/HowItWorks.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const HowItWorks = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-827c9637"]]);
const _sfc_main$2 = {
  __name: "CitiesSection",
  __ssrInlineRender: true,
  emits: ["go-city"],
  setup(__props) {
    const cityCards = [
      { name: "Bandung", meta: "\xB13.500 kos \xB7 Jawa Barat" },
      { name: "Jakarta", meta: "\xB14.800 kos \xB7 DKI Jakarta" },
      { name: "Yogyakarta", meta: "\xB12.900 kos \xB7 DI Yogyakarta" },
      { name: "Surabaya", meta: "\xB12.200 kos \xB7 Jawa Timur" },
      { name: "Malang", meta: "\xB11.800 kos \xB7 Jawa Timur" },
      { name: "Semarang", meta: "\xB11.400 kos \xB7 Jawa Tengah" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_reveal = resolveDirective("reveal");
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "section",
        id: "kota"
      }, _attrs))} data-v-a178144c><div${ssrRenderAttrs(mergeProps({ class: "section-head" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-a178144c><span class="eyebrow" data-v-a178144c>Kota populer</span><h2 class="section-title" data-v-a178144c>Mau pindah ke mana?</h2><p class="section-sub" data-v-a178144c>Pilih kota favoritmu untuk langsung melihat kos-kosan di sekitarnya.</p></div><div class="city-grid" data-v-a178144c><!--[-->`);
      ssrRenderList(cityCards, (c, i) => {
        _push(`<button${ssrRenderAttrs(mergeProps({
          key: c.name,
          class: ["city-card spotlight", { "city-card-featured": i === 0 }]
        }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-a178144c><span class="city-icon" data-v-a178144c>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "buildings",
          size: 22
        }, null, _parent));
        _push(`</span><span class="city-text" data-v-a178144c><span class="city-name" data-v-a178144c>${ssrInterpolate(c.name)}</span><span class="city-meta" data-v-a178144c>${ssrInterpolate(c.meta)}</span></span>`);
        _push(ssrRenderComponent(_sfc_main$3$1, {
          name: "arrow-up-right",
          class: "city-arrow",
          size: 18
        }, null, _parent));
        _push(`</button>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/CitiesSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const CitiesSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a178144c"]]);
const _sfc_main$1 = {
  __name: "CtaBand",
  __ssrInlineRender: true,
  emits: ["go-city"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_magnetic = resolveDirective("magnetic");
      const _directive_reveal = resolveDirective("reveal");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "cta-band" }, _attrs))} data-v-629c203d><div${ssrRenderAttrs(mergeProps({ class: "cta-inner" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-629c203d><div class="aurora" aria-hidden="true" data-v-629c203d><span class="aurora-blob" style="${ssrRenderStyle({ "width": "420px", "height": "420px", "left": "-140px", "top": "-160px", "background": "radial-gradient(circle, rgba(37, 99, 235, 0.55), transparent 70%)" })}" data-v-629c203d></span><span class="aurora-blob" style="${ssrRenderStyle({ "width": "340px", "height": "340px", "right": "-80px", "top": "-100px", "background": "radial-gradient(circle, rgba(96, 165, 250, 0.5), transparent 70%)" })}" data-v-629c203d></span><span class="aurora-blob" style="${ssrRenderStyle({ "width": "300px", "height": "300px", "left": "38%", "bottom": "-180px", "background": "radial-gradient(circle, rgba(129, 140, 248, 0.4), transparent 70%)" })}" data-v-629c203d></span></div><h2 class="cta-title" data-v-629c203d>Siap pindah? Mulai cari kosmu sekarang.</h2><p class="cta-sub" data-v-629c203d>Gratis, tanpa daftar, dan langsung menampilkan data dari Google Maps.</p><button${ssrRenderAttrs(mergeProps({ class: "btn-light-lg" }, ssrGetDirectiveProps(_ctx, _directive_magnetic)))} data-v-629c203d> Jelajahi kos `);
      _push(ssrRenderComponent(_sfc_main$3$1, {
        name: "arrow-right",
        size: 18
      }, null, _parent));
      _push(`</button></div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/CtaBand.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CtaBand = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-629c203d"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigate } = useAppNavigation();
    const stats = ref({ total: "1.200+", cities: "30+", rating: "4,6" });
    function goCity(c) {
      navigate("dashboard", { city: c.trim() });
    }
    useHead({
      title: "Kos Finder \u2014 Temukan kos yang terasa seperti rumah"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "landing" }, _attrs))} data-v-e25a8b26>`);
      _push(ssrRenderComponent(HeroSection, { onGoCity: goCity }, null, _parent));
      _push(ssrRenderComponent(StatsBand, { stats: stats.value }, null, _parent));
      _push(ssrRenderComponent(FeaturesSection, null, null, _parent));
      _push(ssrRenderComponent(HowItWorks, { onGoCity: goCity }, null, _parent));
      _push(ssrRenderComponent(CitiesSection, { onGoCity: goCity }, null, _parent));
      _push(ssrRenderComponent(CtaBand, { onGoCity: goCity }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e25a8b26"]]);

export { index as default };
//# sourceMappingURL=index-Bc4EmsKU.mjs.map
