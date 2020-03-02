<template>
  <div v-if="user">
    <Card
      :user="user"
      :posts="posts"
      :displayLists="displayLists"
      :length="length"
      :pageSize="pageSize"
    ></Card>
  </div>

  <div v-else>
    <Demo></Demo>
  </div>
</template>

<script>
import axios from '../plugins/axios'

export default {
  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  mounted () {
    // 顔写真の投稿を取得
    axios.get('/v1/posts')
    .then(res => {
      this.posts        = res.data
      this.length       = Math.ceil(this.posts.length / this.pageSize)
      this.displayLists = this.posts.slice(0, this.pageSize)
    })
    .catch(error => {
      console.log(error)
    })
  },

  data: () => ({
    posts: [],
    displayLists: [],
    length: 0,
    pageSize: 10,
  }),
}
</script>

<style scoped>
</style>
