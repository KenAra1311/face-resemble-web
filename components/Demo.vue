<template>
  <div>
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
          <v-list-item-subtitle>by
            <span class="demo-design">ユーザネーム</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div class="border-animation-pink">
        <v-img
          v-bind:src="require('@/static/sample_01.png')"
          height="auto"
          @click="sample1 = true"
        ></v-img>
      </div>

      <v-card-subtitle>2020/02/15</v-card-subtitle>

      <v-card-text>
        いい笑顔（＾ω＾）
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <span class="demo-design">1234</span>
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
          <v-list-item-title class="headline">みみっきゅ</v-list-item-title>
          <v-list-item-subtitle>by
            <span class="demo-design">ポケモン愛好家</span>
          </v-list-item-subtitle>
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
        ミミッキュはかわいい☺️
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <span class="demo-design">99999</span>
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
      <v-btn color="primary my-3" x-large>
        <n-link to="/signup" class="demo-link">
          今すぐサインアップする
        </n-link>
      </v-btn>

      <h2 class="mt-6">
        もしもすでにサインアップ（登録）済みならば、サインインしましょう！
      </h2>
      <v-btn color="success my-3" x-large>
        <n-link to="/signin" class="demo-link">
          今すぐサインインする
        </n-link>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    sample1: false,
    sample2: false,
  })
}
</script>

<style scoped>
.demo-design {
  color: #D81B60;
  font-weight: bold;
  text-decoration: underline
}
.demo-link {
  color: white;
  font-weight: bold;
}
</style>
