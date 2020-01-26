import axios from 'axios'

export default async function({ store }) {
  const user = await axios.get(
    '/graphql?query={getUser{balance,personaname,avatar}}'
  )
  if (user) store.commit('client/setUser', user.data.data.getUser)
}
