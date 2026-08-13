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
function (BaseController, JSONModel, formatter, MessageToast, Filter, FilterOperator, library, Sorter, Dialog, Text, Button, MessageBox) {
    "use strict";
    var that, oGModel;

    return BaseController.extend("vcpapp.vcpjobschedulersequence.controller.CreateJob", {
        formatter: formatter,
        onInit: function () {
            that = this;
            // Declaring JSON Model and size limit
            that.oModel = new JSONModel();
            that.TemplateModel = new JSONModel();
            that.stepsModel = new JSONModel();
            that.TemplateModelSel = new JSONModel();
            this.MFlocModel = new JSONModel();
            this.locModel = new JSONModel();
            this.prodModel = new JSONModel();
            this.ppfModel = new JSONModel();
            this.verModel = new JSONModel();
            this.scenModel = new JSONModel();
            this.classModel = new JSONModel();
            this.MFlocModelUni = new JSONModel();
            
            this.custGroupModel = new JSONModel();

            that.oGModel = that.getOwnerComponent().getModel("oGModel");
            

            that.oModel.setSizeLimit(1000);
            that.TemplateModel.setSizeLimit(1000);
            that.stepsModel.setSizeLimit(1000);
            that.TemplateModelSel.setSizeLimit(1000);
            // that.locModel.setSizeLimit(1000);
            // that.prodModel.setSizeLimit(1000);
            that.ppfModel.setSizeLimit(1000);
            that.classModel.setSizeLimit(1000);
            that._oCore = sap.ui.getCore();
        },

        onAfterRendering: function () {
            //need to remove this line
            that.oGModel.setProperty("/auth", "I");
            if(that.oGModel.getProperty("/auth") === undefined || that.oGModel.getProperty("/auth") === null || 
            that.oGModel.getProperty("/auth") === ""){
                sap.ui.core.BusyIndicator.show();
                var flag = "";
                that.onBack("",flag);
                return;
            } else {
            that.TempParams = [];
            sap.ui.core.BusyIndicator.show();
            that.oGModel.setProperty("/CommonParam","");

            
            that.byId("idTempValue").setValue();
            that.byId("idJobname").setValue();
            that.byId("idJobSchtype").setSelectedKey("Im");
            that.byId("idWeek").setSelectedKey("0");
            that.byId("idyear").setValue();
            that.byId("idmnth").setValue();
            that.byId("iddate").setValue();
            that.byId("idhrs").setValue();
            that.byId("idmin").setValue();
            that.byId("idarrow").setVisible(false);
            that.byId("idParameter").setVisible(false);
            that.byId("idCronValues").setVisible(false);

            that.Edit = that.oGModel.getProperty("/EditFlag");
            that.EditData = that.oGModel.getProperty("/editData");
            that.byId("idarrowTitle").setText("");
            that.PublishFO = 0;
            that.JobData = [];
            that.tempIndex = "";

            that.typeData = {
                "Types": [{
                    "name": "Restrictions",
                    "key": "RT"
                }, {
                    "name": "Primary",
                    "key": "PI"
                }, {
                    "name": "Object Dependency",
                    "key": "OD"
                }]
            };

            that.CronValueTypes = [{
                    "Expression": "*",
                    "Usage": "anywhere",
                    "Value" : "Any Value",
                },{
                    "Expression": "*/a",
                    "Usage": "anywhere",
                    "Value" : "any a-th value",
                },{
                    "Expression": "a:b",
                    "Usage": "anywhere",
                    "Value" : "Values in the range a to b.",
                },{
                    "Expression": "a:b/c",
                    "Usage": "anywhere",
                    "Value" : "Every c-th value between a and b.",
                },{
                    "Expression": "a.y",
                    "Usage": "Day of the week",
                    "Value" : "On the a-th occurrence of the weekday y (a = -5 to 5)",
                },{
                    "Expression": "a,b,c",
                    "Usage": "anywhere",
                    "Value" : "a or b or c",
                },];

            var jmodel = new sap.ui.model.json.JSONModel(that.typeData);
            this.getView().byId("GenidType").setModel(jmodel);

            if (that.Edit === undefined) {
                that.Edit = "";
            }

            that.byId("JST").setVisible(false);
            that.byId("idJSTime").setVisible(false);
            that.byId("JET").setVisible(false);
            that.byId("idJETime").setVisible(false);
            that.byId("SST").setVisible(true);
            that.byId("idSSTime").setVisible(true);
            that.byId("SET").setVisible(false);
            that.byId("idSETime").setVisible(false);
            that.byId("idHelp").setVisible(false);
            that.byId("idJSTime").$().find('INPUT').attr('disabled', true);
            that.byId("idJETime").$().find('INPUT').attr('disabled', true);
            that.byId("idSSTime").$().find('INPUT').attr('disabled', true);
            that.byId("idSETime").$().find('INPUT').attr('disabled', true);

            that.byId("idJSTime").setMinDate(new Date());
            that.byId("idJETime").setMinDate(new Date());
            that.byId("idSSTime").setMinDate(new Date());
            that.byId("idSETime").setMinDate(new Date());

            that.byId("FromDate").setMinDate(new Date());
            that.byId("ToDate").setMinDate(new Date());
            that.byId("ToDate").setEditable(false);
            that.byId("FromDate").$().find('INPUT').attr('disabled', true);
            that.byId("ToDate").$().find('INPUT').attr('disabled', true);

            that.ClassData = [];

            if (that.Edit === "") {

                that.byId("CreateWizard").discardProgress(that.byId("CreateWizard").getSteps()[0]);
                this.byId("CreateWizard").invalidateStep(this.byId("TempTypeStep"));
                that.byId("TempTypeStep").setValidated(false);
                // this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                // that.byId("scheduleStep").setValidated(false);

                that.byId("idSSTime").setValue();
                that.byId("idSETime").setValue();
                that.byId("idJobname").setEditable(true);
                that.byId("idTempValue").setEditable(true);
                that.byId("idcreate").setVisible(true);
                that.byId("idUniversal").setVisible(true);

                that.byId("idupdate").setVisible(false);
                that.byId("idJobSchtype").setEnabled(true);
                // that.byId("ideditJob").setVisible(false);

            } else if (that.Edit === "X") {
                that.byId("page").setTitle("Update Job");
                that.byId("idJobname").setEditable(false);
                that.byId("idTempValue").setEditable(false);
                that.byId("idcreate").setVisible(false);
                that.byId("idUniversal").setVisible(false);
                that.byId("idupdate").setVisible(true);
                that.byId("idJobSchtype").setEnabled(false);
                // that.byId("ideditJob").setVisible(true);
            }

            that.getModel("JSModel").read("/readTemplates", {
                filters: [
                    new Filter("VARIANT_NAME", FilterOperator.EQ, "NA"),
                    // new Filter("TEMPLATE_ID", FilterOperator.EQ, TempId),
                ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.TemplateDetail = oData.results;

                    if(that.oGModel.getProperty("/auth") === "E"){
                        var tempData = oData.results.filter(obj => obj.LEVEL !== "I");
                    } else {
                        var tempData = oData.results
                    }
                    that.TemplateModel = new JSONModel();
                    that.TemplateModel.setData({
                        TemplateItems: tempData,
                    });
                    sap.ui.getCore().byId("TempSlctListJSS").setModel(that.TemplateModel);
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get templates data");
                },
            });

            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readActivityHeader", {
                // filters: [ new Filter( "TEMPLATE_ID", FilterOperator.EQ, SelValue )
                //         ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    that.ActivityHeader = oData.results;

                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get activities data");
                },
            });

            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readActivityItems", {
                filters: [ new Filter( "PARAMETER_ID", FilterOperator.NE, "" )
                        ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    that.ActivityItems = oData.results;
                    
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get activity item data");
                },
            });


             // Declaring Value Help Dialogs and Template Dialog
             
             if (!this._templateDialog) {
                 this._templateDialog = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.Templates",
                     this
                 );
                 this.getView().addDependent(this._templateDialog);
             }
             this._oCore = sap.ui.getCore();
 
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
 
             if (!this._valueHelpDialogPPF) {
                 this._valueHelpDialogPPF = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.PredDialog",
                     this
                 );
                 this.getView().addDependent(this._valueHelpDialogPPF);
             }
             if (!this._valueHelpDialogVer) {
                 this._valueHelpDialogVer = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.VersionDialog",
                     this
                 );
                 this.getView().addDependent(this._valueHelpDialogVer);
             }
             if (!this._valueHelpDialogScen) {
                 this._valueHelpDialogScen = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.ScenarioDialog",
                     this
                 );
                 this.getView().addDependent(this._valueHelpDialogScen);
             }
             if (!this._valueHelpDialog) {
                 this._valueHelpDialog = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.HelpText",
                     this
                 );
                 this.getView().addDependent(this._valueHelpDialog);
             }
 
             if (!this._valueHelpDialogClassDetails) {
                 this._valueHelpDialogClassDetails = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.ClassDialog",
                     this
                 );
                 this.getView().addDependent(this._valueHelpDialogClassDetails);
             }
 
             if (!this._valueHelpDialogCustGroup) {
                 this._valueHelpDialogCustGroup = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.CustGroupDialog",
                     this
                 );
                 this.getView().addDependent(this._valueHelpDialogCustGroup);
             }

             if (!this._valueHelpDialogMFLUni) {
                this._valueHelpDialogMFLUni = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.MFMulLocDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialogMFLUni);
            }

            that._valueHelpDialogProd.setTitleAlignment("Center");
            that._valueHelpDialogLoc.setTitleAlignment("Center");
            that._valueHelpDialogPPF.setTitleAlignment("Center");
            that._valueHelpDialogVer.setTitleAlignment("Center");
            that._valueHelpDialogScen.setTitleAlignment("Center");
            that._valueHelpDialogClassDetails.setTitleAlignment("Center");
            that._valueHelpDialogCustGroup.setTitleAlignment("Center");

            // this.oProdList = this._oCore.byId(
            //     this._valueHelpDialogProd.getId() + "-list"
            // );
            this.oProdList = this._oCore.byId("prodSlctListJSS");
            this.oMFLocList = this._oCore.byId(
                this._valueHelpDialogMFL.getId() + "-list"
            );
            // this.oLocList = this._oCore.byId(
            //     this._valueHelpDialogLoc.getId() + "-list"
            // );
            this.oLocList = this._oCore.byId("LocSlctListJSS");
            this.oPPFList = this._oCore.byId(
                this._valueHelpDialogPPF.getId() + "-list"
            );

            this.oVerList = this._oCore.byId(
                this._valueHelpDialogVer.getId() + "-list"
            );

            this.oScenList = this._oCore.byId(
                this._valueHelpDialogScen.getId() + "-list"
            );

            this.oClassList = this._oCore.byId(
                this._valueHelpDialogClassDetails.getId() + "-list"
            );

            this.oCustGroupList = this._oCore.byId(
                this._valueHelpDialogCustGroup.getId() + "-list"
            );

            this.oMFLocListUni = this._oCore.byId("MFLSlctListJSSMul");

            // Calling service to get the Location data
            // this.getModel("BModel").read("/getMfLocation", {
                this.getModel("BModel").read("/getMFMaster", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.ManuLocData = oData.results;

                    function removeDuplicate(array, key) {
                        var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                        that.MFLocData = removeDuplicate(oData.results, 'FACTORY_LOC');
                    that.MFlocModel.setData({
                        MFLocitems: that.MFLocData
                    });
                    that.oMFLocList.setModel(that.MFlocModel);
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get location data");
                },
            });
            // Calling service to get the Factory location, Demand loaction, config and partial products data
            this.getModel("BModel").read("/getfactorylocdesc", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.TotalDataUni = oData.results;

                    function removeDuplicate(array, key) {
                        var check = new Set();
                        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }

                    that.MFLocDataUni = removeDuplicate(oData.results, 'FACTORY_LOC');
                    
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get data");
                },
            });

            that.getModel("BModel").read("/getPlancfgPara", {
                filters: [
                    new Filter("PARAMETER_ID", FilterOperator.EQ, "20"),
                    new Filter("PARAMETER_ID", FilterOperator.EQ, "21"),
                ],
                success: function (oData) {
                    function removeDuplicate(array, key) {
                        var check = new Set();
                        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }

                    that.DefaultVersce = removeDuplicate(oData.results, 'PARAMETER_ID');
                   
                },
                error: function (oData, error) {
                    MessageToast.show("error");
                },
            });

