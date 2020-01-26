<template>
  <div>
    <article
      v-for="asset in sortedItems"
      :key="asset.assetid"
      class="item"
      @click="toggleSelected(asset)"
    >
      <div
        :class="{
          selected: selecteditems.some((item) => item === asset)
        }"
      />
      <div class="item__inner">
        <figure class="item__inner__image">
          <img :src="asset.item.icon_url" />
        </figure>
        <section class="item__inner__info">
          {{ asset.item.name }}
          <span class="item__inner__info__price">
            <img src="~/assets/coins.svg" class="coins" alt="coins" />
            {{ asset.item.price }}
          </span>
        </section>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    selecteditems: {
      type: Array,
      default: () => []
    },
    sortOrder: {
      type: Number,
      default: () => 0
    }
  },
  computed: {
    sortedItems() {
      // prettier-ignore
      return (() => [
        [...this.items].sort((a, b) => a.assetid - b.assetid).reverse(),
        [...this.items].sort((a, b) => a.assetid - b.assetid)
      ][this.sortOrder])()
    }
  },
  methods: {
    toggleSelected(asset) {
      if (this.selecteditems.includes(asset))
        this.selecteditems = this.selecteditems.filter((item) => item !== asset)
      else this.selecteditems.push(asset)

      // Emit for two way binding
      this.$emit('updated-selected-items', this.selecteditems)
    }
  }
}
</script>

<style scoped>
.selected-item-grid {
  top: 1.5rem;
  background: #1f1f1f;
  position: sticky;
  padding: 1.5rem;
}

.item {
  position: relative;
  background: white;
  color: #373737;
  border-radius: 0.7rem;
  padding: 0.3rem;
}

.selected-item {
  display: flex;
  background: white;
  color: #373737;
  padding: 0.3rem;
}

.item__inner {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}

.item__inner__image {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  background: radial-gradient(#f5f5f5, #bebebe);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.item__inner__image img {
  width: 80%;
}

.item__inner__info {
  position: relative;
  padding: 0.8rem;
  padding-bottom: 2.8rem;
}

.item__inner__info__price {
  position: absolute;
  right: 0.2rem;
  bottom: 0.2rem;
  background-color: #191919;
  color: white;
  padding: 0.4rem 0.7rem;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  align-items: center;
}

.coins {
  height: 0.75rem;
  margin-right: 0.2rem;
}

.selected {
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  top: 0rem;
  left: 0rem;
  background: rgba(255, 225, 36, 0.08);
  border: 2px solid;
  border-color: #ffe124;
  border-radius: 10px;
}
</style>
