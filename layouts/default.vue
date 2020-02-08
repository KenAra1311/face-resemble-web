<template>
  <v-app dark>
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.state.currentUser
    },
    loading () {
      return this.$store.state.loading
    },
    items () {
      if ( this.user ) {
        return [
          {
            icon: 'mdi-apps',
            title: '投稿一覧',
            to: '/'
          },
          {
            icon: 'mdi-chart-bubble',
            title: '顔写真を投稿',
            to: '/post/create'
          },
          {
            icon: 'info',
            title: 'アカウント情報',
            to: '/user'
          }
        ]
      } else {
        return [
          {
            icon: 'mdi-apps',
            title: 'サインイン',
            to: '/signin'
          },
          {
            icon: 'mdi-chart-bubble',
            title: '新規登録',
            to: '/signup'
          }
        ]
      }
    },
  },

  data: () => ({
    clipped: false,
    drawer: false,
    fixed: false,
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: 'Face-Resemble',
  })
}
</script>
