<template>
  <div v-if="user">
    <div v-if="followData[0]">
      <List
        :listHeader="userData[0].name ? userData[0].name + 'さんをフォローしている人たち' : '自分をフォローている人たち'"
        :lists="followData"
      ></List>
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
