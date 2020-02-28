<template>
  <div v-if="user">
    <div v-if="userData[0]">
      <UserInfo
        :user="user"
        :userData="userData[0]"
        :followData="followData"
      ></UserInfo>

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
