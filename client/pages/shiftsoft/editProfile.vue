<template>
  <div>
    <b-container>
      <b-form @submit="onSubmit" pt-50>
        <b-form-group id="input-group-1" label="Name:" label-for="input-1">
          <b-form-input id="input-1" v-model="form.name" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Birthday:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.birthday"
            type="date"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-7" label="Gender:" label-for="input-7">
          <b-form-radio v-model="form.gender" name="form.gender" value="1"
            >Female</b-form-radio
          >
          <b-form-radio v-model="form.gender" name="form.gender" value="0"
            >Male</b-form-radio
          >
        </b-form-group>

        <b-form-group
          id="input-group-3"
          label="Phone Number:"
          label-for="input-3"
        >
          <b-form-input
            id="input-3"
            v-model="form.phonenumber"
            required
            placeholder="Your Phone Number"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4" label="Address:" label-for="input-4">
          <b-form-input
            id="input-4"
            v-model="form.address"
            required
            placeholder="Your Address"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-5" label="City:" label-for="input-5">
          <b-form-input
            id="input-5"
            v-model="form.city"
            required
            placeholder="Your City"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-6" label="Email:" label-for="input-6">
          <b-form-input
            id="input-6"
            v-model="form.email"
            type="email"
            required
            placeholder="Your Email"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  layout: "admin",
  data() {
    return {
      user: {},
      form: {
        name: this.getConfiguration().user.Name ,
        birthday: this.$moment(this.getConfiguration().user.Birthday).format('YYYY-MM-DD'),
        gender: this.getConfiguration().user.Gender,
        address: this.getConfiguration().user.Address,
        phonenumber: this.getConfiguration().user.Phone1,
        city: this.getConfiguration().user.City,
        email: this.getConfiguration().user.Email
      }
    };
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault()
      const res = await axios.patch(
        this.apiUrl("user"+"/"+this.getConfiguration().user.ID, 'GodMode=true'),
        {
            "Email" : this.form.email,
            "Name" : this.form.name ,
            "Nickname" : this.getConfiguration().user.Nickname,
            "Birthday" : this.form.birthday,
            "Address": this.form.address,
            "City" : this.form.city,
            "Phone1": this.form.phonenumber,
            "Gender": this.form.gender.toString()
        }
      )

      this.checkApiResponse(res.data, {
        onSuccess: () => {
          this.setUser(res.data.data)
          this.$router.push('/')
        },
      })
    }
  }
};
</script>
