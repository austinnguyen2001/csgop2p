<template>
  <div>
    <div class="flex flex-wrap justify-between" style="margin-bottom: 1rem">
      <div class="input">
        <img
          src="~/assets/search.svg"
          draggable="false"
          class="search"
          alt="Search"
        />
        <input v-model="search" type="text" placeholder="Search" />
      </div>
      <select v-model="sortOrder.selectedOption">
        <option
          v-for="option in sortOrder.options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <span>{{ sortedFilteredAssets.length }} Available Items</span>
    <InventoryPagination
      v-if="Math.ceil(assets.length / assetsPerPage) > 1"
      v-model="currentPage"
      :pages="Math.ceil(assets.length / assetsPerPage)"
      class="pagination flex"
    />
    <div class="item-grid">
      <article
        v-for="assetObj in displayedAssets"
        :key="assetObj.asset.assetid"
        class="item"
        @click="toggleSelected(assetObj)"
      >
        <div
          :class="{
            selected: assetObj.selected
          }"
        />
        <div class="item__inner">
          <figure class="item__inner__image">
            <img :src="assetObj.asset.item.icon_url" />
          </figure>
          <section class="item__inner__info">
            {{ assetObj.asset.item.name }}
            <span class="item__inner__info__price">
              <img src="~/assets/coins.svg" class="coins" alt="coins" />
              {{ assetObj.asset.item.price }}
            </span>
          </section>
        </div>
      </article>
    </div>
    <InventoryPagination
      v-if="Math.ceil(assets.length / assetsPerPage) > 1"
      v-model="currentPage"
      :pages="Math.ceil(assets.length / assetsPerPage)"
      class="pagination flex"
    />
  </div>
</template>

<script>
import InventoryPagination from './InventoryPagination'

export default {
  components: {
    InventoryPagination
  },
  props: {
    assets: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    currentPage: 1,
    assetsPerPage: 32,
    search: '',
    sortOrder: {
      options: ['Highest to lowest', 'Lowest to highest'],
      selectedOption: 'Highest to lowest'
    }
  }),
  computed: {
    sortedFilteredAssets() {
      const regex = new RegExp('(' + this.search + ')', 'i')
      let selectedOwner = this.assets.filter((assetObj) => assetObj.selected)
      if (selectedOwner.length > 0) selectedOwner = selectedOwner[0].asset.owner

      const filteredArray = this.assets.filter((assetObj) =>
        assetObj.selected &&
        assetObj.asset.item.name.match(regex) &&
        typeof selectedOwner === 'string'
          ? assetObj.asset.owner === selectedOwner
          : true
      )

      const sortedFilteredArray = filteredArray.sort(
        (a, b) => a.asset.item.price - b.asset.item.price
      )
      // prettier-ignore
      return [
        [...sortedFilteredArray].reverse(),
        [...sortedFilteredArray]
      ][this.sortOrder.options.indexOf(this.sortOrder.selectedOption)]
    },
    displayedAssets() {
      return this.sortedFilteredAssets.slice(
        (this.currentPage - 1) * this.assetsPerPage,
        this.currentPage * this.assetsPerPage
      )
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
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  grid-template-rows: repeat(4, 283px);
  grid-column-gap: 1.25rem;
  grid-row-gap: 2.1875rem;
}

.pagination {
  margin: 2rem 0;
}

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
