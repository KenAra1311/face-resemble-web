<template>
  <div v-if="user">
    <div v-if="userData">
      <v-card
        max-width="344"
        class="mx-auto my-3"
      >
        <v-list-item>
          <v-list-item-avatar color="grey">
            <v-img
              v-if="userData.profile_image"
              :src="userData.profile_image"
            ></v-img>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ userData.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>

    <div v-else>
      <p>ユーザは存在しないか、削除されました。</p>
      <NuxtLink to="/">
        トップページに戻る
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  validate ({ params }) {
    return /^[0-9a-z]+$/.test(params.id)
  },

  async asyncData ({ params }) {
    const { data: userData } = await axios.get(`/v1/users?id=${params.id}`)
    return {
      userData
    }
  },

  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  fetch ({ store, redirect }) {
    store.watch(
      state => state.currentUser,
      (newUser, oldUser) => {
        if ( !newUser ) {
          return redirect('/signin')
        }
      }
    )
  },
}
</script>

<style scoped>
</style>
