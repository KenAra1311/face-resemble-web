<template>
  <div v-if="displayLists[0]">
    <v-card
      max-width="344"
      class="mx-auto my-5"
      v-for="(post, index) in displayLists"
      :key="index"
    >
      <v-card-actions v-if="user.id === post.user.id">
        <v-spacer />

        <v-icon
          small
          @click="deletePost(post.id, post.title, index)"
          color="error"
          title="投稿を削除する"
        >
          delete
        </v-icon>
      </v-card-actions>

      <v-list-item>
        <n-link :to="'/user/' + post.user.id">
          <v-list-item-avatar color="grey">
            <v-img
              v-if="post.user.profile_image"
              :src="post.user.profile_image"
            ></v-img>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>
        </n-link>

        <v-list-item-content>
          <v-list-item-title class="headline">{{ post.title }}</v-list-item-title>
          <v-list-item-subtitle>
            by
            <n-link :to="'/user/' + post.user.id" class="original-link">{{ post.user.name }}</n-link>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div v-if="post.emotion === null" class="border-animation-blue">
        <v-img
          :src="post.image"
          height="auto"
          @click="displayDialog(post.title, post.emotion)"
        ></v-img>
      </div>
      <div v-else class="border-animation-pink">
        <v-img
          :src="post.image"
          height="auto"
          @click="displayDialog(post.title, post.emotion)"
        ></v-img>
      </div>

      <v-card-subtitle>{{ post.created }}</v-card-subtitle>

      <v-card-text>
        {{ post.content }}
      </v-card-text>

      <v-card-actions>
        <v-btn icon :to="'/comment/' + post.id">
          <v-badge
            color="green"
            :content="post.comments.length"
            :value="post.comments.length"
          >
            <v-icon color="blue">comment</v-icon>
          </v-badge>
        </v-btn>
        <v-spacer />

        <div v-if="user.id === post.user.id">
          <v-btn @click="canNotLike" icon>
            <v-icon disabled>mdi-heart</v-icon>
          </v-btn>
        </div>
        <div v-else-if="post.likes.some(like => like.user_id === user.id)">
          <v-btn @click="goodReset(index)" icon>
            <v-icon color="pink">mdi-heart</v-icon>
          </v-btn>
        </div>
        <div v-else>
          <v-btn @click="good(post.id, index)" icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </div>
        <n-link :to="'/like/' + post.id" class="original-link">
          {{ post.count ? post.count : 0 }}
        </n-link>
      </v-card-actions>
    </v-card>

    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="length"
        @input="pageChange"
        circle
      ></v-pagination>
    </div>

    <!-- 出力するダイアログ -->
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">「{{ dialogTitle }}」の感情</v-card-title>

        <v-card-text>
          {{ dialogEmotion }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from '../plugins/axios'

export default {
  props: [
    'user',
    'posts',
    'displayLists',
    'length',
    'pageSize',
  ],

  data: () => ({
    dialog: false,
    dialogTitle: '',
    dialogEmotion: '',
    page: 1,
  }),

  methods: {
    deletePost (postId, postTitle, index) {
      // 削除の確認
      if ( !confirm('本当に「' + postTitle + '」を削除しますか？') ) return

      axios.delete(`/v1/posts/${postId}`)
      .then(() => {
        this.displayLists.splice(index, 1);
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
    good (postId, index) {
      const like = {
        user_id: this.user.id,
        post_id: postId,
      }
      axios.post('/v1/likes', { like })
      .then(() => {
        this.displayLists[index].count++

        axios.get('/v1/likes')
        .then(res => {
          var newLikeId = res.data.slice(-1)[0].id
          like.id = newLikeId
        })
        .catch(error => {
          console.log(error)
        })
        this.displayLists[index]['likes'].push(like)
      })
      .catch(error => {
        console.log(error)
      })
    },
    goodReset (index) {
      // この投稿に対する自分のいいねのデータを削除する
      for (var key of this.displayLists[index]['likes'] ) {
        if ( key.user_id === this.user.id ) {
          var likeId = key.id
          break
        }
      }
      axios.delete(`/v1/likes/${likeId}`)
      .then(() => {
        // いいねを取り消した配列の要素のデータも一緒に削除
        for (var key of this.displayLists[index]['likes'] ) {
          if ( key.user_id === this.user.id ) {
            delete key.id
            delete key.user_id
            delete key.post_id
            break
          }
        }
        this.displayLists[index].count--
      })
      .catch(error => {
        console.log(error)
      })
    },
    pageChange (pageNumber) {
      this.$parent.displayLists = this.posts.slice(this.pageSize * (pageNumber - 1), this.pageSize * (pageNumber))
    },
  },
}
</script>

<style scoped>
.original-link {
  color: #D81B60;
  font-weight: bold;
  text-decoration: underline
}
/* 画像の枠 */
@keyframes borderFlashing-pink {
  0% {
    border: 1.5px solid #D81B60;
  }
  100% {
    border: 1.5px solid transparent;
  }
}
.border-animation-pink {
  cursor: pointer;
  border: 1.5px solid #D81B60;
  animation: borderFlashing-pink 1s ease infinite alternate;
}
@keyframes borderFlashing-blue {
  0% {
    border: 1.5px solid #1E88E5;
  }
  100% {
    border: 1.5px solid transparent;
  }
}
.border-animation-blue {
  cursor: pointer;
  border: 1.5px solid #1E88E5;
  animation: borderFlashing-blue 1s ease infinite alternate;
}
</style>
