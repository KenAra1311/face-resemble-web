<template>
  <div v-if="user && user.admin">

    <h2>ユーザ一覧</h2>
    <v-subheader>※{{ pageSize }} 件ずつ表示中</v-subheader>

    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">プロフィール画像</th>
            <th class="text-left">ユーザ名</th>
            <th class="text-left">メールアドレス</th>
            <th class="text-left">管理権限</th>
            <th class="text-left">アカウント作成日</th>
            <th class="text-left">投稿数</th>
            <th class="text-left">いいねをもらった数</th>
            <th class="text-left">いいねを押した数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in displayLists" :key="i">
            <td>
              <v-avatar v-if="user.profile_image">
                <v-img
                  :src="user.profile_image"
                  :alt="user.name"
                ></v-img>
              </v-avatar>
              <v-avatar v-else class="pointer">
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.admin ? 'あり' : 'なし' }}</td>
            <td>{{ user.created }}</td>
            <td>{{ user.posts.length }}</td>
            <td>{{ user.like_total_count ? user.like_total_count : 0 }}</td>
            <td>{{ user.likes ? user.likes.length : 0 }}</td>
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
import firebase from '../../plugins/firebase'
import axios from '../../plugins/axios'

export default {
  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  mounted () {
    // ユーザを全取得
    axios.get('/v1/users')
    .then(res => {
      this.users        = res.data
      this.length       = Math.ceil(this.users.length / this.pageSize)
      this.displayLists = this.users.slice(0, this.pageSize)
    })
    .catch(error => {
      console.log(error)
    })
  },

  data: () => ({
    users: [],
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
    pageSize: 50,
  }),

  methods: {
    pageChange (pageNumber) {
      this.displayLists = this.users.slice(this.pageSize * (pageNumber - 1), this.pageSize * (pageNumber))
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
