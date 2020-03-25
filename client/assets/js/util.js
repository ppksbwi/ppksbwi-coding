const util = {
    companyAsset(highres, page, link) {
        const configuration = this.getConfiguration()

        if (link == "") {
            let path = ""
            if (page == "avatar") {
                path = configuration.server + "/public/img/avatar-default.png"
            } else {
                path = configuration.server + "/public/img/no-image.png"
            }
            return path
        }

        if (page == "") return link

        highres = highres ? "/high-res":""

        return [configuration.server, "public/c", configuration.company, page + highres, link].join("/")
    },

    printHelp(parameter) {
        console.log("-----------------------------")
        console.log(parameter)
        console.log("-----------------------------")
    },

    apiUrl(url, parameter = "", godMode = false, useToken = false, print = true) {
        const configuration = this.getConfiguration()
        let link = "";

        link = [configuration.server, configuration.company, "api", url, "?h=" + configuration.hash].join("/")
        link += parameter == "" ? "":"&" + parameter
        link += godMode ? "GodMode = true":""
        link += useToken ? "useToken = true":""

        if (print)
            this.printHelp(link)
        
        return link
    },

    numberFormat(number, currency = "") {
        let tempString = "";
        if (currency != "")
            tempString = currency + ". "

        return tempString + number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },

    compareDateBetween(startDate, endDate) {
        startDate = this.$moment(startDate)
        endDate = this.$moment(endDate)
        let day1 = startDate.format("DD")
        let month1 = startDate.format("MM")
        let monthName1 = startDate.format("MMMM")
        let year1 = startDate.format("YYYY")
        
        let day2 = endDate.format("DD")
        let month2 = endDate.format("MM")
        let monthName2 = endDate.format("MMMM")
        let year2 = endDate.format("YYYY")
        
        let tempDate = "";
        if (year1 != year2) {
            tempDate = [day1, monthName1, year1, "-", day2, monthName2, year2].join(" ")
        } else if (month1 != month2){
            tempDate = [day1, monthName1, "-", day2, monthName2, year2].join(" ")
        } else if (day1 != day2) {
            tempDate = [day1, "-", day2, monthName2, year2].join(" ")
        } else {
            tempDate = [day1, monthName1, year1].join(" ")            
        }
        return tempDate;
    },
    
    timeBetween(startDate, endDate) {
        startDate = this.$moment(startDate)
        endDate = this.$moment(endDate)
        return startDate.format("HH:mm") + " - " + endDate.format("HH:mm")
    },

    checkPermission(module, privilege) {
        const configuration = this.getConfiguration()

        let moduleIDList = localStorage.getItem('moduleIDList')
        let privilegeIDList = localStorage.getItem('privilegeIDList')
        let result = false
        
        result = moduleIDList.includes(module)

        if (result == false)
            return false

        result = privilegeIDList.includes(privilege)
        
        return result
    },

    loadSpecialAttributes(value) {
        let specialAttributes = JSON.parse(localStorage.getItem('specialAttributes'))
        let tempSpecialAttribute = specialAttributes[value]        
        if (tempSpecialAttribute == undefined || tempSpecialAttribute == "")
            return "0"
        return specialAttributes;
    },

    checkApiResponse(result) {
        let onSuccess = () => {}
        let onError = () => {}
        let successMessage
        let errorMessage
        let onSuccessAlert = true
        let onErrorAlert = true

        if (arguments[1]) {
            if (arguments[1]["onSuccess"] != undefined) onSuccess = arguments[1]["onSuccess"]
            if (arguments[1]["onError"] != undefined) onError = arguments[1]["onError"]
            if (arguments[1]["successMessage"] != undefined) successMessage = arguments[1]["successMessage"]
            if (arguments[1]["errorMessage"] != undefined) errorMessage = arguments[1]["errorMessage"]
            if (arguments[1]["onSuccessAlert"] != undefined) onSuccessAlert = arguments[1]["onSuccessAlert"]
            if (arguments[1]["onErrorAlert"] != undefined) onErrorAlert = arguments[1]["onErrorAlert"]
        }

        if (result.success == 1) {
            if (onSuccessAlert)
                this.$swal({
                    title: successMessage ? successMessage:result.message,
                    icon: "success"
                })
            onSuccess()
        } else if (result.success == 0) {
            if (onErrorAlert)
                this.$swal({
                    title: errorMessage ? errorMessage:result.message,
                    icon: "error"
                })
            onError()
        } if (result.success == -1) {
            this.removeUser()
            this.$router.push('/shiftsoft/login')
        }
    },
}

export default util