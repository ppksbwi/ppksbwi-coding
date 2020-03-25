<template>
  <div>
    <b-container>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show" pt-50>
            <b-form-group id="oldPassword-group" label="Old Password:" label-for="input-1" description="">
                <b-form-input
                id="oldPassword"
                v-model="form.oldPassword"
                type="password"
                required
                autofocus
                placeholder="Enter Old Password"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="newPassword-group" label="New Password:" label-for="input-2">
                <b-form-input
                id="password"
                v-model="form.password"
                type="password"
                required
                placeholder="Enter New Password"
                @keyup="handle()"
                ></b-form-input>

                <b-form-input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                placeholder="Confirm New Password"
                @keyup="handle()"
                ></b-form-input>
                <b-form-text v-if="!form.match && form.password != ''">
                Password did not match.
                </b-form-text>
            </b-form-group>

            <b-button type="submit" variant="primary" v-bind:disabled="!form.match">Change</b-button>
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
                oldPassword: '',
                password: '',
                confirmPassword: '',
                match: false
            },
            show: true
        }
    },
    methods: {
        handle(evt){
            //cek tiap kali typing di form newPassword apakah password ada isinya dan dua-duanya sama
            if(this.form.password.length > 0 && this.form.password == this.form.confirmPassword){
                this.form.match = true
            }
            else{
                this.form.match = false
            }
        },
        async onSubmit(evt) {
            evt.preventDefault()

            const res = await axios.patch(
                this.apiUrl("changepassword/" + this.getConfiguration().user.IDEncrypt),
                {
                    "OldPassword": this.form.oldPassword,
                    "Password": this.form.password
                }
            )
            
            this.checkApiResponse(res.data, {
                onSuccess: () => {
                    this.setUser(res.data.data)
                    this.$router.push('/')
                }
            })
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset our form values
            this.form.oldPassword = ''
            this.form.password = ''
            this.form.confirmPassword = ''
            this.form.match = false
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
  }
</script>