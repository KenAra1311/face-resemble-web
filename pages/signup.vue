<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >

    <h1 class="text-align">サインアップ</h1>
    <p v-if="error" class="errors">{{error}}</p>

    <v-text-field
      v-model="name"
      :counter="16"
      :rules="nameRules"
      label="名前"
      data-vv-name="name"
      prepend-icon="mdi-message-text"
      clearable
      clear-icon="cancel"
      required
    ></v-text-field>

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
      :type="show1 ? 'text' : 'password'"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show1 = !show1"
    ></v-text-field>

    <v-text-field
      v-model="passwordConfirm"
      :counter="32"
      :rules="passwordRules"
      label="パスワード（確認）"
      prepend-icon="security"
      data-vv-name="passwordConfirm"
      required
      :type="show2 ? 'text' : 'password'"
      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show2 = !show2"
    ></v-text-field>

    <v-btn
      :disabled="uploaded === true"
      color="info"
      class="my-5"
      @click="openCloudinaryWidget"
      x-large
      block
      tile
    >
      <v-icon left>mdi-cloud-upload</v-icon> プロフィール画像をアップロード
    </v-btn>

    <v-checkbox
      v-if="adminCheck === true"
      v-model="admin"
      label="管理者権限"
      prepend-icon="accessibility_new"
    ></v-checkbox>

    <v-btn
      color="error"
      class="mr-4"
      @click="inputReset"
    >
      入力リセット
    </v-btn>

    <v-btn
      color="success"
      @click="signUp(profileImage)"
    >
      サインアップ
    </v-btn>
  </v-form>
</template>

<script>
import firebase from '../plugins/firebase'
import axios from '../plugins/axios'

export default {
data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || '名前は必ず入力してください！',
      v => (v && v.length <= 16) || '名前は16文字以内で入力してください！',
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスは必ず入力してください！',
      v => (v && v.length <= 32) || 'メールアドレスは32文字以内で入力してください！',
    ],
    password: '',
    passwordConfirm: '',
    passwordRules: [
      v => !!v || 'パスワードは必ず入力してください！',
      v => (v && v.length >= 6 && v.length <= 32)  || 'パスワードは6文字以上32文字以内で入力してください！',
    ],
    profileImage: '',
    admin: false,
    adminCheck: false,
    show1: false,
    show2: false,
    uploaded: false,
    error: '',
  }),

  methods: {
    inputReset () {
      this.$refs.form.reset()
    },
    openCloudinaryWidget () {
      const widget = cloudinary.createUploadWidget(
        {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET_2,
          multiple: false,
          cropping: true,
        },
        (error, result) => {
          if ( !error && result && result.event === "success" ) {
            // API サーバに渡すためのデータを data に格納
            this.profileImage = result.info.secure_url
            this.uploaded      = true
            widget.hide()
          }
        }
      )
      widget.open()
    },
    signUp (imageUrl) {
      if ( this.password !== this.passwordConfirm ) {
        this.error = 'パスワードが一致していません！'
      }
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then(res => {
        const user = {
          name: this.name,
          email: res.user.email,
          uid: res.user.uid,
          profile_image: imageUrl,
        }
        axios.post('/v1/users', { user })
        .then(() => {
          this.$router.push('/')
        })
      })
      .catch(error => {
        this.error = (code => {
          switch ( code ) {
            case 'auth/email-already-in-use':
              return '※すでにそのメールアドレスは使用されています。'
            case 'auth/wrong-password':
              return '※パスワードが正しくありません。'
            case 'auth/weak-password':
              return '※パスワードは最低６文字で入力してください。'
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
