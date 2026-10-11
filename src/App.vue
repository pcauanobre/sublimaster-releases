<template>
  <!-- troca de página: a atual some e a nova entra, no mesmo efeito -->
  <RouterView v-slot="{ Component }">
    <Transition name="pagina" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
