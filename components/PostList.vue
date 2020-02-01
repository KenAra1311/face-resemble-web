<template>
  <v-card
    max-width="344"
    class="mx-auto"
  >
    <v-list-item>
      <v-list-item-avatar color="grey">
        <v-icon v-if="!user.profile_image">
          mdi-account-circle
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ posts.title }}</v-list-item-title>
        <v-list-item-subtitle>by {{ user.name }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"
      height="194"
    ></v-img>

    <v-card-text>
      {{ posts.content }}
    </v-card-text>

    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
      >
        コメント
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    user: {
      name: 'KenAra',
      profile_image: null,
    },
    posts: {
      title: '私の友人です :)',
      content: 'テキストテキストテキストテキストテキスト',
    },
    likes: [],
  }),
}
</script>

<style scoped>
</style>
