<template>
  <div v-if="user">
    <h1 class="text-align">アカウント情報</h1>

    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr>
            <td>ユーザー名</td>
            <td>{{ user.name }}</td>
          </tr>
          <tr>
            <td>メールアドレス</td>
            <td>{{ user.email }}</td>
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

  data: () => ({}),

  methods: {
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
</style>
