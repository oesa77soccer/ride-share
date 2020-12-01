<template>
  <v-container>
    <div>
      <h4 class="display-1">Become a Driver</h4>

      <instructions details="Sign up to be a driver." />

      <v-form v-model="valid">
        <v-text-field
          v-model="member.state"
          v-bind:rules="rules.state"
          error-count="10"
          type="state"
          label="State"
          required
        >
        </v-text-field>

        <v-text-field
          v-model="member.licenseNumber"
          v-bind:rules="rules.licenseNumber"
          error-count="10"
          type="licenseNumber"
          label="License Number"
          required
        >
        </v-text-field>

        <v-text-field
          v-model="member.password"
          v-bind:rules="rules.password"
          error-count="10"
          type="password"
          label="Non-trivial password"
          required
        >
        </v-text-field>

        <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
          >Drive!
        </v-btn>
      </v-form>

      <div class="text-xs-center">
        <v-dialog v-model="dialogVisible" width="500">
          <v-card>
            <v-card-title primary-title>
              {{ dialogHeader }}
            </v-card-title>

            <v-card-text>
              {{ dialogText }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-container>
</template>

<script>
import Instructions from "../components/Instructions.vue";

export default {
  name: "BecomeDriverPage",
  components: {
    Instructions, // Use the Instructions component we just imported
  },
  data: function () {
    return {
      valid: false, // Are all the fields in the form valid?

      // Object to collect account data
      member: {
        licenseState: "",
        licenseNumber: "",
        password: "",
      },

      // Was an account created successfully?
      addedDriver: false,

      // Data to be displayed by the dialog.
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      // Validation rules for the form fields. This functionality is an extension
      // that's part of the Vuetify package. Each rule is a list of functions
      // (note the fat arrows). Vuetify invokes all functions in the list,
      // passing it the content of the associated form field. Functions should
      // return either true (the field passes that validation) or a string
      // containing an error message indicating why the field doesn't pass validation.
      rules: {
        required: [(val) => val.length > 0 || "Required"],
        state: [
          (val) => /^[A-Z]{2}$/.test(val) || "Invalid State (format: OH)",
        ],
        licenseNumber: [
          (val) => /^[A-Z]{2}\d{6}$/.test(val) || "Invalid license number (format: AA######)",
        ],
        password: [
          (val) => /[A-Z]/.test(val) || "Need upper case letter",
          (val) => /[a-z]/.test(val) || "Need lower case letter",
          (val) => /\d/.test(val) || "Need digit",
          (val) => val.length >= 8 || "Minimum 8 characters",
        ],
      },
    };
  },

  beforeMount() {
    if (!this.isLoggedIn()) {
        this.$router.push({ name: "sign-in" });
    }
  },

methods: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },

    userId() {
        return this.$store.getters.userId;
    },

    // Invoked when the user clicks the 'Sign Up' button.
    handleSubmit: function () {
      // Haven't been successful yet.
      this.addedDriver = false;

      // Post the content of the form to the Hapi server.
      this.$axios
        .post("/drivers", {
          userId: this.userId(),
          licenseState: this.member.state,
          licenseNumber: this.member.licenseNumber
        })
        .then((response) => {
          // Based on whether things worked or not, show the
          // appropriate dialog.
          if (response.data.ok) {
            this.showDialog("Success", response.data.message);
            this.addedDriver = true;
            this.$store.commit("becomeDriver");

          } else {
            this.showDialog("Sorry", response.data.message);
          }
        })
        .catch((err) => this.showDialog("Sorry", err.response.data.message));
    },

    // Helper method to display the dialog box with the appropriate content.
    showDialog: function (header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },

    // Invoked by the "Okay" button on the dialog; dismiss the dialog
    // and navigate to the home page.
    hideDialog: function () {
      this.dialogVisible = false;
      if (this.addedDriver) {
        // Only navigate away from the sign-up page if we were successful.
        this.$router.push({ name: "home-page" });
      }
    },
  },
};
</script>
