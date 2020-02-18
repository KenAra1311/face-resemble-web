<template>
  <div v-if="user && user.admin">
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-list>
            <v-subheader>管理項目</v-subheader>

            <div v-for="(item, i) in items" :key="i">
              <v-list-item :to="'/admin/' + item.link">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
            </div>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.state.currentUser
    },
  },

  data: () => ({
    items: [
      { title: 'ユーザ一覧', icon: 'mdi-account', link: 'users' },
      { title: '投稿一覧', icon: 'face', link: 'posts' },
    ],
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
