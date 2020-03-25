import Vue from 'vue'
import moment from 'moment';
import util from '~/assets/js/util'
import configuration from '~/assets/js/configuration'
Vue.mixin({
    created: function () {        
        // if (this.$route)
        //     configuration.company = this.$route.params.company
            
        if (configuration.resetOnStart)
            localStorage.clear();

        let user = localStorage.getItem('user')
        if (user != null) {
            configuration.user = JSON.parse(localStorage.getItem('user'))
            configuration.isLogin = true
        }
    },
	methods: {
        getConfiguration() {
            return configuration
        },
        setUser(user) {
            configuration.user = JSON.stringify(user)
            localStorage.setItem('user', configuration.user);
            configuration.isLogin = true
        },
        removeUser() {
            localStorage.removeItem("user");
            configuration.isLogin = false
        },
        moment: moment,
        companyAsset: util.companyAsset,
        printHelp: util.printHelp,
        apiUrl: util.apiUrl,
        compareDateBetween: util.compareDateBetween,
        timeBetween: util.timeBetween,
        numberFormat: util.numberFormat,
        checkPermission: util.checkPermission,
        loadSpecialAttributes: util.loadSpecialAttributes,

        checkApiResponse: util.checkApiResponse
    },
})