// calling service to get the version scenario data
            this.getModel("BModel").read("/getVerScnmaster", {
                success: function (oData) {
                    that.VerSecData = oData.results;
                    function removeDuplicate(array, key) {
                        var check = new Set();
                        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }
                    that.verModel = new JSONModel();
                    that.verModel.setData({
                        results: removeDuplicate(oData.results, 'VERSION')
                    });

                    that.oVerList.setModel(that.verModel);
                },
                error: function (oData, error) {
                    MessageToast.show("error");
                },
            });
            // Calling service to get the Location data
            this.getModel("BModel").callFunction("/getAllLocProd", {
                method: "GET",
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.AllLocProdData = oData.results;
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get Products data");
                },
            });

        
            this.getModel("BModel").read("/getLocProdDetNew", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = JSON.parse(oData.getLocProdDetNew);
                    that.AllLocProdDataConf = data;
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get products data");
                },
            });

            
            // Calling service to get the Profiles data
            this.getModel("BModel").read("/getProfiles", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.PredictionData = oData.results;
                    that.ppfModel = new JSONModel();
                    that.ppfModel.setData(oData);
                    that._valueHelpDialogPPF.setModel(that.ppfModel);
                    // if(that.Edit === "X"){
                    // that.JobEdit();
                    // }
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get Prediction profiles data");
                },
            });


            sap.ui.core.BusyIndicator.show();
            // Calling service to get the Customer data
            this.getModel("BModel").read("/getProdClass", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                        that.ClassData = oData.results;                        
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                },
            });

           

            if (that.Edit === "X") {
                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readJobDetailsLogs", {
                    filters: [
                        new Filter("JOB_ID", FilterOperator.EQ, that.EditData.JOB_ID),
                    ],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.JobData = oData.results;
                        if (oData.results[0].JOB_TYPE === "Recurrence Pattern") {
                            // that.byId("JST").setVisible(true);
                            // that.byId("idJSTime").setVisible(true);
                            // that.byId("JET").setVisible(true);
                            // that.byId("idJETime").setVisible(true);
                            that.byId("SST").setVisible(true);
                            that.byId("idSSTime").setVisible(true);
                            that.byId("SET").setVisible(true);
                            that.byId("idSETime").setVisible(true);
                        }
                        var filt = that.oGModel.getProperty("/CommonFilter");
                        if(filt === "X"){
                            that.CommonFilEdit();
                        } else {
                            that.JobEdit();
                        }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get job details data");
                    },
                });

            }
        }

        },

        onBack: function () {
            sap.ui.core.BusyIndicator.hide();
            if(this._templateDialog){
                 that.destroy();
            }
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Home", {}, true);

        },

        destroy: function(){
            this._templateDialog.destroy();
            this._valueHelpDialogMFL.destroy();
            this._valueHelpDialogLoc.destroy();
            this._valueHelpDialogProd.destroy();
            this._valueHelpDialogPPF.destroy();
            this._valueHelpDialogVer.destroy();
            this._valueHelpDialogScen.destroy();
            this._valueHelpDialog.destroy();
            this._valueHelpDialogClassDetails.destroy();
            this._valueHelpDialogCustGroup.destroy();


            this._templateDialog = "";
            this._valueHelpDialogMFL = "";
            this._valueHelpDialogLoc = "";
            this._valueHelpDialogProd = "";
            this._valueHelpDialogPPF = "";
            this._valueHelpDialogVer = "";
            this._valueHelpDialogScen = "";
            this._valueHelpDialog = "";
            this._valueHelpDialogClassDetails = "";
            this._valueHelpDialogCustGroup = "";
        },

        JobEdit: function () {
            var data = that.oGModel.getProperty("/editData");

            that.byId("idTempValue").setValue(that.JobData[0].TEMPLATE_ID);
            that.byId("idJobname").setValue(data.JOB_NAME);
            that.onJobnamevalidation();

            // var i = aSelectedScen[0].mBindingInfos.title.binding.oContext.sPath.split("/TemplateItems/")[1];
            // that.MaxStep = that.TemplateDetail[i].STEPS;
            that.MaxStep = data.TOTAL_STEPS;
            that.onSelTemp();
            that.onRecurrence();

            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readTemplateItems", {
                filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, that.JobData[0].TEMPLATE_ID),
                          new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                        ], and:true,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    that.TemplateItems = oData.results;
                    that.TemplateItems = that.TemplateItems.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                    var temp = that.TemplateItems.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS";
                    });
                    that.MaxStep = that.TempParams.length;
                    that.divideDatatoSend();

                    if (temp.length > 0) {
                        that.getUserData();
                    }

                    if (that.byId("CreateWizard")._aStepPath.length === 3) {
                        that.onValidation();
                    }

                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get template items data");
                },
            });

            var parameters = [];
            that.JobData = that.JobData.sort((a, b) => a.STEP - b.STEP);
            var tempData = [];

            for (var i = 0; i < that.JobData.length; i++) {

                var data = JSON.parse(that.JobData[i].PARAM_VALUE);
                // if(data.length !== undefined){

                if (that.JobData[i].PARAM_VALUE !== "{}") {
                    var paramObj = {
                        "TEMPLATE_ID": that.JobData[i].TEMPLATE_ID,
                        "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID,
                        "STEP": that.JobData[i].STEP,
                        "ACT_POSITION": that.JobData[i].STEP
                    }

                    Object.entries(data).forEach(x => {
                        var test = x[0];

                        if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID") {
                            var tempobj = {
                                [test]: x[1]
                            }
                        }
                        paramObj = {
                            ...paramObj,
                            ...tempobj
                        }

                    })
                    // that.TempParams.push(paramObj);
                    tempData.push(paramObj);
                } else {
                    var paramObj = {
                        "TEMPLATE_ID": that.JobData[i].TEMPLATE_ID,
                        "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID
                    }
                    // that.TempParams.push(paramObj);
                    tempData.push(paramObj);
                }
            }


            tempData.forEach(function(el,i){
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === el.ACTIVITY_ID);

                if(index === -1){
                    that.TempParams.push(tempData[i]);
                } else {
                                        
                Object.entries(el).forEach(x => {
                    if(x[0] === "LOCATION_ID" ){
                        if(!that.TempParams[index].LOCATION_ID.includes(x[1])){
                        that.TempParams[index].LOCATION_ID = that.TempParams[index].LOCATION_ID + "," + x[1];
                        }
                        if(that.TempParams[index].LOCATION_ID === that.TempParams[index].MF_LOCATION_ID){
                            delete that.TempParams[index].LOCATION_ID;
                        }

                    } else if(x[0].includes("PRODUCT")){
                        var isArray = Array.isArray(that.TempParams[index].PRODUCT_ID);
                            if(isArray){
                                if(!that.TempParams[index].PRODUCT_ID.includes("ALL")){
                                that.TempParams[index].PRODUCT_ID = that.TempParams[index].PRODUCT_ID.toString() + "," + x[1].toString();
                                }1
                            } else {
                                if(!that.TempParams[index].PRODUCT_ID.includes("ALL")){
                                that.TempParams[index].PRODUCT_ID = that.TempParams[index].PRODUCT_ID + "," + x[1];
                                }
                            }
                            
                    }

                })
                }
            })
            that.TempParams.forEach(function(el,s){
                el.STEP = s + 1;
                el.ACT_POSITION = s + 1;
                el.LOCATION_ID = el.LOCATION_ID.split(",");
                el.PRODUCT_ID = el.PRODUCT_ID.split(",");
            });

        },

        getUserData: function () {
            /** Get Valid CF Auth Token and Configured User in Destination for S4D */
            that.getModel("BModel").callFunction("/getCFAuthToken", {
                method: "GET",

                success: function (oData, oResponse) {
                    that.authToken = oResponse.data.getCFAuthToken;
                    that.getCFDestinationUser(that.authToken);
                },
                error: function (oResponse) {
                    sap.m.MessageToast.show("Failed to get Destination User!");
                },
            });
            that.getModel("BModel").callFunction("/getUserInfo", {
                method: "GET",
                success: function (oData, oResponse) {
                    // sap.m.MessageToast.show(oResponse.data.getUserInfo);
                    that.sUserId = oResponse.data.getUserInfo;
                },
                error: function (oResponse) {
                    sap.m.MessageToast.show("Failed to get User Info!");
                },
            });
        },

        /** Get CF Configured Destination User */
        getCFDestinationUser: function (sauthToken) {
            that.getModel("BModel").callFunction("/getCFDestinationUser", {
                method: "GET",
                urlParameters: {
                    TOKEN: sauthToken,
                },
                success: function (oData, oResponse) {
                    that.sCFUserDestination = oResponse.data.getCFDestinationUser;
                    if (that.sCFUserDestination) {
                        that.sCFUserDestination = that.sCFUserDestination.toUpperCase();
                    }
                },
                error: function (oResponse) {
                    sap.m.MessageToast.show("Failed to get Destination User!");
                },
            });
        },

        /**
         * This function is called when chnaging the Recurring Schedule data.
         */
        onJobTypeChange: function (oEvent) {
            var selKey = that.byId("idJobSchtype").getSelectedKey();

            if (selKey === "Im") {

                that.byId("idCronValues").setVisible(false);
                that.byId("LidOccurrenceF").setVisible(false);

                that.byId("idHelp").setVisible(false);

                that.byId("JST").setVisible(false);
                that.byId("idJSTime").setVisible(false);
                that.byId("JET").setVisible(false);
                that.byId("idJETime").setVisible(false);
                that.byId("SST").setVisible(true);
                that.byId("idSSTime").setVisible(true);
                that.byId("SET").setVisible(false);
                that.byId("idSETime").setVisible(false);

            } else if (selKey === "Cr") {
                // that.byId("idSchTime").setVisible(false);
                that.byId("idCronValues").setVisible(true);
                that.byId("LidOccurrenceF").setVisible(false);
                that.byId("idHelp").setVisible(true);

                that.byId("SST").setVisible(true);
                that.byId("idSSTime").setVisible(true);
                that.byId("SET").setVisible(true);
                that.byId("idSETime").setVisible(true);

            }
            if (oEvent) {
                that.onValidation();
            }

            if (selKey === "Cr") {
                if (that.TemplateItems[0].ACTIVITY_ID === "DYNAMIC_FROZEN") {
                    that.byId("idCronValues").setVisible(false);
                    that.byId("LidOccurrenceF").setVisible(true);
                    that.byId("idOccurrence").setVisible(true);
                    var temp = new Date(new Date().setDate(new Date().getDate() + 32));
                    that.byId("idJETime").setDateValue(temp);
                    var tempsc = new Date(new Date().setDate(new Date().getDate() + 31));
                    that.byId("idSETime").setDateValue(tempsc);
                    this.byId("CreateWizard").validateStep(this.byId("scheduleStep"));
                    that.byId("scheduleStep").setValidated(true);
                }

            }
        },
        onHelpPress: function () {
            that.help = new JSONModel();
            that.help.setData({results:that.CronValueTypes});
            sap.ui.getCore().byId("idCronValues").setModel(that.help);
            that._valueHelpDialog.open();

        },

        onCloseHelp: function () {
            that._valueHelpDialog.close();
        },

        RadioSelect: function () {
            var radioSel = that.byId("idOccurrence").getSelectedButton().getText();
            that.byId("idWeekF").setSelectedKey("0");
            if (radioSel === "Daily") {
                that.byId("LidWeek").setVisible(false);
                that.byId("idWeekF").setVisible(false);

                var temp = new Date(new Date().setDate(new Date().getDate() + 32));
                that.byId("idJETime").setDateValue(temp);

                var newDate1 = that.byId("idSSTime").getDateValue().toString();
                var newDate = new Date(newDate1);

                var idSchTime = newDate.setSeconds(newDate.getSeconds() + 5);
                idSchTime = new Date(idSchTime);
                that.byId("idSSTime").setDateValue(idSchTime);

                var newSEdate = new Date(newDate1);
                var idSETime = newSEdate.setDate(newSEdate.getDate() + 31);
                idSETime = new Date(idSETime);
                that.byId("idSETime").setDateValue(idSETime);

            } else if (radioSel === "Weekly") {
                that.byId("LidWeek").setVisible(true);
                that.byId("idWeekF").setVisible(true);
                that.byId("idWeekF").setSelectedKey("0");

                var idJSTime = new Date();
                var idJETime = new Date(new Date().setDate(new Date().getDate() + 1));
                // var idSchTime = new Date().setMinutes(new Date().getMinutes() + 1);
                var idSchTime = new Date().setSeconds(new Date().getSeconds() + 5);
                var idSETime = new Date().setHours(new Date().getHours() + 5);
                idSchTime = new Date(idSchTime);
                idSETime = new Date(idSETime);

                that.byId("idJSTime").setDateValue(idJSTime);
                that.byId("idJETime").setDateValue(idJETime);
                that.byId("idSSTime").setDateValue(idSchTime);
                that.byId("idSETime").setDateValue(idSETime);
            }

        },

        onWeek: function (oEvent) {
            var selWeek = that.byId("idWeekF").getSelectedKey();
            if (selWeek !== "0") {
                var calDate = parseInt(selWeek) - 1;

                var currDate = new Date().getDay();
                var day = calDate - currDate;

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
                that.byId("idSSTime").setDateValue(idSchTime);

                var idSETime = newDate.setHours(newDate.getHours() + 5);
                idSETime = new Date(idSETime);
                that.byId("idSETime").setDateValue(idSETime);

                var jobEndDate = new Date(new Date().setDate(new Date().getDate() + 1));

                var temp = new Date(tempnewDate.setDate(tempnewDate.getDate() + 1));
                that.byId("idJETime").setDateValue(temp);
            }

        },

        onSchTimeChange: function (oEvent) {

            if (that.TemplateItems[0].ACTIVITY_ID === "DYNAMIC_FROZEN") {
                var selbutton = that.byId("idOccurrence").getSelectedButton().getText();
                var id = oEvent.getParameters().id;
                if (selbutton !== "Daily") {
                    if (id.includes("idSSTime")) {
                        var selectedDate = that.byId("idSSTime").getDateValue().getDay();

                        var selWeek = that.byId("idWeekF").getSelectedKey();
                        if (selWeek !== "0") {
                            var calDate = parseInt(selWeek) - 1;
                        }

                        if (calDate !== selectedDate) {
                            sap.m.MessageToast.show("Please select date according with the selected week.");
                            that.onWeek();
                        } else {
                            var selWeek = that.byId("idWeekF").getSelectedKey();
                            if (selWeek !== "0") {
                                var calDate = parseInt(selWeek) - 1;
                            }

                            var SchNewDate = that.byId("idSSTime").getDateValue().toString();
                            var tempnewDate = new Date(SchNewDate);

                            var temp = new Date(tempnewDate.setDate(tempnewDate.getDate() + 1));
                            that.byId("idJETime").setDateValue(temp);

                            var newDate = new Date(SchNewDate);
                            // newDate = new Date(newDate.setDate(newDate.getDate() - 1));

                            var idSchTime = newDate.setSeconds(newDate.getSeconds() + 5);
                            idSchTime = new Date(idSchTime);
                            var newdateend = new Date(idSchTime);
                            that.byId("idSSTime").setDateValue(idSchTime);

                            var idSETime = newdateend.setHours(newdateend.getHours() + 5);
                            idSETime = new Date(idSETime);
                            that.byId("idSETime").setDateValue(idSETime);
                        }
                    } else {
                        var sEndTime = that.byId("idSETime").getDateValue().toString();
                        var newDate = new Date(sEndTime);
                        var temp = new Date(newDate.setDate(newDate.getDate() + 1));
                        that.byId("idJETime").setDateValue(temp);
                    }
                } else {
                    if (oEvent.getParameters().id.includes("idSSTime")) {
                        var newdateTest = that.byId("idSSTime").getDateValue().toString();
                        var newdate = new Date(newdateTest);
                        var temp = new Date(newdate.setDate(newdate.getDate() + 32));
                        that.byId("idJETime").setDateValue(temp);

                        var newSEdate = new Date(newdateTest);
                        var idSETime = newSEdate.setDate(newSEdate.getDate() + 31);
                        idSETime = new Date(idSETime);
                        that.byId("idSETime").setDateValue(idSETime);
                    }
                }
            } else {

                var sTime = that.byId("idSSTime").getDateValue().toString();
                var temp = new Date(sTime);
                // var eTime = that.byId("idSETime").getDateValue();
                var id = oEvent.getParameters().id;
                if (id.includes("idSSTime")) {
                    var eTime = new Date(temp.setHours(temp.getHours() + 5));
                } else {
                    var eTime = that.byId("idSETime").getDateValue();
                }
               
                that.byId("idSETime").setDateValue(eTime);
                var JsTime = that.byId("idJSTime").getDateValue();
                var JeTime = that.byId("idJETime").getDateValue();

                if (JeTime < eTime) {
                    that.byId("idJETime").setDateValue(eTime);
                }
            }
        },

        onSelTemp: function () {
            if (that.byId("idTempValue").getValue() !== "" && that.byId("idJobname").getValue() !== "") {
                this.byId("CreateWizard").validateStep(this.byId("TempTypeStep"));
                that.byId("TempTypeStep").setValidated(true);

                if (that.Edit !== "X") {
                    that.byId("idcreate").setVisible(true);
                    that.byId("idupdate").setVisible(false);
                } else {
                    that.byId("idcreate").setVisible(false);
                    that.byId("idupdate").setVisible(true);
                }
                that.byId("idUniversal").setVisible(true);
                this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                that.byId("scheduleStep").setValidated(false);

            } else {
                this.byId("CreateWizard").invalidateStep(this.byId("TempTypeStep"));
                that.byId("TempTypeStep").setValidated(false);
                if (that.Edit !== "X") {
                    that.byId("idcreate").setVisible(false);
                    that.byId("idupdate").setVisible(false);
                } else {
                    that.byId("idcreate").setVisible(false);
                    that.byId("idupdate").setVisible(false);
                }
                that.byId("idUniversal").setVisible(false);
            }

            // if(that.Edit !== "X"){
            // var dDate = new Date();
            var idJSTime = new Date();
            var idJETime = new Date(new Date().setDate(new Date().getDate() + 1));
            // var idSchTime = new Date().setMinutes(new Date().getMinutes() + 1);
            var idSchTime = new Date().setSeconds(new Date().getSeconds() + 5);
            var idSETime = new Date().setHours(new Date().getHours() + 5);
            idSchTime = new Date(idSchTime);
            idSETime = new Date(idSETime);

            that.byId("idJSTime").setDateValue(idJSTime);
            that.byId("idJETime").setDateValue(idJETime);
            that.byId("idSSTime").setDateValue(idSchTime);
            that.byId("idSETime").setDateValue(idSETime);
            that.onJobnamevalidation();

        },

        onRecurrence: function () {
            if (that.byId("idTempValue").getValue() !== "") {
                this.byId("CreateWizard").validateStep(this.byId("scheduleStep"));
                that.byId("scheduleStep").setValidated(true);

                // that.byId("TempTypeStep")._oNextButton.setText("Parameters");

                if (that.Edit !== "X") {
                    that.byId("idcreate").setVisible(true);
                    that.byId("idupdate").setVisible(false);
                } else {
                    that.byId("idcreate").setVisible(false);
                    that.byId("idupdate").setVisible(true);
                }
                that.byId("idUniversal").setVisible(true);
            } else {
                this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                that.byId("scheduleStep").setValidated(false);

                this.byId("CreateWizard").invalidateStep(this.byId("TempTypeStep"));
                that.byId("TempTypeStep").setValidated(false);

                if (that.Edit !== "X") {
                    that.byId("idcreate").setVisible(false);
                    that.byId("idupdate").setVisible(false);
                } else {
                    that.byId("idcreate").setVisible(false);
                    that.byId("idupdate").setVisible(false);
                }
                that.byId("idUniversal").setVisible(false);
            }

            if (that.byId("idTempValue").getValue() !== "") {
                var selTemplate = that.TemplateDetail.filter(function (aComp) {
                    return aComp.TEMPLATE_ID === that.byId("idTempValue").getValue();
                });
            }

            if (selTemplate.length === 0) {
                MessageToast.show("Template assigned to the JOb is not avaliable or Deleted");
                return;
            }
        },

        onValidation: function () {
            var oJobschType = that.byId("idJobSchtype").getSelectedKey();
            var SChType = "X";
            if (oJobschType === "Cr") {
                if (that.TemplateItems[0].ACTIVITY_ID === "DYNAMIC_FROZEN") {
                    SChType = "X";
                } else {
                    var mnth = that.byId("idmnth").getValue(),
                        date = that.byId("iddate").getValue(),
                        day = that.byId("idWeek").getSelectedKey(),
                        hour = that.byId("idhrs").getValue(),
                        min = that.byId("idmin").getValue();

                    if ((mnth === "" && date === "" && day === "0" && hour === "" && min === "") ||
                        (mnth === undefined && date === undefined && day === "0" && hour === undefined && min === undefined)) {
                        SChType = "";
                    }
                }
            }
            if (SChType === "X") {
                this.byId("CreateWizard").validateStep(this.byId("scheduleStep"));
                that.byId("scheduleStep").setValidated(true);

                // this.byId("CreateWizard").validateStep(this.byId("idParameters"));
                // that.byId("idParameters").setValidated(true);
                this.byId("CreateWizard").invalidateStep(this.byId("idParameters"));
                that.byId("idParameters").setValidated(false);

                that.byId("idarrow").setVisible(true);
                that.byId("idParameter").setVisible(true);

                var MaxSteps = that.TemplateItems.filter(function (aComp) {
                    return aComp.TEMPLATE_ID === that.byId("idTempValue").getValue();
                });

                if (MaxSteps.length > 0) {
                    that.onStepName(MaxSteps[0].ACTIVITY_ID, MaxSteps[0].ACT_POSITION, MaxSteps[0].STEP_NAME);
                } else {
                    MessageToast.show("Cannot display data");
                    that.byId("idParameter").setVisible(false);
                    return;
                }

                if (that.Edit !== "X") {
                    that.byId("idcreate").setVisible(true);
                    that.byId("idupdate").setVisible(false);
                } else {
                    that.byId("idcreate").setVisible(false);
                    that.byId("idupdate").setVisible(true);
                }
                that.byId("idUniversal").setVisible(true);
            } else {
                this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                that.byId("scheduleStep").setValidated(false);

                this.byId("CreateWizard").invalidateStep(this.byId("idParameters"));
                that.byId("idParameters").setValidated(false);

                that.byId("idarrow").setVisible(false);
                that.byId("idParameter").setVisible(false);
                MessageToast.show("Please maintain valid data");
                that.byId("idcreate").setVisible(false);
                that.byId("idUniversal").setVisible(false);
            }

        },

        // Changing the parameters tab based on selected step in view
        onStepName: function (activity, step, stepname) {

            var selACTivityStep = activity,
                stepname = stepname,
                step = step;

            // Inputs Visible
            that.byId("MF_LOCATION").setVisible(false);
            that.byId("DM_LOCATION").setVisible(false);
            that.byId("CONFIG_PRODUCT").setVisible(false);
            that.byId("PARTIAL_PRODUCT").setVisible(false);
            that.byId("MODEL_VERSION").setVisible(false);
            that.byId("PREDICTION_PROFILE").setVisible(false);
            that.byId("VERSION").setVisible(false);
            that.byId("SCENARIO").setVisible(false);
            that.byId("CLASS").setVisible(false);
            that.byId("CUSTOMER_GROUP").setVisible(false);
            that.byId("GEN_TYPE").setVisible(false);
            that.byId("DATE_RANGE").setVisible(false);
            that.byId("SINGLE_DATE").setVisible(false);
            that.byId("OPERATOR").setVisible(false);
            that.byId("Rolling_Timestamp").setVisible(false);
            that.byId("OVERRIDE_ASSIGNMENT").setVisible(false);
            that.byId("CRITICAL_ASSEMBLY").setVisible(false);
            that.byId("IMPACT_ANALYSIS").setVisible(false);
            that.byId("DAILY").setVisible(false);
            that.byId("OptAlgorithm").setVisible(false);
            that.byId("OptFactor").setVisible(false);
            that.byId("DsAlgorithm").setVisible(false);
            that.byId("SnapShot").setVisible(false);
            that.byId("SnapR").setVisible(false);
            that.byId("snapDesc").setVisible(false);
            that.byId("HISTORY_WEEKS").setVisible(false);

            that.byId("MFLInput").setValue();
            that.byId("DlocInput").setValue();
            that.byId("CprodInput").setValue();
            that.byId("PprodInput").setValue();
            // that.byId("MODEL_VERSION").setValue();
            that.byId("PrePFInput").setValue();
            that.byId("idver").setValue();
            that.byId("idscen").setValue();
            that.byId("classInput").setValue();
            that.byId("custGrpInput").setValue();
            that.byId("FromDate").setValue();
            that.byId("ToDate").setValue();
            that.byId("singleDt").setValue();
            that.byId("idRollingWeeks").setValue();
            that.byId("idSnapDesc").setValue();
            that.byId("idWeeks").setValue();
            that.byId("idOverride").setSelected(false);
            that.byId("idCritical").setSelected(false);
            that.byId("idImpact").setSelected(false);
            that.byId("idDaily").setSelected(false);
            that.byId("idSnapShot").setSelected(false);
            that.byId("idRolling").setSelected(false);

            that.byId("CprodInput").removeAllTokens();
            that.byId("PprodInput").removeAllTokens();

            var aData = that.ActivityItems;

            that.filterActivites = aData.filter(function (aComp) {
                return aComp.ACTIVITY_ID === selACTivityStep;
            });

            var Exists = [];
            if (that.TempParams.length > 0) {
                Exists = that.TempParams.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === selACTivityStep && aComp.ACT_POSITION === step;
                });
            }

            if (selACTivityStep === "PUBLISH_FORECAST_ORDERS") {
                that.byId("idModelVer").setEditable(false);
            } else {
                that.byId("idModelVer").setEditable(true);
            }

            if(selACTivityStep === "STATFORECAST_FOR_CHAR_VALUES"){
                that.typeData = {
                    "Types": [{
                        "name": "Primary",
                        "key": "PI"
                    }]
                };
            
            var jmodel = [];
            jmodel = new sap.ui.model.json.JSONModel(that.typeData);

            that.getView().byId("GenidType").setModel(jmodel);
            } else {
                
            }

            for (var i = 0; i < that.filterActivites.length; i++) {
                var id = that.filterActivites[i].PARAMETER_ID
                if(id !== "" && id !== " " && id !== undefined && id !== null){

                
                that.byId(id).setVisible(true);

                if (Exists.length === 0) {
                    var input = that.byId(id).getFields()[0].sId.split("--")[2];
                    if (id === "OVERRIDE_ASSIGNMENT" || id === "CRITICAL_ASSEMBLY" || id === "IMPACT_ANALYSIS" || 
                        id === "DAILY" || id === "SnapShot" ) {
                        that.byId(input).setSelected(false);
                    } else if(id === "Rolling_Timestamp"){
                        that.byId("idRolling").setSelected(false);
                        that.byId("idRollingWeeks").setValue();
                    } else if (id !== "MODEL_VERSION" && id !== "GEN_TYPE") {
                        that.byId(input).setValue();
                    }
                    if (that.filterActivites[i].OPTION_SELECT === "M") {
                        that.byId(input).removeAllTokens();
                    }
                }

                
                if (Exists.length > 0) {
                    var input = that.byId(id).getFields()[0].sId.split("--")[2];

                    if(id.includes("MF_LOCATION")){

                        if(that.filterActivites[i].OPTION_SELECT === "S"){
                            that.byId(input).setValue(Exists[0].MF_LOCATION_ID);

                        } 
                        
                        if(selACTivityStep.includes("PREDICTION") || selACTivityStep.includes("MODEL_GENERATION") ){
                            if(Exists[0].MF_LOCATION_ID !== ""){
                            that.PlancfgPara(Exists[0].MF_LOCATION_ID, Exists[0].GEN_TYPE);
                            }
                        }
                            if (that.filterActivites[i].MANDATORY === "Y") {
                                that.byId("MFLR").setRequired(true);
                            } else {
                                that.byId("MFLR").setRequired(false);
                            }
                    } else if(id.includes("DM_LOCATION")){

                        if(that.filterActivites[i].OPTION_SELECT === "S"){
                            that.byId(input).setValue(Exists[0].LOCATION_ID);
                        } else if(that.filterActivites[i].OPTION_SELECT === "M"){
                            var mulLoc = [];
                            var tempLoc = [];

                            if(Exists[0].LOCATION_ID !== undefined ){
                                if(Exists[0].LOCATION_ID.includes(",")){
                                    mulLoc = Exists[0].LOCATION_ID.split(",");
                                } else {
                                    // mulLoc.push(Exists[0].LOCATION_ID);
                                    if (Array.isArray(Exists[0].LOCATION_ID) === true) {
                                        if(Exists[0].LOCATION_ID[0].includes("[")){
                                            Exists[0].LOCATION_ID = JSON.parse(Exists[0].LOCATION_ID);
                                        }
                                        mulLoc = Exists[0].LOCATION_ID;
                                    } else {
                                        var obj = {
                                            prod: Exists[0].LOCATION_ID
                                        };
                                        mulLoc.push(obj);
                                    }
                                    mulLoc = Exists[0].LOCATION_ID;
                                }
                                that.byId(input).removeAllTokens();
                            var temp = "";

                            if(mulLoc !== "" && mulLoc.length > 0){

                            mulLoc.forEach(function (oItem) {
                                if(oItem !== ""){
                                    temp = "X";
                                }
                                    that.byId(input).addToken(
                                        new sap.m.Token({
                                            key: oItem,
                                            text: oItem,
                                            editable:false,

                                        })
                                    );
                                });
                            }
                                if(temp === ""){
                                    that.byId(input).removeAllTokens();
                                }
                            }
                        }
                            if (that.filterActivites[i].MANDATORY === "Y") {
                                that.byId("DMLR").setRequired(true);
                            } else {
                                that.byId("DMLR").setRequired(false);
                            }

                        // if(selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION") ){
                        //     if(Exists[0].LOCATION_ID !== ""){
                        //     that.PlancfgPara(Exists[0].LOCATION_ID, Exists[0].GEN_TYPE);
                        //     }
                        // }
                    }
                    else if (id.includes("PRODUCT")) {
                        var mulProd = [];
                        var ProdArrayflag = "";
                        if (that.filterActivites[i].OPTION_SELECT === "S") {
                            if (Exists[0].PRODUCT_ID !== undefined && Exists[0].PRODUCT_ID !== null) {
                                that.byId(input).setValue(Exists[0].PRODUCT_ID);
                            } else {
                                that.byId(input).setValue("");
                            }
                        } else if (that.filterActivites[i].OPTION_SELECT === "M") {
                            if (that.Edit !== "X") {
                                if (Array.isArray(Exists[0].PRODUCT_ID) === false) {
                                    if (Exists[0].PRODUCT_ID !== undefined && Exists[0].PRODUCT_ID !== null) {
                                        if (Exists[0].PRODUCT_ID.includes(",")) {
                                            mulProd = Exists[0].PRODUCT_ID.split(",");
                                        } else {
                                            var obj = {
                                                prod: Exists[0].PRODUCT_ID
                                            };
                                            mulProd.push(obj);
                                            ProdArrayflag = "X";
                                        }
                                    }
                                } else {
                                    if (Exists[0].PRODUCT_ID !== undefined && Exists[0].PRODUCT_ID !== null) {
                                        mulProd = Exists[0].PRODUCT_ID;
                                    }
                                }
                            } else {
                                if(Exists[0].PRODUCT_ID.includes(",")){
                                    Exists[0].PRODUCT_ID = Exists[0].PRODUCT_ID.split(",");
                                }
                                if (Array.isArray(Exists[0].PRODUCT_ID) === true) {
                                    if(Exists[0].PRODUCT_ID[0].includes("[")){
                                        Exists[0].PRODUCT_ID = JSON.parse(Exists[0].PRODUCT_ID);
                                    }
                                    mulProd = Exists[0].PRODUCT_ID;
                                } else {
                                    var obj = {
                                        prod: Exists[0].PRODUCT_ID
                                    };
                                    mulProd.push(obj);
                                    ProdArrayflag = "X";
                                }
                            }
                            that.byId(input).removeAllTokens();
                            var temp = "";
                            if (mulProd !== "" && mulProd.length > 0) {
                                if (ProdArrayflag === "") {
                                    mulProd.forEach(function (oItem) {
                                        if (oItem !== "") {
                                            temp = "X";
                                            that.byId(input).addToken(
                                                new sap.m.Token({
                                                    key: oItem,
                                                    text: oItem,
                                                    editable: false,

                                                })
                                            );
                                        }
                                    });
                                } else {
                                    mulProd.forEach(function (oItem) {
                                        if (oItem.prod !== "") {
                                            temp = "X";
                                            that.byId(input).addToken(
                                                new sap.m.Token({
                                                    key: oItem.prod,
                                                    text: oItem.prod,
                                                    editable: false,

                                                })
                                            );
                                        }
                                    });
                                }
                                if (temp === "") {
                                    that.byId(input).removeAllTokens();
                                }

                            }
                        }

                        if (that.filterActivites[i].PARAMETER_ID === "PARTIAL_PRODUCT") {
                            if (that.filterActivites[i].MANDATORY === "Y") {
                                that.byId("PPR").setRequired(true);
                            } else {
                                that.byId("PPR").setRequired(false);
                            }
                        } else {
                            if (that.filterActivites[i].MANDATORY === "Y") {
                                that.byId("CPR").setRequired(true);
                            } else {
                                that.byId("CPR").setRequired(false);
                            }
                        }

                    } else if (id === "MODEL_VERSION") {
                        that.byId(input).setSelectedKey(Exists[0].MODEL_VERSION);
                    } else if (id === "PREDICTION_PROFILE") {
                        that.byId(input).setValue(Exists[0].PREDICTION_PROFILE);
                        if (that.filterActivites[i].MANDATORY === "Y") {
                            that.byId("PF").setRequired(true);
                        } else {
                            that.byId("PF").setRequired(false);
                        }
                    } else if (id === "VERSION") {
                        that.byId(input).setValue(Exists[0].VERSION);
                    } else if (id === "SCENARIO") {
                        that.byId(input).setValue(Exists[0].SCENARIO);
                    } else if (id === "CLASS") {
                        // that.byId(input).setValue(Exists[0].CLASS);
                        var mulClass = [];

                            if(Exists[0].CLASS !== undefined ){
                                if(Exists[0].CLASS.includes(",")){
                                    mulClass = Exists[0].CLASS.split(",");
                                } else {
                                    mulClass.push(Exists[0].CLASS);
                                    // mulClass = Exists[0].CLASS;
                                }
                                that.byId(input).removeAllTokens();
                            var temp = "";

                            mulClass.forEach(function (oItem) {
                                if(oItem !== ""){
                                    temp = "X";
                                }
                                    that.byId(input).addToken(
                                        new sap.m.Token({
                                            key: oItem,
                                            text: oItem,
                                            editable:false,

                                        })
                                    );
                                });
                                if(temp === ""){
                                    that.byId(input).removeAllTokens();
                                }
                            }
                        
                        
                    }  else if (id === "CUSTOMER_GROUP") {
                        that.byId(input).setValue(Exists[0].CUSTOMER_GROUP);
                    } else if (id === "GEN_TYPE") {
                        that.byId(input).setSelectedKey(Exists[0].GEN_TYPE);
                    } else if (id === "OVERRIDE_ASSIGNMENT") {
                        if (Exists[0].OVERRIDE_ASSIGNMENT === "true" || Exists[0].OVERRIDE_ASSIGNMENT === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if (id === "CRITICAL_ASSEMBLY") {
                        // that.byId(input).setSelected(Exists[0].CRITICAL_ASSEMBLY);
                        if (Exists[0].CRITICAL_ASSEMBLY === "true" || Exists[0].CRITICAL_ASSEMBLY === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if (id === "IMPACT_ANALYSIS") {
                        // that.byId(input).setSelected(Exists[0].IMPACT_ANALYSIS);
                        if (Exists[0].IMPACT_ANALYSIS === "true" || Exists[0].IMPACT_ANALYSIS === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if (id === "DAILY") {
                        // that.byId(input).setSelected(Exists[0].DAILY);
                        if (Exists[0].DAILY === "true" || Exists[0].DAILY === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if(id === "OPERATOR"){
                        if(Exists[0].OPERATOR !== ""){
                            that.byId(input).setSelectedKey(Exists[0].OPERATOR);
                        } else {
                            that.byId(input).setSelectedKey("BT");
                        }
                        
                        
                        
                    } else if(id === "SINGLE_DATE"){
                        if(selACTivityStep.includes("PURGE_PLANNING_DATA")){
                            that.byId("SINGLE_DATE").setVisible(false);
                        }
                        that.byId(input).setValue(Exists[0].SINGLE_DATE);
                        
                    } else if (id.includes("DATE_RANGE")) {
                        that.byId("ToDate").setEditable(false);
                        if(Exists[0].FROM_DATE !== undefined){
                            that.byId("FromDate").setValue(Exists[0].FROM_DATE);
                            if(selACTivityStep !== "GENERATE_SEEDORDER"){
                                if(Exists[0].FROM_DATE !== ""  ){
                                    that.byId("ToDate").setEditable(true);
                                    that.byId("ToDate").setMaxDate(null);
                                    that.byId("ToDate").setMinDate(new Date(Exists[0].FROM_DATE));
                                    that.byId("ToDate").setValue(Exists[0].TO_DATE);
                                }
                            } else {
                                    if(Exists[0].FROM_DATE !== ""){
                                        var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                                        that.byId("ToDate").setEditable(true);
                                        that.byId("ToDate").setMinDate(new Date(Exists[0].FROM_DATE));
                                        that.byId("ToDate").setMaxDate(tempDate);
                                        that.byId("ToDate").setValue(Exists[0].TO_DATE);
                                    }
                            }
                        } else {
                            that.byId("FromDate").setValue();
                            that.byId("ToDate").setValue();
                        }

                                if (that.filterActivites[i].MANDATORY === "Y") {
                                    that.byId("dateRange").setRequired(true);
                                } else {
                                    that.byId("dateRange").setRequired(false);
                                }

                    }  else if(id === "Rolling_Timestamp"){
                        if(Exists[0].Rolling === "true" || Exists[0].Rolling === true){
                            that.byId("idRolling").setSelected(true);
                            that.byId("FromDate").setEditable(false);
                            that.byId("ToDate").setEditable(false);
                            that.byId("idRollingWeeks").setVisible(true);
                            that.byId("idRollingWeeks").setValue(Exists[0].Rolling_Timestamp);
                        } else {
                            that.byId("idRolling").setSelected(false);
                            that.byId("FromDate").setEditable(true);
                            that.byId("ToDate").setEditable(true);
                            that.byId("idRollingWeeks").setValue();
                            that.byId("idRollingWeeks").setVisible(false);
                        }
                    } else if (id === "OptAlgorithm") {
                        that.byId(input).setSelectedKey(Exists[0].OptAlgorithm);
                    } else if (id === "OptFactor") {
                        that.byId(input).setSelectedKey(Exists[0].OptFactor);
                    } else if (id === "DsAlgorithm") {
                        that.byId(input).setSelectedKey(Exists[0].DsAlgorithm);
                    } else if (id === "SnapShot") {
                        if (Exists[0].SnapShot === "") {
                            that.byId("idSnapShot").setSelected(false);
                        } else if (Exists[0].SnapShot === "C") {
                            that.byId("SnapR").setVisible(true);
                            that.byId("snapDesc").setVisible(true);
                            that.byId("idSnapShot").setSelected(true);
                            that.byId("idSnapRadio").setSelectedButton(that.byId("create"));
                            that.byId("idSnapDesc").setValue(Exists[0].SnapShot_Desc);
                        } else if (Exists[0].SnapShot === "U") {
                            that.byId("SnapR").setVisible(true);
                            that.byId("idSnapShot").setSelected(true);
                            that.byId("idSnapRadio").setSelectedButton(that.byId("update"));
                        }
                    } else if(id === "HISTORY_WEEKS"){
                        that.byId("idWeeks").setValue(Exists[0].HISTORY_WEEKS);
                    }
                }
            }

            }
            // Form Visible
            that.byId("idParameter").setVisible(true);
            that.byId("idarrow").setVisible(true);

            that.maxACT_POSITION = that.MaxStep;

            that.getView().byId("stepLabel").setText(step + ' of ' + that.maxACT_POSITION);

            that.byId("idarrowTitle").setText(stepname);

            that.StepsSelFlag = "";

        },

        Previous: function () {

            var labelText = that.getView().byId("stepLabel").getText().split(" of ");

            if (parseInt(labelText[0]) - 1 > 0) {

                let alabel = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                if (alabel > 1) {
                    that.getView().byId("stepLabel").setText(`${alabel - 1} of ` + that.maxACT_POSITION)
                }
                // if(that.byId("idStepList").getItems()[alabel -2]){
                // that.byId("idStepList").getItems()[alabel -2].setSelected(true);
                // that.onStepName();
                // }

                var MaxSteps = that.TemplateItems.filter(function (aComp) {
                    return aComp.ACT_POSITION === parseInt(alabel - 1);
                });

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === MaxSteps[0].ACTIVITY_ID && 
                    e.ACT_POSITION === parseInt(alabel - 1));

                if(that.TempParams[index].FROM_DATE !== undefined && that.TempParams[index].FROM_DATE !== ""){
                    that.byId("ToDate").setEditable(true);
                } else {
                    that.byId("ToDate").setEditable(false);
                }

                if(MaxSteps[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                    var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                    that.byId("FromDate").setMaxDate(tempDate);
                    that.byId("ToDate").setMaxDate(tempDate);
                    that.byId("FromDate").setMinDate(null);
                    that.byId("ToDate").setMinDate(null);
                } else if(MaxSteps[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                    that.byId("FromDate").setMinDate(null);
                    that.byId("ToDate").setMinDate(null);
                    that.byId("FromDate").setMaxDate(null);
                    that.byId("ToDate").setMaxDate(null);
                } else {
                    that.byId("FromDate").setMaxDate(null);
                    that.byId("ToDate").setMaxDate(null);
                    that.byId("FromDate").setMinDate(new Date());
                    that.byId("ToDate").setMinDate(new Date());
                }

                that.onStepName(MaxSteps[0].ACTIVITY_ID, MaxSteps[0].ACT_POSITION, MaxSteps[0].STEP_NAME);
                that.tempIndex = "";
            }
        },

        Next: function () {
            var labelText = that.getView().byId("stepLabel").getText().split(" of ");

            if (parseInt(labelText[0]) + 1 <= parseInt(labelText[1])) {

                let alabel = parseInt(that.getView().byId("stepLabel").getText().split(" of ")[0]);

                var aData = that.ActivityItems;
                var mandtFlag = "";

                // var currentActivity = that.TempParams.filter(function (aComp) {
                //     return aComp.ACT_POSITION === parseInt(alabel - 1);
                // });
                that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                var currentActivity = that.TempParams[parseInt(alabel - 1)];

                var filterActivites = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === currentActivity.ACTIVITY_ID;
                });

                

                filterActivites.forEach(el => {
                    if (el.MANDATORY === "Y") {
                        if (el.PARAMETER_ID == "MF_LOCATION") {
                            if (currentActivity.MF_LOCATION_ID === "" || currentActivity.MF_LOCATION_ID === null || currentActivity.MF_LOCATION_ID === undefined) {
                                mandtFlag = "X";
                                return;
                            }
                        } 
                        else if (el.PARAMETER_ID == "DM_LOCATION") {
                            if (currentActivity.LOCATION_ID  === "") {
                                mandtFlag = "X";
                                return;
                            }
                        }
                        else if (el.PARAMETER_ID.includes("PRODUCT")) {
                            if (currentActivity.PRODUCT_ID === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("VERSION")) {
                            if (currentActivity.VERSION === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("SCENARIO")) {
                            if (currentActivity.SCENARIO === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("CLASS")) {
                            if (currentActivity.CLASS === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("CUSTOMER_GROUP")) {
                            if (currentActivity.CUSTOMER_GROUP === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("DATE_RANGE")) {
                            if(currentActivity.ACTIVITY_ID === "PURGE_PLANNING_DATA" && currentActivity.OPERATOR === "BT"){
                                // if(currentActivity.OPERATOR === "BT"){
                                    if (currentActivity.FROM_DATE === "" || currentActivity.TO_DATE === "") {
                                        mandtFlag = "X";
                                        return;
                                    }
                                // }
                            } else {
                                if (currentActivity.FROM_DATE === "" || currentActivity.TO_DATE === "") {
                                    mandtFlag = "X";
                                    return;
                                }
                            }
                            
                        } else if (el.PARAMETER_ID.includes("SINGLE_DATE")) {
                            if(currentActivity.OPERATOR !== "BT"){
                                if (currentActivity.SINGLE_DATE === "") {
                                    mandtFlag = "X";
                                    return;
                                }
                            }
                        } else if (el.PARAMETER_ID.includes("HISTORY_WEEKS")) {
                            if(currentActivity.HISTORY_WEEKS === "" || currentActivity.HISTORY_WEEKS === undefined){                                
                                    mandtFlag = "X";
                                    return;
                            }
                        }
                    }
                });

                if (mandtFlag === "") {

                    if (alabel < that.maxACT_POSITION) {
                        that.getView().byId("stepLabel").setText(`${alabel + 1} of ` + that.maxACT_POSITION)
                    }
                    // if(that.byId("idStepList").getItems()[alabel]){
                    // that.byId("idStepList").getItems()[alabel].setSelected(true);
                    // that.onStepName();
                    // }

                    var MaxSteps = that.TemplateItems.filter(function (aComp) {
                        return aComp.ACT_POSITION === parseInt(alabel + 1);
                    });

                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === MaxSteps[0].ACTIVITY_ID && 
                                                                e.ACT_POSITION === parseInt(alabel + 1));

                    if(that.TempParams[index].FROM_DATE !== undefined && that.TempParams[index].FROM_DATE !== ""){
                        that.byId("ToDate").setEditable(true);
                    } else {
                        that.byId("ToDate").setEditable(false);
                    }

                    if(MaxSteps[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                        var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                        that.byId("FromDate").setMaxDate(tempDate);
                        that.byId("ToDate").setMaxDate(tempDate);
                        that.byId("FromDate").setMinDate(null);
                        that.byId("ToDate").setMinDate(null);
                    } else if(MaxSteps[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                        that.byId("FromDate").setMinDate(null);
                        that.byId("ToDate").setMinDate(null);
                        that.byId("FromDate").setMaxDate(null);
                        that.byId("ToDate").setMaxDate(null);
                    } else {
                        that.byId("FromDate").setMaxDate(null);
                        that.byId("ToDate").setMaxDate(null);
                        that.byId("FromDate").setMinDate(new Date());
                        that.byId("ToDate").setMinDate(new Date());
                    }

                    that.onStepName(MaxSteps[0].ACTIVITY_ID, MaxSteps[0].ACT_POSITION, MaxSteps[0].STEP_NAME);
                    that.tempIndex = "";

                } else {
                    MessageToast.show("Please select all mandatory fields");
                }

            }

        },

        onSnapShot: function (oEvent) {
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var sel = that.byId("idSnapShot").getSelected();
                that.byId("idSnapRadio").setSelectedButton(that.byId("create"));

                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                var temp = "",
                    tempDesc = "";

                if (sel) {
                    that.byId("SnapR").setVisible(true);
                    that.byId("snapDesc").setVisible(true);                
                    that.TempParams[index].SnapShot = "C";
                    that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();
                    temp = "C";
                    tempDesc = that.byId("idSnapDesc").getValue();
                } else {
                    that.byId("SnapR").setVisible(false);
                    that.byId("snapDesc").setVisible(false);
                    that.TempParams[index].SnapShot = "";
                    that.TempParams[index].SnapShot_Desc = "";                
                }

                that.ChnageData(temp,selStep,"SnapShot");
                that.ChnageData(tempDesc,selStep,"SnapShot_Desc");
            } else {
                var sel = that._oCore.byId("idSnapShotU").getSelected();
                that._oCore.byId("idSnapRadioU").setSelectedButton(that._oCore.byId("createU"));
                if (sel) {
                    that._oCore.byId("SnapRU").setVisible(true);
                    that._oCore.byId("snapDescU").setVisible(true);   
                } else {
                    that._oCore.byId("SnapRU").setVisible(false);
                    that._oCore.byId("snapDescU").setVisible(false);   
                }    
            }


        },

        OnsnapSelect: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var selRadio = that.byId("idSnapRadio").getSelectedButton().getText();
                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                var temp = "",
                    tempDesc = "";
                if (selRadio === "Create") {
                    that.byId("snapDesc").setVisible(true);
                    that.TempParams[index].SnapShot = "C";
                    that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();
                    temp = "C";
                    tempDesc = that.byId("idSnapDesc").getValue();
                } else {
                    that.byId("snapDesc").setVisible(false);
                    that.TempParams[index].SnapShot = "U";
                    that.TempParams[index].SnapShot_Desc = "";
                    temp = "U";
                    tempDesc = "";
                }
                that.ChnageData(temp,selStep,"SnapShot");
                that.ChnageData(tempDesc,selStep,"SnapShot_Desc");
            } else {
                var selRadio = that._oCore.byId("idSnapRadio").getSelectedButton().getText();
                if (selRadio === "Create") {
                    that._oCore.byId("snapDescU").setVisible(true);
                } else {
                    that._oCore.byId("snapDescU").setVisible(false);
                }
            }
        },

        onDescChange: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){

                if (that.tempIndex === "") {
                    var selStep = that.getView().byId("idarrowTitle").getText(),
                        step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                    that.tempIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                }
                that.TempParams[that.tempIndex].SnapShot_Desc = that.byId("idSnapDesc").getValue();

                that.ChnageData(that.byId("idSnapDesc").getValue(),selStep,"SnapShot_Desc");
            } 

        },

        /**
         * This function is called when click on input box to open value help dialogs.
         * This function will open the dialogs based on sId.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent) {
            var sId = oEvent.getParameter("id");
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
            // Location Dialog
            if (sId.includes("MFL")) {
                this.MFlocModel = new JSONModel();
                that.MFlocModel.setData({
                    MFLocitems: that.MFLocData
                });
                that.oMFLocList.setModel(that.MFlocModel);

                this._valueHelpDialogMFL.open();

                that.oMFLoc = that.byId("MFLInput");
                that.oLoc = that.byId("DlocInput");
                // Product Dialog
            } else if (sId.includes("loc")) {
                
                that.oMFLoc = that.byId("MFLInput");
                    that.oLoc = that.byId("DlocInput");
                    
                    that.getDemandLocation();
                    if(that.oMFLoc.getValue()){
                    this._valueHelpDialogLoc.open();
                    } else {
                        MessageToast.show("Select Manufacturing Location");
                    }
                // Product Dialog
            } else if (sId.includes("prod")) {
                // that.getProducts();
                that.oMFLoc = that.byId("MFLInput");
                that.oLoc = that.byId("DlocInput");
                if(that.byId("DM_LOCATION").getVisible() === true){

                    if (that.oLoc.getTokens().length !== 0 || that.oLoc.getValue() ) {
                        that.getProducts();
                            this._valueHelpDialogProd.open();
                    } else {
                        MessageToast.show("Select Location");
                    }
                } else {
                    if (that.oMFLoc.getValue()) {
                        that.getProducts();
                        this._valueHelpDialogProd.open();
                } else {
                    MessageToast.show("Select Location");
                }
                }
                
                // Version Dialog
            } else if (sId.includes("ver")) {
                var selStep = that.getView().byId("idarrowTitle").getText();
                if(selStep !== "SNAPSHOT"){
                that.oMFLoc = that.byId("MFLInput");
                that.oLoc = that.byId("DlocInput");

                if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                    that.oProd = that.byId("CprodInput");
                } else {
                    that.oProd = that.byId("PprodInput");
                }
                if ((that.oMFLoc.getValue() || that.oLoc.getValue()) && (that.oProd.getTokens().length !== 0 || that.oProd.getValue())) {
                    
                    that.getVersion(selStep);
                    that._valueHelpDialogVer.open();
                } else {
                    MessageToast.show("Select Location and Product");
                }
            } else {
                that.getVersion(selStep);
                that._valueHelpDialogVer.open();
            }
                // Scenario Dialog
            } else if (sId.includes("scen")) {
               
                that.oMFLoc = that.byId("MFLInput");
                that.oLoc = that.byId("DlocInput");

                if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                    that.oProd = that.byId("CprodInput");
                } else {
                    that.oProd = that.byId("PprodInput");
                }
                if (
                    (that.oMFLoc.getValue() || that.oLoc.getValue()) &&
                    (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) && that.byId("idver").getValue()
                ) {
                    var selStep = that.getView().byId("idarrowTitle").getText();
                    that.getScenario(selStep);
                    that._valueHelpDialogScen.open();
                } else {
                    MessageToast.show("Select Location, Product and Version");
                }
            } else if (sId.includes("PrePFInput")) {
                var selStep = that.getView().byId("idarrowTitle").getText();
                var profiles = that.PredictionData;
                if(selStep === "STATFORECAST_FOR_CHAR_VALUES"){
                    var filterActivites = profiles.filter(function (aComp) {
                        return aComp.PROFILE.includes("AES");
                        });
                } else {
                    var filterActivites = profiles.filter(function (aComp) {
                        return !aComp.PROFILE.includes("AES");
                        });
                }

                that.ppfModel = new JSONModel();
                    that.ppfModel.setData({
                        results: filterActivites
                    });
                    that._valueHelpDialogPPF.setModel(that.ppfModel);

                that._valueHelpDialogPPF.open();
            } else if (sId.includes("Temp")) {
                that._templateDialog.open();
            } else if (sId.includes("classInput")) {
                that.oMFLoc = that.byId("MFLInput");
                that.oLoc = that.byId("DlocInput");
                if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                    that.oProd = that.byId("CprodInput");
                } else {
                    that.oProd = that.byId("PprodInput");
                }

                    if ((that.oLoc.getTokens().length !== 0 || that.oLoc.getValue()) && 
                    (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) ) {
                        that.getClass();
                            this._valueHelpDialogClassDetails.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
            } else if (sId.includes("custGrpInput")) {
                var selStep = that.getView().byId("idarrowTitle").getText();
                if(selStep === "STATFORECAST_FOR_CHAR_VALUES"){
                    that.getCustGroup("Y");
                } else {
                        that.getCustGroup("N");
                }

                        this._valueHelpDialogCustGroup.open();
               
                // that.oMFLoc = that.byId("MFLInput");
                // that.oLoc = that.byId("DlocInput");

                // if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                //     that.oProd = that.byId("CprodInput");
                // } else {
                //     that.oProd = that.byId("PprodInput");
                // }
                // if (
                //     (that.oMFLoc.getValue() || that.oLoc.getValue()) &&
                //     (that.oProd.getTokens().length !== 0 || that.oProd.getValue())
                // ) {
                    
                //     that.getCustGroup();
                //     that._valueHelpDialogScen.open();
                // } else {
                //     MessageToast.show("Select Location, Product and Version");
                // }
            }
        } else {
            if (sId.includes("MFL")) {
                this.MFlocModelUni = new JSONModel();
                this.MFlocModelUni.setSizeLimit(that.MFLocDataUni.length);
                that.MFlocModelUni.setData({
                    MFLocitemsUni: that.MFLocDataUni
                });
                that.oMFLocListUni.setModel(that.MFlocModelUni);

                this._valueHelpDialogMFLUni.open();

                that.oMFLocUni = sap.ui.getCore().byId("MFLInputU");
                that.oLocUni = sap.ui.getCore().byId("DlocInputU");
                that.oProdUni = sap.ui.getCore().byId("CprodInputU");

                var locTokens = that.oMFLocUni.getTokens();

                for (var i = 0; i < locTokens.length; i++) {

                    // var index = that.MFLocDataUni.findIndex(e => e.FACTORY_LOC === locTokens[i].getText() );
                    // sap.ui.getCore().byId("MFLSlctListJSSMul").getItems()[index].setSelected(true);
                    for (var i = 0; i < locTokens.length; i++) {
                        for (var j = 0; j < that.MFLocDataUni.length; j++) {
                            if (that.MFLocDataUni[j].FACTORY_LOC === locTokens[i].getText()) {
                                sap.ui.getCore().byId("MFLSlctListJSSMul").getItems()[j].setSelected(true);
                                break;
                            }
                        }
                    }
                }

                
            } else if(sId.includes("loc")){

                that.oMFLocUni = sap.ui.getCore().byId("MFLInputU");
                that.oLocUni = sap.ui.getCore().byId("DlocInputU");
                that.oProdUni = sap.ui.getCore().byId("CprodInputU");
                var Data = that.TotalDataUni;
                sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(true);
                that.LocDataUni = [];

                if(that.oMFLocUni.getTokens().length > 0){

                    for(var i=0; i<that.oMFLocUni.getTokens().length; i++){
                        var temp = Data.filter(el => el.FACTORY_LOC === that.oMFLocUni.getTokens()[i].getText());
                        that.LocDataUni = that.LocDataUni.concat(temp);
                    }
                    
                } else {
                    that.LocDataUni = Data;                    
                }

                function removeDuplicate(array, key) {
                    var check = new Set();
                    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                }
                that.LocDataUni = removeDuplicate(that.LocDataUni, 'DEMAND_LOC');

                that.locModel = new JSONModel();
                that.locModel.setSizeLimit(that.LocDataUni.length); 
                sap.ui.getCore().byId("LocSlctListJSS").setGrowingThreshold(that.LocDataUni.length); 
                
                that.LocDataUni.forEach(el => {
                    el.LOCATION_ID = el.DEMAND_LOC;
                    el.LOCATION_DESC = el.DEMAND_DESC;
                })

               
    
                that.locModel.setData({
                    Locitems: that.LocDataUni
                });
                that.oLocList.setModel(that.locModel);
    
                var locTokens = that.oLocUni.getTokens();
    
                if(locTokens.length > 0){

                    // for (var i = 0; i < locTokens.length; i++) {

                    //     var index = that.LocDataUni.findIndex(e => e.LOCATION_ID === locTokens[i].getText() );
                    //     sap.ui.getCore().byId("LocSlctListJSS").getItems()[index].setSelected(true);
                    // }
                    for (var i = 0; i < locTokens.length; i++) {
                        for (var j = 0; j < that.LocDataUni.length; j++) {
                            if (that.LocDataUni[j].LOCATION_ID === locTokens[i].getText()) {
                                sap.ui.getCore().byId("LocSlctListJSS").getItems()[j].setSelected(true);
                                break;
                            }
                        }
                    }
                }
                    
                // if(locTokens.length > 0 && locTokens.length === (that.LocData.length - 1)){
                //     that._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
                // } else {
                //     for (var i = 0; i < locTokens.length; i++) {
                //         for (var j = 0; j < that.LocDataUni.length; j++) {
                //             if (that.LocDataUni[j].LOCATION_ID === locTokens[i].getText()) {
                //                 sap.ui.getCore().byId("LocSlctListJSS").getItems()[j].setSelected(true);
                //                 break;
                //             }
                //         }
                //     }
                    
                // }
            
            this._valueHelpDialogLoc.open();
                    
            } else if(sId.includes("prod")){

                that.oMFLocUni = sap.ui.getCore().byId("MFLInputU");
                that.oLocUni = sap.ui.getCore().byId("DlocInputU");
                that.oProdUni = sap.ui.getCore().byId("CprodInputU");

                var Data = that.TotalDataUni;
                sap.ui.getCore().byId("prodSlctListJSS").setMultiSelect(true);
                that.ProdDataUni = [];

                if(that.oMFLocUni.getTokens().length > 0){

                    for(var i=0; i<that.oMFLocUni.getTokens().length; i++){
                        var temp = Data.filter(el => el.FACTORY_LOC === that.oMFLocUni.getTokens()[i].getText());
                        that.ProdDataUni = that.ProdDataUni.concat(temp);
                    }
                    if(that.oLocUni.getTokens().length > 0){
                        that.DataUni = [];
                        for(var i=0; i<that.oLocUni.getTokens().length; i++){
                            var temp = that.ProdDataUni.filter(el => el.DEMAND_LOC === that.oLocUni.getTokens()[i].getText());
                            that.DataUni = that.DataUni.concat(temp);
                            that.ProdDataUni = [];
                            that.ProdDataUni = that.DataUni;
                        }
                        
                    }

                } else if(that.oLocUni.getTokens().length > 0){

                    for(var i=0; i<that.oLocUni.getTokens().length; i++){
                        var temp = Data.filter(el => el.DEMAND_LOC === that.oLocUni.getTokens()[i].getText());
                        that.ProdDataUni = that.ProdDataUni.concat(temp);
                    }
                    
                } else {
                    that.ProdDataUni = Data;                    
                }

                function removeDuplicate(array, key) {
                    var check = new Set();
                    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                }
                that.ProdDataUni = removeDuplicate(that.ProdDataUni, 'PRODUCT_ID');

                that.prodModel = new JSONModel();
                that.prodModel.setSizeLimit(that.ProdDataUni.length); 
                sap.ui.getCore().byId("prodSlctListJSS").setGrowingThreshold(that.ProdDataUni.length); 
                
                that.prodModel.setData({
                    results: that.ProdDataUni
                });
                that.oProdList.setModel(that.prodModel);
    
                var prodTokens = that.oProdUni.getTokens();
    
                if(prodTokens.length > 0){
                    // for (var i = 0; i < prodTokens.length; i++) {

                    //     var index = that.ProdDataUni.findIndex(e => e.PRODUCT_ID === prodTokens[i].getText() );
                    //     sap.ui.getCore().byId("prodSlctListJSS").getItems()[index].setSelected(true);
                    // }
                    for (var i = 0; i < prodTokens.length; i++) {
                                for (var j = 0; j < that.ProdDataUni.length; j++) {
                                    if (that.ProdDataUni[j].PRODUCT_ID === prodTokens[i].getText()) {
                                        sap.ui.getCore().byId("prodSlctListJSS").getItems()[j].setSelected(true);
                                        break;
                                    }
                                }
                            }
                }
                    
                // if(prodTokens.length > 0 && prodTokens.length === (that.LocData.length - 1)){
                //     that._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
                // } else {
                //     for (var i = 0; i < prodTokens.length; i++) {
                //         for (var j = 0; j < that.ProdDataUni.length; j++) {
                //             if (that.ProdDataUni[j].LOCATION_ID === prodTokens[i].getText()) {
                //                 sap.ui.getCore().byId("prodSlctListJSS").getItems()[j].setSelected(true);
                //                 break;
                //             }
                //         }
                //     }
                    
                // }
            // }
            this._valueHelpDialogProd.open();

            } else if(sId.includes("ver")){
                that._valueHelpDialogVer.open();
            } else if(sId.includes("scen")){
                var data = that.VerSecData;
                var scenarioData = [];

                that.oVerUni = sap.ui.getCore().byId("idverU");
                if(that.oVerUni.getValue() !== ""){

                    scenarioData = data.filter(el => el.VERSION === that.oVerUni.getValue());

                } else {
                    scenarioData = data;
                }


                function removeDuplicate(array, key) {
                    var check = new Set();
                    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                }

                if (scenarioData.length > 0) {
                    that.scenModel = new JSONModel();
                    that.scenModel.setData({
                        results: removeDuplicate(scenarioData, 'SCENARIO')
                    });

                    
                } else {
                    that.scenModel = new JSONModel();
                    that.scenModel.setData({
                        results: []
                    });

                }
                that.oScenList.setModel(that.scenModel);

                that._valueHelpDialogScen.open();
            } else if (sId.includes("PrePFInput")) {
                var profiles = that.PredictionData;
                that.ppfModel = new JSONModel();
                    that.ppfModel.setData({
                        results: profiles
                    });
                    that._valueHelpDialogPPF.setModel(that.ppfModel);

                that._valueHelpDialogPPF.open();
            } else if(sId.includes("classInput")){
                that.oMFLocUni = sap.ui.getCore().byId("MFLInputU");
                that.oLocUni = sap.ui.getCore().byId("DlocInputU");
                that.oProdUni = sap.ui.getCore().byId("CprodInputU");
                that.oClassList = sap.ui.getCore().byId("classInputU");

                sap.ui.core.BusyIndicator.show();
            // Calling service to get the Customer data
            this.getModel("BModel").read("/getProdClass", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                        
                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.classModel = new JSONModel();
                        that.classModel.setSizeLimit(2000);
                        that.classModel.setData({
                            results: removeDuplicate(oData.results, 'CLASS_NUM')
                        });
                        // that.classModel.setData(oData);
                        that.oClassList.setModel(that.classModel);

                        that.oClass = sap.ui.getCore().byId("classInputU");
                        var classTokens = that.oClass.getTokens();
                        
                        if(classTokens.length > 0){

                            for (var i = 0; i < classTokens.length; i++) {
        
                                var index = that.LocDataUni.findIndex(e => e.CLASS_NUM === classTokens[i].getText() );
                                sap.ui.getCore().byId("ClassSlctListJSS").getItems()[index].setSelected(true);
                            }   
                        }        
                        
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                },
            });
            } else if(sId.includes("custGrpInput")){


                this.getModel("BModel").read("/getCustgroup", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.custGroupModel = new JSONModel();
                        that.custGroupModel.setData(oData);
                        that.oCustGroupList.setModel(that.custGroupModel);
    
                       
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("failed to fetch the customer groups");
                    },
                });
            }




        }
        },

        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         * Dialogs will be closed based on sId.
         * @param {object} oEvent -the event information.
         */
        handleClose: function (oEvent) {
            var sId = oEvent.getParameter("id");
            var flag = that.oGModel.getProperty("/CommonParam");
            // if(flag === ""){
            // Location Dialog
            if (sId.includes("MFL")) {
                if(flag === ""){
                that._oCore
                    .byId(this._valueHelpDialogMFL.getId() + "-searchField")
                    .setValue("");
                if (that.oMFLocList.getBinding("items")) {
                    that.oMFLocList.getBinding("items").filter([]);
                }
            } else {
                that._oCore
                    .byId(this._valueHelpDialogMFLUni.getId() + "-searchField")
                    .setValue("");
                if (that.oMFLocListUni.getBinding("items")) {
                    that.oMFLocListUni.getBinding("items").filter([]);
                }
            }
                // Location Dialog
            } else if (sId.includes("Loc")) {
                that._oCore
                    .byId(this._valueHelpDialogLoc.getId() + "-searchField")
                    .setValue("");
                if (that.oLocList.getBinding("items")) {
                    that.oLocList.getBinding("items").filter([]);
                }
                // Product Dialog
            } else if (sId.includes("prod")) {
                that._oCore
                    .byId(this._valueHelpDialogProd.getId() + "-searchField")
                    .setValue("");
                if (that.oProdList.getBinding("items")) {
                    that.oProdList.getBinding("items").filter([]);
                }
                // Version Dialog
            } else if (sId.includes("Ver")) {
                that._oCore
                    .byId(this._valueHelpDialogVer.getId() + "-searchField")
                    .setValue("");
                if (that.oVerList.getBinding("items")) {
                    that.oVerList.getBinding("items").filter([]);
                }
                // Scenario Dalog
            } else if (sId.includes("scen")) {
                that._oCore
                    .byId(this._valueHelpDialogScen.getId() + "-searchField")
                    .setValue("");
                if (that.oScenList.getBinding("items")) {
                    that.oScenList.getBinding("items").filter([]);
                }
                // Prediction Profile Dalog
            } else if (sId.includes("ppfSlctList")) {
                that._oCore
                    .byId(this._valueHelpDialogPPF.getId() + "-searchField")
                    .setValue("");
                if (that.oPPFList.getBinding("items")) {
                    that.oPPFList.getBinding("items").filter([]);
                }
            } else if (sId.includes("TempSlctList")) {
                that._oCore
                    .byId(this._templateDialog.getId() + "-searchField")
                    .setValue("");
                if (sap.ui.getCore().byId("TempSlctListJSS").getBinding("items")) {
                    sap.ui.getCore().byId("TempSlctListJSS").getBinding("items").filter([]);
                }
            } else if (sId.includes("ClassSlctList")) {
                that._oCore
                    .byId(this._valueHelpDialogClassDetails.getId() + "-searchField")
                    .setValue("");
                if (that.oClassList.getBinding("items")) {
                    that.oClassList.getBinding("items").filter([]);
                }
            } else if (sId.includes("CustGroupSlctList")) {
                that._oCore
                    .byId(this._valueHelpDialogCustGroup.getId() + "-searchField")
                    .setValue("");
                if (that.oCustGroupList.getBinding("items")) {
                    that.oCustGroupList.getBinding("items").filter([]);
                }
            }
        // } else {

            
        // }
        },

        /**
         * Called when something is entered into the search field.
         * Data will be filtered based in sId.
         * @param {object} oEvent -the event information.
         */
        handleSearch: function (oEvent) {
            var sQuery =
                oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                sId = oEvent.getParameter("id"),
                oFilters = [];
            // Check if search filter is to be applied
            sQuery = sQuery ? sQuery.trim() : "";

            var flag = that.oGModel.getProperty("/CommonParam");
            // if(flag === ""){
            // Location
            if (sId.includes("MFL")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("FACTORY_LOC", FilterOperator.Contains, sQuery),
                                new Filter(
                                    "LOCATION_DESC",
                                    FilterOperator.Contains,
                                    sQuery
                                ),
                            ],
                            and: false,
                        })
                    );
                }

                if(flag === ""){
                    that.oMFLocList.getBinding("items").filter(oFilters);
                } else {
                    that.oMFLocListUni.getBinding("items").filter(oFilters);
                }
                // Location
            } else if (sId.includes("Loc")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                                new Filter(
                                    "LOCATION_DESC",
                                    FilterOperator.Contains,
                                    sQuery
                                ),
                            ],
                            and: false,
                        })
                    );
                }
                that.oLocList.getBinding("items").filter(oFilters);
                // Product
            } else if (sId.includes("prod")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                                new Filter("PROD_DESC", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oProdList.getBinding("items").filter(oFilters);

                // Version
            } else if (sId.includes("ver") || sId.includes("Ver")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("VERSION", FilterOperator.Contains, sQuery),
                                new Filter("VERSION_NAME", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oVerList.getBinding("items").filter(oFilters);
                // Scenario
            } else if (sId.includes("scen") || sId.includes("Scen")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("SCENARIO", FilterOperator.Contains, sQuery),
                                new Filter("SCENARIO_NAME", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oScenList.getBinding("items").filter(oFilters);
                // prediction Profile
            } else if (sId.includes("ppfSlctList")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("PROFILE", FilterOperator.Contains, sQuery),
                                new Filter("PRF_DESC", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oPPFList.getBinding("items").filter(oFilters);

            } else if (sId.includes("TempSlctList")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("TEMPLATE_ID", FilterOperator.Contains, sQuery),
                                new Filter("TEMPLATE_DESC", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                sap.ui.getCore().byId("TempSlctListJSS").getBinding("items").filter(oFilters);

            } else if (sId.includes("ClassSlctList")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CLASS_NUM", FilterOperator.Contains, sQuery),
                                new Filter("CLASS_NAME", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }

                that.oClassList.getBinding("items").filter(oFilters);
                
                
            } else if (sId.includes("CustGroupSlctList")) {
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CUSTOMER_GROUP", FilterOperator.Contains, sQuery),
                                new Filter("CUSTOMER_DESC", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }

                that.oCustGroupList.getBinding("items").filter(oFilters);
                
                
            }
        // } else {
        //     if (sId.includes("MFL")) {
        //         if (sQuery !== "") {
        //             oFilters.push(
        //                 new Filter({
        //                     filters: [
        //                         new Filter("FACTORY_LOC", FilterOperator.Contains, sQuery),
        //                         new Filter(
        //                             "LOCATION_DESC",
        //                             FilterOperator.Contains,
        //                             sQuery
        //                         ),
        //                     ],
        //                     and: false,
        //                 })
        //             );
        //         }
        //         that.oMFLocListUni.getBinding("items").filter(oFilters);
        //         // Location
        //     }
        // }
        },

        /**
         * This function is called when selecting values in dialog box.
         * In this function tokens will be updated.
         * @param {object} oEvent -the event information.
         */
        handleSelection: function (oEvent) {
            var sId = oEvent.getParameter("id"),
                aSelectedVer;
                var flag = that.oGModel.getProperty("/CommonParam");
                if(flag === ""){
            //Location list
            if(sId.includes("MFL")){
                var aSelectedLoc = oEvent.getParameter("selectedItems");
                that.oMFLoc.setValue(aSelectedLoc[0].getTitle());

                that.byId("idver").setValue("");
                    that.byId("idscen").setValue("");
                    that.byId("classInput").removeAllTokens();

                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                that.TempParams[index].MF_LOCATION_ID = aSelectedLoc[0].getTitle();
                if(that.TempParams[index].LOCATION_ID !== undefined){
                    that.TempParams[index].LOCATION_ID = "";
                }
                if(that.TempParams[index].PRODUCT_ID !== undefined){
                    that.TempParams[index].PRODUCT_ID = "";
                }
                if(that.TempParams[index].VERSION !== undefined){
                    that.TempParams[index].VERSION = "";
                    that.TempParams[index].SCENARIO = "";
                }
                if (selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION")) {
                    that.PlancfgPara(aSelectedLoc[0].getTitle(), "");
                }
                if(that.TempParams[index].CLASS !== undefined){
                    that.TempParams[index].CLASS = "";
                }


                if(that.TempParams[index].LOCATION_ID !== undefined){
                that.oLoc.removeAllTokens();

                // that.LocData = that.ManuLocData.filter(function (aComp) {
                //     return aComp.FACTORY_LOC === that.byId("MFLInput").getValue() ;
                // });
                // that.selDLoc = [];
                // that.LocData.forEach(function (oItem) {
                //     that.oLoc.addToken(
                //         new sap.m.Token({
                //             key: oItem.DEMAND_LOC,
                //             text: oItem.DEMAND_LOC,
                //             editable:false,

                //         })
                //     );
                //     that.selDLoc.push( oItem.DEMAND_LOC);
                // });

                // that.TempParams[index].LOCATION_ID = that.selDLoc;

                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                // if (selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION")) {
                //     that.PlancfgPara(aSelectedLoc[0].getTitle(), "");
                // }
            }

                if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                    that.oProd = that.byId("CprodInput");
                } else {
                    that.oProd = that.byId("PprodInput");
                }

                that.oProd.removeAllTokens();

                var aIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                switch (selStep) {
                    case "PREDICTION":
                        that.TempParams[index].IMPACT_ANALYSIS = that.byId("idImpact").getSelected();
                        that.TempParams[index].OVERRIDE_ASSIGNMENT = that.byId("idOverride").getSelected();
                        that.TempParams[index].DsAlgorithm = that.byId("PidDSAlg").getSelectedKey();
                        that.TempParams[index].GEN_TYPE = that.byId("GenidType").getSelectedKey();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVer").getSelectedKey();
                        that.TempParams[index].OptAlgorithm = that.byId("PidOptAlg").getSelectedKey();
                        that.TempParams[index].OptFactor = that.byId("PidOptFct").getSelectedKey();
                        break;
                    case "TIMES_SERIES_HISTORY":
                        that.TempParams[index].DAILY = that.byId("idDaily").getSelected();
                        
                        break;
                    case "MODEL_GENERATION":
                        that.TempParams[index].OVERRIDE_ASSIGNMENT = that.byId("idOverride").getSelected();
                        that.TempParams[index].GEN_TYPE = that.byId("GenidType").getSelectedKey();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVer").getSelectedKey();
    
                        break;
                    case "EXPORT_IBP_ASSEMBLY_REQ_QUANTITY":
                        that.TempParams[index].CRITICAL_ASSEMBLY = that.byId("idCritical").getSelected();
                        that.TempParams[index].Rolling_Timestamp = that.byId("idRolling").getSelected();
    
                        break;
                    case "PUBLISH_FORECAST_ORDERS":
                        that.TempParams[index].Rolling = that.byId("idRolling").getSelected();
                        that.TempParams[index].Rolling_Timestamp = that.byId("idRollingWeeks").getValue();
                        // that.TempParams[index].SnapShot = that.byId("idSnapShot").getSelected();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVer").getSelectedKey();
                        if(!that.byId("idSnapShot").getSelected()){
                            that.TempParams[index].SnapShot = "";
                        } else {
                            var selRadio = that.byId("idSnapRadio").getSelectedButton().getText();
                            if(selRadio === "Create"){
                                that.TempParams[index].SnapShot = "C";
                            } else {
                                that.TempParams[index].SnapShot = "U";
                            }
                        }
    
                        break;
                    case "STATFORECAST_FOR_CHAR_VALUES":
                        that.TempParams[index].OVERRIDE_ASSIGNMENT = that.byId("idOverride").getSelected();
                        that.TempParams[index].GEN_TYPE = that.byId("GenidType").getSelectedKey();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVer").getSelectedKey();
    
                        break;
                    case "TIMES_SERIES_HISTORY_CUST":
                        that.TempParams[index].DAILY = that.byId("idDaily").getSelected();
    
                        break;
                    case "GENERATE_FORECAST_ORDER":
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVer").getSelectedKey();
    
                        break;
                    case "PURGE_PLANNING_DATA":
                        that.TempParams[index].OPERATOR = that.byId("idOperator").getSelectedKey();
    
                        break;
                    }

                    if(selStep === "INITIALIZATION_PROCESS"){                        
                        that.ChnageData(aSelectedLoc[0].getTitle(),selStep,"MF_LOCATION_ID");
                    } else {
                        that.ChnageData(aSelectedLoc,selStep,"MFL");
                    }

            } else if (sId.includes("Loc")) {
                var aSelectedLoc = oEvent.getParameter("selectedItems");
                // that.oLoc.setValue(aSelectedLoc[0].getTitle());
                

                that.byId("idver").setValue();
                that.byId("idscen").setValue();
                that.byId("classInput").removeAllTokens();

                var selDLoc =[];

                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                if(that.LocSelType === "S"){
                    that.oLoc.setValue(aSelectedLoc[0].getCells()[0].getTitle());
                    that.TempParams[index].LOCATION_ID = aSelectedLoc[0].getCells()[0].getTitle();
                } else {
                    that.oLoc.removeAllTokens();
                    aSelectedLoc.forEach(function (oItem,i) {
                        // if(oItem.getTitle() !== "ALL"){
                        that.oLoc.addToken(
                            new sap.m.Token({
                                key: oItem.getCells()[0].getTitle(),
                                text: oItem.getCells()[0].getTitle(),
                                editable:false,

                            })
                        );
                        selDLoc.push(oItem.getCells()[0].getTitle());
                        // }
                    });
                    // if(aSelectedLoc[0].getTitle() === "ALL"){
                    //     selDLoc = "ALL";
                    // }
                }

                
                that.TempParams[index].LOCATION_ID = selDLoc;

                if(that.TempParams[index].PRODUCT_ID !== undefined){
                    that.TempParams[index].PRODUCT_ID = "";
                }
                if(that.TempParams[index].VERSION !== undefined){
                    that.TempParams[index].VERSION = "";
                    that.TempParams[index].SCENARIO = "";
                }
                if(that.TempParams[index].CLASS !== undefined){
                    that.TempParams[index].CLASS = "";
                }

                // if (selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION")) {
                //     that.PlancfgPara(aSelectedLoc[0].getTitle(), "");
                // }

                var selStep = that.byId("idarrowTitle").getText();
                var aData = that.ActivityItems;
                var filterActivites = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID.includes("PRODUCT");
                });

                if(filterActivites.length > 0){

                if (filterActivites[0].OPTION_SELECT === "M") {
                    if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT") {
                        that.oProd = that.byId("PprodInput");
                    } else {
                        that.oProd = that.byId("CprodInput");
                    }
                    that.oProd.removeAllTokens();
                } else {
                    if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT") {
                        that.byId("PprodInput").setValue("");
                        that.oProd = that.byId("PprodInput");
                    } else {
                        that.byId("CprodInput").setValue("");
                        that.oProd = that.byId("CprodInput");
                    }
                }
            }


            // that.ChnageData(aSelectedLoc,selStep,"DL");
            if(selStep === "INITIALIZATION_PROCESS"){ 
                // var loc=""; 
                // aSelectedLoc.forEach(function (oItem) {
                //     if(oItem.getTitle() !== "ALL"){
                //         if(loc = ""){
                //             loc = loc;
                //         } else {
                //         loc = loc + "," + oItem.getTitle();
                //         }
                //     }
                // });     
                selDLoc = JSON.stringify(selDLoc);                 
                that.ChnageData(selDLoc,selStep,"LOCATION_ID");
            } else {
                that.ChnageData(aSelectedLoc,selStep,"DL");
            }
 
            } else if (sId.includes("prod")) {
                var aSelectedProd = oEvent.getParameter("selectedItems");
                var selProd = [];
                if (that.ProdSelType === "M") {
                    that.oProd.removeAllTokens();
                    aSelectedProd.forEach(function (oItem) {
                        // if(oItem.getTitle() !== "ALL"){
                        selProd.push(oItem.getCells()[0].getTitle());
                        that.oProd.addToken(
                            new sap.m.Token({
                                key: oItem.getCells()[0].getTitle(),
                                text: oItem.getCells()[0].getTitle(),
                                editable: false,

                            })
                        );
                    // }
                    });
                } else {
                    that.oProd.setValue(aSelectedProd[0].getCells()[0].getTitle().getTitle());
                    selProd = aSelectedProd[0].getCells()[0].getTitle().getTitle();
                }

                that.byId("idver").setValue("");
                that.byId("idscen").setValue("");
                that.byId("classInput").removeAllTokens();;

                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                that.TempParams[index].PRODUCT_ID = selProd;
                
                if(that.TempParams[index].VERSION !== undefined){
                    that.TempParams[index].VERSION = "";
                    that.TempParams[index].SCENARIO = "";
                }
                if(that.TempParams[index].CLASS !== undefined){
                    that.TempParams[index].CLASS = "";
                }

                // // if (that.TempParams[index].VERSION !== "") {
                // //     that.TempParams[index].VERSION === "";
                // // }
                // // if (that.TempParams[index].SCENARIO !== "") {
                // //     that.TempParams[index].SCENARIO === "";
                // // }

                // // that.getVersion(that.ProdSelType, selStep);
                // that.ChnageData(aSelectedProd,selStep,"PROD");

                if(selStep === "INITIALIZATION_PROCESS"){ 
                    // var prod=""; 
                    // aSelectedProd.forEach(function (oItem) {
                    //     if(oItem.getTitle() !== "ALL"){
                    //         if(prod = ""){
                    //             prod = prod;
                    //         } else {
                    //             prod = prod + "," + oItem.getTitle();
                    //         }
                    //     }
                    // });   
                    selProd = JSON.stringify(selProd);                   
                    that.ChnageData(selProd,selStep,"PRODUCT_ID");
                } else {
                    that.ChnageData(aSelectedProd,selStep,"PROD");
                }

            } else if (sId.includes("Ver")) {
                var aSelectedVer = oEvent.getParameter("selectedItems");
                // that.byId("idver").setValue(aSelectedVer[0].getTitle());
                that.byId("idver").setValue(aSelectedVer[0].getTitle());

                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                that.TempParams[index].VERSION = aSelectedVer[0].getTitle();
                that.TempParams[index].SCENARIO = "";

                that.byId("idscen").setValue();

                // if (index !== -1) {
                //     that.TempParams[index].VERSION = aSelectedVer[0].getTitle();
                //     that.TempParams[index].SCENARIO = "";
                // }

                // that.getScenario(that.ProdSelType, selStep);
                that.ChnageData(aSelectedVer[0].getTitle(),selStep,"VERSION");
            } else if (sId.includes("scen")) {
                var aSelectedScen = oEvent.getParameter("selectedItems");
                that.byId("idscen").setValue(aSelectedScen[0].getTitle());
                
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].SCENARIO = aSelectedScen[0].getTitle();

                // if (index !== -1) {
                //     that.TempParams[index].SCENARIO = aSelectedScen[0].getTitle();
                // }
                that.ChnageData(aSelectedScen[0].getTitle(),selStep,"SCENARIO");
            } else if (sId.includes("Class")) {
                var aSelectedClass = oEvent.getParameter("selectedItems");
                
                that.oClass = that.byId("classInput");
                var selClass = [];
                    that.oClass.removeAllTokens();
                    aSelectedClass.forEach(function (oItem) {
                        if(oItem.getTitle() !== "ALL"){
                        selClass.push(oItem.getTitle());
                        that.oClass.addToken(
                            new sap.m.Token({
                                key: oItem.getTitle(),
                                text: oItem.getTitle(),
                                editable: false,

                            })
                        );
                    }
                    });

                    var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

               that.TempParams[index].CLASS = selClass;

                that.ChnageData(aSelectedClass,selStep,"CLASS");


            }  else if (sId.includes("CustGroupSlctList")) {
                var aSelectedCustGroup = oEvent.getParameter("selectedItems");
                // that.byId("idver").setValue(aSelectedCustGroup[0].getTitle());
                that.byId("custGrpInput").setValue(aSelectedCustGroup[0].getTitle());

                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                that.TempParams[index].CUSTOMER_GROUP = aSelectedCustGroup[0].getTitle();
                
                that.ChnageData(aSelectedCustGroup[0].getTitle(),selStep,"CUSTOMER_GROUP");
            } else if (sId.includes("ppfSlctList")) {
                var aSelectedPPF = oEvent.getParameter("selectedItems");
                that.byId("PrePFInput").setValue(aSelectedPPF[0].getTitle());
                
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].PREDICTION_PROFILE = aSelectedPPF[0].getTitle();
                // }
                // if (index !== -1) {
                //     that.TempParams[index].PREDICTION_PROFILE = aSelectedPPF[0].getTitle();

                // } else {
                //     var obj = {
                //         ACTIVITY_ID: selStep,
                //         PREDICTION_PROFILE: aSelectedPPF[0].getTitle()
                //     }

                //     that.TempParams.push(obj);
                // }
                that.ChnageData(aSelectedPPF[0].getTitle(),selStep,"PREDICTION_PROFILE");
            } else if (sId.includes("TempSlctList")) {

                var aSelectedTemp = oEvent.getParameter("selectedItems");
                that.byId("idTempValue").setValue(aSelectedTemp[0].getTitle());
                that.byId("idJobname").setValue(aSelectedTemp[0].getDescription());
                that.LEVEL = aSelectedTemp[0].getInfo();

                if(that.LEVEL === "External" || that.LEVEL === ""){
                    that.LEVEL = "E";
                } else if(that.LEVEL === "Internal"){
                    that.LEVEL = "I";
                }
                // that.onJobnamevalidation();
                that.byId("idJobSchtype").setSelectedKey("Im");
                that.onJobTypeChange();

                // var i = aSelectedTemp[0].mBindingInfos.title.binding.oContext.sPath.split("/TemplateItems/")[1];
                var string = aSelectedTemp[0].getTitle();
                var steps = that.TemplateDetail.filter(function (aComp) {
                    return aComp.TEMPLATE_ID === string;
                });
                that.MaxStep = steps[0].STEPS;
                that.onSelTemp();
                // that.onRecurrence();
                that.UniParamaters = [];

                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readTemplateItems", {
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, aSelectedTemp[0].getTitle()),
                              new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")], and:true,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();

                        that.TemplateItems = oData.results;
                        that.TemplateItems = that.TemplateItems.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readTemplateItemsParams", {
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, aSelectedTemp[0].getTitle()),
                    new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")], and:true,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.TempParams = [];
                        that.UniParamaters = oData.results;
                        for (var i = 0; i < oData.results.length; i++) {
                            var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === oData.results[i].ACTIVITY_ID &&
                                e.ACT_POSITION === oData.results[i].ACT_POSITION);
                            if (oData.results[i].ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS") {
                                that.PublishFO = that.PublishFO + 1;
                            }

                            if(oData.results[i].PARAMETER_ID === "LOCATION_ID" || oData.results[i].PARAMETER_ID === "PRODUCT_ID"){
                                var temp = oData.results[i].VALUE;
                                var aray = Array.isArray(temp);
                                    if(aray === false){
                                    if(temp.includes(",") && temp !== ""){
                                        oData.results[i].VALUE = oData.results[i].VALUE.split(",");
                                    } else {
                                        oData.results[i].VALUE = [];
                                        oData.results[i].VALUE.push(temp);
                                    }
                                }
                            }

                            if (index === -1) {
                                var test = oData.results[i].PARAMETER_ID;
                                var obj = {
                                    TEMPLATE_ID: oData.results[i].TEMPLATE_ID,
                                    ACTIVITY_ID: oData.results[i].ACTIVITY_ID,
                                    ACT_POSITION: oData.results[i].ACT_POSITION,
                                    [test]: oData.results[i].VALUE,

                                }
                                that.TempParams.push(obj);
                                // if(test === "DATE_RANGE"){
                                //     var obj1 = {
                                //         TEMPLATE_ID: oData.results[i].TEMPLATE_ID,
                                //         ACTIVITY_ID: oData.results[i].ACTIVITY_ID,
                                //         ACT_POSITION: oData.results[i].ACT_POSITION,
                                //         [FROM_DATE]: oData.results[i].VALUE,
    
                                //     }
                                //     var obj2 = {
                                //         TEMPLATE_ID: oData.results[i].TEMPLATE_ID,
                                //         ACTIVITY_ID: oData.results[i].ACTIVITY_ID,
                                //         ACT_POSITION: oData.results[i].ACT_POSITION,
                                //         [TO_DATE]: oData.results[i].VALUE,
    
                                //     }

                                //     that.TempParams.push(obj);
                                // }
                            } else {
                                var test = oData.results[i].PARAMETER_ID;
                                that.TempParams[index][test] = oData.results[i].VALUE;

                            }
                        }
                        
                    that.divideDatatoSend();


                        if (that.PublishFO > 0) {
                            that.getUserData();
                        }
                        //   that.TempParams = oData.results;
                        if (that.byId("CreateWizard")._aStepPath.length === 3) {
                            that.onValidation();
                        }

                        
                        if(that.TempParams.length > 0){
                            that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                            

                        if(that.TempParams[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                            var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                            that.byId("FromDate").setMaxDate(tempDate);
                            that.byId("ToDate").setMaxDate(tempDate);
                            that.byId("FromDate").setMinDate(null);
                            that.byId("ToDate").setMinDate(null);
                        } else if(that.TempParams[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                            that.byId("FromDate").setMinDate(null);
                            that.byId("ToDate").setMinDate(null);
                            that.byId("FromDate").setMaxDate(null);
                            that.byId("ToDate").setMaxDate(null);
                        } else {
                            that.byId("FromDate").setMaxDate(null);
                            that.byId("ToDate").setMaxDate(null);
                            that.byId("FromDate").setMinDate(new Date());
                            that.byId("ToDate").setMinDate(new Date());
                        }
                    }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

            }
        } else {
            if(sId.includes("MFL")){
                var aSelectedLoc = oEvent.getParameter("selectedItems");
                // sap.ui.getCore.byId("MFLInputU").setValue(aSelectedLoc[0].getTitle());
                that.oMFLocUni.removeAllTokens();
                    aSelectedLoc.forEach(function (oItem,i) {
                        that.oMFLocUni.addToken(
                            new sap.m.Token({
                                key: aSelectedLoc[i].getCells()[0].getTitle(),
                                text: aSelectedLoc[i].getCells()[0].getTitle(),
                                editable:false,

                            })
                        );
                        
                    });
            } else if(sId.includes("Loc")){
                var aSelectedLoc = oEvent.getParameter("selectedItems");

                that.oLocUni.removeAllTokens();
                    aSelectedLoc.forEach(function (oItem,i) {
                        that.oLocUni.addToken(
                            new sap.m.Token({
                                key: aSelectedLoc[i].getCells()[1].getTitle(),
                                text: aSelectedLoc[i].getCells()[0].getTitle(),
                                editable:false,

                            })
                        );
                        
                    });
            } else if(sId.includes("prod")){
                var aSelectedProd = oEvent.getParameter("selectedItems");

                that.oProdUni.removeAllTokens();
                aSelectedProd.forEach(function (oItem,i) {
                        that.oProdUni.addToken(
                            new sap.m.Token({
                                key: aSelectedProd[i].getCells()[1].getTitle(),
                                text: aSelectedProd[i].getCells()[0].getTitle(),
                                editable:false,

                            })
                        );
                        
                    });
            } else if(sId.includes("Ver")){
                var aSelectedScen = oEvent.getParameter("selectedItems");
                sap.ui.getCore().byId("idverU").setValue(aSelectedScen[0].getTitle());
            } else if(sId.includes("scen")){
                var aSelectedScen = oEvent.getParameter("selectedItems");
                sap.ui.getCore().byId("idscenU").setValue(aSelectedScen[0].getTitle());
            } else if (sId.includes("CustGroupSlctList")) {

            } else if (sId.includes("ppfSlctList")) {
                var aSelectedPPF = oEvent.getParameter("selectedItems");
                sap.ui.getCore().byId("PrePFInputU").setValue(aSelectedPPF[0].getTitle());

            }



        }
            that.handleClose(oEvent);

        },

        PlancfgPara: function (oLoc, gentype) {

            var selLoc = oLoc,
                genType = gentype;

            that.getModel("BModel").read("/getPlancfgPara", {
                filters: [
                    new Filter("LOCATION_ID", FilterOperator.EQ, selLoc),
                    new Filter("PARAMETER_ID", FilterOperator.EQ, "5"),
                ],
                success: function (oData) {
                    if (oData.results.length) {
                        if (oData.results[0].VALUE === "M1") {
                            that.typeData = {
                                "Types": [{
                                    "name": "Restrictions",
                                    "key": "RT"
                                }, {
                                    "name": "Object Dependency",
                                    "key": "OD"
                                }]
                            };
                        } else if (oData.results[0].VALUE === "M2") {
                            // that.typeData = {
                            //     "Types": [{ "name": "Restrictions", "key": "RT" },
                            //               { "name": "Primary", "key": "PI" }]
                            // };

                            that.typeData = {
                                "Types": [{
                                    "name": "Primary",
                                    "key": "PI"
                                }]
                            };
                        }
                        var jmodel = [];
                        jmodel = new sap.ui.model.json.JSONModel(that.typeData);

                        that.getView().byId("GenidType").setModel(jmodel);

                        if (gentype !== "") {
                            that.byId("GenidType").setSelectedKey(genType);
                        } else {
                            that.byId("GenidType").setSelectedKey(that.typeData.Types[0].key);
                        }

                        var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                    var aIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                    
                    that.TempParams[aIndex].GEN_TYPE = that.byId("GenidType").getSelectedKey();
                    // that.TempParams[index].GEN_TYPE = that.typeData.Types[0].key;
                    }
                },
                error: function (oData, error) {
                    MessageToast.show("error");
                },
            });

        },

        onJobnamevalidation: function (oEvent) {
            var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
            var name = that.byId("idJobname").getValue();

            var jobName = specials.test(name);

            if (jobName === false) {
                this.byId("CreateWizard").validateStep(this.byId("scheduleStep"));
                that.byId("scheduleStep").setValidated(true);

                this.byId("CreateWizard").validateStep(this.byId("TempTypeStep"));
                that.byId("TempTypeStep").setValidated(true);

                that.byId("FormToolbar").setVisible(true);
                that.byId("idJobname").setValueState("None");
                that.byId("idarrow").setVisible(true);
                that.byId("idParameter").setVisible(true);
                that.byId("idcreate").setVisible(true);
                that.byId("idUniversal").setVisible(true);
            } else {
                this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                that.byId("scheduleStep").setValidated(false);

                this.byId("CreateWizard").invalidateStep(this.byId("TempTypeStep"));
                that.byId("TempTypeStep").setValidated(false);

                that.byId("FormToolbar").setVisible(false);
                that.byId("idJobname").setValueState("Error");
                that.byId("idJobname").setValueStateText("Special characters are not allowed");

                that.byId("idarrow").setVisible(false);
                that.byId("idParameter").setVisible(false);
                that.byId("idcreate").setVisible(false);
                that.byId("idUniversal").setVisible(false);
            }

        },

        getDemandLocation:function(){
            // that.LocData = that.ManuLocData.filter(function (aComp) {
            //     return aComp.FACTORY_LOC === that.byId("MFLInput").getValue() ;
            // });
            // that.LocData.forEach(el => {
            //     el.LOCATION_ID = el.DEMAND_LOC;
            //     el.LOCATION_DESC = el.DEMAND_DESC;
            // });

            this.getModel("BModel").read("/getfactorylocdesc", {
                filters: [new Filter("FACTORY_LOC", FilterOperator.EQ, that.byId("MFLInput").getValue()) ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.LocData = oData.results;

                    function removeDuplicate(array, key) {
                        var check = new Set();
                        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }

                    that.LocData = removeDuplicate(oData.results, 'DEMAND_LOC');
                    
                    




                    that.LocData.forEach(el => {
                        el.LOCATION_ID = el.DEMAND_LOC;
                        el.LOCATION_DESC = el.DEMAND_DESC;
                    });

                    var selStep = that.getView().byId("idarrowTitle").getText();

        
                    var aData = that.ActivityItems;
                var filterActivites = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATION";
                    });
        
                    if (filterActivites[0].OPTION_SELECT === "M" ) {
                        that.LocSelType = "M";
                        sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(true);
        
                        // if (that.LocData.length > 0) {
                        //     that.LocData.unshift({
                        //         LOCATION_ID: "ALL",
                        //         LOCATION_DESC: "ALL",
                        //     });
                        // }
                    } else if (filterActivites[0].OPTION_SELECT === "S" ) {
                        that.LocSelType = "S";
                        sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(false);
                        sap.ui.getCore().byId("LocSlctListJSS").setRememberSelections(false);
                    }
                    that.locModel = new JSONModel();
                    that.locModel.setSizeLimit(that.LocData.length);
                    sap.ui.getCore().byId("LocSlctListJSS").setGrowingThreshold(that.LocData.length);
        
                    that.locModel.setData({
                        Locitems: that.LocData
                    });
                    that.oLocList.setModel(that.locModel);
        
                    var locTokens = that.oLoc.getTokens();
        
                    if(locTokens.length > 0){
                        var tempPdata = locTokens[0].getText();
                        if(tempPdata.includes(",") === true){
                            locTokens = locTokens.split(",");
                        }
        
                    if(locTokens.length > 0 && (locTokens[0].getText() === "ALL" || locTokens.length === (that.LocData.length - 1))){
                        that._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
                    } else {
                        for (var i = 0; i < locTokens.length; i++) {
                            for (var j = 0; j < that.LocData.length; j++) {
                                if (that.LocData[j].LOCATION_ID === locTokens[i].getText()) {
                                    sap.ui.getCore().byId("LocSlctListJSS").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }
                        
                    }
                }
                    
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get location data");
                },
            });
                
        //     var selStep = that.getView().byId("idarrowTitle").getText();

        
        //     var aData = that.ActivityItems;
        // var filterActivites = aData.filter(function (aComp) {
        //     return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATION";
        //     });

        //     if (filterActivites[0].OPTION_SELECT === "M" ) {
        //         that.LocSelType = "M";
        //         sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(true);

        //         if (that.LocData.length > 0) {
        //             that.LocData.unshift({
        //                 LOCATION_ID: "ALL",
        //                 LOCATION_DESC: "ALL",
        //             });
        //         }
        //     } else if (filterActivites[0].OPTION_SELECT === "S" ) {
        //         that.LocSelType = "S";
        //         sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(false);
        //         sap.ui.getCore().byId("LocSlctListJSS").setRememberSelections(false);
        //     }
        //     that.locModel = new JSONModel();
        //     that.locModel.setSizeLimit(1000);

        //     that.locModel.setData({
        //         Locitems: that.LocData
        //     });
        //     that.oLocList.setModel(that.locModel);

        //     var locTokens = that.oLoc.getTokens();

        //     if(locTokens.length > 0){
        //         var tempPdata = locTokens[0].getText();
        //         if(tempPdata.includes(",") === true){
        //             locTokens = locTokens.split(",");
        //         }

        //     if(locTokens.length > 0 && (locTokens[0].getText() === "ALL" || locTokens.length === (that.LocData.length - 1))){
        //         this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
        //     } else {
        //         for (var i = 0; i < locTokens.length; i++) {
        //             for (var j = 0; j < that.LocData.length; j++) {
        //                 if (that.LocData[j].LOCATION_ID === locTokens[i].getText()) {
        //                     sap.ui.getCore().byId("LocSlctListJSS").getItems()[j].setSelected(true);
        //                     break;
        //                 }
        //             }
        //         }
                
        //     }
        // }
        //     // for (var i = 0; i < locTokens.length; i++) {
        //     //     for (var j = 0; j < that.LocData.length; j++) {
        //     //         if (that.LocData[j].LOCATION_ID === locTokens[i].getText()) {
        //     //             sap.ui.getCore().byId("LocSlctListJSS").getItems()[j].setSelected(true);
        //     //             break;
        //     //         }
        //     //     }
        //     // }

        //     // that.oLoc.removeAllTokens();



        },

        getProducts: function () {
            //Single select or multi select

            // var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
            var selStep = that.byId("idarrowTitle").getText(),
                step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
            var aData = that.ActivityItems;
            var filterActivites = aData.filter(function (aComp) {
                return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID.includes("PRODUCT");
            });

            if (filterActivites[0].OPTION_SELECT === "M") {
                if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT") {
                    that.oProd = that.byId("PprodInput");
                } else {
                    that.oProd = that.byId("CprodInput");
                }
                // that.oProd.removeAllTokens();
                this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
            } else {
                if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT") {
                    // that.byId("PprodInput").setValue("");
                    that.oProd = that.byId("PprodInput");
                } else {
                    // that.byId("CprodInput").setValue("");
                    that.oProd = that.byId("CprodInput");
                }
            }

            var selectionType = filterActivites[0].OPTION_SELECT;
            // if (that.byId("MF_LOCATION").getVisible() === true) {
            //     that.oLoc = that.byId("MlocInput");
            // } else {
            //     that.oLoc = that.byId("DlocInput");
            // }
            that.oLoc = that.byId("DlocInput");
            var oFilters = [];
                    that.TempLocData = [];
            if(that.byId("DM_LOCATION").getVisible() === true){
                    var aSelectedLoc = that.oLoc.getTokens();
                     for (var i = 0; i < aSelectedLoc.length; i++) {
                        //  if (aSelectedLoc[i].getText() !== "ALL") {
                            that.TempLocData.push(aSelectedLoc[i].getText());
                             sFilter = new sap.ui.model.Filter({
                                 path: "LOCATION_ID",
                                 operator: sap.ui.model.FilterOperator.EQ,
                                 value1: aSelectedLoc[i].getText(),
                             });
                             oFilters.push(sFilter);
                        //  }
                     }
                } else {
                    that.oMFLoc = that.byId("MFLInput");
                    that.TempLocData.push(that.oMFLoc.getValue());
                    var sFilter = new sap.ui.model.Filter({
                        path: "LOCATION_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: that.oMFLoc.getValue(),
                    });
                    oFilters.push(sFilter);
                }


            if (filterActivites[0].PARAMETER_ID !== "PARTIAL_PRODUCT") {

                // Calling sercive to get the Product list
                this.getModel("BModel").read("/getLocProdDet", {
                    // filters: [new Filter("LOCATION_ID", FilterOperator.EQ, that.oLoc.getValue()), ],
                    filters: oFilters,
                    success: function (oData) {

                        that.jobtypeProduct(oData, selectionType);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });
            } else {
                // that.getModel("BModel").callFunction("/getAllProd", {
                //     method: "GET",
                //     urlParameters: {
                //         LOCATION_ID: that.oLoc.getValue()
                //     },
                that.getModel("BModel").callFunction("/getAllProdNew", {
                    method: "GET",
                    urlParameters: {
                        LOC: JSON.stringify(that.TempLocData),
                    },
                    success: function (oData) {
                        that.jobtypeProduct(oData, selectionType);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });
            }

        },

        jobtypeProduct: function (data, type) {
            var aData = data,
                selectionType = type;

            if (selectionType === "M") {
                that.ProdSelType = "M";
                sap.ui.getCore().byId("prodSlctListJSS").setMultiSelect(true);

                // if (data.results.length > 0) {
                //     data.results.unshift({
                //         PRODUCT_ID: "ALL",
                //         PROD_DESC: "ALL",
                //     });
                // }
            } else if (selectionType === "S") {
                that.ProdSelType = "S";
                sap.ui.getCore().byId("prodSlctListJSS").setMultiSelect(false);
                sap.ui.getCore().byId("prodSlctListJSS").setRememberSelections(false);
            }

            function removeDuplicate(array, key) {
                var check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            }
            that.prodModel = new JSONModel();
            that.prodModel.setSizeLimit(data.results.length);
            sap.ui.getCore().byId("prodSlctListJSS").setGrowingThreshold(data.results.length)

            that.prodModel.setData({
                results: removeDuplicate(data.results, 'PRODUCT_ID')
            });

            // that.prodModel = new JSONModel();
            // that.prodModel.setData(data);
            that.oProdList.setModel(that.prodModel);

            var prodTokens = that.oProd.getTokens();
            if(prodTokens.length > 0){
            var tempPdata = prodTokens[0].getText();
            if(tempPdata.includes(",") === true){
                prodTokens = prodTokens.split(",");
            }
        

            var Products = removeDuplicate(data.results, 'PRODUCT_ID');

            if(prodTokens[0].getText() === "ALL" || prodTokens.length === (Products.length - 1)){
                this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
            } else {
                for (var i = 0; i < prodTokens.length; i++) {
                    for (var j = 0; j < Products.length; j++) {
                        if (Products[j].PRODUCT_ID === prodTokens[i].getText()) {
                            sap.ui.getCore().byId("prodSlctListJSS").getItems()[j].setSelected(true);
                            break;
                        }
                    }
                }               
            }
        }
            // if(prodTokens.length > 0){
            //     for (var i = 0; i < prodTokens.length; i++) {
            //         for (var j = 0; j < data.results.length; j++) {
            //             if (data.results[j].PRODUCT_ID === prodTokens[i].getText()) {
            //                 sap.ui.getCore().byId("prodSlctListJSS").getItems()[j].setSelected(true);
            //                 break;
            //             }
            //         }
            //     }
            // }



        },

         /**
         * This function is called when Selecting or Unselecting of a items in Product dialog.
         * @param {object} oEvent -the event information.
         */
         handleDemdLocChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("LocSlctListJSS").getItems();
            var oSelItems = this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].getSelectedItems();
            var tabItems = sap.ui.getCore().byId("LocSlctListJSS").getItems();
            if (tabItems[0].getTitle() === "ALL") {
                if (
                    oSelected === "ALL" &&
                    oEvent.getParameter("selected") &&
                    aItems.length !== 1
                ) {
                    this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
                } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
                    this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].removeSelections();
                } else if (oSelected === "ALL" && aItems.length === 1) {
                    sap.ui.getCore().byId("LocSlctListJSS").getItems()[0].setSelected(false);
                } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                    sap.ui.getCore().byId("LocSlctListJSS").getItems()[0].setSelected(false);
                } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                    sap.ui.getCore().byId("LocSlctListJSS").getItems()[0].setSelected(true);
                }
            }
        },

        /**
         * This function is called when Selecting or Unselecting of a items in Product dialog.
         * @param {object} oEvent -the event information.
         */
        handleProdChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("prodSlctListJSS").getItems();
            var oSelItems = this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();
            var tabItems = sap.ui.getCore().byId("prodSlctListJSS").getItems();
            if (tabItems[0].getTitle() === "ALL") {
                if (
                    oSelected === "ALL" &&
                    oEvent.getParameter("selected") &&
                    aItems.length !== 1
                ) {
                    this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
                } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
                    this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
                } else if (oSelected === "ALL" && aItems.length === 1) {
                    sap.ui.getCore().byId("prodSlctListJSS").getItems()[0].setSelected(false);
                } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                    sap.ui.getCore().byId("prodSlctListJSS").getItems()[0].setSelected(false);
                } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                    sap.ui.getCore().byId("prodSlctListJSS").getItems()[0].setSelected(true);
                }
            }
        },

        handleClassChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("ClassSlctListJSS").getItems();
            var oSelItems = this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].getSelectedItems();
            var tabItems = sap.ui.getCore().byId("ClassSlctListJSS").getItems();
            if(tabItems[0].getTitle() === "ALL"){
            if (
                oSelected === "ALL" &&
                oEvent.getParameter("selected") &&
                aItems.length !== 1
            ) {
                this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].selectAll();
            } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
                this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].removeSelections();
            } else if (oSelected === "ALL" && aItems.length === 1) {
                sap.ui.getCore().byId("ClassSlctListJSS").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("ClassSlctListJSS").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("ClassSlctListJSS").getItems()[0].setSelected(true);
            }
        }
        },

        /**
         * This function is called when Location and product is selected.
         * In this function we will get the Versions.
         */
        getVersion: function (activity) {
            var verFlag = "";
            var ActivityId = activity;

            if(ActivityId !== "SNAPSHOT"){
            if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                that.oProd = that.byId("CprodInput");
                verFlag = "X";
            } else {
                that.oProd = that.byId("PprodInput");
                verFlag = "";
            }

            var loc = "";
            that.TempLocData = [];
                if(that.byId("DM_LOCATION").getVisible() === true){
                    loc = that.oLoc.getTokens();
                    var token = "X";
                } else {
                    loc = that.oMFLoc.getValue();
                    var token = "";
                }

            var selectionType;
            if (that.oProd.getValue() === "" && that.oProd.getTokens().length > 0) {
                selectionType = "M";
            } else if (that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                selectionType = "S";
            }
           
            var oFilters = [];
            if(token === ""){
                var sFilter = new sap.ui.model.Filter({
                    path: "LOCATION_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: loc,
                });
                oFilters.push(sFilter);
                that.TempLocData.push(loc);
            } else {
                for (var i = 0; i < loc.length; i++) {
                    if (loc[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "LOCATION_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: loc[i].getText(),
                        });
                        oFilters.push(sFilter);
                        that.TempLocData.push(loc[i].getText());
                    }
                }
            }

            if(verFlag === ""){
                if (selectionType === "M") {
                    var aSelectedProd = that.oProd.getTokens();
                    for (var i = 0; i < aSelectedProd.length; i++) {
                        if (aSelectedProd[i].getText() !== "ALL") {
                            sFilter = new sap.ui.model.Filter({
                                path: "PRODUCT_ID",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: aSelectedProd[i].getText(),
                            });
                            oFilters.push(sFilter);
                        }
                    }
                } else if (selectionType === "S") {
                    var sFilter = new sap.ui.model.Filter({
                        path: "PRODUCT_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: that.oProd.getValue(),
                    });
                    oFilters.push(sFilter);
                }
            } else {
                if (selectionType === "M") {
                    var aSelectedProd = that.oProd.getTokens();
                    for (var i = 0; i < aSelectedProd.length; i++) {
                        if (aSelectedProd[i].getText() !== "ALL") {
                            sFilter = new sap.ui.model.Filter({
                                path: "REF_PRODID",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: aSelectedProd[i].getText(),
                            });
                            oFilters.push(sFilter);
                        }
                    }
                } else if (selectionType === "S") {
                    var sFilter = new sap.ui.model.Filter({
                        path: "REF_PRODID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: that.oProd.getValue(),
                    });
                    oFilters.push(sFilter);
                }
            }
        }
            if (ActivityId === "PUBLISH_FORECAST_ORDERS" || ActivityId === "STATFORECAST_FOR_CHAR_VALUES") {
                // that.getModel("BModel").callFunction("/getAllVerScen", {
                //     method: "GET",
                //     urlParameters: {
                        // LOCATION_ID: loc[0],
                //         // PRODUCT_ID : that.oProd.getValue()
                //     },
                that.getModel("BModel").callFunction("/getAllVerScenMulti", {
                    method: "GET",
                    urlParameters: {
                        LOC: JSON.stringify(that.TempLocData)
                    },

                    success: function (oData, oResponse) {
                        var adata = [];
                        var prodToken = that.oProd.getTokens();
                        that.totalversions = oData.results;
                        if(verFlag === ""){
                        for (var i = 0; i < oData.results.length; i++) {
                            for (var j = 0; j < prodToken.length; j++) {
                                if (oData.results[i].PRODUCT_ID === prodToken[j].getText()) {
                                adata.push({
                                    "VERSION_NAME": oData.results[i].VERSION,
                                    "VERSION": oData.results[i].VERSION
                                });
                            }
                        }
                        }
                    } else {
                        for (var i = 0; i < oData.results.length; i++) {
                            for (var j = 0; j < prodToken.length; j++) {
                                if (oData.results[i].REF_PRODID === prodToken[j].getText()) {
                                adata.push({
                                    "VERSION_NAME": oData.results[i].VERSION,
                                    "VERSION": oData.results[i].VERSION
                                });
                            }
                        }
                        }
                    }

                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.verModel = new JSONModel();
                        that.verModel.setData({
                            results: removeDuplicate(adata, 'VERSION')
                        });
                        // if (adata.length > 0) {
                        // that.verModel.setData({
                        //     results: adata
                        // });
                        that.oVerList.setModel(that.verModel);
                        // }
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Failed to get Version!");
                    },
                });

            // } else if(ActivityId === "IMPORT_IBP_DEMAND_FUTURE"){
            } else{

                this.getModel("BModel").read("/getVerScnmaster", {
                    success: function (oData) {
                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.verModel = new JSONModel();
                        that.verModel.setData({
                            results: removeDuplicate(oData.results, 'VERSION')
                        });

                        that.oVerList.setModel(that.verModel);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });


            } 
            // else {
            //     // Calling sercive to get the IBP Versions list
            //     this.getModel("BModel").read("/getIbpVerScn", {
            //         filters: oFilters,
            //         success: function (oData) {
            //             function removeDuplicate(array, key) {
            //                 var check = new Set();
            //                 return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //             }
            //             that.verModel = new JSONModel();
            //             that.verModel.setData({
            //                 results: removeDuplicate(oData.results, 'VERSION')
            //             });

            //             that.oVerList.setModel(that.verModel);
            //         },
            //         error: function (oData, error) {
            //             MessageToast.show("error");
            //         },
            //     });
            // }
        },

        /**
         * This function is called when Scenario is selected.
         * In this function we will get the Scenario for the selected version.
         * @param {object} oEvent -the event information.
         */
        getScenario: function (activity) {
            var verFlag = "";
            if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                that.oProd = that.byId("CprodInput");
                var verFlag = "X";
            } else {
                that.oProd = that.byId("PprodInput");
                var verFlag = "";
            }

            var selectionType;
            if (that.oProd.getValue() === "" && that.oProd.getTokens().length > 0) {
                selectionType = "M";
            } else if (that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                selectionType = "S";
            }
            var ActivityId = activity;

            var loc = "";
            that.TempLocData = [];
                if(that.byId("DM_LOCATION").getVisible() === true){
                    loc = that.oLoc.getTokens();
                    var token = "X";
                } else {
                    loc = that.oMFLoc.getValue();
                    var token = "";
                }
            var oFilters = [];
            if(token === ""){
                var sFilter = new sap.ui.model.Filter({
                    path: "LOCATION_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: loc,
                });
                oFilters.push(sFilter);
                that.TempLocData.push(loc);
            } else {
                for (var i = 0; i < loc.length; i++) {
                    if (loc[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "LOCATION_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: loc[i].getText(),
                        });
                        oFilters.push(sFilter);
                that.TempLocData.push(loc[i].getText());

                    }
                }
            }

            var sFilter = new sap.ui.model.Filter({
                path: "VERSION",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: that.byId("idver").getValue(),
            });
            oFilters.push(sFilter);

            if(verFlag === ""){
            if (selectionType === "M") {
                var aSelectedProd = that.oProd.getTokens();
                for (var i = 0; i < aSelectedProd.length; i++) {
                    if (aSelectedProd[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "PRODUCT_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: aSelectedProd[i].getText(),
                        });
                        oFilters.push(sFilter);
                    }
                }
            } else if (selectionType === "S") {
                var sFilter = new sap.ui.model.Filter({
                    path: "PRODUCT_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: that.oProd.getValue(),
                });
                oFilters.push(sFilter);
            }
        } else {
            if (selectionType === "M") {
                var aSelectedProd = that.oProd.getTokens();
                for (var i = 0; i < aSelectedProd.length; i++) {
                    if (aSelectedProd[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "REF_PRODID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: aSelectedProd[i].getText(),
                        });
                        oFilters.push(sFilter);
                    }
                }
            } else if (selectionType === "S") {
                var sFilter = new sap.ui.model.Filter({
                    path: "REF_PRODID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: that.oProd.getValue(),
                });
                oFilters.push(sFilter);
            }
        }

            if (ActivityId === "PUBLISH_FORECAST_ORDERS" || ActivityId === "STATFORECAST_FOR_CHAR_VALUES") {
                // that.getModel("BModel").callFunction("/getAllVerScen", {
                //     method: "GET",
                //     urlParameters: {
                //         LOCATION_ID: that.oLoc.getValue(),
                //         // PRODUCT_ID : that.oProd.getValue()
                //     },
                that.getModel("BModel").callFunction("/getAllVerScenMulti", {
                    method: "GET",
                    urlParameters: {
                        LOC: JSON.stringify(that.TempLocData)
                    },

                    success: function (oData, oResponse) {
                        var adata = [];
                        var prodToken = that.oProd.getTokens();
                        var version = that.byId("idver").getValue();
                        if(verFlag === ""){
                            for (var i = 0; i < oData.results.length; i++) {
                                for (var j = 0; j < prodToken.length; j++) {
                                    if (oData.results[i].PRODUCT_ID === prodToken[j].getText() &&
                                        oData.results[i].VERSION === version) {
                                        adata.push({
                                            "SCENARIO_NAME": oData.results[i].SCENARIO_NAME,
                                            "SCENARIO": oData.results[i].SCENARIO
                                        });
                                    }
                                }
                            }
                        } else {                        
                            for (var i = 0; i < oData.results.length; i++) {
                                for (var j = 0; j < prodToken.length; j++) {
                                    if (oData.results[i].REF_PRODID === prodToken[j].getText() &&
                                        oData.results[i].VERSION === version) {
                                        adata.push({
                                            "SCENARIO_NAME": oData.results[i].SCENARIO_NAME,
                                            "SCENARIO": oData.results[i].SCENARIO
                                        });
                                    }
                                }
                            }   
                        }

                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }

                        if (adata.length > 0) {
                            that.scenModel = new JSONModel();
                            that.scenModel.setData({
                                results: removeDuplicate(adata, 'SCENARIO')
                            });

                            that.oScenList.setModel(that.scenModel);
                        } else {
                            that.scenModel = new JSONModel();
                            that.scenModel.setData({
                                results: []
                            });

                            that.oScenList.setModel(that.scenModel);
                        }
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Failed to get Version!");
                    },
                });

            // } else if(ActivityId === "IMPORT_IBP_DEMAND_FUTURE"){
            } else {

                this.getModel("BModel").read("/getVerScnmaster", {
                    success: function (oData) {

                        var filterScenarios = oData.results.filter(function (aComp) {
                            return aComp.VERSION === that.byId("idver").getValue() ;
                        });

                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.scenModel = new JSONModel();
                        that.scenModel.setData({
                            results: removeDuplicate(filterScenarios, 'SCENARIO')
                        });
                        // that.scenModel.setData(oData);
                        that.oScenList.setModel(that.scenModel);
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });


            } 
            // else {
            //     // Calling sercive to get the IBP Versions list
            //     this.getModel("BModel").read("/getIbpVerScn", {
            //         filters: oFilters,
            //         success: function (oData) {
            //             function removeDuplicate(array, key) {
            //                 var check = new Set();
            //                 return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //             }
            //             that.scenModel = new JSONModel();
            //             that.scenModel.setData({
            //                 results: removeDuplicate(oData.results, 'SCENARIO')
            //             });
            //             // that.scenModel.setData(oData);
            //             that.oScenList.setModel(that.scenModel);
            //         },
            //         error: function (oData, error) {
            //             MessageToast.show("error");
            //         },
            //     });
            // }

        },


        getClass:function(oEvent){


            var verFlag = "";
            if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                that.oProd = that.byId("CprodInput");
            } else {
                that.oProd = that.byId("PprodInput");
            }

            var selectionType;
            if (that.oProd.getValue() === "" && that.oProd.getTokens().length > 0) {
                selectionType = "M";
            } else if (that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                selectionType = "S";
            }

            var loc = "";
            that.TempLocData = [];
                if(that.byId("DM_LOCATION").getVisible() === true){
                    loc = that.oLoc.getTokens();
                    var token = "X";
                } else {
                    loc = that.oMFLoc.getValue();
                    var token = "";
                }
            var oFilters = [];
            if(token === ""){
                var sFilter = new sap.ui.model.Filter({
                    path: "LOCATION_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: loc,
                });
                oFilters.push(sFilter);
                that.TempLocData.push(loc);
            } else {
                for (var i = 0; i < loc.length; i++) {
                    if (loc[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "LOCATION_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: loc[i].getText(),
                        });
                        oFilters.push(sFilter);
                that.TempLocData.push(loc[i].getText());

                    }
                }
            }

            if (selectionType === "M") {
                var aSelectedProd = that.oProd.getTokens();
                for (var i = 0; i < aSelectedProd.length; i++) {
                    if (aSelectedProd[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "PRODUCT_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: aSelectedProd[i].getText(),
                        });
                        oFilters.push(sFilter);
                    }
                }
            } else if (selectionType === "S") {
                var sFilter = new sap.ui.model.Filter({
                    path: "PRODUCT_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: that.oProd.getValue(),
                });
                oFilters.push(sFilter);
            }
       

            sap.ui.core.BusyIndicator.show();
            // Calling service to get the Customer data
            this.getModel("BModel").read("/getProdClass", {
                filters: oFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.ui.core.BusyIndicator.hide();
                        // that.classData = oData.results;
                        if (oData.results.length > 0) {
                            oData.results.unshift({
                                CLASS_NUM: "ALL",
                                CLASS_NAME: "ALL",
                            });
                        }

                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        that.classModel = new JSONModel();
                        that.classModel.setSizeLimit(1000);
                        that.classModel.setData({
                            results: removeDuplicate(oData.results, 'CLASS_NUM')
                        });
                        // that.classModel.setData(oData);
                        that.oClassList.setModel(that.classModel);

                        that.oClass = that.byId("classInput");
                        var classTokens = that.oClass.getTokens();
                        if(classTokens[0].getText().includes(",")){
                            classTokens = classTokens.split(",");
                        }
            
                        if(classTokens[0].getText() === "ALL" || classTokens.length === (oData.results.length - 1)){
                            this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].selectAll();
                        } else {
                            for (var i = 0; i < classTokens.length; i++) {
                                for (var j = 0; j < oData.results.length; j++) {
                                    if (oData.results[j].CLASS_NUM === classTokens[i].getText()) {
                                        sap.ui.getCore().byId("ClassSlctListJSS").getItems()[j].setSelected(true);
                                        break;
                                    }
                                }
                            }                
                        }
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                },
            });
        },

        getCustGroup:function(value){
            sap.ui.core.BusyIndicator.show();
            // Calling service to get the Customer data
            if(value === "N"){
            this.getModel("BModel").read("/getCustgroup", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.custGroupModel = new JSONModel();
                    that.custGroupModel.setData(oData);
                    that.oCustGroupList.setModel(that.custGroupModel);

                   
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("failed to fetch the customer groups");
                },
            });
        } else if(value === "Y"){
            if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                that.oProd = that.byId("CprodInput");
            } else {
                that.oProd = that.byId("PprodInput");
            }

            var selectionType;
            if (that.oProd.getValue() === "" && that.oProd.getTokens().length > 0) {
                selectionType = "M";
            } else if (that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                selectionType = "S";
            }

            var loc = "";
            that.TempLocData = [];
                if(that.byId("DM_LOCATION").getVisible() === true){
                    loc = that.oLoc.getTokens();
                    var token = "X";
                } else {
                    loc = that.oMFLoc.getValue();
                    var token = "";
                }
            var oFilters = [];
            if(token === ""){
                var sFilter = new sap.ui.model.Filter({
                    path: "LOCATION_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: loc,
                });
                oFilters.push(sFilter);
                that.TempLocData.push(loc);
            } else {
                for (var i = 0; i < loc.length; i++) {
                    if (loc[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "LOCATION_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: loc[i].getText(),
                        });
                        oFilters.push(sFilter);
                that.TempLocData.push(loc[i].getText());

                    }
                }
            }

            if (selectionType === "M") {
                var aSelectedProd = that.oProd.getTokens();
                for (var i = 0; i < aSelectedProd.length; i++) {
                    if (aSelectedProd[i].getText() !== "ALL") {
                        sFilter = new sap.ui.model.Filter({
                            path: "PRODUCT_ID",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: aSelectedProd[i].getText(),
                        });
                        oFilters.push(sFilter);
                    }
                }
            } else if (selectionType === "S") {
                var sFilter = new sap.ui.model.Filter({
                    path: "PRODUCT_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: that.oProd.getValue(),
                });
                oFilters.push(sFilter);
            }
            this.getModel("BModel").read("/getCustomerGroups", {
                filters: oFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.custGroupModel = new JSONModel();

                    function removeDuplicate(array, key) {
                        var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                        var custGrp = removeDuplicate(oData.results, 'CUSTOMER_GROUP');

                    that.custGroupModel.setData({
                        results : custGrp 
                    });
                    that.oCustGroupList.setModel(that.custGroupModel);

                   
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("failed to fetch the customer groups");
                },
            });

        }

        },


        onModelChange: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
                if(flag === ""){
                    var sel = that.byId("idModelVer").getSelectedKey();
                    var Exists = [],
                        selStep = that.getView().byId("idarrowTitle").getText(),
                        step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                    that.TempParams[index].MODEL_VERSION = sel;

                    that.ChnageData(sel,selStep,"MODEL_VERSION");
                }

        },

        OnGentypeChange: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
                if(flag === ""){
                    var sel = that.byId("GenidType").getSelectedKey();
                    var Exists = [],
                        selStep = that.getView().byId("idarrowTitle").getText(),
                        step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                    that.TempParams[index].GEN_TYPE = sel;

                    that.ChnageData(sel,selStep,"GEN_TYPE");
                }

        },

        onOverride: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var sel = that.byId("idOverride").getSelected();
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].OVERRIDE_ASSIGNMENT = sel;

                that.ChnageData(sel,selStep,"OVERRIDE_ASSIGNMENT");
            }
        },

        onCritical: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var sel = that.byId("idCritical").getSelected();
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                    var selected = "";

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                if(sel){
                    selected = "X";
                }
                that.TempParams[index].CRITICAL_ASSEMBLY = sel;
                that.ChnageData(selected,selStep,"CRITICAL_ASSEMBLY");
            }

        },

        onImpact: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var sel = that.byId("idImpact").getSelected();
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].IMPACT_ANALYSIS = sel;
                that.ChnageData(sel,selStep,"IMPACT_ANALYSIS");
            }

        },

        onDaily: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var sel = that.byId("idDaily").getSelected();
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].DAILY = sel;

                that.ChnageData(sel,selStep,"DAILY");
            }

        },

        handleDateChange: function (oEvent) {
            var flag = that.oGModel.getProperty("/CommonParam");
            var selDate = oEvent.getParameters().id;
            if(flag === ""){
                var fromDate = that.byId("FromDate").getValue();
                var toDate = that.byId("ToDate").getValue();
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

               

                if (selDate.includes("FromDate") && selStep !== "GENERATE_SEEDORDER") {
                    that.byId("ToDate").setEditable(true);
                    that.byId("ToDate").setMinDate(new Date(fromDate));
                } else if(selDate.includes("FromDate") && selStep === "GENERATE_SEEDORDER"){
                    var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                    that.byId("ToDate").setEditable(true);
                    that.byId("ToDate").setMinDate(new Date(fromDate));
                    that.byId("ToDate").setMaxDate(tempDate);
                }

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].FROM_DATE = fromDate;
                that.TempParams[index].TO_DATE = toDate;

                if(selStep === "PURGE_PLANNING_DATA"){
                    var selOpr = that.byId("idOperator").getSelectedKey();
                    that.ChnageData(selOpr,selStep,"OPERATOR");
                }

                if (selDate.includes("FromDate")){
                    that.ChnageData(fromDate,selStep,"FROM_DATE");
                } else if(selDate.includes("ToDate")){
                    that.ChnageData(toDate,selStep,"TO_DATE");
                }
                // that.ChnageData(fromDate,selStep,"FROM_DATE");
                // that.ChnageData(toDate,selStep,"TO_DATE");
            } else {
                var fromDate = that.byId("FromDate").getValue();
                var toDate = that.byId("ToDate").getValue();
                if (selDate.includes("FromDate")){
                        that.byId("ToDate").setEditable(true);
                        that.byId("ToDate").setMinDate(new Date(fromDate));
                }
            }


        },

        handleDateChange1:function(oEvent){
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var singleDate = that.byId("singleDt").getValue();
                var Exists = [],
                    selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);


                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].SINGLE_DATE = singleDate;

                if(selStep === "PURGE_PLANNING_DATA"){
                    var selOpr = that.byId("idOperator").getSelectedKey();
                    that.ChnageData(selOpr,selStep,"OPERATOR");
                }
                that.ChnageData(singleDate,selStep,"SINGLE_DATE");
        } 

        },

        onOperatorChange:function(oEvent){
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var selOpr = that.byId("idOperator").getSelectedKey();
                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                that.byId("FromDate").setValue();
                that.byId("ToDate").setValue();
                that.byId("singleDt").setValue();
                if(selOpr === "BT"){
                    that.byId("DATE_RANGE").setVisible(true);
                    that.byId("SINGLE_DATE").setVisible(false);
                } else {
                    that.byId("DATE_RANGE").setVisible(false);
                    that.byId("SINGLE_DATE").setVisible(true);
                }

                that.ChnageData(selOpr,selStep,"OPERATOR");

            } else {
                var selOpr = that._oCore.byId("idOperatorU").getSelectedKey();
                that._oCore.byId("singleDtU").setValue();
                if(selOpr === "BT"){
                    that._oCore.byId("SINGLE_DATEU").setVisible(false);
                } else {
                    that._oCore.byId("SINGLE_DATEU").setVisible(true);
                }
            }
        },

        onRolling:function(){
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                if(that.TempParams.length > 0){
                var sel = that.byId("idRolling").getSelected();
                
                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                
                    that.byId("FromDate").setValue();
                    that.byId("ToDate").setValue();
                if(sel){
                    that.TempParams[index].Rolling = true;
                    that.byId("FromDate").setEditable(false);
                    that.byId("ToDate").setEditable(false);
                    that.byId("idRollingWeeks").setValue();
                    that.byId("idRollingWeeks").setVisible(true);
                } else {
                    that.TempParams[index].Rolling = false;
                    that.byId("FromDate").setEditable(true);
                    that.byId("ToDate").setEditable(true);
                    that.byId("idRollingWeeks").setValue();
                    that.byId("idRollingWeeks").setVisible(false);
                }

                that.ChnageData(sel,selStep,"Rolling");
            }
        } else {
            var sel = that._oCore.byId("idRollingU").getSelected();
            if(sel){
                that._oCore.byId("idRollingWeeksU").setValue();
                that._oCore.byId("idRollingWeeksU").setVisible(true);
            } else {
                that._oCore.byId("idRollingWeeksU").setValue();
                that._oCore.byId("idRollingWeeksU").setVisible(false);
            }
        }
        },

        onRollWeekchange:function(oEvent){
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var week = parseInt(that.byId("idRollingWeeks").getValue());

                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                var newDate = new Date(new Date(). getTime() + week * 7 * 24 * 60 * 60 * 1000);
                var fromDate = new Date().toISOString().split("T")[0];
                var toDate = "";
                    if(!isNaN(newDate)){
                        toDate = newDate.toISOString().split("T")[0];
                    }
                    if(week > 0){                    
                        that.byId("FromDate").setValue(fromDate);
                        that.byId("ToDate").setValue(toDate);

                        that.TempParams[index].Rolling_Timestamp = week;
                        that.TempParams[index].FROM_DATE = fromDate;
                        that.TempParams[index].TO_DATE = toDate;

                    } else {
                        MessageToast.show("Please maintain valid weeks");
                        that.byId("FromDate").setValue();
                        that.byId("ToDate").setValue();
                        
                        that.TempParams[index].Rolling_Timestamp = "";
                        that.TempParams[index].FROM_DATE = "";
                        that.TempParams[index].TO_DATE = "";

                    }
                        that.ChnageData(week,selStep,"Rolling_Timestamp");
                        that.ChnageData(fromDate,selStep,"FROM_DATE");
                        that.ChnageData(toDate,selStep,"TO_DATE");
                } 

        },

        onWeekValues: function(){
            var flag = that.oGModel.getProperty("/CommonParam");
            if(flag === ""){
                var week = parseInt(that.byId("idWeeks").getValue());

                var selStep = that.getView().byId("idarrowTitle").getText(),
                    step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].HISTORY_WEEKS = week;

                that.ChnageData(week,selStep,"HISTORY_WEEKS");
            }

        },

        OnOptAlgChange: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
                if(flag === ""){
                    var sel = that.byId("PidOptAlg").getSelectedKey();

                    var selStep = that.getView().byId("idarrowTitle").getText(),
                        step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                    that.TempParams[index].OptAlgorithm = sel;

                    that.ChnageData(sel,selStep,"OptAlgorithm");
                }


        },

        OnOptFctChange: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
                if(flag === ""){
                    var sel = that.byId("PidOptFct").getSelectedItem().getText();

                    var selStep = that.getView().byId("idarrowTitle").getText(),
                        step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                    that.TempParams[index].OptFactor = parseFloat(sel);

                    that.ChnageData(sel,selStep,"OptFactor");
                }


        },

        OnDsAlgChange: function () {
            var flag = that.oGModel.getProperty("/CommonParam");
                if(flag === ""){
                    var sel = that.byId("PidDSAlg").getSelectedKey();

                    var selStep = that.getView().byId("idarrowTitle").getText(),
                        step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                    that.TempParams[index].DsAlgorithm = sel;

                    that.ChnageData(sel,selStep,"DsAlgorithm");
                }


        },

        divideDatatoSend:function(){
                var paramObj =[];
                var activities = that.ActivityItems;
                // var paramresults = oData.results;
                var toatlprod = that.AllLocProdData;
                    that.newTotalData = [];
                            


                    that.TemplateItems.forEach(function(oItem,i){
                        that.tempArray = [];
                            var ProdType = activities.filter(function (aComp) {
                                return aComp.PARAMETER_ID.includes("PRODUCT") && aComp.ACTIVITY_ID === oItem.ACTIVITY_ID;
                            });
                            var ConfigProd = "";

                            if(ProdType.length > 0){
                                var tempC = ProdType[0].PARAMETER_ID.includes("CONFIG");
                                if(tempC === true){
                                    ConfigProd = "C";
                                } else {
                                    ConfigProd = "P";
                                }
                            } else {
                                ConfigProd = "N";
                            }

                            
                            var tempData = that.TempParams.filter(function (aComp) {
                                return aComp.ACT_POSITION === oItem.ACT_POSITION;
                            });
                            var tempobj = {};
                            var oData = {};
                            if(tempData[0]){
                            Object.entries(tempData[0]).forEach(x => {
                                var test = x[0];
        
                                if (x[0] !== "PRODUCT_ID" && x[0] !== "LOCATION_ID" ) {
                                // && x[0] !== "SCENARIO" && x[0] !== "VERSION") {
                                    
                                    tempobj[test] = x[1]
                                } else {
                                    oData[test] = x[1]
                                }
        
                            });
                            if(that.Edit !== "X" && oItem.ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                                tempobj.OPERATOR = "BT";
                            }
                            
                        
                            var DemandLoc = [];
                            var MFLoc = [];
                            var flag = "";
                            if(oData.LOCATION_ID !== undefined){                               
                                if(oData.LOCATION_ID.includes(",")){
                                    DemandLoc = oData.LOCATION_ID.split(",");
                                } else {
                                    //22-11
                                    // DemandLoc.push(oData.LOCATION_ID);
                                    DemandLoc = oData.LOCATION_ID;
                                }
                              
                                DemandLoc.forEach(function(el){
                                    var obj = {LOCATION_ID : el,
                                               MF_LOCATION_ID : tempobj.MF_LOCATION_ID};
                                    that.tempArray.push(obj);
                                });
                                // Demand Location
                                flag = "D";
                            } else {
                               
                                MFLoc.push(tempobj.MF_LOCATION_ID);
                                    var obj = {MF_LOCATION_ID : MFLoc[0]};
                                    that.tempArray.push(obj);
                            // Manufacturing Location
                                flag = "M";
                            }
                        } else {
                            var obj = {};
                            that.tempArray.push(obj)
                        }

                            var newObject = {};
                            var aProd = [];
                            if(ConfigProd !== "N" ){
                                if(oData.PRODUCT_ID !== undefined ){
                            if(oData.PRODUCT_ID.includes(",")){
                                aProd = oData.PRODUCT_ID.split(",");
                            } else {
                                // 22-11
                                // aProd.push(oData.PRODUCT_ID);
                                aProd = oData.PRODUCT_ID;
                            }
                        }
                        }
                                
                            if(flag === "D"){
                                if(oData.PRODUCT_ID === undefined){

                                    that.tempArray.forEach(function(loc,q){
                                    var Pobj = {
                                        LOCATION_ID : loc.LOCATION_ID
                                    }
                                    var tempobjn = {};

                                    tempobjn = {
                                        ...tempobj,
                                        ...Pobj
                                    }
                                    that.newTotalData.push(tempobjn);
                                })
                                } else if(oData.PRODUCT_ID === "" || oData.PRODUCT_ID === "ALL") {
                                    if(ConfigProd === "P"){
                                        var allprod = "ALL";
                                    } else {
                                        var allprod = "";
                                    }
                                    that.tempArray.forEach(function(loc,q){
                                    var Pobj = {
                                        // // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                        // LOCATION_ID : oData.LOCATION_ID,
                                        LOCATION_ID : loc.LOCATION_ID,
                                        PRODUCT_ID : allprod
                                    }
                                    var tempobjn = {};

                                    if(tempobj.ACTIVITY_ID === "OPTION_LEVEL_MASTER"){
                                        Pobj.CLASS = "";
                                    }

                                    tempobjn = {
                                        ...tempobj,
                                        ...Pobj
                                    }
                                    that.newTotalData.push(tempobjn);
                                    })
                                } else {
                                if(ConfigProd === "C"){
                                    that.tempArray.forEach(function(loc,q){
                                        
                                        var count = 0;
                                        if(oItem.ACTIVITY_ID === "PROCESS_SALES_ORDERS"){
                                            var tempprod = that.AllLocProdDataConf.filter(function (aComp) {
                                                return aComp.LOCATION_ID === loc.LOCATION_ID;
                                            });
                                        } else {
                                        var tempprod = that.AllLocProdData.filter(function (aComp) {
                                            return aComp.LOCATION_ID === loc.LOCATION_ID && aComp.CONFIGPROD_CHK === "X";
                                        });
                                    } 
                                        for(var l=0; l<tempprod.length; l++){
                                            var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                            if(index !== -1){
                                                count = count + 1;
                                                if(tempobj.ACTIVITY_ID === "OPTION_LEVEL_MASTER"){
                                                    if(tempobj.CLASS !== ""){
                                                    var datatemp = [];
                                                        var classData = that.ClassData;
                                                    var tempCData = classData.filter(function (aComp) {
                                                        return aComp.LOCATION_ID === loc.LOCATION_ID && 
                                                            aComp.PRODUCT_ID === tempprod[l].PRODUCT_ID;
                                                    });

                                                    if(tempobj.CLASS.includes(",")){
                                                        datatemp = tempobj.CLASS.split(",");
                                                    } else {
                                                        datatemp.push(tempobj.CLASS);
                                                    }
            
                                                    for(var c=0; c<tempCData.length; c++){   
                                                        for(var d=0; d<datatemp.length; d++){ 
                                                            if(datatemp[d] === tempCData[c].CLASS_NUM){
                        
                                                                var Pobj = {
                                                                    LOCATION_ID :loc.LOCATION_ID,
                                                                    PRODUCT_ID : tempprod[l].PRODUCT_ID,
                                                                    CLASS      : tempCData[c].CLASS_NUM
                                                                }
                                                                var tempobjn = {};
                        
                                                                tempobjn = {
                                                                    ...tempobj,
                                                                    ...Pobj
                                                                }
                        
                                                                that.newTotalData.push(tempobjn); 
                                                                break;  
                                                            
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    var Pobj = {
                                                        LOCATION_ID : loc.LOCATION_ID,
                                                        PRODUCT_ID : tempprod[l].PRODUCT_ID,
                                                        CLASS : ""
                                                    }
                                                    var tempobjn = {};
            
                                                    tempobjn = {
                                                        ...tempobj,
                                                        ...Pobj
                                                    }
            
                                                    that.newTotalData.push(tempobjn);
                                                }
                                                } else {
                                                
                                                var Pobj = {
                                                    // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                                    LOCATION_ID : loc.LOCATION_ID,
                                                    PRODUCT_ID : tempprod[l].PRODUCT_ID
                                                }
                                                var tempobjn = {};

                                                tempobjn = {
                                                    ...tempobj,
                                                    ...Pobj
                                                }

                                                that.newTotalData.push(tempobjn);
                                            }
                                            }
                                        }

                                        if(count === 0){
                                            if(tempobj.ACTIVITY_ID === "OPTION_LEVEL_MASTER"){
                                                var Pobj = {
                                                    LOCATION_ID :loc.LOCATION_ID,
                                                    PRODUCT_ID : "",
                                                    CLASS      : ""
                                                }
                                            } else {
                                            var Pobj = {
                                                LOCATION_ID :loc.LOCATION_ID,
                                                PRODUCT_ID : ""
                                            }
                                        }
                                            var tempobjn = {};
    
                                            tempobjn = {
                                                ...tempobj,
                                                ...Pobj
                                            }
    
                                            that.newTotalData.push(tempobjn); 
                                        }
                                    })
                                } else {
                                    that.tempArray.forEach(function(loc,q){
                                        var tempprod = that.AllLocProdData.filter(function (aComp) {
                                            return aComp.LOCATION_ID === loc.LOCATION_ID ;
                                        });
                                        var prod ="";
                                        for(var l=0; l<tempprod.length; l++){
                                            var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                            if(index !== -1){
                                                // if(l === 0){
                                                    if(prod === ""){
                                                    prod = tempprod[l].PRODUCT_ID;
                                                } else {
                                                    prod = prod + "," + tempprod[l].PRODUCT_ID;
                                                }
                                            }
                                        }
                                        var Pobj = {
                                            // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                            LOCATION_ID : loc.LOCATION_ID,
                                            PRODUCT_ID : prod
                                        }
                                        var tempobjn = {};

                                        tempobjn = {
                                            ...tempobj,
                                            ...Pobj
                                        }
                                        that.newTotalData.push(tempobjn);
                                    })
                                }
                            }
                                
                            } else if(flag === "M"){
                                if(oData.PRODUCT_ID === undefined){

                                    that.tempArray.forEach(function(loc,q){
                                    var Pobj = {
                                        MF_LOCATION_ID : loc.MF_LOCATION_ID
                                    }
                                    var tempobjn = {};
            
                                    tempobjn = {
                                        ...tempobj,
                                        // ...Pobj
                                    }
                                    that.newTotalData.push(tempobjn);
                                })
                                }
                            else if(oData.PRODUCT_ID === "" || oData.PRODUCT_ID === "ALL") {
                                if(ConfigProd === "P"){
                                    var allprod = "ALL";
                                } else {
                                    var allprod = "";
                                }
                                that.tempArray.forEach(function(loc,q){
                                var Pobj = {
                                    // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                    // LOCATION_ID : oData.LOCATION_ID,
                                    PRODUCT_ID : allprod
                                }
                                var tempobjn = {};
            
                                tempobjn = {
                                    ...tempobj,
                                    ...Pobj
                                }
                                that.newTotalData.push(tempobjn);
                                })
                            }  else {
                                if(ConfigProd === "C"){
                                    that.tempArray.forEach(function(loc,q){
                                        var tempprod = that.AllLocProdData.filter(function (aComp) {
                                            return aComp.LOCATION_ID === loc.MF_LOCATION_ID && aComp.CONFIGPROD_CHK === "X";
                                        });
                                        for(var l=0; l<tempprod.length; l++){
                                            var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                            if(index !== -1){
                                                
                                                var Pobj = {
                                                    // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                                    // LOCATION_ID : loc.LOCATION_ID,
                                                    PRODUCT_ID : tempprod[l].PRODUCT_ID
                                                }
                                                var tempobjn = {};
            
                                                tempobjn = {
                                                    ...tempobj,
                                                    ...Pobj
                                                }
            
                                                that.newTotalData.push(tempobjn);
                                            
                                            }
                                        }
                                    })
                                } else {
                                    that.tempArray.forEach(function(loc,q){
                                        var tempprod = that.AllLocProdData.filter(function (aComp) {
                                            return aComp.LOCATION_ID === loc.MF_LOCATION_ID ;
                                        });
                                        var prod;
                                        for(var l=0; l<tempprod.length; l++){
                                            var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                            if(index !== -1){
                                                if(l === 0){
                                                    prod = tempprod[l].PRODUCT_ID;
                                                } else {
                                                    prod = prod + "," + tempprod[l].PRODUCT_ID;
                                                }
                                            }
                                        }
                                        var Pobj = {
                                            // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                            // LOCATION_ID : loc.LOCATION_ID,
                                            PRODUCT_ID : prod
                                        }
                                        var tempobjn = {};
            
                                        tempobjn = {
                                            ...tempobj,
                                            ...Pobj
                                        }
                                        that.newTotalData.push(tempobjn);
                                    })
                                }
                            }
                            } 
                            
                            
                             

                        });

                        // var optionIndex = that.newTotalData.findIndex(e => e.ACTIVITY_ID === "OPTION_LEVEL_MASTER");


                        // if(optionIndex !== -1){

                        //     that.newTotalData.forEach(ele => {
                        //         var classData = that.ClassData;
                                
                        //         if(ele.ACTIVITY_ID === "OPTION_LEVEL_MASTER"){
                        //             var selClasses = ele.CLASS;
                        //             var selCla = [];
                        //             if(selClasses.includes(",")){
                        //                  selCla = selClasses.split(",");
                        //             } else {
                        //                  selCla.push(selClasses);
                        //             }
                                    
                        //             var tempData = classData.filter(function (aComp) {
                        //                 return aComp.LOCATION_ID === ele.LOCATION_ID && aComp.PRODUCT_ID === ele.PRODUCT_ID;
                        //             });

                        //             for(var c=0; c<tempData.length; c++){
                        //                 for(var d=0; d<selCla.length; d++){
                        //                     if(selCla[d] === tempData[c].CLASS_NUM){
                        //                         ele.CLASS = tempData[c].CLASS_NUM;
                        //                         break;
                        //                     }
                        //                 }
                        //             }

                        //         }
                        //     });

                        // }
        },

        ChnageData:function(data,step,type){
            var selStep = that.getView().byId("idarrowTitle").getText(),
                step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
            var data = data,
                datatemp = data,
                type = type
            var temp = that.newTotalData;
            var start, end =0;
            that.tempArray = [];

            that.newTotalData = that.newTotalData.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
            if((type === "MFL" || type === "DL" || type === "PROD" || type === "CLASS") && selStep !== "INITIALIZATION_PROCESS"){
            that.newTotalData.forEach(function(el,i){
                if(el.ACTIVITY_ID === selStep && el.ACT_POSITION === step){
                    if(start === undefined){
                        start = i;  
                        end = end + 1; 
                    }    
                    else {
                        end = end + 1; 
                    }             
                }
            });
            

            that.newTotalData.splice(start, end);
        // } 

        var data = that.TempParams.filter(function(aComp){
                return aComp.ACTIVITY_ID === selStep && aComp.ACT_POSITION === step;
        });

                var tempobj = {};
                var oData = [];
                Object.entries(data[0]).forEach(x => {
                    var test = x[0];
        
                    if (x[0] !== "PRODUCT_ID" && x[0] !== "LOCATION_ID" ) {
                        tempobj[test] = x[1]
                    } else {
                        oData[test] = x[1]
                    }
        
                });

                var DemandLoc = [];
                var MFLoc = [];
                var flag = "";
                if(oData.LOCATION_ID !== undefined){                               
                    if(oData.LOCATION_ID.includes(",")){
                        DemandLoc = oData.LOCATION_ID.split(",");
                    } else {
                        // DemandLoc.push(oData.LOCATION_ID);
                        DemandLoc = oData.LOCATION_ID
                    }
                    if(DemandLoc !== "" || DemandLoc.length > 0){

                    
                    DemandLoc.forEach(function(el){
                        var obj = {LOCATION_ID : el,
                                   MF_LOCATION_ID : tempobj.MF_LOCATION_ID};
                        that.tempArray.push(obj);
                    });
                }
                    flag = "D";
                } else {
                   
                    MFLoc.push(tempobj.MF_LOCATION_ID);
                        var obj = {MF_LOCATION_ID : MFLoc[0]};
                        that.tempArray.push(obj);
                    flag = "M";
                }

                var newObject = {};
                var aProd = [];
                if(oData.PRODUCT_ID !== undefined){
                if(oData.PRODUCT_ID.includes(",")){
                    aProd = oData.PRODUCT_ID.split(",");
                } else {
                    // aProd.push(oData.PRODUCT_ID);
                    aProd = oData.PRODUCT_ID;
                }
            }

                if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                    var ConfigProd = true;
                } else {
                    var ConfigProd = false;
                }
                    
                if(flag === "D"){
                    if(oData.PRODUCT_ID === undefined){

                        that.tempArray.forEach(function(loc,q){
                        var Pobj = {
                            LOCATION_ID : loc.LOCATION_ID
                        }
                        var tempobjn = {};

                        tempobjn = {
                            ...tempobj,
                            ...Pobj
                        }
                        that.newTotalData.push(tempobjn);
                    })
                    } else if(oData.PRODUCT_ID === "" || oData.PRODUCT_ID === "ALL") {
                        if(!ConfigProd){
                            var allprod = "ALL";
                        } else {
                            var allprod = "";
                        }
                        that.tempArray.forEach(function(loc,q){
                        var Pobj = {
                            // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                            LOCATION_ID : loc.LOCATION_ID,
                            PRODUCT_ID : allprod
                        }
                        var tempobjn = {};
                        
                        if(tempobj.ACTIVITY_ID === "OPTION_LEVEL_MASTER"){
                            Pobj.CLASS = "";
                        }

                        tempobjn = {
                            ...tempobj,
                            ...Pobj
                        }
                        that.newTotalData.push(tempobjn);
                        })
                    } else {
                    if(ConfigProd){
                        that.tempArray.forEach(function(loc,q){
                            if(selStep === "PROCESS_SALES_ORDERS"){
                                var tempprod = that.AllLocProdDataConf.filter(function (aComp) {
                                    return aComp.LOCATION_ID === loc.LOCATION_ID;
                                });
                            } else {
                                var tempprod = that.AllLocProdData.filter(function (aComp) {
                                    return aComp.LOCATION_ID === loc.LOCATION_ID && aComp.CONFIGPROD_CHK === "X";
                                });
                            }
                            
                            for(var l=0; l<tempprod.length; l++){
                                var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                if(index !== -1){
                                    if(selStep === "OPTION_LEVEL_MASTER"){
                                        if(type === "CLASS"){
                                            var classData = that.ClassData;
                                        var tempCData = classData.filter(function (aComp) {
                                            return aComp.LOCATION_ID === loc.LOCATION_ID && 
                                                aComp.PRODUCT_ID === tempprod[l].PRODUCT_ID;
                                        });

                                        for(var c=0; c<tempCData.length; c++){   
                                            for(var d=0; d<datatemp.length; d++){ 
                                                if(datatemp[d].getTitle() === tempCData[c].CLASS_NUM){
            
                                                    var Pobj = {
                                                        LOCATION_ID :loc.LOCATION_ID,
                                                        PRODUCT_ID : tempprod[l].PRODUCT_ID,
                                                        CLASS      : tempCData[c].CLASS_NUM
                                                    }
                                                    var tempobjn = {};
            
                                                    tempobjn = {
                                                        ...tempobj,
                                                        ...Pobj
                                                    }
            
                                                    that.newTotalData.push(tempobjn); 
                                                    break;  
                                                
                                                }
                                            }
                                        }
                                    } else {
                                        var Pobj = {
                                            LOCATION_ID : loc.LOCATION_ID,
                                            PRODUCT_ID : tempprod[l].PRODUCT_ID,
                                            CLASS : ""
                                        }
                                        var tempobjn = {};

                                        tempobjn = {
                                            ...tempobj,
                                            ...Pobj
                                        }

                                        that.newTotalData.push(tempobjn);
                                    }
                                        



                                    } else {

                                        var Pobj = {
                                            // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                            LOCATION_ID : loc.LOCATION_ID,
                                            PRODUCT_ID : tempprod[l].PRODUCT_ID
                                        }
                                        var tempobjn = {};

                                        tempobjn = {
                                            ...tempobj,
                                            ...Pobj
                                        }

                                        that.newTotalData.push(tempobjn);
                                    }
                                }
                            }
                        })
                    } else {
                        that.tempArray.forEach(function(loc,q){
                            var tempprod = that.AllLocProdData.filter(function (aComp) {
                                return aComp.LOCATION_ID === loc.LOCATION_ID ;
                            });
                            var prod = "";
                            for(var l=0; l<tempprod.length; l++){
                                var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                if(index !== -1){
                                    if(prod === ""){
                                        prod = tempprod[l].PRODUCT_ID;
                                    } else {
                                        prod = prod + "," + tempprod[l].PRODUCT_ID;
                                    }
                                    
                                }
                            }

                            if(prod === ""){
                                prod = "ALL"
                            }
                            var Pobj = {
                                // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                LOCATION_ID : loc.LOCATION_ID,
                                PRODUCT_ID : prod
                            }
                            var tempobjn = {};

                            tempobjn = {
                                ...tempobj,
                                ...Pobj
                            }
                            that.newTotalData.push(tempobjn);
                        })
                    }
                }
                    
                } else if(flag === "M"){

                    if(oData.PRODUCT_ID === undefined){

                        that.tempArray.forEach(function(loc,q){
                        var Pobj = {
                            MF_LOCATION_ID : loc.MF_LOCATION_ID
                        }
                        var tempobjn = {};

                        tempobjn = {
                            ...tempobj,
                            // ...Pobj
                        }
                        that.newTotalData.push(tempobjn);
                    })
                    }
                 else if(oData.PRODUCT_ID === "" || oData.PRODUCT_ID === "ALL") {
                    if(!ConfigProd){
                        var allprod = "ALL";
                    } else {
                        var allprod = "";
                    }
                    that.tempArray.forEach(function(loc,q){
                    var Pobj = {
                        // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                        // LOCATION_ID : oData.LOCATION_ID,
                        PRODUCT_ID : allprod
                    }
                    var tempobjn = {};

                    tempobjn = {
                        ...tempobj,
                        ...Pobj
                    }
                    that.newTotalData.push(tempobjn);
                    })
                }  else {
                    if(ConfigProd){
                        that.tempArray.forEach(function(loc,q){
                            var tempprod = that.AllLocProdData.filter(function (aComp) {
                                return aComp.LOCATION_ID === loc.MF_LOCATION_ID && aComp.CONFIGPROD_CHK === "X";
                            });
                            for(var l=0; l<tempprod.length; l++){
                                var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                if(index !== -1){
                                    var Pobj = {
                                        // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                        // LOCATION_ID : loc.LOCATION_ID,
                                        PRODUCT_ID : tempprod[l].PRODUCT_ID
                                    }
                                    var tempobjn = {};

                                    tempobjn = {
                                        ...tempobj,
                                        ...Pobj
                                    }

                                    that.newTotalData.push(tempobjn);
                                }
                            }
                        })
                    } else {
                        that.tempArray.forEach(function(loc,q){
                            var tempprod = that.AllLocProdData.filter(function (aComp) {
                                return aComp.LOCATION_ID === loc.MF_LOCATION_ID ;
                            });
                            var prod;
                            for(var l=0; l<tempprod.length; l++){
                                var index = aProd.findIndex(e => e === tempprod[l].PRODUCT_ID);
                                if(index !== -1){
                                    if(l === 0){
                                        prod = tempprod[l].PRODUCT_ID;
                                    } else {
                                        prod = prod + "," + tempprod[l].PRODUCT_ID;
                                    }
                                }
                            }
                            var Pobj = {
                                // MF_LOCATION_ID : loc.MF_LOCATION_ID,
                                // LOCATION_ID : loc.LOCATION_ID,
                                PRODUCT_ID : prod
                            }
                            var tempobjn = {};

                            tempobjn = {
                                ...tempobj,
                                ...Pobj
                            }
                            that.newTotalData.push(tempobjn);
                        })
                    }
                }
            }

            // that.newTotalData.forEach(function(el,i){
            //     if(el.ACTIVITY_ID === selStep && el.ACT_POSITION === step){
            //         el[type] = data;         
            //     }
            // });
            } else {

                that.newTotalData.forEach(function(el,i){
                    if(el.ACTIVITY_ID === selStep && el.ACT_POSITION === step){
                        el[type] = data;         
                    }
                });
                // if(type === "CLASS"){
                //     that.classDataarray =[];                    
                //     for(var k = 0; k<that.newTotalData.length; k++){
                //         that.tempArray =[];
                //         if(that.newTotalData[k].ACTIVITY_ID = "OPTION_LEVEL_MASTER"){
                //             that.newTotalData[k].CLASS = "";
                //             var classData = that.ClassData;
                //             var tempData = classData.filter(function (aComp) {
                //                 return aComp.LOCATION_ID === that.newTotalData[k].LOCATION_ID && 
                //                        aComp.PRODUCT_ID === that.newTotalData[k].PRODUCT_ID;
                //             });
                //             var count = 0;
                //             for(var c=0; c<tempData.length; c++){   
                //                 for(var d=0; d<data.length; d++){ 
                //                     if(data[d].getTitle() === tempData[c].CLASS_NUM){

                //                         var index = that.newTotalData.findIndex(e => e.LOCATION_ID === tempData[c].LOCATION_ID && 
                //                             e.PRODUCT_ID === tempData[c].PRODUCT_ID && e.CLASS === tempData[c].CLASS_NUM);
                                            
                //                         if(count === 0){
                //                             that.newTotalData[k].CLASS = tempData[c].CLASS_NUM;
                //                             count = count + 1;
                //                         } else {
                //                             var obj = $.extend(true, {}, that.newTotalData[k]);
                //                             obj.CLASS = tempData[c].CLASS_NUM;
                //                             that.tempArray.push(obj);
                //                         }
                                    
                //                     }
                //                 }
                //             }
                //             that.classDataarray = that.classDataarray.concat(that.tempArray);
                //         }
                //     }
                //     that.newTotalData = that.newTotalData.concat(that.classDataarray);
                    


                // } else {
                //     that.newTotalData.forEach(function(el,i){
                //         if(el.ACTIVITY_ID === selStep && el.ACT_POSITION === step){
                //             el[type] = data;         
                //         }
                //     });
                // }
            }
                
           
                
        },

        onJobCreate: function () {

            var oJobschType = that.byId("idJobSchtype").getSelectedKey();
            var SChType = "";
            if (oJobschType === "Cr") {
                var mnth = that.byId("idmnth").getValue(),
                    date = that.byId("iddate").getValue(),
                    day = that.byId("idWeek").getSelectedKey(),
                    hour = that.byId("idhrs").getValue(),
                    min = that.byId("idmin").getValue();

                if ((mnth === "" && date === "" && day === "0" && hour === "" && min === "") ||
                    (mnth === undefined && date === undefined && day === "0" && hour === undefined && min === undefined)) {
                    SChType = "";
                }
            }
            if (SChType === "") {

                // Array of Parameters with values and  activity id and template id
                // var parameters = that.TempParams,
                var parameters = that.newTotalData,
                    activities = that.ActivityItems;

                parameters = parameters.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);


                var aData = [];
                that.SaveTemplateDetails = [];
                var proceedFlag = "";

                if(parameters.length > 0){
                for (var i = 0; i < parameters.length; i++) {


                    if(parameters[i].ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS"){
                        if(parameters[i].Rolling === true || parameters[i].Rolling === "true"){
                            var week = parseInt(parameters[i].Rolling_Timestamp);

                            var newDate = new Date(new Date().getTime() + week * 7 * 24 * 60 * 60 * 1000);
                            var fromDate = new Date().toISOString().split("T")[0];
                            var toDate = "";
                                if(!isNaN(newDate)){
                                    toDate = newDate.toISOString().split("T")[0];
                                }
                                if(week > 0){                    
                                    parameters[i].FROM_DATE = fromDate;
                                    parameters[i].TO_DATE = toDate;                
                                } else {
                                    parameters[i].FROM_DATE = "";
                                    parameters[i].TO_DATE = "";  
                                }
                        }
                    }

                    var activitydata = activities.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === parameters[i].ACTIVITY_ID;
                    });
                    var stepObj = {};
                    // var proceedFlag = "";

                    if (proceedFlag !== "") {
                        break;
                    }

                    for (var j = 0; j < activitydata.length; j++) {
                        var paramid = activitydata[j].PARAMETER_ID;
                        if (paramid === "MF_LOCATION") {
                            if (parameters[i].MF_LOCATION_ID === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Manufacturing Location for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.MF_LOCATION_ID = parameters[i].MF_LOCATION_ID;
                            }

                        } 
                        if (paramid === "DM_LOCATION") {
                            if (parameters[i].LOCATION_ID === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Location for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.LOCATION_ID = parameters[i].LOCATION_ID;
                            }

                        }
                        if (paramid.includes("PRODUCT")) {
                            if(parameters[i].ACTIVITY_ID === "INITIALIZATION_PROCESS"){
                                stepObj.PRODUCT_ID = parameters[i].PRODUCT_ID;
                            } else {
                            if (parameters[i].PRODUCT_ID.includes(",")) {
                                parameters[i].PRODUCT_ID = parameters[i].PRODUCT_ID.split(",");
                            }
                            if (activitydata[j].OPTION_SELECT === "M") {
                                if (parameters[i].PRODUCT_ID.length === 0 && activitydata[j].MANDATORY === "Y") {
                                    MessageToast.show("Please select Product for " + "- " + parameters[i].ACTIVITY_ID);
                                    proceedFlag = "X";
                                    break;
                                } else if (parameters[i].PRODUCT_ID === "" && activitydata[j].MANDATORY === "N") {
                                    parameters[i].PRODUCT_ID = "ALL";
                                    stepObj.PRODUCT_ID = "ALL";
                                } else if (parameters[i].PRODUCT_ID !== "") {
                                    stepObj.PRODUCT_ID = parameters[i].PRODUCT_ID;
                                }

                            } else if (activitydata[j].OPTION_SELECT === "S") {
                                if (parameters[i].PRODUCT_ID === "" && activitydata[j].MANDATORY === "Y") {
                                    MessageToast.show("Please select Product for " + "- " + parameters[i].ACTIVITY_ID);
                                    proceedFlag = "X";
                                    break;
                                } else if (parameters[i].PRODUCT_ID === "" && activitydata[j].MANDATORY === "N") {
                                    parameters[i].PRODUCT_ID = "ALL";
                                    stepObj.PRODUCT_ID = "ALL";
                                } else if (parameters[i].PRODUCT_ID !== "") {
                                    stepObj.PRODUCT_ID = parameters[i].PRODUCT_ID;
                                }
                            }
                        }
                        }

                        if (paramid.includes("PREDICTION_PROFILE")) {
                            if (parameters[i].PREDICTION_PROFILE === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Prediction Profile for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else if (activitydata[j].MANDATORY === "N" ||
                                (activitydata[j].MANDATORY === "Y" && parameters[i].PREDICTION_PROFILE !== "")) {
                                stepObj.PREDICTION_PROFILE = parameters[i].PREDICTION_PROFILE;
                            }
                        }

                        if (paramid === "VERSION") {
                            if (parameters[i].VERSION === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Version for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else if ((activitydata[j].MANDATORY === "N" || activitydata[j].MANDATORY === "Y") && parameters[i].VERSION !== "") {
                                // } else if (parameters[i].VERSION !== "" ) {
                                stepObj.VERSION = parameters[i].VERSION;
                            } else {
                                MessageToast.show("Please select Version for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            }
                        }

                        if (paramid.includes("SCENARIO")) {
                            if (parameters[i].SCENARIO === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Scenario for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else if ((activitydata[j].MANDATORY === "N" || activitydata[j].MANDATORY === "Y") && parameters[i].SCENARIO !== "") {
                                // } else if (parameters[i].SCENARIO !== "") {
                                stepObj.SCENARIO = parameters[i].SCENARIO;
                            } else {
                                MessageToast.show("Please select Scenario for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            }
                        }

                        if (paramid.includes("CUSTOMER_GROUP")) {
                            if (parameters[i].CUSTOMER_GROUP === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select customer group for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else if ((activitydata[j].MANDATORY === "N" || activitydata[j].MANDATORY === "Y") && parameters[i].SCENARIO !== "") {
                                // } else if (parameters[i].CUSTOMER_GROUP !== "") {
                                stepObj.CUSTOMER_GROUP = parameters[i].CUSTOMER_GROUP;
                            } else {
                                MessageToast.show("Please select customer group for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            }
                        }

                        if (paramid.includes("CLASS")) {
                            if (parameters[i].CLASS === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select CLASS for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else if ((activitydata[j].MANDATORY === "N" || activitydata[j].MANDATORY === "Y") && parameters[i].CLASS !== "") {
                                // } else if (parameters[i].CLASS !== "") {
                                stepObj.CLASS = parameters[i].CLASS;
                            } else {
                                MessageToast.show("Please select CLASS for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            }
                        }

                        if (paramid.includes("CRITICAL_ASSEMBLY")) {
                            // if (parameters[i].CRITICAL_ASSEMBLY === "true" || parameters[i].CRITICAL_ASSEMBLY === true) {
                            //     // stepObj.CRITICAL_ASSEMBLY = parameters[i].CRITICAL_ASSEMBLY;
                            //     stepObj.CRITICAL_ASSEMBLY = true;
                            // } else {
                            //     // stepObj.CRITICAL_ASSEMBLY = parameters[i].CRITICAL_ASSEMBLY;
                            //     stepObj.CRITICAL_ASSEMBLY = false;
                            // }
                            // var critical = that.byId("idCritical").getSelected();
                            // var criticalCheck = "";
                            // if(critical){
                            //     criticalCheck = "X";
                            // }
                            // stepObj.CRITICAL_ASSEMBLY = criticalCheck;


                            var criticalCheck = "";
                            if (parameters[i].CRITICAL_ASSEMBLY === "true" || parameters[i].CRITICAL_ASSEMBLY === true ||
                                parameters[i].CRITICAL_ASSEMBLY === "X") {
                                criticalCheck = "X";
                            }

                            stepObj.CRITICAL_ASSEMBLY = criticalCheck;
                        }

                        if (paramid.includes("IMPACT_ANALYSIS")) {
                            if (parameters[i].IMPACT_ANALYSIS === "true" || parameters[i].IMPACT_ANALYSIS === true) {
                                // stepObj.IMPACT_ANALYSIS = parameters[i].IMPACT_ANALYSIS;
                                stepObj.IMPACT_ANALYSIS = true;
                            } else {
                                // stepObj.IMPACT_ANALYSIS = parameters[i].IMPACT_ANALYSIS;
                                stepObj.IMPACT_ANALYSIS = false;
                            }
                            // var impact = that.byId("idImpact").getSelected();
                            // stepObj.IMPACT_ANALYSIS = impact;
                        }

                        if (paramid.includes("DAILY")) {
                            if (parameters[i].DAILY === "true" || parameters[i].DAILY === true) {
                                stepObj.DAILY = true;
                            } else {
                                stepObj.DAILY = false;
                            }
                            // var daily = that.byId("idDaily").getSelected();
                            // stepObj.DAILY = daily;
                        }

                        if (paramid.includes("OVERRIDE_ASSIGNMENT")) {
                            if (parameters[i].OVERRIDE_ASSIGNMENT === "true" || parameters[i].OVERRIDE_ASSIGNMENT === true) {
                                // stepObj.OVERRIDE_ASSIGNMENT = parameters[i].OVERRIDE_ASSIGNMENT;
                                stepObj.OVERRIDE_ASSIGNMENT = true;
                            } else {
                                // stepObj.OVERRIDE_ASSIGNMENT = parameters[i].OVERRIDE_ASSIGNMENT;
                                stepObj.OVERRIDE_ASSIGNMENT = false;
                            }
                            // var override = that.byId("idOverride").getSelected();
                            // stepObj.OVERRIDE_ASSIGNMENT = override;
                        }

                        if (paramid.includes("GEN_TYPE")) {
                            if (parameters[i].GEN_TYPE === "" || parameters[i].GEN_TYPE === undefined) {
                                MessageToast.show("Please select Type for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.GEN_TYPE = parameters[i].GEN_TYPE;
                            }
                            // var genT = that.byId("GenidType").getSelectedKey();
                            // stepObj.GEN_TYPE = genT;
                        }

                        if (paramid.includes("MODEL_VERSION")) {
                            if (parameters[i].MODEL_VERSION === "" || parameters[i].MODEL_VERSION === undefined) {
                                MessageToast.show("Please select Model Version for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.MODEL_VERSION = parameters[i].MODEL_VERSION;
                            }
                            // var modelV = that.byId("idModelVer").getSelectedKey();
                            // stepObj.MODEL_VERSION = modelV;
                        }

                        if (paramid.includes("DATE_RANGE")) {
                            if(parameters[i].ACTIVITY_ID === "PURGE_PLANNING_DATA" && parameters[i].OPERATOR === "BT"){
                                if (parameters[i].FROM_DATE === "" || parameters[i].TO_DATE === "") {
                                    MessageToast.show("Please select valid date range for " + "- " + parameters[i].ACTIVITY_ID);
                                    proceedFlag = "X";
                                    break;
                                } else {
                                    stepObj.FROM_DATE = parameters[i].FROM_DATE;
                                    stepObj.TO_DATE = parameters[i].TO_DATE;
                                }
                            } else {
                            if (parameters[i].FROM_DATE === "" || parameters[i].TO_DATE === "") {
                                MessageToast.show("Please select valid date range for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.FROM_DATE = parameters[i].FROM_DATE;
                                stepObj.TO_DATE = parameters[i].TO_DATE;
                            }
                        }
                        }


                        if(paramid.includes("OPERATOR")){
                            var operator = that.byId("idOperator").getSelectedKey();
                            stepObj.OPERATOR = operator;
                        }

                        if(paramid.includes("SINGLE_DATE")){
                            if(parameters[i].ACTIVITY_ID === "PURGE_PLANNING_DATA" && parameters[i].OPERATOR !== "BT"){
                                if (parameters[i].SINGLE_DATE === "" ) {
                                    MessageToast.show("Please select valid date for " + "- " + parameters[i].ACTIVITY_ID);
                                    proceedFlag = "X";
                                    break;
                                } else {
                                    stepObj.SINGLE_DATE = parameters[i].SINGLE_DATE;
                                }
                            } else {
                                stepObj.SINGLE_DATE = parameters[i].SINGLE_DATE;
                            }
                        }

                        if (paramid.includes("Rolling_Timestamp")) {
                            stepObj.Rolling = that.byId("idRolling").getSelected();
                                stepObj.Rolling_Timestamp = parameters[i].Rolling_Timestamp;
                        }

                        if (paramid.includes("DsAlgorithm")) {
                            // if (parameters[i].DsAlgorithm === "" || parameters[i].DsAlgorithm === undefined) {
                            //     MessageToast.show("Please select valid demand sensing algorithm for " + "- " + parameters[i].ACTIVITY_ID);
                            //     proceedFlag = "X";
                            //     break;
                            // } else {
                            //     stepObj.DsAlgorithm = parameters[i].DsAlgorithm;
                            // }PidDSAlg
                            var DSAlgo = that.byId("PidDSAlg").getSelectedKey();
                            stepObj.DsAlgorithm = DSAlgo;
                        }
                        if (paramid.includes("OptFactor")) {
                            // if (parameters[i].OptFactor === "" || parameters[i].OptFactor === undefined) {
                            //     MessageToast.show("Please select valid optimization factor for " + "- " + parameters[i].ACTIVITY_ID);
                            //     proceedFlag = "X";
                            //     break;
                            // } else {
                            //     stepObj.OptFactor = parseFloat(parameters[i].OptFactor);
                            // }
                            var OPTfact = that.byId("PidOptFct").getSelectedKey();
                            stepObj.OptFactor = parseFloat(OPTfact);
                        }
                        if (paramid.includes("OptAlgorithm")) {
                            // if (parameters[i].OptAlgorithm === "" || parameters[i].OptAlgorithm === undefined) {
                            //     MessageToast.show("Please select valid optimization algorithm for " + "- " + parameters[i].ACTIVITY_ID);
                            //     proceedFlag = "X";
                            //     break;
                            // } else {
                            //     stepObj.OptAlgorithm = parameters[i].OptAlgorithm;
                            // }
                            
                            var OPTalgo= that.byId("PidOptAlg").getSelectedKey();
                            stepObj.OptAlgorithm = OPTalgo;
                        }

                        if (paramid.includes("SnapShot")) {
                            if (parameters[i].SnapShot === "") {
                                stepObj.SnapShot = "";
                                stepObj.SnapShot_Desc = "";
                            } else if (parameters[i].SnapShot === "U") {
                                stepObj.SnapShot = "U";
                                stepObj.SnapShot_Desc = "";
                            } else if (parameters[i].SnapShot === "C") {
                                stepObj.SnapShot = "C";
                                stepObj.SnapShot_Desc = parameters[i].SnapShot_Desc;
                            }

                            if(parameters[i].SnapShot === "C" && parameters[i].SnapShot_Desc === ""){
                                proceedFlag = "X";
                                MessageToast.show("Please maintain snapshot description for " + "- " + parameters[i].ACTIVITY_ID);
                                break;
                            } 
                        }

                        if (paramid.includes("HISTORY_WEEKS")) {
                            if (parameters[i].HISTORY_WEEKS === "" || parameters[i].HISTORY_WEEKS === undefined) {
                                MessageToast.show("Please select valid history weeks for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.HISTORY_WEEKS = parameters[i].HISTORY_WEEKS;
                            }
                        }

                    }

                    var step = that.TemplateItems.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === parameters[i].ACTIVITY_ID && aComp.ACT_POSITION === parameters[i].ACT_POSITION;
                    });

                    var Action = that.ActivityHeader.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === parameters[i].ACTIVITY_ID;
                    });

                    var obj = {
                        ACTIVITY_ID: parameters[i].ACTIVITY_ID,
                        STEP: step[0].ACT_POSITION,
                        ACTION_URL: Action[0].ACTION_URL,
                        TEMPLATE_ID: parameters[i].TEMPLATE_ID,
                        STEP_DATA: stepObj,
                    }
                    var obj1 = {
                        ACTIVITY_ID: parameters[i].ACTIVITY_ID,
                        STEP: step[0].ACT_POSITION,
                        TEMPLATE_ID: parameters[i].TEMPLATE_ID,
                        PARAM_VALUE: stepObj,
                        TOTAL_STEPS: that.newTotalData.length,
                    }

                    if (that.Edit !== "X" && parameters[i].ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS") {
                        obj.STEP_DATA.VALIDUSER = that.sCFUserDestination;
                        obj.STEP_DATA.USER_ID = that.sUserId;

                        obj1.PARAM_VALUE.VALIDUSER = that.sCFUserDestination;
                        obj1.PARAM_VALUE.USER_ID = that.sUserId;
                    }

                    that.SaveTemplateDetails.push(obj1);
                    aData.push(obj);

                }
            } else {
                proceedFlag = "X";
            }

            that.sSequence = "";
                that.oJobschType = that.byId("idJobSchtype").getSelectedKey();
                if (that.Edit === "") {
                    var sTime = new Date().getTime();
                    that.sSequence = "Sequence_"  + sTime;
                } else {
                    var sTime = that.JobData[0].SEQUENCE_ID.split("_")[0];
                    that.sSequence = that.JobData[0].SEQUENCE_ID;

                }

                sTime = sTime.toString().slice(2);

                that.SaveTemplateDetails.forEach(function(oItem,i){
                    var stp = i + 1;
                    oItem.STEP_NO = stp;
                    // oItem.STEP = i + 1;
                    oItem.STEP = sTime + stp.toString().padStart(4, '0');
                    
                });

                aData.forEach(function(oItem,i){
                    // oItem.STEP = i + 1;
                    var stp = i + 1;
                    oItem.STEP_NO = stp;
                    oItem.STEP = sTime + stp.toString().padStart(4, '0');
                    if(oItem.STEP_DATA.LOCATION_ID === undefined){
                        oItem.STEP_DATA.LOCATION_ID = oItem.STEP_DATA.MF_LOCATION_ID;
                    }
                });


                

                if (proceedFlag !== "X") {
                    var oModel = that.getOwnerComponent().getModel('JModel');
                    oModel.callFunction("/insertJobData", {
                        method: "GET",
                        urlParameters: {
                            //new add//
                            Flag: that.Edit,
                            // VARIANT : "",
                            Sequence: that.sSequence,
                            jobData: JSON.stringify(aData)
                        },
                        success: function (oData, oResponse) {
                            //new add//
                            if (that.Edit !== "X") {
                                that.createJob(oData.insertJobData);
                            } else {
                                that.saveJobDetails("",that.SaveTemplateDetails);
                            }

                            // //Now create job
                            // that.createJob(oData.insertJobData);
                            // // sap.m.MessageToast.show("success");
                        },
                        error: function (oResponse) {
                            sap.m.MessageToast.show("Failed");
                        },
                    });
                } 
            } else {
                sap.m.MessageToast.show("Please maintain value for Cron");
            }

        },

        

        createJob: function (sequenceID) {
            // // var actionText = "/jobs/jobCreation";//changed from jobCreation
            // var actionText = "/jobs/ParalleljobCreation";//changed from jobCreation
            var uniFlag = that.oGModel.getProperty("/CommonParam");
            if(uniFlag === ""){
                // To trigger normal jobs
                var actionText = "/jobs/ParalleljobCreation";//changed from jobCreation
            } else if(uniFlag === "X") {
                // To trigger Common parameters jobs
                var actionText = "/jobs/ParallelSetjobsCreation";
            }
            var aScheduleSEDT = that.getScheduleSEDT();
            // that.jobTime = aScheduleSEDT;
            var dCurrDateTime = new Date().getTime();
            // var JobName = "MultiJob" + dCurrDateTime;
            that.JobName = "";
            var JobName = that.byId("idJobname").getValue();
            JobName = JobName + new Date().getTime();
            that.JobName = JobName;
            //Job Start and end time
            var dDate = new Date();

            var djSdate,
                djEdate,
                dsSDate,
                dsEDate,
                tjStime,
                tjEtime,
                tsStime,
                tsEtime;

            djSdate = that.byId("idJSTime").getDateValue();
            // djSdate = new Date(new Date().setSeconds(new Date().getSeconds() + 5));       
            djEdate = that.byId("idJETime").getDateValue();

            dsSDate = that.byId("idSSTime").getDateValue();
            dsEDate = that.byId("idSETime").getDateValue();
            // dsEDate = new Date(dsSDate.setHours(new Date().getHours() + 5));

            if (dsEDate === null) {
                dsEDate = djEdate;
            }

            if (djEdate < dsEDate) {
                djEdate = dsEDate;
            }

            if (dsSDate < new Date() || dsSDate === null) {
                dsSDate = new Date(new Date().setSeconds(new Date().getSeconds() + 5));
            }

            // Getting the schedule recurring details
            var oJobschType = that.byId("idJobSchtype").getSelectedKey(),
                onetime = "",
                Cron = "";
            that.RECURRENCE_VALUE = "";
            if (oJobschType === "Im") {
                var oneTime = dsSDate;
                onetime = oneTime;
                Cron = "";
                if (onetime === null) {
                    onetime = "";
                }
                that.RECURRENCE_VALUE = onetime;
                that.RECURRENCE_VALUE_FORMAT = onetime;
            } else if (oJobschType === "Cr") {

                if (that.TemplateItems[0].ACTIVITY_ID === "DYNAMIC_FROZEN") {

                    var temp = that.byId("idOccurrence").getSelectedButton().getText();

                    if (temp === "Daily") {
                        // Cron = "*" + " " + "*" + " " + "1-31" + " " + "*" + " " + "*" + " " + "0" + " " + "0";
                        Cron = "*" + " " + "*" + " " + "1:31" + " " + "*" + " " + "*" + " " + "0" + " " + "0";
                        var tabCorn = [{

                            year: "*",
                            mnth: "*",
                            // date: "1-31",
                            date: "1:31",
                            day: "*",
                            hour: "*",
                            min: "*",
                            sec: "0"

                        }]
                    } else {
                        var selWeek = parseInt(that.byId("idWeekF").getSelectedKey());
                        if (selWeek === 0) {
                            // var calWeek = parseInt(selWeek) - 1;
                            sap.m.MessageToast.show("Please select week");
                            return;
                        }
                        var week = "";
                        switch (selWeek) {
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
                        var tabCorn = [{

                            year: "*",
                            mnth: "*",
                            date: "*",
                            day: week,
                            hour: "*",
                            min: "*",
                            sec: "0"

                        }]
                    }
                } else {
                    var year = that.byId("idyear").getValue(),
                        mnth = that.byId("idmnth").getValue(),
                        date = that.byId("iddate").getValue(),
                        day = that.byId("idWeek").getSelectedKey(),
                        hour = that.byId("idhrs").getValue(),
                        min = that.byId("idmin").getValue(),
                        selWeek;
        // Month
                    if (mnth === "") {
                        mnth = "*";
                    } else if (mnth.includes(":")) {
                        mnth = mnth;
                    } else {
                        // mnth = "*%2F" + mnth;
                        // mnth = "*/" + mnth;
                        mnth = mnth;
                    }

                    if (mnth !== "*" && year === "") {
                         year = new Date().getFullYear();
                    } 
                    if(year !== ""){
                        year = year;
                    } else {
                        year = "*";
                    }
        // Date                    
                    if (date === "") {
                        date = "*";
                    } else if (date.includes(":")) {
                        date = date;
                    } else {
                        // date = "*%2F" + date;
                        // date = "*/" + date;
                        date = date;

                    }
        // Week
                    var week = "";
                    var fullWeek = "";
                    
                    if (day === "0") {
                        week = "*";
                        fullWeek = "*";
                    } else {
                        selWeek = parseInt(day);

                        // var week = "";
                        switch (selWeek) {
                        case 1:
                            week = "sun";
                            fullWeek = "Sunday";
                            break;
                        case 2:
                            week = "mon";
                            fullWeek = "Monday";
                            break;
                        case 3:
                            week = "tue";
                            fullWeek = "Tuesday";
                            break;
                        case 4:
                            week = "wed";
                            fullWeek = "Wednesday";
                            break;
                        case 5:
                            week = "thu";
                            fullWeek = "Thursday";
                            break;
                        case 6:
                            week = "fri";
                            fullWeek = "Friday";
                            break;
                        default:
                            week = "sat";
                            fullWeek = "Saturday";
                            break;
                        }
                    }
                    that.week =  week;
        // Hour 
                    if (hour === "") {
                        hour = "*";
                    } else {
                        // hour = "*%2F" + hour;
                        // hour = "*/" + hour;
                        hour = hour;
                    }
                    var hourConversion = "";
                    if((hour !== "*" && !hour.includes("*/")) || week !== "*"){
                        hourConversion = "X";
                    }
                    that.hour = hour;

        // Minute
                    if (min === "") {
                        min = "*";
                    } else if (min === "0") {
                        min = min;
                    } else {
                        // min = "*/" + min;
                        min = min;
                    }

                    if(mnth !== "*" || date !== "*" || hour !== "*" ){
                        if(min === "*"){
                            min = "0";
                        }
                    }
                    var MinChange = "";
                    if(mnth === "*" && date === "*" && week === "*" && hour === "*" && !min.includes("*/")){
                        MinChange = "X";
                    }
                    that.min= min;

                    
                    // Formating the recurring data
                    Cron = year + " " + mnth + " " + date + " " + week + " " + hour + " " + min + " " + "0";
                    
                    // var tabCron = "*" + "," + mnth + "," + date + "," + day + "," + hour + "," + min + "," + "0";
                    var tabCorn = [{

                        year: year,
                        mnth: that.byId("idmnth").getValue(),
                        date: that.byId("iddate").getValue(),
                        // day: that.byId("idWeek").getSelectedKey(),week
                        day: week,
                        hour: that.byId("idhrs").getValue(),
                        min: that.byId("idmin").getValue(),
                        sec: "0"

                    }]
                }

                that.RECURRENCE_VALUE = Cron;
                that.RECURRENCE_VALUE_FORMAT = JSON.stringify(tabCorn);


                if(hourConversion === "X"){
                    function getNextWeekday(dayIndex) {
                        var today = new Date();
                        var currentDay = today.getDay();
                        var difference = (dayIndex + 7 - currentDay) % 7;
                        
                        // If the difference is 0, it means today is the requested weekday
                        difference = difference === 0 ? 7 : difference;
                        
                        var nextDate = new Date(today.setDate(today.getDate() + difference));

                        nextDate.setHours(that.hour);
                        nextDate.setMinutes(that.min);


                        that.timezone = that.oGModel.getProperty("/timezone");

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

                            const originalDate = nextDate;
                            const targetTimeZone = that.timezone;

                            if(that.opr == "-"){
			
                                originalDate.setTime(originalDate.getTime() + (that.zHours+that.zMin));	
                                }
                                else{
                                    originalDate.setTime(originalDate.getTime() - (that.zHours+that.zMin));
                                }

                                var selWeek = originalDate.getDay();
                                var week ="*";
                                switch (selWeek) {
                                    case 0:
                                        week = "sun";                                        
                                        break;
                                    case 1:
                                        week = "mon";                                        
                                        break;
                                    case 2:
                                        week = "tue";                                        
                                        break;
                                    case 3:
                                        week = "wed";                                        
                                        break;
                                    case 4:
                                        week = "thu";                                        
                                        break;
                                    case 5:
                                        week = "fri";                                        
                                        break;
                                    case 6:
                                        week = "sat";                                        
                                        break;
                                    }
                                that.week =  week;  
                                that.hour = originalDate.getHours();
                                that.min = originalDate.getMinutes();

                    }
                    
                    // Function to get the next occurrence of a specific weekday by name
                    function getNextWeekdayByName(weekdayName) {
                        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var dayIndex = weekdays.indexOf(weekdayName);
                        
                        if (dayIndex === -1) {
                            throw new Error('Invalid weekday name provided');
                        }
                        
                        return getNextWeekday(dayIndex);
                    }

                    if(fullWeek !== "*"){
                        var nextTuesday = getNextWeekdayByName(fullWeek);
                    } else {
                    if(hour !== "*" && !hour.includes("*/")){

                        var nextDate = new Date();

                        nextDate.setHours(that.hour);
                        nextDate.setMinutes(that.min);


                        that.timezone = that.oGModel.getProperty("/timezone");

                        // that.zone = new Date().getTimezoneOffset().toString();
                        // // that.opr = that.zone.slice(0,1);
                        // that.opr = new Date().toString().split("GMT")[1].slice(0, 1);

                        // if (that.zone.includes("-")) {
                        //     that.zHours = (Math.floor(that.zone.slice(1) / 60)) * 60 * 60 * 1000;
                        //     that.zMin = (that.zone.slice(1) % 60) * 60 * 1000;
                        // } else {
                        //     that.zHours = (Math.floor(that.zone / 60)) * 60 * 60 * 1000;
                        //     that.zMin = (that.zone % 60) * 60 * 1000;
                        // }
                       
                        // const originalDate = nextDate;
                        // const targetTimeZone = that.timezone;

                        // if (that.opr == "-") {

                        //     originalDate.setTime(originalDate.getTime() + (that.zHours + that.zMin));
                        // }
                        // else {
                        //     originalDate.setTime(originalDate.getTime() - (that.zHours + that.zMin));
                        // }

                        const originalDate = nextDate;
                            const targetTimeZone = "UTC+00:00";

                            

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
                                
                                var convertedDate = originalDate.toLocaleString('en-US', {
                                    dateStyle:"medium",
                                    timeStyle:"medium",
                                    hour12:false
                                });

                                convertedDate = new Date(convertedDate);


                        that.hour = convertedDate.getHours();
                        that.min = convertedDate.getMinutes();
                    }
                    }
                    // Formating the recurring data
                    Cron = year + " " + mnth + " " + date + " " + that.week + " " + that.hour + " " + that.min + " " + "0";
                }

                if(MinChange === "X"){
                    var nextDate = new Date();
                    that.hour = 0;
                    nextDate.setHours(that.hour);
                    nextDate.setMinutes(that.min);


                    that.timezone = that.oGModel.getProperty("/timezone");

                    that.zone = new Date().getTimezoneOffset().toString();
                    // that.opr = that.zone.slice(0,1);
                    that.opr = new Date().toString().split("GMT")[1].slice(0, 1);

                    if (that.zone.includes("-")) {
                        that.zHours = (Math.floor(that.zone.slice(1) / 60)) * 60 * 60 * 1000;
                        that.zMin = (that.zone.slice(1) % 60) * 60 * 1000;
                    } else {
                        that.zHours = (Math.floor(that.zone / 60)) * 60 * 60 * 1000;
                        that.zMin = (that.zone % 60) * 60 * 1000;
                    }
                   
                    const originalDate = nextDate;
                    const targetTimeZone = that.timezone;

                    if (that.opr == "-") {

                        originalDate.setTime(originalDate.getTime() + (that.zHours + that.zMin));
                    }
                    else {
                        originalDate.setTime(originalDate.getTime() - (that.zHours + that.zMin));
                    }

                    that.hour = originalDate.getHours();
                    that.min = originalDate.getMinutes();

                    // Formating the recurring data
                    Cron = year + " " + mnth + " " + date + " " + that.week + " " + that.hour + " " + that.min + " " + "0";
                }

            }

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

            that.JobStartTime = djSdate,
                that.JobEndTime = djEdate,
                that.ScheduleStartTime = dsSDate,
                that.ScheduleEndTime = dsEDate;
            var oData = {
                JOBDATA: JSON.stringify(sequenceID)
            }
            var finalList = {
                name: JobName,
                description: JobName,
                action: encodeURIComponent(actionText),
                active: true,
                httpMethod: "POST",
                startTime: that.JobStartTime,
                endTime: that.JobEndTime,
                createdAt: aScheduleSEDT.djSdate,
                schedules: [{
                    data: oData,
                    cron: Cron,
                    time: onetime,
                    // cron: "",
                    // time: that.ScheduleStartTime,
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
                    sap.m.MessageToast.show(oData.addJobCreation.jobId + ": Job Created");
                    // that.testClick2(oData.addJobCreation.sequenceId)
                    that.saveJobDetails(oData.addJobCreation.jobId,that.SaveTemplateDetails);
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error While publishing data!");
                },
            });
        
        },

        saveJobDetails: function (Jobid,jobData) {
            // var aData = that.SaveTemplateDetails;
            // // var time = that.jobTime;
            // // var JobName = that.byId("idJobname").getValue();
            // // JobName = JobName + new Date().getTime();
            // var JobName = that.JobName;
            // var oJobschType = that.byId("idJobSchtype").getSelectedItem().getText();
            // // if(that.Edit === "X"){
            // //     that.RecurrenceData();
            // // }


            var aData = jobData;
            var JobName = that.JobName;
            var oJobschType = that.byId("idJobSchtype").getSelectedItem().getText();

            var dt = new Date();
            var startDate = new Date(that.JobStartTime);
            var EndDate = new Date(that.JobEndTime);

            var StartDate1 = new Date(that.ScheduleStartTime);
            var sEndDate1 = new Date(that.ScheduleEndTime);

            // var lgTime = new Date().getTimezoneOffset();

            startDate = new Date(startDate.setTime(startDate.getTime() + (startDate.getTimezoneOffset() * 60 * 1000)));
            EndDate = new Date(EndDate.setTime(EndDate.getTime() + (EndDate.getTimezoneOffset() * 60 * 1000)));
            StartDate1 = new Date(StartDate1.setTime(StartDate1.getTime() + (StartDate1.getTimezoneOffset() * 60 * 1000)));
            sEndDate1 = new Date(sEndDate1.setTime(sEndDate1.getTime() + (sEndDate1.getTimezoneOffset() * 60 * 1000)));

            if (that.Edit === "X") {
                var JobId = that.EditData.JOB_ID;
            } else {
                var JobId = Jobid;
            }

            var User = "";
            if (sap.ushell.Container) {
                let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                User = (email) ? email : "";
            }
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

            if (oJobschType === "onetime") {
                var Rec_value = new Date(that.RECURRENCE_VALUE);
                var sRec_value =
                    `${
                Rec_value.getFullYear()}-${
                    padL(Rec_value.getMonth()+1)}-${
                    padL(Rec_value.getDate())} ${
                    padL(Rec_value.getHours())}:${
                    padL(Rec_value.getMinutes())}:${
                    padL(Rec_value.getSeconds())}`

                that.RECURRENCE_VALUE = sRec_value;
            }

            // if(that.Edit === "X"){
            //     var seq = that.JobData[0].SEQUENCE_ID;
            // } else {
            //     var seq = that.sSequence
            // }
            var totSteps = aData.length;

            aData.forEach(function (row) {

                if (that.JobData.length > 0) {
                    var jobdata = that.JobData.filter(function (aComp) {
                        return aComp.JOB_ID === JobId && aComp.ACTIVITY_ID === row.ACTIVITY_ID && aComp.ACT_POSITION === row.ACT_POSITION;
                    });
                    row.SUBJOB_ID = jobdata[0].SUBJOB_ID;
                    row.SCHEDULE_ID = jobdata[0].SCHEDULE_ID;
                } else {
                    row.SUBJOB_ID = null;
                    row.SCHEDULE_ID = "";
                }
                row.TOTAL_STEPS = totSteps;
                row.SEQUENCE_ID = that.sSequence;
                row.JOB_ID = JobId;
                row.JOB_NAME = JobName;
                row.JOB_TYPE = oJobschType;
                row.RECURRENCE_VALUE = that.RECURRENCE_VALUE;
                row.RECURRENCE_VALUE_FORMAT = that.RECURRENCE_VALUE_FORMAT;
                row.JOB_STARTTIME = JStartDate;
                row.JOB_ENDTIME = JEndDate;
                row.SCH_STARTTIME = SStartDate;
                row.SCH_ENDTIME = SEndDate;
                row.CREATED_BY = User;
                row.LEVEL = that.LEVEL
            });

            //     if(that.Edit === "X"){
            //     // for(var i =0; i<aData.length; i++){
            //     //     var jobdata = aData.filter(function (aComp) {
            //     //         return aComp.JOB_ID === aData[i].JOB_ID && aComp.ACTIVITY_ID === aData[i].ACTIVITY_ID;
            //     //     });
            //     //     aData[i].SUBJOB_ID = jobdata[0].SUBJOB_ID;
            //     //     // aData[i].SCHEDULE_ID = jobdata[0].SCHEDULE_ID;

            //     // }
            // }

            that.getModel("JSModel").callFunction("/genJobDetails", {
                method: "GET",
                urlParameters: {
                    Flag: that.Edit,
                    JobDATA: JSON.stringify(aData)
                },
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if (that.Edit === "X") {
                        sap.m.MessageToast.show("Schedule updated");
                        that.updateSchedule();
                    }
                    var flag = "X";
                    that.onBack("",flag);
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Failed to save");
                },
            });

        },

        updateSchedule: function () {
            that.getModel("JModel").callFunction("/updateJobSchedules", {
                method: "GET",
                urlParameters: {
                    SEQUENCE_ID:JSON.stringify(that.sSequence),
                    JOB_ID: that.JobData[0].JOB_ID
                },
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    var flag = "X";
                    that.onBack("",flag);
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                },
            });

        },

        getScheduleSEDT: function () {
            var aScheduleSEDT = {};
            var dDate = new Date();
            // 07-09-2022-1                
            var idSchTime = dDate.setSeconds(dDate.getSeconds() + 5);
            // 07-09-2022-1
            var idSETime = dDate.setHours(dDate.getHours() + 4);
            idSchTime = new Date(idSchTime);
            idSETime = new Date(idSETime);
            //var onetime = idSchTime;
            var djSdate = new Date(),
                djEdate = idSETime,
                dsSDate = new Date(),
                dsEDate = idSETime,
                tjStime,
                tjEtime,
                tsStime,
                tsEtime;

            djSdate = djSdate.toISOString().split("T");
            tjStime = djSdate[1].split(":");
            djEdate = djEdate.toISOString().split("T");
            tjEtime = djEdate[1].split(":");
            dsSDate = dsSDate.toISOString().split("T");
            tsStime = dsSDate[1].split(":");
            dsEDate = dsEDate.toISOString().split("T");
            tsEtime = dsEDate[1].split(":");

            var dDate = new Date().toLocaleString().split(" ");
            aScheduleSEDT.djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
            aScheduleSEDT.djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
            aScheduleSEDT.dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
            aScheduleSEDT.dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";
            aScheduleSEDT.oneTime = idSchTime;

            return aScheduleSEDT;

        },






        onCommonParams:function(){

             var template = that.byId("idTempValue").getValue(),
                jobName = that.byId("idJobname").getValue();

                if(template !== "" && jobName!== ""){
                    this._oCore = sap.ui.getCore();
             if (!this._CommonParamsDialog) {
                 this._CommonParamsDialog = sap.ui.xmlfragment(
                     "vcpapp.vcpjobschedulersequence.view.CommonParams",
                     this
                 );
                 this.getView().addDependent(this._CommonParamsDialog);
             }
             this._oCore = sap.ui.getCore();

              // Inputs Visible
              sap.ui.getCore().byId("MF_LOCATIONU").setVisible(false);
              sap.ui.getCore().byId("DM_LOCATIONU").setVisible(false);
              sap.ui.getCore().byId("CONFIG_PRODUCTU").setVisible(false);
              sap.ui.getCore().byId("PARTIAL_PRODUCTU").setVisible(false);
              sap.ui.getCore().byId("MODEL_VERSIONU").setVisible(false);
              sap.ui.getCore().byId("PREDICTION_PROFILEU").setVisible(false);
              sap.ui.getCore().byId("VERSIONU").setVisible(false);
              sap.ui.getCore().byId("SCENARIOU").setVisible(false);
              sap.ui.getCore().byId("CLASSU").setVisible(false);
              sap.ui.getCore().byId("CUSTOMER_GROUPU").setVisible(false);
              sap.ui.getCore().byId("GEN_TYPEU").setVisible(false);
              sap.ui.getCore().byId("DATE_RANGEU").setVisible(false);
              sap.ui.getCore().byId("SINGLE_DATEU").setVisible(false);
              sap.ui.getCore().byId("OPERATORU").setVisible(false);
              sap.ui.getCore().byId("idRollingWeeksU").setVisible(false);
              sap.ui.getCore().byId("Rolling_TimestampU").setVisible(false);
              sap.ui.getCore().byId("OVERRIDE_ASSIGNMENTU").setVisible(false);
              sap.ui.getCore().byId("CRITICAL_ASSEMBLYU").setVisible(false);
              sap.ui.getCore().byId("IMPACT_ANALYSISU").setVisible(false);
              sap.ui.getCore().byId("DAILYU").setVisible(false);
              sap.ui.getCore().byId("OptAlgorithmU").setVisible(false);
              sap.ui.getCore().byId("OptFactorU").setVisible(false);
              sap.ui.getCore().byId("DsAlgorithmU").setVisible(false);
              sap.ui.getCore().byId("SnapShotU").setVisible(false);
              sap.ui.getCore().byId("SnapRU").setVisible(false);
              sap.ui.getCore().byId("snapDescU").setVisible(false);
              sap.ui.getCore().byId("HISTORY_WEEKSU").setVisible(false);

              sap.ui.getCore().byId("MFLInputU").setValue();
              sap.ui.getCore().byId("DlocInputU").setValue();
              sap.ui.getCore().byId("CprodInputU").setValue();
              sap.ui.getCore().byId("PprodInputU").setValue();
              // sap.ui.getCore().byId("MODEL_VERSION").setValue();
              sap.ui.getCore().byId("PrePFInputU").setValue();
              sap.ui.getCore().byId("idverU").setValue();
              sap.ui.getCore().byId("idscenU").setValue();
              sap.ui.getCore().byId("classInputU").setValue();
              sap.ui.getCore().byId("custGrpInputU").setValue();
              sap.ui.getCore().byId("FromDateU").setValue();
              sap.ui.getCore().byId("ToDateU").setValue();
              sap.ui.getCore().byId("singleDtU").setValue();
              sap.ui.getCore().byId("idRollingWeeksU").setValue();
              sap.ui.getCore().byId("idSnapDescU").setValue();
              sap.ui.getCore().byId("idWeeksU").setValue();
              sap.ui.getCore().byId("idOverrideU").setSelected(false);
              sap.ui.getCore().byId("idCriticalU").setSelected(false);
              sap.ui.getCore().byId("idImpactU").setSelected(false);
              sap.ui.getCore().byId("idDailyU").setSelected(false);
              sap.ui.getCore().byId("idSnapShotU").setSelected(false);
              sap.ui.getCore().byId("idRollingU").setSelected(false);

              sap.ui.getCore().byId("CprodInputU").removeAllTokens();
              sap.ui.getCore().byId("DlocInputU").removeAllTokens();
              sap.ui.getCore().byId("PprodInputU").removeAllTokens();
              sap.ui.getCore().byId("MFLInputU").removeAllTokens();


             
            //  var params = that.UniParamaters;
             var params = [];
            var tempData = that.TempParams;

            var aData = that.ActivityItems;
             var temp=[];
            for(var t=0; t<tempData.length; t++){

                temp = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === tempData[t].ACTIVITY_ID;
                });
                    params = params.concat(temp);

        }
      

            function removeDuplicate(array, key) {
                var check = new Set();
                        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }
                that.Parameters = removeDuplicate(params, 'PARAMETER_ID');

                that.Parameters.forEach(el => {
                    if(el.PARAMETER_ID !== "" && el.PARAMETER_ID !== " " && el.PARAMETER_ID !== undefined && el.PARAMETER_ID !== null && el.PARAMETER_ID !== "actlevelU"){
                    var id = el.PARAMETER_ID + "U"
                    
                        sap.ui.getCore().byId(id).setVisible(true);
                    }                    
                });

                if(sap.ui.getCore().byId("DATE_RANGEU").getVisible()){
                    var newDate = new Date(new Date(). getTime() + 104 * 7 * 24 * 60 * 60 * 1000);
                    var fromDate = new Date().toISOString().split("T")[0];
                    var toDate = newDate.toISOString().split("T")[0];
    
                    sap.ui.getCore().byId("FromDateU").setValue(fromDate);
                    sap.ui.getCore().byId("ToDateU").setValue(toDate);

                }

                if(sap.ui.getCore().byId("VERSIONU").getVisible()){
                    for(var i=0; i<that.DefaultVersce.length; i++){
                        if(that.DefaultVersce[i].PARAMETER_ID === 20){
                            sap.ui.getCore().byId("idverU").setValue(that.DefaultVersce[i].VALUE);
                        } else {
                            sap.ui.getCore().byId("idscenU").setValue(that.DefaultVersce[i].VALUE);
                        }
                    }
                    
                }
                sap.ui.getCore().byId("PARTIAL_PRODUCTU").setVisible(false);
                that.oGModel.setProperty("/CommonParam","X");

                this._CommonParamsDialog.open();

            } else {
                sap.m.MessageToast.show("Please maintain Template and Job Name");
                that.oGModel.setProperty("/CommonParam","");
            }

    },

    onHandleClose:function(){
        that.oGModel.setProperty("/CommonParam","");
        that._CommonParamsDialog.close();
        if(that.Edit === "X"){
            that.onBack();
        }
    },

    generateJobData:function(){
                        var predPr = sap.ui.getCore().byId("PrePFInputU").getVisible(),
                         ver = sap.ui.getCore().byId("idverU").getVisible(),
                        sce = sap.ui.getCore().byId("idscenU").getVisible();
                        var paramFlag = "";
                        if(predPr && sap.ui.getCore().byId("PrePFInputU").getValue() === ""){
                            paramFlag = "X";
                        }
                        if(ver && sap.ui.getCore().byId("idverU").getValue() === ""){
                            paramFlag = "X";
                        }
                        if(sce && sap.ui.getCore().byId("idscenU").getValue() === ""){
                            paramFlag = "X";
                        }
if(paramFlag === ""){
        var tempData = that.TempParams;

            var aData = that.ActivityItems;
             var temp=[];
             var temp = [];
                var s4string = "";
                var string = "";
                var array = [];
                 for(var t=0; t<tempData.length; t++){
                    var act = tempData[t].ACTIVITY_ID;                    
                    if(act.includes("IMPORT_S4")){
                        if(s4string !== ""){
                            s4string = s4string + "," + act;
                        } else {
                            s4string = act;
                        }
                    } else {
                        temp.push(act);
                    }
                }
                    if(s4string !== ""){
                        array.push(s4string);
                    }
                var exportIndex="";
                var verIndex = "";
                for(var t=0; t<temp.length; t++){
                    var act = temp[t]; 
                    if(t === temp.length - 1){
                        var next = "";
                    } else {
                        var next = temp[t + 1];

                    }
                    if(t === 0 ){
                        if(act === "IMPORT_VERSION_SCENARIO"){
                            string = act;
                            array.push(string);
                            string = "";
                        } else if(act === "EXPORT_IBP_CLASS" || act === "EXPORT_IBP_CUSTOMERGROUP" || 
                            act === "EXPORT_IBP_LOCATION" || act === "EXPORT_IBP_PRODUCT" ){
                                exportIndex = 0;
                                array[exportIndex] = string;
                                string = "";
                        } else {
                            string = act;

                            if(next === "IMPORT_VERSION_SCENARIO"){
                                array.push(string);
                                string = "";
                            }
                            else if(next === "EXPORT_IBP_CLASS" || next === "EXPORT_IBP_CUSTOMERGROUP" || 
                                next === "EXPORT_IBP_LOCATION" || next === "EXPORT_IBP_PRODUCT" ){
                                if(exportIndex === ""){
                                    array.push(string);
                                    string = "";
                                    exportIndex = array.length;
                                } else {
                                    if(array[exportIndex] === undefined){
                                        array[exportIndex] = string;
                                    } else {
                                        array[exportIndex] = array[exportIndex] + "," + string;
                                    }
                                    string = "";
                                }
                            } 
                            else if(next === "") {
                                array.push(string);
                                string = "";
                            }
                        }
                           

                    } else {
                        
                        if(string !== ""){
                            string = string + "," + act;
                        } else {
                            string = act;
                        }

                        if(next === "IMPORT_VERSION_SCENARIO" || act === "IMPORT_VERSION_SCENARIO"){
                            if(verIndex === ""){
                                if(exportIndex === ""){
                                    array.push(string);
                                } else {
                                    if(array[exportIndex] === undefined){
                                        array[exportIndex] = string;
                                    } else {
                                        array[exportIndex] = array[exportIndex] + "," + string;
                                    }
                                }
                                
                                string = "";
                                verIndex = array.length;
                            } else {
                                array[verIndex] = string;
                                string = "";
                            }
                        }
                        else if(next === "EXPORT_IBP_CLASS" || next === "EXPORT_IBP_CUSTOMERGROUP" || 
                            next === "EXPORT_IBP_LOCATION" || next === "EXPORT_IBP_PRODUCT" ){
                            if(exportIndex === ""){
                                array.push(string);
                                string = "";
                                exportIndex = array.length;
                            } else {
                                if(array[exportIndex] === undefined){
                                    array[exportIndex] = string;
                                } else {
                                    array[exportIndex] = array[exportIndex] + "," + string;
                                }
                                string = "";
                            }
                        } 
                        
                        else if(next === "") {
                            array.push(string);
                            string = "";
                        }
                    }
                    
                } 

                console.log(array);

                var core = sap.ui.getCore();
                var manuLocation =[];
                var demandLocation = [];
                var product = [];
                // var demandLocation = core.byId("DlocInputU").getTokens();
                // var product = core.byId("CprodInputU").getTokens();

    // Manufacturing Locations
                if(core.byId("MFLInputU").getTokens().length > 0 ){
                    var maloc = core.byId("MFLInputU").getTokens();
                        for(var i=0; i<maloc.length; i++){
                            var obj = {
                                FACTORY_LOC : maloc[i].getText()
                            };
                            manuLocation.push(obj);
                        }

                } else {
                    var manuLocation = that.MFLocDataUni;
                }

    // Demand Locations
                if(core.byId("DlocInputU").getTokens().length > 0 ){
                    var deLoc = core.byId("DlocInputU").getTokens();
                    for(var i=0; i<deLoc.length; i++){
                        var obj = {
                            FACTORY_LOC : deLoc[i].getKey(),
                            DEMAND_LOC : deLoc[i].getText(),

                        };
                        demandLocation.push(obj);
                    }
                } else {
                    var dloc = that.TotalDataUni;
                    var idsInArray = manuLocation.map(item => item.FACTORY_LOC);
                    dloc = dloc.filter(item => idsInArray.includes(item.FACTORY_LOC));
                    function removeDuplicate(array, key) {
                        var check = new Set();
                        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }
                    var demandLocation = removeDuplicate(dloc, 'DEMAND_LOC');
                    // var demandLocation = dloc;
                }
    // Products
                if(core.byId("CprodInputU").getTokens().length > 0 ){
                    var pro = core.byId("CprodInputU").getTokens();
                    for(var i=0; i<pro.length; i++){
                        var obj = {
                            DEMAND_LOC : pro[i].getKey(),
                            PRODUCT_ID : pro[i].getText()
                        };
                        product.push(obj);
                    }
                } else {
                    var prod = that.TotalDataUni;
                    var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);
                    var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                    prod = prod.filter(item => idsInArray1.includes(item.FACTORY_LOC));
                    prod = prod.filter(item => idsInArray.includes(item.DEMAND_LOC));
                    // function removeDuplicate(array, key) {
                    //     var check = new Set();
                    //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    // }
                    // var product = removeDuplicate(prod, 'PRODUCT_ID');

                    var product = prod;
                }

                var core = sap.ui.getCore();
                var otherParams = {
                    
                    PREDICTION_PROFILE  :core.byId("PrePFInputU").getValue(),
                    VERSION             :core.byId("idverU").getValue(),
                    SCENARIO            :core.byId("idscenU").getValue(),
                    CLASS               :core.byId("classInputU").getValue(),
                    CUSTOMER_GROUP      :core.byId("custGrpInputU").getValue(),
                    FROM_DATE           :core.byId("FromDateU").getValue(),
                    TO_DATE             :core.byId("ToDateU").getValue(),
                    SINGLE_DATE         :core.byId("singleDtU").getValue(),
                    Rolling_Timestamp   :core.byId("idRollingWeeksU").getValue(),
                    HISTORY_WEEKS       :core.byId("idWeeksU").getValue(),
                    OVERRIDE_ASSIGNMENT :core.byId("idOverrideU").getSelected(),
                    CRITICAL_ASSEMBLY   :core.byId("idCriticalU").getSelected(),
                    IMPACT_ANALYSIS     :core.byId("idImpactU").getSelected(),
                    DAILY               :core.byId("idDailyU").getSelected(),
                    SnapShot            :core.byId("idSnapShotU").getSelected(),
                    SnapShot_Desc       :core.byId("idSnapDescU").getValue(),
                    Rolling             :core.byId("idRollingU").getSelected(),

                    OPERATOR            :core.byId("idOperatorU").getSelectedKey(),
                    MODEL_VERSION       :core.byId("idModelVerU").getSelectedKey(),
                    GEN_TYPE            :core.byId("GenidTypeU").getSelectedKey(),
                    DsAlgorithm         : core.byId("PidDSAlgU").getSelectedKey(),
                    OptFactor           : core.byId("PidOptFctU").getSelectedKey(),
                    OptAlgorithm        : core.byId("PidOptAlgU").getSelectedKey(),
                     
                   

                }

                var idsInArray = product.map(item => item.PRODUCT_ID);
                    var data = that.TotalDataUni.filter(item => idsInArray.includes(item.PRODUCT_ID));
                    var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);
                    var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                    var prod1 = data.filter(item => idsInArray1.includes(item.FACTORY_LOC));
                    var productData = prod1.filter(item => idsInArray.includes(item.DEMAND_LOC));

                    if(productData.length <= 0){
                        sap.m.MessageToast.show("Select Products with combination of Locations");
                        return;
                    }

                     function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                     productData = removeDuplicate(productData, 'REF_PRODID');


                var FinalDataArray = [],
                    cArray = [];
                    var mdObj = {};
                    var parObj = {};
                    var confObj ={};

                for(var m=0; m<manuLocation.length; m++){
                    var f = {
                        FACTORY_LOC:manuLocation[m].FACTORY_LOC
                    }

                    var dLoc = demandLocation.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC);

                    for(var d=0; d<dLoc.length; d++){
                        var dem = {
                            LOCATION_ID: dLoc[d].DEMAND_LOC
                        }

                        mdObj = {
                            ...f,
                            ...dem
                        }

                        
                        // var prd = product.filter(el => el.DEMAND_LOC === dLoc[d].DEMAND_LOC );
                        var preProd="";
                        var currProd="";
                        var string = "";
                        var configProd="";

                        
                        for(var p=0; p<productData.length; p++){
                            string = "";
                            var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC && 
                                                                    el.DEMAND_LOC === dLoc[d].DEMAND_LOC && 
                                                                    el.REF_PRODID === productData[p].REF_PRODID);
                                if(PP.length > 0){
                            PP.forEach(e => {
                                var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
                                if(index !== -1){
                                    if(string === ""){
                                        string = product[index].PRODUCT_ID;
                                    } else {
                                        if(!string.includes("product[index].PRODUCT_ID")){
                                            string = string + "," + product[index].PRODUCT_ID;
                                        }
                                    }
                                }
                            });
                                var cobj = {
                                REF_PRODID: productData[p].REF_PRODID,
                                PRODUCT_ID: string
                            }
                                parObj = {
                                    ...mdObj,
                                    ...cobj,
                                    ...otherParams
                                }


                                FinalDataArray.push(parObj);
                                string="";
                            }

                        }


                        
                        // for(var p=0; p<prd.length; p++){
                        //     var temp = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC && 
                        //                                               el.DEMAND_LOC === dLoc[d].DEMAND_LOC && 
                        //                                               el.PRODUCT_ID === prd[p].PRODUCT_ID);
                        //     if(temp.length > 0){
                        //         if(p == 0){
                        //             preProd = temp[0].REF_PRODID;
                        //         }
                        //         currProd = temp[0].REF_PRODID;
                            
                        //  if(currProd === preProd){
                        //         if(string === ""){
                        //             string = temp[0].PRODUCT_ID;
                        //         } else {
                        //             string = string + "," + temp[0].PRODUCT_ID;
                        //         }
                        //          configProd = temp[0].REF_PRODID;
                        //  } else {
                        //     var cobj = {
                        //         REF_PRODID: configProd,
                        //         PRODUCT_ID: string
                        //     }
                        //         parObj = {
                        //             ...mdObj,
                        //             ...cobj
                        //         }

                        //         FinalDataArray.push(parObj);
                        //         string="";
                        //         string = temp[0].PRODUCT_ID;
                        //         configProd = temp[0].REF_PRODID;
                        //  }
                        //  if(p === prd.length - 1){
                        //     var cobj = {
                        //         REF_PRODID: configProd,
                        //         PRODUCT_ID: string
                        //     }
                        //         parObj = {
                        //             ...mdObj,
                        //             ...cobj
                        //         }

                        //         FinalDataArray.push(parObj);
                        //         string="";
                        //  }
                            
                        //     preProd = temp[0].REF_PRODID;
                        // }

                        // }
                    }

                }

                var step =0;
                var substep =0;
                var TemplateDetails = [],
                JobcreationData = [];
                var set = 0;
                var mainstep = 0;

                    for(var a=0; a<array.length; a++){
                        

                        if(array[a].includes("IMPORT_S4") || array[a].includes("EXPORT_IBP_CLASS") || array[a].includes("EXPORT_IBP_CUSTOMERGROUP")
                            || array[a].includes("EXPORT_IBP_LOCATION") || array[a].includes("EXPORT_IBP_PRODUCT") || array[a].includes("IMPORT_VERSION_SCENARIO")){
                                substep = 0;
                                set = set + 1;
                                mainstep = mainstep + 1;
                                var activity = array[a].split(",");
                                for(var t=0; t<activity.length; t++){
                                    step = step + 1;
                                    substep = substep + 1;
                                    var Action = that.ActivityHeader.filter(function (aComp) {
                                        return aComp.ACTIVITY_ID === activity[t];
                                    });
                                    var obj = {
                                        TEMPLATE_ID :  that.byId("idJobname").getValue(),
                                        ACTIVITY_ID : activity[t],
                                        PARAM_VALUE : {},
                                        SET : set,
                                        STEP : step,
                                        SUBSTEP :substep,
                                        TOTAL_STEPS: 0,
                                        MAIN_STEP : mainstep,
                                        MANDATORY: "X"
                                        
                                    }
                                    var obj1 = {
                                        TEMPLATE_ID : that.byId("idJobname").getValue(),
                                        ACTIVITY_ID : activity[t],
                                        STEP_DATA : {},
                                        ACTION_URL: Action.length >0? Action[0].ACTION_URL: "",
                                        SET : set,
                                        STEP : step,
                                        SUBSTEP :substep,
                                        MAIN_STEP : mainstep,
                                        MANDATORY: "X"
                                        
                                    }

                                    TemplateDetails.push(obj);
                                    JobcreationData.push(obj1);
                            }

                            } else {
                              var activity = array[a].split(",");
                              mainstep = mainstep + 1;
                              var object ={};
                              for(var i=0; i<FinalDataArray.length; i++){
                                substep = 0;
                                set = set + 1;
                                for(var t=0; t<activity.length; t++){
                                    var Action = that.ActivityHeader.filter(function (aComp) {
                                        return aComp.ACTIVITY_ID === activity[t];
                                    });
                                    var aData = that.ActivityItems;
                                    aData = aData.filter(el=> el.ACTIVITY_ID === activity[t]);
                                    var stepObj = {};
                                    substep = substep + 1;
                                    aData.forEach(el => {
                                        var test = el.PARAMETER_ID;
                                        if(test === "MF_LOCATION"){
                                            stepObj.MF_LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                        } else if(test === "DM_LOCATION"){
                                            stepObj.LOCATION_ID = FinalDataArray[i].LOCATION_ID;
                                        } else if(test === "CONFIG_PRODUCT"){
                                            stepObj.PRODUCT_ID = FinalDataArray[i].REF_PRODID;
                                        }  else if(test === "PARTIAL_PRODUCT"){
                                            stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");
                                        }  else if(test === "PREDICTION_PROFILE"){
                                            stepObj.PREDICTION_PROFILE = FinalDataArray[i].PREDICTION_PROFILE;
                                        }  else if(test === "VERSION"){
                                            stepObj.VERSION = FinalDataArray[i].VERSION;
                                        }  else if(test === "SCENARIO"){
                                            stepObj.SCENARIO = FinalDataArray[i].SCENARIO;
                                        }  else if(test === "CUSTOMER_GROUP"){
                                            stepObj.CUSTOMER_GROUP = FinalDataArray[i].CUSTOMER_GROUP;
                                        }  else if(test === "CLASS"){
                                            stepObj.CLASS = FinalDataArray[i].CLASS;
                                        }  else if(test === "CRITICAL_ASSEMBLY"){
                                            var criticalCheck = "";
                                            if (FinalDataArray[i].CRITICAL_ASSEMBLY === "true" || FinalDataArray[i].CRITICAL_ASSEMBLY === true ||
                                                FinalDataArray[i].CRITICAL_ASSEMBLY === "X") {
                                                  criticalCheck = "X";
                                            }
                                            stepObj.CRITICAL_ASSEMBLY = criticalCheck;
                                        }  else if(test === "IMPACT_ANALYSIS"){
                                            if (FinalDataArray[i].IMPACT_ANALYSIS === "true" || FinalDataArray[i].IMPACT_ANALYSIS === true) {
                                                stepObj.IMPACT_ANALYSIS = true;
                                            } else {
                                                stepObj.IMPACT_ANALYSIS = false;
                                            }
                                        }  else if(test === "DAILY"){
                                            if (FinalDataArray[i].DAILY === "true" || FinalDataArray[i].DAILY === true) {
                                                stepObj.DAILY = true;
                                            } else {
                                                stepObj.DAILY = false;
                                            }
                                        }  else if(test === "OVERRIDE_ASSIGNMENT"){
                                            if (FinalDataArray[i].OVERRIDE_ASSIGNMENT === "true" || FinalDataArray[i].OVERRIDE_ASSIGNMENT === true) {
                                                stepObj.OVERRIDE_ASSIGNMENT = true;
                                            } else {
                                                stepObj.OVERRIDE_ASSIGNMENT = false;
                                            }
                                        }  else if(test === "GEN_TYPE"){
                                            stepObj.GEN_TYPE = FinalDataArray[i].GEN_TYPE;
                                        }  else if(test === "MODEL_VERSION"){
                                            stepObj.MODEL_VERSION = FinalDataArray[i].MODEL_VERSION;
                                        }  else if(test === "DATE_RANGE"){
                                            stepObj.FROM_DATE = FinalDataArray[i].FROM_DATE;
                                            stepObj.TO_DATE = FinalDataArray[i].TO_DATE;
                                        }  else if(test === "OPERATOR"){
                                            var operator = sap.ui.getCore().byId("idOperatorU").getSelectedKey();
                                                stepObj.OPERATOR = operator;
                                        }  else if(test === "SINGLE_DATE"){
                                            stepObj.SINGLE_DATE = FinalDataArray[i].SINGLE_DATE;
                                        }  else if(test === "Rolling_Timestamp"){
                                            stepObj.Rolling = sap.ui.getCore().byId("idRollingU").getSelected();
                                            stepObj.Rolling_Timestamp = parseInt(FinalDataArray[i].Rolling_Timestamp);
                                        }  else if(test === "DsAlgorithm"){
                                            var DSAlgo = sap.ui.getCore().byId("PidDSAlgU").getSelectedKey();
                                                stepObj.DsAlgorithm = DSAlgo;
                                        }  else if(test === "OptFactor"){
                                            var OPTfact = sap.ui.getCore().byId("PidOptFctU").getSelectedKey();
                                            stepObj.OptFactor = parseFloat(OPTfact);
                                        }  else if(test === "OptAlgorithm"){
                                            var OPTalgo= sap.ui.getCore().byId("PidOptAlgU").getSelectedKey();
                                                stepObj.OptAlgorithm = OPTalgo;
                                        }  else if(test === "SnapShot"){
                                            if (FinalDataArray[i].SnapShot === "") {
                                                stepObj.SnapShot = "";
                                                stepObj.SnapShot_Desc = "";
                                            } else if (FinalDataArray[i].SnapShot === "U") {
                                                stepObj.SnapShot = "U";
                                                stepObj.SnapShot_Desc = "";
                                            } else if (FinalDataArray[i].SnapShot === "C") {
                                                stepObj.SnapShot = "C";
                                                stepObj.SnapShot_Desc = FinalDataArray[i].SnapShot_Desc;
                                            }
                                        }  else if(test === "HISTORY_WEEKS"){
                                            stepObj.HISTORY_WEEKS = FinalDataArray[i].HISTORY_WEEKS;
                                        }                         
                                        
                                        
                                    });

                                    if((activity[t] === "PUBLISH_FORECAST_ORDERS" || activity[t] === "EXPORT_IBP_ASSEMBLY_REQ_QUANTITY") && stepObj.Rolling){
                                        var Weeks = stepObj.Rolling_Timestamp;
                                        var newDate = new Date(new Date(). getTime() + week * 7 * 24 * 60 * 60 * 1000);
                                        var fromDate = new Date().toISOString().split("T")[0];
                                        var toDate = "";
                                        if(!isNaN(newDate)){
                                            toDate = newDate.toISOString().split("T")[0];
                                        }
                                        if(week > 0){
                                            stepObj.FROM_DATE = fromDate;
                                            stepObj.TO_DATE = toDate;
                                        }

                                    }
                                    
                                    step = step + 1;
                                    

                                    var obj = {
                                        TEMPLATE_ID :  that.byId("idJobname").getValue(),
                                        ACTIVITY_ID : activity[t],
                                        PARAM_VALUE : stepObj,
                                        SET : set,
                                        STEP : step,
                                        SUBSTEP :substep,
                                        TOTAL_STEPS: 0,
                                        MAIN_STEP : mainstep,
                                        MANDATORY: ""
                                        
                                    }
                                    var obj1 = {
                                        TEMPLATE_ID :  that.byId("idJobname").getValue(),
                                        ACTIVITY_ID : activity[t],
                                        STEP_DATA : stepObj,
                                        ACTION_URL: Action[0].ACTION_URL,
                                        SET : set,
                                        STEP : step,
                                        SUBSTEP :substep,
                                        MANDATORY: "",
                                        MAIN_STEP : mainstep,
                                        
                                    }

                                    TemplateDetails.push(obj);
                                    JobcreationData.push(obj1);

                                    }
                            }
                        }

                    }



                    console.log(TemplateDetails);
                    console.log(JobcreationData);


                    that.sSequence = "";
                if (that.Edit === "") {
                    that.sSequence = "Sequence_"  + new Date().getTime();
                } else {
                    that.sSequence = that.JobData[0].SEQUENCE_ID;
                }
                    var oModel = that.getOwnerComponent().getModel('JModel');
                    oModel.callFunction("/insertJobData", {
                        method: "GET",
                        urlParameters: {
                            //new add//
                            Flag: that.Edit,
                            // VARIANT : "",
                            Sequence: that.sSequence,
                            jobData: JSON.stringify(JobcreationData)
                        },
                        success: function (oData, oResponse) {
                            that._CommonParamsDialog.close();
                            //new add//
                            if (that.Edit !== "X") {
                                that.SaveTemplateDetails = TemplateDetails;
                                that.createJob(oData.insertJobData);
                            } else {
                                that.saveJobDetails("",TemplateDetails);
                            }

                            // //Now create job
                            // that.createJob(oData.insertJobData);
                            // // sap.m.MessageToast.show("success");
                        },
                        error: function (oResponse) {
                            sap.m.MessageToast.show("Failed");
                        },
                    });



                } else {
                    sap.m.MessageToast.show("Select all mandatory parameters");
                }

    },


    CommonFilEdit: function () {
        var data = that.oGModel.getProperty("/editData");

        that.byId("idTempValue").setValue(that.JobData[0].TEMPLATE_ID);
        that.byId("idJobname").setValue(data.JOB_NAME);
        that.onJobnamevalidation();

       
        that.MaxStep = data.TOTAL_STEPS;
        that.onSelTemp();
        that.onRecurrence();

        // sap.ui.core.BusyIndicator.show();
        // that.getModel("JSModel").read("/readTemplateItems", {
        //     filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, that.JobData[0].TEMPLATE_ID),
        //               new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
        //             ], and:true,
        //     success: function (oData) {
        //         sap.ui.core.BusyIndicator.hide();

        //         that.TemplateItems = oData.results;
        //         that.TemplateItems = that.TemplateItems.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

        //         var temp = that.TemplateItems.filter(function (aComp) {
        //             return aComp.ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS";
        //         });
        //         that.MaxStep = that.TempParams.length;
        //         // that.divideDatatoSend();

        //         if (temp.length > 0) {
        //             that.getUserData();
        //         }

        //         if (that.byId("CreateWizard")._aStepPath.length === 3) {
        //             that.onValidation();
        //         }

        //     },
        //     error: function (error) {
        //         sap.ui.core.BusyIndicator.hide();
        //         MessageToast.show("Failed to get template items data");
        //     },
        // });

        var obj = {
            MF_LOCATION_ID : [],
            LOCATION_ID : [],
            PRODUCT_ID : [],
            PREDICTION_PROFILE : "",
            VERSION : "",
            SCENARIO : "",
            CUSTOMER_GROUP : "",
            CLASS : "",
            CRITICAL_ASSEMBLY : "",
            IMPACT_ANALYSIS : "",
            DAILY : "",
            OVERRIDE_ASSIGNMENT : "",
            GEN_TYPE : "",
            MODEL_VERSION : "",
            FROM_DATE : "",
            TO_DATE : "",
            OPERATOR : "",
            SINGLE_DATE : "",
            Rolling : "",
            Rolling_Timestamp : "",
            DsAlgorithm : "",
            OptFactor : "",
            OptAlgorithm : "",
            SnapShot : "",
            SnapShot_Desc : "",
            HISTORY_WEEKS : ""
      }

        var parameters = [];
        var UniparamData = [];
        that.JobData = that.JobData.sort((a, b) => a.STEP - b.STEP);
        var tempData = [];

        for (var i = 0; i < that.JobData.length; i++) {

            var data = JSON.parse(that.JobData[i].PARAM_VALUE);
            // if(data.length !== undefined){

            if (that.JobData[i].PARAM_VALUE !== "{}") {
                var paramObj = {
                    "TEMPLATE_ID": that.JobData[i].TEMPLATE_ID,
                    "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID,
                    "STEP": that.JobData[i].STEP,
                    "ACT_POSITION": that.JobData[i].STEP
                }

                Object.entries(data).forEach(x => {
                    var test = x[0];

                    if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID") {
                        var tempobj = {
                            [test]: x[1]
                        }
                    if (x[0] === "MF_LOCATION_ID" || x[0] === "LOCATION_ID" || x[0] === "PRODUCT_ID") {
                        var index = obj[test].findIndex(el => el === x[1]);
                        if(index === -1){
                            obj[test] = obj[test].concat(x[1]);
                        }
                    } else {

                        obj[test] = x[1];
                    }
                    }
                    paramObj = {
                        ...paramObj,
                        ...tempobj
                    }

                })
                // that.TempParams.push(paramObj);
                tempData.push(paramObj);
            } else {
                var paramObj = {
                    "TEMPLATE_ID": that.JobData[i].TEMPLATE_ID,
                    "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID
                }
                // that.TempParams.push(paramObj);
                tempData.push(paramObj);
            }

            var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === that.JobData[i].ACTIVITY_ID);

            if(index === -1){
                that.TempParams.push(tempData[i]);
            }

            
        }

            obj.MF_LOCATION_ID = [...new Set(obj.MF_LOCATION_ID)];
            obj.LOCATION_ID = [...new Set(obj.LOCATION_ID)];
            obj.PRODUCT_ID = [...new Set(obj.PRODUCT_ID)];


        // tempData.forEach(function(el,i){
        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === el.ACTIVITY_ID);

        //     if(index === -1){
        //         that.TempParams.push(tempData[i]);
        //     } else {
                                    
        //     Object.entries(el).forEach(x => {
        //         if(x[0] === "LOCATION_ID" ){
        //             if(!that.TempParams[index].LOCATION_ID.includes(x[1])){
        //             that.TempParams[index].LOCATION_ID = that.TempParams[index].LOCATION_ID + "," + x[1];
        //             }
        //             if(that.TempParams[index].LOCATION_ID === that.TempParams[index].MF_LOCATION_ID){
        //                 delete that.TempParams[index].LOCATION_ID;
        //             }

        //         } else if(x[0].includes("PRODUCT")){
        //             var isArray = Array.isArray(that.TempParams[index].PRODUCT_ID);
        //                 if(isArray){
        //                     if(!that.TempParams[index].PRODUCT_ID.includes("ALL")){
        //                     that.TempParams[index].PRODUCT_ID = that.TempParams[index].PRODUCT_ID.toString() + "," + x[1].toString();
        //                     }1
        //                 } else {
        //                     if(!that.TempParams[index].PRODUCT_ID.includes("ALL")){
        //                     that.TempParams[index].PRODUCT_ID = that.TempParams[index].PRODUCT_ID + "," + x[1];
        //                     }
        //                 }
                        
        //         }

        //     })
        //     }
        // })
        // // that.TempParams.forEach(function(el,s){
        // //     el.STEP = s + 1;
        // //     el.ACT_POSITION = s + 1;
        // //     el.LOCATION_ID = el.LOCATION_ID.split(",");
        // //     el.PRODUCT_ID = el.PRODUCT_ID.split(",");
        // // });

        that.onCommonParams();
        that.setValues(obj);
        

    },

    setValues:function(obj){
        var core = sap.ui.getCore();

        if(sap.ui.getCore().byId("MF_LOCATIONU").getVisible()){
            obj.MF_LOCATION_ID.forEach(function (oItem,i) {
                sap.ui.getCore().byId("MFLInputU").addToken(
                    new sap.m.Token({
                        key: oItem,
                        text: oItem,
                        editable:false,

                    })
                );
                
            });
        }

        if(sap.ui.getCore().byId("DM_LOCATIONU").getVisible()){
            obj.LOCATION_ID.forEach(function (oItem,i) {
                sap.ui.getCore().byId("DlocInputU").addToken(
                    new sap.m.Token({
                        key: oItem,
                        text: oItem,
                        editable:false,

                    })
                );
                
            });

        }
        if(sap.ui.getCore().byId("CONFIG_PRODUCTU").getVisible()){
            obj.PRODUCT_ID.forEach(function (oItem,i) {
                sap.ui.getCore().byId("CprodInputU").addToken(
                    new sap.m.Token({
                        key: oItem,
                        text: oItem,
                        editable:false,

                    })
                );
                
            });

        }

                    core.byId("PrePFInputU").setValue(obj.PREDICTION_PROFILE);
                    core.byId("idverU").setValue(obj.VERSION);
                    core.byId("idscenU").setValue(obj.SCENARIO);
                    core.byId("classInputU").setValue(obj.CLASS);
                    core.byId("custGrpInputU").setValue(obj.CUSTOMER_GROUP);
                    core.byId("FromDateU").setValue(obj.FROM_DATE);
                    core.byId("ToDateU").setValue(obj.TO_DATE);
                    core.byId("singleDtU").setValue(obj.SINGLE_DATE);
                    core.byId("idRollingWeeksU").setValue(obj.Rolling_Timestamp);
                    core.byId("idWeeksU").setValue(obj.HISTORY_WEEKS);
                    if(obj.CRITICAL_ASSEMBLY === "X"){
                    core.byId("idCriticalU").setSelected(true);
                    } else {
                        core.byId("idCriticalU").setSelected(false);
                    }
                    core.byId("idOverrideU").setSelected(obj.OVERRIDE_ASSIGNMENT);
                    core.byId("idImpactU").setSelected(obj.IMPACT_ANALYSIS);
                    core.byId("idDailyU").setSelected(obj.DAILY);
                    if(obj.SnapShot === ""){
                        obj.SnapShot = false;
                    }
                    core.byId("idSnapShotU").setSelected(obj.SnapShot);
                    core.byId("idSnapDescU").setValue(obj.SnapShot_Desc);
                    core.byId("idRollingU").setSelected(obj.Rolling);

                    core.byId("idOperatorU").setSelectedKey(obj.OPERATOR);
                    core.byId("idModelVerU").setSelectedKey(obj.MODEL_VERSION);
                    core.byId("GenidTypeU").setSelectedKey(obj.GEN_TYPE);
                     core.byId("PidDSAlgU").setSelectedKey(obj.DsAlgorithm);
                     core.byId("PidOptFctU").setSelectedKey(obj.OptFactor);
                     core.byId("PidOptAlgU").setSelectedKey(obj.OptAlgorithm);

    },















    

    });
});