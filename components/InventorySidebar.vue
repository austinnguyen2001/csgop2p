<template>
  <div>
    <article
      v-for="asset in selecteditems"
      :key="asset.assetid"
      class="item"
      @click="toggleSelected(asset.assetid)"
    >
      {{ JSON.stringify(selecteditems) }}
    </article>
  </div>
</template>

<script>
export default {
  props: {
    selecteditems: {
      type: Array,
      default: () => []
    }
  }
}
</script>
