<template>
  <div>
    <br>
    <b-container>
        <Notification :message="error" v-if="error" :class="alert"/>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show" pt-50>
        <b-form-group
            id="input-group-1"
            label="E-mail Address:"
        >
            <b-input-group>
                <b-input-group-prepend>
                    <span class="input-group-text"><font-awesome-icon :icon="['fas', 'envelope']"/></span>
                </b-input-group-prepend>
                <b-form-input
                id="input-1"
                type="email"
                v-model="form.email"
                required
                placeholder="Enter Email"
                >
                </b-form-input>
            </b-input-group>
        </b-form-group>
        <b-button type="submit" pill block variant="primary">Continue</b-button>
        </b-form>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';
import Notification from '~/components/Notification'
export default {
    components: {
        Notification,
    },
    data() {
        return {
            user: {},
            form: {
                email: '',
            },
            error: null,
            alert: "notification is-success",
            show: true
        }
    },
    methods: {
        async onSubmit(evt) {
            evt.preventDefault()

            const res = await axios.post(
                this.apiUrl("forgetpassword"),
                {
                    "Email": this.form.email,
                }
            )
            if (res.data.success == 0) {
                this.alert = "notification is-danger"
                this.error = res.data.message
            } else {
                this.alert = "notification is-success"
                this.error = res.data.message
            }
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset our form values
            this.form.email = ''
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