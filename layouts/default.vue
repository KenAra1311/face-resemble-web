<template>
  <v-app dark>
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-alert
      v-if="notice.status"
      :type="notice.type"
    >
      {{ notice.message }}
    </v-alert>

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list shaped>
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
        <v-spacer />
        <v-btn
          icon
          @click.stop="miniVariant = !miniVariant"
        >
          <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
        </v-btn>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="clipped"
      class="pink darken-1"
      dense
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <n-link to="/">
        <v-toolbar-title v-text="title" class="top-link" title="トップページ" />
      </n-link>

      <v-spacer />

      <n-link v-if="user" :to="'/user/' + user.id">
        <v-list-item-avatar color="grey">
          <v-img
            v-if="user.profile_image"
            :src="user.profile_image"
          ></v-img>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
      </n-link>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

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
    notice () {
      return this.$store.state.topMessage
    },
    items () {
      if ( this.user && !this.user.admin ) {
        return [
          {
            icon: 'mdi-chart-bubble',
            title: '顔写真を投稿',
            to: '/post/create'
          },
          {
            icon: 'settings',
            title: 'アカウント情報',
            to: '/user/setting'
          },
        ]
      } else if ( this.user && this.user.admin ) {
        return [
          {
            icon: 'mdi-chart-bubble',
            title: '顔写真を投稿',
            to: '/post/create'
          },
          {
            icon: 'settings',
            title: 'アカウント情報',
            to: '/user/setting'
          },
          {
            icon: 'account_circle',
            title: '管理画面',
            to: '/admin/'
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
    fixed: false,
    clipped: true,
    drawer: false,
    miniVariant: false,
    right: true,
    title: 'Face-Resemble',
  })
}
</script>

<style>
* {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
a {
  text-decoration: none;
}
input, textarea {
 -webkit-user-select : auto;
}

/* 共通CSS */
.pointer {
  cursor: pointer;
}
/* ナビバーのタイトル */
.top-link {
  color: white;
  font-weight: bold;
  font-family: "Reenie Beanie";
}
/* ユーザへのメッセージ */
.v-application .success {
  position: -webkit-sticky;
  position: sticky;
  z-index: 10;
  top: 80px;
}
.v-application .warning {
  position: -webkit-sticky;
  position: sticky;
  z-index: 10;
  top: 80px;
}
</style>
