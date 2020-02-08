<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >

    <h1 class="text-align">サインイン</h1>
    <p v-if="error" class="errors">{{error}}</p>

    <v-text-field
      v-model="email"
      :counter="32"
      :rules="emailRules"
      label="メールアドレス"
      data-vv-name="email"
      prepend-icon="mail"
      clearable
      clear-icon="cancel"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :counter="32"
      :rules="passwordRules"
      label="パスワード"
      prepend-icon="security"
      data-vv-name="password"
      required
      :type="show ? 'text' : 'password'"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show = !show"
    ></v-text-field>

    <v-btn
      color="error"
      class="mr-4"
      @click="inputReset"
    >
      入力リセット
    </v-btn>

    <v-btn
      color="success"
      @click="signIn"
    >
      サインイン
    </v-btn>
  </v-form>
</template>

<script>
import firebase from '../plugins/firebase'

export default {
data: () => ({
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスは必ず入力してください！',
      v => (v && v.length <= 32) || 'メールアドレスは32文字以内で入力してください！',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'パスワードは必ず入力してください！',
      v => (v && v.length >= 6 && v.length <= 32)  || 'パスワードは6文字以上32文字以内で入力してください！',
    ],
    show: false,
    error: '',
  }),

  methods: {
    inputReset () {
      this.$refs.form.reset()
    },
    signIn () {
      this.$store.commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(res => {
        this.$store.commit('setLoading', false)
        this.$router.push('/')
      })
      .catch(error => {
        console.log(error)
        this.error = (code => {
          switch ( code ) {
            case 'auth/user-not-found':
              return '※そのメールアドレスは存在しません。'
            case 'auth/wrong-password':
              return '※パスワードが正しくありません。'
            default:
              return '※メールアドレスとパスワードを確認してください。'
          }
        })(error.code)
      })
    },
  },
}
</script>

<style scoped>
.errors {
  margin: 10px;
  color: red;
}
</style>
