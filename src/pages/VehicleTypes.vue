<template>
  <v-container>
    <div>
      <h4 class="display-1">Vehicle Types</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="vehicleTypes"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.type }}</td>
            <td>
              <v-icon small @click="deleteVehicleType(item)">
                mdi-delete
              </v-icon>
              <v-icon small class="ml-2" @click="updateVehicleType(item)">
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
  name: "VehicleTypes",

  data: function() {
    return {
      headers: [
        { text: "Vehicle Type", value: "vehicleType" },
        { text: "Action", value: "action" },
      ],
      vehicleTypes: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/vehicle-types").then(response => {
      this.vehicleTypes = response.data.map(vehicleType => ({
        id: vehicleType.id,
        type: vehicleType.type,
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

    // Update vehicleType information.
    updateVehicleType(item) {
      console.log("UPDATE", JSON.stringify(item, null, 2));
      this.showSnackbar("Sorry, update is not yet implemented.");
    },

    // Delete a vehicleType.
    deleteVehicleType(item) {
      this.$axios.delete(`/vehicle-type/${item.id}`).then(response => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local vehicleType
          // by filtering the deleted vehicleType from the list of vehicleTypes.
          this.vehicleTypes = this.vehicleTypes.filter(
            vehicleType => vehicleType.id !== item.id
          );
        }
      });
    }
  }
};
</script>

<style>
</style>
