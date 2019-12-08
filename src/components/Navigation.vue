<template>  
      <nav role="navigation" aria-label="main navigation" class="bd-navbar navbar has-shadow is-spaced">
        <div class="navbar-brand">
          <router-link to="dashboard" class="navbar-item">
            <h3>Client DB</h3>
          </router-link>
        </div>
        
        
        <div class="navbar-end">
          <router-link to="settings" class="navbar-item button is-secondary">Profile</router-link>
          <a @click="logout" class="navbar-item button is-secondary">logout</a>
        </div>
      </nav>  
</template>

<script>
const fb = require("../firebaseConfig.js");
export default {
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>