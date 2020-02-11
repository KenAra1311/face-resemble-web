<template>
  <div v-if="user">
    <v-tabs
      background-color="deep-purple darken-4"
      grow
    >
      <v-tab>投稿した顔写真</v-tab>
      <v-tab>マッチングした顔写真</v-tab>

      <v-tab-item>
        <v-card
          max-width="344"
          class="mx-auto"
          v-for="(post, index) in user.posts"
          v-bind:key="index"
        >
          <v-card-actions>
            <v-spacer />
            <v-icon
              small
              @click="deletePost(post.id, index)"
              title="投稿を削除する"
            >
              delete
            </v-icon>
          </v-card-actions>

          <v-list-item>
            <v-list-item-avatar color="grey">
              <v-img
                v-if="user.profile_image"
                :src="user.profile_image"
              ></v-img>
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
      </v-tab-item>

      <v-tab-item>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  methods: {
    deletePost (postId, index) {
      // 削除の確認
      if ( !confirm('本当に投稿を削除しますか？') ) return

      axios.delete(`/v1/posts/${postId}`)
      .then(() => {
        this.posts.splice(index, 1);
        this.$store.commit('setNotice', {
          status: true,
          message: '投稿を削除しました',
          type: 'success',
        })
        setTimeout(() => {
          this.$store.commit('setNotice', {})
        }, 2000)
      })
      .catch(error => {
        console.log(error)
      })
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
