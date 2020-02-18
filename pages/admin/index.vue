<template>
  <div v-if="user && user.admin">
    <h2>管理項目一覧</h2>
  </div>
</template>

<script>
export default {
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
