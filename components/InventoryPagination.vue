<template>
  <ul>
    <li @click="togglePage(1)">First</li>
    <li @click="togglePage('dec')">Prev</li>
    <li
      v-for="page in getRange"
      :key="page"
      :class="{ active: page === value }"
      @click="togglePage(page)"
    >
      {{ page }}
    </li>
    <li @click="togglePage('inc')">Next</li>
    <li @click="togglePage(pages)">Last</li>
  </ul>
</template>

<script>
const range = (start, stop) =>
  Array.from({ length: stop - start + 1 }, (_, i) => start + i)

export default {
  props: {
    pages: {
      type: Number,
      default: () => 0
    },
    value: {
      type: Number,
      default: () => 1
    }
  },
  computed: {
    getRange() {
      if (this.value - 2 <= 1) return range(1, Math.min(5, this.pages))
      if (this.value + 2 >= this.pages) return range(this.pages - 4, this.pages)
      return range(this.value - 2, this.value + 2)
    }
  },
  methods: {
    togglePage(page) {
      if (page === 'inc') page = this.value + 1
      if (page === 'dec') page = this.value - 1
      if (page >= 1 && page <= this.pages) this.$emit('input', page)
    }
  }
}
</script>

<style scoped>
li {
  background: black;
  padding: 0.8rem 0;
  text-align: center;
  width: 3.5rem;
  margin-right: 0.7rem;
  border-radius: 0.5rem;
}

li.active {
  color: #141419;
  background-color: #e9b10b;
}
</style>
