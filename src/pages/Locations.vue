<template>
  <v-container>
    <div>
      <h4 class="display-1">Locations</h4>
      <v-icon large @click="addLocation">
          mdi-plus
      </v-icon>
      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="locations"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td contenteditable @blur="updateName(item, $event)">{{ item.name }}</td>
            <td contenteditable @blur="updateAddress(item, $event)">{{ item.address }}</td>
            <td contenteditable @blur="updateCity(item, $event)">{{ item.city }}</td>
            <td contenteditable @blur="updateState(item, $event)">{{ item.state }}</td>
            <td contenteditable @blur="updateZipCode(item, $event)">{{ item.zipCode }}</td>
            <td>
              <v-icon small @click="deleteLocation(item)">
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
  name: "Locations",

  data: function() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Address", value: "address" },
        { text: "City", value: "city" },
        { text: "State", value: "state" },
        { text: "Zip Code", value: "zipCode" },
        { text: "Action", value: "action" }
      ],
      locations: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/locations").then(response => {
      this.locations = response.data.map(location => ({
        id: location.id,
        name: location.name,
        address: location.address,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
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

    // Update name 
    updateName(item, e) {
        const payload = {
            name: e.target.textContent,
        }
        this.updateLocation(item.id, payload);
    },

    // Update address 
    updateAddress(item, e) {
        const payload = {
            address: e.target.textContent,
        }
        this.updateLocation(item.id, payload);
    },

    // Update city 
    updateCity(item, e) {
        const payload = {
            city: e.target.textContent,
        }
        this.updateLocation(item.id, payload);
    },

    // Update state 
    updateState(item, e) {
        const payload = {
            state: e.target.textContent,
        }
        this.updateLocation(item.id, payload);
    },

    // Update zip code 
    updateZipCode(item, e) {
        const payload = {
            zipCode: e.target.textContent,
        }
        this.updateLocation(item.id, payload);
    },

    updateLocation(id, payload) {
        this.$axios
        .patch(`/locations/${id}`, payload)
        .then(response => {
            if (response.data.ok) {
                console.log("Edit worked in the database");
            }
        })
        .catch(err => {
            console.log(err, "Error in making patch");
        });
    },

    addLocation() {
        this.$axios.post(`/locations`, 
            {} // no parameters with adding empty vehicle
        )
        .then(response => {
            if (response.data.ok) {
                this.locations.push(response.data.results);
                console.log("Add worked in the database");
            }
        });
    },

    // Delete a location.
    deleteLocation(item) {
      this.$axios.delete(`/location/${item.id}`).then(response => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local location
          // by filtering the deleted location from the list of locations.
          this.locations = this.locations.filter(
            location => location.id !== item.id
          );
        }
      });
    }
  }
};
</script>

<style>
</style>
