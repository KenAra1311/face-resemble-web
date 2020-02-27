<template>
  <div v-if="user">
    <div v-if="followData[0]">
      <h2 v-if="user.id === userData[0].id" class="text-center my-8">自分をフォローしている人たち</h2>
      <h2 v-else class="text-center my-8">{{ userData[0].name }} さんをフォローしている人たち</h2>

      <v-list class="mx-auto" max-width="344">
        <v-list-item
          v-for="(follow, index) in followData"
          :key="index"
          :to="'/user/' + follow.user.id"
        >
          <v-list-item-avatar>
            <v-img :src="follow.user.profile_image"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="follow.user.name"></v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list>
    </div>

    <div v-else>
      <h2 class="text-center my-8">フォローしている人はいないようです¯\_(ツ)_/¯</h2>
    </div>
  </div>
</template>

<script>
import axios from '../../plugins/axios'

export default {
  async asyncData ({ params }) {
    const { data: userData }   = await axios.get(`/v1/users?id=${params.id}`)
    const { data: followData } = await axios.get(`/v1/follows?follow_id=${params.id}`)
    return {
      userData,
      followData,
    }
  },

  computed: {
    user () {
      return this.$store.state.currentUser
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
