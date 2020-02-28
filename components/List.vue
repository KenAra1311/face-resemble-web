<template>
  <div>
    <h2 class="text-center my-8">{{ listHeader }}</h2>

    <v-list class="mx-auto" max-width="344">
      <v-list-item
        v-for="(list, index) in lists"
        :key="index"
        :to="'/user/' + list.user.id"
      >
        <v-list-item-avatar>
          <v-img
            v-if="list.user.profile_image"
            :src="list.user.profile_image"
          ></v-img>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="list.user.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  props: [
    'listHeader',
    'lists',
  ],
}
</script>

<style scoped>
</style>
