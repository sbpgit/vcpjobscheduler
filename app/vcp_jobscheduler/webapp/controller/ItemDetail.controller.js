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

            this.bus = sap.ui.getCore().getEventBus();

            this.bus.subscribe("data", "Destroy", this.destroy, this);
            // Declaring JSON Model and size limit
            that.oModel = new JSONModel();
            that.TemplateModel = new JSONModel();
            that.stepsModel = new JSONModel();
            that.TemplateModelSel = new JSONModel();
            this.MFlocModel = new JSONModel();
            this.locModel = new JSONModel();
            this.prodModel = new JSONModel();
            this.ppfModel = new JSONModel();
            this.fapModel = new JSONModel();
            this.verModel = new JSONModel();
            this.scenModel = new JSONModel();
            this.classModel = new JSONModel();
            
            this.custGroupModel = new JSONModel();
            that.MFlocModelUni = new JSONModel();

            that.oGModel = that.getOwnerComponent().getModel("oGModel");
            

            that.oModel.setSizeLimit(2000);
            that.TemplateModel.setSizeLimit(2000);
            that.stepsModel.setSizeLimit(2000);
            that.TemplateModelSel.setSizeLimit(2000);
            that.locModel.setSizeLimit(2000);
            that.prodModel.setSizeLimit(2000);
            that.fapModel.setSizeLimit(2000);
            that.ppfModel.setSizeLimit(2000);
            that.classModel.setSizeLimit(2000);

        },

        onAfterRendering: function () {

           
            that.TempParams = [];
            sap.ui.core.BusyIndicator.show();

            
            this.bus.publish("flexible", "buttonVisible");
            
            that.byId("idTempValueJF").setValue();
            that.byId("idJobfeedname").setValue();
            // that.byId("idarrowJF").setVisible(false);
            that.byId("idParameterJF").setVisible(false);

            that.Edit = that.oGModel.getProperty("/variantEditFlag");
            that.EditData = that.oGModel.getProperty("/selVariant");
            // that.byId("idarrowTitleJF").setText("");
            that.PublishFO = 0;
            that.JobData = [];
            that.tempIndex = "";
            that.TotalDataUni = [];
            that.ConfProdall = [];

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
            this.getView().byId("GenidTypeJF").setModel(jmodel);

            if (that.Edit === undefined) {
                that.Edit = "";
            }

            


            that.ClassData = [];

            if (that.Edit === "") {

                that.byId("CreateWizardJF").discardProgress(that.byId("CreateWizardJF").getSteps()[0]);
                this.byId("CreateWizardJF").invalidateStep(this.byId("TempTypeStepJF"));
                that.byId("TempTypeStepJF").setValidated(false);

                // that.byId("idSSTime").setValue();
                // that.byId("idSETime").setValue();
                that.byId("idJobfeedname").setEditable(true);
                that.byId("idTempValueJF").setEditable(true);
                //changed for Demo
                that.byId("idJobcreate").setVisible(false);
                // that.byId("idJobcreate").setVisible(true);
                // end of change
                that.byId("idCreateJF").setVisible(true);
                that.byId("idUpdateJF").setVisible(false);

            } else if (that.Edit === "X") {
                if(that.oGModel.getProperty("/copy") === ""){
                    that.byId("idJobfeedname").setEditable(false);
                    that.byId("idCreateJF").setVisible(false);
                    that.byId("idUpdateJF").setVisible(true);
                } else {
                    that.byId("idJobfeedname").setEditable(true);
                    that.byId("idCreateJF").setVisible(true);
                    that.byId("idUpdateJF").setVisible(false);
                }
                that.byId("idTempValueJF").setEditable(false);
                //changed for Demo
                that.byId("idJobcreate").setVisible(false);
                // that.byId("idJobcreate").setVisible(true);
                // end of change
            }

            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readTemplates", {
                filters: [
                    new Filter("VARIANT_NAME", FilterOperator.EQ, 'NA'),
                    new Filter("VARIANT_NAME", FilterOperator.EQ, ''),
                ],
                and: false,
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
                    

                    oData.results.forEach(el => {
                        if(el.PARAMETER_ID !== " "){
                        el.PARAMETER_ID = el.PARAMETER_ID + "JF";
                        }
                    });
                    that.params =oData.results;
                    that.ActivityItems = oData.results;
                    
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get activity item data");
                },
            });

             // Declaring Value Help Dialogs and Template Dialog
             this._oCore = sap.ui.getCore();
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
             if (!this._valueHelpDialogFAP) {
                this._valueHelpDialogFAP = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.ForecastAlgoDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialogFAP);
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
            if (!this._valueHelpDialogConfProd) {
                this._valueHelpDialogConfProd = sap.ui.xmlfragment(
                    "vcpapp.vcpjobschedulersequence.view.confProdDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialogConfProd);
            }

            that._valueHelpDialogProd.setTitleAlignment("Center");
            that._valueHelpDialogLoc.setTitleAlignment("Center");
            that._valueHelpDialogPPF.setTitleAlignment("Center");
            
            that._valueHelpDialogFAP.setTitleAlignment("Center");
            that._valueHelpDialogVer.setTitleAlignment("Center");
            that._valueHelpDialogScen.setTitleAlignment("Center");
            that._valueHelpDialogClassDetails.setTitleAlignment("Center");
            that._valueHelpDialogCustGroup.setTitleAlignment("Center");

            // this.oProdList = this._oCore.byId(
            //     this._valueHelpDialogProd.getId() + "-list"
            // );
            this.oMFLocList = this._oCore.byId(
                this._valueHelpDialogMFL.getId() + "-list"
            );
            this.oLocList = this._oCore.byId(
                this._valueHelpDialogLoc.getId() + "-list"
            );
            this.oPPFList = this._oCore.byId(
                this._valueHelpDialogPPF.getId() + "-list"
            );
            this.oFAPList = this._oCore.byId(
                this._valueHelpDialogFAP.getId() + "-list"
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

            this.oProdList = this._oCore.byId("prodSlctListJSS");
            this.oConfProdList = this._oCore.byId("ConfProductSlctListJSS");
            this.oMFLocListUni = this._oCore.byId("MFLSlctListJSSMul");


                that.oLocData = that.oGModel.getProperty("/homeAllLocationData");
                that.ConfProdall = that.oGModel.getProperty("/homeAllLocationProductData");
                that.skip = 0;

                    that.TotalDataUni = that.oLocData;
                    function removeDuplicate(array, key) {
                        var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }
                        that.MFLocDataUni = removeDuplicate(that.oLocData, 'FACTORY_LOC');

                    that.uniqConfprod= that.ConfProdall.filter(el=> el.CONFIGPROD_CHK === "X");

                // that.getAllLocaions();
                // that.getAProducts();

            // sap.ui.core.BusyIndicator.show();
            // // Calling service to get the Location data
            // // this.getModel("BModel").read("/getMfLocation", {
            //     this.getModel("BModel").read("/getMFMaster", {
            //     success: function (oData) {
            //         sap.ui.core.BusyIndicator.hide();
            //         that.ManuLocData = oData.results;

            //         function removeDuplicate(array, key) {
            //             var check = new Set();
            //                     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //                 }
            //             that.MFLocData = removeDuplicate(oData.results, 'FACTORY_LOC');
            //         that.MFlocModel.setData({
            //             MFLocitems: that.MFLocData
            //         });
            //         that.oMFLocList.setModel(that.MFlocModel);
            //             that.oLocData = [];
            //             that.ConfProdall = [];
            //             that.skip = 0;
            //             that.getAllLocaions();
            //             that.getAProducts();
            //     },
            //     error: function (oData, error) {
            //         sap.ui.core.BusyIndicator.hide();
            //         MessageToast.show("Failed to get location data");
            //     },
            // });

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

            // // Calling service to get the Location data
            // this.getModel("BModel").callFunction("/getAllLocProd", {
            //     method: "GET",
            //     success: function (oData) {
            //         sap.ui.core.BusyIndicator.hide();
            //         that.AllLocProdData = oData.results;
            //     },
            //     error: function (oData, error) {
            //         sap.ui.core.BusyIndicator.hide();
            //         MessageToast.show("Failed to get Products data");
            //     },
            // });

            // sap.ui.core.BusyIndicator.show();
            // this.getModel("BModel").read("/getLocProdDet", {
            //     success: function (oData) {
            //         sap.ui.core.BusyIndicator.hide();
            //         that.AllLocProdDataConf = oData.results;
            //     },
            //     error: function (oData, error) {
            //         sap.ui.core.BusyIndicator.hide();
            //         MessageToast.show("Failed to get products data");
            //     },
            // });

            sap.ui.core.BusyIndicator.show();
            // Calling service to get the Profiles data
            this.getModel("BModel").read("/getProfiles", {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    that.PredictionData = oData.results;
                    that.ppfModel = new JSONModel();
                    oData.results = oData.results.filter(el=> el.METHOD !== "AES");
                    that.ppfModel.setData(oData);
                    that._valueHelpDialogPPF.setModel(that.ppfModel);

                    var data = oData.results.filter(el=> el.METHOD === "AES");
                        that.fapModel = new JSONModel();
                        that.fapModel.setData({
                            results: data
                        });
                        that._valueHelpDialogFAP.setModel(that.fapModel);
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
            this.getModel("BModel").read("/getOptimizations", {
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            
                            var Optimizationsnew = [...oData.results];
                            var Optimizations = oData.results;

                            Optimizations.unshift({
                                PROFILE: "None",
                                ALGORITHM:""
                                  });

                                  that.POptmodel = new JSONModel();
                                  that.Optmodel = new JSONModel();

                                  that.POptmodel.setData({
                                        results: Optimizations,
                                      });
                                that.Optmodel.setData({
                                        results: Optimizationsnew,
                                      });
                                      that.byId("PidOptProfileJF").setModel(that.POptmodel);
                                      that.byId("idOptProfileJF").setModel(that.Optmodel);
                                      that.byId("PidOptProfileJF").setSelectedKey(Optimizations[0].PROFILE);
                                      that.byId("idOptProfileJF").setSelectedKey(Optimizationsnew[0].PROFILE);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });

           
    if(that.TotalDataUni.length > 0 && that.ConfProdall.length > 0){
            if (that.Edit === "X") {
                var data = that.oGModel.getProperty("/selVariant");
                if(that.oGModel.getProperty("/copy") === ""){
                    that.byId("idJobfeedname").setValue(data.VARIANT_NAME);
                } else {
                    that.byId("idJobfeedname").setValue(data.VARIANT_NAME + "_Copy");
                }
                setTimeout(() => {

                    that.getTemplateData();
                }, 3000);
                
                // // that.JobEdit();
                // sap.ui.core.BusyIndicator.show();
                // that.getModel("JSModel").read("/readJobCreationData", {
                //     filters: [
                //         new Filter("SEQUENCE_ID", FilterOperator.EQ, that.EditData.VARIANT_NAME),
                //     ],
                //     success: function (oData) {
                //         sap.ui.core.BusyIndicator.hide();
                //         that.JobData = oData.results;
                //         // that.JobEdit();
                //         that.getTemplateData();
                        

                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide();
                //         MessageToast.show("Failed to get job details data");
                //     },
                // });

            }
        }
        // }

        },


        // getAllLocaions: function () {
        //     // Calling service to get the Factory location, Demand loaction, config and partial products data
        //     sap.ui.core.BusyIndicator.show();
        //     var topCount = that.oGModel.getProperty("/MaxCount");
        //     this.getModel("BModel").read("/getfactorylocdesc", {
        //         urlParameters: {
        //             "$skip": that.skip,
        //             "$top": topCount
        //         },
        //         success: function (oData) {
        //             sap.ui.core.BusyIndicator.hide();
        //             // that.TotalDataUni = oData.results;

        //             // function removeDuplicate(array, key) {
        //             //     var check = new Set();
        //             //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
        //             // }

        //             // that.MFLocDataUni = removeDuplicate(oData.results, 'FACTORY_LOC');

        //             if (topCount == oData.results.length) {
        //                 that.skip += parseInt(topCount);
        //                 that.oLocData = that.oLocData.concat(oData.results);
        //                 that.getAllLocaions();
        //             } else {
        //                 that.skip = 0;
        //                 that.oLocData = that.oLocData.concat(oData.results);

        //                 that.TotalDataUni = that.oLocData;

        //                 function removeDuplicate(array, key) {
        //                     var check = new Set();
        //                     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
        //                 }

        //                 that.MFLocDataUni = removeDuplicate(that.oLocData, 'FACTORY_LOC');

        //             }
        //             if(that.TotalDataUni.length > 0 && that.ConfProdall.length > 0){
        //                 if (that.Edit === "X") {
        //                     // that.JobEdit();
        //                     sap.ui.core.BusyIndicator.show();
        //                     that.getModel("JSModel").read("/readJobCreationData", {
        //                         filters: [
        //                             new Filter("SEQUENCE_ID", FilterOperator.EQ, that.EditData.VARIANT_NAME),
        //                         ],
        //                         success: function (oData) {
        //                             sap.ui.core.BusyIndicator.hide();
        //                             that.JobData = oData.results;
        //                             // that.JobEdit();
        //                             that.getTemplateData();
                                    
            
        //                         },
        //                         error: function (error) {
        //                             sap.ui.core.BusyIndicator.hide();
        //                             MessageToast.show("Failed to get job details data");
        //                         },
        //                     });
            
        //                 }
        //             }

        //         },
        //         error: function (oData, error) {
        //             sap.ui.core.BusyIndicator.hide();
        //             MessageToast.show("Failed to get data");
        //         },
        //     });

        // },

        // getAProducts:function(){
            
        //         sap.ui.core.BusyIndicator.show();
        //         // Calling service to get the product data
        //         var topCount = that.oGModel.getProperty("/MaxCount");
        //         that.getOwnerComponent().getModel("BModel").read("/genPartialProd", {
        //             urlParameters: {
        //                 "$skip": that.skip,
        //                 "$top": topCount
        //             },
        //             success: function (oData) {
        //                 sap.ui.core.BusyIndicator.hide();
                       
        //                 if (topCount == oData.results.length) {
        //                     that.skip += parseIn(topCount);
        //                     that.ConfProdall = that.ConfProdall.concat(oData.results);
                            
        //                     that.getAProducts();
        //                 } else {
        //                     that.skip = 0;
        //                     that.ConfProdall = that.ConfProdall.concat(oData.results);
        //                     // oData.results = that.item
        //                     // that.filterCheck(that.item);
        //                     // that.arrayData = that.item;
        //                     that.uniqConfprod= that.ConfProdall.filter(el=> el.CONFIGPROD_CHK === "X");


                            
                           
                           
        //                     // function removeDuplicate(array, key) {
        //                     //     var check = new Set();
        //                     //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
        //                     // }
        //                     // oData.results = removeDuplicate(oData.results, 'REF_PRODID');

        //                     // that._valueHelpDialogConfProd.setData(oData);
        //                     // that.oConfProdList.setModel(that.ConfprodModel);

        //                     if(that.TotalDataUni.length > 0 && that.ConfProdall.length > 0){
        //                         if (that.Edit === "X") {
        //                             // that.JobEdit();
        //                             sap.ui.core.BusyIndicator.show();
        //                             that.getModel("JSModel").read("/readJobCreationData", {
        //                                 filters: [
        //                                     new Filter("SEQUENCE_ID", FilterOperator.EQ, that.EditData.VARIANT_NAME),
        //                                 ],
        //                                 success: function (oData) {
        //                                     sap.ui.core.BusyIndicator.hide();
        //                                     that.JobData = oData.results;
        //                                     // that.JobEdit();
        //                                     that.getTemplateData();
                                            
                    
        //                                 },
        //                                 error: function (error) {
        //                                     sap.ui.core.BusyIndicator.hide();
        //                                     MessageToast.show("Failed to get job details data");
        //                                 },
        //                             });
                    
        //                         }
        //                     }

        //                     sap.ui.core.BusyIndicator.hide()
        //                 }
        //             },
        //             error: function (oData, error) {
        //                 sap.ui.core.BusyIndicator.hide();
        //                 // MessageToast.show("error");
        //             },
        //         });
            

        // },

        onBack: function () {
            sap.ui.core.BusyIndicator.hide();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("Home", {}, true);

        },

        getTemplateData:function(){
            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readTemplateItems", {
                filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, that.EditData.TEMPLATE_ID),
                        new Filter("VARIANT_NAME", FilterOperator.EQ, that.EditData.VARIANT_NAME),],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                   

                    that.TemplateItems = oData.results;
                    that.TemplateItems = that.TemplateItems.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                    if(that.TemplateItems.length > 0){
                        that.LayerCode = "Private";
                        that.templevel = that.TemplateItems[0].LEVEL;
                    } else {
                        that.LayerCode = "Private";
                        that.templevel = "";
                    }

                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get data");
                },
            });

            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readTemplateItemsParams", {
                filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, that.EditData.TEMPLATE_ID),
                        // new Filter("VARIANT_NAME", FilterOperator.EQ, that.EditData.VARIANT_NAME),
                    ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    // oData.results.forEach(el => {
                    //     el.VALUE = "";
                    // });

                    var totalData = oData.results;
                    var variantData = oData.results.filter(el=> el.VARIANT_NAME === that.EditData.VARIANT_NAME);

                        oData.results = totalData.filter(el=> el.VARIANT_NAME === "NA")

                    that.TempParams = [];
                    for (var i = 0; i < oData.results.length; i++) {
                        var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === oData.results[i].ACTIVITY_ID &&
                            e.ACT_POSITION === oData.results[i].ACT_POSITION);
                        if (oData.results[i].ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS") {
                            that.PublishFO = that.PublishFO + 1;
                        }

                        if(oData.results[i].PARAMETER_ID === "LOCATION_ID" || oData.results[i].PARAMETER_ID === "PARTIAL_PRODUCT" ||
                            oData.results[i].PARAMETER_ID === "MF_LOCATION_ID" || oData.results[i].PARAMETER_ID === "CONFIG_PRODUCT"
                        ){
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
                           
                        } else {
                            var test = oData.results[i].PARAMETER_ID;
                            that.TempParams[index][test] = oData.results[i].VALUE;

                        }
                    }
                    // if (that.byId("CreateWizardJF")._aStepPath.length === 2 || that.byId("CreateWizardJF")._aStepPath.length === 3) {
                    //     that.onValidation();
                    // }

                    for (var i = 0; i < variantData.length; i++) {
                        
                        if(variantData[i].PARAMETER_ID === "LOCATION_ID" || variantData[i].PARAMETER_ID === "PARTIAL_PRODUCT" ||
                            variantData[i].PARAMETER_ID === "MF_LOCATION_ID" || variantData[i].PARAMETER_ID === "CONFIG_PRODUCT"
                        ){
                            var temp = variantData[i].VALUE;
                            var aray = Array.isArray(temp);
                                if(aray === false){
                                if(temp.includes(",") && temp !== ""){
                                    variantData[i].VALUE = variantData[i].VALUE.split(",");
                                } else {
                                    variantData[i].VALUE = [];
                                    variantData[i].VALUE.push(temp);
                                }
                            }
                        }

                    }

                    
                    if(that.TempParams.length > 0){
                        that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);                        
                }

                
                that.ParametersData = variantData;

                that.CommonFilEdit();

                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Failed to get data");
                },
            });


        },

        JobEdit: function () {
            var data = that.oGModel.getProperty("/selVariant");

            that.byId("idTempValueJF").setValue(data.TEMPLATE_ID);
            // that.byId("idJobfeedname").setValue(data.VARIANT_NAME);
            if(that.oGModel.getProperty("/copy") === ""){
                that.byId("idJobfeedname").setValue(data.VARIANT_NAME);
            } else {
                that.byId("idJobfeedname").setValue(data.VARIANT_NAME + "_Copy");
            }
            var Temp = that.TemplateDetail.filter(el=> el.TEMPLATE_ID === data.TEMPLATE_ID);
                        that.templevel = Temp[0].LEVEL;
                        that.LayerCode = Temp[0].LAYER_CODE;
            that.onJobnamevalidation();

            // var i = aSelectedScen[0].mBindingInfos.title.binding.oContext.sPath.split("/TemplateItems/")[1];
            // that.MaxStep = that.TemplateDetail[i].STEPS;
            that.MaxStep = data.STEPS;
            that.onSelTemp();
            // that.onRecurrence();

            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readTemplateItems", {
                filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, data.TEMPLATE_ID),
                          new Filter("VARIANT_NAME", FilterOperator.EQ, "NA"),
                        //   new Filter("VARIANT_NAME", FilterOperator.EQ, ""),
                ],and:true,
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

                    if (that.byId("CreateWizardJF")._aStepPath.length === 2 || that.byId("CreateWizardJF")._aStepPath.length === 3) {
                        setTimeout(() => {
                            that.onValidation();
                        }, 1500);
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

                // var data = JSON.parse(that.JobData[i].PARAM_VALUE);
                var data = JSON.parse(that.JobData[i].STEP_DATA);
                // if(data.length !== undefined){

                if (that.JobData[i].STEP_DATA !== "{}") {
                    var paramObj = {
                        "TEMPLATE_ID": that.JobData[i].TEMPLATE_ID,
                        "VARIANT_NAME": that.JobData[i].SEQUENCE_ID,
                        "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID,
                        "STEP": that.JobData[i].STEP,
                        "ACT_POSITION": that.JobData[i].STEP
                    }

                    Object.entries(data).forEach(x => {
                        var test = x[0];

                        if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID" && x[0] !== "VARIANT_NAME") {
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
                        "VARIANT_NAME": that.JobData[i].SEQUENCE_ID,
                        "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID,
                        "STEP": that.JobData[i].STEP,
                        "ACT_POSITION": that.JobData[i].STEP
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
                        // if(that.TempParams[index].LOCATION_ID === that.TempParams[index].MF_LOCATION_ID){
                        //     delete that.TempParams[index].LOCATION_ID;
                        // }

                    } else if(x[0].includes("PRODUCT")){
                        var isArray = Array.isArray(that.TempParams[index].PRODUCT_ID);
                            if(isArray){
                                if(!that.TempParams[index].PRODUCT_ID.includes("ALL")){
                                that.TempParams[index].PRODUCT_ID = that.TempParams[index].PRODUCT_ID.toString() + "," + x[1].toString();
                                }
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
                if(el.LOCATION_ID !== undefined && el.LOCATION_ID !== ""){
                el.LOCATION_ID = el.LOCATION_ID.split(",");
                }
                if(el.PRODUCT_ID !== undefined && el.PRODUCT_ID !== ""){
                    var isArray = Array.isArray(el.PRODUCT_ID);
                    if(!isArray){
                        el.PRODUCT_ID = el.PRODUCT_ID.split(",");
                    }
                }
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


        onSelTemp: function () {
            if (that.byId("idTempValueJF").getValue() !== "" && that.byId("idJobfeedname").getValue() !== "") {
                this.byId("CreateWizardJF").validateStep(this.byId("TempTypeStepJF"));
                that.byId("TempTypeStepJF").setValidated(true);

                if (that.Edit !== "X") {
                    //changed for Demo
                that.byId("idJobcreate").setVisible(false);
                // that.byId("idJobcreate").setVisible(true);
                // end of change
                    that.byId("idCreateJF").setVisible(true);
                    that.byId("idUpdateJF").setVisible(false);
                    // that.byId("idupdate").setVisible(false);
                } else {
                    //changed for Demo
                that.byId("idJobcreate").setVisible(false);
                // that.byId("idJobcreate").setVisible(true);
                // end of change
                    if(that.oGModel.getProperty("/copy") === ""){
                        that.byId("idJobfeedname").setEditable(false);
                        that.byId("idCreateJF").setVisible(false);
                        that.byId("idUpdateJF").setVisible(true);
                    } else {
                        that.byId("idJobfeedname").setEditable(true);
                        that.byId("idCreateJF").setVisible(true);
                        that.byId("idUpdateJF").setVisible(false);
                    }
                }
            } else {
                this.byId("CreateWizardJF").invalidateStep(this.byId("TempTypeStepJF"));
                that.byId("TempTypeStepJF").setValidated(false);
                if (that.Edit !== "X") {
                    that.byId("idJobcreate").setVisible(false);
                    that.byId("idCreateJF").setVisible(false);
                that.byId("idUpdateJF").setVisible(false);
                } else {
                    that.byId("idJobcreate").setVisible(false);
                    if(that.oGModel.getProperty("/copy") === ""){
                        that.byId("idJobfeedname").setEditable(false);
                        that.byId("idCreateJF").setVisible(false);
                        that.byId("idUpdateJF").setVisible(true);
                    } else {
                        that.byId("idJobfeedname").setEditable(true);
                        that.byId("idCreateJF").setVisible(true);
                        that.byId("idUpdateJF").setVisible(false);
                    }
                }
            }
            that.onJobnamevalidation();

        },

        onChangeWizard:function(){
            MessageToast.show(that.byId("CreateWizardJF")._aStepPath.length);
            
        },

        onRecurrence: function () {
        },

        onValidation: function () {
            // var oJobschType = that.byId("idJobSchtype").getSelectedKey();
            // var SChType = "X";
            // if (oJobschType === "Cr") {
            //     if (that.TemplateItems[0].ACTIVITY_ID === "DYNAMIC_FROZEN") {
            //         SChType = "X";
            //     } else {
            //         var mnth = that.byId("idmnth").getValue(),
            //             date = that.byId("iddate").getValue(),
            //             day = that.byId("idWeek").getSelectedKey(),
            //             hour = that.byId("idhrs").getValue(),
            //             min = that.byId("idmin").getValue();

            //         if ((mnth === "" && date === "" && day === "0" && hour === "" && min === "") ||
            //             (mnth === undefined && date === undefined && day === "0" && hour === undefined && min === undefined)) {
            //             SChType = "";
            //         }
            //     }
            // }
            var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
            var name = that.byId("idJobfeedname").getValue();

            var SChType = specials.test(name);

            if (SChType === false) {
                this.byId("CreateWizardJF").validateStep(this.byId("TempTypeStepJF"));
                that.byId("TempTypeStepJF").setValidated(true);

                // this.byId("CreateWizardJF").validateStep(this.byId("idParametersJF"));
                // that.byId("idParametersJF").setValidated(true);
                this.byId("CreateWizardJF").invalidateStep(this.byId("idParametersJF"));
                that.byId("idParametersJF").setValidated(false);

                // that.byId("idarrowJF").setVisible(true);
                that.byId("idParameterJF").setVisible(true);

                var MaxSteps = that.TemplateItems.filter(function (aComp) {
                    return aComp.TEMPLATE_ID === that.byId("idTempValueJF").getValue();
                });

                if (MaxSteps.length > 0) {
                    // that.onStepName(MaxSteps[0].ACTIVITY_ID, MaxSteps[0].ACT_POSITION, MaxSteps[0].STEP_NAME);
                    if (that.Edit !== "X") {
                        that.onCommonParams();
                    }
                } else {
                    MessageToast.show("Cannot display data");
                    that.byId("idParameterJF").setVisible(false);
                    return;
                }

                if (that.Edit !== "X") {
                    //changed for Demo
                that.byId("idJobcreate").setVisible(false);
                // that.byId("idJobcreate").setVisible(true);
                // end of change
                    // that.byId("idJobcreate").setText("Create Job Feed And Create Job");
                    that.byId("idCreateJF").setVisible(true);
                that.byId("idUpdateJF").setVisible(false);
                    // that.byId("idupdate").setVisible(false);
                } else {
                    //changed for Demo
                that.byId("idJobcreate").setVisible(false);
                // that.byId("idJobcreate").setVisible(true);
                // end of change
                //     // that.byId("idJobcreate").setText("Update Job Feed And Create Job");
                //     that.byId("idCreateJF").setVisible(false);
                // that.byId("idUpdateJF").setVisible(true);
                //     // that.byId("idupdate").setVisible(true);
                if(that.oGModel.getProperty("/copy") === ""){
                    that.byId("idJobfeedname").setEditable(false);
                    that.byId("idCreateJF").setVisible(false);
                    that.byId("idUpdateJF").setVisible(true);
                } else {
                    that.byId("idJobfeedname").setEditable(true);
                    that.byId("idCreateJF").setVisible(true);
                    that.byId("idUpdateJF").setVisible(false);
                }
                }

            } else {
                this.byId("CreateWizardJF").invalidateStep(this.byId("TempTypeStepJF"));
                that.byId("TempTypeStepJF").setValidated(false);

                this.byId("CreateWizardJF").invalidateStep(this.byId("idParametersJF"));
                that.byId("idParametersJF").setValidated(false);

                // that.byId("idarrowJF").setVisible(false);
                that.byId("idParameterJF").setVisible(false);
                MessageToast.show("Please maintain valid data");
                that.byId("idJobcreate").setVisible(false);
            }

        },

        // Changing the parameters tab based on selected step in view
        onStepName: function (activity, step, stepname) {

            var selACTivityStep = activity,
                stepname = stepname,
                step = step;

            // Inputs Visible
            that.byId("MF_LOCATIONJF").setVisible(false);
            that.byId("DM_LOCATIONJF").setVisible(false);
            that.byId("CONFIG_PRODUCTJF").setVisible(false);
            that.byId("PARTIAL_PRODUCTJF").setVisible(false);
            that.byId("MODEL_VERSIONJF").setVisible(false);
            that.byId("PREDICTION_PROFILEJF").setVisible(false);
            that.byId("FORECAST_ALGORITHMJF").setVisible(false);
            that.byId("VERSIONJF").setVisible(false);
            that.byId("SCENARIOJF").setVisible(false);
            that.byId("CLASSJF").setVisible(false);
            that.byId("CUSTOMER_GROUPJF").setVisible(false);
            that.byId("GEN_TYPEJF").setVisible(false);
            that.byId("DATE_RANGEJF").setVisible(false);
            that.byId("SINGLE_DATEJF").setVisible(false);
            that.byId("OPERATORJF").setVisible(false);
            that.byId("Rolling_TimestampJF").setVisible(false);
            that.byId("OVERRIDE_ASSIGNMENTJF").setVisible(false);
            that.byId("CRITICAL_ASSEMBLYJF").setVisible(false);
            that.byId("IMPACT_ANALYSISJF").setVisible(false);
            that.byId("DAILYJF").setVisible(false);
            that.byId("FULL_RUNJF").setVisible(false);
            that.byId("OptimizationJF").setVisible(false);
            that.byId("POptProfileJF").setVisible(false);
            that.byId("OptProfileJF").setVisible(false);
            // that.byId("OptAlgorithmJF").setVisible(false);
            // that.byId("OptFactorJF").setVisible(false);
            // that.byId("DsAlgorithmJF").setVisible(false);
            that.byId("SnapShotJF").setVisible(false);
            that.byId("SnapRJF").setVisible(false);
            that.byId("snapDescJF").setVisible(false);
            that.byId("HISTORY_WEEKSJF").setVisible(false);

            that.byId("MFLInputJF").setValue();
            that.byId("DlocInputJF").setValue();
            that.byId("CprodInputJF").setValue();
            that.byId("PprodInputJF").setValue();
            // that.byId("MODEL_VERSIONJF").setValue();
            that.byId("PrePFInputJF").setValue();
            that.byId("ForeAlgInputJF").setValue();
            that.byId("idverJF").setValue();
            that.byId("idscenJF").setValue();
            that.byId("classInputJF").setValue();
            that.byId("custGrpInputJF").setValue();
            that.byId("FromDateJF").setValue();
            that.byId("ToDateJF").setValue();
            that.byId("singleDtJF").setValue();
            that.byId("idRollingWeeksJF").setValue();
            that.byId("idSnapDescJF").setValue();
            that.byId("idWeeksJF").setValue();
            that.byId("idOverrideJF").setSelected(false);
            that.byId("idCriticalJF").setSelected(false);
            that.byId("idImpactJF").setSelected(false);
            that.byId("idDailyJF").setSelected(false);
            that.byId("idFullRunJF").setSelected(false);
            that.byId("idSnapShotJF").setSelected(false);
            that.byId("idRollingJF").setSelected(false);
            that.byId("PidOptimizationJF").setSelected(false);

            that.byId("CprodInputJF").removeAllTokens();
            that.byId("PprodInputJF").removeAllTokens();

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
                that.byId("idModelVerJF").setEditable(false);
            } else {
                that.byId("idModelVerJF").setEditable(true);
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

            that.getView().byId("GenidTypeJF").setModel(jmodel);
            } else {
                
            }

            for (var i = 0; i < that.filterActivites.length; i++) {
                var id = that.filterActivites[i].PARAMETER_ID
                if(id !== "" && id !== " " && id !== undefined && id !== null){

                
                that.byId(id).setVisible(true);

                if (Exists.length === 0) {
                    var input = that.byId(id).getFields()[0].sId.split("--")[1];
                    if (id === "OVERRIDE_ASSIGNMENTJF" || id === "CRITICAL_ASSEMBLYJF" || id === "IMPACT_ANALYSISJF" || 
                        id === "DAILYJF" || id === "FULL_RUNJF" || id === "SnapShotJF" ) {
                        that.byId(input).setSelected(false);
                    } else if(id === "Rolling_TimestampJF"){
                        that.byId("idRollingJF").setSelected(false);
                        that.byId("idRollingWeeksJF").setValue();
                    } else if (id !== "MODEL_VERSIONJF" && id !== "GEN_TYPEJF") {
                        that.byId(input).setValue();
                    }
                    if (that.filterActivites[i].OPTION_SELECT === "M") {
                        that.byId(input).removeAllTokens();
                    }
                }

                
                if (Exists.length > 0) {
                    var input = that.byId(id).getFields()[0].sId.split("--")[1];

                    if(id.includes("MF_LOCATIONJF")){

                        if(that.filterActivites[i].OPTION_SELECT === "S"){
                            that.byId(input).setValue(Exists[0].MF_LOCATION_ID);
                        } 
                        
                        if(selACTivityStep.includes("PREDICTION") || selACTivityStep.includes("MODEL_GENERATION") ){
                            if(Exists[0].MF_LOCATION_ID !== ""){
                            that.PlancfgPara(Exists[0].MF_LOCATION_ID, Exists[0].GEN_TYPE);
                            }
                        }
                            if (that.filterActivites[i].MANDATORY === "Y") {
                                that.byId("MFLRJF").setRequired(true);
                            } else {
                                that.byId("MFLRJF").setRequired(false);
                            }
                    } else if(id.includes("DM_LOCATIONJF")){

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
                                        mulLoc = Exists[0].LOCATION_ID;
                                    } else {
                                        var obj = {
                                            loc: Exists[0].LOCATION_ID
                                        };
                                        mulLoc.push(obj);
                                    }
                                    // mulLoc = Exists[0].LOCATION_ID;
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
                                that.byId("DMLRJF").setRequired(true);
                            } else {
                                that.byId("DMLRJF").setRequired(false);
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

                        if (that.filterActivites[i].PARAMETER_ID === "PARTIAL_PRODUCTJF") {
                            if (that.filterActivites[i].MANDATORY === "Y") {
                                that.byId("PPRJF").setRequired(true);
                            } else {
                                that.byId("PPRJF").setRequired(false);
                            }
                        } else {
                            if (that.filterActivites[i].MANDATORY === "Y") {
                                that.byId("CPRJF").setRequired(true);
                            } else {
                                that.byId("CPRJF").setRequired(false);
                            }
                        }

                    } else if (id === "MODEL_VERSIONJF") {
                        that.byId(input).setSelectedKey(Exists[0].MODEL_VERSION);
                    } else if (id === "PREDICTION_PROFILEJF") {
                        that.byId(input).setValue(Exists[0].PREDICTION_PROFILE);
                        if (that.filterActivites[i].MANDATORY === "Y") {
                            that.byId("PFJF").setRequired(true);
                        } else {
                            that.byId("PFJF").setRequired(false);
                        }
                    } else if (id === "FORECAST_ALGORITHMJF") {
                        that.byId(input).setValue(Exists[0].FORECAST_ALGORITHM);
                        if (that.filterActivites[i].MANDATORY === "Y") {
                            that.byId("FLUJF").setRequired(true);
                        } else {
                            that.byId("FLUJF").setRequired(false);
                        }
                    } else if (id === "VERSIONJF") {
                        that.byId(input).setValue(Exists[0].VERSION);
                    } else if (id === "SCENARIOJF") {
                        that.byId(input).setValue(Exists[0].SCENARIO);
                    } else if (id === "CLASSJF") {
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
                        
                        
                    }  else if (id === "CUSTOMER_GROUPJF") {
                        that.byId(input).setValue(Exists[0].CUSTOMER_GROUP);
                    } else if (id === "GEN_TYPEJF") {
                        that.byId(input).setSelectedKey(Exists[0].GEN_TYPE);
                    } else if (id === "OVERRIDE_ASSIGNMENTJF") {
                        if (Exists[0].OVERRIDE_ASSIGNMENT === "true" || Exists[0].OVERRIDE_ASSIGNMENT === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if (id === "CRITICAL_ASSEMBLYJF") {
                        // that.byId(input).setSelected(Exists[0].CRITICAL_ASSEMBLY);
                        if (Exists[0].CRITICAL_ASSEMBLY === "true" || Exists[0].CRITICAL_ASSEMBLY === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if (id === "IMPACT_ANALYSISJF") {
                        // that.byId(input).setSelected(Exists[0].IMPACT_ANALYSIS);
                        if (Exists[0].IMPACT_ANALYSIS === "true" || Exists[0].IMPACT_ANALYSIS === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if (id === "DAILYJF") {
                        // that.byId(input).setSelected(Exists[0].DAILY);
                        if (Exists[0].DAILY === "true" || Exists[0].DAILY === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    }  else if (id === "FULL_RUNJF") {
                        // that.byId(input).setSelected(Exists[0].FULL_RUN);
                        if (Exists[0].FULL_RUN === "true" || Exists[0].FULL_RUN === true) {
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    }else if(id === "OPERATORJF"){
                        if(Exists[0].OPERATOR !== ""){
                            that.byId(input).setSelectedKey(Exists[0].OPERATOR);
                        } else {
                            that.byId(input).setSelectedKey("BT");
                        }
                        
                        
                        
                    } else if(id === "SINGLE_DATEJF"){
                        if(selACTivityStep.includes("PURGE_PLANNING_DATA")){
                            that.byId("SINGLE_DATEJF").setVisible(false);
                        }
                        that.byId(input).setValue(Exists[0].SINGLE_DATE);
                        
                    } else if (id.includes("DATE_RANGEJF")) {
                        that.byId("ToDateJF").setEditable(false);
                        if(Exists[0].FROM_DATE !== undefined){
                            that.byId("FromDateJF").setValue(Exists[0].FROM_DATE);
                            if(selACTivityStep !== "GENERATE_SEEDORDER"){
                                if(Exists[0].FROM_DATE !== ""  ){
                                    that.byId("ToDateJF").setEditable(true);
                                    that.byId("ToDateJF").setMaxDate(null);
                                    that.byId("ToDateJF").setMinDate(new Date(Exists[0].FROM_DATE));
                                    that.byId("ToDateJF").setValue(Exists[0].TO_DATE);
                                }
                            } else {
                                    if(Exists[0].FROM_DATE !== ""){
                                        var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                                        that.byId("ToDateJF").setEditable(true);
                                        that.byId("ToDateJF").setMinDate(new Date(Exists[0].FROM_DATE));
                                        that.byId("ToDateJF").setMaxDate(tempDate);
                                        that.byId("ToDateJF").setValue(Exists[0].TO_DATE);
                                    }
                            }
                        } else {
                            that.byId("FromDateJF").setValue();
                            that.byId("ToDateJF").setValue();
                        }

                                if (that.filterActivites[i].MANDATORY === "Y") {
                                    that.byId("dateRangeJF").setRequired(true);
                                } else {
                                    that.byId("dateRangeJF").setRequired(false);
                                }

                    }  else if(id === "Rolling_TimestampJF"){
                        if(Exists[0].Rolling === "true" || Exists[0].Rolling === true){
                            that.byId("idRollingJF").setSelected(true);
                            that.byId("FromDateJF").setEditable(false);
                            that.byId("ToDateJF").setEditable(false);
                            that.byId("idRollingWeeksJF").setVisible(true);
                            that.byId("idRollingWeeksJF").setValue(Exists[0].Rolling_Timestamp);
                        } else {
                            that.byId("idRollingJF").setSelected(false);
                            that.byId("FromDateJF").setEditable(true);
                            that.byId("ToDateJF").setEditable(true);
                            that.byId("idRollingWeeksJF").setValue();
                            that.byId("idRollingWeeksJF").setVisible(false);
                        }
                    // } else if (id === "OptAlgorithmJF") {
                    //     that.byId(input).setSelectedKey(Exists[0].OptAlgorithm);
                    // } else if (id === "OptFactorJF") {
                    //     that.byId(input).setSelectedKey(Exists[0].OptFactor);
                    // } else if (id === "DsAlgorithmJF") {
                    //     that.byId(input).setSelectedKey(Exists[0].DsAlgorithm);
                    } else if (test === "Optimization") {
                            // var Optimization = that.byId("PidOptProfileJF").getSelected();
                            var Optimization = that.byId("PidOptimizationJF").getSelected();
                            stepObj.Optimization = Optimization;
                    } else if (test === "POptProfile") {
                            // var OPTProfile = that.byId("PidOptProfileJF").getSelected();
                                var POPTProfile = that.byId("PidOptProfileJF").getSelectedKey();
                                stepObj.POptProfile = POPTProfile;
                    } else if (test === "OptProfile") {
                            // var OPTProfile = that.byId("PidOptProfileJF").getSelected();
                            var OPTProfile = that.byId("idOptProfileJF").getSelectedKey();
                                stepObj.OptProfile = OPTProfile; 
                    } else if (id === "SnapShotJF") {
                        if (Exists[0].SnapShot === "") {
                            that.byId("idSnapShotJF").setSelected(false);
                        } else if (Exists[0].SnapShot === "C") {
                            that.byId("SnapRJF").setVisible(true);
                            that.byId("snapDescJF").setVisible(true);
                            that.byId("idSnapShotJF").setSelected(true);
                            that.byId("idSnapRadioJF").setSelectedButton(that.byId("createJF"));
                            that.byId("idSnapDescJF").setValue(Exists[0].SnapShot_Desc);
                        } else if (Exists[0].SnapShot === "U") {
                            that.byId("SnapRJF").setVisible(true);
                            that.byId("idSnapShotJF").setSelected(true);
                            that.byId("idSnapRadioJF").setSelectedButton(that.byId("updateJF"));
                        }
                    } else if(id === "HISTORY_WEEKSJF"){
                        that.byId("idWeeksJF").setValue(Exists[0].HISTORY_WEEKS);
                    }
                }
            }

            }
            // Form Visible
            that.byId("idParameterJF").setVisible(true);
            // that.byId("idarrowJF").setVisible(true);

            that.maxACT_POSITION = that.MaxStep;

            that.getView().byId("stepLabelJF").setText(step + ' of ' + that.maxACT_POSITION);

            // that.byId("idarrowTitleJF").setText(stepname);

            that.StepsSelFlag = "";

        },

        Previous: function () {

            var labelText = that.getView().byId("stepLabelJF").getText().split(" of ");

            if (parseInt(labelText[0]) - 1 > 0) {

                let alabel = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
                if (alabel > 1) {
                    that.getView().byId("stepLabelJF").setText(`${alabel - 1} of ` + that.maxACT_POSITION)
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
                    that.byId("ToDateJF").setEditable(true);
                } else {
                    that.byId("ToDateJF").setEditable(false);
                }

                if(MaxSteps[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                    var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                    that.byId("FromDateJF").setMaxDate(tempDate);
                    that.byId("ToDateJF").setMaxDate(tempDate);
                    that.byId("FromDateJF").setMinDate(null);
                    that.byId("ToDateJF").setMinDate(null);
                } else if(MaxSteps[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                    that.byId("FromDateJF").setMinDate(null);
                    that.byId("ToDateJF").setMinDate(null);
                    that.byId("FromDateJF").setMaxDate(null);
                    that.byId("ToDateJF").setMaxDate(null);
                } else {
                    that.byId("FromDateJF").setMaxDate(null);
                    that.byId("ToDateJF").setMaxDate(null);
                    that.byId("FromDateJF").setMinDate(new Date());
                    that.byId("ToDateJF").setMinDate(new Date());
                }

                that.onStepName(MaxSteps[0].ACTIVITY_ID, MaxSteps[0].ACT_POSITION, MaxSteps[0].STEP_NAME);
                that.tempIndex = "";
            }
        },

        Next: function () {
            var labelText = that.getView().byId("stepLabelJF").getText().split(" of ");

            if (parseInt(labelText[0]) + 1 <= parseInt(labelText[1])) {

                let alabel = parseInt(that.getView().byId("stepLabelJF").getText().split(" of ")[0]);

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
                        if (el.PARAMETER_ID == "MF_LOCATIONJF") {
                            if (currentActivity.MF_LOCATION_ID === "" || currentActivity.MF_LOCATION_ID === null || currentActivity.MF_LOCATION_ID === undefined) {
                                mandtFlag = "X";
                                return;
                            }
                        } 
                        else if (el.PARAMETER_ID == "DM_LOCATIONJF") {
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
                        } else if (el.PARAMETER_ID.includes("VERSIONJF")) {
                            if (currentActivity.VERSION === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("SCENARIOJF")) {
                            if (currentActivity.SCENARIO === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("CLASSJF")) {
                            if (currentActivity.CLASS === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("CUSTOMER_GROUPJF")) {
                            if (currentActivity.CUSTOMER_GROUP === "") {
                                mandtFlag = "X";
                                return;
                            }
                        } else if (el.PARAMETER_ID.includes("DATE_RANGEJF")) {
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
                            
                        } else if (el.PARAMETER_ID.includes("SINGLE_DATEJF")) {
                            if(currentActivity.OPERATOR !== "BT"){
                                if (currentActivity.SINGLE_DATE === "") {
                                    mandtFlag = "X";
                                    return;
                                }
                            }
                        } else if (el.PARAMETER_ID.includes("HISTORY_WEEKSJF")) {
                            if(currentActivity.HISTORY_WEEKS === "" || currentActivity.HISTORY_WEEKS === undefined){                                
                                    mandtFlag = "X";
                                    return;
                            }
                        }
                    }
                });

                if (mandtFlag === "") {

                    if (alabel < that.maxACT_POSITION) {
                        that.getView().byId("stepLabelJF").setText(`${alabel + 1} of ` + that.maxACT_POSITION)
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
                        that.byId("ToDateJF").setEditable(true);
                    } else {
                        that.byId("ToDateJF").setEditable(false);
                    }

                    if(MaxSteps[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                        var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                        that.byId("FromDateJF").setMaxDate(tempDate);
                        that.byId("ToDateJF").setMaxDate(tempDate);
                        that.byId("FromDateJF").setMinDate(null);
                        that.byId("ToDateJF").setMinDate(null);
                    } else if(MaxSteps[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                        that.byId("FromDateJF").setMinDate(null);
                        that.byId("ToDateJF").setMinDate(null);
                        that.byId("FromDateJF").setMaxDate(null);
                        that.byId("ToDateJF").setMaxDate(null);
                    } else {
                        that.byId("FromDateJF").setMaxDate(null);
                        that.byId("ToDateJF").setMaxDate(null);
                        that.byId("FromDateJF").setMinDate(new Date());
                        that.byId("ToDateJF").setMinDate(new Date());
                    }

                    that.onStepName(MaxSteps[0].ACTIVITY_ID, MaxSteps[0].ACT_POSITION, MaxSteps[0].STEP_NAME);
                    that.tempIndex = "";

                } else {
                    MessageToast.show("Please select all mandatory fields");
                }

            }

        },

        onSnapShot: function (oEvent) {
            var sel = that.byId("idSnapShotJF").getSelected();
                that.byId("idSnapRadioJF").setSelectedButton(that.byId("createJF"));
                if (sel) {
                    that.byId("SnapRJF").setVisible(true);
                    that.byId("snapDescJF").setVisible(true);
                } else {
                    that.byId("SnapRJF").setVisible(false);
                    that.byId("snapDescJF").setVisible(false);
                }
            // var sel = that.byId("idSnapShotJF").getSelected();
            // that.byId("idSnapRadioJF").setSelectedButton(that.byId("createJF"));

            // // var selStep = that.getView().byId("idarrowTitleJF").getText(),
            //     step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
            // var temp = "",
            //     tempDesc = "";

            // if (sel) {
            //     that.byId("SnapRJF").setVisible(true);
            //     that.byId("snapDescJF").setVisible(true);                
            //     that.TempParams[index].SnapShot = "C";
            //     that.TempParams[index].SnapShot_Desc = that.byId("idSnapDescJF").getValue();
            //     temp = "C";
            //     tempDesc = that.byId("idSnapDescJF").getValue();
            // } else {
            //     that.byId("SnapRJF").setVisible(false);
            //     that.byId("snapDescJF").setVisible(false);
            //     that.TempParams[index].SnapShot = "";
            //     that.TempParams[index].SnapShot_Desc = "";                
            // }

            // that.ChnageData(temp,selStep,"SnapShot");
            // that.ChnageData(tempDesc,selStep,"SnapShot_Desc");


        },

        OnsnapSelect: function () {

            var selRadio = that._oCore.byId("idSnapRadioJF").getSelectedButton().getText();
            if (selRadio === "Create") {
                that._oCore.byId("snapDescJF").setVisible(true);
            } else {
                that._oCore.byId("snapDescJF").setVisible(false);
            }



            // var selRadio = that.byId("idSnapRadioJF").getSelectedButton().getText();
            // // var selStep = that.getView().byId("idarrowTitleJF").getText(),
            //     step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
            // var temp = "",
            //     tempDesc = "";
            // if (selRadio === "Create") {
            //     that.byId("snapDescJF").setVisible(true);
            //     that.TempParams[index].SnapShot = "C";
            //     that.TempParams[index].SnapShot_Desc = that.byId("idSnapDescJF").getValue();
            //     temp = "C";
            //     tempDesc = that.byId("idSnapDescJF").getValue();
            // } else {
            //     that.byId("snapDescJF").setVisible(false);
            //     that.TempParams[index].SnapShot = "U";
            //     that.TempParams[index].SnapShot_Desc = "";
            //     temp = "U";
            //     tempDesc = "";
            // }
            // that.ChnageData(temp,selStep,"SnapShot");
            // that.ChnageData(tempDesc,selStep,"SnapShot_Desc");
        },

        // onDescChange: function () {

        //     if (that.tempIndex === "") {
        //         // var selStep = that.getView().byId("idarrowTitleJF").getText(),
        //             step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //         that.tempIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     }
        //     that.TempParams[that.tempIndex].SnapShot_Desc = that.byId("idSnapDescJF").getValue();

        //     that.ChnageData(that.byId("idSnapDescJF").getValue(),selStep,"SnapShot_Desc");

        // },
        onDescChange: function () {
            // var flag = that.oGModel.getProperty("/CommonParam");
            // if (flag === "") {

            //     if (that.tempIndex === "") {
            //         var selStep = that.getView().byId("idarrowTitle").getText(),
            //             step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

            //         that.tempIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
            //     }
            //     that.TempParams[that.tempIndex].SnapShot_Desc = that.byId("idSnapDescJF").getValue();

            //     that.ChnageData(that.byId("idSnapDescJF").getValue(), selStep, "SnapShot_Desc");
            // }
            var text = that.byId("idSnapDescJF").getValue();
                if(text.length >= 59){
                    MessageToast("Text limit is 60 Characters")
                }

        },
        onWeekValues:function(){
            var value = that.byId("idWeeksJF").getValue();

            if(value <= 0){
                MessageToast.show("History weeks can not be lessthen 1");
            } else if(value > 156){
                MessageToast.show("History weeks can not be greaterthen 156");
            }

        },

        /**
         * This function is called when click on input box to open value help dialogs.
         * This function will open the dialogs based on sId.
         * @param {object} oEvent -the event information.
         */
        handleValueHelp: function (oEvent, id) {
            if(oEvent !== ""){
                var sId = oEvent.getParameter("id");
            } else {
                var sId = id;
            }

            if (sId.includes("MFL")) {
                this.MFlocModelUni = new JSONModel();
                this.MFlocModelUni.setSizeLimit(that.MFLocDataUni.length);
                that.MFlocModelUni.setData({
                    MFLocitemsUni: that.MFLocDataUni
                });
                sap.ui.getCore().byId("MFLSlctListJSSMul").setModel(that.MFlocModelUni);

                this._valueHelpDialogMFLUni.open();

                that.oMFLocUni = that.byId("MFLInputJF");
                that.oLocUni = that.byId("DlocInputJF");
                that.oProdUni = that.byId("PprodInputJF");

                var locTokens = that.oMFLocUni.getTokens();

                for (var i = 0; i < locTokens.length; i++) {

                    // var index = that.MFLocDataUni.findIndex(e => e.FACTORY_LOC === locTokens[i].getText() );
                    // that.byId("MFLSlctListJSSMul").getItems()[index].setSelected(true);
                    for (var i = 0; i < locTokens.length; i++) {
                        for (var j = 0; j < that.MFLocDataUni.length; j++) {
                            if (that.MFLocDataUni[j].FACTORY_LOC === locTokens[i].getText()) {
                                sap.ui.getCore().byId("MFLSlctListJSSMul").getItems()[j].setSelected(true);
                                break;
                            }
                        }
                    }
                }

            } else if (sId.includes("loc")) {

                that.oMFLocUni = that.byId("MFLInputJF");
                that.oLocUni = that.byId("DlocInputJF");
                that.oProdUni = that.byId("PprodInputJF");
                var Data = that.TotalDataUni;
                sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(true);
                that.LocDataUni = [];

                if (that.oMFLocUni.getTokens().length > 0) {

                    for (var i = 0; i < that.oMFLocUni.getTokens().length; i++) {
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
                sap.ui.getCore().byId("LocSlctListJSS").setModel(that.locModel);

                var locTokens = that.oLocUni.getTokens();

                if (locTokens.length > 0) {

                    // for (var i = 0; i < locTokens.length; i++) {

                    //     var index = that.LocDataUni.findIndex(e => e.LOCATION_ID === locTokens[i].getText() );
                    //     that.byId("LocSlctListJSS").getItems()[index].setSelected(true);
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

            } else if (sId.includes("CprodInputJF")) {

                that.oMFLocUni = that.byId("MFLInputJF");
                that.oLocUni = that.byId("DlocInputJF");
                that.oProdUni = that.byId("PprodInputJF");
                that.oConfProdUni = that.byId("CprodInputJF");

                var Data = that.TotalDataUni;
                sap.ui.getCore().byId("ConfProductSlctListJSS").setMultiSelect(true);
                that.ConfProdDataUni = [];
                that.ProdDataUniTemp =[];

                if (that.oMFLocUni.getTokens().length > 0) {

                    for (var i = 0; i < that.oMFLocUni.getTokens().length; i++) {
                        var temp = Data.filter(el => el.FACTORY_LOC === that.oMFLocUni.getTokens()[i].getText());
                        that.ProdDataUniTemp = that.ProdDataUniTemp.concat(temp);
                    }
                    if (that.oLocUni.getTokens().length > 0) {
                        that.DataUni = [];
                        for (var i = 0; i < that.oLocUni.getTokens().length; i++) {
                            var temp = that.ProdDataUniTemp.filter(el => el.DEMAND_LOC === that.oLocUni.getTokens()[i].getText());
                            that.DataUni = that.DataUni.concat(temp);
                            // that.ConfProdDataUni = [];
                            // that.ConfProdDataUni = that.DataUni;
                        }
                        that.ProdDataUniTemp = that.DataUni;

                    }

                    that.ConfProdDataUni = [];
                    that.ConfProdDataUni = that.ProdDataUniTemp;

                } else if (that.oLocUni.getTokens().length > 0) {

                    for (var i = 0; i < that.oLocUni.getTokens().length; i++) {
                        var temp = Data.filter(el => el.DEMAND_LOC === that.oLocUni.getTokens()[i].getText());
                        that.ConfProdDataUni = that.ConfProdDataUni.concat(temp);
                    }

                } else {
                    that.ConfProdDataUni = Data;
                }

                function removeDuplicate(array, key) {
                    var check = new Set();
                    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                }
                that.ConfProdDataUni = removeDuplicate(that.ConfProdDataUni, 'REF_PRODID');

                that.ConfprodModel = new JSONModel();
                that.ConfprodModel.setSizeLimit(that.ConfProdDataUni.length);
                sap.ui.getCore().byId("ConfProductSlctListJSS").setGrowingThreshold(that.ConfProdDataUni.length);

                that.ConfprodModel.setData({
                    results: that.ConfProdDataUni
                });
                sap.ui.getCore().byId("ConfProductSlctListJSS").setModel(that.ConfprodModel);

                var prodTokens = that.oConfProdUni.getTokens();

                if (prodTokens.length > 0) {
                    // for (var i = 0; i < prodTokens.length; i++) {

                    //     var index = that.ProdDataUni.findIndex(e => e.PRODUCT_ID === prodTokens[i].getText() );
                    //     that.byId("prodSlctListJSS").getItems()[index].setSelected(true);
                    // }
                    for (var i = 0; i < prodTokens.length; i++) {
                        for (var j = 0; j < that.ConfProdDataUni.length; j++) {
                            if (that.ConfProdDataUni[j].REF_PRODID === prodTokens[i].getText()) {
                                sap.ui.getCore().byId("ConfProductSlctListJSS").getItems()[j].setSelected(true);
                                break;
                            }
                        }
                    }
                }

                
                this._valueHelpDialogConfProd.open();

            } 
            
            else if (sId.includes("PprodInputJF")) {

                that.oMFLocUni = that.byId("MFLInputJF");
                that.oLocUni = that.byId("DlocInputJF");
                that.oConfProdUni = that.byId("CprodInputJF");
                that.oProdUni = that.byId("PprodInputJF");

                var Data = that.TotalDataUni;
                sap.ui.getCore().byId("prodSlctListJSS").setMultiSelect(true);
                that.ProdDataUni = [];
                that.ProdDataUniTemp =[];

                if (that.oMFLocUni.getTokens().length > 0) {

                    for (var i = 0; i < that.oMFLocUni.getTokens().length; i++) {
                        var temp = Data.filter(el => el.FACTORY_LOC === that.oMFLocUni.getTokens()[i].getText());
                        that.ProdDataUniTemp = that.ProdDataUniTemp.concat(temp);
                    }

                    if (that.oLocUni.getTokens().length > 0) {
                        that.DataUni = [];
                        for (var i = 0; i < that.oLocUni.getTokens().length; i++) {
                            var temp = that.ProdDataUniTemp.filter(el => el.DEMAND_LOC === that.oLocUni.getTokens()[i].getText());
                            that.DataUni = that.DataUni.concat(temp);
                            // that.ProdDataUni = [];
                            // that.ProdDataUniD = that.DataUni;
                        }
                        that.ProdDataUniTemp = that.DataUni;

                    } 
                    if (that.oConfProdUni.getTokens().length > 0) {
                        that.DataUniCP = [];
                        for (var i = 0; i < that.oConfProdUni.getTokens().length; i++) {
                            var temp = that.ProdDataUniTemp.filter(el => el.REF_PRODID === that.oConfProdUni.getTokens()[i].getText());
                            that.DataUniCP = that.DataUniCP.concat(temp);
                            // that.ProdDataUni = [];
                            // that.ProdDataUni = that.DataUni;
                        }
                        that.ProdDataUniTemp = that.DataUniCP;

                    } 
                    that.ProdDataUni = [];
                    that.ProdDataUni = that.ProdDataUniTemp;

                } else if (that.oLocUni.getTokens().length > 0) {
                    that.ProdDataUniTemp =[];
                    for (var i = 0; i < that.oLocUni.getTokens().length; i++) {
                        var temp = Data.filter(el => el.DEMAND_LOC === that.oLocUni.getTokens()[i].getText());
                        that.ProdDataUniTemp = that.ProdDataUniTemp.concat(temp);
                    }
                    if (that.oConfProdUni.getTokens().length > 0) {
                        that.DataUniCP = [];
                        for (var i = 0; i < that.oConfProdUni.getTokens().length; i++) {
                            var temp = that.ProdDataUniTemp.filter(el => el.REF_PRODID === that.oConfProdUni.getTokens()[i].getText());
                            that.DataUniCP = that.DataUniCP.concat(temp);
                            // that.ProdDataUni = [];
                            // that.ProdDataUni = that.DataUni;
                        }
                        that.ProdDataUniTemp = that.DataUniCP;

                    } 
                    that.ProdDataUni = [];
                    that.ProdDataUni = that.ProdDataUniTemp;

                } else if (that.oConfProdUni.getTokens().length > 0) {

                    for (var i = 0; i < that.oConfProdUni.getTokens().length; i++) {
                        var temp = Data.filter(el => el.REF_PRODID === that.oConfProdUni.getTokens()[i].getText());
                        that.ProdDataUni = that.ProdDataUni.concat(temp);
                    }

                } else {
                    that.ProdDataUni = Data;
                }
                var tempData = [];
                that.ProdDataUni.forEach(el=>{
                    var index = that.ConfProdall.findIndex(e=> e.PRODUCT_ID === el.PRODUCT_ID && 
                                                            e.CONFIGPROD_CHK !== "X");
                        if(index !== -1){
                            tempData.push(that.ConfProdall[index]);
                        }
                })

                that.ProdDataUni = tempData;


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
                sap.ui.getCore().byId("prodSlctListJSS").setModel(that.prodModel);

                var prodTokens = that.oProdUni.getTokens();

                if (prodTokens.length > 0) {
                    // for (var i = 0; i < prodTokens.length; i++) {

                    //     var index = that.ProdDataUni.findIndex(e => e.PRODUCT_ID === prodTokens[i].getText() );
                    //     that.byId("prodSlctListJSS").getItems()[index].setSelected(true);
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
                //                 that.byId("prodSlctListJSS").getItems()[j].setSelected(true);
                //                 break;
                //             }
                //         }
                //     }

                // }
                // }
                this._valueHelpDialogProd.open();

            } else if (sId.includes("ver")) {
                that._valueHelpDialogVer.open();
            } else if (sId.includes("scen")) {
                var data = that.VerSecData;
                var scenarioData = [];

                that.oVerUni = that.byId("idverJF");
                if (that.oVerUni.getValue() !== "") {

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
            } else if (sId.includes("PrePFInputJF")) {
                var profiles = that.PredictionData;
                profiles = profiles.filter(el=> el.METHOD !== "AES");
                that.ppfModel = new JSONModel();
                that.ppfModel.setData({
                    results: profiles
                });
                that._valueHelpDialogPPF.setModel(that.ppfModel);

                that._valueHelpDialogPPF.open();
            }  else if (sId.includes("ForeAlgInputJF")) {
                var profiles = that.PredictionData;
                var data = profiles.filter(el=> el.METHOD === "AES");
                that.fapModel = new JSONModel();
                that.fapModel.setData({
                    results: data
                });
                that._valueHelpDialogFAP.setModel(that.fapModel);

                that._valueHelpDialogFAP.open(); 
            } else if (sId.includes("classInputJF")) {
                that.oMFLocUni = that.byId("MFLInputJF");
                that.oLocUni = that.byId("DlocInputJF");
                that.oProdUni = that.byId("PprodInputJF");
                that.oClassList = that.byId("classInputJF");

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

                        that.oClass = that.byId("classInputJF");
                        var classTokens = that.oClass.getTokens();

                        if (classTokens.length > 0) {

                            for (var i = 0; i < classTokens.length; i++) {

                                var index = that.LocDataUni.findIndex(e => e.CLASS_NUM === classTokens[i].getText());
                                sap.ui.getCore().byId("ClassSlctListJSS").getItems()[index].setSelected(true);
                            }
                        }

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
            } else if (sId.includes("custGrpInputJF")) {

                this.getModel("BModel").read("/getCustgroup", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.custGroupModel = new JSONModel();
                        that.custGroupModel.setData(oData);
                        that.oCustGroupList.setModel(that.custGroupModel);
                        that._valueHelpDialogCustGroup.open();

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("failed to fetch the customer groups");
                    },
                });
            } else if (sId.includes("Temp")) {
                that._templateDialog.open();
            }
            

            // // Location Dialog
            // if (sId.includes("MFL")) {
            //     this.MFlocModel = new JSONModel();
            //     that.MFlocModel.setData({
            //         MFLocitems: that.MFLocData
            //     });
            //     that.oMFLocList.setModel(that.MFlocModel);

            //     this._valueHelpDialogMFL.open();

            //     that.oMFLoc = that.byId("MFLInputJF");
            //     that.oLoc = that.byId("DlocInputJF");
            //     // Product Dialog
            // } else if (sId.includes("loc")) {
                
            //     that.oMFLoc = that.byId("MFLInputJF");
            //         that.oLoc = that.byId("DlocInputJF");
                    
            //         that.getDemandLocation();
            //         if(that.oMFLoc.getValue()){
            //         this._valueHelpDialogLoc.open();
            //         } else {
            //             MessageToast.show("Select Manufacturing Location");
            //         }
            //     // Product Dialog
            // } else if (sId.includes("prod")) {
            //     // that.getProducts();
            //     that.oMFLoc = that.byId("MFLInputJF");
            //     that.oLoc = that.byId("DlocInputJF");
            //     if(that.byId("DM_LOCATIONJF").getVisible() === true){

            //         if (that.oLoc.getTokens().length !== 0 || that.oLoc.getValue() ) {
            //             // that.getProducts();
            //             if(id === "" || id === undefined){
            //                 that.oGModel.setProperty("/HSFLAG" , "");
            //                 that.getProducts();
            //                 this._valueHelpDialogProd.open();
            //             } else {
            //                 that.oGModel.setProperty("/HSFLAG" , "X");
            //                 that.getProducts();
            //                 // that.handleSelection("", "prod");
            //             }
            //         } else {
            //             MessageToast.show("Select Location");
            //         }
            //     } else {
            //         if (that.oMFLoc.getValue()) {
            //             // that.getProducts("");
            //             if(id === "" || id === undefined){
            //                 that.oGModel.setProperty("/HSFLAG" , "");
            //                 that.getProducts();
            //             this._valueHelpDialogProd.open();
            //             } else {
            //                 that.oGModel.setProperty("/HSFLAG" , "X");
            //                 that.getProducts();
            //                 // that.handleSelection("", "prod");
            //             }
            //     } else {
            //         MessageToast.show("Select Location");
            //     }
            //     }
                
            //     // Version Dialog
            // } else if (sId.includes("ver")) {
            //     // var selStep = that.getView().byId("idarrowTitleJF").getText();
            //     if(selStep !== "SNAPSHOT"){
            //     that.oMFLoc = that.byId("MFLInputJF");
            //     that.oLoc = that.byId("DlocInputJF");

            //     if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
            //         that.oProd = that.byId("CprodInputJF");
            //     } else {
            //         that.oProd = that.byId("PprodInputJF");
            //     }
            //     if ((that.oMFLoc.getValue() || that.oLoc.getValue()) && (that.oProd.getTokens().length !== 0 || that.oProd.getValue())) {
                    
            //         that.getVersion(selStep);
            //         that._valueHelpDialogVer.open();
            //     } else {
            //         MessageToast.show("Select Location and Product");
            //     }
            // } else {
            //     that.getVersion(selStep);
            //         that._valueHelpDialogVer.open();
            // }
            //     // Scenario Dialog
            // } else if (sId.includes("scen")) {
               
            //     that.oMFLoc = that.byId("MFLInputJF");
            //     that.oLoc = that.byId("DlocInputJF");

            //     if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
            //         that.oProd = that.byId("CprodInputJF");
            //     } else {
            //         that.oProd = that.byId("PprodInputJF");
            //     }
            //     if (
            //         (that.oMFLoc.getValue() || that.oLoc.getValue()) &&
            //         (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) && that.byId("idverJF").getValue()
            //     ) {
            //         // var selStep = that.getView().byId("idarrowTitleJF").getText();
            //         that.getScenario(selStep);
            //         that._valueHelpDialogScen.open();
            //     } else {
            //         MessageToast.show("Select Location, Product and Version");
            //     }
            // } else if (sId.includes("PrePFInputJF")) {
            //     // var selStep = that.getView().byId("idarrowTitleJF").getText();
            //     var profiles = that.PredictionData;
            //     if(selStep === "STATFORECAST_FOR_CHAR_VALUES"){
            //         var filterActivites = profiles.filter(function (aComp) {
            //             return aComp.PROFILE.includes("AES");
            //             });
            //     } else {
            //         var filterActivites = profiles.filter(function (aComp) {
            //             return !aComp.PROFILE.includes("AES");
            //             });
            //     }

            //     that.ppfModel = new JSONModel();
            //         that.ppfModel.setData({
            //             results: filterActivites
            //         });
            //         that._valueHelpDialogPPF.setModel(that.ppfModel);

            //     that._valueHelpDialogPPF.open();
            // } else if (sId.includes("Temp")) {
            //     that._templateDialog.open();
            // } else if (sId.includes("classInputJF")) {
            //     that.oMFLoc = that.byId("MFLInputJF");
            //     that.oLoc = that.byId("DlocInputJF");
            //     if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
            //         that.oProd = that.byId("CprodInputJF");
            //     } else {
            //         that.oProd = that.byId("PprodInputJF");
            //     }

            //         if ((that.oLoc.getTokens().length !== 0 || that.oLoc.getValue()) && 
            //         (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) ) {
            //             that.getClass();
            //                 this._valueHelpDialogClassDetails.open();
            //         } else {
            //             MessageToast.show("Select Location and Product");
            //         }
            // } else if (sId.includes("custGrpInputJF")) {
            //     // var selStep = that.getView().byId("idarrowTitleJF").getText();
            //     if(selStep === "STATFORECAST_FOR_CHAR_VALUES"){
            //         that.getCustGroup("Y");
            //     } else {
            //             that.getCustGroup("N");
            //     }

            //             this._valueHelpDialogCustGroup.open();
               
            //     // that.oMFLoc = that.byId("MFLInputJF");
            //     // that.oLoc = that.byId("DlocInputJF");

            //     // if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
            //     //     that.oProd = that.byId("CprodInputJF");
            //     // } else {
            //     //     that.oProd = that.byId("PprodInputJF");
            //     // }
            //     // if (
            //     //     (that.oMFLoc.getValue() || that.oLoc.getValue()) &&
            //     //     (that.oProd.getTokens().length !== 0 || that.oProd.getValue())
            //     // ) {
                    
            //     //     that.getCustGroup();
            //     //     that._valueHelpDialogScen.open();
            //     // } else {
            //     //     MessageToast.show("Select Location, Product and Version");
            //     // }
            // }
        },

        /**
         * Called when 'Close/Cancel' button in any dialog is pressed.
         * Dialogs will be closed based on sId.
         * @param {object} oEvent -the event information.
         */
        handleClose: function (oEvent) {
            var sId =  "";
            if(oEvent !== ""){
                 sId = oEvent.getParameter("id");
            } 
            // Location Dialog
            // Location Dialog
            if (sId.includes("MFL")) {
                that._oCore
                    .byId(this._valueHelpDialogMFL.getId() + "-searchField")
                    .setValue("");
                if (that.oMFLocList.getBinding("items")) {
                    that.oMFLocList.getBinding("items").filter([]);
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
            } else if (sId.includes("algoSlctList")) {
                that._oCore
                    .byId(this._valueHelpDialogFAP.getId() + "-searchField")
                    .setValue("");
                if (that.oFAPList.getBinding("items")) {
                    that.oFAPList.getBinding("items").filter([]);
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
        },

        destroy: function(){
            this._templateDialog.destroy();
            this._valueHelpDialogMFL.destroy();
            this._valueHelpDialogLoc.destroy();
            this._valueHelpDialogProd.destroy();
            this._valueHelpDialogPPF.destroy();            
            this._valueHelpDialogFAP.destroy();
            this._valueHelpDialogVer.destroy();
            this._valueHelpDialogScen.destroy();
            this._valueHelpDialog.destroy();
            this._valueHelpDialogClassDetails.destroy();
            this._valueHelpDialogCustGroup.destroy();
            this._valueHelpDialogMFLUni.destroy();
            this._valueHelpDialogConfProd.destroy();
            this._valueHelpDialogMFLUni = "";
            that._valueHelpDialogConfProd ="";


            this._templateDialog = "";
            this._valueHelpDialogMFL = "";
            this._valueHelpDialogLoc = "";
            this._valueHelpDialogProd = "";
            this._valueHelpDialogPPF = "";            
            this._valueHelpDialogFAP = "";
            this._valueHelpDialogVer = "";
            this._valueHelpDialogScen = "";
            this._valueHelpDialog = "";
            this._valueHelpDialogClassDetails = "";
            this._valueHelpDialogCustGroup = "";
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
                // that.oMFLocList.getBinding("items").filter(oFilters);
                that.oMFLocListUni.getBinding("items").filter(oFilters);
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
            } else if(sId.includes("ConfProduct")){
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("REF_PRODID", FilterOperator.Contains, sQuery),
                                new Filter("REFPROD_DESC", FilterOperator.Contains, sQuery),
                                new Filter("DEMAND_LOC", FilterOperator.Contains, sQuery),
                            ],
                            and: false,
                        })
                    );
                }
                that.oConfProdList.getBinding("items").filter(oFilters);

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
        },

        /**
         * This function is called when selecting values in dialog box.
         * In this function tokens will be updated.
         * @param {object} oEvent -the event information.
         */
        handleSelection_old: function (oEvent,id) {
            if(oEvent !== "" ){
            var sId = oEvent.getParameter("id");
            } else {
                var sId = id;
            }
               var aSelectedVer;
            //Location list
            if(sId.includes("MFL")){
                var aSelectedLoc = oEvent.getParameter("selectedItems");
                that.oMFLoc.setValue(aSelectedLoc[0].getTitle());

                that.byId("idverJF").setValue("");
                    that.byId("idscenJF").setValue("");
                    that.byId("classInputJF").removeAllTokens();

                // var selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

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
                //     return aComp.FACTORY_LOC === that.byId("MFLInputJF").getValue() ;
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

                // var selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
                // if (selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION")) {
                //     that.PlancfgPara(aSelectedLoc[0].getTitle(), "");
                // }
            }

                if(that.byId("CONFIG_PRODUCTJF").getVisible() === true){
                    that.oProd = that.byId("CprodInputJF");
                } else {
                    that.oProd = that.byId("PprodInputJF");
                }

                that.oProd.removeAllTokens();

                var aIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                switch (selStep) {
                    case "PREDICTION":
                        that.TempParams[index].IMPACT_ANALYSIS = that.byId("idImpactJF").getSelected();
                        that.TempParams[index].OVERRIDE_ASSIGNMENT = that.byId("idOverrideJF").getSelected();
                        that.TempParams[index].DsAlgorithm = that.byId("PidDSAlgJF").getSelectedKey();
                        that.TempParams[index].GEN_TYPE = that.byId("GenidTypeJF").getSelectedKey();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVerJF").getSelectedKey();
                        that.TempParams[index].OptAlgorithm = that.byId("PidOptAlgJF").getSelectedKey();
                        that.TempParams[index].OptFactor = that.byId("PidOptFctJF").getSelectedKey();
                        break;
                    case "TIMES_SERIES_HISTORY":
                        that.TempParams[index].DAILY = that.byId("idDailyJF").getSelected();
                        
                        break;
                    case "MODEL_GENERATION":
                        that.TempParams[index].OVERRIDE_ASSIGNMENT = that.byId("idOverrideJF").getSelected();
                        that.TempParams[index].GEN_TYPE = that.byId("GenidTypeJF").getSelectedKey();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVerJF").getSelectedKey();
    
                        break;
                    case "EXPORT_IBP_ASSEMBLY_REQ_QUANTITY":
                        that.TempParams[index].CRITICAL_ASSEMBLY = that.byId("idCriticalJF").getSelected();
                        that.TempParams[index].Rolling_Timestamp = that.byId("idRollingJF").getSelected();
    
                        break;
                    case "PUBLISH_FORECAST_ORDERS":
                        that.TempParams[index].Rolling = that.byId("idRollingJF").getSelected();
                        that.TempParams[index].Rolling_Timestamp = that.byId("idRollingWeeksJF").getValue();
                        // that.TempParams[index].SnapShot = that.byId("idSnapShotJF").getSelected();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVerJF").getSelectedKey();
                        if(!that.byId("idSnapShotJF").getSelected()){
                            that.TempParams[index].SnapShot = "";
                        } else {
                            var selRadio = that.byId("idSnapRadioJF").getSelectedButton().getText();
                            if(selRadio === "Create"){
                                that.TempParams[index].SnapShot = "C";
                            } else {
                                that.TempParams[index].SnapShot = "U";
                            }
                        }
    
                        break;
                    case "STATFORECAST_FOR_CHAR_VALUES":
                        that.TempParams[index].OVERRIDE_ASSIGNMENT = that.byId("idOverrideJF").getSelected();
                        that.TempParams[index].GEN_TYPE = that.byId("GenidTypeJF").getSelectedKey();
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVerJF").getSelectedKey();
    
                        break;
                    case "TIMES_SERIES_HISTORY_CUST":
                        that.TempParams[index].DAILY = that.byId("idDailyJF").getSelected();
    
                        break;
                    case "GENERATE_FORECAST_ORDER":
                        that.TempParams[index].MODEL_VERSION = that.byId("idModelVerJF").getSelectedKey();
    
                        break;
                    case "PURGE_PLANNING_DATA":
                        that.TempParams[index].OPERATOR = that.byId("idOperatorJF").getSelectedKey();
    
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
                

                that.byId("idverJF").setValue();
                that.byId("idscenJF").setValue();
                that.byId("classInputJF").removeAllTokens();

                var selDLoc =[];

                // var selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                if(that.LocSelType === "S"){
                    that.oLoc.setValue(aSelectedLoc[0].getTitle());
                    that.TempParams[index].LOCATION_ID = aSelectedLoc[0].getTitle();
                } else {
                    that.oLoc.removeAllTokens();
                    aSelectedLoc.forEach(function (oItem) {
                        if(oItem.getTitle() !== "ALL"){
                        that.oLoc.addToken(
                            new sap.m.Token({
                                key: oItem.getTitle(),
                                text: oItem.getTitle(),
                                editable:false,

                            })
                        );
                        selDLoc.push(oItem.getTitle());
                        }
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

                // var selStep = that.byId("idarrowTitleJF").getText();
                var aData = that.ActivityItems;
                var filterActivites = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID.includes("PRODUCT");
                });

                if(filterActivites.length > 0){

                if (filterActivites[0].OPTION_SELECT === "M") {
                    if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCTJF") {
                        that.oProd = that.byId("PprodInputJF");
                    } else {
                        that.oProd = that.byId("CprodInputJF");
                    }
                    that.oProd.removeAllTokens();
                } else {
                    if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCTJF") {
                        that.byId("PprodInputJF").setValue("");
                        that.oProd = that.byId("PprodInputJF");
                    } else {
                        that.byId("CprodInputJF").setValue("");
                        that.oProd = that.byId("CprodInputJF");
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
            that.handleValueHelp("", "prod");

            
                  
            
                
            } else if (sId.includes("prod")) {
                if(id !== "" && id !== undefined){
                    that._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
                    var selProd = [];
                    var aSelectedProd = that._valueHelpDialogProd.getItems();
                    aSelectedProd.forEach(function (oItem) {
                        if(oItem.getTitle() !== "ALL"){
                        selProd.push(oItem.getTitle());
                        
                    }
                    });

                    var Exists = [],
                    // selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                that.TempParams[index].PRODUCT_ID = selProd;
                
                if(that.TempParams[index].VERSION !== undefined){
                    that.TempParams[index].VERSION = "__BASELINE";
                    that.TempParams[index].SCENARIO = "_PLAN";
                }
                if(that.TempParams[index].CLASS !== undefined){
                    that.TempParams[index].CLASS = "";
                }
                } else {
                var aSelectedProd = oEvent.getParameter("selectedItems");
                var selProd = [];
                if (that.ProdSelType === "M") {
                    that.oProd.removeAllTokens();
                    aSelectedProd.forEach(function (oItem) {
                        if(oItem.getTitle() !== "ALL"){
                        selProd.push(oItem.getTitle());
                        that.oProd.addToken(
                            new sap.m.Token({
                                key: oItem.getTitle(),
                                text: oItem.getTitle(),
                                editable: false,

                            })
                        );
                    }
                    });
                } else {
                    that.oProd.setValue(aSelectedProd[0].getTitle());
                    selProd = aSelectedProd[0].getTitle();
                }

                that.byId("idverJF").setValue("");
                that.byId("idscenJF").setValue("");
                that.byId("classInputJF").removeAllTokens();;

                var Exists = [],
                    // selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
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
                // that.byId("idverJF").setValue(aSelectedVer[0].getTitle());
                that.byId("idverJF").setValue(aSelectedVer[0].getTitle());

                var Exists = [],
                    // selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                that.TempParams[index].VERSION = aSelectedVer[0].getTitle();
                that.TempParams[index].SCENARIO = "";

                that.byId("idscenJF").setValue();

                // if (index !== -1) {
                //     that.TempParams[index].VERSION = aSelectedVer[0].getTitle();
                //     that.TempParams[index].SCENARIO = "";
                // }

                // that.getScenario(that.ProdSelType, selStep);
                that.ChnageData(aSelectedVer[0].getTitle(),selStep,"VERSION");
            } else if (sId.includes("scen")) {
                var aSelectedScen = oEvent.getParameter("selectedItems");
                that.byId("idscenJF").setValue(aSelectedScen[0].getTitle());
                
                var Exists = [],
                    // selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                that.TempParams[index].SCENARIO = aSelectedScen[0].getTitle();

                // if (index !== -1) {
                //     that.TempParams[index].SCENARIO = aSelectedScen[0].getTitle();
                // }
                that.ChnageData(aSelectedScen[0].getTitle(),selStep,"SCENARIO");
            } else if (sId.includes("CLASSJF")) {
                var aSelectedClass = oEvent.getParameter("selectedItems");
                
                that.oClass = that.byId("classInputJF");
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
                    // selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
                // Exists = that.TempParams.filter(function (aComp) {
                //     return aComp.ACTIVITY_ID === selStep;
                // });
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

               that.TempParams[index].CLASS = selClass;

                that.ChnageData(aSelectedClass,selStep,"CLASS");


            }  else if (sId.includes("CustGroupSlctList")) {
                var aSelectedCustGroup = oEvent.getParameter("selectedItems");
                // that.byId("idverJF").setValue(aSelectedCustGroup[0].getTitle());
                that.byId("custGrpInputJF").setValue(aSelectedCustGroup[0].getTitle());

                var Exists = [],
                    // selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
                
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                that.TempParams[index].CUSTOMER_GROUP = aSelectedCustGroup[0].getTitle();
                
                that.ChnageData(aSelectedCustGroup[0].getTitle(),selStep,"CUSTOMER_GROUP");
            } else if (sId.includes("ppfSlctList")) {
                var aSelectedPPF = oEvent.getParameter("selectedItems");
                that.byId("PrePFInputJF").setValue(aSelectedPPF[0].getTitle());
                
                var Exists = [],
                    // selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
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
                that.ChnageData(aSelectedPPF[0].getTitle(),selStep,"PREDICTION_PROFILEJF");
            } else if (sId.includes("TempSlctList")) {

                var aSelectedTemp = oEvent.getParameter("selectedItems");
                that.byId("idTempValueJF").setValue(aSelectedTemp[0].getTitle());
                that.byId("idJobfeedname").setValue(aSelectedTemp[0].getDescription().replace(/\s/g, ''));
                that.LEVEL = aSelectedTemp[0].getInfo();

                if(that.LEVEL === "External" || that.LEVEL === ""){
                    that.LEVEL = "E";
                } else if(that.LEVEL === "Internal"){
                    that.LEVEL = "I";
                }
                // that.onJobnamevalidation();
                // that.byId("idJobSchtype").setSelectedKey("Im");
                // that.onJobTypeChange();
                

                // var i = aSelectedTemp[0].mBindingInfos.title.binding.oContext.sPath.split("/TemplateItems/")[1];
                var string = aSelectedTemp[0].getTitle();
                var steps = that.TemplateDetail.filter(function (aComp) {
                    return aComp.TEMPLATE_ID === string;
                });
                that.MaxStep = steps[0].STEPS;
                that.onSelTemp();
                // that.onRecurrence();
                // that.onValidation();

                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readTemplateItems", {
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, aSelectedTemp[0].getTitle()),
                            new Filter("VARIANT_NAME", FilterOperator.EQ, "NA"),],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();

                       

                        that.TemplateItems = oData.results;
                        that.TemplateItems = that.TemplateItems.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                        if(that.TemplateItems.length > 0){
                            that.LayerCode = "Private";
                            that.templevel = that.TemplateItems[0].LEVEL;
                        } else {
                            that.LayerCode = "Private";
                            that.templevel = "";
                        }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readTemplateItemsParams", {
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, aSelectedTemp[0].getTitle()),
                            new Filter("VARIANT_NAME", FilterOperator.EQ, "NA"),],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        oData.results.forEach(el => {
                            el.VALUE = "";
                        });
                        that.TempParams = [];
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
                                // if(test === "DATE_RANGEJF"){
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
                        
                    // that.divideDatatoSend();


                        // if (that.PublishFO > 0) {
                        //     that.getUserData();
                        // }
                        //   that.TempParams = oData.results;
                        if (that.byId("CreateWizardJF")._aStepPath.length === 2 || that.byId("CreateWizardJF")._aStepPath.length === 3) {
                            setTimeout(() => {
                                that.onValidation();
                            }, 1500);
                        }

                        
                        if(that.TempParams.length > 0){
                            that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                            

                        // if(that.TempParams[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                        //     var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                        //     that.byId("FromDateJF").setMaxDate(tempDate);
                        //     that.byId("ToDateJF").setMaxDate(tempDate);
                        //     that.byId("FromDateJF").setMinDate(null);
                        //     that.byId("ToDateJF").setMinDate(null);
                        // } else if(that.TempParams[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                        //     that.byId("FromDateJF").setMinDate(null);
                        //     that.byId("ToDateJF").setMinDate(null);
                        //     that.byId("FromDateJF").setMaxDate(null);
                        //     that.byId("ToDateJF").setMaxDate(null);
                        // } else {
                        //     that.byId("FromDateJF").setMaxDate(null);
                        //     that.byId("ToDateJF").setMaxDate(null);
                        //     that.byId("FromDateJF").setMinDate(new Date());
                        //     that.byId("ToDateJF").setMinDate(new Date());
                        // }
                    }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

            }

            that.handleClose(oEvent);

        },


        handleSelection:function(oEvent, id){
            if(oEvent !== "" ){
                var sId = oEvent.getParameter("id");
                } else {
                    var sId = id;
                }
                   var aSelectedVer;



            if (sId.includes("MFL")) {
                var aSelectedLoc = oEvent.getParameter("selectedItems");
                // sap.ui.getCore.byId("MFLInputU").setValue(aSelectedLoc[0].getTitle());
                that.oMFLocUni.removeAllTokens();
                aSelectedLoc.forEach(function (oItem, i) {
                    that.oMFLocUni.addToken(
                        new sap.m.Token({
                            key: aSelectedLoc[i].getCells()[0].getTitle(),
                            text: aSelectedLoc[i].getCells()[0].getTitle(),
                            editable: false,

                        })
                    );

                });
            } else if (sId.includes("Loc")) {
                // var aSelectedLoc = oEvent.getParameter("selectedItems");

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                // setTimeout(() => {

                var aContexts = oEvent.getParameter("selectedContexts");
                that.aSelectedLoc = [];

                // var aSelectedLoc = aContexts.map(function (oContext) { return oContext.getObject().LOCATION_ID; });
                for (var i = 0; i < aContexts.length; i++) {
                    var index = parseInt(aContexts[i].sPath.split("/Locitems/")[1]);

                    var obj = that.LocDataUni[index];

                    that.aSelectedLoc.push(obj);

                }

                that.oLocUni.removeAllTokens();
                that.aSelectedLoc.forEach(function (oItem, i) {
                    that.oLocUni.addToken(
                        new sap.m.Token({
                            key: that.aSelectedLoc[i].FACTORY_LOC,
                            text: that.aSelectedLoc[i].LOCATION_ID,
                            editable: false,

                        })
                    );

                });
            } else if (sId.includes("ConfProduct")) {

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                // setTimeout(() => {

                var aContexts = oEvent.getParameter("selectedContexts");
                that.aSelectedProd = [];
                // var aSelectedProd = aContexts.map(function (oContext) { return oContext.getObject().PRODUCT_ID; });
                for (var i = 0; i < aContexts.length; i++) {
                    var index = parseInt(aContexts[i].sPath.split("/results/")[1]);

                    var obj = that.ConfProdDataUni[index];

                    that.aSelectedProd.push(obj);

                }
                that.oConfProdUni.removeAllTokens();
                that.aSelectedProd.forEach(function (oItem, i) {
                    that.oConfProdUni.addToken(
                        new sap.m.Token({
                            // key: aSelectedProd[i].getCells()[1].getTitle(),
                            // text: aSelectedProd[i].getCells()[0].getTitle(),
                            key: that.aSelectedProd[i].DEMAND_LOC,
                            text: that.aSelectedProd[i].REF_PRODID,
                            editable: false,

                        })
                    );

                });

                // }, 0);
            } else if (sId.includes("prod")) {

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                // setTimeout(() => {

                var aContexts = oEvent.getParameter("selectedContexts");
                that.aSelectedProd = [];
                // var aSelectedProd = aContexts.map(function (oContext) { return oContext.getObject().PRODUCT_ID; });
                for (var i = 0; i < aContexts.length; i++) {
                    var index = parseInt(aContexts[i].sPath.split("/results/")[1]);

                    var obj = that.ProdDataUni[index];

                    that.aSelectedProd.push(obj);

                }
                that.oProdUni.removeAllTokens();
                that.aSelectedProd.forEach(function (oItem, i) {
                    that.oProdUni.addToken(
                        new sap.m.Token({
                            // key: aSelectedProd[i].getCells()[1].getTitle(),
                            // text: aSelectedProd[i].getCells()[0].getTitle(),
                            key: that.aSelectedProd[i].REF_PRODID,
                            text: that.aSelectedProd[i].PRODUCT_ID,
                            editable: false,

                        })
                    );

                });

                // }, 0);
            } else if (sId.includes("Ver")) {
                var aSelectedScen = oEvent.getParameter("selectedItems");
                that.byId("idverJF").setValue(aSelectedScen[0].getTitle());
            } else if (sId.includes("scen")) {
                var aSelectedScen = oEvent.getParameter("selectedItems");
                that.byId("idscenJF").setValue(aSelectedScen[0].getTitle());
            } else if (sId.includes("CustGroupSlctList")) {
                var aSelectedCustGroup = oEvent.getParameter("selectedItems");
                that.byId("custGrpInputJF").setValue(aSelectedCustGroup[0].getTitle());
            } else if (sId.includes("ppfSlctList")) {
                var aSelectedPPF = oEvent.getParameter("selectedItems");
                that.byId("PrePFInputJF").setValue(aSelectedPPF[0].getTitle());

            } else if (sId.includes("algoSlctList")) {
                var aSelectedFA = oEvent.getParameter("selectedItems");
                that.byId("ForeAlgInputJF").setValue(aSelectedFA[0].getTitle());

            } else if (sId.includes("TempSlctList")) {

                var aSelectedTemp = oEvent.getParameter("selectedItems");
                that.byId("idTempValueJF").setValue(aSelectedTemp[0].getTitle());
                that.byId("idJobfeedname").setValue(aSelectedTemp[0].getDescription().replace(/\s/g, ''));
                that.LEVEL = aSelectedTemp[0].getInfo();

                if(that.LEVEL === "External" || that.LEVEL === ""){
                    that.LEVEL = "E";
                } else if(that.LEVEL === "Internal"){
                    that.LEVEL = "I";
                }
                // that.onJobnamevalidation();
                // that.byId("idJobSchtype").setSelectedKey("Im");
                // that.onJobTypeChange();
                

                // var i = aSelectedTemp[0].mBindingInfos.title.binding.oContext.sPath.split("/TemplateItems/")[1];
                var string = aSelectedTemp[0].getTitle();
                var steps = that.TemplateDetail.filter(function (aComp) {
                    return aComp.TEMPLATE_ID === string;
                });
                that.MaxStep = steps[0].STEPS;
                that.onSelTemp();
                // that.onRecurrence();
                // that.onValidation();

                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readTemplateItems", {
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, aSelectedTemp[0].getTitle()),
                            new Filter("VARIANT_NAME", FilterOperator.EQ, "NA"),],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();

                       

                        that.TemplateItems = oData.results;
                        that.TemplateItems = that.TemplateItems.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                        if(that.TemplateItems.length > 0){
                            that.LayerCode = "Private";
                            that.templevel = that.TemplateItems[0].LEVEL;
                        } else {
                            that.LayerCode = "Private";
                            that.templevel = "";
                        }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").read("/readTemplateItemsParams", {
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, aSelectedTemp[0].getTitle()),
                            new Filter("VARIANT_NAME", FilterOperator.EQ, "NA"),],
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        // oData.results.forEach(el => {
                        //     el.VALUE = "";
                        // });
                        that.TempParams = [];
                        for (var i = 0; i < oData.results.length; i++) {
                            var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === oData.results[i].ACTIVITY_ID &&
                                e.ACT_POSITION === oData.results[i].ACT_POSITION);
                            // if (oData.results[i].ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS") {
                            //     that.PublishFO = that.PublishFO + 1;
                            // }

                            if(oData.results[i].PARAMETER_ID === "LOCATION_ID" || oData.results[i].PARAMETER_ID === "PARTIAL_PRODUCT" ||
                                oData.results[i].PARAMETER_ID === "MF_LOCATION_ID" || oData.results[i].PARAMETER_ID === "CONFIG_PRODUCT"
                            ){
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
                                // if(test === "DATE_RANGEJF"){
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

                  
                        
                    // that.divideDatatoSend();


                        // if (that.PublishFO > 0) {
                        //     that.getUserData();
                        // }
                        //   that.TempParams = oData.results;
                        if (that.byId("CreateWizardJF")._aStepPath.length === 2 || that.byId("CreateWizardJF")._aStepPath.length === 3) {
                            setTimeout(() => {
                                that.onValidation();
                            }, 1500);
                        }

                        
                        if(that.TempParams.length > 0){
                            that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                            

                        // if(that.TempParams[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                        //     var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                        //     that.byId("FromDateJF").setMaxDate(tempDate);
                        //     that.byId("ToDateJF").setMaxDate(tempDate);
                        //     that.byId("FromDateJF").setMinDate(null);
                        //     that.byId("ToDateJF").setMinDate(null);
                        // } else if(that.TempParams[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                        //     that.byId("FromDateJF").setMinDate(null);
                        //     that.byId("ToDateJF").setMinDate(null);
                        //     that.byId("FromDateJF").setMaxDate(null);
                        //     that.byId("ToDateJF").setMaxDate(null);
                        // } else {
                        //     that.byId("FromDateJF").setMaxDate(null);
                        //     that.byId("ToDateJF").setMaxDate(null);
                        //     that.byId("FromDateJF").setMinDate(new Date());
                        //     that.byId("ToDateJF").setMinDate(new Date());
                        // }
                    }

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

            }

        
        that.handleClose(oEvent);

        },

        PlancfgPara: function (oLoc, gentype) {

            var selLoc = oLoc,
                genType = gentype;
                sap.ui.core.BusyIndicator.show();
            that.getModel("BModel").read("/getPlancfgPara", {
                filters: [
                    new Filter("LOCATION_ID", FilterOperator.EQ, selLoc),
                    new Filter("PARAMETER_ID", FilterOperator.EQ, "5"),
                ],
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
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

                        that.getView().byId("GenidTypeJF").setModel(jmodel);

                        if (gentype !== "") {
                            that.byId("GenidTypeJF").setSelectedKey(genType);
                        } else {
                            that.byId("GenidTypeJF").setSelectedKey(that.typeData.Types[0].key);
                        }

                        // var selStep = that.getView().byId("idarrowTitleJF").getText(),
                    step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

                    var aIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                    
                    that.TempParams[aIndex].GEN_TYPE = that.byId("GenidTypeJF").getSelectedKey();
                    // that.TempParams[index].GEN_TYPE = that.typeData.Types[0].key;
                    }
                },
                error: function (oData, error) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("error");
                },
            });

        },

        onJobnamevalidation: function (oEvent) {
            var specials = /[!@#$%^&*() +\-=\[\]{};':"\\|,.<>\/?]+/;
            var name = that.byId("idJobfeedname").getValue();
                name = name.replace(/\s/g, '');
                that.byId("idJobfeedname").setValue(name.toUpperCase());
            var jobName = specials.test(name);
            var Text = "";
            // if(that.oGModel.getProperty("/variantEditFlag") === ""){
                if(that.oGModel.getProperty("/VariantNameFlag") === "X"){
                var variantData = that.oGModel.getProperty("/Data");
                var dummy = variantData.filter(el=> el.VARIANT_NAME === that.byId("idJobfeedname").getValue());      
                if(dummy.length > 0){
                    jobName = true;
                    Text = "JobFeed name is already exists"
                }
            }
            // }

            if (jobName === false) {
                // this.byId("CreateWizardJF").validateStep(this.byId("idParametersJF"));
                // that.byId("idParametersJF").setValidated(true);

                this.byId("CreateWizardJF").validateStep(this.byId("TempTypeStepJF"));
                that.byId("TempTypeStepJF").setValidated(true);

                // that.byId("FormToolbar").setVisible(true);
                
                that.byId("idJobfeedname").setValueState("None");
                // that.byId("idarrowJF").setVisible(true);
                that.byId("idParameterJF").setVisible(true);
                //changed for Demo
                that.byId("idJobcreate").setVisible(false);
                // that.byId("idJobcreate").setVisible(true);
                // end of change

                if (that.Edit === "") {
                    that.byId("idCreateJF").setVisible(true);
                    that.byId("idUpdateJF").setVisible(false);
    
                } else if (that.Edit === "X") {
                    if(that.oGModel.getProperty("/copy") === ""){
                        that.byId("idCreateJF").setVisible(false);
                        that.byId("idUpdateJF").setVisible(true);
                    } else {
                        that.byId("idCreateJF").setVisible(true);
                        that.byId("idUpdateJF").setVisible(false);
                    }                   
                }

                

               
            } else {
                this.byId("CreateWizardJF").invalidateStep(this.byId("idParametersJF"));
                that.byId("idParametersJF").setValidated(false);

                this.byId("CreateWizardJF").invalidateStep(this.byId("TempTypeStepJF"));
                that.byId("TempTypeStepJF").setValidated(false);

                // that.byId("FormToolbar").setVisible(false);
                that.byId("idJobfeedname").setValueState("Error");
                if(Text === ""){
                    Text = "Special characters are not allowed";
                }
                that.byId("idJobfeedname").setValueStateText(Text);

                // that.byId("idarrowJF").setVisible(false);
                that.byId("idParameterJF").setVisible(false);
                that.byId("idJobcreate").setVisible(false);
                that.byId("idCreateJF").setVisible(false);
                that.byId("idUpdateJF").setVisible(false);

                
            }

            

        },

        getDemandLocation:function(){
            // that.LocData = that.ManuLocData.filter(function (aComp) {
            //     return aComp.FACTORY_LOC === that.byId("MFLInputJF").getValue() ;
            // });
            // that.LocData.forEach(el => {
            //     el.LOCATION_ID = el.DEMAND_LOC;
            //     el.LOCATION_DESC = el.DEMAND_DESC;
            // });

            this.getModel("BModel").read("/getfactorylocdesc", {
                filters: [new Filter("FACTORY_LOC", FilterOperator.EQ, that.byId("MFLInputJF").getValue()) ],
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

                    // var selStep = that.getView().byId("idarrowTitleJF").getText();

        
                    var aData = that.ActivityItems;
                var filterActivites = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATIONJF";
                    });
        
                    if (filterActivites[0].OPTION_SELECT === "M" ) {
                        that.LocSelType = "M";
                        sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(true);
        
                        if (that.LocData.length > 0) {
                            that.LocData.unshift({
                                LOCATION_ID: "ALL",
                                LOCATION_DESC: "ALL",
                            });
                        }
                    } else if (filterActivites[0].OPTION_SELECT === "S" ) {
                        that.LocSelType = "S";
                        sap.ui.getCore().byId("LocSlctListJSS").setMultiSelect(false);
                        sap.ui.getCore().byId("LocSlctListJSS").setRememberSelections(false);
                    }
                    that.locModel = new JSONModel();
                    that.locModel.setSizeLimit(1000);
        
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
                
            // var selStep = that.getView().byId("idarrowTitleJF").getText();

        
        //     var aData = that.ActivityItems;
        // var filterActivites = aData.filter(function (aComp) {
        //     return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATIONJF";
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
            // var selStep = that.byId("idarrowTitleJF").getText(),
                step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
            var aData = that.ActivityItems;
            var filterActivites = aData.filter(function (aComp) {
                return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID.includes("PRODUCT");
            });

            if (filterActivites[0].OPTION_SELECT === "M") {
                if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCTJF") {
                    that.oProd = that.byId("PprodInputJF");
                } else {
                    that.oProd = that.byId("CprodInputJF");
                }
                // that.oProd.removeAllTokens();
                this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
            } else {
                if (filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCTJF") {
                    // that.byId("PprodInputJF").setValue("");
                    that.oProd = that.byId("PprodInputJF");
                } else {
                    // that.byId("CprodInputJF").setValue("");
                    that.oProd = that.byId("CprodInputJF");
                }
            }

            var selectionType = filterActivites[0].OPTION_SELECT;
            // if (that.byId("MF_LOCATIONJF").getVisible() === true) {
            //     that.oLoc = that.byId("MlocInput");
            // } else {
            //     that.oLoc = that.byId("DlocInputJF");
            // }
            that.oLoc = that.byId("DlocInputJF");
            var oFilters = [];
                    that.TempLocData = [];
            if(that.byId("DM_LOCATIONJF").getVisible() === true){
                    var aSelectedLoc = that.oLoc.getTokens();
                     for (var i = 0; i < aSelectedLoc.length; i++) {
                         if (aSelectedLoc[i].getText() !== "ALL") {
                            that.TempLocData.push(aSelectedLoc[i].getText());
                             sFilter = new sap.ui.model.Filter({
                                 path: "LOCATION_ID",
                                 operator: sap.ui.model.FilterOperator.EQ,
                                 value1: aSelectedLoc[i].getText(),
                             });
                             oFilters.push(sFilter);
                         }
                     }
                } else {
                    that.oMFLoc = that.byId("MFLInputJF");
                    that.TempLocData.push(that.oMFLoc.getValue());
                    var sFilter = new sap.ui.model.Filter({
                        path: "LOCATION_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: that.oMFLoc.getValue(),
                    });
                    oFilters.push(sFilter);
                }


            if (filterActivites[0].PARAMETER_ID !== "PARTIAL_PRODUCTJF") {

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

                if (data.results.length > 0) {
                    data.results.unshift({
                        PRODUCT_ID: "ALL",
                        PROD_DESC: "ALL",
                    });
                }
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
            that.prodModel.setSizeLimit(1000);

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

        if(that.oGModel.getProperty("/HSFLAG") === "X"){
            that.handleSelection("", "prod");
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
            if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
                that.oProd = that.byId("CprodInputJF");
                verFlag = "X";
            } else {
                that.oProd = that.byId("PprodInputJF");
                verFlag = "";
            }

            var loc = "";
            that.TempLocData = [];
                if(that.byId("DM_LOCATIONJF").getVisible() === true){
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
            // var ActivityId = activity
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
            if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
                that.oProd = that.byId("CprodInputJF");
                var verFlag = "X";
            } else {
                that.oProd = that.byId("PprodInputJF");
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
                if(that.byId("DM_LOCATIONJF").getVisible() === true){
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
                value1: that.byId("idverJF").getValue(),
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
                        var version = that.byId("idverJF").getValue();
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
                            return aComp.VERSION === that.byId("idverJF").getValue() ;
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
            if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
                that.oProd = that.byId("CprodInputJF");
            } else {
                that.oProd = that.byId("PprodInputJF");
            }

            var selectionType;
            if (that.oProd.getValue() === "" && that.oProd.getTokens().length > 0) {
                selectionType = "M";
            } else if (that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                selectionType = "S";
            }

            var loc = "";
            that.TempLocData = [];
                if(that.byId("DM_LOCATIONJF").getVisible() === true){
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

                        that.oClass = that.byId("classInputJF");
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
            if (that.byId("CONFIG_PRODUCTJF").getVisible() === true) {
                that.oProd = that.byId("CprodInputJF");
            } else {
                that.oProd = that.byId("PprodInputJF");
            }

            var selectionType;
            if (that.oProd.getValue() === "" && that.oProd.getTokens().length > 0) {
                selectionType = "M";
            } else if (that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                selectionType = "S";
            }

            var loc = "";
            that.TempLocData = [];
                if(that.byId("DM_LOCATIONJF").getVisible() === true){
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


        // onModelChange: function () {
        //     var sel = that.byId("idModelVerJF").getSelectedKey();
        //     var Exists = [],
        //         // selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

        //     that.TempParams[index].MODEL_VERSION = sel;

        //     that.ChnageData(sel,selStep,"MODEL_VERSIONJF");

        // },

        // OnGentypeChange: function () {
        //     var sel = that.byId("GenidTypeJF").getSelectedKey();
        //     var Exists = [],
        //         // selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].GEN_TYPE = sel;

        //     that.ChnageData(sel,selStep,"GEN_TYPE");

        // },

        // onOverride: function () {
        //     var sel = that.byId("idOverrideJF").getSelected();
        //     var Exists = [],
        //         // selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].OVERRIDE_ASSIGNMENT = sel;

        //     that.ChnageData(sel,selStep,"OVERRIDE_ASSIGNMENT");
        // },

        // onCritical: function () {
        //     var sel = that.byId("idCriticalJF").getSelected();
        //     var Exists = [],
        //         // selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
        //         var selected = "";

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     if(sel){
        //         selected = "X";
        //     }
        //     that.TempParams[index].CRITICAL_ASSEMBLY = sel;
        //     that.ChnageData(selected,selStep,"CRITICAL_ASSEMBLY");

        // },

        // onImpact: function () {
        //     var sel = that.byId("idImpactJF").getSelected();
        //     var Exists = [],
        //         // selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].IMPACT_ANALYSIS = sel;
        //     that.ChnageData(sel,selStep,"IMPACT_ANALYSIS");

        // },

        // onDaily: function () {
        //     var sel = that.byId("idDailyJF").getSelected();
        //     var Exists = [],
        //         // selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].DAILY = sel;

        //     that.ChnageData(sel,selStep,"DAILY");

        // },

        handleDateChange: function (oEvent) {
            var fromDate = that.byId("FromDateJF").getValue();
            var toDate = that.byId("ToDateJF").getValue();
            var Exists = [];


            var selDate = oEvent.getParameters().id;

            var fromDate = that.byId("FromDateJF").getValue();
            var toDate = that.byId("ToDateJF").getValue();
            if (selDate.includes("FromDateJF")) {
                that.byId("ToDateJF").setEditable(true);
                that.byId("ToDateJF").setMinDate(new Date(fromDate));
            }



                // // selStep = that.getView().byId("idarrowTitleJF").getText(),
                // step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

            // var selDate = oEvent.getParameters().id;

            // if (selDate.includes("FromDateJF") && selStep !== "GENERATE_SEEDORDER") {
            //     that.byId("ToDateJF").setEditable(true);
            //     that.byId("ToDateJF").setMinDate(new Date(fromDate));
            // } else if(selDate.includes("FromDateJF") && selStep === "GENERATE_SEEDORDER"){
            //     var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
            //     that.byId("ToDateJF").setEditable(true);
            //     that.byId("ToDateJF").setMinDate(new Date(fromDate));
            //     that.byId("ToDateJF").setMaxDate(tempDate);
            // }

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
            // that.TempParams[index].FROM_DATE = fromDate;
            // that.TempParams[index].TO_DATE = toDate;

            // if(selStep === "PURGE_PLANNING_DATA"){
            //     var selOpr = that.byId("idOperatorJF").getSelectedKey();
            //     that.ChnageData(selOpr,selStep,"OPERATOR");
            // }

            // if (selDate.includes("FromDateJF")){
            //     that.ChnageData(fromDate,selStep,"FROM_DATE");
            // } else if(selDate.includes("ToDateJF")){
            //     that.ChnageData(toDate,selStep,"TO_DATE");
            // }
            // that.ChnageData(fromDate,selStep,"FROM_DATE");
            // that.ChnageData(toDate,selStep,"TO_DATE");


        },

        // handleDateChange1:function(oEvent){
        //     var singleDate = that.byId("singleDtJF").getValue();
        //     var Exists = [],
        //         // selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);


        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].SINGLE_DATE = singleDate;

        //     if(selStep === "PURGE_PLANNING_DATA"){
        //         var selOpr = that.byId("idOperatorJF").getSelectedKey();
        //         that.ChnageData(selOpr,selStep,"OPERATOR");
        //     }
        //     that.ChnageData(singleDate,selStep,"SINGLE_DATE");

        // },

        onOperatorChange:function(oEvent){

            var selOpr = that.byId("idOperatorJF").getSelectedKey();
            // // var selStep = that.getView().byId("idarrowTitleJF").getText(),
            //     step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
            that.byId("FromDateJF").setValue();
            that.byId("ToDateJF").setValue();
            that.byId("singleDtJF").setValue();
            if(selOpr === "BT"){
                that.byId("DATE_RANGEJF").setVisible(true);
                that.byId("SINGLE_DATEJF").setVisible(false);
            } else {
                that.byId("DATE_RANGEJF").setVisible(false);
                that.byId("SINGLE_DATEJF").setVisible(true);
            }

            // that.ChnageData(selOpr,selStep,"OPERATOR");

        },

        onRolling:function(){
            // if(that.TempParams.length > 0){
            var sel = that.byId("idRollingJF").getSelected();
            
            // // var selStep = that.getView().byId("idarrowTitleJF").getText(),
            //     step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
            
                that.byId("FromDateJF").setValue();
                that.byId("ToDateJF").setValue();
            if(sel){
                // that.TempParams[index].Rolling = true;
                that.byId("FromDateJF").setEditable(false);
                that.byId("ToDateJF").setEditable(false);
                that.byId("idRollingWeeksJF").setValue();
                that.byId("idRollingWeeksJF").setVisible(true);
            } else {
                // that.TempParams[index].Rolling = false;
                that.byId("FromDateJF").setEditable(true);
                that.byId("ToDateJF").setEditable(true);
                that.byId("idRollingWeeksJF").setValue();
                that.byId("idRollingWeeksJF").setVisible(false);
            }
            

            // that.ChnageData(sel,selStep,"Rolling");
        // }
        },

        onRollWeekchange:function(oEvent){
            var week = parseInt(that.byId("idRollingWeeksJF").getValue());

            // // var selStep = that.getView().byId("idarrowTitleJF").getText(),
            //     step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

            var newDate = new Date(new Date(). getTime() + week * 7 * 24 * 60 * 60 * 1000);
            var fromDate = new Date().toISOString().split("T")[0];
            var toDate = "";
                if(!isNaN(newDate)){
                    toDate = newDate.toISOString().split("T")[0];
                }
                if(week > 0){                    
                    that.byId("FromDateJF").setValue(fromDate);
                    that.byId("ToDateJF").setValue(toDate);

                    // that.TempParams[index].Rolling_Timestamp = week;
                    // that.TempParams[index].FROM_DATE = fromDate;
                    // that.TempParams[index].TO_DATE = toDate;

                } else {
                    MessageToast.show("Please maintain valid weeks");
                    that.byId("FromDateJF").setValue();
                    that.byId("ToDateJF").setValue();
                    
                    // that.TempParams[index].Rolling_Timestamp = "";
                    // that.TempParams[index].FROM_DATE = "";
                    // that.TempParams[index].TO_DATE = "";

                }
                    // that.ChnageData(week,selStep,"Rolling_Timestamp");
                    // that.ChnageData(fromDate,selStep,"FROM_DATE");
                    // that.ChnageData(toDate,selStep,"TO_DATE");

        },

        // onWeekValues: function(){
        //     var week = parseInt(that.byId("idWeeksJF").getValue());

        //     // var selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].HISTORY_WEEKS = week;

        //     that.ChnageData(week,selStep,"HISTORY_WEEKS");

        // },

        // OnOptAlgChange: function () {
        //     var sel = that.byId("PidOptAlgJF").getSelectedKey();

        //     // var selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].OptAlgorithm = sel;

        //     that.ChnageData(sel,selStep,"OptAlgorithm");


        // },

        // OnOptFctChange: function () {
        //     var sel = that.byId("PidOptFctJF").getSelectedItem().getText();

        //     // var selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].OptFactor = parseFloat(sel);

        //     that.ChnageData(sel,selStep,"OptFactor");


        // },

        // OnDsAlgChange: function () {
        //     var sel = that.byId("PidDSAlgJF").getSelectedKey();

        //     // var selStep = that.getView().byId("idarrowTitleJF").getText(),
        //         step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);

        //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
        //     that.TempParams[index].DsAlgorithm = sel;

        //     that.ChnageData(sel,selStep,"DsAlgorithm");


        // },

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
            // var selStep = that.getView().byId("idarrowTitleJF").getText(),
                step = parseInt(that.getView().byId("stepLabelJF").getText().split("of")[0]);
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

                if(that.byId("CONFIG_PRODUCTJF").getVisible() === true){
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

            onJobFeedCreate: function (oEvent) {
                if(oEvent.getParameters().id.includes("idJobcreate")){
                    that.JobCreationFlag = "X";
                } else {
                    that.JobCreationFlag = "";
                }
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
                        if (paramid === "MF_LOCATIONJF") {
                            if (parameters[i].MF_LOCATION_ID === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Manufacturing Location for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.MF_LOCATION_ID = parameters[i].MF_LOCATION_ID;
                            }

                        } 
                        if (paramid === "DM_LOCATIONJF") {
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

                        if (paramid.includes("PREDICTION_PROFILEJF")) {
                            if (parameters[i].PREDICTION_PROFILE === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Prediction Profile for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else if (activitydata[j].MANDATORY === "N" ||
                                (activitydata[j].MANDATORY === "Y" && parameters[i].PREDICTION_PROFILE !== "")) {
                                stepObj.PREDICTION_PROFILE = parameters[i].PREDICTION_PROFILE;
                            }
                        }
                        if (paramid.includes("FORECAST_ALGORITHMJF")) {
                            if (parameters[i].FORECAST_ALGORITHM === "" && activitydata[j].MANDATORY === "Y") {
                                MessageToast.show("Please select Forecast alogorith for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else if (activitydata[j].MANDATORY === "N" ||
                                (activitydata[j].MANDATORY === "Y" && parameters[i].FORECAST_ALGORITHM !== "")) {
                                stepObj.FORECAST_ALGORITHM = parameters[i].FORECAST_ALGORITHM;
                            }
                        }

                        if (paramid === "VERSIONJF") {
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

                        if (paramid.includes("SCENARIOJF")) {
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

                        if (paramid.includes("CUSTOMER_GROUPJF")) {
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

                        if (paramid.includes("CLASSJF")) {
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

                        if (paramid.includes("CRITICAL_ASSEMBLYJF")) {
                            // if (parameters[i].CRITICAL_ASSEMBLY === "true" || parameters[i].CRITICAL_ASSEMBLY === true) {
                            //     // stepObj.CRITICAL_ASSEMBLY = parameters[i].CRITICAL_ASSEMBLY;
                            //     stepObj.CRITICAL_ASSEMBLY = true;
                            // } else {
                            //     // stepObj.CRITICAL_ASSEMBLY = parameters[i].CRITICAL_ASSEMBLY;
                            //     stepObj.CRITICAL_ASSEMBLY = false;
                            // }
                            // var critical = that.byId("idCriticalJF").getSelected();
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

                        if (paramid.includes("IMPACT_ANALYSISJF")) {
                            if (parameters[i].IMPACT_ANALYSIS === "true" || parameters[i].IMPACT_ANALYSIS === true) {
                                // stepObj.IMPACT_ANALYSIS = parameters[i].IMPACT_ANALYSIS;
                                stepObj.IMPACT_ANALYSIS = true;
                            } else {
                                // stepObj.IMPACT_ANALYSIS = parameters[i].IMPACT_ANALYSIS;
                                stepObj.IMPACT_ANALYSIS = false;
                            }
                            // var impact = that.byId("idImpactJF").getSelected();
                            // stepObj.IMPACT_ANALYSIS = impact;
                        }

                        if (paramid.includes("DAILYJF")) {
                            if (parameters[i].DAILY === "true" || parameters[i].DAILY === true) {
                                stepObj.DAILY = true;
                            } else {
                                stepObj.DAILY = false;
                            }
                            // var daily = that.byId("idDailyJF").getSelected();
                            // stepObj.DAILY = daily;
                        }

                        if (paramid.includes("FULL_RUNJF")) {
                            if (parameters[i].FULL_RUN === "true" || parameters[i].FULL_RUN === true) {
                                stepObj.FULL_RUN = true;
                            } else {
                                stepObj.FULL_RUN = false;
                            }
                            // var FULL_RUN = that.byId("idFullRunJF").getSelected();
                            // stepObj.FULL_RUN = FULL_RUN;
                        }

                        if (paramid.includes("OVERRIDE_ASSIGNMENTJF")) {
                            if (parameters[i].OVERRIDE_ASSIGNMENT === "true" || parameters[i].OVERRIDE_ASSIGNMENT === true) {
                                // stepObj.OVERRIDE_ASSIGNMENT = parameters[i].OVERRIDE_ASSIGNMENT;
                                stepObj.OVERRIDE_ASSIGNMENT = true;
                            } else {
                                // stepObj.OVERRIDE_ASSIGNMENT = parameters[i].OVERRIDE_ASSIGNMENT;
                                stepObj.OVERRIDE_ASSIGNMENT = false;
                            }
                            // var override = that.byId("idOverrideJF").getSelected();
                            // stepObj.OVERRIDE_ASSIGNMENT = override;
                        }

                        if (paramid.includes("GEN_TYPEJF")) {
                            if (parameters[i].GEN_TYPE === "" || parameters[i].GEN_TYPE === undefined) {
                                MessageToast.show("Please select Type for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.GEN_TYPE = parameters[i].GEN_TYPE;
                            }
                            // var genT = that.byId("GenidTypeJF").getSelectedKey();
                            // stepObj.GEN_TYPE = genT;
                        }

                        if (paramid.includes("MODEL_VERSIONJF")) {
                            if (parameters[i].MODEL_VERSION === "" || parameters[i].MODEL_VERSION === undefined) {
                                MessageToast.show("Please select Model Version for " + "- " + parameters[i].ACTIVITY_ID);
                                proceedFlag = "X";
                                break;
                            } else {
                                stepObj.MODEL_VERSION = parameters[i].MODEL_VERSION;
                            }
                            // var modelV = that.byId("idModelVerJF").getSelectedKey();
                            // stepObj.MODEL_VERSION = modelV;
                        }

                        if (paramid.includes("DATE_RANGEJF")) {
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


                        if(paramid.includes("OPERATORJF")){
                            var operator = that.byId("idOperatorJF").getSelectedKey();
                            stepObj.OPERATOR = operator;
                        }

                        if(paramid.includes("SINGLE_DATEJF")){
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

                        if (paramid.includes("Rolling_TimestampJF")) {
                            stepObj.Rolling = that.byId("idRollingJF").getSelected();
                                stepObj.Rolling_Timestamp = parameters[i].Rolling_Timestamp;
                        }

                        if (paramid.includes("OptimizationJF")) {
                            var Optimization = that.byId("PidOptimizationJF").getSelected();
                            stepObj.Optimization = Optimization;

                        }

                        if (paramid.includes("POptProfileJF")) {
                            var POPTProfile = that.byId("PidOptProfileJF").getSelectedKey();
                                stepObj.POptProfile = POPTProfile;
                        }

                        if (paramid.includes("OptProfileJF")) {
                            var OPTProfile = that.byId("idOptProfileJF").getSelectedKey();
                                stepObj.OptProfile = OPTProfile;
                        }

                        // if (paramid.includes("DsAlgorithmJF")) {
                        //     // if (parameters[i].DsAlgorithm === "" || parameters[i].DsAlgorithm === undefined) {
                        //     //     MessageToast.show("Please select valid demand sensing algorithm for " + "- " + parameters[i].ACTIVITY_ID);
                        //     //     proceedFlag = "X";
                        //     //     break;
                        //     // } else {
                        //     //     stepObj.DsAlgorithm = parameters[i].DsAlgorithm;
                        //     // }PidDSAlg
                        //     var DSAlgo = that.byId("PidDSAlgJF").getSelectedKey();
                        //     stepObj.DsAlgorithm = DSAlgo;
                        // }
                        // if (paramid.includes("OptFactorJF")) {
                        //     // if (parameters[i].OptFactor === "" || parameters[i].OptFactor === undefined) {
                        //     //     MessageToast.show("Please select valid optimization factor for " + "- " + parameters[i].ACTIVITY_ID);
                        //     //     proceedFlag = "X";
                        //     //     break;
                        //     // } else {
                        //     //     stepObj.OptFactor = parseFloat(parameters[i].OptFactor);
                        //     // }
                        //     var OPTfact = that.byId("PidOptFctJF").getSelectedKey();
                        //     stepObj.OptFactor = parseFloat(OPTfact);
                        // }
                        // if (paramid.includes("OptAlgorithmJF")) {
                        //     // if (parameters[i].OptAlgorithm === "" || parameters[i].OptAlgorithm === undefined) {
                        //     //     MessageToast.show("Please select valid optimization algorithm for " + "- " + parameters[i].ACTIVITY_ID);
                        //     //     proceedFlag = "X";
                        //     //     break;
                        //     // } else {
                        //     //     stepObj.OptAlgorithm = parameters[i].OptAlgorithm;
                        //     // }
                            
                        //     var OPTalgo= that.byId("PidOptAlgJF").getSelectedKey();
                        //     stepObj.OptAlgorithm = OPTalgo;
                        // }

                        if (paramid.includes("SnapShotJF")) {
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

                        if (paramid.includes("HISTORY_WEEKSJF")) {
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
                    var copy = that.oGModel.getProperty("/copy");

                    if ((that.Edit !== "X" || copy === "X") && parameters[i].ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS") {
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

                that.SaveTemplateDetails.forEach(function(oItem,i){
                    oItem.STEP = i + 1;
                    // if(oItem.LOCATION_ID === undefined){
                    //     oItem.LOCATION_ID = oItem.MF_LOCATION_ID;
                    // }
                });

                aData.forEach(function(oItem,i){
                    oItem.STEP = i + 1;
                    if(oItem.STEP_DATA.LOCATION_ID === undefined){
                        oItem.STEP_DATA.LOCATION_ID = oItem.STEP_DATA.MF_LOCATION_ID;
                    }
                    // oItem.VARIANT_NAME = that.byId("idJobfeedname").getValue();
                });


                that.sSequence = "";
                if(that.Edit === "X" && copy === ""){
                    that.Edit = "X";
                } else {
                    that.Edit = ""
                }
                

                if (proceedFlag !== "X") {
                    var oModel = that.getOwnerComponent().getModel('JModel');
                    oModel.callFunction("/insertJobData", {
                        method: "GET",
                        urlParameters: {
                            //new add//
                            Flag: that.Edit,
                            // VARIANT : "X",
                            Sequence: that.byId("idJobfeedname").getValue(),
                            jobData: JSON.stringify(aData)
                        },
                        success: function (oData, oResponse) {

                            that.InsertTemplate();
                            
                        },
                        error: function (oResponse) {
                            sap.m.MessageToast.show("Failed");
                        },
                    });
                } 
           

        },

        InsertTemplateold: function(){
            var parameters = that.TempParams;
            // var parameters = that.TemplateModel.getData().results;
            that.Parameters =[];
            that.TempData =[];
            // To get the user details
            var User = "";
            var Level = that.templevel;
            var layercode = that.LayerCode;
            var maxstpe = parameters.length;

            if (sap.ushell.Container) {
                let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                User = (email) ? email : "";
            }
                var tempplateName = parameters[0].TEMPLATE_ID;
                var jobFeedname = that.byId("idJobfeedname").getValue();

            

            parameters.forEach(el => {
                var length = 0;


                var tempObj = {
                    ACTIVITY_ID : el.ACTIVITY_ID,
                    ACT_POSITION : el.ACT_POSITION,
                    CREATED_BY : User,
                    LAYER_CODE : layercode,
                    LEVEL : Level,
                    MAXSTEP : maxstpe,
                    STEP_NAME : el.ACTIVITY_ID,
                    TEMPLATE_DESC : tempplateName,
                    TEMPLATE_ID : tempplateName,
                    VARIANT_NAME : jobFeedname
                }

                that.TempData.push(tempObj);

                Object.entries(el).forEach(x => {
                    
                    if (!x[0].includes("ACTIVITY_ID") && !x[0].includes("TEMPLATE_ID") && !x[0].includes("ACT_POSITION")
                        && !x[0].includes("actlevel")) {

                        var isArray = Array.isArray(x[1]);
                        if(isArray){
                            var data = x[1].map(String).join(',')
                        } else {
                            var data = x[1].toString();
                        }

                        const obj = {
                            "TEMPLATE_ID": tempplateName,
                            "VARIANT_NAME": jobFeedname,
                            "ACTIVITY_ID": el.ACTIVITY_ID,  
                            "ACT_POSITION" : el.ACT_POSITION,   
                            "LEVEL"        : Level,
                            "PARAMETER_ID": x[0],
                            "VALUE": data
                        }
                        that.Parameters.push(obj);
                        length = 1;
                    }
                })
                if(length === 0){
                    const obj = {
                        // "TEMPLATE_ID": that.byId("idTemp").getValue(),
                        "TEMPLATE_ID": tempplateName,
                        "VARIANT_NAME": jobFeedname,
                        "ACTIVITY_ID": el.ACTIVITY_ID,  
                        "ACT_POSITION" : el.ACT_POSITION,
                        "LEVEL"        : Level,   
                        "PARAMETER_ID": "",
                        "VALUE": ""
                    }
                    that.Parameters.push(obj);
                }
            })


            var falg = that.oGModel.getProperty("/variantEditFlag");
            var copy = that.oGModel.getProperty("/copy");

            if(falg === "X" && copy === ""){
                var selType = "E";
            } else {
                var selType = "";
            }



            sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").callFunction("/genTemplateDetails", {
            method: "GET",
            urlParameters: {
                FLAG:selType,
                VARIANT:"X",
                TEMPDATA: JSON.stringify(that.TempData),
                    PARAMDATA:JSON.stringify(that.Parameters)
            },
            success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                
                if(that.JobCreationFlag === "X"){
                    that.onJobCreate();
                } else {
                    sap.m.MessageToast.show(oData.genTemplateDetails);
                    // that.onBack();
                    that.bus.publish("flexible", "exitScreen");
                    that.bus.publish("data", "refreshMaster");
                }
            },
            error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error to create Template");
            },
        });
        },

        onJobCreate: function () {
            var User = "";
            if (sap.ushell.Container) {
                let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                User = (email) ? email : "";
            }
            var oModel = that.getOwnerComponent().getModel('JModel');
            sap.ui.core.BusyIndicator.show();
                    oModel.callFunction("/createJobFeed", {
                        method: "GET",
                        urlParameters: {                            
                            jobFeedName: that.byId("idJobfeedname").getValue(),
                            userName : User
                        },
                        success: function (oData, oResponse) {
                            sap.m.MessageToast.show("Job Created Successfully");

                            setTimeout(that.backFunction, 10000);
                            
                            
                        },
                        error: function (oResponse) {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Failed to Create job");
                        },
                    });

    },

    backFunction:function(){
        sap.ui.core.BusyIndicator.hide();
        that.onBack();
    },

    exitScreen(){
        // var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
        // this.oRouter.navTo("list", {layout: sNextLayout});
        // var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
        // oRouter.navTo("ItemMaster", {}, true);

        this.bus.publish("flexible", "setMasterPage");
    },

    onCommonParams: function () {

        var template = that.byId("idTempValueJF").getValue(),
            jobName = that.byId("idJobfeedname").getValue();

        if (template !== "" && jobName !== "") {

            // Inputs Visible
            that.byId("MF_LOCATIONJF").setVisible(false);
            that.byId("DM_LOCATIONJF").setVisible(false);
            that.byId("CONFIG_PRODUCTJF").setVisible(false);
            that.byId("PARTIAL_PRODUCTJF").setVisible(false);
            that.byId("MODEL_VERSIONJF").setVisible(false);
            that.byId("PREDICTION_PROFILEJF").setVisible(false);
            that.byId("FORECAST_ALGORITHMJF").setVisible(false);
            that.byId("VERSIONJF").setVisible(false);
            that.byId("SCENARIOJF").setVisible(false);
            that.byId("CLASSJF").setVisible(false);
            that.byId("CUSTOMER_GROUPJF").setVisible(false);
            that.byId("GEN_TYPEJF").setVisible(false);
            that.byId("DATE_RANGEJF").setVisible(false);
            that.byId("SINGLE_DATEJF").setVisible(false);
            that.byId("OPERATORJF").setVisible(false);
            that.byId("idRollingWeeksJF").setVisible(false);
            that.byId("Rolling_TimestampJF").setVisible(false);
            that.byId("OVERRIDE_ASSIGNMENTJF").setVisible(false);
            that.byId("CRITICAL_ASSEMBLYJF").setVisible(false);
            that.byId("IMPACT_ANALYSISJF").setVisible(false);
            that.byId("DAILYJF").setVisible(false);
            that.byId("FULL_RUNJF").setVisible(false);
            that.byId("OptimizationJF").setVisible(false);
            that.byId("POptProfileJF").setVisible(false);
            that.byId("OptProfileJF").setVisible(false);
            // that.byId("OptAlgorithmJF").setVisible(false);
            // that.byId("OptFactorJF").setVisible(false);
            // that.byId("DsAlgorithmJF").setVisible(false);
            that.byId("SnapShotJF").setVisible(false);
            that.byId("SnapRJF").setVisible(false);
            that.byId("snapDescJF").setVisible(false);
            that.byId("HISTORY_WEEKSJF").setVisible(false);

            that.onActivityPress();

            that.byId("MFLInputJF").setValue();
            that.byId("DlocInputJF").setValue();
            that.byId("CprodInputJF").setValue();
            that.byId("PprodInputJF").setValue();
            // that.byId("MODEL_VERSION").setValue();
            that.byId("PrePFInputJF").setValue();
            that.byId("ForeAlgInputJF").setValue();
            that.byId("idverJF").setValue();
            that.byId("idscenJF").setValue();
            that.byId("classInputJF").setValue();
            that.byId("custGrpInputJF").setValue();
            that.byId("FromDateJF").setValue();
            that.byId("ToDateJF").setValue();
            that.byId("singleDtJF").setValue();
            that.byId("idRollingWeeksJF").setValue();
            that.byId("idSnapDescJF").setValue();
            that.byId("idWeeksJF").setValue();
            that.byId("idOverrideJF").setSelected(false);
            that.byId("idCriticalJF").setSelected(false);
            that.byId("idImpactJF").setSelected(false);
            that.byId("idDailyJF").setSelected(false);
            that.byId("idFullRunJF").setSelected(false);
            that.byId("idSnapShotJF").setSelected(false);
            that.byId("idRollingJF").setSelected(false);
            that.byId("PidOptimizationJF").setSelected(false);

            that.byId("CprodInputJF").removeAllTokens();
            that.byId("DlocInputJF").removeAllTokens();
            that.byId("PprodInputJF").removeAllTokens();
            that.byId("MFLInputJF").removeAllTokens();

            //   that.byId("MF_LOCATIONJF").addStyleClass("addBorder");

            //  var params = that.UniParamaters;
            var params = [];
            that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
            var tempData = that.TempParams;
            that.actModel = new JSONModel();
            that.actModel.setData({
                Activityresults: that.TemplateItems
            });
            // if(that.Edit === ""){
            //     // that.actModel.setData({
            //     //     Activityresults: that.TempParams
            //     // });
            //     that.actModel.setData({
            //         Activityresults: that.TemplateItems
            //     });
            // } else {
            //     that.actModel.setData({
            //         Activityresults: that.NewTempParams
            //     });
            // }
            that.byId("idActivityDataJF").setModel(that.actModel);

            var aData = that.ActivityItems;
            var temp = [];
            for (var t = 0; t < that.TemplateItems.length; t++) {

                temp = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === that.TemplateItems[t].ACTIVITY_ID;
                });
                params = params.concat(temp);

            }

            that.params = params;

            function removeDuplicate(array, key) {
                var check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            }
            that.Parameters = removeDuplicate(params, 'PARAMETER_ID');

            that.Parameters.forEach(el => {
                if (el.PARAMETER_ID !== "" && el.PARAMETER_ID !== " " && el.PARAMETER_ID !== undefined && 
                    el.PARAMETER_ID !== null && el.PARAMETER_ID !== "actlevelJF") {
                    var id = el.PARAMETER_ID ;

                    that.byId(id).setVisible(true);

                }
            });

            var tempdata = that.Parameters.filter(el => el.PARAMETER_ID === "CONFIG_PRODUCTJF" ||  el.PARAMETER_ID === "PARTIAL_PRODUCTJF");
                if (tempdata.length > 0) {
                    that.byId("PARTIAL_PRODUCTJF").setVisible(true);
                    that.byId("CONFIG_PRODUCTJF").setVisible(true);
                }
                // var tempdata = that.Parameters.filter(el => el.PARAMETER_ID === "MF_LOCATIONJF" ||  el.PARAMETER_ID === "DM_LOCATIONLF");
                // if (tempdata.length > 0) {
                //     that.byId("MF_LOCATIONJF").setVisible(true);
                //     that.byId("DM_LOCATIONJF").setVisible(true);
                // }

            if (that.byId("DATE_RANGEJF").getVisible()) {
                var newDate = new Date(new Date().getTime() + 104 * 7 * 24 * 60 * 60 * 1000);
                var fromDate = new Date().toISOString().split("T")[0];
                var toDate = newDate.toISOString().split("T")[0];

                that.byId("FromDateJF").setValue(fromDate);
                that.byId("ToDateJF").setValue(toDate);

            }

            if (that.byId("VERSIONJF").getVisible()) {
                for (var i = 0; i < that.DefaultVersce.length; i++) {
                    if (that.DefaultVersce[i].PARAMETER_ID === 20) {
                        that.byId("idverJF").setValue(that.DefaultVersce[i].VALUE);
                    } else {
                        that.byId("idscenJF").setValue(that.DefaultVersce[i].VALUE);
                    }
                }

            }
            // that.byId("CONFIG_PRODUCTJF").setVisible(false);
            that.oGModel.setProperty("/CommonParam", "X");
            if(that.Edit === ""){
                that.setObjData();
            }
            // this._CommonParamsDialog.open();

        } else {
            sap.m.MessageToast.show("Please maintain Template and Job Name");
            that.oGModel.setProperty("/CommonParam", "");
        }

    },
    setObjData:function(){


        var obj = {
            MF_LOCATION_ID: [],
            LOCATION_ID: [],
            PRODUCT_ID: [],
            CONFIG_PRODUCT: [],
            PREDICTION_PROFILE: "",
            FORECAST_ALGORITHM : "",
            VERSION: "",
            SCENARIO: "",
            CUSTOMER_GROUP: "",
            CLASS: "",
            CRITICAL_ASSEMBLY: "",
            IMPACT_ANALYSIS: "",
            DAILY: "",
            FULL_RUN: "",
            OVERRIDE_ASSIGNMENT: "",
            GEN_TYPE: "",
            MODEL_VERSION: "",
            FROM_DATE: "",
            TO_DATE: "",
            OPERATOR: "",
            SINGLE_DATE: "",
            Rolling: "",
            Rolling_Timestamp: "",
            DsAlgorithm: "",
            OptFactor: "",
            OptAlgorithm: "",
            SnapShot: "",
            SnapShot_Desc: "",
            HISTORY_WEEKS: ""
        }

        that.JobData = that.TempParams;
        // that.TempParams =[];
        

        for (var i = 0; i < that.JobData.length; i++) {

            Object.entries(that.JobData[i]).forEach(x => {
                var test = x[0];

                if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID" && x[0] !== "ACT_POSITION" && x[0] !== "actlevel") {

                        if(x[0] === "MF_LOCATION_ID" || x[0] === "LOCATION_ID" || x[0] === "PRODUCT_ID" || x[0] === "CONFIG_PRODUCT"){
                            if (x[0] === "MF_LOCATION_ID") {
                                x[1] = x[1].includes(",") === true ? x[1].split(",") : x[1];
                            }
                            if (x[0] === "LOCATION_ID") {
                                x[1] = x[1].includes(",") === true ? x[1].split(",") : x[1];
                            }
                            if (x[0] === "CONFIG_PRODUCT") {
                                x[1] = x[1].includes(",") === true ? x[1].split(",") : x[1];
                            }
                            if(x[1].length > 0 || x[1] !== ""){
                                if(x[0] === "PRODUCT_ID"){
                                    x[1] = x[1].includes(",") === true ? x[1].split(","): x[1];
                                }
                                obj[test] = obj[test].concat(x[1]);
                            }
                        } else {
                            obj[test] = x[1];
                        }
                    
                }
            })
        }


        obj.MF_LOCATION_ID =[...new Set(obj.MF_LOCATION_ID.filter(item => item !== ""))];
        obj.LOCATION_ID = [...new Set(obj.LOCATION_ID.filter(item => item !== ""))];
        // obj.REF_PRODID = [...new Set(obj.REF_PRODID)];
        obj.PRODUCT_ID = [...new Set(obj.PRODUCT_ID.filter(item => item !== ""))];
        var data =[];
        obj.PARTIAL_PRODUCT = obj.PRODUCT_ID;

        obj.PRODUCT_ID.forEach(function(el){
            var data = that.ConfProdall.filter(e=> e.PRODUCT_ID === el);
            obj.CONFIG_PRODUCT.push(data[0].REF_PRODID);
            // data.push({REF_PRODID:that.ConfProdall.find(o => o.PRODUCT_ID === el)?.REF_PRODID});

        });
        obj.CONFIG_PRODUCT = [...new Set(obj.CONFIG_PRODUCT.filter(item => item !== ""))];

        // that.TempParams.forEach(function(el){
        //     var test = el.PARAMETER_ID;
        //     obj[test] = el.VALUE;

        // });
        // obj.MF_LOCATION_ID = [...new Set(obj.MF_LOCATION_ID)];
        // obj.LOCATION_ID = [...new Set(obj.LOCATION_ID)];
        // obj.CONFIG_PRODUCT = [...new Set(obj.CONFIG_PRODUCT)];
        // obj.PARTIAL_PRODUCT = [...new Set(obj.PARTIAL_PRODUCT)];

        that.setValues(obj);

        if (that.byId("DATE_RANGEJF").getVisible()) {
            var newDate = new Date(new Date().getTime() + 104 * 7 * 24 * 60 * 60 * 1000);
            var fromDate = new Date().toISOString().split("T")[0];
            var toDate = newDate.toISOString().split("T")[0];

            that.byId("FromDateJF").setValue(fromDate);
            that.byId("ToDateJF").setValue(toDate);
            that.byId("FromDateJF").setMinDate(new Date());
            that.byId("ToDateJF").setMinDate(new Date(fromDate));

        }

    },

    CommonFilEdit: function () {
        var data = that.oGModel.getProperty("/editData");

        that.byId("idTempValueJF").setValue(that.EditData.TEMPLATE_ID);
        // that.byId("idJobfeedname").setValue(that.EditData.VARIANT_NAME);
        // that.onJobnamevalidation();

        that.MaxStep = that.TemplateItems.length;
        that.onSelTemp();
        // that.onRecurrence();


        var obj = {
            MF_LOCATION_ID: [],
            LOCATION_ID: [],
            PRODUCT_ID: [],
            CONFIG_PRODUCT: [],
            PREDICTION_PROFILE: "",
            FORECAST_ALGORITHM: "",
            VERSION: "",
            SCENARIO: "",
            CUSTOMER_GROUP: "",
            CLASS: "",
            CRITICAL_ASSEMBLY: "",
            IMPACT_ANALYSIS: "",
            DAILY: "",
            FULL_RUN: "",
            OVERRIDE_ASSIGNMENT: "",
            GEN_TYPE: "",
            MODEL_VERSION: "",
            FROM_DATE: "",
            TO_DATE: "",
            OPERATOR: "",
            SINGLE_DATE: "",
            Rolling: "",
            Rolling_Timestamp: "",
            DsAlgorithm: "",
            OptFactor: "",
            OptAlgorithm: "",
            SnapShot: "",
            SnapShot_Desc: "",
            HISTORY_WEEKS: ""
        }

        var parameters = [];
        var UniparamData = [];
        that.NewTempParams = that.TemplateItems;
        // that.JobData = that.JobData.sort((a, b) => a.STEP - b.STEP);
        var tempData = [];

        // for (var i = 0; i < that.JobData.length; i++) {

        //     var data = JSON.parse(that.JobData[i].PARAM_VALUE);
        //     // if(data.length !== undefined){

        //     if (that.JobData[i].PARAM_VALUE !== "{}") {
        //         var paramObj = {
        //             "TEMPLATE_ID": that.JobData[i].TEMPLATE_ID,
        //             "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID,
        //             "STEP": that.JobData[i].STEP,
        //             "ACT_POSITION": that.JobData[i].STEP
        //         }

        //         Object.entries(data).forEach(x => {
        //                 var test = x[0];

        //                 if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID") {
        //                     var tempobj = {
        //                         [test]: x[1]
        //                     }
        //                     if (x[0] === "MF_LOCATION_ID" || x[0] === "LOCATION_ID" || x[0] === "PRODUCT_ID") {
        //                         var index = obj[test].findIndex(el => el === x[1]);
        //                         if (index === -1) {
        //                             obj[test] = obj[test].concat(x[1]);
        //                         }
        //                     } else {

        //                         obj[test] = x[1];
        //                     }
        //                 }
        //                 paramObj = {
        //                     ...paramObj,
        //                     ...tempobj
        //                 }

        //             })
        //             // that.TempParams.push(paramObj);
        //         tempData.push(paramObj);
        //     } else {
        //         var paramObj = {
        //                 "TEMPLATE_ID": that.JobData[i].TEMPLATE_ID,
        //                 "ACTIVITY_ID": that.JobData[i].ACTIVITY_ID
        //             }
        //             // that.TempParams.push(paramObj);
        //         tempData.push(paramObj);
        //     }

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === that.JobData[i].ACTIVITY_ID);

            // if (index === -1) {
            //     that.TempParams.push(tempData[i]);
            // }

        // }

        // that.ParametersData.forEach(function(el){
        //     Object.entries(el).forEach(x => {
        //         var test = x[0];
        //         if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID" && x[0] !== "ACT_POSITION") {
        //             // var tempobj = {
        //             //                 [test]: x[1]
        //             //             }
        //             obj[test] =  x[1];
        //         }
        //         })
        // })

        that.ParametersData.forEach(function(el){
            var test = el.PARAMETER_ID;
            obj[test] = el.VALUE;

        })

        // obj.MF_LOCATION_ID = obj.MF_LOCATION_ID.split(",");
        // obj.LOCATION_ID = obj.LOCATION_ID.split(",");
        // obj.CONFIG_PRODUCT = obj.CONFIG_PRODUCT.split(",");
        // obj.PRODUCT_ID = obj.PRODUCT_ID.split(",");

        obj.MF_LOCATION_ID = [...new Set(obj.MF_LOCATION_ID)];
        obj.LOCATION_ID = [...new Set(obj.LOCATION_ID)];
        obj.CONFIG_PRODUCT = [...new Set(obj.CONFIG_PRODUCT)];
        obj.PARTIAL_PRODUCT = [...new Set(obj.PARTIAL_PRODUCT)];

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

    setValues: function (obj) {
        var core = that;


        var aLoc = [];
        var aCProd = [];
        var aPprod = [];
        // for(var a=0; a<obj.MF_LOCATION_ID.length; a++){

        //     for(var b=0;b<obj.LOCATION_ID.length; b++){
        //         var obj1 = {
        //             mf:obj.MF_LOCATION_ID[a],
        //             loc: obj.LOCATION_ID[b]
        //         }
        //         aLoc.push(obj1);
        //         for(var c=0; c<obj.CONFIG_PRODUCT.length; c++){
        //             var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === obj.MF_LOCATION_ID[a] && 
        //                                             el.DEMAND_LOC === obj.LOCATION_ID[b] && el.REF_PRODID === el.PRODUCT_ID);
        //         if(data.length > 0){

                
        //             var obj2 ={
        //                 mf:obj.MF_LOCATION_ID[a],
        //                 loc:obj.LOCATION_ID[b],
        //                 cProd :obj.CONFIG_PRODUCT[c]
        //             }

        //             aCProd.push(obj2);
        //         }
                    
        //             for(var d = 0; d<obj.PARTIAL_PRODUCT.length; d++){
        //                 var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === obj.MF_LOCATION_ID[a] && 
        //                                         el.DEMAND_LOC === obj.LOCATION_ID[b] && el.REF_PRODID !== el.PRODUCT_ID);
        //                     for(var z=0; z<data.length; z++){
        //                     var obj3 ={
        //                         mf:obj.MF_LOCATION_ID[a],
        //                         loc:obj.LOCATION_ID[b],
        //                         cProd :obj.CONFIG_PRODUCT[c],
        //                         pProd : data[z].PRODUCT_ID
        //                     }

        //                     aPprod.push(obj3);
        //                 }

        //             }

        //         }

        //     }

        // }

        function removeDuplicate(array, key) {
            var check = new Set();
            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
        }

        if (that.byId("MF_LOCATIONJF").getVisible()) {
            obj.MF_LOCATION_ID.forEach(function (oItem, i) {
                that.byId("MFLInputJF").addToken(
                    new sap.m.Token({
                        key: oItem,
                        text: oItem,
                        editable: false,

                    })
                );

            });
        }


        var tempLocData = [];
        that.mfData = obj.MF_LOCATION_ID;
        that.locData = obj.LOCATION_ID;
        for(var l=0; l<that.locData.length; l++){

            for(var m=0; m<that.mfData.length; m++){
                var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === that.mfData[m] && 
                                                    el.DEMAND_LOC === that.locData[l]);
                if(data.length > 0){
                    that.byId("DlocInputJF").addToken(
                        new sap.m.Token({
                            key: that.mfData[m],
                            text: that.locData[l],
                            editable: false,

                        })
                    );
                    var newobj = {
                        mfloc : that.mfData[m],
                        loc : that.locData[l]
                    }
                    tempLocData.push(newobj);
                }

            }

        }





        // for(var m=0; m<obj.MF_LOCATION_ID.length; m++){
        //     that.mf = obj.MF_LOCATION_ID[m];
        //     obj.LOCATION_ID.forEach(function (oItem, i,) {
        //         var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === that.mf && 
        //                                              el.DEMAND_LOC === oItem);

        //             if(data.length > 0){
        //                 that.byId("DlocInputJF").addToken(
        //                     new sap.m.Token({
        //                         key: data[0].FACTORY_LOC,
        //                         text: oItem,
        //                         editable: false,

        //                     })
        //                 );
        //                 var obj = {
        //                     mfloc : data[0].FACTORY_LOC,
        //                     loc : oItem
        //                 }
        //                 tempLocData.push(obj);
        //             }

        //             });
                
        // }
        


        // if (that.byId("DM_LOCATIONJF").getVisible()) {
        //     obj.LOCATION_ID.forEach(function (oItem, i) {
        //         that.byId("DlocInputJF").addToken(
        //             new sap.m.Token({
        //                 key: oItem,
        //                 text: oItem,
        //                 editable: false,

        //             })
        //         );

        //     });

        // }

        var tempCprodData = [];
        that.cProdData = obj.CONFIG_PRODUCT;
        for(var l=0; l<that.cProdData.length; l++){

            for(var m=0; m<tempLocData.length; m++){
                var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === tempLocData[m].mfloc && 
                                                    el.DEMAND_LOC === tempLocData[m].loc && el.PRODUCT_ID === that.cProdData[l]);
                if(data.length > 0){
                    
                    var newobj1 = {
                        mfloc : tempLocData[m].mfloc,
                        loc : tempLocData[m].loc,
                        cProd: that.cProdData[l]
                    }
                    tempCprodData.push(newobj1);
                }

            }

        }

                    
         var temp = removeDuplicate(tempCprodData, 'cProd');

        for(var t=0; t<temp.length; t++){
            that.byId("CprodInputJF").addToken(
                new sap.m.Token({
                    key: temp[t].loc,
                    text: temp[t].cProd,
                    editable: false,

                })
            );
        }


        // for(var d=0; d<tempLocData.length; d++){
        //     that.mf = tempLocData[d].mfloc;
        //     that.loc = tempLocData[d].loc
        //     var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === that.mf && 
        //                                         el.DEMAND_LOC === that.loc && el.PRODUCT_ID === el.REF_PRODID);

        //             obj.CONFIG_PRODUCT.forEach(function (oItem, i) {
        //             that.byId("CprodInputJF").addToken(
        //                 new sap.m.Token({
        //                     key: data[0].DEMAND_LOC,
        //                     text: oItem,
        //                     editable: false,

        //                 })
        //             );

        //         });
        // }

        // if (that.byId("CONFIG_PRODUCTJF").getVisible()) {
        //     obj.CONFIG_PRODUCT.forEach(function (oItem, i) {
        //         that.byId("CprodInputJF").addToken(
        //             new sap.m.Token({
        //                 key: oItem,
        //                 text: oItem,
        //                 editable: false,

        //             })
        //         );

        //     });

        // }

        var tempPprodData = [];
        that.pProdData = obj.PARTIAL_PRODUCT;
        for(var l=0; l<that.pProdData.length; l++){

            for(var m=0; m<tempCprodData.length; m++){
                var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === tempCprodData[m].mfloc && 
                                                    el.DEMAND_LOC === tempCprodData[m].loc && el.REF_PRODID === tempCprodData[m].cProd);
                if(data.length > 0){
                    
                    var newobj1 = {
                        mfloc : tempCprodData[m].mfloc,
                        loc : tempCprodData[m].loc,
                        cProd: tempCprodData[m].cProd,
                        pProd: that.pProdData[l]
                    }
                    tempPprodData.push(newobj1);
                }

            }

        }

        var temp = removeDuplicate(tempPprodData, 'pProd');

        for(var t=0; t<temp.length; t++){
            if(temp[t].pProd !== ""){
            that.byId("PprodInputJF").addToken(
                new sap.m.Token({
                    key: temp[t].cProd,
                    text: temp[t].pProd,
                    editable: false,

                })
            );
        }
        }


        // if (that.byId("PARTIAL_PRODUCTJF").getVisible()) {
        //     obj.PARTIAL_PRODUCT.forEach(function (oItem, i) {
        //         that.byId("PprodInputJF").addToken(
        //             new sap.m.Token({
        //                 key: oItem,
        //                 text: oItem,
        //                 editable: false,

        //             })
        //         );

        //     });

        // }

        that.byId("PrePFInputJF").setValue(obj.PREDICTION_PROFILE);
        that.byId("ForeAlgInputJF").setValue(obj.FORECAST_ALGORITHM);
        that.byId("idverJF").setValue(obj.VERSION);
        that.byId("idscenJF").setValue(obj.SCENARIO);
        that.byId("classInputJF").setValue(obj.CLASS);
        that.byId("custGrpInputJF").setValue(obj.CUSTOMER_GROUP);
        that.byId("FromDateJF").setValue(obj.FROM_DATE);
        that.byId("ToDateJF").setValue(obj.TO_DATE);
        that.byId("singleDtJF").setValue(obj.SINGLE_DATE);
        that.byId("idRollingWeeksJF").setValue(obj.Rolling_Timestamp);
        that.byId("idWeeksJF").setValue(obj.HISTORY_WEEKS);
        if (obj.CRITICAL_ASSEMBLY === "X" || obj.CRITICAL_ASSEMBLY === "true" || obj.CRITICAL_ASSEMBLY === true) {
            that.byId("idCriticalJF").setSelected(true);
        } else {
            that.byId("idCriticalJF").setSelected(false);
        }
        if(obj.OVERRIDE_ASSIGNMENT === true || obj.OVERRIDE_ASSIGNMENT === "true"){
            that.byId("idOverrideJF").setSelected(true);
        } else {
            that.byId("idOverrideJF").setSelected(false);
        }
        if(obj.IMPACT_ANALYSIS === true || obj.IMPACT_ANALYSIS === "true"){
            that.byId("idImpactJF").setSelected(true);
        } else {
            that.byId("idImpactJF").setSelected(false);
        }
        if(obj.DAILY === true || obj.DAILY === "true"){
            that.byId("idDailyJF").setSelected(true);
        } else {
            that.byId("idDailyJF").setSelected(false);
        }
        if(obj.FULL_RUN === true || obj.FULL_RUN === "true"){
            that.byId("idFullRunJF").setSelected(true);
        } else {
            that.byId("idFullRunJF").setSelected(false);
        }
        
        if (obj.SnapShot === "true" || obj.SnapShot === true) {
            obj.SnapShot = true;
        } else {
            obj.SnapShot = false;
        }
        if (obj.Rolling === true || obj.Rolling === "true") {
            obj.Rolling = true;
            that.byId("idRollingWeeksJF").setVisible(true);
            that.byId("FromDateJF").setEditable(false);
                that.byId("ToDateJF").setEditable(false);
        } else {
            obj.Rolling = false;
        }
        that.byId("idSnapShotJF").setSelected(obj.SnapShot);
        that.byId("idSnapDescJF").setValue(obj.SnapShot_Desc);
        that.byId("idRollingJF").setSelected(obj.Rolling);

        that.byId("idOperatorJF").setSelectedKey(obj.OPERATOR);
        that.byId("idModelVerJF").setSelectedKey(obj.MODEL_VERSION);
        that.byId("GenidTypeJF").setSelectedKey(obj.GEN_TYPE);
        // that.byId("PidDSAlgJF").setSelectedKey(obj.DsAlgorithm);
        // that.byId("PidOptFctJF").setSelectedKey(obj.OptFactor);
        // that.byId("PidOptAlgJF").setSelectedKey(obj.OptAlgorithm);
        if (obj.Optimization === true || obj.Optimization === "true") {
                    that.byId("PidOptimizationJF").setSelected(true);
                    that.byId("PidOptProfileJF").setEnabled(true);
                } else {
                    that.byId("PidOptimizationJF").setSelected(false);
                    that.byId("PidOptProfileJF").setEnabled(false);
                }
                that.byId("PidOptProfileJF").setSelectedKey(obj.POptProfile);
                that.byId("idOptProfileJF").setSelectedKey(obj.OptProfile);

    },

    // Highlighting the inputs on selection of step.
    onActivityPress: function (oEvent) {
        var params = [];
        if (oEvent) {
            var selected = that.byId("idActivityDataJF").getSelectedItems()[0].getCells()[0].getText().split(".")[1].trim();
            params = that.params.filter(el => el.ACTIVITY_ID === selected);
        }

        that.byId("MF_LOCATIONJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("DM_LOCATIONJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("CONFIG_PRODUCTJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("PARTIAL_PRODUCTJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("MODEL_VERSIONJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("PREDICTION_PROFILEJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("FORECAST_ALGORITHMJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("VERSIONJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("SCENARIOJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("CLASSJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("CUSTOMER_GROUPJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("GEN_TYPEJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("DATE_RANGEJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("SINGLE_DATEJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("OPERATORJF").getLabelControl().removeStyleClass("addBorder");
        //   that.byId("idRollingWeeksJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("Rolling_TimestampJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("OVERRIDE_ASSIGNMENTJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("CRITICAL_ASSEMBLYJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("IMPACT_ANALYSISJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("DAILYJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("FULL_RUNJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("OptimizationJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("POptProfileJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("OptProfileJF").getLabelControl().removeStyleClass("addBorder");
        // that.byId("OptAlgorithmJF").getLabelControl().removeStyleClass("addBorder");
        // that.byId("OptFactorJF").getLabelControl().removeStyleClass("addBorder");
        // that.byId("DsAlgorithmJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("SnapShotJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("SnapRJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("snapDescJF").getLabelControl().removeStyleClass("addBorder");
        that.byId("HISTORY_WEEKSJF").getLabelControl().removeStyleClass("addBorder");

        for (var i = 0; i < params.length; i++) {

            switch (params[i].PARAMETER_ID) {
            case "MF_LOCATIONJF":
                that.byId("MF_LOCATIONJF").getLabelControl().addStyleClass("addBorder");
                that.byId("DM_LOCATIONJF").getLabelControl().addStyleClass("addBorder");
                break;
                break;
            case "DM_LOCATIONJF":
                that.byId("MF_LOCATIONJF").getLabelControl().addStyleClass("addBorder");
                that.byId("DM_LOCATIONJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "CONFIG_PRODUCTJF":
            case "PARTIAL_PRODUCTJF":
                that.byId("CONFIG_PRODUCTJF").getLabelControl().addStyleClass("addBorder");
                that.byId("PARTIAL_PRODUCTJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "MODEL_VERSIONJF":
                that.byId("MODEL_VERSIONJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "PREDICTION_PROFILEJF":
                that.byId("PREDICTION_PROFILEJF").getLabelControl().addStyleClass("addBorder");
                break;
                case "FORECAST_ALGORITHMJF":
                    that.byId("FORECAST_ALGORITHMJF").getLabelControl().addStyleClass("addBorder");
                    break;
            case "VERSIONJF":
                that.byId("VERSIONJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "SCENARIOJF":
                that.byId("SCENARIOJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "CLASSJF":
                that.byId("CLASSJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "CUSTOMER_GROUPJF":
                that.byId("CUSTOMER_GROUPJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "GEN_TYPEJF":
                that.byId("GEN_TYPEJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "DATE_RANGEJF":
                that.byId("DATE_RANGEJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "OPERATORJF":
                that.byId("OPERATORJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "Rolling_TimestampJF":
                that.byId("Rolling_TimestampJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "OVERRIDE_ASSIGNMENTJF":
                that.byId("OVERRIDE_ASSIGNMENTJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "CRITICAL_ASSEMBLYJF":
                that.byId("CRITICAL_ASSEMBLYJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "IMPACT_ANALYSISJF":
                that.byId("IMPACT_ANALYSISJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "DAILYJF":
                that.byId("DAILYJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "FULL_RUNJF":
                that.byId("FULL_RUNJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "Optimization":
                that.byId("OptimizationJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "POptProfile":
                that.byId("POptProfileJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "OptProfile":
                that.byId("OptProfileJF").getLabelControl().addStyleClass("addBorder");
                break;
            // case "OptAlgorithmJF":
            //     that.byId("OptAlgorithmJF").getLabelControl().addStyleClass("addBorder");
            //     break;
            // case "OptFactorJF":
            //     that.byId("OptFactorJF").getLabelControl().addStyleClass("addBorder");
            //     break;
            // case "DsAlgorithmJF":
            //     that.byId("DsAlgorithmJF").getLabelControl().addStyleClass("addBorder");
            //     break;
            case "SnapShotJF":
                that.byId("SnapShotJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "SnapRJF":
                that.byId("SnapRJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "snapDescJF":
                that.byId("snapDescJF").getLabelControl().addStyleClass("addBorder");
                break;
            case "HISTORY_WEEKSJF":
                that.byId("HISTORY_WEEKSJF").getLabelControl().addStyleClass("addBorder");
                break;
            }
        }

    },


    // Generating the steps based on parameters selectuion
    generateJobData: function (oEvent) {
        var aDataCheck = [];
        var predPr = that.byId("PREDICTION_PROFILEJF").getVisible(),
        foralgo = that.byId("FORECAST_ALGORITHMJF").getVisible(),
            ver = that.byId("VERSIONJF").getVisible(),
            sce = that.byId("SCENARIOJF").getVisible();
        // var hWeeks = that.byId("HISTORY_WEEKSJF").getVisible();
        that.saveData = oEvent.getParameter("id");
      
        var paramFlag = "";
        if (predPr === true && that.byId("PrePFInputJF").getValue() === "") {
            paramFlag = "X";
        }
        // if (foralgo === true && that.byId("ForeAlgInputJF").getValue() === "") {
        //     paramFlag = "X";
        // }
        if (ver === true && that.byId("idverJF").getValue() === "") {
            paramFlag = "X";
        }
        if (sce === true && that.byId("idscenJF").getValue() === "") {
            paramFlag = "X";
        }
        // if (hWeeks === true) {
        // var value = that.byId("idWeeksJF").getValue();

        //     if(value <= 0){
        //         paramFlag = "X";
        //     } else if(value > 156){
        //         paramFlag = "X";
        //     }
        // }

        if (paramFlag === "") {
            var tempData = that.TempParams;

            var aData = that.ActivityItems;
            var temp = [];
            var temp = [];
            var s4string = "";
            var string = "";
            var array = [];
            for (var t = 0; t < that.TemplateItems.length; t++) {
                var act = that.TemplateItems[t].ACTIVITY_ID;
                if (act.includes("IMPORT_S4")) {
                    if (s4string !== "") {
                        s4string = s4string + "," + act;
                    } else {
                        s4string = act;
                    }
                } else {
                    temp.push(act);
                }
            }
            if (s4string !== "") {
                array.push(s4string);
            }
            var exportIndex = "";
            var verIndex = "";
            for (var t = 0; t < temp.length; t++) {
                var act = temp[t];
                if (t === temp.length - 1) {
                    var next = "";
                } else {
                    var next = temp[t + 1];

                }
                if (t === 0) {
                    string = act;
                    if (act === "IMPORT_VERSION_SCENARIO" || act === "PURGE_ALERTS_DATA") {
                        // string = act;
                        array.push(string);
                        string = "";
                    } else if (act === "EXPORT_IBP_CLASS" || act === "EXPORT_IBP_CUSTOMERGROUP" ||
                        act === "EXPORT_IBP_LOCATION" || act === "EXPORT_IBP_PRODUCT") {
                            exportIndex = array.length;
                                // array[exportIndex] = string;
                                array.push(string);
                                string = "";
                    } else {
                        // string = act;

                        if (next === "IMPORT_VERSION_SCENARIO") {
                            array.push(string);
                            string = "";
                        } else if (next === "EXPORT_IBP_CLASS" || next === "EXPORT_IBP_CUSTOMERGROUP" ||
                            next === "EXPORT_IBP_LOCATION" || next === "EXPORT_IBP_PRODUCT") {
                            if (exportIndex === "") {
                                array.push(string);
                                string = "";
                                exportIndex = array.length;
                            } else {
                                if (array[exportIndex] === undefined) {
                                    array[exportIndex] = string;
                                } else {
                                    array[exportIndex] = array[exportIndex] + "," + string;
                                }
                                string = "";
                            }
                        } else if (next === "") {
                            array.push(string);
                            string = "";
                        }
                    }

                } else {

                    if (string !== "") {
                        string = string + "," + act;
                    } else {
                        string = act;
                    }

                    if (next === "IMPORT_VERSION_SCENARIO" || act === "IMPORT_VERSION_SCENARIO") {
                        if (verIndex === "") {
                            if (exportIndex === "") {
                                array.push(string);
                            } else {
                                if (array[exportIndex] === undefined) {
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
                    } else if (next === "EXPORT_IBP_CLASS" || next === "EXPORT_IBP_CUSTOMERGROUP" ||
                        next === "EXPORT_IBP_LOCATION" || next === "EXPORT_IBP_PRODUCT" || 
                        act === "EXPORT_IBP_CLASS" || act === "EXPORT_IBP_CUSTOMERGROUP" ||
                        act === "EXPORT_IBP_LOCATION" || act === "EXPORT_IBP_PRODUCT") {
                        if (exportIndex === "") {
                            array.push(string);
                            string = "";
                            exportIndex = array.length;
                        } else {
                            if (array[exportIndex] === undefined) {
                                array[exportIndex] = string;
                            } else {
                                array[exportIndex] = array[exportIndex] + "," + string;
                            }
                            string = "";
                        }
                    } else if (next === "") {
                        array.push(string);
                        string = "";
                    }
                }

            }

            console.log(array);

            that.oGModel.setProperty("/tempDetails", array);

            var core = that;
            var manuLocation = [];
            var demandLocation = [];
            var ConfProd = [];
            var product = [];
            // var demandLocation = core.byId("DlocInputU").getTokens();
            // var product = core.byId("CprodInputU").getTokens();

                       var isVisible = that.byId("DM_LOCATIONJF").getVisible();
                       var hasTokens = core.byId("DlocInputJF").getTokens().length > 0;
                       var isVisibleP = that.byId("CONFIG_PRODUCTJF").getVisible();
                       var hasTokensP = core.byId("CprodInputJF").getTokens().length > 0;
                       var isVisiblePa = that.byId("PARTIAL_PRODUCTJF").getVisible();
                       var hasTokensPa = core.byId("PprodInputJF").getTokens().length > 0;
                       
                       var ManuFlag = core.byId("MFLInputJF").getTokens().length > 0 ? "": "X";
                       var DemandFlag = isVisible ? "" : hasTokens ? "X" : "";
                       var ConProdFlag = (isVisibleP && hasTokensP) ? "" : "X";
                       var ParProdFlag = (isVisiblePa && hasTokensPa) ? "" : "X";

            // Manufacturing Locations
            if(that.byId("MF_LOCATIONJF").getVisible() === true){
            if (core.byId("MFLInputJF").getTokens().length > 0) {
                var maloc = core.byId("MFLInputJF").getTokens();
                for (var i = 0; i < maloc.length; i++) {
                    var obj = {
                        FACTORY_LOC: maloc[i].getText()
                    };
                    manuLocation.push(obj);
                }

            } else {
                 manuLocation = that.MFLocDataUni;
            }
        }

            that.oGModel.setProperty("/manuLocation", manuLocation);

            // Demand Locations
            if(that.byId("DM_LOCATIONJF").getVisible() === true){
            if (core.byId("DlocInputJF").getTokens().length > 0) {
                var deLoc = core.byId("DlocInputJF").getTokens();
                for (var i = 0; i < deLoc.length; i++) {
                    var obj = {
                        FACTORY_LOC: deLoc[i].getKey(),
                        DEMAND_LOC: deLoc[i].getText(),

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
                  demandLocation = removeDuplicate(dloc, 'DEMAND_LOC');
                // var demandLocation = dloc;
            }

            if(ManuFlag == "X"){
                            var MFDataTemp = [];
                            manuLocation.forEach(el=> {
                                var index = demandLocation.findIndex(e=> e.FACTORY_LOC === el.FACTORY_LOC);
                                if(index !== -1){
                                    var obj = {
                                        FACTORY_LOC: el.FACTORY_LOC
                                    };
                                    MFDataTemp.push(obj);
                                }
                            })
                            manuLocation = MFDataTemp;
                        }
    
                        if(DemandFlag == "X"){
                            var MFDataTemp = [];
                            manuLocation.forEach(el=> {
                                var index = demandLocation.findIndex(e=> e.FACTORY_LOC === el.FACTORY_LOC);
                                if(index !== -1){
                                    var obj = {
                                        FACTORY_LOC: el.FACTORY_LOC
                                    };
                                    MFDataTemp.push(obj);
                                }
                            })
                            manuLocation = MFDataTemp;
                            
                            
                        }
        }

            that.oGModel.setProperty("/demandLocation", demandLocation);

            // Conf Products
            if(that.byId("CONFIG_PRODUCTJF").getVisible() === true){
            if (core.byId("CprodInputJF").getTokens().length > 0) {
                var pro = core.byId("CprodInputJF").getTokens();
                var tempDataCP = [];

                for (var i = 0; i < pro.length; i++) {
                                var d = that.TotalDataUni.filter(el=> el.REF_PRODID === pro[i].getText() && el.REF_PRODID === el.PRODUCT_ID);
                                if(d.length > 0){
                               if (that.byId("DM_LOCATIONU").getVisible() === false) {
                                        var obj = {
                                            FACTORY_LOC: d[0].FACTORY_LOC,
                                            DEMAND_LOC: d[0].DEMAND_LOC,
                                            REF_PRODID: d[0].REF_PRODID
                                        };
                                    } else {
                                        var obj = {
                                            DEMAND_LOC: d[0].DEMAND_LOC,
                                            REF_PRODID: d[0].REF_PRODID
                                        };
                                    }
                                ConfProd.push(obj);
                            }
                            }
                //         for (var i = 0; i < pro.length; i++) {
                //             var d = that.TotalDataUni.filter(el=> el.REF_PRODID === pro[0].getText() && el.REF_PRODID === el.PRODUCT_ID);

                //             tempDataCP = tempDataCP.concat(d);
                //         }


                //         for (var i = 0; i < tempDataCP.length; i++) {
                //             var obj = {
                //                 DEMAND_LOC: tempDataCP[i].DEMAND_LOC,
                //                 REF_PRODID: tempDataCP[i].REF_PRODID
                //             };
                //             ConfProd.push(obj);
                //             // demandLocation.forEach(function(el){

                //             // })

                //             }
                // // for (var i = 0; i < pro.length; i++) {
                // //     var obj = {
                // //         DEMAND_LOC: pro[i].getKey(),
                // //         REF_PRODID: pro[i].getText()
                // //     };
                // //     ConfProd.push(obj);
                // // }
                if (that.byId("DM_LOCATIONJF").getVisible() === true) {
                var prod = that.TotalDataUni;
                var temparay=[];
                for (var i = 0; i < demandLocation.length; i++) {
                    var index = ConfProd.findIndex(el => el.DEMAND_LOC === demandLocation[i].DEMAND_LOC);
                    if (index === -1) {
                        var obj = {
                            DEMAND_LOC :demandLocation[i].DEMAND_LOC
                        }
                        temparay.push(obj);
                }
                if(temparay.length > 0){
                    for (var i = 0; i < temparay.length; i++) {
                        var index = demandLocation.findIndex(el=> el.DEMAND_LOC === temparay[i].DEMAND_LOC);
                        demandLocation.splice(index, 1);
                    }
                }

                if(demandLocation.length > 0){
                                    var idsInArray1 = demandLocation.map(item => item.FACTORY_LOC);                            
                                    manuLocation = demandLocation.filter(item => idsInArray1.includes(item.FACTORY_LOC));                                    
                                     manuLocation = manuLocation.map(item => ({ FACTORY_LOC: item.FACTORY_LOC }));
                                }
                if(demandLocation.length == 0){                                    
                                    manuLocation = [];
                                }
            }
            //     for(var i=0; i<demandLocation.length; i++){
            //         var index = ConfProd.findIndex(el=> el.DEMAND_LOC === demandLocation[i].DEMAND_LOC);
            //         if(index === -1){
            //             var data = that.TotalDataUni.filter(el=> el.DEMAND_LOC ===demandLocation[i].DEMAND_LOC &&
            //                                                     el.FACTORY_LOC === demandLocation[i].FACTORY_LOC &&
            //                                                     el.REF_PRODID === el.PRODUCT_ID );
            //                 if(data.length > 0){
            //                     for (var i = 0; i < data.length; i++) {
            //                         var obj = {
            //                             DEMAND_LOC: data[i].DEMAND_LOC,
            //                             REF_PRODID: data[i].REF_PRODID
            //                         };
            //                         ConfProd.push(obj);
            //                     }
            //                 }
            //         }
            //     }
            // }

            //     // var data = that.TotalDataUni.filter(el=> el.DEMAND_LOC ===demandLocation[i].DEMAND_LOC &&
            //     //     el.FACTORY_LOC === demandLocation[i].FACTORY_LOC &&
            //     //     el.REF_PRODID === el.PRODUCT_ID )

            } else {

                // var prod = that.TotalDataUni;
                // var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);
                // var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                // prod = prod.filter(item => idsInArray1.includes(item.FACTORY_LOC));
                // prod = prod.filter(item => idsInArray.includes(item.DEMAND_LOC));

                // ConfProd = prod.filter((value, index, self) => 
                //     index === self.findIndex((obj) => obj.DEMAND_LOC === value.DEMAND_LOC && 
                //                                 obj.REF_PRODID === value.REF_PRODID)
                //   );
                var prod = that.TotalDataUni;
                            if(that.byId("MF_LOCATIONJF").getVisible() === true && that.byId("DM_LOCATIONJF").getVisible() === true){
                            var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);                            
                            prod = prod.filter(item => idsInArray1.includes(item.FACTORY_LOC));
                            var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                            prod = prod.filter(item => idsInArray.includes(item.DEMAND_LOC));

                            ConfProd = prod.filter((value, index, self) =>
                                index === self.findIndex((obj) => obj.FACTORY_LOC === value.FACTORY_LOC &&
                                                                  obj.DEMAND_LOC === value.DEMAND_LOC &&
                                                                  obj.REF_PRODID === value.REF_PRODID)
                            );
                            } else if(that.byId("MF_LOCATIONJF").getVisible() === true && that.byId("DM_LOCATIONJF").getVisible() === false){
                                var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);                            
                                prod = prod.filter(item => idsInArray1.includes(item.FACTORY_LOC));

                                ConfProd = prod.filter((value, index, self) =>
                                    index === self.findIndex((obj) => obj.FACTORY_LOC === value.FACTORY_LOC &&
                                                                      obj.REF_PRODID === value.REF_PRODID)
                                );


                            // } else if(that.byId("MF_LOCATIONJF").getVisible() === false && that.byId("DM_LOCATIONU").getVisible() === true){

                            }


               
            }
        }
            that.oGModel.setProperty("/ConfProd", ConfProd);

            // Products
            if(that.byId("PARTIAL_PRODUCTJF").getVisible() === true){
            if (core.byId("PprodInputJF").getTokens().length > 0) {
                var pro = core.byId("PprodInputJF").getTokens();
                for (var i = 0; i < pro.length; i++) {
                    var obj = {
                        REF_PRODID: pro[i].getKey(),
                        PRODUCT_ID: pro[i].getText()
                    };
                    product.push(obj);
                }
            } else {
                var prod = that.TotalDataUni;
                var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);
                var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                prod = prod.filter(item => idsInArray1.includes(item.FACTORY_LOC));
                prod = prod.filter(item => idsInArray.includes(item.DEMAND_LOC));
                prod = prod.filter(el=> el.PRODUCT_ID !== el.REF_PRODID);
                prod.forEach(el => {
                    
                         var obj = {
                            REF_PRODID: el.REF_PRODID,
                            PRODUCT_ID: el.PRODUCT_ID
                        };
                        product.push(obj);
                });
               
            }
        }
            that.oGModel.setProperty("/product", product);


            var core = that;
            var otherParams = {

                PREDICTION_PROFILE: core.byId("PrePFInputJF").getValue(),
                FORECAST_ALGORITHM: core.byId("ForeAlgInputJF").getValue(),
                VERSION: core.byId("idverJF").getValue(),
                SCENARIO: core.byId("idscenJF").getValue(),
                CLASS: core.byId("classInputJF").getValue(),
                CUSTOMER_GROUP: core.byId("custGrpInputJF").getValue(),
                FROM_DATE: core.byId("FromDateJF").getValue(),
                TO_DATE: core.byId("ToDateJF").getValue(),
                SINGLE_DATE: core.byId("singleDtJF").getValue(),
                Rolling_Timestamp: core.byId("idRollingWeeksJF").getValue(),
                HISTORY_WEEKS: core.byId("idWeeksJF").getValue(),
                OVERRIDE_ASSIGNMENT: core.byId("idOverrideJF").getSelected(),
                CRITICAL_ASSEMBLY: core.byId("idCriticalJF").getSelected(),
                IMPACT_ANALYSIS: core.byId("idImpactJF").getSelected(),
                DAILY: core.byId("idDailyJF").getSelected(),
                FULL_RUN: core.byId("idFullRunJF").getSelected(),
                SnapShot: core.byId("idSnapShotJF").getSelected(),
                SnapShot_Desc: core.byId("idSnapDescJF").getValue(),
                Rolling: core.byId("idRollingJF").getSelected(),

                OPERATOR: core.byId("idOperatorJF").getSelectedKey(),
                MODEL_VERSION: core.byId("idModelVerJF").getSelectedKey(),
                GEN_TYPE: core.byId("GenidTypeJF").getSelectedKey(),
                // DsAlgorithm: core.byId("PidDSAlgJF").getSelectedKey(),
                // OptFactor: core.byId("PidOptFctJF").getSelectedKey(),
                // OptAlgorithm: core.byId("PidOptAlgJF").getSelectedKey(),
                Optimizations:core.byId("PidOptimizationJF").getSelected(),
                POptProfile:core.byId("PidOptProfileJF").getSelectedKey(),
                OptProfile:core.byId("idOptProfileJF").getSelectedKey(),

            }
            that.oGModel.setProperty("/otherParams", otherParams);


            var FinalDataArray = [],
                cArray = [];
            var mdObj = {};
            var parObj = {};
            var confObj = {};

            // for (var m = 0; m < manuLocation.length; m++) {
            //     var f = {
            //         FACTORY_LOC: manuLocation[m].FACTORY_LOC
            //     }

            //     var dLoc = demandLocation.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC);

            //     for (var d = 0; d < dLoc.length; d++) {
            //         var dem = {
            //             LOCATION_ID: dLoc[d].DEMAND_LOC
            //         }
                    
            //         var cProd = ConfProd.filter(el => el.DEMAND_LOC === dLoc[d].DEMAND_LOC);
            //         if(cProd.length == 0 || cProd == undefined || cProd == null){
            //             mdObj = {
            //                 ...f,
            //                 ...dem
            //             };

            //             parObj = {
            //                 ...mdObj,
            //                 ...cobj,
            //                 ...otherParams
            //             }

            //             FinalDataArray.push(parObj);
                        
            //         } else {
            //     for (var c = 0; c < cProd.length; c++) {
            //             var cprod = {
            //                 REF_PRODID: cProd[c].REF_PRODID
            //             }
            //         mdObj = {
            //             ...f,
            //             ...dem,
            //             ...cprod
            //         }

            //         var string = "";
            //         // var PP = that.ConfProdall.filter(el=> el.REF_PRODID === cProd[c].REF_PRODID &&
            //         //                                                  el.CONFIGPROD_CHK !== "X");
            //     var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
            //                                             el.DEMAND_LOC === dLoc[d].DEMAND_LOC &&
            //                                             el.REF_PRODID === cProd[c].REF_PRODID &&
            //                                             el.PRODUCT_ID !== cProd[c].REF_PRODID);
            //              if (PP.length > 0) {

            //                     PP.forEach(e => {
            //                     var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
            //                     if (index !== -1) {
            //                         if (string === "") {
            //                             string = product[index].PRODUCT_ID;
            //                         } else {
            //                             if (!string.includes(product[index].PRODUCT_ID)) {
            //                                 string = string + "," + product[index].PRODUCT_ID;
            //                             }
            //                         }
            //                     }
            //                 });
            //             } else{
            //                     string = cProd[c].REF_PRODID;
            //                 }
            //                 var cobj = {
            //                     // REF_PRODID: productData[p].REF_PRODID,
            //                     PRODUCT_ID: string
            //                 }
            //                 parObj = {
            //                     ...mdObj,
            //                     ...cobj,
            //                     ...otherParams
            //                 }

            //                 FinalDataArray.push(parObj);
            //                 string = "";


            //         }
            //     }
            //     }

            // }

            for (var m = 0; m < manuLocation.length; m++) {
                var f = {
                    FACTORY_LOC: manuLocation[m].FACTORY_LOC
                }
                

                var dLoc = demandLocation.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC);
                if (dLoc.length == 0 || dLoc == undefined || dLoc == null) {
                    var dem = {
                        LOCATION_ID: ''
                    }
                    mdObj = {
                        ...f,
                        ...dem
                    };

                    // var cProd = ConfProd;
                    var cProd = ConfProd.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC);
                    if (cProd.length == 0 || cProd == undefined || cProd == null) {
                        var cprod = {
                            REF_PRODID: ''
                        }
                        mdObj = {
                            ...f,
                            ...dem
                        };

                        parObj = {
                            ...mdObj,
                            ...cobj,
                            ...otherParams
                        }

                        var string = "";
                            // // var PP = that.ConfProdall.filter(el=> el.REF_PRODID === cProd[c].REF_PRODID &&
                            // //                                                  el.CONFIGPROD_CHK !== "X");
                            // var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                            //                                         el.PRODUCT_ID !== cProd[c].REF_PRODID);
                            var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC);
                            if (PP.length > 0) {

                                PP.forEach(e => {
                                    var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
                                    if (index !== -1) {
                                        if (string === "") {
                                            string = product[index].PRODUCT_ID;
                                        } else {
                                            if (!string.includes(product[index].PRODUCT_ID)) {
                                                string = string + "," + product[index].PRODUCT_ID;
                                            }
                                        }
                                    }
                                });
                            // } else {
                            //     string = cProd[c].REF_PRODID;
                            }
                            var cobj = {
                                // REF_PRODID: productData[p].REF_PRODID,
                                PRODUCT_ID: string
                            }
                            parObj = {
                                ...mdObj,
                                ...cobj,
                                ...otherParams
                            }

                            FinalDataArray.push(parObj);
                            string = "";

                        FinalDataArray.push(parObj);

                    } else {
                        for (var c = 0; c < cProd.length; c++) {
                            var cprod = {
                                REF_PRODID: cProd[c].REF_PRODID
                            }
                            mdObj = {
                                ...f,
                                ...dem,
                                ...cprod
                            }

                            var string = cProd[c].REF_PRODID;
                            // var PP = that.ConfProdall.filter(el=> el.REF_PRODID === cProd[c].REF_PRODID &&
                            //                                                  el.CONFIGPROD_CHK !== "X");
                            var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                                                                    el.REF_PRODID === cProd[c].REF_PRODID);
                            if (PP.length > 0) {

                                PP.forEach(e => {
                                    var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
                                    if (index !== -1) {
                                        // if (string === "") {
                                        //     string = product[index].PRODUCT_ID;
                                        // } else {
                                            if (!string.includes(product[index].PRODUCT_ID)) {
                                                string = string + "," + product[index].PRODUCT_ID;
                                            }
                                        }
                                    // }
                                });
                            } else {
                                string = cProd[c].REF_PRODID;
                            }
                            var cobj = {
                                // REF_PRODID: productData[p].REF_PRODID,
                                PRODUCT_ID: string
                            }
                            parObj = {
                                ...mdObj,
                                ...cobj,
                                ...otherParams
                            }

                            FinalDataArray.push(parObj);
                            string = "";

                        }

                    }

                } else {

                for (var d = 0; d < dLoc.length; d++) {
                    var dem = {
                        LOCATION_ID: dLoc[d].DEMAND_LOC
                    }



                    var cProd = ConfProd.filter(el => el.DEMAND_LOC === dLoc[d].DEMAND_LOC);
                    if (cProd.length == 0 || cProd == undefined || cProd == null) {
                        var cobj = {
                            REF_PRODID: ''
                        }
                        mdObj = {
                            ...f,
                            ...dem,
                            ...cobj
                        };

                        var string = "";
                        var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                                                                    el.DEMAND_LOC === dLoc[d].DEMAND_LOC );
                        if (PP.length > 0) {

                            PP.forEach(e => {
                                var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
                                if (index !== -1) {
                                    if (string === "") {
                                        string = product[index].PRODUCT_ID;
                                    } else {
                                        if (!string.includes(product[index].PRODUCT_ID)) {
                                            string = string + "," + product[index].PRODUCT_ID;
                                        }
                                    }
                                }
                            });
                        } else {
                            string = cProd[c].REF_PRODID;
                        }
                        var cobj = {
                            PRODUCT_ID: string
                        }
                        parObj = {
                            ...mdObj,
                            ...cobj,
                            ...otherParams
                        }

                        FinalDataArray.push(parObj);
                        string = "";


                    } else {
                        for (var c = 0; c < cProd.length; c++) {
                            var cprod = {
                                REF_PRODID: cProd[c].REF_PRODID
                            }
                            mdObj = {
                                ...f,
                                ...dem,
                                ...cprod
                            }

                            var string = cProd[c].REF_PRODID;
                            var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                                                                        el.DEMAND_LOC === dLoc[d].DEMAND_LOC &&
                                                                        el.REF_PRODID === cProd[c].REF_PRODID );
                            if (PP.length > 0) {

                                PP.forEach(e => {
                                    var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
                                    if (index !== -1) {
                                            if (!string.includes(product[index].PRODUCT_ID)) {
                                                string = string + "," + product[index].PRODUCT_ID;
                                            }
                                        }
                                    // }
                                });
                            } else {
                                string = cProd[c].REF_PRODID;
                            }
                            var cobj = {
                                // REF_PRODID: productData[p].REF_PRODID,
                                PRODUCT_ID: string
                            }
                            parObj = {
                                ...mdObj,
                                ...cobj,
                                ...otherParams
                            }

                            FinalDataArray.push(parObj);
                            string = "";



                        }

                    }
                }

            }

            }

            var step = 0;
            var substep = 0;
            var TemplateDetails = [],
                JobcreationData = [];
            var set = 0;
            var mainstep = 0;

            for (var a = 0; a < array.length; a++) {

                // if (array[a].includes("IMPORT_S4") || array[a].includes("EXPORT_IBP_CLASS") || array[a].includes("EXPORT_IBP_CUSTOMERGROUP") ||
                //     array[a] === "EXPORT_IBP_LOCATION" || array[a].includes("EXPORT_IBP_PRODUCT") || array[a].includes(
                //         "IMPORT_VERSION_SCENARIO")) {
                //     substep = 0;
                //     set = set + 1;
                //     mainstep = mainstep + 1;
                //     var activity = array[a].split(",");
                //     for (var t = 0; t < activity.length; t++) {
                //         step = step + 1;
                //         substep = substep + 1;
                //         var Action = that.ActivityHeader.filter(function (aComp) {
                //             return aComp.ACTIVITY_ID === activity[t];
                //         });
                //         var obj = {
                //             TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                //             ACTIVITY_ID: activity[t],
                //             PARAM_VALUE: {},
                //             SET: set,
                //             STEP: step,
                //             SUBSTEP: substep,
                //             TOTAL_STEPS: 0,
                //             MAIN_STEP: mainstep,
                //             MANDATORY: "X"

                //         }
                //         var obj1 = {
                //             TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                //             ACTIVITY_ID: activity[t],
                //             STEP_DATA: {},
                //             ACTION_URL: Action.length > 0 ? Action[0].ACTION_URL : "",
                //             SET: set,
                //             STEP: step,
                //             SUBSTEP: substep,
                //             MAIN_STEP: mainstep,
                //             MANDATORY: "X"

                //         }

                //         TemplateDetails.push(obj);
                //         JobcreationData.push(obj1);
                //     }
                if (array[a].includes("IMPORT_S4") || array[a].includes("EXPORT_IBP_CLASS") || array[a].includes("EXPORT_IBP_CUSTOMERGROUP") ||
                            array[a] === "EXPORT_IBP_LOCATION" || array[a].includes("EXPORT_IBP_PRODUCT") || array[a] === "IMPORT_VERSION_SCENARIO" || 
                            array[a] === "GENERATE_TELESCOPIC_PERIODS" || array[a] === "PURGE_ALERTS_DATA") {
                            substep = 0;
                            set = set + 1;
                            mainstep = mainstep + 1;
                            var activity = array[a].split(",");
                            for (var t = 0; t < activity.length; t++) {
                                
                                var Action = that.ActivityHeader.filter(function (aComp) {
                                    return aComp.ACTIVITY_ID === activity[t];
                                });
                                if(activity[t] === "IMPORT_S4_SALES_HISTORY"){

                                    for (var i = 0; i < FinalDataArray.length; i++) {
                                        
                                        // for (var t = 0; t < activity.length; t++) {
                                            var Action = that.ActivityHeader.filter(function (aComp) {
                                                return aComp.ACTIVITY_ID === activity[t];
                                            });
                                            var aData = that.ActivityItems;
        
                                            aData = aData.filter(el => el.ACTIVITY_ID === activity[t]);
                                            that.currParams = aData;
                                            var stepObj = {};
                                            // Commented this because we are skiping the steps which need to run only onetime
                                            // during the same set.
                                            // substep = substep + 1;
                                            aData.forEach(el => {
                                                var test = el.PARAMETER_ID;
                                                if (test.includes("LOCATION")) {
                                                    var index = that.currParams.findIndex(el => el.PARAMETER_ID === "DM_LOCATION");
                                                    if(index === -1){
                                                        stepObj.MF_LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                                        stepObj.LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                                        stepObj.DEMAND_LOC = "";
                                                    } else {
                                                        stepObj.MF_LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                                        stepObj.LOCATION_ID = FinalDataArray[i].LOCATION_ID;
                                                        stepObj.DEMAND_LOC = FinalDataArray[i].LOCATION_ID;
                                                }
                                                } else if (test.includes("PRODUCT")) {
                                                    var index = that.currParams.findIndex(el => el.PARAMETER_ID === "PARTIAL_PRODUCT");
                                                    if (index !== -1) {
                                                        stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");;
                                                    } else {
                                                        stepObj.PRODUCT_ID = FinalDataArray[i].REF_PRODID;
                                                    }
                                                } else if (test === "DATE_RANGE") {
                                                    stepObj.FROM_DATE = FinalDataArray[i].FROM_DATE;
                                                    stepObj.TO_DATE = FinalDataArray[i].TO_DATE;
                                                }
                                               
                                        })
                                        step = step + 1;
                                        substep = substep + 1;

                                        
        
                                            var obj = {
                                                TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                                                ACTIVITY_ID: activity[t],
                                                PARAM_VALUE: stepObj,
                                                SET: set,
                                                STEP: step,
                                                SUBSTEP: substep,
                                                TOTAL_STEPS: 0,
                                                MAIN_STEP: mainstep,
                                                MANDATORY: "X"
        
                                            }
                                            var obj1 = {
                                                TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                                                ACTIVITY_ID: activity[t],
                                                STEP_DATA: stepObj,
                                                ACTION_URL: Action[0].ACTION_URL,
                                                SET: set,
                                                STEP: step,
                                                SUBSTEP: substep,
                                                MANDATORY: "X",
                                                MAIN_STEP: mainstep,
        
                                            }
                                            TemplateDetails.push(obj);
                                        JobcreationData.push(obj1);
                                        // }
                                    }

                                } else {
                                    step = step + 1;
                                substep = substep + 1;

                                var obj = {
                                    TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                                    ACTIVITY_ID: activity[t],
                                    PARAM_VALUE: {},
                                    SET: set,
                                    STEP: step,
                                    SUBSTEP: substep,
                                    TOTAL_STEPS: 0,
                                    MAIN_STEP: mainstep,
                                    MANDATORY: "X"

                                }
                                var obj1 = {
                                    TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                                    ACTIVITY_ID: activity[t],
                                    STEP_DATA: {},
                                    ACTION_URL: Action.length > 0 ? Action[0].ACTION_URL : "",
                                    SET: set,
                                    STEP: step,
                                    SUBSTEP: substep,
                                    MAIN_STEP: mainstep,
                                    MANDATORY: "X"

                                }
                                TemplateDetails.push(obj);
                                JobcreationData.push(obj1);
                            }

                                
                            }

                } else {
                    var activity = array[a].split(",");
                    mainstep = mainstep + 1;
                    var object = {};
                    for (var i = 0; i < FinalDataArray.length; i++) {
                        substep = 0;
                        set = set + 1;
                        for (var t = 0; t < activity.length; t++) {
                            var Action = that.ActivityHeader.filter(function (aComp) {
                                return aComp.ACTIVITY_ID === activity[t];
                            });
                            var aData = that.ActivityItems;
                            aData = aData.filter(el => el.ACTIVITY_ID === activity[t]);
                            that.currParams = aData;
                            var stepObj = {};
                            // substep = substep + 1;
                            aData.forEach(el => {
                                var test = el.PARAMETER_ID;
                                if (test.includes("LOCATIONJF") || test.includes("LOCATION")) {
                                    var index = that.currParams.findIndex(el => el.PARAMETER_ID === "DM_LOCATION");
                                            if(index === -1){
                                                stepObj.MF_LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                                stepObj.LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                                stepObj.DEMAND_LOC = "";
                                            } else {
                                                stepObj.MF_LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                                stepObj.LOCATION_ID = FinalDataArray[i].LOCATION_ID;
                                                stepObj.DEMAND_LOC = FinalDataArray[i].LOCATION_ID;
                                        }
                                //     stepObj.MF_LOCATION_ID = FinalDataArray[i].FACTORY_LOC;
                                //     stepObj.LOCATION_ID = FinalDataArray[i].LOCATION_ID;
                                // // } else if (test === "DM_LOCATIONJF" || test.includes("DM_LOCATION")) {
                                // //     stepObj.LOCATION_ID = FinalDataArray[i].LOCATION_ID;
                                } else if (test.includes("PRODUCTJF") || test.includes("PRODUCT")) {
                                    var index = that.currParams.findIndex(el => el.PARAMETER_ID.includes("PARTIAL"));
                                            if (index !== -1) {
                                                stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");;
                                            } else {
                                                stepObj.PRODUCT_ID = FinalDataArray[i].REF_PRODID;
                                            }
                                    // stepObj.PRODUCT_ID = FinalDataArray[i].REF_PRODID;
                                    // stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");

                                // } else if (test === "PARTIAL_PRODUCTJF" || test.includes("PARTIAL_PRODUCT")) {
                                //     stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");
                                } else if (test === "PREDICTION_PROFILEJF" || test.includes("PREDICTION_PROFILE")) {
                                    stepObj.PREDICTION_PROFILE = FinalDataArray[i].PREDICTION_PROFILE;
                                } else if (test === "FORECAST_ALGORITHMJF" || test.includes("FORECAST_ALGORITHM")) {
                                    stepObj.FORECAST_ALGORITHM = FinalDataArray[i].FORECAST_ALGORITHM;
                                } else if (test === "VERSIONJF" || test.includes("VERSION")) {
                                    stepObj.VERSION = FinalDataArray[i].VERSION;
                                } else if (test === "SCENARIOJF" || test.includes("SCENARIO")) {
                                    stepObj.SCENARIO = FinalDataArray[i].SCENARIO;
                                } else if (test === "CUSTOMER_GROUPJF" || test.includes("CUSTOMER_GROUP")) {
                                    stepObj.CUSTOMER_GROUP = FinalDataArray[i].CUSTOMER_GROUP;
                                } else if (test === "CLASSJF" || test.includes("CLASS")) {
                                    stepObj.CLASS = FinalDataArray[i].CLASS;
                                } else if (test === "CRITICAL_ASSEMBLYJF" || test.includes("CRITICAL_ASSEMBLY")) {
                                    var criticalCheck = "";
                                    if (FinalDataArray[i].CRITICAL_ASSEMBLY === "true" || FinalDataArray[i].CRITICAL_ASSEMBLY === true ||
                                        FinalDataArray[i].CRITICAL_ASSEMBLY === "X") {
                                        criticalCheck = "X";
                                    }
                                    stepObj.CRITICAL_ASSEMBLY = criticalCheck;
                                } else if (test === "IMPACT_ANALYSISJF" || test.includes("IMPACT_ANALYSIS")) {
                                    if (FinalDataArray[i].IMPACT_ANALYSIS === "true" || FinalDataArray[i].IMPACT_ANALYSIS === true) {
                                        stepObj.IMPACT_ANALYSIS = true;
                                    } else {
                                        stepObj.IMPACT_ANALYSIS = false;
                                    }
                                } else if (test === "DAILYJF" || test.includes("DAILY")) {
                                    if (FinalDataArray[i].DAILY === "true" || FinalDataArray[i].DAILY === true) {
                                        stepObj.DAILY = true;
                                    } else {
                                        stepObj.DAILY = false;
                                    }
                                } else if (test === "FULL_RUNJF" || test.includes("FULL_RUN")) {
                                    if (FinalDataArray[i].FULL_RUN === "true" || FinalDataArray[i].FULL_RUN === true) {
                                        stepObj.FULL_RUN = true;
                                    } else {
                                        stepObj.FULL_RUN = false;
                                    }
                                } else if (test === "OVERRIDE_ASSIGNMENTJF" || test.includes("OVERRIDE_ASSIGNMENT")) {
                                    if (FinalDataArray[i].OVERRIDE_ASSIGNMENT === "true" || FinalDataArray[i].OVERRIDE_ASSIGNMENT === true) {
                                        stepObj.OVERRIDE_ASSIGNMENT = true;
                                    } else {
                                        stepObj.OVERRIDE_ASSIGNMENT = false;
                                    }
                                } else if (test === "GEN_TYPEJF" || test.includes("GEN_TYPE")) {
                                    stepObj.GEN_TYPE = FinalDataArray[i].GEN_TYPE;
                                } else if (test === "MODEL_VERSIONJF" || test.includes("MODEL_VERSION")) {
                                    stepObj.MODEL_VERSION = FinalDataArray[i].MODEL_VERSION;
                                } else if (test === "DATE_RANGEJF" || test.includes("DATE_RANGE")) {
                                    stepObj.FROM_DATE = FinalDataArray[i].FROM_DATE;
                                    stepObj.TO_DATE = FinalDataArray[i].TO_DATE;
                                } else if (test === "OPERATORJF" || test.includes("OptFactor")) {
                                    var operator = that.byId("idOperatorJF").getSelectedKey();
                                    stepObj.OPERATOR = operator;
                                } else if (test === "SINGLE_DATEJF" || test.includes("SINGLE_DATE")) {
                                    stepObj.SINGLE_DATE = FinalDataArray[i].SINGLE_DATE;
                                } else if (test === "Rolling_TimestampJF" || test.includes("Rolling_Timestamp")) {
                                    stepObj.Rolling = that.byId("idRollingJF").getSelected();
                                    stepObj.Rolling_Timestamp = parseInt(FinalDataArray[i].Rolling_Timestamp);
                                    } else if (test === "Optimization") {
                                            // var Optimization = that.byId("PidOptProfileJF").getSelected();
                                            var Optimization = that.byId("PidOptimizationJF").getSelected();
                                            stepObj.Optimization = Optimization;
                                        } else if (test === "POptProfile") {
                                            // var OPTProfile = that.byId("PidOptProfileJF").getSelected();
                                            var POPTProfile = that.byId("PidOptProfileJF").getSelectedKey();
                                            stepObj.POptProfile = POPTProfile;
                                        } else if (test === "OptProfile") {
                                            // var OPTProfile = that.byId("PidOptProfileJF").getSelected();
                                            var OPTProfile = that.byId("idOptProfileJF").getSelectedKey();
                                            stepObj.OptProfile = OPTProfile;                                        
                                // } else if (test === "DsAlgorithmJF" || test.includes("DsAlgorithm")) {
                                //     var DSAlgo = that.byId("PidDSAlgJF").getSelectedKey();
                                //     stepObj.DsAlgorithm = DSAlgo;
                                // } else if (test === "OptFactorJF" || test.includes("OptFactor")) {
                                //     var OPTfact = that.byId("PidOptFctJF").getSelectedKey();
                                //     stepObj.OptFactor = parseFloat(OPTfact);
                                // } else if (test === "OptAlgorithmJF" || test.includes("OptAlgorithm")) {
                                //     var OPTalgo = that.byId("PidOptAlgJF").getSelectedKey();
                                //     stepObj.OptAlgorithm = OPTalgo;
                                } else if (test === "SnapShotJF" || test.includes("SnapShot")) {
                                    if (FinalDataArray[i].SnapShot === "") {
                                        stepObj.SnapShot = "";
                                        stepObj.SnapShot_Desc = "";
                                    } else if (FinalDataArray[i].SnapShot === "JF") {
                                        stepObj.SnapShot = "JF";
                                        stepObj.SnapShot_Desc = "";
                                    } else if (FinalDataArray[i].SnapShot === "C") {
                                        stepObj.SnapShot = "C";
                                        stepObj.SnapShot_Desc = FinalDataArray[i].SnapShot_Desc;
                                    }
                                } else if (test === "HISTORY_WEEKSJF" || test.includes("HISTORY_WEEKS")) {
                                    stepObj.HISTORY_WEEKS = FinalDataArray[i].HISTORY_WEEKS;
                                }

                            });

                            if ((activity[t] === "PUBLISH_FORECAST_ORDERS" || activity[t] === "EXPORT_IBP_ASSEMBLY_REQ_QUANTITY") && stepObj.Rolling) {
                                var Weeks = stepObj.Rolling_Timestamp === "" ? 0 : stepObj.Rolling_Timestamp;
                                var newDate = new Date(new Date().getTime() + Weeks * 7 * 24 * 60 * 60 * 1000);
                                var fromDate = new Date().toISOString().split("T")[0];
                                var toDate = "";
                                if (!isNaN(newDate)) {
                                    toDate = newDate.toISOString().split("T")[0];
                                }
                                if (Weeks > 0) {
                                    stepObj.FROM_DATE = fromDate;
                                    stepObj.TO_DATE = toDate;
                                }

                            }

                            // step = step + 1;

                            var tempObj = {
                                ...stepObj,
                                ACTIVITY_ID: activity[t]
                            }


                            var aDIndex = aDataCheck.findIndex(el=> el.MF_LOCATION_ID === tempObj.MF_LOCATION_ID &&
                                                                    el.DEMAND_LOC    === tempObj.DEMAND_LOC &&
                                                                    el.PRODUCT_ID     === tempObj.PRODUCT_ID &&
                                                                    el.ACTIVITY_ID    === activity[t] );
                            if(aDIndex === -1){
                                step = step + 1;
                                substep = substep + 1;
                                aDataCheck.push(tempObj);

                            var obj = {
                                TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                                ACTIVITY_ID: activity[t],
                                PARAM_VALUE: stepObj,
                                SET: set,
                                STEP: step,
                                SUBSTEP: substep,
                                TOTAL_STEPS: 0,
                                MAIN_STEP: mainstep,
                                MANDATORY: ""

                            }
                            var obj1 = {
                                TEMPLATE_ID: that.byId("idTempValueJF").getValue(),
                                ACTIVITY_ID: activity[t],
                                STEP_DATA: stepObj,
                                ACTION_URL: Action[0].ACTION_URL,
                                SET: set,
                                STEP: step,
                                SUBSTEP: substep,
                                MANDATORY: "",
                                MAIN_STEP: mainstep,

                            }

                            TemplateDetails.push(obj);
                            JobcreationData.push(obj1);
                        }
                        }
                    }
                }

            }

            console.log(TemplateDetails);
            console.log(JobcreationData);


            // that.sSequence = "";
            // if (that.Edit === "") {
            //     that.sSequence = "Sequence_" + new Date().getTime();
            // } else {
            //     that.sSequence = that.JobData[0].SEQUENCE_ID;
            // }
            that.sSequence= that.byId("idJobfeedname").getValue();

            that.oGModel.setProperty("/saveData",that.saveData);
            that.oGModel.setProperty("/TemplateDetails",TemplateDetails);
            that.oGModel.setProperty("/JobcreationData",JobcreationData);


            var oModel = that.getOwnerComponent().getModel('JModel');
            sap.ui.core.BusyIndicator.show();
            oModel.callFunction("/insertJobData", {
                method: "GET",
                urlParameters: {
                    Flag: that.Edit,
                    Sequence: that.sSequence,
                    jobData: JSON.stringify(JobcreationData)
                },
                success: function (oData, oResponse) {
                    sap.ui.core.BusyIndicator.hide();
                    
                    that.InsertTemplate();
                
                },
                error: function (oResponse) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Failed");
                },
            });

            // if(that.saveData.includes("idcreate")){
            //     that.saveJObData(that.saveData, TemplateDetails, JobcreationData);
            // } else {
            //     if (!this._StepSelDialog) {
            //         this._StepSelDialog = sap.ui.xmlfragment(
            //             "vcpapp.vcpjobschedulersequence.view.StepSelDialog",
            //             this
            //         );
            //         this.getView().addDependent(this._StepSelDialog);
            //     }
            //     sap.ui.getCore().byId("idVarName").setValue();
            //     that._StepSelDialog.open();
            // }

            
        } 

        } else {
        //    if(value <= 0){
        //             MessageToast.show("History weeks can not be lessthen 1");
                  
        //         } else if(value > 156){
        //             MessageToast.show("History weeks can not be greaterthen 156");
                    
        //         } else {
        //             sap.m.MessageToast.show("Please Select profile /version / scenario/ forecast algorithem is visible");
        //         }
            sap.m.MessageToast.show("Please Select profile /version / scenario/ forecast algorithm if any visible");


        }

    },

    // oncloseVariant:function(){
    //     that._StepSelDialog.close();
    // },

    // onConfirmVariant:function(){
    //     that.variantName = sap.ui.getCore().byId("idVarName").getValue();

    //     var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;

    //     var validate = specials.test(that.variantName);

    //     if (validate === false) {
    //         that.sSequence = that.variantName;
    //         that._StepSelDialog.close();
    //         that.saveJObData();
    //         // that.InsertTemplate();
    //     } else {
    //         sap.m.MessageToast.show("Please enter valid Job Variant name");
    //     }


    // },

    // saveJObData:function(button,TemplateDetails,JobcreationData){
    //     that.saveData = that.oGModel.getProperty("/saveData");
    //       var TemplateDetails=  that.oGModel.getProperty("/TemplateDetails");
    //       var JobcreationData = that.oGModel.getProperty("/JobcreationData");
    //       console.log(TemplateDetails);
    //       console.log(JobcreationData);
    //     var oModel = that.getOwnerComponent().getModel('JModel');
    //         sap.ui.core.BusyIndicator.show();
    //         oModel.callFunction("/insertJobData", {
    //             method: "GET",
    //             urlParameters: {
    //                 //new add//
    //                 Flag: that.Edit,
    //                 // VARIANT : "",
    //                 Sequence: that.sSequence,
    //                 jobData: JSON.stringify(JobcreationData)
    //             },
    //             success: function (oData, oResponse) {
    //                 sap.ui.core.BusyIndicator.hide();
    //                 if(that.saveData.includes("idcreate")){
    //                 //new add//
    //                 if (that.Edit !== "X") {
    //                     that.SaveTemplateDetails = TemplateDetails;
    //                     that.createJob(oData.insertJobData);
    //                 } else {
    //                     that.saveJobDetails("", TemplateDetails);
    //                 }
    //             } else {
    //                 that.InsertTemplate();
    //             }

    //                 // //Now create job
    //                 // that.createJob(oData.insertJobData);
    //                 // // sap.m.MessageToast.show("success");
    //             },
    //             error: function (oResponse) {
    //                 sap.ui.core.BusyIndicator.hide();
    //                 sap.m.MessageToast.show("Failed");
    //             },
    //         });
    // },
    InsertTemplate: function(){

        var tempDetails = that.oGModel.getProperty("/tempDetails"); 
        var paramdata = [];  
        that.TempData = [];
        that.ParametersData = [];

            for(var i=0; i<tempDetails.length; i++){
                if(tempDetails[i].includes(",")){
                   var temp =  tempDetails[i].split(",");
                } else {
                    var temp =  tempDetails[i];
                }
                paramdata = paramdata.concat(temp);
            }



       // To get the user details
       var User = "";
            var Level = that.templevel;
            var layercode = that.LayerCode;
            var maxstpe = paramdata.length;

            if (sap.ushell.Container) {
                let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                User = (email) ? email : "";
            }
                var tempplateName = that.byId("idTempValueJF").getValue();
                var jobFeedname = that.byId("idJobfeedname").getValue();

          
            paramdata.forEach(function (el, i) {
            var tempObj = {
                ACTIVITY_ID : el,
                ACT_POSITION : i + 1,
                CREATED_BY : User,
                LAYER_CODE : layercode,
                LEVEL : Level,
                MAXSTEP : maxstpe,
                STEP_NAME : el,
                TEMPLATE_DESC : tempplateName,
                TEMPLATE_ID : tempplateName,
                VARIANT_NAME : jobFeedname
            }

            that.TempData.push(tempObj);

        });

        // Parameter values
            var mfloc =that.oGModel.getProperty("/manuLocation");
            var dloc =that.oGModel.getProperty("/demandLocation");
            var confProd=that.oGModel.getProperty("/ConfProd");
            var prod=that.oGModel.getProperty("/product");
            var others=that.oGModel.getProperty("/otherParams");
            var MF_LOCATION_ID = "",
                LOCATION_ID = "",
                CONFIG_PRODUCT = "",
                PARTIAL_PRODUCT = "";

            mfloc.forEach(el => {
                if(MF_LOCATION_ID === ""){
                    MF_LOCATION_ID = el.FACTORY_LOC;
                } else {
                    MF_LOCATION_ID = MF_LOCATION_ID + "," + el.FACTORY_LOC;
                }
            });
            dloc.forEach(el => {
                if(LOCATION_ID === ""){
                    LOCATION_ID = el.DEMAND_LOC;
                } else {
                    LOCATION_ID = LOCATION_ID + "," + el.DEMAND_LOC;
                }
            });
            confProd.forEach(el => {
                if(CONFIG_PRODUCT === ""){
                    CONFIG_PRODUCT = el.REF_PRODID;
                } else {
                    if(!CONFIG_PRODUCT.includes(el.REF_PRODID)){
                        CONFIG_PRODUCT = CONFIG_PRODUCT + "," + el.REF_PRODID;
                    }
                    
                }
            });
            prod.forEach(el => {
                if(PARTIAL_PRODUCT === ""){
                    PARTIAL_PRODUCT = el.PRODUCT_ID;
                } else {
                    if(!PARTIAL_PRODUCT.includes(el.PRODUCT_ID)){
                        PARTIAL_PRODUCT = PARTIAL_PRODUCT + "," + el.PRODUCT_ID;
                    }
                }
            });

            others.MF_LOCATION_ID = MF_LOCATION_ID;
            others.LOCATION_ID = LOCATION_ID;
            others.CONFIG_PRODUCT = CONFIG_PRODUCT;
            others.PARTIAL_PRODUCT = PARTIAL_PRODUCT;

            console.log(others);


            Object.entries(others).forEach(function(x, i) {


                const obj = {
                    "TEMPLATE_ID": tempplateName,
                    "VARIANT_NAME": jobFeedname,
                    "ACTIVITY_ID": tempplateName,  
                    "ACT_POSITION" : i + 1,   
                    "LEVEL"        : Level,
                    "PARAMETER_ID": x[0],
                    "VALUE": x[1].toString()
                }
                that.ParametersData.push(obj);

            });

            console.log(that.ParametersData);

            var falg = that.oGModel.getProperty("/variantEditFlag");
            var copy = that.oGModel.getProperty("/copy");

            if(falg === "X" && copy === ""){
                var selType = "E";
            } else {
                var selType = "";
            }


            sap.ui.core.BusyIndicator.show();
        that.getModel("JSModel").callFunction("/genTemplateDetails", {
        method: "GET",
        urlParameters: {
            FLAG:selType,
            VARIANT:"X",
            TEMPDATA: JSON.stringify(that.TempData),
                PARAMDATA:JSON.stringify(that.ParametersData)
        },
        success: function (oData) {
            sap.ui.core.BusyIndicator.hide();
            
            
                sap.m.MessageToast.show(oData.genTemplateDetails);
                // that.onBack();
                that.bus.publish("flexible", "exitScreen");
                that.bus.publish("data", "refreshMaster");
            
        },
        error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Error to create Template");
        },
    });
    },
        
    });
});