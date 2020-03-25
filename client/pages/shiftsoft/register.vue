<template>
  <div>
    <b-container>
        <h2> SIGN UP </h2>
        <b-form @submit="onRegister" @reset="onReset" v-if="show" pt-50>
        <b-form-group
            id="input-group-1"
            label-for="input-1"
        >
            <b-form-input
            id="input-1"
            v-model="form.username"
            required
            placeholder="Enter Your Name"
            ></b-form-input>
            <br>
            <b-form-input
            id="input-4"
            v-model="form.email"
            required
            placeholder="Enter Your Email"
            ></b-form-input>

        </b-form-group>

        <b-form-group id="input-group-2"  label-for="input-2">
            <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter Your Password"
            ></b-form-input>
            <br>
            <b-form-input
            id="input-3"
            v-model="form.repassword"
            type="password"
            required
            placeholder="Confirm Password"
            ></b-form-input>
            <br>
            <b-form-input
            id="input-5"
            v-model="form.phone"
            required
            placeholder="Enter Phone Number"
            ></b-form-input>
        </b-form-group>

        <b-form-group
            id="input-group-3"
            label-for="input-3"
        >
            
        <b-button size="lg" type="submit" block variant="warning">Create New Account</b-button>

        </b-form-group>
        
        </b-form>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            user: {},
            form: {
                Email: '',
                Name: '',
                Password: '',
                Phone1: '',
            },
            show: true
        }
    },
    methods: {
         async onRegister(evt) {
            evt.preventDefault()
            if (this.form.password != this.form.repassword)
            {
                this.form.password = ''
                this.form.repassword = ''
            }
            else
            {
                const res = await axios.post(
                this.apiUrl("user"),
                {
                    "Email": this.form.email,
                    "Name": this.form.username,
                    "Password": this.form.password,
                    "Phone1": this.form.phone
                }
            )
            if (res.data.success == 0) {
                alert(res.data.message)
            } else {
                //this.setUser(res.data.data)
                this.$router.push('/login')
            }
            }            

            
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset our form values
            this.form.username = ''
            this.form.name = ''
            this.form.food = null
            this.form.checked = []
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
  }
</script>