<template>
  <div v-if="user && user.admin">

    <h2>投稿顔写真一覧</h2>
    <v-subheader>※{{ pageSize }} 件ずつ表示中</v-subheader>

    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">投稿ユーザ名</th>
            <th class="text-left">タイトル</th>
            <th class="text-left">投稿画像</th>
            <th class="text-left">認識された感情</th>
            <th class="text-left">本文</th>
            <th class="text-left">いいねの数</th>
            <th class="text-left">投稿日</th>
            <th class="text-left">削除</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, i) in displayLists" :key="i">
            <td>{{ post.user.name }}</td>
            <td>{{ post.title }}</td>
            <td>
              <v-img :src="post.image" height="auto" max-width="344"></v-img>
            </td>
            <td>{{ post.emotion ? post.emotion : 'なし' }}</td>
            <td>{{ post.content ? post.content : 'なし' }}</td>
            <td>{{ post.count ? post.count : 0 }}</td>
            <td>{{ post.created }}</td>
            <td>
              <v-icon
                @click="deletePost(post.id, post.title, i)"
                class="pointer"
                color="red"
              >delete</v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-pagination
      v-model="page"
      :length="length"
      @input="pageChange"
      circle
    ></v-pagination>
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
    // ユーザを全取得
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
    headers: [
      { text: 'ユーザ名', align: 'left', sortable: false, value: 'name' },
      { text: 'メールアドレス', value: 'email' },
      { text: '管理権限', value: 'admin' },
      { text: 'アカウント作成日', value: 'created' },
      { text: 'プロフィール画像', value: 'profile_image' },
    ],
    search: '',
    page: 1,
    length: 0,
    displayLists: [],
    pageSize: 25,
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
          message: '「' + postTitle + '」を削除しました',
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
    pageChange (pageNumber) {
      this.displayLists = this.posts.slice(this.pageSize * (pageNumber - 1), this.pageSize * (pageNumber))
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
