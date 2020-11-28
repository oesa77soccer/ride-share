<template>
  <v-container>
    <div>
      <h4 class="display-1">Welcome, Sexy Admin</h4>

      <p class="body-1">We love that you're our admin (;</p>
    </div>

    <v-btn text v-bind:to="{ name: 'vehicles' }">
      Vehicles
    </v-btn>
    <v-btn text v-bind:to="{ name: 'vehicle-types' }">
      Vehicle Types
    </v-btn>
    <v-btn text v-bind:to="{ name: 'rides' }">
      Rides
    </v-btn>
    <v-btn text v-bind:to="{ name: 'rides' }">
      Rides
    </v-btn>


  </v-container>
</template>

<script>
export default {
  methods: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },

  beforeMount() {
    if (!this.isAdmin()) {
        this.$router.push({ name: "sign-in" });
    }
  },
};
</script>