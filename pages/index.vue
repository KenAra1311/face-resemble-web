<template>
  <div v-if="user">
    <v-card
      max-width="344"
      class="mx-auto my-5"
      v-for="(post, index) in posts"
      v-bind:key="index"
    >
      <v-list-item>
        <v-list-item-avatar color="grey">
          <v-icon v-if="!user.profile_image">
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ post.title }}</v-list-item-title>
          <v-list-item-subtitle>by {{ user.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-img
        :src="post.image"
        height="194"
      ></v-img>

      <v-card-text>
        {{ post.content }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          color="deep-purple accent-4"
        >
          コメント
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
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
      this.posts = res.data
    })
    .catch(error => {
      console.log(error)
    })
  },

  data: () => ({
    posts: [],
    likes: [],
  }),
}
</script>

<style scoped>
</style>
