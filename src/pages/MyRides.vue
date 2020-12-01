<template>
  <v-container>
    <div>
      <h4 class="display-1">My Rides</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="rides"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td>
                <div v-if="isDriver(item)">Driver</div>
                <div v-if="isPassenger(item)">Passenger</div>
            </td>
            <td>{{ item.date }}</td>
            <td>{{ item.time }}</td>
            <td>
              <div>{{ item.from.direction }}</div>
              <div>{{ item.to.direction }}</div>
            </td>
            <td>
              <div>{{ item.from.name }}</div>
              <div>{{ item.to.name }}</div>
            </td>
            <td>{{ item.distance }}</td>
            <td>${{ item.fuelPrice }}</td>
            <td>${{ item.fee }}</td>
            <td>{{item.passengerNumber}}/{{ item.capacity }}</td>
            <td>${{ Math.floor((item.distance*item.fuelPrice/(item.passengerNumber+1))+item.fee) }}</td>

            <td>
              <v-icon v-if="isAdmin" medium > mdi-delete </v-icon>
              <v-icon title="Ride!" v-if="!isAdmin && !isPassenger(item) && !isDriver(item)" medium class="ml-2">
                  mdi-car-convertible
              </v-icon>
              <v-icon title="Cancel Ride" v-if="!isAdmin && isPassenger(item) && !isDriver(item)" large class="ml-2">
                  mdi-minus-circle-outline
              </v-icon>
              <v-icon title="Sign up to Drive" v-if="!isAdmin && !isDriver(item) && !isPassenger(item)" medium class="ml-2" >
                  mdi-seat-recline-extra
              </v-icon>
              <v-icon title="Cancel being a Driver" v-if="!isAdmin && isDriver(item) && !isPassenger(item)" large class="ml-2" >
                  mdi-minus-circle-outline
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>

      <v-snackbar v-model="snackbar.show">
        {{ snackbar.text }}
        <v-btn color="blue" text @click="snackbar.show = false"> Close </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
export default {
    name: "my-rides",

    data: function() {
        return {
        headers: [
            { text: "I am a...", value: "drivpass" },
            { text: "Date", value: "date" },
            { text: "Time", value: "time" },
            { text: "Direction", value: "direction" },
            { text: "Name", value: "name" },
            { text: "Distance (mi.)", value: "distance" },
            { text: "Fuel Price", value: "fuelPrice" },
            { text: "Fee", value: "fee" },
            { text: "Seats Taken", value: "seatsTaken" },
            { text: "Total Cost", value: "totalCost" },
            { text: "Action", value: "action" }
        ],
        rides: [],

        snackbar: {
            show: false,
            text: ""
        }
      };
    },

    beforeMount() {
        // if (!this.isLoggedIn()) {
        //     this.$router.push({ name: "sign-in" });
        // }
        // else {
            const id = this.userId();
            this.$axios.get(`/my-rides/${id}`, {
                id: id,
            })
            .then(response => {
                console.log(response);
                this.rides = response.data.results.map(ride => ({
                    id: ride.id,
                    date: ride.date,
                    time: ride.time,
                    from: {
                        direction: "From",
                        name: ride["FromLocation"].name,
                        address: ride["FromLocation"].address,
                        city: ride["FromLocation"].city,
                        state: ride["FromLocation"].state,
                        zipCode: ride["FromLocation"].zipCode,
                    },
                    to: {
                        direction: "To",
                        name: ride["ToLocation"].name,
                        address: ride["ToLocation"].address,
                        city: ride["ToLocation"].city,
                        state: ride["ToLocation"].state,
                        zipCode: ride["ToLocation"].zipCode,
                    },
                    fuelPrice: ride.fuelPrice,
                    capacity: ride.Vehicle.capacity,
                    distance: ride.distance,
                    fee: ride.fee,
                    vehicleId: ride.vehicleId,
                    isPassenger: ride.isPassenger,
                    isDriver: ride.isDriver,
                    passengerNumber: ride.passengerNumber,
                }))
            });
    },
    computed: {
        isAdmin() {
            return this.$store.getters.isAdmin;
        } 
    },

    methods: {
        isDriver(item) {
            return item.isDriver !== null;
        },

        isPassenger(item) {
            return item.isPassenger;
        },   

        isLoggedIn() {
            return this.$store.getters.isLoggedIn;
        },

        // Display a snackbar message.
        showSnackbar(text) {
            this.snackbar.text = text;
            this.snackbar.show = true;
        },

        // Calculate the CSS class for an item
        itemClass(item) {
            const currentRide = this.$store.state.currentRide;
            if (currentRide && currentRide.id === item.id) {
                return "currentRide";
            }
        },

        userId() {
            return this.$store.getters.userId;
        },
    }
}

</script>

<style>
.currentRide {
  background: lightcoral;
}

</style>
