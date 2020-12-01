<template>
  <v-container>
    <div>
      <h4 class="display-1">Vehicle Types</h4>
      <v-icon large @click="addVehicleType">
          mdi-plus
      </v-icon>
      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="vehicleTypes"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td contenteditable @blur="updateType(item, $event)">{{ item.type }}</td>
            <td>
              <v-icon small @click="deleteVehicleType(item)">
                mdi-delete
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

    // Update type information.
    updateType(item, e) {
      const payload = {
          type: e.target.textContent,
      }
      this.updateVehicleType(item.id, payload);
    },

    // update row for entire item in database
    updateVehicleType(id, payload) {
      this.$axios
      .patch(`/vehicle-type/${id}`, payload )
      .then(response => {
        if (response.data.ok) {
          console.log("Edit worked in the database");
        }
      });
    },

    addVehicleType() {
        this.$axios.post(`/vehicle-types`, 
            {} // no parameters with adding empty vehicle
        )
        .then(response => {
            if (response.data.ok) {
                this.vehicleTypes.push(response.data.results);
                console.log("Add worked in the database");
            }
        });
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
