<template>
  <v-container>
    <div>
      <h4 class="display-1">Passengers</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="passengers"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.passengerId }}</td>
            <td>{{ item.rideId }}</td>
            <td>
              <v-icon small @click="deletePassenger(item)">
                mdi-delete
              </v-icon>
              <v-icon small class="ml-2" @click="updatePassenger(item)">
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
  name: "Passengers",

  data: function() {
    return {
      headers: [
        { text: "Passenger ID", value: "passengerId" },
        { text: "Ride ID", value: "rideId" },
        { text: "Action", value: "action" },
      ],
      passengers: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/passengers").then(response => {
      this.passengers = response.data.map(passenger => ({
        id: passenger.id,
        passengerId: passenger.passengerId,
        rideId: passenger.rideId,
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

    // Update passenger information.
    updatePassenger(item) {
      console.log("UPDATE", JSON.stringify(item, null, 2));
      this.showSnackbar("Sorry, update is not yet implemented.");
    },

    // Delete a passenger.
    deletePassenger(item) {
      this.$axios.delete(`/passenger/${item.id}`).then(response => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local passenger
          // by filtering the deleted passenger from the list of passengers.
          this.passengers = this.passengers.filter(
            passenger => passenger.id !== item.id
          );
        }
      });
    }
  }
};
</script>

<style>
</style>
