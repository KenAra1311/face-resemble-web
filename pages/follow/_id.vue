<template>
  <div v-if="user">
    <div v-if="followData[0]">
      <h2 v-if="user.id === userData[0].id" class="text-center my-8">自分がフォローした人たち</h2>
      <h2 v-else class="text-center my-8">{{ userData[0].name }} さんがフォローした人たち</h2>

      <v-list class="mx-auto" max-width="344">
        <v-list-item
          v-for="(follow, index) in follows"
          :key="index"
          :to="'/user/' + follow.id"
        >
          <v-list-item-avatar>
            <v-img
              v-if="follow.profile_image"
              :src="follow.profile_image"
            ></v-img>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="follow.name"></v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list>
    </div>

    <div v-else>
      <h2 class="text-center my-8">フォローしている人はいないようです¯\_(ツ)_/¯</h2>
    </div>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  async asyncData ({ params }) {
    const { data: userData }   = await axios.get(`/v1/users?id=${params.id}`)
    const { data: followData } = await axios.get(`/v1/follows?user_id=${params.id}`)
    return {
      userData,
      followData,
    }
  },

  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  mounted () {
    // フォローしている人の抽出処理
    axios.get('/v1/users')
    .then(res => {
      for ( var data of res.data ) {
        for ( var follow of this.followData ) {
          if ( data.id === follow.follow_id ) {
            this.follows.push(data)
            continue
          }
        }
      }
    })
    .catch(error => {
      console.log(error)
    })
  },

  data: () => ({
    follows: [],
  }),

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
