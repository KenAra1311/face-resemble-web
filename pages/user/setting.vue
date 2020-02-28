<template>
  <div v-if="user">
    <h1 class="text-align">アカウント情報確認・変更</h1>
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
                <v-avatar>
                  <v-img
                    :src="user.profile_image"
                    :alt="user.name"
                  ></v-img>
                </v-avatar>
              </v-badge>
              <v-avatar v-else @click="setProfileImage" class="pointer">
                <v-icon dark>mdi-account-circle</v-icon>
              </v-avatar>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-row class="text-align">
      <v-col class="text-center" cols="12" sm="12">
        <div class="my-2">
          <v-btn color="error" @click="signOut">サインアウト</v-btn>
        </div>
      </v-col>
      <v-col class="text-center" cols="12" sm="12">
        <div class="my-2">
          <v-btn color="purple" @click="deleteUser">ユーザを削除する</v-btn>
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
    setProfileImage () {
      const widget = cloudinary.createUploadWidget(
        {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET_1,
          multiple: false,
        },
        (error, result) => {
          if ( !error && result && result.event === "success" ) {
            // API サーバにデータを渡す
            this.$store.commit('setLoading', true)
            const user = {
              profile_image: result.info.secure_url,
              file_name: result.info.public_id
            }
            axios.put(`/v1/users/${this.user.id}`, { user })
            .then(() => {
              this.user.profile_image = result.info.secure_url
              this.$store.commit('setLoading', false)
              this.$store.commit('setNotice', {
                status: true,
                message: 'プロフィール画像をアップしました',
                type: 'success',
              })
              setTimeout(() => {
                this.$store.commit('setNotice', {})
              }, 2000)
            })
            .catch(error => {
              this.$store.commit('setLoading', false)
              console.log(error)
            })
            widget.hide()
          }
        }
      )
      widget.open()
    },
    deleteProfileImage () {
      if ( !confirm('プロフィール画像を削除しますか？') ) return

      this.$store.commit('setLoading', true)
      axios.put(`/v1/users/${this.user.id}`, { profile_image: null, file_name: null })
      .then(() => {
        this.user.profile_image = null
        this.user.file_name     = null
        this.$store.commit('setLoading', false)
        this.$store.commit('setNotice', {
          status: true,
          message: 'プロフィール画像を削除しました',
          type: 'success',
        })
        setTimeout(() => {
          this.$store.commit('setNotice', {})
        }, 2000)
      })
      .catch(error => {
        this.$store.commit('setLoading', false)
        console.log(error)
      })
    },
    signOut () {
      if ( !confirm('サインアウトしますか？') ) return

      this.$store.commit('setLoading', true)
      firebase.auth().signOut()
      .then(() => {
        this.$store.commit('setLoading', false)
        this.$store.commit('setUser', null)
        this.$router.push('/signin')
      })
      .catch(error => {
        this.$store.commit('setLoading', false)
        console.log(error)
      })
    },
    deleteUser () {
      if ( !confirm('本当にユーザを削除しますか？') ) return
      if ( !confirm('このユーザで投稿した顔写真なども削除されますがよろしいですか？') ) return

      this.$store.commit('setLoading', true)
      firebase.auth().currentUser.delete()
      .then(() => {
        axios.delete(`/v1/users/${this.user.id}`)
        .then(() => {
          this.$store.commit('setLoading', false)
          this.$router.push('/')
        })
        .catch(error => {
          this.$store.commit('setLoading', false)
          console.log(error)
        })
      })
      .catch(error => {
        this.$store.commit('setLoading', false)
        this.error = (code => {
          switch ( code ) {
            default:
              return '※サインアップから時間が経っているので、再度サインアップしてください。'
          }
        })(error.code)
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
