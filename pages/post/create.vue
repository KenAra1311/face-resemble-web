<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
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

    <v-file-input
      v-model="image"
      :rules="imageRules"
      accept="image/*"
      label="顔写真"
      prepend-icon="mdi-camera"
      filled
      chips
      show-size
    ></v-file-input>

    <v-container fluid>
      <v-textarea
        v-model="content"
        :rules="contentRules"
        :counter="255"
        autocomplete="本文"
        label="本文"
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
      color="success"
      @click="postSend"
    >
      投稿する
    </v-btn>
  </v-form>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    title: '',
    titleRules: [
      v => !!v || 'タイトルは必ず入力してください！',
      v => (v && v.length <= 16) || 'タイトルは32文字以内で入力してください！',
    ],
    content: '',
    contentRules: [
      v => (v && v.length <= 255) || '255文字以内で入力してください！',
    ],
    image: '',
    imageRules: [
      v => !v || v.size < 2000000 || '2 MB 以内のファイルサイズでアップしてください！',
    ],
  }),

  methods: {
    inputReset () {
      this.$refs.form.reset()
    },
    postSend () {
      const postData = {
        title: this.title,
        content: this.content,
        image: this.image,
      }
      axios.post(`posts/${user.id}`, postData)
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
