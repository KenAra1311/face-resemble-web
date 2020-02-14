<template>
  <div v-if="user">
    <v-tabs
      background-color="deep-purple darken-4"
      grow
    >
      <v-tab>投稿した顔写真</v-tab>
      <v-tab>感情が認識された顔写真</v-tab>

      <v-tab-item>
        <v-card
          max-width="344"
          class="mx-auto"
          v-for="(post, index) in posts"
          v-bind:key="index"
        >
          <v-card-actions>
            <v-spacer />
            <v-icon
              small
              @click="deletePost(post.id, post.title, index)"
              title="投稿を削除する"
            >
              delete
            </v-icon>
          </v-card-actions>

          <v-list-item>
            <v-list-item-avatar color="grey">
              <v-img
                v-if="post.user.profile_image"
                :src="post.user.profile_image"
              ></v-img>
              <v-icon v-if="!post.user.profile_image">
                mdi-account-circle
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="headline">{{ post.title }}</v-list-item-title>
              <v-list-item-subtitle>by {{ post.user.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img
            :src="post.image"
            height="194"
            @click="displayDialog(post.title, post.emotion)"
          ></v-img>

          <v-card-text>
            {{ post.content }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="canNotLike" icon>
              <v-icon color="purple">mdi-heart</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card
          max-width="344"
          class="mx-auto"
          v-for="(post, index) in posts"
          v-bind:key="index"
        >
          <div v-if="post.emotion">
            <v-card-actions>
              <v-spacer />
              <v-icon
                small
                @click="deletePost(post.id, post.title, index)"
                title="投稿を削除する"
              >
                delete
              </v-icon>
            </v-card-actions>

            <v-list-item>
              <v-list-item-avatar color="grey">
                <v-img
                  v-if="post.user.profile_image"
                  :src="post.user.profile_image"
                ></v-img>
                <v-icon v-if="!post.user.profile_image">
                  mdi-account-circle
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="headline">{{ post.title }}</v-list-item-title>
                <v-list-item-subtitle>by {{ post.user.name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-img
              :src="post.image"
              height="194"
              @click="displayDialog(post.title, post.emotion)"
            ></v-img>

            <v-card-text>
              {{ post.content }}
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="canNotLike" icon>
                <v-icon color="purple">mdi-heart</v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
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

  mounted () {
    // 顔写真の投稿を取得
    axios.get(`/v1/posts?user_id=${this.user.id}`)
    .then(res => {
      this.posts = res.data
    })
    .catch(error => {
      console.log(error)
    })
  },

  data: () => ({
    posts: [],
    dialog: false,
    dialogTitle: '',
    dialogEmotion: '',
  }),

  methods: {
    displayDialog (title, emotion) {
      this.dialogTitle = title
      switch ( emotion ) {
        case 'anger':
          this.dialogEmotion = '怒っているようです😥'
          break
        case 'contempt':
          this.dialogEmotion = '軽蔑しているようです😖'
          break
        case 'disgust':
          this.dialogEmotion = '嫌悪感を抱いているようです😞'
          break
        case 'fear':
          this.dialogEmotion = '恐怖に怯えているようです😭'
          break
        case 'happiness':
          this.dialogEmotion = '幸せのようです😀'
          break
        case 'neutral':
          this.dialogEmotion = '真顔です🙁'
          break
        case 'sadness':
          this.dialogEmotion = '悲しさの中にも雄々しく勇ましいところがありますね🤓'
          break
        case 'surprise':
          this.dialogEmotion = '驚いていますね！😮'
          break
        default:
          this.dialogEmotion = '感情を読み取れませんでした…'
      }
      this.dialog = true
    },
    deletePost (postId, postTitle, index) {
      // 削除の確認
      if ( !confirm('本当に「' + postTitle + '」を削除しますか？') ) return

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
    canNotLike () {
      this.$store.commit('setNotice', {
        status: true,
        message: '自分の投稿にはいいねできません',
        type: 'warning',
      })
      setTimeout(() => {
        this.$store.commit('setNotice', {})
      }, 2000)
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
