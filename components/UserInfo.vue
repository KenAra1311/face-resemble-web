<template>
  <v-card
    max-width="344"
    class="mx-auto my-3"
  >
    <v-list-item>
      <v-list-item-avatar color="grey">
        <v-img
          v-if="userData.profile_image"
          :src="userData.profile_image"
        ></v-img>
        <v-icon v-else>
          mdi-account-circle
        </v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="headline">{{ userData.name }}</v-list-item-title>
        <v-list-item-subtitle>アカウント作成日：{{ userData.created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <div class="text-center my-4">
      <v-btn
        v-if="user.id === userData.id"
        rounded
        disabled
      >
        フォロー
      </v-btn>
      <v-btn
        v-else-if="user.follows.some(follow => follow.follow_id === userData.id)"
        @click="removeUserFollow(userData.id)"
        rounded
        color="error"
      >
        フォローから外す
      </v-btn>
      <v-btn
        v-else
        @click="followUser(userData.id)"
        rounded
        color="primary"
      >
        フォロー
      </v-btn>
    </div>

    <v-divider />

    <v-list subheader dense class="ml-3">
      <v-subheader>フォロー数：
        <n-link :to="'/follow/' + userData.id" class="original-link">
          {{ userData.follows.length }}
        </n-link>
      </v-subheader>

      <v-subheader>フォロワー数：
        <n-link :to="'/follower/' + userData.id" class="original-link">
          {{ followData.length }}
        </n-link>
      </v-subheader>

      <v-subheader>いいねをもらった数：
        {{ userData.like_total_count }}
      </v-subheader>

      <v-subheader>いいねをした数：
        {{ userData.likes.length }}
      </v-subheader>

      <v-subheader>投稿した顔写真の数：
        {{ userData.posts.length }}
      </v-subheader>
    </v-list>
  </v-card>
</template>

<script>
import axios from '../plugins/axios'

export default {
  props: [
    'user',
    'userData',
    'followData',
  ],

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
}
</script>

<style scoped>
.original-link {
  color: #D81B60;
  font-weight: bold;
  text-decoration: underline
}
</style>
