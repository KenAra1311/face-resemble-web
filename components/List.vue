<template>
  <div>
    <h2 class="text-center my-8">{{ listHeader }}</h2>

    <v-list class="mx-auto" max-width="344">
      <v-list-item
        v-for="(like, index) in likeData"
        :key="index"
        :to="'/user/' + like.user.id"
      >
        <v-list-item-avatar>
          <v-img
            v-if="like.user.profile_image"
            :src="like.user.profile_image"
          ></v-img>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="like.user.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  props: [
    'listHeader',
    'likeData',
  ],
}
</script>

<style scoped>
</style>
