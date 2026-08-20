
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AppIcon: typeof import("../../components/AppIcon.vue")['default']
  FilterBar: typeof import("../../components/FilterBar.vue")['default']
  KosCard: typeof import("../../components/KosCard.vue")['default']
  MapView: typeof import("../../components/MapView.vue")['default']
  SiteFooter: typeof import("../../components/SiteFooter.vue")['default']
  SiteHeader: typeof import("../../components/SiteHeader.vue")['default']
  SkeletonGrid: typeof import("../../components/SkeletonGrid.vue")['default']
  StateCard: typeof import("../../components/StateCard.vue")['default']
  GallerySection: typeof import("../../components/detail/GallerySection.vue")['default']
  InfoSection: typeof import("../../components/detail/InfoSection.vue")['default']
  ScrollProgress: typeof import("../../components/effects/ScrollProgress.vue")['default']
  CitiesSection: typeof import("../../components/landing/CitiesSection.vue")['default']
  CtaBand: typeof import("../../components/landing/CtaBand.vue")['default']
  FeaturesSection: typeof import("../../components/landing/FeaturesSection.vue")['default']
  HeroSection: typeof import("../../components/landing/HeroSection.vue")['default']
  HowItWorks: typeof import("../../components/landing/HowItWorks.vue")['default']
  StatsBand: typeof import("../../components/landing/StatsBand.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAppIcon: LazyComponent<typeof import("../../components/AppIcon.vue")['default']>
  LazyFilterBar: LazyComponent<typeof import("../../components/FilterBar.vue")['default']>
  LazyKosCard: LazyComponent<typeof import("../../components/KosCard.vue")['default']>
  LazyMapView: LazyComponent<typeof import("../../components/MapView.vue")['default']>
  LazySiteFooter: LazyComponent<typeof import("../../components/SiteFooter.vue")['default']>
  LazySiteHeader: LazyComponent<typeof import("../../components/SiteHeader.vue")['default']>
  LazySkeletonGrid: LazyComponent<typeof import("../../components/SkeletonGrid.vue")['default']>
  LazyStateCard: LazyComponent<typeof import("../../components/StateCard.vue")['default']>
  LazyGallerySection: LazyComponent<typeof import("../../components/detail/GallerySection.vue")['default']>
  LazyInfoSection: LazyComponent<typeof import("../../components/detail/InfoSection.vue")['default']>
  LazyScrollProgress: LazyComponent<typeof import("../../components/effects/ScrollProgress.vue")['default']>
  LazyCitiesSection: LazyComponent<typeof import("../../components/landing/CitiesSection.vue")['default']>
  LazyCtaBand: LazyComponent<typeof import("../../components/landing/CtaBand.vue")['default']>
  LazyFeaturesSection: LazyComponent<typeof import("../../components/landing/FeaturesSection.vue")['default']>
  LazyHeroSection: LazyComponent<typeof import("../../components/landing/HeroSection.vue")['default']>
  LazyHowItWorks: LazyComponent<typeof import("../../components/landing/HowItWorks.vue")['default']>
  LazyStatsBand: LazyComponent<typeof import("../../components/landing/StatsBand.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
