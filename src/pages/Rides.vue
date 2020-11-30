<template>
  <v-container>
    <div>
      <h4 class="display-1">Rides</h4>

      <select name="field" id="field">
        <option value="name">Name</option>
        <option value="address">Address</option>
        <option value="city">City</option>
        <option value="state">State</option>
        <option value="zipCode">Zip Code</option>
      </select>
      <input id="search" type="text" placeholder="Search.." />
      <v-icon large @click="search()"> mdi-search-web </v-icon>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="rides"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td contenteditable @blur="updateDate(item, $event)">{{ item.date }}</td>
            <td contenteditable @blur="updateTime(item, $event)">{{ item.time }}</td>

            <td>
              <div>{{ item.from.direction }}</div>
              <div>{{ item.to.direction }}</div>
            </td>
            <td>
              <div>{{ item.from.name }}</div>
              <div>{{ item.to.name }}</div>
            </td>
            <td>
              <div>{{ item.from.address }}</div>
              <div>{{ item.to.address }}</div>
            </td>
            <td>
              <div>{{ item.from.city }}</div>
              <div>{{ item.to.city }}</div>
            </td>
            <td>
              <div>{{ item.from.state }}</div>
              <div>{{ item.to.state }}</div>
            </td>
            <td>
              <div>{{ item.from.zipCode }}</div>
              <div>{{ item.to.zipCode }}</div>
            </td>
            <td>
              <v-icon v-if="isAdmin" small @click="deleteRide(item)"> mdi-delete </v-icon>
              <v-icon v-if="isAdmin" small class="ml-2" @click="updateRide(item)">
                mdi-pencil
              </v-icon>
              <v-icon v-if="!isAdmin" small class="ml-2" @click="signUpForRide(item)">
                mdi-plus
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
    name: "Rides",

    data: function() {
        return {
        headers: [
            { text: "Date", value: "date" },
            { text: "Time", value: "time" },
            { text: "Direction", value: "direction" },
            { text: "Name", value: "name" },
            { text: "Address", value: "address" },
            { text: "City", value: "city" },
            { text: "State", value: "state" },
            { text: "Zip Code", value: "zipCode" },
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
            this.$axios.get('/rides', {
                params: this.$route.query
            })
            .then(response => {
                this.rides = response.data.map(ride => ({
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
                    }
                }))
            });
        // }
    },
    computed: {
        isAdmin() {
            return this.$store.getters.isAdmin;
        }
    },

    methods: {
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

        search() {
            let text = document.getElementById("search").value;
            let field = document.getElementById("field").value;
            const params = new URLSearchParams([[field, text]]);

            this.$axios.get("/rides", { 
                params: params
            })
            .then(response => {
                this.rides = response.data.map(ride => ({
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
                    }
                }));
            });
            this.$router.push(`/rides?${field}=${text}`);
        },

        // Update date 
        updateDate(item, e) {
            item.date = e.target.textContent;
            this.updateRide(item);
        },

        // Update time 
        updateTime(item, e) {
            item.time = e.target.textContent;
            this.updateRide(item);
        },    

        updateRide(item) {
            this.$axios
            .patch(`/rides/${item.id}`, {
                date: item.date,
                time: item.time,
            })
            .then(response => {
                if (response.data.ok) {
                    console.log("Edit worked in the database");
                }
            });
        },

        // sign up for ride if occupancy is available
        signUpForRide(item) {
            console.log("SIGN UP", JSON.stringify(item, null, 2));

            const params = {
              rideId: item.id,
              userId: this.userId(),
            }
            //console.log(this.userId());

            // need post route to add self as a rider for a ride if it has capacity
            this.$axios.post('/passengers', params).then(response => {
                if (response.data.ok) {
                    this.showSnackbar("Signing up for ride was successful!"); 
                }
                else {
                    this.showSnackbar("Signing up for ride was unsuccessful!"); 
                }
            });
        },

        // Delete a ride.
        deleteRide(item) {
            console.log("DELETE");
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
