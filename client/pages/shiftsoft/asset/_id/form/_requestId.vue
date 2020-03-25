<template>
    <div style="margin: 5vh auto; max-width: 90%; width: 800px">
        <div style="text-align: center">
            <h1>Create Asset Request</h1>
        </div>
        <br>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show" pt-50>
            <b-form-group id="assetName-group" label="Asset Name">
                <b-form-input
                id="assetName"
                v-model="form.assetName"
                readonly
                required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="date-time-group" label="">
                <b-form-group id="start-group" label="Start"><b-row>
                    <b-col><b-form-input
                    id="startDate"
                    v-model="form.startDate"
                    type="date"
                    required
                    @change="handle()"
                    ></b-form-input></b-col>

                    <b-col><b-form-input
                    id="startTime"
                    v-model="form.startTime"
                    type="time"
                    required
                    @change="handle()"
                    ></b-form-input></b-col>
                </b-row></b-form-group>
                <b-form-group id="end-group" label="End"><b-row>
                    <b-col><b-form-input
                    id="endDate"
                    v-model="form.endDate"
                    type="date"
                    required
                    @change="handle()"
                    ></b-form-input></b-col>

                    <b-col><b-form-input
                    id="endTime"
                    v-model="form.endTime"
                    type="time"
                    required
                    @change="handle()"
                    ></b-form-input></b-col>
                </b-row></b-form-group>
                <b-form-text v-if="form.isFilled && !form.isValid">
                    Invalid Time.
                </b-form-text>
            </b-form-group>
            <b-form-group id="description-group" label="Description">
                <b-form-textarea
                id="description"
                v-model="form.description"
                ></b-form-textarea>
            </b-form-group>
            <b-button type="submit" variant="primary" v-bind:disabled="!form.isValid">Submit</b-button>
        </b-form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    layout: 'admin',
    data() {
        return {
            mode: 'create',
            asset: {},
            assetRequest: {},
            form: {
                assetName: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                description: '',
                isFilled: false,
                isValid: false
            },
            show: true
        }
    },
    created() {
        if(this.$route.params.requestId != 0){
            this.mode = 'edit'
        }
        this.getAsset()
    },
    methods: {
        async getAsset(){
            const res = await axios.get(
                this.apiUrl(
                    "asset/list",
                    "&filtersArr[0][]=id|=|"+this.$route.params.id+"|god"
                )
            )
            this.asset = res.data.data[0]
            this.form.assetName = this.asset.Name
            if(this.mode == 'edit'){
                this.getAssetRequest()
            }
        },
        async getAssetRequest(){
            const res = await axios.get(
                this.apiUrl(
                    "assetrequest/list",
                    "&filtersArr[0][]=ID|=|"+this.$route.params.requestId+"|god&inactive=true&filtersArr[0][]=status|<>|-1"
                )
            )
            this.assetRequest = res.data.data[0]
            var startAt_buffer = this.assetRequest.StartAt.split('T')
            this.form.startDate = startAt_buffer[0]
            this.form.startTime = startAt_buffer[1].split('+')[0]
            var endAt_buffer = this.assetRequest.EndAt.split('T')
            this.form.endDate = endAt_buffer[0]
            this.form.endTime = endAt_buffer[1].split('+')[0]
            this.form.description = this.assetRequest.Content
            this.form.isFilled = true
            this.form.isValid = true
        },
        handle(evt){
            //cek tiap kali changing date&time di form apakah ada isinya semua
            if(this.form.startDate.length > 0 && this.form.startTime.length > 0 &&
            this.form.endDate.length > 0 && this.form.endTime.length > 0){
                this.form.isFilled = true
                //cek apakah 'waktu start' sebelum 'waktu end'
                var startDatetime = new Date(this.form.startDate + " " + this.form.startTime)
                var endDatetime = new Date(this.form.endDate + " " + this.form.endTime)
                if(startDatetime < endDatetime){
                    this.form.isValid = true
                }
                else{
                    this.form.isValid = false
                }
            }
            else{
                this.form.isFilled = false
                this.form.isValid = false
            }
        },
        async onSubmit(evt) {
            evt.preventDefault()

            const res = await axios.post(
                this.apiUrl("assetrequest", "&token=mFBMhKjzCBYbQEFXCiz3BJs="),
                {
                    "place": this.asset.Name,
                    "Content": this.form.description,
                    "assetid": this.asset.ID,
                    "userid": this.getConfiguration().user.ID,
                    "StartAt": this.form.startDate+"T"+this.form.startTime,
                    "EndAt": this.form.endDate+"T"+this.form.endTime,
                    "action": this.mode, //'create' atau 'edit'
                    "assetrequestidencrypt": this.assetRequest.IDEncrypt //hanya untuk 'edit'
                }
            )
            this.checkApiResponse(res.data, {
                onSuccess: () => {
                    this.$router.push('/asset/'+this.asset.ID)
                }
            })
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset our form values
            this.form.assetName = this.asset.Name
            this.form.startDate = ''
            this.form.startTime = ''
            this.form.endDate = ''
            this.form.endTime = ''
            this.form.description = ''
            this.form.isFilled = false
            this.form.isValid = false
            if(this.mode == 'edit'){
                this.form.startDate = this.assetRequest.StartAt
                this.form.startTime = this.assetRequest.StartAt
                this.form.endDate = this.assetRequest.EndAt
                this.form.endTime = this.assetRequest.EndAt
                this.form.description = this.assetRequest.Content
                this.form.isFilled = true
                this.form.isValid = true
            }
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
  }
</script>
