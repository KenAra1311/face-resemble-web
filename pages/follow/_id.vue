<template>
  <div v-if="user">
    <div v-if="followData[0]">
      <List
        :listHeader="userData[0].name ? userData[0].name + 'さんがフォローした人たち' : '自分がフォローした人たち'"
        :lists="follows"
      ></List>
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
            this.follows[0].user.push(data)
            continue
          }
        }
      }
      this.follows[0].user = this.follows[0].user[0]
    })
    .catch(error => {
      console.log(error)
    })
  },

  data: () => ({
    follows: [
      { user: [] },
    ],
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
