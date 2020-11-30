<template>
  <v-container>
    <div>
      <h4 class="display-1">Vehicles</h4>
      <v-icon large @click="addVehicle()">
          mdi-plus
      </v-icon>

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
        console.log(item.make);
        item.make = e.target.textContent;
        console.log(item.make);
        const payload = {
          make: item.make
        }
        this.updateVehicle(item.id, payload);    
    },

    // Update model 
    updateModel(item, e) {
        item.model = e.target.textContent;
        console.log(item.model);
        const payload = {
          model: item.model
        }
        this.updateVehicle(item.id, payload);    
    },

    // Update color 
    updateColor(item, e) {
        item.color = e.target.textContent;
        const payload = {
          color: item.color
        }
        this.updateVehicle(item.id, payload);    
    },

    // Update vehicle type 
    updateVehicleTypeId(item, e) {
        item.vehicleTypeId = e.target.textContent;
        const payload = {
          vehicleTypeId: item.vehicleTypeId
        }
        this.updateVehicle(item.id, payload);    
    },

    // Update capacity 
    updateCapacity(item, e) {
        item.capacity = e.target.textContent;
        const payload = {
          capacity: item.capacity
        }
        this.updateVehicle(item.id, payload);    
    },

    // Update mpg 
    updateMPG(item, e) {
        item.mpg = e.target.textContent;
        const payload = {
          mpg: item.mpg
        }
        this.updateVehicle(item.id, payload);    
    },

    // Update license state 
    updateLicenseState(item, e) {
        item.licenseState = e.target.textContent;
        const payload = {
          licenseState: item.licenseState
        }
        this.updateVehicle(item.id, payload);
    },

    // Update license plate 
    updateLicensePlate(item, e) {
        item.licensePlate = e.target.textContent;
        const payload = {
          licensePlate: item.licensePlate
        }
        this.updateVehicle(item.id, payload);    },

    // update vehicle data entry
    updateVehicle(id, payload) {
        console.log(payload);
        console.log(id);
        this.$axios
        .patch(`/vehicles/${id}`, payload)
        .then(response => {
            if (response.data.ok) {
                console.log("Edit worked in the database");
            }
        });
    },

    addVehicle() {
        this.$axios.post(`/vehicles`, 
            {} // no parameters with adding empty vehicle
        )
        .then(response => {
            if (response.data.ok) {
                this.vehicles.push(response.data.newVehicle);
                console.log("Add worked in the database");
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
