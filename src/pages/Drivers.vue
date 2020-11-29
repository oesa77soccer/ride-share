<template>
  <v-container>
    <div>
      <h4 class="display-1">Drivers</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="drivers"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.userId }}</td>
            <td>{{ item.licenseNumber }}</td>
            <td>{{ item.licenseState }}</td>
            <td>
              <v-icon small @click="deleteDriver(item)">
                mdi-delete
              </v-icon>
              <v-icon small class="ml-2" @click="updateDriver(item)">
                mdi-pencil
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-snackbar v-model="snackbar.show">
        {{ snackbar.text }}
        <v-btn color="blue" text @click="snackbar.show = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Drivers",

  data: function() {
    return {
      headers: [
        { text: "User ID", value: "userId" },
        { text: "License Number", value: "licenseNumber" },
        { text: "License State", value: "licenseState" },
        { text: "Action", value: "action" },
      ],
      drivers: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/drivers").then(response => {
      this.drivers = response.data.map(driver => ({
        id: driver.id,
        userId: driver.userId,
        licenseNumber: driver.licenseNumber,
        licenseState: driver.licenseState,
      }));
    });
  },

beforeMount() {
    if (!this.isAdmin()) {
        this.$router.push({ name: "home" });
    }
  },

  methods: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },

    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    // Update driver information.
    updateDriver(item) {
      console.log("UPDATE", JSON.stringify(item, null, 2));
      this.showSnackbar("Sorry, update is not yet implemented.");
    },

    // Delete a driver.
    deleteDriver(item) {
      this.$axios.delete(`/driver/${item.id}`).then(response => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local driver
          // by filtering the deleted driver from the list of drivers.
          this.drivers = this.drivers.filter(
            driver => driver.id !== item.id
          );
        }
      });
    }
  }
};
</script>

<style>
</style>
