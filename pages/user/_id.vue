<template>
  <div v-if="user">
    <div v-if="userData[0]">
      <v-card
        max-width="344"
        class="mx-auto my-3"
      >
        <v-list-item>
          <v-list-item-avatar color="grey">
            <v-img
              v-if="userData[0].profile_image"
              :src="userData[0].profile_image"
            ></v-img>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ userData[0].name }}</v-list-item-title>
            <v-list-item-subtitle>アカウント作成日：{{ userData[0].created }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <div class="text-center my-4">
          <v-btn
            v-if="user.id === userData[0].id"
            rounded
            disabled
          >
            フォロー
          </v-btn>
          <v-btn
            v-else-if="user.follows.some(follow => follow.follow_id === userData[0].id)"
            @click="removeUserFollow(userData[0].id)"
            rounded
            color="error"
          >
            フォローから外す
          </v-btn>
          <v-btn
            v-else
            @click="followUser(userData[0].id)"
            rounded
            color="primary"
          >
            フォロー
          </v-btn>
        </div>

        <v-divider />

        <v-list subheader dense class="ml-3">
          <v-subheader>フォロー数：
            <n-link :to="'/follow/' + userData[0].id" class="original-link">
              {{ userData[0].follows.length }}
            </n-link>
          </v-subheader>
          <v-subheader>フォロワー数：
            <n-link :to="'/follower/' + userData[0].id" class="original-link">
              {{ followData.length }}
            </n-link>
          </v-subheader>
          <v-subheader>いいねをもらった数：
            {{ userData[0].like_total_count }}
          </v-subheader>
          <v-subheader>いいねをした数：
            {{ userData[0].likes.length }}
          </v-subheader>
          <v-subheader>投稿した顔写真の数：
            {{ userData[0].posts.length }}
          </v-subheader>
        </v-list>
      </v-card>

      <h2 class="text-center my-8" v-if="user.id === userData[0].id">自分が投稿した顔写真一覧</h2>
      <h2 class="text-center my-8" v-else>{{ userData[0].name }} さんが投稿した顔写真一覧</h2>

      <Card
        :user="user"
        :posts="postData"
        :displayLists="displayLists"
        :length="length"
        :pageSize="pageSize"
      ></Card>
    </div>

    <div v-else>
      <p>ユーザは存在しないか、削除されました。</p>
      <n-link to="/">
        トップページに戻る
      </n-link>
    </div>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  async asyncData ({ params }) {
    const { data: userData }   = await axios.get(`/v1/users?id=${params.id}`)
    const { data: postData }   = await axios.get(`/v1/posts?user_id=${params.id}`)
    const { data: followData } = await axios.get(`/v1/follows?follow_id=${params.id}`)
    return {
      userData,
      postData,
      followData,
    }
  },

  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  mounted () {
    // ユーザの投稿をページネーション用の配列に格納
    this.length       = Math.ceil(this.postData.length / this.pageSize)
    this.displayLists = this.postData.slice(0, this.pageSize)
  },

  data: () => ({
    displayLists: [],
    length: 0,
    pageSize: 10,
  }),

  methods: {
    followUser (followId) {
      const follow = {
        user_id: this.user.id,
        follow_id: followId,
      }
      axios.post('/v1/follows', follow)
      .then(res => {
        follow.id = res.data.id
        this.user.follows.push(follow)
        this.followData.push(follow)
      })
      .catch(error => {
        console.log(error)
      })
    },
    removeUserFollow (followingUserId) {
      // この投稿に対する自分のいいねのデータを削除する
      for (var key of this.user.follows ) {
        if ( key.follow_id === followingUserId ) {
          var followId = key.id
          break
        }
      }
      axios.delete(`/v1/follows/${followId}`)
      .then(res => {
        // いいねを取り消した配列の要素のデータも一緒に削除
        for (var key of this.user['follows'] ) {
          if ( key.follow_id === res.data.follow_id ) {
            delete key.id
            delete key.user_id
            delete key.follow_id
            break
          }
        }
        this.followData.pop()
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
.original-link {
  color: #D81B60;
  font-weight: bold;
  text-decoration: underline
}
</style>
