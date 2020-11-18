<template>
  <v-container>
    <div>
      <h4 class="display-1">Rides</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="rides"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td>{{ item.email }}</td>
            <td>{{ item.firstName }}</td>
            <td>{{ item.lastName }}</td>
            <td>
              <v-icon small @click="deleteRide(item)">
                mdi-delete
              </v-icon>
              <v-icon small class="ml-2" @click="updateRide(item)">
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
  name: "Rides",

  data: function() {
    return {
      headers: [
        { text: "Email", value: "email" },
        { text: "First", value: "firstName" },
        { text: "Last", value: "lastName" },
        { text: "Action", value: "action" }
      ],
      rides: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/rides").then(response => {
      this.rides = response.data.map(ride => ({
        id: ride.id,
        email: ride.email,
        firstName: ride.first_name,
        lastName: ride.last_name
      }));
    });
  },

  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    // Calculate the CSS class for an item
    itemClass(item) {
      const currentRide = this.$store.state.currentRide;
      if (currentRide && currentAccount.id === item.id) {
        return "currentRide";
      }
    },

    // Update ride information.
    updateRide(item) {
      console.log("UPDATE", JSON.stringify(item, null, 2));
      this.showSnackbar("Sorry, update is not yet implemented.");
    },

    // Delete an ride.
    deleteRides(item) {
      this.$axios.delete(`/ride/${item.id}`).then(response => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local account
          // by filtering the deleted account from the list of accounts.
          this.rides = this.rides.filter(
            ride => ride.id !== item.id
          );
        }
      });
    }
  }
};
</script>

<style>
.currentRide {
  background: lightcoral;
}
</style>
