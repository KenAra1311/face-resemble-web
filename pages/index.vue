<template>
  <div v-if="user">
    <Card
      :user="user"
      :posts="posts"
      :displayLists="displayLists"
      :length="length"
      :pageSize="pageSize"
    ></Card>
  </div>

  <div v-else>
    <div class="text-center">
      <h2 class="mt-6">
        「Face-Resemble」では、投稿した顔写真の感情を読み取ってくれます！
      </h2>
      <h3 class="my-5">感情が読み取れたとき↓</h3>
    </div>
    <v-card
      max-width="344"
      class="mx-auto my-5"
    >
      <v-list-item>
        <v-list-item-avatar color="grey">
          <v-icon>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">女の子</v-list-item-title>
          <v-list-item-subtitle>by ユーザネーム</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div class="border-animation-pink">
        <v-img
          v-bind:src="require('@/static/sample_01.png')"
          height="194"
          @click="sample1 = true"
        ></v-img>
      </div>

      <v-card-subtitle>2020/02/15</v-card-subtitle>

      <v-card-text>
        テキストテキストテキストテキストテキスト
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        0
      </v-card-actions>
    </v-card>

    <v-dialog
      v-model="sample1"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">「女の子」の感情</v-card-title>

        <v-card-text>
          幸せのようです😀
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="sample1 = false"
          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <h3 class="my-5">感情が読み取れなかったとき↓</h3>
    </div>

    <v-card
      max-width="344"
      class="mx-auto my-5"
    >
      <v-list-item>
        <v-list-item-avatar color="grey">
          <v-icon>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">ポケモン</v-list-item-title>
          <v-list-item-subtitle>by ユーザネーム</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div class="border-animation-blue">
        <v-img
          v-bind:src="require('@/static/sample_02.png')"
          height="194"
          @click="sample2 = true"
        ></v-img>
      </div>

      <v-card-subtitle>2020/02/15</v-card-subtitle>

      <v-card-text>
        テキストテキストテキストテキストテキスト
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        0
      </v-card-actions>
    </v-card>

    <v-dialog
      v-model="sample2"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">「ポケモン」の感情</v-card-title>

        <v-card-text>
          感情を読み取れませんでした…
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="sample2 = false"
          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <h2 class="mt-6">
        他のユーザが投稿した顔写真を見たくなったり、これから顔写真を投稿したいと思ったあなたは、<br>
        今すぐサインアップしてこのサービスを楽しんでみてください！！
      </h2>
      <v-btn color="primary my-3">
        <n-link to="/signup" class="original-link">
          今すぐサインアップする
        </n-link>
      </v-btn>

      <h2 class="mt-6">
        もしもすでにサインアップ（登録）済みならば、サインインしましょう！
      </h2>
      <v-btn color="success my-3">
        <n-link to="/signin" class="original-link">
          今すぐサインインする
        </n-link>
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from '../plugins/axios'

export default {
  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  mounted () {
    // 顔写真の投稿を取得
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
    sample1: false,
    sample2: false,
    posts: [],
    displayLists: [],
    length: 0,
    pageSize: 10,
  }),
}
</script>

<style scoped>
</style>
