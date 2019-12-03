<template>
  <div>
    <div class="flex flex-wrap justify-between">
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
    <div class="withdraw">
      <div v-if="filteredOrderedAssets.length > 0" class="item-grid">
        <div
          v-for="asset in filteredOrderedAssets"
          :key="asset.assetid"
          class="item"
          @click="toggleSelected(asset)"
        >
          <div
            :class="{
              selected: selectedAssets.includes(asset)
            }"
          />
          <div class="item__inner">
            <div class="item__inner__image">
              <img :src="asset.item.icon_url" />
            </div>
            <div class="item__inner__info">
              {{ asset.item.name }}
              <span class="item__inner__info--price">
                <img src="~/assets/coins.svg" class="coins" alt="coins" />
                {{ asset.item.price }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else-if="filteredOrderedAssets"
        style="height: 100%; background: #1f1f1f;"
      >
        Loading...
      </div>
      <div v-else>
        Failed to load inventory please refresh.
      </div>
      <div class="selected-item-grid">
        <div
          v-for="asset in selectedAssets"
          :key="asset.assetid"
          class="selected-item"
          @click="toggleSelected(asset)"
        >
          <img :src="asset.item.icon_url" style="width:100px" />
          {{ asset.item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      search: '',
      assets: [],
      selectedAssets: [],
      selectedOwner: null,
      sortOrder: {
        options: ['Highest to lowest', 'Lowest to highest'],
        selectedOption: 'Highest to lowest'
      }
    }
  },
  computed: {
    filteredOrderedAssets() {
      const regex = new RegExp('(' + this.search + ')', 'i')
      const order =
        this.sortOrder.options.indexOf(this.sortOrder.selectedOption) === 0
          ? 1
          : -1
      const ownerFilteredAssets = this.selectedOwner
        ? this.assets.filter((asset) => asset.owner === this.selectedOwner)
        : this.assets
      return ownerFilteredAssets
        .filter((asset) => {
          return asset.item.name.match(regex)
        })
        .sort((a, b) => {
          if (a.item.price < b.item.price) {
            return 1 * order
          }
          if (a.item.price > b.item.price) {
            return -1 * order
          }
          return 0
        })
    }
  },
  mounted() {
    axios
      .get('/graphql', {
        params: {
          query:
            '{allMarketOrders{owner,assetid,item{name,icon_url,quality_color,price}}}'
        }
      })
      .then((res) => (this.assets = res.data.data.allMarketOrders))
      .catch((e) => (this.assets = null))
  },
  methods: {
    toggleSelected(asset) {
      if (this.selectedAssets.includes(asset)) {
        this.selectedAssets = this.selectedAssets.filter(
          (item) => item !== asset
        )
        if (this.selectedAssets.length === 0) this.selectedOwner = null
      } else {
        this.selectedAssets.push(asset)
        this.selectedOwner = asset.owner
      }
    }
  }
}
</script>

<style scoped>
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  grid-template-rows: repeat(auto-fill, 283px);
  grid-column-gap: 1.25rem;
  grid-row-gap: 2.1875rem;
}

.withdraw {
  display: grid;
  grid-template-columns: 1fr 20rem;
  grid-column-gap: 1.5rem;
  margin: 1.5rem 0;
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

.item__inner__info--price {
  position: absolute;
  right: 0.2rem;
  bottom: 0.2rem;
  background-color: #191919;
  color: white;
  padding: 0.4rem 0.7rem;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
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

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.justify-between {
  justify-content: space-between;
}

.input {
  flex: 1 1 0%;
  display: flex;
  align-items: center;
  max-width: 18rem;
  min-width: 10rem;
  border-radius: 0.5rem;
  background: white;
}

.search {
  height: 1.5rem;
  margin-left: 1rem;
  user-select: none;
}

input {
  position: relative;
  width: 100%;
  height: 3.125rem;
  background-color: white;
  border-radius: 0.25rem;
  padding-left: 0.9rem;
  padding-right: 0.9rem;
  font-size: 1.1rem;
  border: none;
  color: #373737;
  outline: none;
}

select {
  border-radius: 0.25rem;
}
</style>
