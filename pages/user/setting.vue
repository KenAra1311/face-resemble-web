<template>
  <div v-if="user">
    <h1 class="text-align">アカウント情報</h1>
    <p v-if="error" class="errors">{{ error }}</p>

    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr>
            <td>ユーザー名</td>
            <td>
              <input
                type="text"
                v-model="user.name"
                @click="clickUserName"
                @keyup.enter="changeUserName"
                @keypress="setCanSubmit"
              >
            </td>
          </tr>
          <tr>
            <td>メールアドレス</td>
            <td>
              <input
                type="text"
                v-model="user.email"
                @click="clickUserEmail"
                @keyup.enter="changeUserEmail"
                @keypress="setCanSubmit"
              >
            </td>
          </tr>
          <tr>
            <td>プロフィール画像</td>
            <td>
              <v-badge
                v-if="user.profile_image"
                @click.native="deleteProfileImage"
                color="error"
                icon="clear"
                class="pointer"
                overlap
              >
                <v-avatar size="126">
                  <img
                    :src="user.profile_image"
                    :alt="user.name"
                  >
                </v-avatar>
              </v-badge>
              <v-avatar v-else>
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>
            </td>
          </tr>
          <tr>
            <td>投稿した顔写真の数</td>
            <td>{{ user.posts.length ? user.posts.length : 0 }}</td>
          </tr>
          <tr>
            <td>いいねをもらった数</td>
            <td>{{ user.like_total_count ? user.like_total_count : 0 }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-row class="text-align">
      <v-col class="text-center" cols="12" sm="12">
        <div class="my-2">
          <v-btn large color="error" @click="signOut">サインアウト</v-btn>
        </div>
      </v-col>
    </v-row>
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

  data: () => ({
    canSubmit: false,
    pushUserNameChangeButton: false,
    pushUserEmailChangeButton: false,
    error: '',
  }),

  methods: {
    setCanSubmit() {
      this.canSubmit = true
    },
    clickUserName () {
      this.pushUserNameChangeButton = true
    },
    clickUserEmail () {
      this.pushUserEmailChangeButton = true
    },
    changeUserName () {
      if ( !this.canSubmit || !this.user.name ) return
      // 更新の確認
      if ( !confirm('ユーザネームを変更しますか？') ) return

      axios.put(`/v1/users/${this.user.id}`, { name: this.user.name })
      .then(() => {
        this.$store.commit('setNotice', {
          status: true,
          message: 'ユーザネームを変更しました',
          type: 'success',
        })
        setTimeout(() => {
          this.$store.commit('setNotice', {})
        }, 2000)
      })
    },
    changeUserEmail () {
      if ( !this.canSubmit || !this.user.email ) return
      // 更新の確認
      if ( !confirm('メールアドレスを変更しますか？') ) return

      this.$store.commit('setLoading', true)
      firebase.auth().currentUser.updateEmail(this.user.email)
      .then(() => {
        axios.put(`/v1/users/${this.user.id}`, { email: this.user.email })
        .then(() => {
          this.$store.commit('setLoading', false)
          this.$store.commit('setNotice', {
            status: true,
            message: 'メールアドレスを変更しました',
            type: 'success',
          })
          setTimeout(() => {
            this.$store.commit('setNotice', {})
          }, 2000)
        })
      })
      .catch(error => {
        this.$store.commit('setLoading', false)
        this.error = (code => {
          switch ( code ) {
            case 'auth/email-already-in-use':
              return '※すでにそのメールアドレスは使用されています。'
            default:
              return '※サインアップから時間が経っているので、再度サインアップしてください。'
          }
        })(error.code)
      })
    },
    deleteProfileImage () {
      if ( !confirm('プロフィール画像を削除しますか？') ) return

      axios.put(`/v1/users/${this.user.id}`, { profile_image: null, file_name: null })
      .then(() => {
        this.$store.commit('setNotice', {
          status: true,
          message: 'プロフィール画像を削除しました',
          type: 'success',
        })
        setTimeout(() => {
          this.$store.commit('setNotice', {})
        }, 2000)
      })
    },
    signOut () {
      if ( !confirm('サインアウトしますか？') ) return

      firebase.auth().signOut()
      .then(() => {
        this.$store.commit('setUser', null)
        this.$router.push('/signin')
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
.errors {
  margin: 10px;
  color: red;
}
</style>
