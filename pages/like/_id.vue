<template>
  <div v-if="user">
    <div v-if="likeData[0]">
      <List
        listHeader="いいねをした人一覧"
        :likeData="likeData"
      ></List>
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
