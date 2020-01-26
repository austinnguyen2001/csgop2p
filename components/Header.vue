<template>
  <div>
    <div class="app__header__left">
      <n-link to="/" class="logo"> Logo </n-link>
    </div>
    <div class="app__header__right">
      <n-link to="/deposit" class="button button--slanted blue">
        <span class="button--slanted--content">
          deposit
        </span>
      </n-link>
      <n-link to="/withdraw" class="button button--slanted pink">
        <span class="button--slanted--content">
          withdraw
        </span>
      </n-link>
      <div v-if="user" class="app__header__right--profile">
        <span>
          <div>{{ user.personaname }}</div>
          <div>
            <img src="~/assets/coins.svg" class="coins" alt="coins" />
            {{ user.balance }}
          </div>
        </span>
        <img :src="user.avatar" class="avatar" alt="Profile Image" />
        <a href="http://localhost:4000/logout">
          <img src="~/assets/logout.svg" class="logout" alt="Logout" />
        </a>
      </div>
      <div v-else class="app__header__right--signin ">
        <a
          href="http://localhost:4000/auth/steam"
          class="button button--slanted red"
        >
          <span class="button--slanted--content">
            Sign in with Steam
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.client.user
    }
  }
}
</script>

<style scoped>
.logo {
  color: #373737;
}

.coins {
  height: 0.75rem;
  margin-right: 0.2rem;
}

.logout {
  height: 1rem;
  margin: 0 1rem;
}

.avatar {
  width: 2.7rem;
  height: 2.7rem;
  margin-left: 1rem;
}

.app__header__left {
  grid-area: logo;
  align-self: center;
}

.app__header__right {
  grid-area: profile;
  align-self: center;
  display: flex;
}

.app__header__right--profile {
  display: flex;
  align-items: center;
  margin-left: 2rem;
}

.button {
  color: white;
  text-align: center;
  text-transform: uppercase;
  padding: 1.7rem 2rem;
  height: 4.5rem;
  display: inline-block;
}

.button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transition-duration: 0.3s;
}

.blue {
  background-color: #30aed6;
}

.pink {
  background-color: #f78dcb;
}

.red {
  background-color: #e54a4c;
}

.button--slanted {
  -ms-transform: skewX(-20deg);
  -webkit-transform: skewX(-20deg);
  transform: skewX(-20deg);
}

.button--slanted--content {
  -ms-transform: skewX(20deg);
  -webkit-transform: skewX(20deg);
  transform: skewX(20deg);
}
</style>
