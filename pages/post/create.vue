<template>
  <div v-if="user">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
    <h1 class="text-align">顔写真の投稿ページ</h1>

      <v-text-field
        v-model="title"
        :counter="16"
        :rules="titleRules"
        label="タイトル"
        prepend-icon="mdi-message-text"
        clearable
        clear-icon="cancel"
        required
      ></v-text-field>

      <v-btn
        :disabled="uploaded"
        color="info"
        @click="openCloudinaryWidget"
        x-large
        block
        tile
      >
        <v-icon left>mdi-cloud-upload</v-icon> 画像を送信
      </v-btn>

      <v-container fluid>
        <v-textarea
          v-model="content"
          :rules="contentRules"
          :counter="255"
          autocomplete="本文"
          label="本文"
          prepend-icon="power_input"
          clearable
          clear-icon="cancel"
          required
        ></v-textarea>
      </v-container>

      <v-btn
        color="error"
        class="mr-4"
        @click="inputReset"
      >
        入力リセット
      </v-btn>

      <v-btn
        :disabled="!uploaded"
        color="success"
        @click="postSend(image, file_name)"
      >
        投稿する
      </v-btn>

    </v-form>
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

  data: () => ({
    valid: true,
    title: '',
    titleRules: [
      v => !!v || 'タイトルは必ず入力してください！',
      v => (v && v.length <= 32) || 'タイトルは32文字以内で入力してください！',
    ],
    image: '',
    file_name: '',
    content: '',
    contentRules: [
      v => (v && v.length <= 255) || '255文字以内で入力してください！',
    ],
    uploaded: false,
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
        },
        (error, result) => {
          if ( !error && result && result.event === "success" ) {
            // API サーバに渡すためのデータを data に格納
            this.image     = result.info.secure_url
            this.file_name = result.info.public_id
            this.uploaded  = true
            widget.hide()
          }
        }
      )
      widget.open()
    },
    postSend (imageUrl, fileName) {
      if ( !this.title ) return

      this.$store.commit('setLoading', true)
      const post = {
        title: this.title,
        content: this.content,
        image: imageUrl,
        file_name: fileName,
        user_id: this.user.id,
      }
      axios.post('/v1/posts', { post })
      .then(res => {
        this.$store.commit('setLoading', false)
        this.$store.commit('setNotice', {
          status: true,
          message: '投稿しました',
          type: 'success',
        })
        setTimeout(() => {
          this.$store.commit('setNotice', {})
        }, 2000)
        this.$router.push('/')
      })
      .catch(error => {
        this.$store.commit('setLoading', false)
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
