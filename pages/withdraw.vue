<template>
  <div>
    <main class="withdraw">
      <Inventory
        v-if="load && assets"
        :assets="assets"
        @update-assets="assets = $event"
      />
      <div v-else-if="load && !assets">
        Your inventory is empty
      </div>
      <div v-else>
        Loading inventory...
      </div>
      <InventorySidebar :assets="assets" @update-assets="assets = $event" />
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import Inventory from '~/components/Inventory'
import InventorySidebar from '~/components/InventorySidebar'

export default {
  components: {
    Inventory,
    InventorySidebar
  },
  data: () => ({
    load: false,
    assets: []
  }),
  mounted() {
    axios
      .get(
        '/graphql?query={getMarketOrders{owner,assetid,item{name,icon_url,quality_color,price}}}'
      )
      .then((res) => {
        this.assets = res.data.data.getMarketOrders.map((asset) => ({
          asset,
          selected: false
        }))
        this.load = true
      })
  }
}
</script>

<style>
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
