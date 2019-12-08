<template>
  <section class="section">
    <div id="login">      
      <section>
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h1 class="title">Vue / Firebase Client DB</h1>
            <p>This app shows how Vue, Router, Vuex and Firebase can all work together to provide a Client database management system.</p>

            <transition name="fade">
                <div v-if="performingRequest" class="message is-info loading">
                <div class="message-body">
                    <p>Loading...</p>
                </div>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="errorMsg !== ''" class="message is-danger">
                <div class="message-body">
                    <p>{{ errorMsg }}</p>
                </div>
                </div>
            </transition>
            
          </div>
        </div>
        <div class="columns">
          <div
            class="column is-half is-offset-one-quarter"
            :class="{ 'signup-form': !showLoginForm && !showForgotPassword }"
          >

            <form v-if="showLoginForm" @submit.prevent>
              <h1 class="title">Sign in</h1>

              <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-right">
                  <input
                    type="email"
                    class="input"
                    placeholder="you@email.com"
                    id="email1"
                    v-model.trim="loginForm.email"
                  />
                  <span class="icon is-small is-right">
                    <i class="fa fa-user"></i>
                  </span>
                </div>
              </div>

              <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-right">
                  <input
                    class="input"
                    v-model.trim="loginForm.password"
                    type="password"
                    placeholder="******"
                    id="password1"
                  />
                  <span class="icon is-small is-right">
                    <i class="fa fa-key"></i>
                  </span>
                </div>
              </div>
              <div class="has-text-centered field">
                <button @click="login" class="button is-outlined is-primary is-fullwidth">Log In</button>
              </div>
              <div class="field buttons has-text-centered">
                <a @click="togglePasswordReset" class="button is-secondary is-half">Forgot Password</a>
                <a @click="toggleForm" class="button is-secondary is-half">Create an Account</a>
              </div>
            </form>

            <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent autocomplete="off">
              <h1 class="title">Get Started</h1>

              <div class="field">
                <label class="label" for="name">Name</label>
                <input
                  class="input"
                  v-model.trim="signupForm.name"
                  type="text"
                  placeholder="Your Name"
                  id="name"
                  autocomplete="off"
                />
              </div>
              <!-- <div class="field">
              <label for="title" class="label" >Title</label>
              <input class="input" v-model.trim="signupForm.title" type="text" placeholder="Company" id="title" />
              </div>-->

              <div class="field">
                <label for="email2" class="label">Email</label>
                <input
                  class="input"
                  autocomplete="off"
                  v-model.trim="signupForm.email"
                  type="text"
                  placeholder="you@email.com"
                  id="email2"
                />
              </div>
              <div class="field">
                <label for="password2" class="label">Password</label>
                <input
                  class="input"
                  autocomplete="off"
                  v-model.trim="signupForm.password"
                  type="password"
                  placeholder="min 6 characters"
                  id="password2"
                />
              </div>
              <div class="field">
                <button @click="signup" class="button is-primary is-fullwidth">Sign Up</button>
              </div>
              <div class="extras">
                <a @click="toggleForm" class="button is-secondary">Back to Log In</a>
              </div>
            </form>

            <form v-if="showForgotPassword" @submit.prevent class="password-reset">
              <div v-if="!passwordResetSuccess">
                <h1 class="title">Reset Password</h1>
                <p>We will send you an email to reset your password</p>
                <br />
                <div class="field">
                  <label for="email3" class="label">Email</label>
                  <input
                    class="input"
                    v-model.trim="passwordForm.email"
                    type="text"
                    placeholder="you@email.com"
                    id="email3"
                  />
                </div>
                <div class="field">
                  <button @click="resetPassword" class="button is-primary is-fullwidth">Submit</button>
                </div>

                <div class="extras">
                  <a @click="togglePasswordReset" class="button is-secondary">Back to Log In</a>
                </div>
              </div>
              <div v-else>
                <h1 class="title success">Email Sent</h1>
                <p>check your email for a link to reset your password</p>
                <button
                  @click="togglePasswordReset"
                  class="button is-primary is-fullwidth"
                >Back to login</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
const fb = require("../firebaseConfig.js");
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",        
        email: "",
        password: ""
      },
      passwordForm: {
        email: ""
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = "";
      this.showLoginForm = !this.showLoginForm;
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true;
        this.showForgotPassword = false;
        this.passwordResetSuccess = false;
      } else {
        this.showLoginForm = false;
        this.showForgotPassword = true;
      }
    },
    login() {
      this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(userCredential => {
          this.$store.commit("setCurrentUser", userCredential.user);
          this.$store.dispatch("fetchUserProfile");
          this.performingRequest = false;
          this.$router.push("/dashboard");
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    signup() {
      this.performingRequest = true;
      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(userCredential => {
          console.log('created user');
          this.$store.commit("setCurrentUser", userCredential.user);
          console.debug(userCredential.user);
          // create user obj
          console.log('adding to collection');
          console.log('users id = ' + userCredential.user.uid);
          fb.usersCollection
            .doc(userCredential.user.uid)
            .set({
              name: this.signupForm.name
            })
            .then(() => {
              this.$store.dispatch("fetchUserProfile");
              this.performingRequest = false;
              this.$router.push("/dashboard");
            })
            .catch(err => {
              console.log(err);
              this.performingRequest = false;
              this.errorMsg = err.message;
            });
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    resetPassword() {
      this.performingRequest = true;
      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false;
          this.passwordResetSuccess = true;
          this.passwordForm.email = "";
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>
