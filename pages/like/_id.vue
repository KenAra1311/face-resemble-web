<template>
  <div v-if="user">
    <div v-if="likeData[0]">
      <h2 class="text-center my-8">いいねした人たち</h2>

      <v-list class="mx-auto" max-width="344">
        <v-list-item
          v-for="(like, index) in likeData"
          :key="index"
          :to="'/user/' + like.user.id"
        >
          <v-list-item-avatar>
            <v-img
              v-if="like.user.profile_image"
              :src="like.user.profile_image"
            ></v-img>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="like.user.name"></v-list-item-title>
          </v-list-item-content>

          <v-subheader>{{ like.created }}</v-subheader>
        </v-list-item>
      </v-list>
    </div>

    <div v-else>
      <h2 class="text-center my-8">いいねはまだ押されていません¯\_(ツ)_/¯</h2>
    </div>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  async asyncData ({ params }) {
    const { data: likeData } = await axios.get(`/v1/likes?post_id=${params.id}`)
    return {
      likeData,
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
