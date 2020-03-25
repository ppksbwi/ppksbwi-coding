<template>
  <div>
    <b-container>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show" pt-50>
            <b-form-group
                id="input-group-1"
                label="Username:"
                label-for="input-1"
                description="We'll never share your username with anyone else."
            >
                <b-form-input
                id="input-1"
                v-model="form.username"
                required
                placeholder="Enter Username"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Password:" label-for="input-2">
                <b-form-input
                id="input-2"
                v-model="form.password"
                type="password"
                required
                placeholder="Enter Password"
                ></b-form-input>
            </b-form-group>

            <b-button size="lg" type="submit" block variant="warning">LOGIN</b-button>
            <br />
            <b-button size="lg" @click="goToRegister()" block variant="warning">SIGN UP</b-button>
            <br />
            <b-button size="lg" @click="goToForgetPassword()" block variant="info">Forget Password</b-button>
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
                username: '',
                password: '',
            },
            show: true
        }
    },
    methods: {
         async onSubmit(evt) {
            evt.preventDefault()

            const res = await axios.post(
                this.apiUrl("login", "with[0]=Role.Privileges&with[1]=Company.Package.Modules"),
                {
                    "username": this.form.username,
                    "password": this.form.password
                }
            )

            this.checkApiResponse(res.data, {
                onSuccessAlert: false,
                onSuccess: () => {
                    this.setUser(res.data.data)

                    let tempIDList = []
                    let tempList = []
                    res.data.data.Company.Package.Modules.map((item) => {
                        tempIDList.push(item["ID"])
                        tempList.push(item)
                    })
                    localStorage.setItem('moduleIDList', tempIDList);
                    localStorage.setItem('moduleList', JSON.stringify(tempList));

                    tempIDList = []
                    tempList = []
                    res.data.data.Role.Privileges.map((item) => {
                        tempIDList.push(item["ID"])
                        tempList.push(item)
                    })
                    localStorage.setItem('privilegeIDList', tempIDList);
                    localStorage.setItem('privilegeList', JSON.stringify(tempList));

                    let tempSpecialAttributes = res.data.data.Company["SpecialAttrs"]
                    localStorage.setItem('specialAttributes', JSON.stringify(tempSpecialAttributes));

                    this.$router.push('/')
                }
            })
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
        },
        goToRegister() {
            this.$router.push('/register')
        },
        goToForgetPassword() {
            this.$router.push('/forgetPassword')
        }
    }
  }
</script>