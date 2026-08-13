sap.ui.define([
    "vcpapp/vcpjobschedulersequence/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "vcpapp/vcpjobschedulersequence/model/formatter",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/library",
    "sap/ui/model/Sorter",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel,formatter, MessageToast, Filter, FilterOperator, library, Sorter, Dialog, Text, 
                Button, MessageBox) {
        "use strict";
        var that, oGModel;
        var aResults;


        return BaseController.extend("vcpapp.vcpjobschedulersequence.controller.Home", {
            formatter: formatter,
            onInit: function () {
                that = this;

                // Declaring JSON Model and size limit
                that.oModel = new JSONModel();
                that.oModelInactive = new JSONModel();

                that.oGModel = that.getOwnerComponent().getModel("oGModel");

                that.oModel.setSizeLimit(5000);
                that.oModelInactive.setSizeLimit(1000);

                that.oGModel.setProperty("/auth", "");
                that.getEnableuser();
                that.skip = 0;
                that.oLocData = [];
                that.ConfProdall =[];
                that.oGModel.setProperty("/homeAllLocationData", that.oLocData);
                that.oGModel.setProperty("/homeAllLocationProductData", that.ConfProdall);
                that.array=[];
                // that.myP3 = new Promise((resolve, reject) => {});
                that.array.push(that.myP3);
                that.myP1 = new Promise((resolve, reject) => {
                    that.userPreference(resolve, reject);
                });
                // that.array.push(that.myP1);
                
                that.myP1.then((value) => {
                that.myP2 = new Promise((resolve, reject) => {
                    that.getAllLocaions(resolve, reject);
                });
                // that.array.push(that.myP2);
                that.myP3 = new Promise((resolve, reject) => {
                    that.getAProducts(resolve, reject);
                });
                // that.array.push(that.myP3);
                // that.myP3.then((value) => {
                //     that.onAfterRendering();

                // });
            });
                // Promise.all([myP1, myP2, myP3]).then((x) => {
                //     // myDisplay(x);
                //   });

               


        },

        userPreference:function(resolve, reject){
             sap.ui.core.BusyIndicator.show();
            that.getOwnerComponent().getModel("BModel").read("/getUserPreferences", {    
                filters: [
                    // new Filter( "PARAMETER", FilterOperator.EQ, "TIMEZONE")
                ],                    
                success: function (oData) {
                    // that.timezone = oData.results[0].PARAMETER_VALUE;

                    var dataF = oData.results.filter(el=> el.PARAMETER === "TIMEZONE");
                    var MAX_RECORDS = oData.results.filter(el=> el.PARAMETER === "MAX_RECORDS");
                            that.oGModel.setProperty("/MaxCount", MAX_RECORDS[0].PARAMETER_VALUE);
                    if(dataF[0].PARAMETER_VALUE.includes("(")){
                        var length = dataF[0].PARAMETER_VALUE.length - 1;
                        that.timezone = dataF[0].PARAMETER_VALUE.slice(1,  length);
                    } else {
                        that.timezone = dataF[0].PARAMETER_VALUE;
                    }
                    
                    that.oGModel.setProperty("/timezone", that.timezone);
                    // that.getAllLocaions();
                    // that.getAProducts();
                    resolve(true);
                    
                },
                error: function (oData, error) {
                   console.log(error)
                },
            });


        },

        getAllLocaions: function (resolve, reject) {
            // Calling service to get the Factory location, Demand loaction, config and partial products data
            sap.ui.core.BusyIndicator.show();
            var topCount = that.oGModel.getProperty("/MaxCount");
            // this.getOwnerComponent().getModel("BModel").read("/getfactorylocdesc", {
            //     urlParameters: {
            //         "$skip": that.skip,
            //         "$top": topCount
            //     },
            //     success: function (oData) {
            //         sap.ui.core.BusyIndicator.hide();
            //         // that.TotalDataUni = oData.results;

            //         // function removeDuplicate(array, key) {
            //         //     var check = new Set();
            //         //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //         // }

            //         // that.MFLocDataUni = removeDuplicate(oData.results, 'FACTORY_LOC');

            //         if (topCount == oData.results.length) {
            //             that.skip += parseInt(topCount);
            //             that.oLocData = that.oLocData.concat(oData.results);
            //             that.getAllLocaions();
            //         } else {
            //             that.skip = 0;
            //             that.oLocData = that.oLocData.concat(oData.results);

            //             // that.TotalDataUni = that.oLocData;

            //             // function removeDuplicate(array, key) {
            //             //     var check = new Set();
            //             //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //             // }

            //             // that.MFLocDataUni = removeDuplicate(that.oLocData, 'FACTORY_LOC');

            //             that.oGModel.setProperty("/homeAllLocationData", that.oLocData);
            //             resolve(true);

            //         }
                    

            //     },
            //     error: function (oData, error) {
            //         sap.ui.core.BusyIndicator.hide();
            //         MessageToast.show("Failed to get data");
            //     },
            // });
            this.getOwnerComponent().getModel("BModel").callFunction("/getfactorylocdescNew", {
                method: "GET",
                 headers: {
                 "x-user-id": that.getUser(),
                 },
                success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();

                    that.oLocData = JSON.parse(oData.getfactorylocdescNew)

                        that.oGModel.setProperty("/homeAllLocationData", that.oLocData);
                        //check if user has access atleast one create access
                        that.byId("idcreate").setVisible(false);
                        if(that.oLocData && that.oLocData.length >0){
                            if(that.oLocData.findIndex(f=>f.CREATE == 1) != -1){//Show create job
                                 that.byId("idcreate").setVisible(true);
                            }
                        }
                        resolve(true);
                    
                },
                error: function (oData, error) {
                    MessageToast.show("error");
                }
            });
        },

        getAProducts:function(resolve, reject){
            
                sap.ui.core.BusyIndicator.show();
                // Calling service to get the product data
                var topCount = that.oGModel.getProperty("/MaxCount");
                // that.getOwnerComponent().getModel("BModel").read("/genPartialProd", {
                //     urlParameters: {
                //         "$skip": that.skip,
                //         "$top": topCount
                //     },
                //     success: function (oData) {
                //         sap.ui.core.BusyIndicator.hide();
                       
                //         if (topCount == oData.results.length) {
                //             that.skip += parseIn(topCount);
                //             that.ConfProdall = that.ConfProdall.concat(oData.results);
                            
                //             that.getAProducts();
                //         } else {
                //             that.skip = 0;
                //             that.ConfProdall = that.ConfProdall.concat(oData.results);
                //             // // oData.results = that.item
                //             // // that.filterCheck(that.item);
                //             // // that.arrayData = that.item;
                //             // that.uniqConfprod= that.ConfProdall.filter(el=> el.CONFIGPROD_CHK === "X");
                           
                //             // // function removeDuplicate(array, key) {
                //             // //     var check = new Set();
                //             // //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                //             // // }
                //             // // oData.results = removeDuplicate(oData.results, 'REF_PRODID');

                //             // // that._valueHelpDialogConfProd.setData(oData);
                //             // // that.oConfProdList.setModel(that.ConfprodModel);

                //             that.oGModel.setProperty("/homeAllLocationProductData", that.ConfProdall);

                            

                //             sap.ui.core.BusyIndicator.hide();
                //             resolve(true);
                //         }
                //     },
                //     error: function (oData, error) {
                //         sap.ui.core.BusyIndicator.hide();
                //         // MessageToast.show("error");
                //     },
                // });
            
                this.getOwnerComponent().getModel("BModel").callFunction("/genPartialProdNew", {
                    method: "GET",
                    
                    success: function (oData) {
                                sap.ui.core.BusyIndicator.hide();

    
                        that.ConfProdall = JSON.parse(oData.genPartialProdNew)
    
                            that.oGModel.setProperty("/homeAllLocationProductData", that.oLocData);
                            resolve(true);
                        
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    }
                });
        },
        
        getEnableuser: function () {
                var oModel = this.getOwnerComponent().getModel("BModel");
                var vUser = this.getUser();
                var oEntry = {
                    USERDATA: []
                };
                let oParamVals = {
                    USEREMAIL: vUser
                };
                oEntry.USERDATA.push(oParamVals);
                oModel.callFunction("/genUserAppVisibility", {
                    method: "GET",
                    urlParameters: {
                        FLAG: 'G',
                        USERDATA: JSON.stringify(oEntry.USERDATA)
                    },
                    success: function (oData) {
                        aResults = oData.results;
                      
                        if (aResults.length > 0) {
                            var isUserLoggedIn = true;
                        }
                        
                        if(isUserLoggedIn){

                            that.oGModel.setProperty("/auth", aResults[0].LEVEL);
                            // if (aResults[0].CREATE_CHK === "disabled") {
                            //     that.byId("idcreate").setEnabled(false);
                            //     that.byId("idMvariant").setEnabled(false);
    
                            // }
                            // if (aResults[0].UPDATE_CHK === "disabled") {
                            //     that.byId("idEdit").setEnabled(false);
                            //     that.byId("idActive").setEnabled(false);
                            //     that.byId("idRestart").setEnabled(false);
                            //     that.byId("idEdit1").setEnabled(false);
                            //     that.byId("idInActive").setEnabled(false);
                            // }
                            // if (aResults[0].DELETE_CHK === "disabled") {
                            //     that.byId("iddelete").setEnabled(false);
                            //     that.byId("idIdelete").setEnabled(false);
                            // }
                        }
                        else{
                            that.byId("idcreate").setEnabled(false);
                            that.byId("idMvariant").setEnabled(false);
                            that.byId("idEdit").setEnabled(false);
                            that.byId("idActive").setEnabled(false);
                            that.byId("idRestart").setEnabled(false);
                            that.byId("idEdit1").setEnabled(false);
                            that.byId("idInActive").setEnabled(false);
                            that.byId("iddelete").setEnabled(false);
                            that.byId("idIdelete").setEnabled(false);
                        }
                      

                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    }
                });
            },
            // onAfterRendering: async function () {
            onAfterRendering: function () {
                var RefInterval = 1000;
                var flag = "";
                // Promise.all([that.myP1, that.myP2, that.myP3]).then((x) => {
                //   await  Promise.all(that.array);
                var Interval = setInterval(async () => {
                //   var interval =   setInterval(() => {
                    if (that.myP3) {
                    await that.myP3.then((value) => {
                        clearInterval(Interval);
                        Interval = null;
                    that.TempParams = [];
                that.byId("jobList").removeSelections(true);

                        if(flag === ""){
                flag = "X";  

                // // Function to find time zone names for a given UTC offset
                // function getTimeZonesByUTCOffset(offset) {
                //     // Get all available time zones from moment-timezone
                //     const allTimeZones = moment.tz.names();
                
                //     // Filter time zones that match the given offset
                //     return allTimeZones.filter(timeZone => {
                //         // Get the current UTC offset for this time zone (in minutes)
                //         let zoneOffset = moment.tz(timeZone).utcOffset() / 60;
                //         return zoneOffset === parseFloat(offset);
                //     });
                    
                // }
                
                // // Example usage: List of UTC offsets you want to check
                // const utcOffsets = ["-04:00"];
                // that.zonedata = [];
                
                // // Iterate over each UTC offset and find matching time zone names
                // utcOffsets.forEach(offset => {
                //     var timeZones = getTimeZonesByUTCOffset(offset);
                //     console.log(`Time zones for UTC${offset}:`, timeZones);
                //             timeZones.forEach(e => {
                //             var now = moment.tz(e);
                //             var isDST = now.isDST(); // Check if the time zone is currently observing DST
                //             var offsetMinutes = now.utcOffset(); // Get the current offset in minutes
                //             var obj = {
                //                 zone : e,
                //                 isDST : isDST,
                //                 offsetMinutes: offsetMinutes
                //             }
                //             that.zonedata.push(obj);
                            
                //         });
                // });



                // console.log(that.zonedata);

                // // const moment = require('moment-timezone');
 
                // // Function to find time zones by UTC offset (in hours)
                // function getTimeZonesByOffset(offsetHours) {
                //     // Get all available time zones
                //     const allTimeZones = moment.tz.names();
                 
                //     // Filter time zones matching the given UTC offset
                //     const matchingZones = allTimeZones.filter(timeZone => {
                //         // Get the current offset in hours
                //         const offsetMinutes = moment.tz(timeZone).utcOffset();
                //         const zoneOffsetHours = offsetMinutes / 60;
                 
                //         return zoneOffsetHours === parseFloat(offsetHours);
                //     });
                 
                //     return matchingZones;
                // }
                 
                // // Example usage:
                // // Find time zones for UTC+5:30
                // const timeZones = getTimeZonesByOffset(-4); // Asia/Kolkata has UTC+5:30
                 
                // console.log(timeZones); // Output: ["Asia/Kolkata", "Asia/Colombo"]

                // that.getOwnerComponent().getModel("BModel").read("/getUserPreferences", {
                //     filters: [
                //         new Filter("PARAMETER", FilterOperator.EQ, "MAX_RECORDS")
                //     ],
                //     success: function (oData) {
                //         that.oGModel.setProperty("/MaxCount", oData.results[0].PARAMETER_VALUE);
    
                //         // Class IBP Characteristics
                //         that.loadDataforClas();
    
    
                //     },
                //     error: function (oData, error) {
                //         console.log(error)
                //     },
                // });

               
                // Call function to get the jobs and variant jobs
                that.getModel("JSModel").callFunction("/readJobLogs", {
                    headers: {
                 "x-user-id": that.getUser(),
                 },
                    // filters: [
                    //     new Filter("TEMPLATE_ID", FilterOperator.EQ, TempId),
                    // ],
                    // urlParameters: {
                    //     "$orderby": "JOB_STARTTIME desc" 
                    //   },
                    success: function (oData) {
                        // sap.ui.core.BusyIndicator.hide();

                       
                    

                        if(that.timezone === "" ||  that.timezone === undefined || that.timezone === null){
                            that.timezone = "UTC+00:00"
                        }

                        that.oGModel.setProperty("/timezone", that.timezone);

                        that.zone =	new Date().getTimezoneOffset().toString();
                        // that.opr = that.zone.slice(0,1);
                        that.opr = new Date().toString().split("GMT")[1].slice(0,1);

                            if(that.zone.includes("-")){
                                that.zHours = (Math.floor(that.zone.slice(1)/60))*60*60*1000;
                                that.zMin= (that.zone.slice(1)%60)*60*1000;
                            } else {
                                that.zHours = (Math.floor(that.zone/60))*60*60*1000;
                                that.zMin= (that.zone%60)*60*1000;
                            }


                        var readJobdata = JSON.parse(oData.readJobLogs);

                        readJobdata.forEach(ele => {
                            if(ele.JOB_STARTTIME !== null){
                            const originalDate = new Date(ele.JOB_STARTTIME);
                            const originalDate1 = new Date(ele.JOB_ENDTIME);
                            const targetTimeZone = that.timezone;

                            if(!ele.JOB_STARTTIME.includes("T")){
                                if(that.opr == "-"){                
                                    originalDate.setTime(originalDate.getTime() + (that.zHours+that.zMin));	
                                    originalDate1.setTime(originalDate1.getTime() + (that.zHours+that.zMin));	
                                } else{
                                    originalDate.setTime(originalDate.getTime() - (that.zHours+that.zMin));
                                    originalDate1.setTime(originalDate1.getTime() - (that.zHours+that.zMin));
                                }
                            }

                                var opr = (targetTimeZone.split("UTC")[1]).slice(0,1);
                                var hours = ((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[0];
                                var min	=	((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[1];
                                var mHours = hours*60*60*1000;
                                var mMins = min*60*1000;
			
                                if(opr == "-"){
                                    originalDate.setTime(originalDate.getTime() - (mHours+mMins));
                                    originalDate1.setTime(originalDate1.getTime() - (mHours+mMins));
                                }
                                else {
                                    originalDate.setTime(originalDate.getTime() + (mHours+mMins));
                                    originalDate1.setTime(originalDate1.getTime() + (mHours+mMins));
                                }
                                
                                const convertedDate = originalDate.toLocaleString('en-US', {
                                    dateStyle:"medium",
                                    timeStyle:"medium",
                                    hour12:true
                                });
                                const convertedDate1 = originalDate1.toLocaleString('en-US', {
                                    dateStyle:"medium",
                                    timeStyle:"medium",
                                    hour12:true
                                });
                                // return convertedDate
                                ele.NewDate1 = convertedDate;
                                ele.NewDate2 = convertedDate1;

                                if(new Date(convertedDate1) > new Date() && ele.UPDATE == true){
                                        ele.restart = true;
                                } else {
                                    ele.restart = false;
                                }
                            }

                                if(parseInt(ele.JOB_ID) === 9999){
                                    ele.editJob = false;
                                } else {
                                    ele.editJob = ele.UPDATE;
                                }
                                //Delete access
                                ele.deleteJob = ele.DELETE;

                                if(ele.JOB_STATUS === "Pending"){
                                    ele.JOB_STATUS = "Active";
                                }


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

                            //     // return convertedDate
                            //     ele.NewDate1 = convertedDate;

                        });

                        that.joblogData = readJobdata;
                        that.JobDetail = readJobdata;
                        if(that.oGModel.getProperty("/auth") === "I"){
                            that.byId("LayerGroupJS").setVisible(true);
                            var ActiveJobs = that.JobDetail.filter(function (aComp) {
                                return aComp.ACTIVE === true || aComp.ACTIVE === 1;
                            });
                            var InActiveJobs = that.JobDetail.filter(function (aComp) {
                                return aComp.ACTIVE === false || aComp.ACTIVE === 0;
                            });
                        } else {
                            that.byId("LayerGroupJS").setVisible(false);
                            var ActiveJobs = that.JobDetail.filter(function (aComp) {
                                return aComp.ACTIVE === true || aComp.ACTIVE === 1 && aComp.LEVEL === "E";
                            });
                            var InActiveJobs = that.JobDetail.filter(function (aComp) {
                                return aComp.ACTIVE === false || aComp.ACTIVE === 0 && aComp.LEVEL === "E";
                            });
                        }

                        

                        

                        that.oModel.setData({
                            Jobresults: ActiveJobs,
                            // Jobresults: oData.results,
                        });
                        that.byId("jobList").setModel(that.oModel);

                        that.oModelInactive.setData({
                            JobresultsI: InActiveJobs,
                            // JobresultsI: oData.results,
                        });
                        that.byId("jobListI").setModel(that.oModelInactive);

                        that.byId("headSearch").setValue();
                        that.byId("jobList").getBinding("items").filter(that.TempParams);
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });
            }
                  });
                }

                },RefInterval);
                

            },

            // onRefresh: function () {
            //     that.onAfterRendering();
    
            //     // Hide the pull-to-refresh indicator after data refresh is done
            //     var oPullToRefresh = that.byId("pullToRefresh");
            //     oPullToRefresh.hide();
            // },

            onLayerCode:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                that.byId("headSearch").setValue();
                var selKey = that.byId("idLayerJS").getSelectedKey();
                var tempdata = that.joblogData;
                if(selKey === "A"){

                  var ActiveJobs = tempdata.filter(function (aComp) {
                    return aComp.ACTIVE === true;
                });
                  var InActiveJobs = tempdata.filter(function (aComp) {
                        return aComp.ACTIVE === false;
                    });

                } else if(selKey === "I"){

                  var ActiveJobs = tempdata.filter(function (aComp) {
                    return aComp.LEVEL === "I" && aComp.ACTIVE === true;
                });
                  var InActiveJobs = tempdata.filter(function (aComp) {
                        return aComp.LEVEL === "I" && aComp.ACTIVE === false;
                    });


                } else if(selKey === "E"){
                    var ActiveJobs = tempdata.filter(function (aComp) {
                        return aComp.LEVEL === "E" && aComp.ACTIVE === true;
                    });
                      var InActiveJobs = tempdata.filter(function (aComp) {
                            return aComp.LEVEL === "E" && aComp.ACTIVE === false;
                        });

                }
                that.oModel.setData({
                    Jobresults: ActiveJobs,
                    // Jobresults: oData.results,
                });
                that.byId("jobList").setModel(that.oModel);

                that.oModelInactive.setData({
                    JobresultsI: InActiveJobs,
                    // JobresultsI: oData.results,
                });
                that.byId("jobListI").setModel(that.oModelInactive);
                sap.ui.core.BusyIndicator.hide();
              },

            onRefresh: function () {
                that.onAfterRendering();
            },

            handleLinkPress: function (oEvent) {
                var clickTemp = oEvent.getSource().getText();
            },

            onhandlePress: function (oEvent) {
                var object = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject();
                var jobid = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().JOB_ID;
                var jobName = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().JOB_NAME;
                var template = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().TEMPLATE_ID;
                var Jobfeed = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().VARIANT_FLAG;
                that.oGModel.setProperty("/jobid", jobid);
                that.oGModel.setProperty("/jobname", jobName);
                that.oGModel.setProperty("/tempId", template);
                that.oGModel.setProperty("/Jobfeed", Jobfeed);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.navTo("JobLogs", {}, true);
            },

            onCreateJob: function () {
                that.oGModel.setProperty("/EditFlag", "");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.navTo("CreateJob", {}, true);
            },

            onMaintainVariant:function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.navTo("Details", {}, true);
            },

            /*Open sort Dialog*/
            handleSortButtonPressed: function () {
                that = this;
                if (!that._pDialog) {
                    that._pDialog = sap.ui.xmlfragment("vcpapp.vcpjobschedulersequence.view.SortDialog", that);
                    that.getView().addDependent(that._pDialog);
                }
                that._pDialog.open();
            },

            /*Sorting Operation*/
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.byId("jobList"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },

            handleSearch: function (oEvent) {

                var sQuery = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";

                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("JOB_STATUS", FilterOperator.Contains, sQuery),
                                new Filter("JOB_NAME", FilterOperator.Contains, sQuery),
                                new Filter("TEMPLATE_ID", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }

                if (that.byId("operationsITB").getSelectedKey() === "Active Jobs") {
                    that.byId("jobList").getBinding("items").filter(oFilters);
                } else {
                    that.byId("jobListI").getBinding("items").filter(oFilters);
                }

            },

            onTabChange: function () {
                that.TempParams = [];
                that.byId("jobList").removeSelections(true);
                that.byId("jobListI").removeSelections(true);
                that.byId("headSearch").setValue();
                that.byId("jobList").getBinding("items").filter(that.TempParams);
                that.byId("jobListI").getBinding("items").filter(that.TempParams);

            },

            onEdit: function (oEvent) {
                var selectedJob = oEvent.getSource().getParent().getBindingContext().getObject();

                that.oGModel.setProperty("/EditFlag", "X");
                that.oGModel.setProperty("/editData", selectedJob);
                if(selectedJob.MAIN_SET !== null && selectedJob.SET !== null){
                    that.oGModel.setProperty("/CommonFilter", "X");
                } else {
                    that.oGModel.setProperty("/CommonFilter", "");
                }

                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.navTo("CreateJob", {}, true);
            },

            onRecur: function (oEvent) {
                var jobid = oEvent.getSource().getParent().getBindingContext().getObject().JOB_ID;
                that.Event = oEvent;
                // that.getModel("JSModel").read("/readJobDetailsLogs", {
                //     filters: [
                //         new Filter("JOB_ID", FilterOperator.EQ, jobid),
                //     ],
                //     success: function (oData) {
                //         var jobData = oData.results.filter(function (aComp) {
                //             return aComp.STEP === 1;
                //         });
                //         that.SUBJOB_ID = jobData[0].SUBJOB_ID;
                //         if(that.SUBJOB_ID !== "" || that.SUBJOB_ID !== undefined){
                //                     // Calling service to get the Job details
                //             that.getModel("JModel").callFunction("/readJobDetails", {
                //                 method: "GET",
                //                 urlParameters: {
                //                     jobId: that.SUBJOB_ID,
                //                     displaySchedules: true,
                //                 },
                //                 success: function (oData) {

                //                     var oData = oData.readJobDetails.schedules[0];

                //                     that.timezone = that.oGModel.getProperty("/timezone");
                //                     var nextRun = oData.nextRunAt;
                //                     var start = oData.startTime;
                //                     var end = oData.endTime;
                //                     var nextRunAt = that.formatter.gettimezone1(nextRun,that.timezone);
                //                     var startTime = that.formatter.gettimezone1(start,that.timezone);
                //                     var endTime = that.formatter.gettimezone1(end,that.timezone);

                //                     that.byId("idnextrun").setText(nextRunAt);
                //                     that.byId("idstart").setText(startTime);
                //                     that.byId("idend").setText(endTime);

                //                 },
                //                 error: function (error) {
                //                     sap.ui.core.BusyIndicator.hide();
                //                     MessageToast.show("Failed to get data");
                //                 },
                //             });
                //         }

                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide();
                //         MessageToast.show("Failed to get data");
                //     },
                // });
                        sap.ui.core.BusyIndicator.hide();
                // Calling service to get the Job details
                that.getModel("JModel").callFunction("/readJobDetails", {
                    method: "GET",
                    urlParameters: {
                        jobId: jobid,
                        displaySchedules: true,
                    },
                    success: function (oData) {

                        var oData = oData.readJobDetails.schedules[0];

                        // that.byId("idnextrun").setText(oData.nextRunAt);
                        // that.byId("idstart").setText(oData.startTime);
                        // that.byId("idend").setText(oData.endTime);
                            that.timezone = that.oGModel.getProperty("/timezone");
                        var nextRun = oData.nextRunAt;
                        var start = oData.startTime;
                        var end = oData.endTime;
                        var nextRunAt = that.formatter.gettimezone1(nextRun,that.timezone);
                        var startTime = that.formatter.gettimezone1(start,that.timezone);
                        var endTime = that.formatter.gettimezone1(end,that.timezone);

                            that.byId("idnextrun").setText(nextRunAt);
                            that.byId("idstart").setText(startTime);
                            that.byId("idend").setText(endTime);

                            // that.byId("idnextrun").setText(nextRun);
                            // that.byId("idstart").setText(start);
                            // that.byId("idend").setText(end);

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

                that.byId("idPopover").openBy(that.Event.getSource());

            },

            makeInactive: function (oEvent) {
                that.selectedJob = oEvent.getSource().getParent().getBindingContext().getObject();

                that.getModel("JSModel").callFunction("/updateJobData", {
                    method: "GET",
                    urlParameters: {
                        ACTIVE: false,
                        JOB_ID: that.selectedJob.JOB_ID
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        if (oData.updateJobData === "Job Status changed") {
                            that.ChangeStatus(that.selectedJob.JOB_ID, false);
                        }
                        that.onAfterRendering();
                        MessageToast.show(oData.updateJobData);
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                    },
                });

                // that.getModel("JModel").callFunction("/updateJobDetails", {
                //     method: "GET",
                //     urlParameters: {
                //         ACTIVE : false,
                //         JOB_ID : selectedJob.JOB_ID
                //     },
                //     success: function (oData) {
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                // });

            },

            makeActive: function (oEvent) {
                that.selectedJob = oEvent.getSource().getParent().getBindingContext().getObject();

                that.getModel("JSModel").callFunction("/updateJobData", {
                    method: "GET",
                    urlParameters: {
                        ACTIVE: true,
                        JOB_ID: that.selectedJob.JOB_ID
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        if (oData.updateJobData === "Job Status changed") {
                            that.ChangeStatus(that.selectedJob.JOB_ID, true);
                        }
                        that.onAfterRendering();
                        MessageToast.show(oData.updateJobData);

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                    },
                });

                // that.getModel("JModel").callFunction("/updateJobDetails", {
                //     method: "GET",
                //     urlParameters: {
                //         ACTIVE : true,
                //         JOB_ID : selectedJob.JOB_ID
                //     },
                //     success: function (oData) {
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                // });
            },

            ChangeStatus: function (JobId, ACTIVE) {

                that.getModel("JModel").callFunction("/updateJobDetails", {
                    method: "GET",
                    urlParameters: {
                        ACTIVE: ACTIVE,
                        JOB_ID: JobId
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        // that.onAfterRendering();
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },

            onDelete: function (oEvent) {
                that.selectedJob = oEvent.getSource().getParent().getBindingContext().getObject().JOB_ID;
                that.selectedJobname = oEvent.getSource().getParent().getBindingContext().getObject().JOB_NAME;
                that.selectedVariantFlag = oEvent.getSource().getParent().getBindingContext().getObject().VARIANT_FLAG;


                // Getting the conformation popup before deleting		
			var text = "Do you want to remove job" + " - " + that.selectedJobname;
			sap.m.MessageBox.show(
				text, {

					title: "Conformation",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {

							sap.ui.core.BusyIndicator.show();
                                that.getModel("JModel").callFunction("/deleteJobs", {
                                    method: "GET",
                                    urlParameters: {
                                        JOB_ID: that.selectedJob,
                                        JOB_NAME: that.selectedJobname,
                                        VARIANT_FLAG: that.selectedVariantFlag,
                                    },
                                    success: function (oData) {
                                        // sap.ui.core.BusyIndicator.hide();
                                        that.DeleteBatchJob(that.selectedJob,that.selectedJobname);
                                        // if(oData.deleteJobData === "Job deleted"){
                                        //     that.DeleteBatchJob(that.selectedJob);                        
                                        // }
                                        // that.onAfterRendering();
                                    },
                                    error: function (error) {
                                        sap.ui.core.BusyIndicator.hide();
                                        MessageToast.show("Failed to delete");
                                    },
                                });
						}

					}
				}
			);

                

                // that.getModel("JSModel").callFunction("/deleteJobData", {
                //     method: "GET",
                //     urlParameters: {
                //         JOB_ID : that.selectedJob
                //     },
                //     success: function (oData) {
                //         sap.ui.core.BusyIndicator.hide();
                //         if(oData.deleteJobData === "Job deleted"){
                //             that.DeleteBatchJob(that.selectedJob);

                //         }
                //         that.onAfterRendering();
                //         MessageToast.show(oData.deleteJobData);
                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                // });

            },

            DeleteBatchJob: function (job,jobName) {
                // that.getModel("JModel").callFunction("/deleteJobs", {
                //     method: "GET",
                //     urlParameters: {
                //         JOB_ID : job
                //     },
                //     success: function (oData) {
                //         sap.ui.core.BusyIndicator.hide();
                //         // that.onAfterRendering();
                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                // });

                that.getModel("JSModel").callFunction("/deleteJobData", {
                    method: "GET",
                    urlParameters: {
                        JOB_ID: job,
                        JOB_NAME:jobName
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        // if(oData.deleteJobData === "Job deleted"){
                        //     that.DeleteBatchJob(that.selectedJob);

                        // }
                        that.onAfterRendering();
                        MessageToast.show(oData.deleteJobData);
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to delete");
                    },
                });
            },

            onRestartJob: function (oEvent) {
                var object = oEvent.getSource().getParent().getBindingContext().getObject();

                if(object.VARIANT_FLAG === ""){
                // var actionText = "/jobs/resumeJobs";//changed from resumeJobs
                // var actionText = "/jobs/resumeParallelJobs";//changed from resumeJobs -- 
                var actionText = "/jobs/ParallelSetjobsCreation";//changed from resumeJobs -- 
                var jobName = "Restart Job" + " " + new Date().getTime();

                

                var sequenceID = object.SEQUENCE_ID,
                    JobId = object.JOB_ID,
                    step = 0;

                var djSdate = new Date(),
                    djEdate = new Date(new Date().setHours(new Date().getHours() + 2)),
                    dsSDate = new Date(new Date().setSeconds(new Date().getSeconds() + 10)),
                    dsEDate = new Date(new Date().setHours(new Date().getHours() + 1)),
                    tjStime,
                    tjEtime,
                    tsStime,
                    tsEtime;

                //Job Time
                djSdate = djSdate.toISOString().split("T");
                tjStime = djSdate[1].split(":");
                djEdate = djEdate.toISOString().split("T");
                tjEtime = djEdate[1].split(":");
                // schedule Time
                dsSDate = dsSDate.toISOString().split("T");
                tsStime = dsSDate[1].split(":");
                dsEDate = dsEDate.toISOString().split("T");
                tsEtime = dsEDate[1].split(":");

                djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";

                dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";

                that.JobStartTime = djSdate;
                that.JobEndTime = djEdate;
                that.ScheduleStartTime = dsSDate;
                that.ScheduleEndTime = dsEDate;

                var oData = {
                    // SEQUENCE_ID: JSON.stringify(sequenceID),
                    // JOB_ID: JobId,
                    // STEP: step
                    JOBDATA: JSON.stringify(sequenceID)
                }

                
                var finalList = {
                    name: jobName,
                    description: "Restart Job",
                    action: encodeURIComponent(actionText),
                    active: true,
                    httpMethod: "POST",
                    startTime: that.JobStartTime,
                    endTime: that.JobEndTime,
                    createdAt: that.JobStartTime,
                    schedules: [{
                        data: oData,
                        cron: "",
                        time: that.ScheduleStartTime,
                        active: true,
                        startTime: that.ScheduleStartTime,
                        endTime: that.ScheduleEndTime,
                    }]
                };
                that.getOwnerComponent().getModel("JModel").callFunction("/addJobCreation", {
                    method: "GET",
                    urlParameters: {
                        jobDetails: JSON.stringify(finalList)
                    },
                    success: function (oData) {
                        sap.m.MessageToast.show("Job restarted");

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error while restarting the job");
                    },
                });
            } else {

                var jobFeedName = object.JOB_NAME.split("_")[0];
                var oModel = that.getOwnerComponent().getModel('JModel');
                    oModel.callFunction("/createJobFeed", {
                        method: "GET",
                        urlParameters: {                            
                            jobFeedName: jobFeedName
                        },
                        success: function (oData, oResponse) {
                            sap.m.MessageToast.show("Job Created Successfully");
                            that.onBack();
                            
                        },
                        error: function (oResponse) {
                            sap.m.MessageToast.show("Failed to Create job");
                        },
                    });
            }

            },

            onfrozen: function () {
                // if (!this._valueHelpDialogFrozen) {
                //     this._valueHelpDialogFrozen = sap.ui.xmlfragment(
                //         "cpapp.cpjobschedulersequence.view.FrozenDialog",
                //         this
                //     );
                //     this.getView().addDependent(this._valueHelpDialogFrozen);
                // }

                this._valueHelpDialogFrozen = "";

                sap.ui.getCore().byId("JSTF").setVisible(false);
                sap.ui.getCore().byId("idJSTimeF").setVisible(false);
                sap.ui.getCore().byId("JETF").setVisible(false);
                sap.ui.getCore().byId("idJETimeF").setVisible(false);
                sap.ui.getCore().byId("SSTF").setVisible(true);
                sap.ui.getCore().byId("idSSTimeF").setVisible(true);
                sap.ui.getCore().byId("SETF").setVisible(false);
                sap.ui.getCore().byId("idSETimeF").setVisible(false);

                sap.ui.getCore().byId("idSSTimeF").setMinDate(new Date());
                sap.ui.getCore().byId("idJSTimeF").setMinDate(new Date());

                sap.ui.getCore().byId("idSSTimeF").$().find('INPUT').attr('disabled', true);
                sap.ui.getCore().byId("idSETimeF").$().find('INPUT').attr('disabled', true);
                sap.ui.getCore().byId("idJSTimeF").$().find('INPUT').attr('disabled', true);
                sap.ui.getCore().byId("idJETimeF").$().find('INPUT').attr('disabled', true);

                var idJSTime = new Date();
                var idJETime = new Date(new Date().setDate(new Date().getDate() + 1));

                var idSchTime = new Date().setSeconds(new Date().getSeconds() + 5);
                var idSETime = new Date().setHours(new Date().getHours() + 5);
                idSchTime = new Date(idSchTime);
                idSETime = new Date(idSETime);

                sap.ui.getCore().byId("idSSTimeF").setDateValue(idSchTime);
                sap.ui.getCore().byId("idSETimeF").setDateValue(idSETime);

                sap.ui.getCore().byId("idJSTimeF").setDateValue(idJSTime);
                sap.ui.getCore().byId("idJETimeF").setDateValue(idJETime);

                sap.ui.getCore().byId("idType").setSelectedButton(sap.ui.getCore().byId("idSingle"));
                sap.ui.getCore().byId("idOccurrence").setSelectedButton(sap.ui.getCore().byId("Daily"));

                sap.ui.getCore().byId("LidOccurrenceF").setVisible(false);
                sap.ui.getCore().byId("idOccurrence").setVisible(false);
                sap.ui.getCore().byId("LidWeek").setVisible(false);
                sap.ui.getCore().byId("idWeek").setVisible(false);
                this._valueHelpDialogFrozen.open();

            },

            RadioSelect: function (oEvent) {

                var id = oEvent.getParameters().id;
                if (id === "idType") {
                    var selButton = sap.ui.getCore().byId("idType").getSelectedButton().getText();

                    if (selButton !== "Immidiate") {
                        sap.ui.getCore().byId("LidOccurrenceF").setVisible(true);
                        sap.ui.getCore().byId("idOccurrence").setVisible(true);

                        sap.ui.getCore().byId("JSTF").setVisible(true);
                        sap.ui.getCore().byId("idJSTimeF").setVisible(true);
                        sap.ui.getCore().byId("JETF").setVisible(true);
                        sap.ui.getCore().byId("idJETimeF").setVisible(true);
                        sap.ui.getCore().byId("SSTF").setVisible(true);
                        sap.ui.getCore().byId("idSSTimeF").setVisible(true);
                        sap.ui.getCore().byId("SETF").setVisible(true);
                        sap.ui.getCore().byId("idSETimeF").setVisible(true);
                    } else {
                        sap.ui.getCore().byId("LidOccurrenceF").setVisible(false);
                        sap.ui.getCore().byId("idOccurrence").setVisible(false);
                        sap.ui.getCore().byId("LidWeek").setVisible(false);
                        sap.ui.getCore().byId("idWeek").setVisible(false);

                        sap.ui.getCore().byId("JSTF").setVisible(false);
                        sap.ui.getCore().byId("idJSTimeF").setVisible(false);
                        sap.ui.getCore().byId("JETF").setVisible(false);
                        sap.ui.getCore().byId("idJETimeF").setVisible(false);
                        sap.ui.getCore().byId("SSTF").setVisible(true);
                        sap.ui.getCore().byId("idSSTimeF").setVisible(true);
                        sap.ui.getCore().byId("SETF").setVisible(false);
                        sap.ui.getCore().byId("idSETimeF").setVisible(false);
                    }
                } else if (id === "idOccurrence") {
                    var selOccButton = sap.ui.getCore().byId("idOccurrence").getSelectedButton().getText();
                    if (selOccButton === "Weekly") {
                        sap.ui.getCore().byId("LidWeek").setVisible(true);
                        sap.ui.getCore().byId("idWeek").setVisible(true);
                    } else {
                        sap.ui.getCore().byId("LidWeek").setVisible(false);
                        sap.ui.getCore().byId("idWeek").setVisible(false);
                    }
                }

            },

            onWeek: function (oEvent) {
                var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                if (selWeek !== "0") {
                    var calDate = parseInt(selWeek) - 1;

                    var currDate = new Date().getDay();

                    var day = calDate - currDate;
                    // var newDate = new Date(new Date().setDate(new Date().getDate() + day));

                    if (currDate > calDate) {
                        var day = day + 7;
                        var newDate = new Date(new Date().setDate(new Date().getDate() + day));

                        var tempnewDate = new Date(new Date().setDate(new Date().getDate() + day));
                    } else {
                        var day = calDate - currDate;
                        var newDate = new Date(new Date().setDate(new Date().getDate() + day));
                        var tempnewDate = new Date(new Date().setDate(new Date().getDate() + day));
                    }

                    var idSchTime = newDate.setSeconds(newDate.getSeconds() + 5);
                    idSchTime = new Date(idSchTime);
                    sap.ui.getCore().byId("idSSTimeF").setDateValue(idSchTime);

                    var idSETime = newDate.setHours(newDate.getHours() + 5);
                    idSETime = new Date(idSETime);
                    sap.ui.getCore().byId("idSETimeF").setDateValue(idSETime);

                    // var jobEndDate = sap.ui.getCore().byId("idJETimeF").getDateValue();
                    var jobEndDate = new Date(new Date().setDate(new Date().getDate() + 1));

                    // var tempnewDate = sap.ui.getCore().byId("idSSTimeF").getDateValue();

                    // if(jobEndDate < idSchTime){
                    var temp = new Date(tempnewDate.setDate(tempnewDate.getDate() + 1));
                    sap.ui.getCore().byId("idJETimeF").setDateValue(temp);
                    // }

                }

            },

            onSchTimeChange: function (oEvent) {
                var id = oEvent.getParameters().id;

                var selectedDate = sap.ui.getCore().byId("idSSTimeF").getDateValue().getDay();

                var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                if (selWeek !== "0") {
                    var calDate = parseInt(selWeek) - 1;
                }

                if (calDate !== selectedDate) {
                    sap.m.MessageToast.show("Please select date according with the selected week.");
                    that.onWeek();
                } else {
                    var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                    if (selWeek !== "0") {
                        var calDate = parseInt(selWeek) - 1;
                    }

                    var tempnewDate = sap.ui.getCore().byId("idSSTimeF").getDateValue();

                    var temp = new Date(tempnewDate.setDate(tempnewDate.getDate() + 1));
                    sap.ui.getCore().byId("idJETimeF").setDateValue(temp);

                    var newDate = sap.ui.getCore().byId("idSSTimeF").getDateValue();
                    newDate = new Date(newDate.setDate(newDate.getDate() - 1));

                    var idSchTime = newDate.setSeconds(newDate.getSeconds() + 5);
                    idSchTime = new Date(idSchTime);
                    sap.ui.getCore().byId("idSSTimeF").setDateValue(idSchTime);

                    var idSETime = newDate.setHours(newDate.getHours() + 5);
                    idSETime = new Date(idSETime);
                    sap.ui.getCore().byId("idSETimeF").setDateValue(idSETime);

                }

            },

            FrozenCreate: function (oEvent) {
                var actionText = "/catalog/genDynamicFrozenFirmHorizon";
                var jobName = "Dynamic Frozen Firm" + " " + new Date().getTime();

                var djSdate = sap.ui.getCore().byId("idJSTimeF").getDateValue(),
                    djEdate = sap.ui.getCore().byId("idJETimeF").getDateValue(),

                    dsSDate = sap.ui.getCore().byId("idSSTimeF").getDateValue(),
                    dsEDate = sap.ui.getCore().byId("idSETimeF").getDateValue(),

                    tjStime,
                    tjEtime,
                    tsStime,
                    tsEtime;

                //Job Time
                djSdate = djSdate.toISOString().split("T");
                tjStime = djSdate[1].split(":");
                djEdate = djEdate.toISOString().split("T");
                tjEtime = djEdate[1].split(":");
                // schedule Time
                dsSDate = dsSDate.toISOString().split("T");
                tsStime = dsSDate[1].split(":");
                dsEDate = dsEDate.toISOString().split("T");
                tsEtime = dsEDate[1].split(":");

                djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";

                dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";

                that.JobStartTime = djSdate;
                that.JobEndTime = djEdate;
                that.ScheduleStartTime = dsSDate;
                that.ScheduleEndTime = dsEDate;

                var sel = sap.ui.getCore().byId("idType").getSelectedButton().getText();
                if (sel === "Immidiate") {
                    var oneTime = that.ScheduleStartTime;
                    var Cron = "";
                } else {
                    var oneTime = "";
                    var Cron = "";
                    var selButton = sap.ui.getCore().byId("idOccurrence").getSelectedButton().getText();
                    if (selButton === "Daily") {
                        Cron = "*" + " " + "*" + " " + "1-31" + " " + "*" + " " + "*" + " " + "0" + " " + "0";
                    } else {
                        var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                        if (selWeek !== "0") {
                            var calWeek = parseInt(selWeek) - 1;
                        }
                        var week = "";
                        switch (calWeek) {
                            case 1:
                                week = "sun";
                                break;
                            case 2:
                                week = "mon";
                                break;
                            case 3:
                                week = "tue";
                                break;
                            case 4:
                                week = "wed";
                                break;
                            case 5:
                                week = "thu";
                                break;
                            case 6:
                                week = "fri";
                                break;
                            default:
                                week = "sat";
                                break;
                        }

                        Cron = "*" + " " + "*" + " " + "*" + " " + week + " " + "*" + " " + "0" + " " + "0";
                    }

                }

                var adata = {};

                var finalList = {
                    name: jobName,
                    description: "Dynamic Frozen Firm Job",
                    action: encodeURIComponent(actionText),
                    active: true,
                    httpMethod: "POST",
                    startTime: that.JobStartTime,
                    endTime: that.JobEndTime,
                    createdAt: that.JobStartTime,
                    schedules: [{
                        data: adata,
                        cron: Cron,
                        time: oneTime,
                        active: true,
                        startTime: that.ScheduleStartTime,
                        endTime: that.ScheduleEndTime,
                    }]
                };
                that.getModel("JModel").callFunction("/addMLJob", {
                    method: "GET",
                    urlParameters: {
                        jobDetails: JSON.stringify(finalList),
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.addMLJob + ": Job Created");
                        that.onCloseFrozen();
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        that.onCloseFrozen();
                        sap.m.MessageToast.show("Failed to create Job");
                    },
                });

            },

            onCloseFrozen: function () {
                this._valueHelpDialogFrozen.close();

            },

            onPerge: function () {
                sap.m.MessageToast.show("perge");
            },

            onUpdate: function () {
                sap.m.MessageToast.show("update");
            },

            onfrozen: function () {
                if (!this._valueHelpDialogFrozen) {
                    this._valueHelpDialogFrozen = sap.ui.xmlfragment(
                        "cpapp.cpjobschedulersequence.view.FrozenDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogFrozen);
                }

                sap.ui.getCore().byId("JSTF").setVisible(false);
                sap.ui.getCore().byId("idJSTimeF").setVisible(false);
                sap.ui.getCore().byId("JETF").setVisible(false);
                sap.ui.getCore().byId("idJETimeF").setVisible(false);
                sap.ui.getCore().byId("SSTF").setVisible(true);
                sap.ui.getCore().byId("idSSTimeF").setVisible(true);
                sap.ui.getCore().byId("SETF").setVisible(false);
                sap.ui.getCore().byId("idSETimeF").setVisible(false);

                sap.ui.getCore().byId("idSSTimeF").setMinDate(new Date());
                sap.ui.getCore().byId("idJSTimeF").setMinDate(new Date());

                sap.ui.getCore().byId("idSSTimeF").$().find('INPUT').attr('disabled', true);
                sap.ui.getCore().byId("idSETimeF").$().find('INPUT').attr('disabled', true);
                sap.ui.getCore().byId("idJSTimeF").$().find('INPUT').attr('disabled', true);
                sap.ui.getCore().byId("idJETimeF").$().find('INPUT').attr('disabled', true);

                var idJSTime = new Date();
                var idJETime = new Date(new Date().setDate(new Date().getDate() + 1));

                var idSchTime = new Date().setSeconds(new Date().getSeconds() + 5);
                var idSETime = new Date().setHours(new Date().getHours() + 5);
                idSchTime = new Date(idSchTime);
                idSETime = new Date(idSETime);

                sap.ui.getCore().byId("idSSTimeF").setDateValue(idSchTime);
                sap.ui.getCore().byId("idSETimeF").setDateValue(idSETime);

                sap.ui.getCore().byId("idJSTimeF").setDateValue(idJSTime);
                sap.ui.getCore().byId("idJETimeF").setDateValue(idJETime);

                sap.ui.getCore().byId("idType").setSelectedButton(sap.ui.getCore().byId("idSingle"));
                sap.ui.getCore().byId("idOccurrence").setSelectedButton(sap.ui.getCore().byId("Daily"));

                sap.ui.getCore().byId("LidOccurrenceF").setVisible(false);
                sap.ui.getCore().byId("idOccurrence").setVisible(false);
                sap.ui.getCore().byId("LidWeek").setVisible(false);
                sap.ui.getCore().byId("idWeek").setVisible(false);
                this._valueHelpDialogFrozen.open();

            },

            RadioSelect: function (oEvent) {

                var id = oEvent.getParameters().id;
                if (id === "idType") {
                    var selButton = sap.ui.getCore().byId("idType").getSelectedButton().getText();

                    if (selButton !== "Immidiate") {
                        sap.ui.getCore().byId("LidOccurrenceF").setVisible(true);
                        sap.ui.getCore().byId("idOccurrence").setVisible(true);

                        sap.ui.getCore().byId("JSTF").setVisible(true);
                        sap.ui.getCore().byId("idJSTimeF").setVisible(true);
                        sap.ui.getCore().byId("JETF").setVisible(true);
                        sap.ui.getCore().byId("idJETimeF").setVisible(true);
                        sap.ui.getCore().byId("SSTF").setVisible(true);
                        sap.ui.getCore().byId("idSSTimeF").setVisible(true);
                        sap.ui.getCore().byId("SETF").setVisible(true);
                        sap.ui.getCore().byId("idSETimeF").setVisible(true);
                    } else {
                        sap.ui.getCore().byId("LidOccurrenceF").setVisible(false);
                        sap.ui.getCore().byId("idOccurrence").setVisible(false);
                        sap.ui.getCore().byId("LidWeek").setVisible(false);
                        sap.ui.getCore().byId("idWeek").setVisible(false);

                        sap.ui.getCore().byId("JSTF").setVisible(false);
                        sap.ui.getCore().byId("idJSTimeF").setVisible(false);
                        sap.ui.getCore().byId("JETF").setVisible(false);
                        sap.ui.getCore().byId("idJETimeF").setVisible(false);
                        sap.ui.getCore().byId("SSTF").setVisible(true);
                        sap.ui.getCore().byId("idSSTimeF").setVisible(true);
                        sap.ui.getCore().byId("SETF").setVisible(false);
                        sap.ui.getCore().byId("idSETimeF").setVisible(false);
                    }
                } else if (id === "idOccurrence") {
                    var selOccButton = sap.ui.getCore().byId("idOccurrence").getSelectedButton().getText();
                    if (selOccButton === "Weekly") {
                        sap.ui.getCore().byId("LidWeek").setVisible(true);
                        sap.ui.getCore().byId("idWeek").setVisible(true);
                    } else {
                        sap.ui.getCore().byId("LidWeek").setVisible(false);
                        sap.ui.getCore().byId("idWeek").setVisible(false);
                    }
                }

            },

            onWeek: function (oEvent) {
                var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                if (selWeek !== "0") {
                    var calDate = parseInt(selWeek) - 1;

                    var currDate = new Date().getDay();

                    var day = calDate - currDate;
                    // var newDate = new Date(new Date().setDate(new Date().getDate() + day));

                    if (currDate > calDate) {
                        var day = day + 7;
                        var newDate = new Date(new Date().setDate(new Date().getDate() + day));

                        var tempnewDate = new Date(new Date().setDate(new Date().getDate() + day));
                    } else {
                        var day = calDate - currDate;
                        var newDate = new Date(new Date().setDate(new Date().getDate() + day));
                        var tempnewDate = new Date(new Date().setDate(new Date().getDate() + day));
                    }

                    var idSchTime = newDate.setSeconds(newDate.getSeconds() + 5);
                    idSchTime = new Date(idSchTime);
                    sap.ui.getCore().byId("idSSTimeF").setDateValue(idSchTime);

                    var idSETime = newDate.setHours(newDate.getHours() + 5);
                    idSETime = new Date(idSETime);
                    sap.ui.getCore().byId("idSETimeF").setDateValue(idSETime);

                    // var jobEndDate = sap.ui.getCore().byId("idJETimeF").getDateValue();
                    var jobEndDate = new Date(new Date().setDate(new Date().getDate() + 1));

                    // var tempnewDate = sap.ui.getCore().byId("idSSTimeF").getDateValue();

                    // if(jobEndDate < idSchTime){
                    var temp = new Date(tempnewDate.setDate(tempnewDate.getDate() + 1));
                    sap.ui.getCore().byId("idJETimeF").setDateValue(temp);
                    // }

                }

            },

            onSchTimeChange: function (oEvent) {
                var id = oEvent.getParameters().id;

                var selectedDate = sap.ui.getCore().byId("idSSTimeF").getDateValue().getDay();

                var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                if (selWeek !== "0") {
                    var calDate = parseInt(selWeek) - 1;
                }

                if (calDate !== selectedDate) {
                    sap.m.MessageToast.show("Please select valid date for selected week!");
                    that.onWeek();
                } else {
                    var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                    if (selWeek !== "0") {
                        var calDate = parseInt(selWeek) - 1;
                    }

                    var tempnewDate = sap.ui.getCore().byId("idSSTimeF").getDateValue();

                    var temp = new Date(tempnewDate.setDate(tempnewDate.getDate() + 1));
                    sap.ui.getCore().byId("idJETimeF").setDateValue(temp);

                    var newDate = sap.ui.getCore().byId("idSSTimeF").getDateValue();
                    newDate = new Date(newDate.setDate(newDate.getDate() - 1));

                    var idSchTime = newDate.setSeconds(newDate.getSeconds() + 5);
                    idSchTime = new Date(idSchTime);
                    sap.ui.getCore().byId("idSSTimeF").setDateValue(idSchTime);

                    var idSETime = newDate.setHours(newDate.getHours() + 5);
                    idSETime = new Date(idSETime);
                    sap.ui.getCore().byId("idSETimeF").setDateValue(idSETime);

                }

            },

            FrozenCreate: function (oEvent) {
                var actionText = "/catalog/genDynamicFrozenFirmHorizon";
                var jobName = "Dynamic Frozen Firm" + " " + new Date().getTime();

                var djSdate = sap.ui.getCore().byId("idJSTimeF").getDateValue(),
                    djEdate = sap.ui.getCore().byId("idJETimeF").getDateValue(),

                    dsSDate = sap.ui.getCore().byId("idSSTimeF").getDateValue(),
                    dsEDate = sap.ui.getCore().byId("idSETimeF").getDateValue(),

                    tjStime,
                    tjEtime,
                    tsStime,
                    tsEtime;

                //Job Time
                djSdate = djSdate.toISOString().split("T");
                tjStime = djSdate[1].split(":");
                djEdate = djEdate.toISOString().split("T");
                tjEtime = djEdate[1].split(":");
                // schedule Time
                dsSDate = dsSDate.toISOString().split("T");
                tsStime = dsSDate[1].split(":");
                dsEDate = dsEDate.toISOString().split("T");
                tsEtime = dsEDate[1].split(":");

                djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";

                dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";

                that.JobStartTime = djSdate;
                that.JobEndTime = djEdate;
                that.ScheduleStartTime = dsSDate;
                that.ScheduleEndTime = dsEDate;

                var sel = sap.ui.getCore().byId("idType").getSelectedButton().getText();
                if (sel === "Immidiate") {
                    var oneTime = that.ScheduleStartTime;
                    var Cron = "";
                } else {
                    var oneTime = "";
                    var Cron = "";
                    var selButton = sap.ui.getCore().byId("idOccurrence").getSelectedButton().getText();
                    if (selButton === "Daily") {
                        Cron = "*" + " " + "*" + " " + "1-31" + " " + "*" + " " + "*" + " " + "0" + " " + "0";
                    } else {
                        var selWeek = sap.ui.getCore().byId("idWeek").getSelectedKey();
                        if (selWeek !== "0") {
                            var calWeek = parseInt(selWeek) - 1;
                        }
                        var week = "";
                        switch (calWeek) {
                            case 1:
                                week = "sun";
                                break;
                            case 2:
                                week = "mon";
                                break;
                            case 3:
                                week = "tue";
                                break;
                            case 4:
                                week = "wed";
                                break;
                            case 5:
                                week = "thu";
                                break;
                            case 6:
                                week = "fri";
                                break;
                            default:
                                week = "sat";
                                break;
                        }

                        Cron = "*" + " " + "*" + " " + "*" + " " + week + " " + "*" + " " + "0" + " " + "0";
                    }

                }

                var adata = {};

                var finalList = {
                    name: jobName,
                    description: "Dynamic Frozen Firm Job",
                    action: encodeURIComponent(actionText),
                    active: true,
                    httpMethod: "POST",
                    startTime: that.JobStartTime,
                    endTime: that.JobEndTime,
                    createdAt: that.JobStartTime,
                    schedules: [{
                        data: adata,
                        cron: Cron,
                        time: oneTime,
                        active: true,
                        startTime: that.ScheduleStartTime,
                        endTime: that.ScheduleEndTime,
                    }]
                };
                that.getModel("JModel").callFunction("/addMLJob", {
                    method: "GET",
                    urlParameters: {
                        jobDetails: JSON.stringify(finalList),
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.addMLJob + ": Job Created");
                        that.onCloseFrozen();
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        that.onCloseFrozen();
                        sap.m.MessageToast.show("Failed to create Job");
                    },
                });

            },

            onCloseFrozen: function () {
                this._valueHelpDialogFrozen.close();

            },

            
          



        });
    });

