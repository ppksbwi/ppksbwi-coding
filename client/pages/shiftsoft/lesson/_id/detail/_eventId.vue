<template>
  <div style="margin: 5vh auto; max-width: 90%; width: 800px; text-align: center">
    <b-img
      :src="companyAsset(false, 'event', item.Pic)"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 20rem;"
      class="mb-2"
    ></b-img>
    <br>
    <h1>{{item.Name}}</h1>
    <br>
    <div style="text-align: left">
      Date : {{ compareDateBetween(item.StartAt, item.EndAt) }} <br />
      Time : {{ timeBetween(item.StartAt, item.EndAt) }} <br />
      Place : {{ item.Place }} <br />
      Description : {{ item.Content }} <br />
      <br />
      Attendance :
      <span v-if="item.AttendeeCount > 0">{{ item.AttendeeCount }} <b-button pill variant="outline-secondary" @click="eventAttendee()">Show</b-button></span>
      <span v-else>0</span>
      <br />
      Services :
      <span v-if="item.Services">{{ item.Services }}</span>
      <span v-else>0</span>
      <b-modal id="attendance" title="Attendance List">
        <li v-for="att in attendanceList" :key="att.ID">{{ att.User.Name }}</li>
      </b-modal>
      <b-modal id="attending" title="Confirm Attendance">
        <p> You're going to attend this event! </p>
        <p class="my-4"><b>  {{ this.getConfiguration().user.Name }} - (RSVP : Yes) </b> </p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  layout: "admin",
  components: {
  },
  data() {
    return {
      item: {},
      attendanceList: []
    };
  },
  async created() {
    const res = await axios.get(
      this.apiUrl(
        "event/" + this.$route.params.eventId + "/id-encrypt"
      )
    )
    this.item = res.data.data;
    const resp = await axios.get(
      this.apiUrl(
        "attendance/list",
        "with[0]=User&filters[]=event_id|=|" + this.item.ID + "|and|god"
      )
    );
    this.attendanceList = resp.data.data;
    var x;
    for (x in this.attendanceList) {
      if (this.getConfiguration().user.ID == x.UserID) {
        alert("You're going to attend this Event");
      }
    }
  },
  methods: {
    async eventAttendee() {
      this.$bvModal.show("attendance")
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
