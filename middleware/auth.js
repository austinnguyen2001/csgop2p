import axios from 'axios'

export default async function({ store }) {
  const user = await axios.get('/graphql', {
    params: {
      query: '{getUser{balance,personaname,avatar}}'
    }
  })
  if (user) store.commit('user/setUser', user.data.data.getUser)
}
