<template>
  <v-container>
    <div>
      <h4 class="display-1">Users</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="users"
      >
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td contenteditable @blur="updateEmail(item, $event)">{{ item.email }}</td>
            <td contenteditable @blur="updateFirstName(item, $event)">{{ item.firstName }}</td>
            <td contenteditable @blur="updateLastName(item, $event)">{{ item.lastName }}</td>
            <td contenteditable @blur="updateAdmin(item, $event)">{{ item.isAdmin  }}</td>
            <td>
              <v-icon small @click="deleteUser(item)">
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
  name: "Users",

  data: function() {
    return {
      headers: [
        { text: "Email", value: "email" },
        { text: "First", value: "firstName" },
        { text: "Last", value: "lastName" },
        { text: "Admin?", value: "isAdmin" },
        { text: "Action", value: "action" }
      ],
      users: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/users").then(response => {
      this.users = response.data.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
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

    // Calculate the CSS class for an item
    itemClass(item) {
      const currentUser = this.$store.state.currentUser;
      if (currentUser && currentUser.id === item.id) {
        return "currentUser";
      }
    },

    // Update user email 
    updateEmail(item, e) {
        const payload = {
            email: e.target.textContent,
        }
        this.updateUser(item.id, payload);    
    },

    // Update user first name 
    updateFirstName(item, e) {
        const payload = {
            firstName: e.target.textContent,
        }
        this.updateUser(item.id, payload);    
    },

    // Update user last name 
    updateLastName(item, e) {
        const payload = {
            lastName: e.target.textContent,
        }
        this.updateUser(item.id, payload);    
    },

    // Update admin privileges
    updateAdmin(item, e) {
        const payload = {
            isAdmin: e.target.textContent,
        }
        this.updateUser(item.id, payload);    
    },

    // update entire user
    updateUser(id, payload) {
        this.$axios
        .patch(`/users/${id}`, payload)
        .then(response => {
            if (response.data.ok) {
                console.log("Edit worked in the database");
            }
        })
        .catch(err => {
            console.log(err, "Error in making patch");
        });
    },

    // Delete a user.
    deleteUser(item) {
      this.$axios.delete(`/user/${item.id}`).then(response => {
        if (response.data.ok) {
          // The delete operation worked on the server; delete the local user
          // by filtering the deleted user from the list of users.
          this.users = this.users.filter(
            user => user.id !== item.id
          );
        }
      });
    }
  }
};
</script>

<style>
.currentUser {
  background: lightcoral;
}
</style>
