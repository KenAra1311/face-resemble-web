<template>
  <div v-if="user">
    <v-card
      max-width="344"
      class="mx-auto my-5"
      v-for="(post, index) in posts"
      v-bind:key="index"
    >
      <v-card-actions v-if="user.id === post.user.id">
        <v-spacer></v-spacer>
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
        <v-list-item-avatar color="grey">
          <v-img
            v-if="post.user.profile_image"
            :src="post.user.profile_image"
          ></v-img>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="headline">{{ post.title }}</v-list-item-title>
          <v-list-item-subtitle>by {{ post.user.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div v-if="post.emotion === null" class="border-animation-blue">
        <v-img
          :src="post.image"
          height="194"
          @click="displayDialog(post.title, post.emotion)"
        ></v-img>
      </div>
      <div v-else class="border-animation-pink">
        <v-img
          :src="post.image"
          height="194"
          @click="displayDialog(post.title, post.emotion)"
        ></v-img>
      </div>

      <v-card-subtitle>{{ post.created }}</v-card-subtitle>

      <v-card-text>
        {{ post.content }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <div v-if="user.id === post.user.id">
          <v-btn @click="canNotLike" icon>
            <v-icon color="purple">mdi-heart</v-icon>
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
        {{ post.count ? post.count : 0 }}

      </v-card-actions>
    </v-card>

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

  <div v-else>
    <div class="text-center">
      <h2 class="mt-6">
        「Face-Resemble」では、投稿した顔写真の感情を読み取ってくれます！
      </h2>
      <h3 class="my-5">感情が読み取れたとき↓</h3>
    </div>
    <v-card
      max-width="344"
      class="mx-auto my-5"
    >
      <v-list-item>
        <v-list-item-avatar color="grey">
          <v-icon>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">女の子</v-list-item-title>
          <v-list-item-subtitle>by ユーザネーム</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div class="border-animation-pink">
        <v-img
          v-bind:src="require('@/static/sample_01.png')"
          height="194"
          @click="sample1 = true"
        ></v-img>
      </div>

      <v-card-subtitle>2020/02/15</v-card-subtitle>

      <v-card-text>
        テキストテキストテキストテキストテキスト
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        0
      </v-card-actions>
    </v-card>

    <v-dialog
      v-model="sample1"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">「女の子」の感情</v-card-title>

        <v-card-text>
          幸せのようです😀
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="sample1 = false"
          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <h3 class="my-5">感情が読み取れなかったとき↓</h3>
    </div>

    <v-card
      max-width="344"
      class="mx-auto my-5"
    >
      <v-list-item>
        <v-list-item-avatar color="grey">
          <v-icon>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">ポケモン</v-list-item-title>
          <v-list-item-subtitle>by ユーザネーム</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div class="border-animation-blue">
        <v-img
          v-bind:src="require('@/static/sample_02.png')"
          height="194"
          @click="sample2 = true"
        ></v-img>
      </div>

      <v-card-subtitle>2020/02/15</v-card-subtitle>

      <v-card-text>
        テキストテキストテキストテキストテキスト
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        0
      </v-card-actions>
    </v-card>

    <v-dialog
      v-model="sample2"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">「ポケモン」の感情</v-card-title>

        <v-card-text>
          感情を読み取れませんでした…
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="sample2 = false"
          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <h2 class="mt-6">
        他のユーザが投稿した顔写真を見たくなったり、これから顔写真を投稿したいと思ったあなたは、<br>
        今すぐサインアップしてこのサービスを楽しんでみてください！！
      </h2>
      <v-btn color="primary my-3">
        <n-link to="/signup" class="top-link">
          今すぐサインアップする
        </n-link>
      </v-btn>

      <h2 class="mt-6">
        もしもすでにサインアップ（登録）済みならば、サインインしましょう！
      </h2>
      <v-btn color="success my-3">
        <n-link to="/signin" class="top-link">
          今すぐサインインする
        </n-link>
      </v-btn>
    </div>
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
    sample1: false,
    sample2: false,
    posts: [],
    dialog: false,
    dialogTitle: '',
    dialogEmotion: '',
  }),

  methods: {
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
        this.posts[index].count++

        axios.get('/v1/likes')
        .then(res => {
          var newLikeId = res.data.slice(-1)[0].id
          like.id = newLikeId
        })
        .catch(error => {
          console.log(error)
        })
        this.posts[index]['likes'].push(like)
      })
      .catch(error => {
        console.log(error)
      })
    },
    goodReset (index) {
      // この投稿に対する自分のいいねのデータを削除する
      for (var key of this.posts[index]['likes'] ) {
        if ( key.user_id === this.user.id ) {
          var likeId = key.id
          break
        }
      }
      axios.delete(`/v1/likes/${likeId}`)
      .then(() => {
        // いいねを取り消した配列の要素のデータも一緒に削除
        for (var key of this.posts[index]['likes'] ) {
          if ( key.user_id === this.user.id ) {
            delete key.id
            delete key.user_id
            delete key.post_id
            break
          }
        }
        this.posts[index].count--
      })
      .catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style scoped>
.top-link {
  color: white;
  font-weight: bold;
}
</style>
