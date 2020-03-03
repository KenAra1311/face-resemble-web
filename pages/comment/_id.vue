<template>
  <div v-if="user">
    <v-form
      ref="form"
      v-model="valid"
      class="mb-8"
      lazy-validation
    >
      <v-row>
        <v-container fluid>
          <v-textarea
            v-model="comment"
            :rules="commentRules"
            :counter="255"
            rows="1"
            autocomplete="コメント"
            label="コメント"
            prepend-icon="power_input"
            clear-icon="cancel"
            clearable
            outlined
            auto-grow
            required
          ></v-textarea>
        </v-container>

        <v-col cols="12">
          <v-row justify="center">
            <v-btn
              :disabled="!comment || comment.length > 255"
              color="success"
              @click="commentSend(postData[0].id)"
            >
              コメント投稿
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-form>

    <v-list
      v-for="(comment, index) in commentData"
      :key="index"
      class="mx-auto"
      max-width="auto"
      :color="comment.user.id === user.id ? 'grey darken-3' : ''"
    >
      <v-list-item class="my-2">
        <n-link :to="'/user/' + comment.user.id">
          <v-list-item-avatar>
            <v-img
              v-if="comment.user.profile_image"
              :src="comment.user.profile_image"
            ></v-img>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>
        </n-link>

        <v-list-item-content>
          <v-list-item-subtitle v-text="comment.user.name" class="body-2 font-weight-light"></v-list-item-subtitle>
          <v-list-item-title v-text="comment.comment" class="body-2 my-4"></v-list-item-title>
          <v-list-item-subtitle v-text="comment.created" class="overline font-italic font-weight-light"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  async asyncData ({ params }) {
    const { data: postData }      = await axios.get(`/v1/posts?id=${params.id}`)
    const { data: commentData }   = await axios.get(`/v1/comments?post_id=${params.id}`)
    return {
      postData,
      commentData,
    }
  },

  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  data: () => ({
    valid: true,
    comment: '',
    commentRules: [
      v => (v && v.length <= 255) || '255文字以内で入力してください！',
    ],
  }),

  methods: {
    commentSend (postId) {
      this.$store.commit('setLoading', true)
      const comment = {
        comment: this.comment,
        user_id: this.user.id,
        post_id: postId,
      }
      axios.post(`/v1/comments`, { comment })
      .then(
        this.$store.commit('setLoading', false)
      )
      .catch(error => {
        this.$store.commit('setLoading', false)
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
