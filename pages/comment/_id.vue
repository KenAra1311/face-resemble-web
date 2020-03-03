<template>
  <div v-if="user">
    <v-form
      ref="form"
      v-model="valid"
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
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  async asyncData ({ params }) {
    const { data: postData }   = await axios.get(`/v1/posts?id=${params.id}`)
    return {
      postData,
    }
  },

  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  data: () => ({
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
