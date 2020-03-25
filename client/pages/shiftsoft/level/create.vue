<template>
    <div style="margin: 5vh auto; max-width: 90%; width: 800px">
        <div style="text-align: center">
            <h1>Create Level</h1>
        </div>
        <br>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show" pt-50>
            <b-form-group id="name-group" label="Journey Name">
                <b-form-input
                id="name"
                v-model="form.name"
                autofocus
                required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="startAt-group" label="Start">
                <b-form-input
                    id="startAt"
                    v-model="form.startAt"
                    type="date"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="description-group" label="Description">
                <b-form-textarea
                id="description"
                v-model="form.description"
                ></b-form-textarea>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    layout: 'admin',
    data() {
        return {
            form: {
                name: '',
                startAt: '',
                description: '',
            },
            show: true
        }
    },
    methods: {
        async onSubmit(evt) {
            evt.preventDefault()

            const res = await axios.post(
                this.apiUrl("levelhistories", "GodMode=true"),
                {
                    "UserID": this.getConfiguration().user.ID.toString(),
                    "Name": this.form.name,
                    "StartAt": this.form.startAt,
                    "Description": this.form.description
                }
            )
            this.checkApiResponse(res.data, {
                onSuccess: () => {
                    this.$router.push('/level')
                }
            })
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset our form values
            this.form.name = ''
            this.form.startAt = ''
            this.form.description = ''
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
  }
</script>
