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
        :disabled="uploaded === true"
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
        :disabled="uploaded === false"
        color="success"
        @click="postSend(image)"
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
          uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET_1,
          multiple: false,
        },
        (error, result) => {
          if ( !error && result && result.event === "success" ) {
            // API サーバに渡すためのデータを data に格納
            this.image    = result.info.secure_url
            this.uploaded = true
            widget.hide()
          }
        }
      )
      widget.open()
    },
    postSend (imageUrl) {
      if ( !this.title ) return

      console.log(imageUrl)

      const post = {
        title: this.title,
        content: this.content,
        image: imageUrl,
        user_id: this.user.id,
      }
      axios.post('/v1/posts', { post })
      .then(res => {
        this.$router.push('/')
      })
      .catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style scoped>
</style>
