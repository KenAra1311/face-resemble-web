<template>
  <div v-if="user">
    <div v-if="userData[0]">
      <v-card
        max-width="344"
        class="mx-auto my-3"
      >
        <v-list-item>
          <v-list-item-avatar color="grey">
            <v-img
              v-if="userData[0].profile_image"
              :src="userData[0].profile_image"
            ></v-img>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ userData[0].name }}</v-list-item-title>
            <v-list-item-subtitle>アカウント作成日：{{ userData[0].created }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <div class="text-center my-4">
          <v-btn
            v-if="user.id === userData[0].id"
            rounded
            disabled
          >
            フォロー
          </v-btn>
          <v-btn
            v-else-if="user.follows.some(follow => follow.follow_id === userData[0].id)"
            @click="removeUserFollow(userData[0].id)"
            rounded
            color="error"
          >
            フォローから外す
          </v-btn>
          <v-btn
            v-else
            @click="followUser(userData[0].id)"
            rounded
            color="primary"
          >
            フォロー
          </v-btn>
        </div>

        <v-divider />

        <v-list subheader dense class="ml-3">
          <v-subheader>フォロー：{{ userData[0].follows.length }}</v-subheader>
          <v-subheader>フォロワー：{{ followData.length }}</v-subheader>
        </v-list>
      </v-card>

      <h2 class="text-center my-8" v-if="user.id === userData[0].id">自分が投稿した顔写真一覧</h2>
      <h2 class="text-center my-8" v-else>{{ userData[0].name }} さんが投稿した顔写真一覧</h2>

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
            v-for="(post, index) in postData"
            v-bind:key="index"
          >
            <v-card-actions v-if="user.id === post.user.id">
              <v-spacer />
              <v-icon
                small
                @click="deletePost(post.id, post.title, index)"
                title="投稿を削除する"
                color="red"
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

            <dir v-if="post.emotion === null" class="border-animation-blue">
              <v-img
                :src="post.image"
                height="194"
                @click="displayDialog(post.title, post.emotion)"
              ></v-img>
            </dir>
            <dir v-else class="border-animation-pink">
              <v-img
                :src="post.image"
                height="194"
                @click="displayDialog(post.title, post.emotion)"
              ></v-img>
            </dir>

            <v-card-text>
              {{ post.content }}
            </v-card-text>

            <v-card-actions>
              <v-spacer />
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
        </v-tab-item>

        <v-tab-item>
          <v-card
            max-width="344"
            class="mx-auto"
            v-for="(post, index) in postData"
            v-bind:key="index"
          >
            <div v-if="post.emotion">
              <v-card-actions v-if="user.id === post.user.id">
                <v-spacer />
                <v-icon
                  small
                  @click="deletePost(post.id, post.title, index)"
                  title="投稿を削除する"
                  color="red"
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

              <dir v-if="post.emotion" class="border-animation-pink">
                <v-img
                  :src="post.image"
                  height="194"
                  @click="displayDialog(post.title, post.emotion)"
                ></v-img>
              </dir>

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
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs>

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
      <p>ユーザは存在しないか、削除されました。</p>
      <NuxtLink to="/">
        トップページに戻る
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  async asyncData ({ params }) {
    const { data: userData }   = await axios.get(`/v1/users?id=${params.id}`)
    const { data: postData }   = await axios.get(`/v1/posts?user_id=${params.id}`)
    const { data: followData } = await axios.get(`/v1/follows?follow_id=${params.id}`)
    return {
      userData,
      postData,
      followData,
    }
  },

  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  data: () => ({
    dialog: false,
    dialogTitle: '',
    dialogEmotion: '',
  }),

  methods: {
    followUser (followId) {
      const follow = {
        user_id: this.user.id,
        follow_id: followId,
      }
      axios.post('/v1/follows', follow)
      .then(res => {
        follow.id = res.data.id
        this.user.follows.push(follow)
        this.followData.push(follow)
      })
      .catch(error => {
        console.log(error)
      })
    },
    removeUserFollow (followingUserId) {
      // この投稿に対する自分のいいねのデータを削除する
      for (var key of this.user.follows ) {
        if ( key.follow_id === followingUserId ) {
          var followId = key.id
          break
        }
      }
      axios.delete(`/v1/follows/${followId}`)
      .then(res => {
        // いいねを取り消した配列の要素のデータも一緒に削除
        for (var key of this.user['follows'] ) {
          if ( key.follow_id === res.data.follow_id ) {
            delete key.id
            delete key.user_id
            delete key.follow_id
            break
          }
        }
        this.followData.pop()
      })
      .catch(error => {
        console.log(error)
      })
    },
    deletePost (postId, postTitle, index) {
      // 削除の確認
      if ( !confirm('本当に「' + postTitle + '」を削除しますか？') ) return

      axios.delete(`/v1/posts/${postId}`)
      .then(() => {
        this.postData.splice(index, 1);
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
      .then(res => {
        like.id = res.data.id
        this.postData[index]['likes'].push(like)
        this.postData[index].count++
      })
      .catch(error => {
        console.log(error)
      })
    },
    goodReset (index) {
      // この投稿に対する自分のいいねのデータを削除する
      for (var key of this.postData[index]['likes'] ) {
        if ( key.user_id === this.user.id ) {
          var likeId = key.id
          break
        }
      }
      axios.delete(`/v1/likes/${likeId}`)
      .then(() => {
        // いいねを取り消した配列の要素のデータも一緒に削除
        for (var key of this.postData[index]['likes'] ) {
          if ( key.user_id === this.user.id ) {
            delete key.id
            delete key.user_id
            delete key.post_id
            break
          }
        }
        this.postData[index].count--
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
