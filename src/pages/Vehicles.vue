<template>
  <v-container>
    <div>
      <h4 class="display-1">Vehicles</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="vehicles"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td contenteditable @blur="updateMake(item, $event)">{{ item.make }}</td>
            <td contenteditable @blur="updateModel(item, $event)">{{ item.model }}</td>
            <td contenteditable @blur="updateColor(item, $event)">{{ item.color }}</td>
            <td contenteditable @blur="updateVehicleTypeId(item, $event)">{{ item.vehicleTypeId }}</td>
            <td contenteditable @blur="updateCapacity(item, $event)">{{ item.capacity }}</td>
            <td contenteditable @blur="updateMPG(item, $event)">{{ item.mpg }}</td>
            <td contenteditable @blur="updateLicenseState(item, $event)">{{ item.licenseState }}</td>
            <td contenteditable @blur="updateLicensePlate(item, $event)">{{ item.licensePlate }}</td>
            <td>
              <v-icon small @click="deleteVehicle(item)">
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
  name: "Vehicles",

  data: function() {
    return {
      headers: [
        { text: "Make", value: "make" },
        { text: "Model", value: "model" },
        { text: "Color", value: "color" },
        { text: "Vehicle Type", value: "vehicleTypeId" },
        { text: "Capacity", value: "capacity" },
        { text: "MPG", value: "mpg" },
        { text: "License State", value: "licenseState" },
        { text: "License Plate", value: "licensePlate" },
        { text: "Action", value: "action" }
      ],
      vehicles: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/vehicles").then(response => {
      this.vehicles = response.data.map(vehicle => ({
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        vehicleTypeId: vehicle.vehicleTypeId,
        capacity: vehicle.capacity,
        mpg: vehicle.mpg,
        licenseState: vehicle.licenseState,
        licensePlate: vehicle.licensePlate,
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

    // Update make 
    updateMake(item, e) {
        item.make = e.target.textContent;
        this.updateVehicle(item);
    },

    // Update model 
    updateModel(item, e) {
        item.model = e.target.textContent;
        this.updateVehicle(item);
    },

    // Update color 
    updateColor(item, e) {
        item.color = e.target.textContent;
        this.updateVehicle(item);
    },

    // Update vehicle type 
    updateVehicleTypeId(item, e) {
        item.vehicleTypeId = e.target.textContent;
        this.updateVehicle(item);
    },

    // Update capacity 
    updateCapacity(item, e) {
        item.capacity = e.target.textContent;
        this.updateVehicle(item);
    },

    // Update mpg 
    updateMPG(item, e) {
        item.mpg = e.target.textContent;
        this.updateVehicle(item);
    },

    // Update license state 
    updateLicenseState(item, e) {
        item.licenseState = e.target.textContent;
        this.updateVehicle(item);
    },

    // Update license plate 
    updateLicensePlate(item, e) {
        item.licensePlate = e.target.textContent;
        this.updateVehicle(item);
    },

    // update entire vehicle row
    updateVehicle(item) {
        this.$axios
        .patch(`/vehicles/${item.id}`, {
            make: item.make,
            model: item.model,
            color: item.color,
            vehicleTypeId: item.vehicleTypeId,
            capacity: item.capacity,
            mpg: item.mpg,
            licenseState: item.licenseState,
            licensePlate: item.licensePlate,
         })
        .then(response => {
            if (response.data.ok) {
                console.log("Edit worked in the database");
            }
        });
    },

    // Delete a vehicle.
    deleteVehicle(item) {
      this.$axios.delete(`/vehicle/${item.id}`).then(response => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local vehicle
          // by filtering the deleted vehicle from the list of vehicles.
          this.vehicles = this.vehicles.filter(
            vehicle => vehicle.id !== item.id
          );
        }
      });
    }
  }
};
</script>

<style>
</style>
