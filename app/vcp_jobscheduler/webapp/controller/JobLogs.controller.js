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
    "sap/m/MessageBox",
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function (BaseController, JSONModel, formatter, MessageToast, Filter, FilterOperator, library, Sorter, Dialog, Text, Button, MessageBox) {
    "use strict";
    var that, oGModel;

    return BaseController.extend("vcpapp.vcpjobschedulersequence.controller.JobLogs", {
        formatter: formatter,
        onInit: function () {
            that = this;
            // Declaring JSON Model and size limit
            that.oModel = new JSONModel();
            
            that.oGModel = that.getOwnerComponent().getModel("oGModel");

            this.JobLogsModel = new JSONModel();
            this.JobDataModel = new JSONModel();
            this.ScheLogModel = new JSONModel();
            this.ScheRunLogModel = new JSONModel();

            that.oModel.setSizeLimit(1000);

            

        },

        onAfterRendering: function () {


            if (!this._ScheduleLogDialog) {
                this._ScheduleLogDialog = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.ScheduleLogs",
                    this
                );
                this.getView().addDependent(this._ScheduleLogDialog);
            }

            if (!this._MultiScheduleLogDialog) {
                this._MultiScheduleLogDialog = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.ScheduleIDs",
                    this
                );
                this.getView().addDependent(this._MultiScheduleLogDialog);
            }

            // Declaring fragments
            this._oCore = sap.ui.getCore();
            if (!this._valueHelpDialogMFL) {
                this._valueHelpDialogMFL = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.MFLocDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialogMFL);
            }
            if (!this._valueHelpDialogLoc) {
                this._valueHelpDialogLoc = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.LocDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialogLoc);
            }
            if (!this._valueHelpDialogProd) {
                this._valueHelpDialogProd = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.ProdDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialogProd);
            }

            that.TotalCount = 0;
                that.irecPerPage = 200;
                that.iPageStart = 0;
                that.iPageEnd = that.irecPerPage;
                that.buttonPressed = false;

                that.toggleFooter(false);
                    that.iPageStart = 0;
                    that.iPageEnd = that.irecPerPage;
                    this.getView().byId("lblPagination").setText(`1 - ${that.irecPerPage}`);
                    this.getView().byId("btnPrevious").setEnabled(false);

            that.TempParams = [];
            var Jobid = "",
                JobName = "";
                that.panelData = [];
                that.panelStep = undefined;
                that.resumeJob = "";
                that.ResumeStep = "";
            that.oGModel = that.getOwnerComponent().getModel("oGModel");
            that.newoGModel = that.getOwnerComponent().getModel("newoGModel");

            Jobid = that.oGModel.getProperty("/jobid");
            JobName = that.oGModel.getProperty("/jobname");
            that.byId("idTemp").setText(that.oGModel.getProperty("/tempId"));
            that.newoGModel.setProperty("/ScheduleTable", false);
            this._oCore = sap.ui.getCore();
            this.oProdList = this._oCore.byId("prodSlctListJSS");
            this.oMFLocList = this._oCore.byId("MFLSlctListJSS");
            // this.oLocList = this._oCore.byId(
            //     this._valueHelpDialogLoc.getId() + "-list"
            // );
            this.oLocList = this._oCore.byId("LocSlctListJSS");
            this.oLocList.setMultiSelect(false);
            this.oProdList.setMultiSelect(false);

                that.oMFLoc = that.byId("mLoc");
                that.oLoc = that.byId("dLoc");
                that.oProd = that.byId("prod");
                that.obj =[{
                    STEP_NO: "",
                    ACTIVITY_ID : "Activity",
                    TotalData : "MF Location - Demand Location - Config Product",
                    ACTIVITY_STATUS : "Job Status",
                    EXPAND  : false
                }];
                that.newClassModel = new JSONModel();
                that.newClassModel.setData(that.panelData);
                that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");


                that.ScheduleModel = new JSONModel();
                that.byId("idJobLogs1").setModel(that.ScheduleModel);
                that.JobLogModel = new JSONModel();
                that.byId("idScheRunLogDatanew").setModel(that.JobLogModel);
            
                var log = [];
                that.generateLogs(log);
                // that.byId("idScheRunLogDatanew").setVisible(false);
            if (Jobid === undefined || Jobid === "") {
                MessageToast.show("No Job Id");
                
                that.onNavBack();
            } else {
                that.AllLocProdData = [];
                that.skip = 0;
                // that.generateData();
                sap.ui.core.BusyIndicator.show();
                that.AllLocProdData = [];
                // var topCount = that.oGModel.getProperty("/MaxCount");
                
                            that.skip = 0;
                        that.AllLocProdData = that.oGModel.getProperty("/homeAllLocationData");;
                   
                        that.mfloc = [];
                        that.dloc = [];
                        that.prod = [];
                        sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readJobDetailsLogs", {
                    filters: [
                        new Filter("JOB_ID", FilterOperator.EQ, Jobid),
                        new Filter("JOB_NAME", FilterOperator.EQ, JobName),
                    ],
                    urlParameters: {
                        "$skip": 0,
                        "$top": 30000
                    },
                    success: function (oData) {
                        // sap.ui.core.BusyIndicator.hide();
                        that.oGModel.setProperty("/seqId", oData.results[0].SEQUENCE_ID);
                        oData.results.sort((a,b)=>parseInt(a.STEP) - parseInt(b.STEP));
                        that.jobTotalData = oData.results;
                        that.TotalCount = that.jobTotalData.length;

                        // oData.results = oData.results.slice(0, 200);
                        that.getView().byId("btnNext").setEnabled(true);
                        if (oData.results.length >= that.irecPerPage && that.TotalCount > that.irecPerPage) {//Showing pagination if records are atleast 100
                            that.setPagination();

                            var sLabel = `${that.iPageStart} - ${that.irecPerPage}`;
                            that.getView().byId("lblPagination").setText(sLabel);
                            
                        } else {//disable Next button 
                            that.getView().byId("btnNext").setEnabled(false);
                        }


                        for(var i =0; i <oData.results.length; i++){
                            oData.results[i].EXPAND = true;
                                                       
                            if (oData.results[i].ACTIVITY_STATUS === "" || oData.results[i].ACTIVITY_STATUS === "Pending") {
                                oData.results[i].ACTIVITY_STATUS = "Active";
                            } else if(oData.results[i].ACTIVITY_STATUS === null){
                                oData.results[i].ACTIVITY_STATUS = "Not Triggered";
                            }
                            if(oData.results[i].STEP_NO === null || oData.results[i].STEP_NO === undefined){
                                oData.results[i].STEP_NO = i + 1;
                            }
                            if(that.resumeJob === ""){
                            if(oData.results[i].ACTIVITY_STATUS === "Error"){
                                that.resumeJob = "X";
                                that.ResumeStep = parseInt(oData.results[i].STEP);
                            }
                        }
                        // that.resumeJob = that.resumeJob === "" ? oData.results[i].ACTIVITY_STATUS === "Success" ? "" : "X" : "X";

                            oData.results[i].CONFIG_PRODUCT = "";
                        var temp = JSON.parse(oData.results[i].PARAM_VALUE);

                            // oData.results[i] = {...temp, ...oData.results[i]};
                            oData.results[i] = Object.assign( {}, temp, oData.results[i] );
                            
                            

                            if(oData.results[i].PRODUCT_ID !== undefined ){
                                if(oData.results[i].PRODUCT_ID.includes(",")){
                                        var prod = oData.results[i].PRODUCT_ID[0];
                                } else{
                                    var isArray = Array.isArray(oData.results[i].PRODUCT_ID);
                                    if(isArray){
                                        var prod = oData.results[i].PRODUCT_ID[0];
                                    } else {
                                        var prod = oData.results[i].PRODUCT_ID;
                                    }
                                }
                                if(oData.results[i].MF_LOCATION_ID !== oData.results[i].LOCATION_ID){
                                    var filter = that.AllLocProdData.filter(el => el.FACTORY_LOC === oData.results[i].MF_LOCATION_ID &&
                                                                                  el.DEMAND_LOC === oData.results[i].LOCATION_ID && 
                                                                                  el.PRODUCT_ID === prod);
                                    } else {
                                        var filter = that.AllLocProdData.filter(el => el.DEMAND_LOC === oData.results[i].LOCATION_ID && 
                                                                                      el.PRODUCT_ID ===  prod);
                                    }     
                                    
                            if(filter.length  > 0){
                                oData.results[i].CONFIG_PRODUCT =  filter[0].REF_PRODID;
                                if(oData.results[i].MF_LOCATION_ID !== undefined){
                                that.mfloc.push({
                                    FACTORY_LOC : oData.results[i].MF_LOCATION_ID,
                                    LOCATION_ID : oData.results[i].LOCATION_ID,
                                    PRODUCT_ID : filter[0].REF_PRODID
                                });
                            }
                            if(oData.results[i].LOCATION_ID !== undefined){
                                that.dloc.push({
                                    LOCATION_ID : oData.results[i].LOCATION_ID,
                                    FACTORY_LOC : oData.results[i].MF_LOCATION_ID,                            
                                    PRODUCT_ID : filter[0].REF_PRODID
                                });
                            }
        
                                that.prod.push({
                                    CONFIG_PRODUCT : filter[0].REF_PRODID,
                                    PRODUCT_ID : filter[0].REF_PRODID,
                                    LOCATION_ID : oData.results[i].LOCATION_ID,
                                    FACTORY_LOC : oData.results[i].MF_LOCATION_ID,
                                });
                            oData.results[i].TotalData = oData.results[i].MF_LOCATION_ID + " - " + oData.results[i].LOCATION_ID + " - " + filter[0].REF_PRODID;
                            }
                        } else {
                            if(oData.results[i].MF_LOCATION_ID !== undefined){
                            that.mfloc.push({
                                FACTORY_LOC : oData.results[i].MF_LOCATION_ID,
                                LOCATION_ID : oData.results[i].LOCATION_ID
                            });
                            oData.results[i].TotalData = oData.results[i].MF_LOCATION_ID + " - " + oData.results[i].LOCATION_ID ;

                        }
                            if(oData.results[i].LOCATION_ID !== undefined){
                            that.dloc.push({
                                LOCATION_ID : oData.results[i].LOCATION_ID,
                                FACTORY_LOC : oData.results[i].MF_LOCATION_ID
                            });
                            oData.results[i].TotalData = oData.results[i].MF_LOCATION_ID + " - " + oData.results[i].LOCATION_ID ;
                            
                        }
    
                            
                        }

                        if(temp.MF_LOCATION_ID === undefined ){
                            oData.results[i].MF_LOCATION_ID ="";
                            oData.results[i].LOCATION_ID = ""; 
                            oData.results[i].CONFIG_PRODUCT ="";
                        }
                        
                        
                        // });
                    }
                   
                    
                    
                        that.JobDetail = oData.results;
                        that.oGModel.setProperty("/jobData", oData.results);
                        
                       
                        var timezone = new Date().getTimezoneOffset();

                        that.newClassModel = new JSONModel();
                        that.mfLocModel = new JSONModel();
                        that.dLocModel = new JSONModel();
                        that.ProdModel = new JSONModel();
                        var locdata = that.mfloc;

                        that.oProdList = sap.ui.getCore().byId("prodSlctListJSS");
                        that.oMFLocList = sap.ui.getCore().byId("MFLSlctListJSS");                        
                        that.oLocList = sap.ui.getCore().byId("LocSlctListJSS");

                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.mlocData = removeDuplicate(locdata, 'FACTORY_LOC');
                        that.dlocdata = removeDuplicate(locdata, 'LOCATION_ID');
                        that.proddata = removeDuplicate(locdata, 'PRODUCT_ID');

                        that.mfLocModel.setSizeLimit(that.mlocData.length);
                        that.dLocModel.setSizeLimit(that.dlocdata.length);
                        that.ProdModel.setSizeLimit(that.proddata.length);

                        that.mfLocModel.setData({
                            MFLocitems: that.mlocData
                        });
                        that.dLocModel.setData({
                            Locitems: that.dlocdata
                        });
                        that.ProdModel.setData({
                            results: that.proddata
                        });

                        
                        that.oMFLocList.setModel(that.mfLocModel);
                        that.oLocList.setModel(that.dLocModel);
                        that.oProdList.setModel(that.ProdModel);

                       
                        var obj = that.obj.concat(oData.results);
                      

                        var obj = that.obj.concat(oData.results);
                        obj = obj.slice(0, 200);
                        that.panelData.obj = obj;
                        that.panelData.Main_obj = oData.results;
                        if(that.panelData.obj.length > 8){
                            that.newClassModel.setSizeLimit(that.panelData.obj.length);
                        } else {
                            that.newClassModel.setSizeLimit(10);
                        }
                        that.newClassModel.setData(that.panelData);
                        that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");

                        
                        that.timezone = that.oGModel.getProperty("/timezone");
                        var startDate = oData.results[0].JOB_STARTTIME;
                        var validfrom = that.formatter.gettimezone(startDate,that.timezone);
                        that.byId("isStart").setText(validfrom);


                        var EndDate = oData.results[0].JOB_ENDTIME;
                        var validto = that.formatter.gettimezone(EndDate,that.timezone);
                        that.byId("idEnd").setText(validto);


                        that.byId("idRec").setText(oData.results[0].JOB_TYPE);

                        that.byId("oneTime").setVisible(false);
                        that.byId("Recurr").setVisible(false);

                        if (oData.results[0].JOB_TYPE === "Single Run") {
                            that.byId("oneTime").setVisible(true);
                            var rDate = oData.results[0].RECURRENCE_VALUE_FORMAT.split("T")
                         
                            var recurrence = that.formatter.gettimezone(oData.results[0].RECURRENCE_VALUE_FORMAT,that.timezone);

                            that.byId("idRecVal").setText(recurrence);

                        } else {

                            that.byId("Recurr").setVisible(true);
                            var cron = JSON.parse(oData.results[0].RECURRENCE_VALUE_FORMAT);

                            that.byId("year").setValue(cron[0].year);
                            that.byId("mnth").setValue(cron[0].mnth)
                            that.byId("date").setValue(cron[0].date);
                            that.byId("day").setValue(cron[0].day);
                            that.byId("hrs").setValue(cron[0].hour);
                            that.byId("min").setValue(cron[0].min);
                            var selWeek = cron[0].day;
                            var week = "";
                        switch (selWeek) {
                        case "sun":
                            week = "Sunday";
                            break;
                        case "mon":
                            week = "Monday";
                            break;
                        case "tue":
                            week = "Tuesday";
                            break;
                        case "wed":
                            week = "Wednesday";
                            break;
                        case "thu":
                            week = "Thursday";
                            break;
                        case "fri":
                            week = "Friday";
                            break;
                        case "sat":
                            week = "Saturday";
                            break;
                        default:
                            week = "";
                            break;
                        }

                        that.byId("day").setValue(week);

                        }

                        if(that.resumeJob === ""){
                            that.byId("idResumeJob").setVisible(false);
                        } else {
                            that.byId("idResumeJob").setVisible(true);
                        }

                        
                        sap.ui.core.BusyIndicator.hide();
                       
                    setTimeout(() => {
                       
                        that.byId("idListPanel").getItems()[0].getContent()[0]._oExpandButton.setVisible(false);
                    }, 30);
                        

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        that.panelData.obj1 = [];
                        that.newClassModel.setData(that.panelData);
                        that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");
                        MessageToast.show("Refresh to fetch data");
                    },
                });
            }

        },


        getData:function(start, end){
            that.buttonPressed = false;

            let tempData = that.panelData.Main_obj;

            tempData = tempData.filter(el=> parseInt(el.STEP) >= start && parseInt(el.STEP) <= end );
            

           
            var obj = that.obj.concat(tempData);
            that.panelData.obj = obj;
            // that.panelData = panelarray;
            if(that.panelData.obj.length > 8){
                that.newClassModel.setSizeLimit(that.panelData.obj.length);
            } else {
                that.newClassModel.setSizeLimit(10);
            }
            that.newClassModel.setData(that.panelData);
            that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");
            
        },

        //#region Pagination
        Navigate: function (Mode) {
            if (that.buttonPressed === true) {
                return;
            }
            that.buttonPressed = true;
            var iStart = that.iPageStart;
            var iLastRec = 0;
            if (Mode === 'P') {
                if (iStart >= that.irecPerPage) {
                    iStart = that.iPageStart - that.irecPerPage;
                }
            }
            else {
                iStart = that.iPageStart + that.irecPerPage;
            }
            that.iPageStart = iStart;
            iLastRec = iStart + that.irecPerPage;
            if (iLastRec > that.TotalCount) {
                iLastRec = that.TotalCount;
            }
            var sLabel = "";
            if (iStart === 0) {//Disable Previous Button
                that.getView().byId("btnPrevious").setEnabled(false);
                iStart = 1;
                sLabel = `${iStart} - ${iLastRec}`
            }
            else {
                that.getView().byId("btnPrevious").setEnabled(true);
                sLabel = `${iStart + 1} - ${iLastRec}`
            }
            that.iPageEnd = iLastRec;
            if (iLastRec >= that.TotalCount) {
                that.getView().byId("btnNext").setEnabled(false);
            }
            else {
                that.getView().byId("btnNext").setEnabled(true);
            }
            that.getView().byId("lblPagination").setText(sLabel);
            that.getData(iStart, iLastRec);
        },
        toggleFooter(flag) { //Hide or show footer based on Table Data
            this.getView().byId("hPagination").setVisible(flag);
        },
        setPagination: function () {
            that.toggleFooter(true);
        },

       
        handleValueHelp: function (oEvent) {
            var sId = oEvent.getParameter("id");
            var data = that.oGModel.getProperty("/jobData");
            if (sId.includes("mLoc")) {
                this._valueHelpDialogMFL.open();
                
            } else if (sId.includes("dLoc")) {
                this._valueHelpDialogLoc.open();
            } else if (sId.includes("prod")) {
                this._valueHelpDialogProd.open();
            }

            // that.filterData();

        },
        filterData:function(){
            var loc = that.panelData.Main_obj;

            var check = that.byId("iderror").getSelected();

                if(check){
                    loc = loc.filter(el=> el.ACTIVITY_STATUS === 'Error');
                }
            
                if(that.oMFLoc.getValue() !== ""){
                     loc = loc.filter(el=> el.MF_LOCATION_ID === that.oMFLoc.getValue());
                }

                if(that.oLoc.getValue() !== ""){
                     loc = loc.filter(el=> el.LOCATION_ID === that.oLoc.getValue());
                }
                
                if(that.oProd.getValue() !== ""){
                    loc = loc.filter(el=> el.PRODUCT_ID === that.oProd.getValue());
               }
                
            


                    
                    var sQuery = that.byId("SearchId").getValue().toUpperCase();
                        // Check if search filter is to be applied
                        sQuery = sQuery ? sQuery.trim() : "";
                    if(sQuery !== ""){
                        loc = loc.filter(el => el.MF_LOCATION_ID.toUpperCase().includes(sQuery) || el.CONFIG_PRODUCT.toUpperCase().includes(sQuery) || 
                                                el.LOCATION_ID.toUpperCase().includes(sQuery)|| el.ACTIVITY_STATUS.toUpperCase().includes(sQuery) )
                        };

                    var data = that.obj.concat(loc);
                    that.panelData.obj = data;
                    that.newClassModel = new JSONModel();
                    that.newClassModel.setData(that.panelData);
                    that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");


        },

        onResetFilters:function(){
            that.byId("iderror").setSelected(false);
            that.oMFLoc.setValue('');
            that.oLoc.setValue('');
            that.oProd.setValue('');
            that.byId("SearchId").setValue('');

                var loc = that.panelData.Main_obj;
                var data = that.obj.concat(loc);
                    that.panelData.obj = data;
                    that.newClassModel = new JSONModel();
                    that.newClassModel.setData(that.panelData);
                    that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");


        },


        handleClose: function (oEvent) {
            var sId = oEvent.getParameter("id");
            if (sId.includes("mLoc")) {
                that._oCore
                    .byId(this._valueHelpDialogMFL.getId() + "-searchField")
                    .setValue("");
                if (that.oMFLocList.getBinding("items")) {
                    that.oMFLocList.getBinding("items").filter([]);
                }
            
            } else if (sId.includes("dLoc")) {
                that._oCore
                    .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                    .setValue("");
                if (that.oLocList.getBinding("items")) {
                    that.oLocList.getBinding("items").filter([]);
                }
            } else if (sId.includes("prod")) {
                that._oCore
                    .byId(this._valueHelpDialogProd.getId() + "-searchField")
                    .setValue("");
                if (that.oProdList.getBinding("items")) {
                    that.oProdList.getBinding("items").filter([]);
                }
            }
        },

        handleSearch: function (oEvent) {
            var sQuery =
                oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                sId = oEvent.getParameter("id"),
                oFilters = [];
            // Check if search filter is to be applied
            sQuery = sQuery ? sQuery.trim() : "";

            if (sId.includes("mLoc")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("FACTORY_LOC", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }

                    that.oMFLocList.getBinding("items").filter(oFilters);

            } else if (sId.includes("dLoc")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("DEMAND_LOC", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oLocList.getBinding("items").filter(oFilters);
            } else if (sId.includes("prod")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CONFIG_PRODUCT", FilterOperator.Contains, sQuery),
                                new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oProdList.getBinding("items").filter(oFilters);
            }
        },

        handleSelection: function (oEvent) {
            var sId = oEvent.getParameter("id");
            var data = that.oGModel.getProperty("/jobData");
            if(sId.includes("MFL")){
                var aSelectedLoc = oEvent.getParameter("selectedItems");
                that.oMFLoc.setValue(aSelectedLoc[0].getTitle());

                    // data = data.filter(el=> el.MF_LOCATION_ID === aSelectedLoc[0].getTitle());
                    // data = that.obj.concat(data);
                    // that.panelData.obj = data;
                    // that.newClassModel.setData(that.panelData);
                    // that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");
            } else if (sId.includes("Loc")) {
                    var aSelectedLoc = oEvent.getParameter("selectedItems");
                    that.oLoc.setValue(aSelectedLoc[0].getCells()[0].getTitle());
                    // data = data.filter(el=> el.LOCATION_ID === aSelectedLoc[0].getCells()[0].getTitle());
                    // data = that.obj.concat(data);
                    // that.panelData.obj = data;
                    // that.newClassModel.setData(that.panelData);
                    // that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");
            }  else if (sId.includes("prod")) {
                    var aSelectedProd = oEvent.getParameter("selectedItems");
                    that.oProd.setValue(aSelectedProd[0].getCells()[0].getTitle());
                    // data = data.filter(el=> el.CONFIG_PRODUCT === aSelectedProd[0].getCells()[0].getTitle());
                    // that.panelData.obj = data;
                    // data = that.obj.concat(data);
                    // that.newClassModel.setData(that.panelData);
                    // that.byId("idListPanel").setModel(that.newClassModel, "ostepModel");
            }

            that.filterData();


                },


        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            // if(that.panelStep !== undefined && that.panelStep !== NaN){
            //     that.byId("idListPanel").getItems()[that.panelStep].getContent()[0].setExpanded(false);
            // }
            that.Destroy();
            
            // that.panelData = [];
            // that.newClassModel.setData(that.panelData);
            // that.byId("idScheRunLogDatanew").setModel(that.newClassModel, "ostepModel");
            // var temp =[];
            // that.JobLogModel.setData({
            //     results : temp
            // });
            // that.byId("idScheRunLogDatanew").setModel(that.JobLogModel);

            oRouter.navTo("Home", {}, true);
        },

        Destroy:function(){
            this._MultiScheduleLogDialog.destroy();

            this._valueHelpDialogMFL.destroy();
            this._valueHelpDialogLoc.destroy();
            this._valueHelpDialogProd.destroy();

            this._MultiScheduleLogDialog = "";

            this._valueHelpDialogMFL = "";
            this._valueHelpDialogLoc = "";
            this._valueHelpDialogProd = "";
        },

        onRefresh: function () {
            that.onAfterRendering();
        },

        onLogPress: function (oEvent) {
            

            var step_no = parseInt(oEvent.getSource().getHeaderToolbar().getContent()[0].mAggregations.items[0].getText());
            var stepName = oEvent.getSource().getHeaderToolbar().getContent()[0].mAggregations.items[2].getText();
            var status = oEvent.getSource().getHeaderToolbar().getContent()[3].mAggregations.items[0].getText();

            var jobData = that.JobDetail;
            var Exists = jobData.filter(function (aComp) {
                return aComp.ACTIVITY_ID === stepName && parseInt(aComp.STEP_NO) === parseInt(step_no);
            });
            that.jobID = Exists[0].SUBJOB_ID;
            that.ActivityName = Exists[0].ACTIVITY_ID;

            that.ScheduleID = "";

            if (status !== "Not Triggered" && that.jobID !== "") {
                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").callFunction("/readJobDetails", {
                    method: "GET",
                    urlParameters: {
                        jobId: that.jobID,
                        displaySchedules: true,
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        var schedules = oData.readJobDetails.schedules;
                        var log = [];
                        that.generateLogs(log);

                        if (schedules.length === 1 && (schedules[0].cron === undefined || schedules[0].cron === "")) {
                            that.ScheduleID = oData.readJobDetails.schedules[0].scheduleId;
                            that.newoGModel.setProperty("/ScheduleTable", false);                                
                            that.getLogs();
                        } else {
                            that.newoGModel.setProperty("/ScheduleTable", true);
                            oData.readJobDetails.schedules.forEach(function (row) {
                                // if (!oData.readJobDetails.action.includes("DemandQty")) {
                                if (row.time) {
                                    if (row.time.includes("T")) {
                                        var dDate = row.time.split("T"),
                                            tTime = dDate[1].split(".")[0];

                                        row.time = dDate[0] + " " + tTime;
                                    }
                                }
                            }, that);
                            var aData = oData.readJobDetails.schedules;
                            if (aData.length > 0) {
                                that.timezone = that.oGModel.getProperty("/timezone");
                                aData.forEach(ele => {
                                    
                                    const targetTimeZone = that.timezone;
                                    var  originalDate = ele.nextRunAt;
                                    var  originalDate1 = ele.startTime;
                                    var  originalDate2 = ele.endTime;

                                    
                                    var date = that.formatter.gettimezone1(originalDate,that.timezone);
                                    var date1 = that.formatter.gettimezone1(originalDate1,that.timezone);
                                    var date2 = that.formatter.gettimezone1(originalDate2,that.timezone);

                                        ele.nextRunAt = date;
                                        ele.startTime = date1;
                                        ele.endTime = date2;
        
                                });

                                that.panelData.obj1 = [];
                                that.panelData.Main_obj1 = [];
                                that.panelData.obj2 = aData;
                                that.panelData.Main_obj2 = aData;
                                var Schedule = aData;
                                var log = [];
                                
                            } else {
                                
                                that.panelData.obj1 = [];
                                that.panelData.Main_obj1 = [];
                                that.panelData.obj2 = [];
                                that.panelData.Main_obj2 = [];
                                var log = [];
                                var Schedule = [];

                            }
                            that.panelData.obj1 = [];
                           
                                that.newClassModel.setData(that.panelData);
                                
                                    // that.generateLogs(log);
                                var oTableS = that.byId("idJobLogs1");
                                oTableS.destroyItems();
                            var log = that.runLog;
                            var model = oTableS.getModel();
                            var newData1 = {
                                items :Schedule
                            }
                            model.setProperty("/results", newData1.items);
                            oTableS.bindItems({
                                path : "/results",
                                template : new sap.m.ColumnListItem({
                                    cells:[
                                        new sap.m.Text({text:"{type}"}),
                                        new sap.m.Text({text:"{cron}"}),
                                        new sap.m.Text({text:"{time}"}),
                                        new sap.m.Text({text:"{nextRunAt}"}),
                                        new sap.m.Text({text:"{startTime}"}),
                                        new sap.m.Text({text:"{endTime}"}),
                                        new sap.m.Text({text:"{scheduleId}"})

                                    ]
                                })
                            })
                                that.byId("idJobLogs1").setSelectedItem(that.byId("idJobLogs1").getItems()[0], true);
                           
                            if (aData.length > 0) {
                                that.byId("idJobLogs1").setSelectedItem(that.byId("idJobLogs1").getItems()[0], true);
                                that.onScheduleClick();                
                              }
                        }
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Refresh to fetch data");
                    },
                });
            } else {
                // that.byId("idScheRunLogDatanew").destroyItems();
                that.panelData.obj1 = [];
                that.panelData.Main_obj1 = [];

                var log = [];
             
                    that.generateLogs(log);
    
                MessageToast.show("No log avaliable for the selected step");
            }
        },

        getLogs: function () {
            sap.ui.core.BusyIndicator.show();
            that.getModel("JModel").callFunction("/readJobRunLogs", {
                method: "GET",
                urlParameters: {
                    jobId: that.jobID,
                    scheduleId: that.ScheduleID,
                    page_size: 50,
                    offset: 0,
                },
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.results.length > 0) {
                        that.onRunlogs(oData.results);
                    }
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    // MessageToast.show("Failed to get Schedule data");
                },
            });
        },

        /**
         * This function is called when click on schedule run logs.
         */
        onRunlogs: function (Data) {

            var aData = Data;

            this.ScheRunLogModel = new JSONModel();
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

                        


            // if(aData.length === 1){

            that.runLog = $.parseJSON(aData[0].runText);
                            that.runLog.forEach(ele => {
                                var originalDate = ele.time;
                                var targetTimeZone = that.oGModel.getProperty("/timezone");
        
                                if(typeof ele.time === 'string'){
                                    originalDate = new Date(ele.time);
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
                                // return convertedDate
                                ele.time = convertedDate;

                        });

            // that.byId("idScheRunLogDatanew").setVisible(true);
            
            that.panelData.obj1 = that.runLog;
            that.panelData.Main_obj1 = that.runLog;

                        var log = that.runLog;
                        console.log (log);

                        that.generateLogs(log);


        },

        onSchedLogsClose: function () {

            this._ScheduleLogDialog.close();

        },
        onMultiSchedLogsClose: function () {

            that._MultiScheduleLogDialog.close();

        },

        /**
         * This function is called when click on status button to get the job run logs.
         * @param {object} oEvent -the event information.
         */
        onScheduleClick: function (oEvent) {

            var oJobId = that.jobID;
                // oScheId = sap.ui.getCore().byId("idJobLogs").getSelectedItems()[0].getBindingContext().getObject().scheduleId;
                if(oEvent){
                var oScheId = oEvent.getParameters().listItem.getCells()[6].getText();
                } else {
                    var oScheId =  that.byId("idJobLogs1").getSelectedItems()[0].getCells()[6].getText();
                }

            sap.ui.core.BusyIndicator.show();
            that.getModel("JModel").callFunction("/readJobRunLogs", {
                method: "GET",
                urlParameters: {
                    jobId: oJobId,
                    scheduleId: oScheId,
                    page_size: 50,
                    offset: 0,
                },
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    
                            that.timezone = that.oGModel.getProperty("/timezone");
                            oData.results.forEach(ele => {
                                    
                                const targetTimeZone = that.timezone;
                                var  originalDate = ele.scheduleTimestamp;
                                var  originalDate1 = ele.executionTimestamp;
                                var  originalDate2 = ele.completionTimestamp;
    
                                    var date = that.formatter.gettimezone1(originalDate,that.timezone);
                                    var date1 = that.formatter.gettimezone1(originalDate1,that.timezone);
                                    var date2 = that.formatter.gettimezone1(originalDate2,that.timezone);

                                        ele.scheduleTimestamp = date;
                                        ele.executionTimestamp = date1;
                                        ele.completionTimestamp = date2;
        
                                
                            });


                    that.ScheLogModel.setData({
                        statusresults: oData.results,
                    });
                    sap.ui.getCore().byId("idScheLogData").setSelectedItem(sap.ui.getCore().byId("idScheLogData").getItems()[0], true);
                    that.LogData = oData.results;
                    if (oData.results.length) {
                        that.onMultiRunlogs();
                    }
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Refresh to fetch data");
                },
            });
        },

        onMultiRunlogs: function (oEvent) {

            var aLogData = that.LogData;
            this.ScheRunLogModel = new JSONModel();

            that.runLog = $.parseJSON(aLogData[0].runText);

                            that.runLog.forEach(ele => {
                                var originalDate = ele.time;
                                var targetTimeZone = that.oGModel.getProperty("/timezone");
        
                                if(typeof ele.time === 'string'){
                                    originalDate = new Date(ele.time);
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
                                // return convertedDate
                                ele.time = convertedDate;

                        });

            // that.byId("idScheRunLogDatanew").setVisible(true);
            that.panelData.obj1 = that.runLog;
            that.panelData.Main_obj1 = that.runLog;

            var log = that.runLog
            that.generateLogs(log);
           

        },

        onStepPress: function (oEvent) {
            // var selStep = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID;
            // var jobData = that.JobDetail;
            // var Exists = jobData.filter(function (aComp) {
            //     return aComp.ACTIVITY_ID === selStep;
            // });

            if(oEvent.getSource().sId.includes("stepList")){
                var selStep = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID;
                var Step = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().STEP;
            } else {
                
                var selStep = oEvent.getSource().getHeaderToolbar().getContent()[0].mAggregations.items[2].getText();
                var Step = parseInt(oEvent.getSource().getHeaderToolbar().getContent()[0].mAggregations.items[0].getText());
                var currstep = parseInt(oEvent.getSource().getHeaderToolbar().getContent()[0].sId.split("idListPanel-")[1]);
                
                if(selStep !== "Activity"){
                if(that.panelStep !== undefined && that.panelStep !== parseInt(currstep)){
                    that.byId("idListPanel").getItems()[that.panelStep].getContent()[0].setExpanded(false);
                }
                that.panelStep = parseInt(currstep);
                if(oEvent.getParameters().expand === false){
                    that.panelData.obj1 = [];
                    that.panelData.Main_obj1 = [];
                    // that.byId("idScheRunLogDatanew").setVisible(false);
                    return;
                } else {
                    // that.byId("idScheRunLogDatanew").setVisible(false);
                }
            } else {
                that.byId("idListPanel").getItems()[0].getContent()[0].setExpanded(false);
                return;
            }
            }

            // var selStep = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID;
            // var Step = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject().STEP;
            var jobData = that.JobDetail;
            var Exists = jobData.filter(function (aComp) {
                return aComp.ACTIVITY_ID === selStep && parseInt(aComp.STEP_NO) === Step;
            });

            // // that.byId("idParameter").setVisible(true);

            // // Inputs Visible
            // that.byId("LOCATION").setVisible(false);
            // that.byId("DM_LOCATION").setVisible(false);
            // that.byId("PRODUCT").setVisible(false);
            // // that.byId("PARTIAL_PRODUCT").setVisible(false);
            // that.byId("MODEL_VERSION").setVisible(false);
            // that.byId("PREDICTION_PROFILE").setVisible(false);
            // that.byId("CUSTOMER_GROUP").setVisible(false);
            // that.byId("VERSION").setVisible(false);
            // that.byId("SCENARIO").setVisible(false);
            // that.byId("GEN_TYPE").setVisible(false);
            // that.byId("DATE_RANGE").setVisible(false);
            // that.byId("OPERATOR").setVisible(false);
            // that.byId("SINGLE_DATE").setVisible(false);
            // that.byId("Rolling_Timestamp").setVisible(false);
            // that.byId("OVERRIDE_ASSIGNMENT").setVisible(false);
            // that.byId("CRITICAL_ASSEMBLY").setVisible(false);
            // that.byId("IMPACT_ANALYSIS").setVisible(false);
            // that.byId("OptAlgorithm").setVisible(false);
            // that.byId("OptFactor").setVisible(false);
            // that.byId("DsAlgorithm").setVisible(false);

            // that.byId("DAILY").setVisible(false);

            // that.byId("SnapShot").setVisible(false);
            // that.byId("SnapR").setVisible(false);
            // that.byId("snapDesc").setVisible(false);

            // that.byId("MlocInput").setValue();
            // that.byId("DlocInput").removeAllTokens();
            // that.byId("CprodInput").setValue();
            // // that.byId("PprodInput").setValue();
            // // that.byId("MODEL_VERSION").setValue();
            // that.byId("PrePFInput").setValue();
            // that.byId("custGrpInput").setValue();
            // that.byId("idver").setValue();
            // that.byId("idscen").setValue();
            // // that.byId("GEN_TYPE").setValue();
            // that.byId("FromDate").setValue();
            // that.byId("ToDate").setValue();
            // that.byId("singleDt").setValue();
            // that.byId("idOverride").setSelected(false);
            // that.byId("idCritical").setSelected(false);
            // that.byId("idImpact").setSelected(false);

            // that.byId("idDaily").setSelected(false);
            // that.byId("idSnapShot").setSelected(false);
            // that.byId("idRolling").setSelected(false);

            // that.byId("CprodInput").removeAllTokens();

            that.newoGModel = that.getOwnerComponent().getModel("newoGModel");
            that.newoGModel1 = that.getOwnerComponent().getModel("newoGModel1");

            that.newoGModel.setProperty("/mloc", false);
            that.newoGModel.setProperty("/mlocvalue", "");
            that.newoGModel.setProperty("/dloc", false);
            that.newoGModel.setProperty("/dlocvalue", "");
            that.newoGModel.setProperty("/prod", false);
            that.newoGModel.setProperty("/prodvalue", "");
            that.newoGModel.setProperty("/modver", false);
            that.newoGModel.setProperty("/modvervalue", "");
            that.newoGModel.setProperty("/preprofile", false);
            that.newoGModel.setProperty("/preprofilevalue", "");
            that.newoGModel.setProperty("/freAlgo", false);
            that.newoGModel.setProperty("/foreAlgorithmvalue", "");
            that.newoGModel.setProperty("/class", false);
            that.newoGModel.setProperty("/classvalue", "");
            that.newoGModel.setProperty("/custgrp", false);
            that.newoGModel.setProperty("/custgrpvalue", "");
            that.newoGModel.setProperty("/week", false);
            that.newoGModel.setProperty("/weekvalue", "");
            that.newoGModel.setProperty("/version", false);
            that.newoGModel.setProperty("/versionvalue", "");
            that.newoGModel.setProperty("/scenario", false);
            that.newoGModel.setProperty("/scenariovalue", "");
            that.newoGModel.setProperty("/gentype", false);
            that.newoGModel.setProperty("/gentypevalue", "");
            that.newoGModel.setProperty("/overassm", false);
            that.newoGModel.setProperty("/overassmvalue", false);
            that.newoGModel.setProperty("/criassmb", false);
            that.newoGModel.setProperty("/criassmbvalue", false);
            that.newoGModel.setProperty("/impact", false);
            that.newoGModel.setProperty("/impactvalue", false);
            that.newoGModel.setProperty("/daily", false);
            that.newoGModel.setProperty("/dailyvalue", false);
            that.newoGModel.setProperty("/fullrun", false);
            that.newoGModel.setProperty("/fullrunvalue", false);
            that.newoGModel.setProperty("/operator", false);
            that.newoGModel.setProperty("/operatorvalue", "");
            that.newoGModel.setProperty("/daterange", false);
            that.newoGModel.setProperty("/fromvalue", "");
            that.newoGModel.setProperty("/tovalue", "");
            that.newoGModel.setProperty("/sdate", false);
            that.newoGModel.setProperty("/sdatevalue", "");
            that.newoGModel.setProperty("/optalgo", false);
            that.newoGModel.setProperty("/optalgovalue", "");
            that.newoGModel.setProperty("/optfact", false);
            that.newoGModel.setProperty("/optfactvalue", "");
            that.newoGModel.setProperty("/dsalgo", false);
            that.newoGModel.setProperty("/rolltime", false);
            that.newoGModel.setProperty("/rollingvalue", false);
            that.newoGModel.setProperty("/snap", false);
            that.newoGModel.setProperty("/snapdesvalue", "");
            that.newoGModel.setProperty("/optimization", false);
            that.newoGModel.setProperty("/OptiValue", false);
            that.newoGModel.setProperty("/POptProfile", false);
            that.newoGModel.setProperty("/PoptProfileValue", "");
            that.newoGModel.setProperty("/OptProfile", false);
            that.newoGModel.setProperty("/optProfileValue", "");

            Exists = JSON.parse(Exists[0].PARAM_VALUE);

           if(JSON.stringify(Exists) !== '{}'){


            if (Exists.MF_LOCATION_ID !== undefined) {
                that.byId("LOCATION").setVisible(true);
                that.byId("MlocInput").setValue(Exists.MF_LOCATION_ID);
                that.newoGModel.setProperty("/mloc", true);
                that.newoGModel.setProperty("/mlocvalue", Exists.MF_LOCATION_ID);
            } else {
                that.newoGModel.setProperty("/mloc", false);
                that.newoGModel.setProperty("/mlocvalue", "");
            }
            if (Exists.LOCATION_ID !== undefined) {
                that.byId("DlocInputJL").removeAllTokens();
                // if(Exists.LOCATION_ID !== Exists.MF_LOCATION_ID){
                that.byId("DM_LOCATIONJL").setVisible(true);
                that.newoGModel.setProperty("/dloc", true);
                var loc = [];
                if (Exists.LOCATION_ID.includes(",")) {
                     loc = Exists.LOCATION_ID.split(",");
                } else {
                     loc.push(Exists.LOCATION_ID);
                }
                that.newoGModel.setProperty("/dlocvalue", loc);

                    // loc.forEach(function (oItem) {
                    //     that.byId("DlocInputJL").addToken(
                    //         new sap.m.Token({
                    //             key: oItem,
                    //             text: oItem,
                    //             editable: false,

                    //         })
                    //     );
                    // });
                // }
                // else {
                //     that.newoGModel.setProperty("/dloc", true);
                // }

            } else {
                that.newoGModel.setProperty("/dloc", false);
                that.newoGModel.setProperty("/dlocvalue", "");
            }
            if (Exists.PRODUCT_ID !== undefined) {
                that.byId("PRODUCT").setVisible(true);
                that.newoGModel.setProperty("/prod", true);
                that.byId("CprodInputJL").setValue(Exists.PRODUCT_ID);                    
                    that.newoGModel.setProperty("/prodvalue", Exists.PRODUCT_ID);
                // if (Exists.PRODUCT_ID.includes(",")) {
                //     var prod = Exists.PRODUCT_ID.split(",");

                //     prod.forEach(function (oItem) {
                //         that.byId("CprodInputJL").addToken(
                //             new sap.m.Token({
                //                 key: oItem,
                //                 text: oItem,
                //                 editable: false,

                //             })
                //         );
                //     });
                // } else {

                //     that.byId("CprodInputJL").setValue(Exists.PRODUCT_ID);                    
                //     that.newoGModel.setProperty("/prodvalue", Exists.PRODUCT_ID);
                // }

            } else {
                that.newoGModel.setProperty("/prod", false);
                that.newoGModel.setProperty("/prodvalue", "");
            }

            if (Exists.MODEL_VERSION !== undefined) {
                that.byId("MODEL_VERSIONJL").setVisible(true);
                that.byId("idModelVerJL").setSelectedKey(Exists.MODEL_VERSION);
                that.newoGModel.setProperty("/modver", true);
                that.newoGModel.setProperty("/modvervalue", Exists.MODEL_VERSION);
            } else {
                that.newoGModel.setProperty("/modver", false);
                that.newoGModel.setProperty("/modvervalue", "");
            }

            if (Exists.PREDICTION_PROFILE !== undefined) {
                that.byId("PREDICTION_PROFILEJL").setVisible(true);
                that.byId("PrePFInputJL").setValue(Exists.PREDICTION_PROFILE);
                that.newoGModel.setProperty("/preprofile", true);
                that.newoGModel.setProperty("/preprofilevalue", Exists.PREDICTION_PROFILE);
            } else {
                that.newoGModel.setProperty("/preprofile", false);
                that.newoGModel.setProperty("/preprofilevalue", "");
            }

            if (Exists.FORECAST_ALGORITHM !== undefined) {
                that.byId("FORECAST_ALGORITHMJL").setVisible(true);
                that.byId("foreAlgInputJL").setValue(Exists.FORECAST_ALGORITHM);
                that.newoGModel.setProperty("/freAlgo", true);
                that.newoGModel.setProperty("/foreAlgorithmvalue", Exists.FORECAST_ALGORITHM);
            } else {
                that.newoGModel.setProperty("/freAlgo", false);
                that.newoGModel.setProperty("/foreAlgorithmvalue", "");
            }

            if (Exists.CLASS !== undefined) {
                that.byId("CLASSJL").setVisible(true);
                that.byId("classInputJL").setValue(Exists.CLASS);
                that.newoGModel.setProperty("/class", true);
                that.newoGModel.setProperty("/classvalue", Exists.CLASS);
            } else {
                that.newoGModel.setProperty("/class", false);
                that.newoGModel.setProperty("/classvalue", "");
            }

            if (Exists.CUSTOMER_GROUP !== undefined) {
                that.byId("CUSTOMER_GROUPJL").setVisible(true);
                that.byId("custGrpInputJL").setValue(Exists.CUSTOMER_GROUP);
                that.newoGModel.setProperty("/custgrp", true);
                that.newoGModel.setProperty("/custgrpvalue", Exists.CUSTOMER_GROUP);
            } else {
                that.newoGModel.setProperty("/custgrp", false);
                that.newoGModel.setProperty("/custgrpvalue", "");
            }

            if (Exists.HISTORY_WEEKS !== undefined) {
                that.byId("HISTORY_WEEKSJL").setVisible(true);
                that.byId("idWeeksJL").setValue(Exists.HISTORY_WEEKS);
                that.newoGModel.setProperty("/week", true);
                that.newoGModel.setProperty("/weekvalue", Exists.HISTORY_WEEKS);
            } else {
                that.newoGModel.setProperty("/week", false);
                that.newoGModel.setProperty("/weekvalue", "");
            }

            if (Exists.VERSION !== undefined) {
                that.byId("VERSIONJL").setVisible(true);
                that.byId("idverJL").setValue(Exists.VERSION);
                that.newoGModel.setProperty("/version", true);
                that.newoGModel.setProperty("/versionvalue", Exists.VERSION);
            } else {
                that.newoGModel.setProperty("/version", false);
                that.newoGModel.setProperty("/versionvalue", "");
            }

            if (Exists.SCENARIO !== undefined) {
                that.byId("SCENARIOJL").setVisible(true);
                that.byId("idscenJL").setValue(Exists.SCENARIO);
                that.newoGModel.setProperty("/scenario", true);
                that.newoGModel.setProperty("/scenariovalue", Exists.SCENARIO);
            } else {
                that.newoGModel.setProperty("/scenario", false);
                that.newoGModel.setProperty("/scenariovalue", "");
            }

            if (Exists.GEN_TYPE !== undefined) {

                that.byId("GEN_TYPEJL").setVisible(true);
                that.byId("GenidTypeJL").setSelectedKey(Exists.GEN_TYPE);
                that.newoGModel.setProperty("/gentype", true);
                that.newoGModel.setProperty("/gentypevalue", Exists.GEN_TYPE);
            } else {
                that.newoGModel.setProperty("/gentype", false);
                that.newoGModel.setProperty("/gentypevalue", "");
            }

            if (Exists.OVERRIDE_ASSIGNMENT !== undefined) {

                that.byId("OVERRIDE_ASSIGNMENTJL").setVisible(true);
                that.newoGModel.setProperty("/overassm", true);

                if (Exists.OVERRIDE_ASSIGNMENT === "true" || Exists.OVERRIDE_ASSIGNMENT === true) {
                    that.byId("idOverrideJL").setSelected(true);
                    that.newoGModel.setProperty("/overassmvalue", true);
                } else {
                    that.byId("idOverrideJL").setSelected(false);
                    that.newoGModel.setProperty("/overassmvalue", false);
                }
            } else {
                that.newoGModel.setProperty("/overassm", false);
                that.newoGModel.setProperty("/overassmvalue", false);
            }

            if (Exists.CRITICAL_ASSEMBLY !== undefined) {
                that.byId("CRITICAL_ASSEMBLYJL").setVisible(true);
                that.newoGModel.setProperty("/criassmb", true);
                if (Exists.CRITICAL_ASSEMBLY === "X" || Exists.CRITICAL_ASSEMBLY === true) {
                    that.byId("idCriticalJL").setSelected(true);
                    that.newoGModel.setProperty("/criassmbvalue", true);
                } else {
                    that.byId("idCriticalJL").setSelected(false);
                    that.newoGModel.setProperty("/criassmbvalue", false);
                }
            } else {
                that.newoGModel.setProperty("/criassmb", false);
                that.newoGModel.setProperty("/criassmbvalue", false);
            }

            if (Exists.IMPACT_ANALYSIS !== undefined) {
                that.byId("IMPACT_ANALYSISJL").setVisible(true);
                that.newoGModel.setProperty("/impact", true);
                if (Exists.IMPACT_ANALYSIS === "true" || Exists.IMPACT_ANALYSIS === true) {
                    that.byId("idImpactJL").setSelected(true);
                    that.newoGModel.setProperty("/impactvalue", true);
                } else {
                    that.byId("idImpactJL").setSelected(false);
                    that.newoGModel.setProperty("/impactvalue", false);
                }
            } else {
                that.newoGModel.setProperty("/impact", false);
                that.newoGModel.setProperty("/impactvalue", false);
            }

            if (Exists.DAILY !== undefined) {
                that.byId("DAILYJL").setVisible(true);
                that.newoGModel.setProperty("/daily", true);
                if (Exists.DAILY === "true" || Exists.DAILY === true) {
                    that.byId("idDailyJL").setSelected(true);
                    that.newoGModel.setProperty("/dailyvalue", true);
                } else {
                    that.byId("idDailyJL").setSelected(false);
                    that.newoGModel.setProperty("/dailyvalue", false);
                }
            } else {
                that.newoGModel.setProperty("/daily", false);
                that.newoGModel.setProperty("/dailyvalue", false);
            }

            if (Exists.FULL_RUN !== undefined) {
                that.byId("FULL_RUNJL").setVisible(true);
                that.newoGModel.setProperty("/fullrun", true);
                if (Exists.FULL_RUN === "true" || Exists.FULL_RUN === true) {
                    that.byId("idFullRunJL").setSelected(true);
                    that.newoGModel.setProperty("/fullrunvalue", true);
                } else {
                    that.byId("idFullRunJL").setSelected(false);
                    that.newoGModel.setProperty("/fullrunvalue", false);
                }
            } else {
                that.newoGModel.setProperty("/fullrun", false);
                that.newoGModel.setProperty("/fullrunvalue", false);
            }

            if (Exists.OPERATOR !== undefined) {
                that.byId("OPERATORJL").setVisible(true);
                that.byId("idOperatorJL").setValue(Exists.OPERATOR);
                that.newoGModel.setProperty("/operator", true);
                that.newoGModel.setProperty("/operatorvalue", Exists.OPERATOR);

            } else {
                that.newoGModel.setProperty("/operator", false);
                that.newoGModel.setProperty("/operatorvalue", "");
            }

            if (Exists.FROM_DATE !== undefined) {
                that.byId("DATE_RANGEJL").setVisible(true);
                that.newoGModel.setProperty("/daterange", true);
                that.byId("FromDateJL").setValue(Exists.FROM_DATE);
                that.byId("ToDateJL").setValue(Exists.TO_DATE);
                that.newoGModel.setProperty("/fromvalue", Exists.FROM_DATE);
                that.newoGModel.setProperty("/tovalue", Exists.TO_DATE);

            } else {
                that.newoGModel.setProperty("/daterange", false);
                that.newoGModel.setProperty("/fromvalue", "");
                that.newoGModel.setProperty("/tovalue", "");
            }

            if (Exists.SINGLE_DATE !== undefined) {
                that.byId("SINGLE_DATEJL").setVisible(true);
                that.newoGModel.setProperty("/sdate", true);
                that.byId("singleDtJL").setValue(Exists.SINGLE_DATE);
                that.newoGModel.setProperty("/sdatevalue", Exists.SINGLE_DATE);

            } else {
                that.newoGModel.setProperty("/sdate", false);
                that.newoGModel.setProperty("/sdatevalue", "");
            }

            if (Exists.Optimization !== undefined) {
                that.byId("OptimizationJL").setVisible(true);
                that.newoGModel.setProperty("/optimization", true);
                if (Exists.Optimization === "true" || Exists.Optimization === true) {
                    that.byId("PidOptimizationJL").setSelected(true);
                    that.newoGModel.setProperty("/OptiValue", true);
                } else {
                    that.byId("PidOptimizationJL").setSelected(false);
                    that.newoGModel.setProperty("/OptiValue", false);
                    
                }
            } else {
                that.newoGModel.setProperty("/optimization", false);
                that.newoGModel.setProperty("/OptiValue", false);
            }

            if(Exists.POptProfile !== undefined ){
                that.byId("POptProfileJL").setVisible(true);
                that.byId("PidOptProfileJL").setValue(Exists.POptProfile);
                that.newoGModel.setProperty("/POptProfile", true);
                that.newoGModel.setProperty("/PoptProfileValue", Exists.POptProfile);
                that.OptProfile = Exists.OptProfile;
            } else {
                that.newoGModel.setProperty("/POptProfile", false);
                that.newoGModel.setProperty("/PoptProfileValue", "");
            }

            if(Exists.OptProfile !== undefined ){
                that.byId("OptProfileJL").setVisible(true);
                // that.byId("PidOptAlgJL").setSelectedKey(Exists.OptProfile);
                that.newoGModel.setProperty("/OptProfile", true);
                that.newoGModel.setProperty("/optProfileValue", Exists.OptProfile);
                that.OptProfile = Exists.OptProfile;
            } else {
                that.newoGModel.setProperty("/OptProfile", false);
                that.newoGModel.setProperty("/optProfileValue", "");
            }

            // if(Exists.OptAlgorithm !== undefined ){
            //     that.byId("OptAlgorithmJL").setVisible(true);
            //     that.byId("PidOptAlgJL").setSelectedKey(Exists.OptAlgorithm);
            //     that.newoGModel.setProperty("/optalgo", true);
            //     that.newoGModel.setProperty("/optalgovalue", Exists.OptAlgorithm);
            //     that.OptAlgorithm = Exists.OptAlgorithm;
            // } else {
            //     that.newoGModel.setProperty("/optalgo", false);
            //     that.newoGModel.setProperty("/optalgovalue", "");
            // }
            // if(Exists.OptFactor !== undefined){
            //     that.byId("OptFactorJL").setVisible(true);
            //     that.byId("PidOptFctJL").setSelectedKey(Exists.OptFactor);
            //     that.newoGModel.setProperty("/optfact", true);
            //     that.newoGModel.setProperty("/optfactvalue", Exists.OptFactor);
            // } else {
            //     that.newoGModel.setProperty("/optfact", false);
            //     that.newoGModel.setProperty("/optfactvalue", "");
            // }
            // if(Exists.DsAlgorithm !== undefined){
            //     that.byId("DsAlgorithmJL").setVisible(true);
            //     that.byId("PidDSAlgJL").setSelectedKey(Exists.DsAlgorithm);
            //     that.newoGModel.setProperty("/dsalgo", true);
            // } else {
            //     that.newoGModel.setProperty("/dsalgo", false);
            // }


            if (Exists.Rolling !== undefined) {
                that.byId("Rolling_TimestampJL").setVisible(true);
                that.newoGModel.setProperty("/rolltime", true);
                if (Exists.Rolling === "true" || Exists.Rolling === true) {
                    that.byId("idRollingJL").setSelected(true);
                    that.newoGModel.setProperty("/rollingvalue", true);
                    that.byId("idRollingWeeksJL").setValue(Exists.Rolling_Timestamp);                    
                    that.newoGModel.setProperty("/rollingweeks", Exists.Rolling_Timestamp);
                } else {
                    that.byId("idRollingJL").setSelected(false);
                    that.newoGModel.setProperty("/rollingvalue", false);
                    
                }
            } else {
                that.newoGModel.setProperty("/rolltime", false);
                that.newoGModel.setProperty("/rollingvalue", false);
            }

            if (Exists.SnapShot !== undefined && Exists.SnapShot !== "") {
                that.byId("SnapShotJL").setVisible(true);
                that.byId("SnapRJL").setVisible(true);
                that.byId("snapDescJL").setVisible(true);
                that.newoGModel.setProperty("/snap", true);
                if (Exists.SnapShot === "C" ) {
                    that.byId("idSnapShotJL").setSelected(true);
                    that.byId("createJL").setSelected(true);
                    that.byId("idSnapDescJL").setValue(Exists.SnapShot_Desc);
                    that.newoGModel.setProperty("/snapdesvalue", Exists.SnapShot_Desc);
                } else if(Exists.SnapShot === "U") {
                    that.byId("idSnapShotJL").setSelected(true);
                    that.byId("updateJL").setSelected(true);
                    that.byId("idSnapDescJL").setValue(Exists.SnapShot_Desc);
                    that.newoGModel.setProperty("/snapdesvalue", Exists.SnapShot_Desc);
                    
                }
            } else {
                that.newoGModel.setProperty("/snap", false);
                that.newoGModel.setProperty("snapdesvalue/", "");
            }

        }

        that.onLogPress(oEvent);

        },

        OnOptAlgChange:function(){
            that.byId("PidOptAlgJL").setSelectedKey(that.OptAlgorithm);

        },

       

        onResumeJob: function (oEvent) {

            //Only resume If have access to all Data in template
            if(that.AllLocProdData.length>0){
                if(that.AllLocProdData.findIndex(f=>f.CREATE ==0) != -1){
                    return sap.m.MessageToast.show("Access to certain locations or products for this job is restricted")
                }
            }

            var actionText = "/jobs/resumeSetParallelJobs";
            var jobName = "Resume Job" + " " + new Date().getTime();

            var sequenceID = that.oGModel.getProperty("/seqId"),
                JobId = that.oGModel.getProperty("/jobid"),

                step = that.ResumeStep;
                var jobData = that.oGModel.getProperty("/jobData");
            var djSdate = new Date(),
                djEdate = new Date(new Date().setHours(new Date().getHours() + 3)),
                dsSDate = new Date(new Date().setSeconds(new Date().getSeconds() + 10)),
                dsEDate = new Date(new Date().setHours(new Date().getHours() + 3)),
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


            var dt = new Date();
            var startDate = new Date(that.JobStartTime);
            var EndDate = new Date(that.JobEndTime);

            var StartDate1 = new Date(that.ScheduleStartTime);
            var sEndDate1 = new Date(that.ScheduleEndTime);

            EndDate = new Date(EndDate.setDate(new Date(EndDate).getDate() + 1));            
            StartDate1 = new Date(StartDate1.setSeconds(new Date().getSeconds() + 10));
            sEndDate1 =  new Date(sEndDate1.setHours(new Date(EndDate).getHours() + 5)); 

            startDate = new Date(startDate.setTime(startDate.getTime() + (startDate.getTimezoneOffset() * 60 * 1000)));
            EndDate = new Date(EndDate.setTime(EndDate.getTime() + (EndDate.getTimezoneOffset() * 60 * 1000)));
            StartDate1 = new Date(StartDate1.setTime(StartDate1.getTime() + (StartDate1.getTimezoneOffset() * 60 * 1000)));
            sEndDate1 = new Date(sEndDate1.setTime(sEndDate1.getTime() + (sEndDate1.getTimezoneOffset() * 60 * 1000)));

        
            var padL = (nr, _len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

            var JStartDate =
                `${
                startDate.getFullYear()}-${
                    padL(startDate.getMonth()+1)}-${
                    padL(startDate.getDate())} ${
                    padL(startDate.getHours())}:${
                    padL(startDate.getMinutes())}:${
                    padL(startDate.getSeconds())}`
            var JEndDate =
                `${
                EndDate.getFullYear()}-${
                    padL(EndDate.getMonth()+1)}-${
                    padL(EndDate.getDate())} ${
                    padL(EndDate.getHours())}:${
                    padL(EndDate.getMinutes())}:${
                    padL(EndDate.getSeconds())}`
            var SStartDate =
                `${
                StartDate1.getFullYear()}-${
                    padL(StartDate1.getMonth()+1)}-${
                    padL(StartDate1.getDate())} ${
                    padL(StartDate1.getHours())}:${
                    padL(StartDate1.getMinutes())}:${
                    padL(StartDate1.getSeconds())}`
            var SEndDate =
                `${
                sEndDate1.getFullYear()}-${
                    padL(sEndDate1.getMonth()+1)}-${
                    padL(sEndDate1.getDate())} ${
                    padL(sEndDate1.getHours())}:${
                    padL(sEndDate1.getMinutes())}:${
                    padL(sEndDate1.getSeconds())}`




            var obj = {
                RECURRENCE_VALUE : new Date(that.ScheduleStartTime),
                RECURRENCE_VALUE_FORMAT : new Date(that.ScheduleStartTime),
                JOB_STARTTIME : JStartDate,
                JOB_ENDTIME : JEndDate,
                SCH_STARTTIME : SStartDate,
                SCH_ENDTIME : SEndDate,
                JOB_ID : JobId
            };

            var aData=[];
            aData.push(obj);


            var oData = {
                SEQUENCE_ID: JSON.stringify(sequenceID),
                JOB_ID: JobId,
                STEP: step
            }
            var finalList = {
                name: jobName,
                description: "Resume Job",
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
            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").callFunction("/genJobDetails", {
                method: "GET",
                urlParameters: {
                    Flag: "R",
                    JobDATA: JSON.stringify(aData)
                },
                success: function (oData) {
                    that.getOwnerComponent().getModel("JModel").callFunction("/addJobCreation", {
                        method: "GET",
                        urlParameters: {
                            jobDetails: JSON.stringify(finalList)
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Job resumed from the error step");
                            // that.oncloseResumeJob();
                            that.onNavBack();
        
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Failed to resume job");
                        },
                    });
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Failed to save");
                },
            });
            
            //             } else {
            //                 that.oGModel.setProperty("/EditFlag", "R");
            //                 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            //                 oRouter.navTo("CreateJob", {}, true);
            //             }

            //         }
            //     }
            // );

        },



        generateLogs:function(data){
            var log = data;
            var oTable = that.byId("idScheRunLogDatanew");
            oTable.destroyItems();
            // oTable.setValue(true);
            // var log = that.runLog;
            var model = oTable.getModel();
            var newData = {
                items :log
            }
            model.setProperty("/results", newData.items);
            oTable.bindItems({
                path : "/results",
                template : new sap.m.ColumnListItem({
                    cells:[
                        new sap.m.ObjectIdentifier({title: "{text}", text:"{time}"}),
                        new sap.m.ObjectIdentifier({title: "{type}", text:"{code}"}),

                    ]
                })
            })

        },

    });
});