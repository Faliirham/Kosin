<template>
  <div class="layout">
    <SiteHeader :active-view="activeView" @navigate="navigate" />
    <main id="main-content">
      <slot />
    </main>
    <SiteFooter @navigate="navigate" />
  </div>
</template>

<script setup>
const { activeView } = useActiveView()
const { navigate } = useAppNavigation()
</script>