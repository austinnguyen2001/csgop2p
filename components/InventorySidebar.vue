<template>
  <div class="selected-items">
    <div class="selected-items__flex">
      <article
        v-for="assetObj in selectedAssets"
        :key="assetObj.asset.assetid"
        class="item flex"
        @click="toggleSelected(assetObj)"
      >
        <img :src="assetObj.asset.item.icon_url" />
        <div>
          {{ assetObj.asset.item.name }} <br />
          <img src="~/assets/coins.svg" class="coins" alt="coins" />
          {{ assetObj.asset.item.price }}
        </div>
      </article>
    </div>
    <div class="selected-items__foot">
      <div class="selected-items__foot__price">
        You will spend
        <img src="~/assets/coins.svg" class="coins" alt="coins" />
        {{ totalPrice }}
      </div>
      <div class="selected-items__foot__buy">
        Buy {{ selectedAssets.length }} items
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    assets: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selectedAssets() {
      return this.assets.filter((assetObj) => assetObj.selected)
    },
    totalPrice() {
      // prettier-ignore
      return Math.round((this.selectedAssets.reduce((acc, curr) => acc + curr.asset.item.price, 0) + Number.EPSILON) * 100) / 100
    }
  },
  methods: {
    toggleSelected(assetObj) {
      assetObj.selected = !assetObj.selected

      // Emit for two way binding
      this.$emit('updated-assets', this.assets)
    }
  }
}
</script>

<style scoped>
.selected-items {
  background: black;
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 9rem);
}

.selected-items__flex {
  height: 80%;
  overflow: auto;
}

.selected-items__flex > .item {
  display: flex;
  width: 90%;
  margin: auto;
  justify-content: space-between;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: right;
  margin-top: 1rem;
}

.selected-items__foot {
  background: #333541;
  height: 20%;
  padding: 1rem;
  text-align: center;
}

.selected-items__foot__price {
  background: black;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.selected-items__foot__buy {
  background: #e9b10b;
  padding: 1rem;
}

.item > img {
  width: 40%;
}
</style>
