sap.ui.define([
] , function () {
	"use strict";
	return {
		
		 getLevel : function (sValue) {
            this.oGModel = this.getOwnerComponent().getModel("oGModel");
            var level = this.oGModel.getProperty("/auth");
			var sText = "";
            if(level === "I"){
			if (sValue === "I") {
				sText = "Internal";
			} else {
				sText = "External";
			} 
			return sText;
        } else {
            return sText;
        }
		},
        getClass :function(sValue){
            if (sValue === "Error") {
				sText = "red";
			} else if(sValue === "Success") {
				sText = "green";
			} else {
                sText = "black";
            }
			return sText;
        },

		gettimezone:function(sValue,timezone){
            	// this.oGModel = this.getOwnerComponent().getModel("oGModel");
			// that.timezone = this.oGModel.getProperty("/timezone");
            var zone =	new Date().getTimezoneOffset().toString();
                        // that.opr = that.zone.slice(0,1);
                        var opr = new Date().toString().split("GMT")[1].slice(0,1);

                            if(zone.includes("-")){
                                var  zHours = (Math.floor(zone.slice(1)/60))*60*60*1000;
                                var  zMin= (zone.slice(1)%60)*60*1000;
                            } else {
                                var zHours = (Math.floor(zone/60))*60*60*1000;
                                var zMin= (zone%60)*60*1000;
                            }


                        

                        // oData.results.forEach(ele => {
                            var originalDate = sValue;
                            var targetTimeZone = timezone;

                            if(typeof sValue === 'string'){
                                // var t = originalDate.split("T");
                                // originalDate = new Date(t[0] + " " + t[1].split(".")[0]);
                                // originalDate = new Date(originalDate);
                                originalDate = new Date(sValue);
                            }

                            if(opr == "-"){
			
                                originalDate.setTime(originalDate.getTime() + (zHours+zMin));	
                                }
                                else{
                                    originalDate.setTime(originalDate.getTime() - (zHours+zMin));
                                }

                                var opr = (targetTimeZone.split("UTC")[1]).slice(0,1);
                                var hours = ((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[0];
                                var min	=	((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[1];
                                var mHours = hours*60*60*1000;
                                var mMins = min*60*1000;
			
                                if(opr == "-"){
                                    originalDate.setTime(originalDate.getTime() - (mHours+mMins));
                                }
                                else {
                                    originalDate.setTime(originalDate.getTime() + (mHours+mMins));
                                }
                                
                                const convertedDate = originalDate.toLocaleString('en-US', {
                                    dateStyle:"medium",
                                    timeStyle:"medium",
                                    hour12:true
                                });
                                return convertedDate;
                                // ele.NewDate1 = convertedDate;



                        // });






			// var timezone = new Date().getTimezoneOffset();
			// var date = new Date(sValue);

			// var startDate = new Date(date.setTime(date.getTime() - (timezone * 60 * 1000)));
			// return startDate.toLocaleString();

			// const originalDate = new Date("2024-02-28T14:14:00.000Z");
			// const originalDate = sValue;
            // const targetTimeZone = 'Pacific/Midway'; // UTC-11:00
            // const convertedDate = originalDate.toLocaleString('en-US', {

            //     timeZone: targetTimeZone,
            //     year: 'numeric',
            //     month: '2-digit',
            //     day: '2-digit',
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     second: '2-digit',
            //     hour12: true,
            //     });

            //     return convertedDate

		// 	this.oGModel = this.getOwnerComponent().getModel("oGModel");
		// 	that.timezone = this.oGModel.getProperty("/timezone");

		// 	const originalDate = sValue;
        //                     const targetTimeZone = that.timezone;
        //                     const convertedDate = originalDate.toLocaleString('en-US', {

        //                         timeZone: targetTimeZone,
        //                         year: 'numeric',
        //                         month: '2-digit',
        //                         day: '2-digit',
        //                         hour: '2-digit',
        //                         minute: '2-digit',
        //                         second: '2-digit',
        //                         hour12: true,
        //                         });
		// 						return convertedDate

		},

        gettimezone1:function(sValue,timezone){
            if(sValue !== null && sValue !== ""){
			this.timezone = timezone;
        var zone =	new Date().getTimezoneOffset().toString();
                    var opr = new Date().toString().split("GMT")[1].slice(0,1);

                        if(zone.includes("-")){
                            var  zHours = (Math.floor(zone.slice(1)/60))*60*60*1000;
                            var  zMin= (zone.slice(1)%60)*60*1000;
                        } else {
                            var zHours = (Math.floor(zone/60))*60*60*1000;
                            var zMin= (zone%60)*60*1000;
                        }

                        var originalDate = sValue;
                        var targetTimeZone = this.timezone;

                        if(typeof sValue === 'string'){
                            originalDate = new Date(sValue);
                        }

                            var opr = (targetTimeZone.split("UTC")[1]).slice(0,1);
                            var hours = ((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[0];
                            var min	=	((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[1];
                            var mHours = hours*60*60*1000;
                            var mMins = min*60*1000;
        
                            if(opr == "-"){
                                originalDate.setTime(originalDate.getTime() - (mHours+mMins));
                            }
                            else {
                                originalDate.setTime(originalDate.getTime() + (mHours+mMins));
                            }
                            
                            const convertedDate = originalDate.toLocaleString('en-US', {
                                dateStyle:"medium",
                                timeStyle:"medium",
                                hour12:true
                            });
                        return convertedDate;
            } else {
                return sValue;
            }



    }
		
		
	};
});















