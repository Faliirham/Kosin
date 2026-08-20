
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


export const AppIcon: typeof import("../components/AppIcon.vue")['default']
export const FilterBar: typeof import("../components/FilterBar.vue")['default']
export const KosCard: typeof import("../components/KosCard.vue")['default']
export const MapView: typeof import("../components/MapView.vue")['default']
export const SiteFooter: typeof import("../components/SiteFooter.vue")['default']
export const SiteHeader: typeof import("../components/SiteHeader.vue")['default']
export const SkeletonGrid: typeof import("../components/SkeletonGrid.vue")['default']
export const StateCard: typeof import("../components/StateCard.vue")['default']
export const GallerySection: typeof import("../components/detail/GallerySection.vue")['default']
export const InfoSection: typeof import("../components/detail/InfoSection.vue")['default']
export const ScrollProgress: typeof import("../components/effects/ScrollProgress.vue")['default']
export const CitiesSection: typeof import("../components/landing/CitiesSection.vue")['default']
export const CtaBand: typeof import("../components/landing/CtaBand.vue")['default']
export const FeaturesSection: typeof import("../components/landing/FeaturesSection.vue")['default']
export const HeroSection: typeof import("../components/landing/HeroSection.vue")['default']
export const HowItWorks: typeof import("../components/landing/HowItWorks.vue")['default']
export const StatsBand: typeof import("../components/landing/StatsBand.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAppIcon: LazyComponent<typeof import("../components/AppIcon.vue")['default']>
export const LazyFilterBar: LazyComponent<typeof import("../components/FilterBar.vue")['default']>
export const LazyKosCard: LazyComponent<typeof import("../components/KosCard.vue")['default']>
export const LazyMapView: LazyComponent<typeof import("../components/MapView.vue")['default']>
export const LazySiteFooter: LazyComponent<typeof import("../components/SiteFooter.vue")['default']>
export const LazySiteHeader: LazyComponent<typeof import("../components/SiteHeader.vue")['default']>
export const LazySkeletonGrid: LazyComponent<typeof import("../components/SkeletonGrid.vue")['default']>
export const LazyStateCard: LazyComponent<typeof import("../components/StateCard.vue")['default']>
export const LazyGallerySection: LazyComponent<typeof import("../components/detail/GallerySection.vue")['default']>
export const LazyInfoSection: LazyComponent<typeof import("../components/detail/InfoSection.vue")['default']>
export const LazyScrollProgress: LazyComponent<typeof import("../components/effects/ScrollProgress.vue")['default']>
export const LazyCitiesSection: LazyComponent<typeof import("../components/landing/CitiesSection.vue")['default']>
export const LazyCtaBand: LazyComponent<typeof import("../components/landing/CtaBand.vue")['default']>
export const LazyFeaturesSection: LazyComponent<typeof import("../components/landing/FeaturesSection.vue")['default']>
export const LazyHeroSection: LazyComponent<typeof import("../components/landing/HeroSection.vue")['default']>
export const LazyHowItWorks: LazyComponent<typeof import("../components/landing/HowItWorks.vue")['default']>
export const LazyStatsBand: LazyComponent<typeof import("../components/landing/StatsBand.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
