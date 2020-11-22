<template>
  <v-container>
    <div>
      <h4 class="display-1">Welcome, Ride-Share User</h4>

      <p class="body-1">We love that you chose us to be your on-demand travelling platform.</p>
    </div>
  </v-container>
</template>

<script>
export default {
  methods: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },

  beforeMount() {
    if (!this.isLoggedIn()) {
        this.$router.push({ name: "sign-in" });
    }
  },
};
</script>