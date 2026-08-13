sap.ui.define([
    "vcpapp/vcptemplate/controller/BaseController",
    "sap/ui/model/json/JSONModel",
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
    'sap/ui/export/Spreadsheet',
    "vcpapp/vcptemplate/Utils",
    "sap/ui/core/dnd/DragInfo",
    "sap/ui/core/dnd/DropInfo",
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */

function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, library, Sorter, Dialog, Text, Button, MessageBox, Spreadsheet,Utils,DragInfo,DropInfo) {
    "use strict";
    var that, oGModel;
 
    return BaseController.extend("vcpapp.vcptemplate.controller.Variant", {
            onInit: function () {
                that = this;

               
              

            },
        

            onAfterRendering:function(){
                that = this;

                 // Declaring JSON Model and size limit
                that.oModel = new JSONModel();
                that.TemplateModel = new JSONModel();
                that.stepsModel = new JSONModel();
                that.TemplateModelSel = new JSONModel();
                this.locModel = new JSONModel();
                this.MFlocModel = new JSONModel();
                this.prodModel = new JSONModel();
                this.ppfModel = new JSONModel();
                this.verModel = new JSONModel();
                this.scenModel = new JSONModel();
                this.classModel = new JSONModel();
                this.custGroupModel = new JSONModel();

                that.oGModel = that.getOwnerComponent().getModel("oGModel");
                

                that.oModel.setSizeLimit(1000);
                that.TemplateModel.setSizeLimit(1000);
                that.stepsModel.setSizeLimit(1000);
                that.TemplateModelSel.setSizeLimit(1000);
                that.ppfModel.setSizeLimit(1000);
                that.locModel.setSizeLimit(1000);
                that.classModel.setSizeLimit(1000);
                that.classModel.setSizeLimit(1000);


                // Declaring global variables
                that.oMFLoc = "";
                that.oLoc = "";
                that.oProd = "";
                that.oPredProfile = "";
                that.oVer = "";
                that.oScen = "";
                that.oClass = "";
                that.oCustgroup = "";

                that.byId("idVariant").setEditable(true);
                that.byId("idVarDesc").setEditable(true);
                that.byId("idVariant").setValue();
                that.byId("idVarDesc").setValue();
                that.oGModel.setProperty("/type", "");



                // Declaring Value Help Dialogs and Template Dialog.
                this._oCore = sap.ui.getCore();
                if (!this._templateDialog) {
                    this._templateDialog = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.TemplateCreation",
                        this
                    );
                    this.getView().addDependent(this._templateDialog);
                }
                // if (!this._templateSelDialog) {
                //     this._templateSelDialog = sap.ui.xmlfragment(
                //         "vcpapp.vcptemplate.view.TemplateSelection",
                //         this
                //     );
                //     this.getView().addDependent(this._templateSelDialog);
                // }

                
                // Declaring fragments
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogMFL) {
                    this._valueHelpDialogMFL = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.MFLocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogMFL);
                }
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd) {
                    this._valueHelpDialogProd = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd);
                }
                if (!this._valueHelpDialogConfProd) {
                    this._valueHelpDialogConfProd = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.confProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogConfProd);
                }

                if (!this._valueHelpDialogPPF) {
                    this._valueHelpDialogPPF = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.PredDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogPPF);
                }

                if (!this._valueHelpDialogFAP) {
                    this._valueHelpDialogFAP = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.ForecastAlgoDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogFAP);
                }
                
                
                if (!this._valueHelpDialogVer) {
                    this._valueHelpDialogVer = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.VersionDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogVer);
                }
                if (!this._valueHelpDialogScen) {
                    this._valueHelpDialogScen = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.ScenarioDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogScen);
                }

                if (!this._valueHelpDialogClassDetails) {
                    this._valueHelpDialogClassDetails = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.ClassDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogClassDetails);
                }

                if (!this._valueHelpDialogCustGroup) {
                    this._valueHelpDialogCustGroup = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.CustGroupDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogCustGroup);
                }

                if (!this._valueHelpDialogMFLUni) {
                    this._valueHelpDialogMFLUni = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.MFMulLocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogMFLUni);
                }


                var selKey = that.oGModel.getProperty("/auth");

                if(selKey === undefined ){
                    that.onBack();
                    return;
                } else {
                    that.byId("idVarList").setVisible(true);
                    that.byId("idJobs").setVisible(true);
                    that.byId("idJobList").setVisible(false);
                    that.byId("idVars").setVisible(false);

                
                that.byId("idVariant").setValue();
                that.byId("idVarDesc").setValue();
                // that.byId("idParameterV").setVisible(false);


                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogConfProd.setTitleAlignment("Center");
                that._valueHelpDialogPPF.setTitleAlignment("Center");
                that._valueHelpDialogFAP.setTitleAlignment("Center");
                that._valueHelpDialogVer.setTitleAlignment("Center");
                that._valueHelpDialogScen.setTitleAlignment("Center");
                that._valueHelpDialogClassDetails.setTitleAlignment("Center");
                that._valueHelpDialogCustGroup.setTitleAlignment("Center");

                // this.oProdList = this._oCore.byId(
                //     this._valueHelpDialogProd.getId() + "-list"
                // );
                this.oProdList = this._oCore.byId("prodSlctListT");
                this.oConfProdList = this._oCore.byId("ConfProductSlctListT");
                this.oMFLocList = this._oCore.byId(
                    this._valueHelpDialogMFL.getId() + "-list"
                );
                this.oLocList = this._oCore.byId("LocSlctListT");
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
                this.oMFLocListUni = this._oCore.byId("MFLSlctListJSSMulT");

                that.TempJSON =[];
                that.TempParams =[];
                that.tempIndex = "";

                that.oLocData = that.oGModel.getProperty("/homeAllLocationData");
                that.ConfProdall = that.oGModel.getProperty("/homeAllLocationProductData");

                that.TotalDataUni = that.oLocData;
                    function removeDuplicate(array, key) {
                        var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }
                        that.MFLocDataUni = removeDuplicate(that.oLocData, 'FACTORY_LOC');

                    that.uniqConfprod= that.ConfProdall.filter(el=> el.CONFIGPROD_CHK === "X");

                that.byId("FromDateV").setMinDate(new Date());
                that.byId("ToDateV").setMinDate(new Date());
                that.byId("ToDateV").setEditable(false);
                that.byId("FromDateV").$().find('INPUT').attr('disabled', true);
                that.byId("ToDateV").$().find('INPUT').attr('disabled', true);


                
                 that.getVariant();

                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Profiles data
                this.getModel("JModel").read("/getActivities", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();                    
                        that.JobModel = new JSONModel();
                        that.JobModel.setData({
                            results: oData.results
                        });
                        that.byId("idJobList").setModel(that.JobModel);

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
              
                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Profiles data
                this.getModel("BModel").read("/getProfiles", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.PredictionData = oData.results;
                        oData.results = oData.results.filter(el=> el.METHOD !== "AES");
                        that.ppfModel.setData(oData);
                        that._valueHelpDialogPPF.setModel(that.ppfModel);

                        var data = oData.results.filter(el=> el.METHOD === "AES");
                        that.fapModel = new JSONModel();
                        that.fapModel.setData({
                            results: data
                        });
                        that._valueHelpDialogFAP.setModel(that.fapModel);

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });

                // calling service to get the version scenario data
                this.getModel("BModel").read("/getVerScnmaster", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
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
                        sap.ui.core.BusyIndicator.hide();
                    },
                });

                this.getModel("BModel").read("/getProdClass", {
                    urlParameters: {
                                    "$skip": 0,
                                    "$top": 50000
                                },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.ClassData = oData.results;
                        

                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Customer data
                this.getModel("BModel").read("/getCustgroup", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.custGroupModel = new JSONModel();
                        that.custGroupModel.setData(oData);
                        that.oCustGroupList.setModel(that.custGroupModel);
                        that.customerData = oData.results;

                       
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("failed to fetch the customer groups");
                    },
                });

                sap.ui.core.BusyIndicator.show();
                    // Calling service to get the Customer data
                    this.getModel("BModel").read("/getOptimizations", {
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            
                            var Optimizationsnew = [...oData.results];
                            var Optimizations = oData.results;

                            Optimizations.unshift({
                                PROFILE: "None",
                                ALGORITHM:""
                                  });

                                  Optimizationsnew.unshift({
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
                                      that.byId("PidOptProfileV").setModel(that.POptmodel);
                                      that.byId("idOptProfileV").setModel(that.Optmodel);
                                      that.byId("PidOptProfileV").setSelectedKey(Optimizations[0].PROFILE);
                                      that.byId("idOptProfileV").setSelectedKey(Optimizationsnew[0].PROFILE);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });

                that.getModel("JModel").read("/readActivityItems", {
                        filters: [new Filter("PARAMETER_ID", FilterOperator.NE, "")],
                        success: function (oData) {
                            // sap.ui.core.BusyIndicator.hide();

                            that.ActivityItems = oData.results;
                            // resolve(true);

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get activity item data");
                        },
                    });

                var selType = that.oGModel.getProperty("/type");
                var template =  that.oGModel.getProperty("/selTemplate");
                var templateDesc =  that.oGModel.getProperty("/selTemplateDesc");

                if(selType === undefined){
                    selType = "";
                }

                that.typeData = {
                    "Types": [{ "name": "Restrictions", "key": "RT" },
                    { "name": "Primary", "key": "PI" },
                    { "name": "Object Dependency", "key": "OD" }
                    ]
                };
    
                var jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                    this.getView().byId("GenidTypeV").setModel(jmodel);

                // if(selType === "C"){
                //     that.byId("idTemp").setValue(template + " copy");
                //     that.byId("idTempDesc").setValue(templateDesc);
                //     that.copyData();
                // } else if(selType === "E"){
                //     that.byId("idTemp").setValue(template);
                //     that.byId("idTempDesc").setValue(templateDesc);
                //     that.byId("idTemp").setEditable(false);
                //     that.copyData();
                // }

                // if(selType === "E"){
                //     that.byId("idPage").setTitle("Edit Job Template");
                // } else {
                //     that.byId("idPage").setTitle("New Job Template");
                // }

            }
            },

            getVariant:function(){
                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Variant data
                this.getModel("JModel").read("/getVariantData", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();  
                        that.OnClear();                  
                        that.VariantModel = new JSONModel();
                        that.VariantModel.setData({
                            results: oData.results
                        });
                        that.byId("idVarList").setModel(that.VariantModel);

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
            },

            onBack:function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                 that.destroy();
                oRouter.navTo("Home", {}, true);
            },

            destroy: function () {
                this._templateDialog.destroy();
                this._valueHelpDialogMFL.destroy();
                this._valueHelpDialogLoc.destroy();
                this._valueHelpDialogProd.destroy();
                this._valueHelpDialogPPF.destroy();
                this._valueHelpDialogFAP.destroy();
                this._valueHelpDialogVer.destroy();
                this._valueHelpDialogScen.destroy();
                // this._valueHelpDialog.destroy();
                this._valueHelpDialogClassDetails.destroy();
                this._valueHelpDialogCustGroup.destroy();
                this._valueHelpDialogMFLUni.destroy();
                this._valueHelpDialogConfProd.destroy();


                this._templateDialog = "";
                this._valueHelpDialogMFL = "";
                this._valueHelpDialogLoc = "";
                this._valueHelpDialogProd = "";
                this._valueHelpDialogPPF = "";
                this._valueHelpDialogFAP = "";
                this._valueHelpDialogVer = "";
                this._valueHelpDialogScen = "";
                // this._valueHelpDialog = "";
                this._valueHelpDialogClassDetails = "";
                this._valueHelpDialogCustGroup = "";
                this._valueHelpDialogMFLUni = "";
                that._valueHelpDialogConfProd = "";
            },

            onJobPress:function(oEvent){
                var id = oEvent.getParameters().id;

                if(id.includes("idVars")){
                    that.byId("idVarList").setVisible(true);
                    that.byId("idJobs").setVisible(true);
                    that.byId("idJobList").setVisible(false);
                    that.byId("idVars").setVisible(false);

                } else {
                    that.byId("idVarList").setVisible(false);
                    that.byId("idJobs").setVisible(false);
                    that.byId("idJobList").setVisible(true);
                    that.byId("idVars").setVisible(true);
                }
            },

            onJobSel:function(oEvent){
                var params = [];
                if (oEvent) {
                    var selected = that.byId("idJobList").getSelectedItems()[0].getCells()[0].getTitle();
                    params = that.ActivityItems.filter(el => el.ACTIVITY_ID === selected);
                }

                that.removeStyleclass();

                for (var i = 0; i < params.length; i++) {

                    switch (params[i].PARAMETER_ID) {
                        case "MF_LOCATION":
                            that.byId("MF_LOCATIONV").getLabelControl().addStyleClass("addBorder");
                            that.byId("DM_LOCATIONV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "DM_LOCATION":
                            that.byId("DM_LOCATIONV").getLabelControl().addStyleClass("addBorder");
                            that.byId("MF_LOCATIONV").getLabelControl().addStyleClass("addBorder");

                            break;
                        case "CONFIG_PRODUCT":
                        case "PARTIAL_PRODUCT":
                            that.byId("CONFIG_PRODUCTV").getLabelControl().addStyleClass("addBorder");
                            that.byId("PARTIAL_PRODUCTV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "MODEL_VERSION":
                            that.byId("MODEL_VERSIONV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "PREDICTION_PROFILE":
                            that.byId("PREDICTION_PROFILEV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "FORECAST_ALGORITHM":
                            that.byId("FORECAST_ALGORITHMV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "VERSION":
                            that.byId("VERSIONV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "SCENARIO":
                            that.byId("SCENARIOV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "CLASS":
                            that.byId("CLASSV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "CUSTOMER_GROUP":
                            that.byId("CUSTOMER_GROUPV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "GEN_TYPE":
                            that.byId("GEN_TYPEV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "DATE_RANGE":
                            that.byId("DATE_RANGEV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "OPERATOR":
                            that.byId("OPERATORV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "Rolling_Timestamp":
                            that.byId("Rolling_TimestampV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "CRITICAL_ASSEMBLY":
                            that.byId("CRITICAL_ASSEMBLYV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "IMPACT_ANALYSIS":
                            that.byId("IMPACT_ANALYSISV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "DAILY":
                            that.byId("DAILYV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "FULL_RUN":
                            that.byId("FULL_RUNV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "Optimization":
                            that.byId("OptimizationV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "POptProfile":
                            that.byId("POptProfileV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "OptProfile":
                            that.byId("OptProfileV").getLabelControl().addStyleClass("addBorder");
                            break;
                        
                        case "SnapShot":
                            that.byId("SnapShotV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "SnapR":
                            that.byId("SnapRV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "snapDesc":
                            that.byId("snapDescV").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "HISTORY_WEEKS":
                            that.byId("HISTORY_WEEKSV").getLabelControl().addStyleClass("addBorder");
                            break;
                    }
                }

            },

            removeStyleclass:function(){
                that.byId("MF_LOCATIONV").getLabelControl().removeStyleClass("addBorder");
                that.byId("DM_LOCATIONV").getLabelControl().removeStyleClass("addBorder");
                that.byId("CONFIG_PRODUCTV").getLabelControl().removeStyleClass("addBorder");
                that.byId("PARTIAL_PRODUCTV").getLabelControl().removeStyleClass("addBorder");
                that.byId("MODEL_VERSIONV").getLabelControl().removeStyleClass("addBorder");
                that.byId("PREDICTION_PROFILEV").getLabelControl().removeStyleClass("addBorder");
                that.byId("FORECAST_ALGORITHMV").getLabelControl().removeStyleClass("addBorder");
                that.byId("VERSIONV").getLabelControl().removeStyleClass("addBorder");
                that.byId("SCENARIOV").getLabelControl().removeStyleClass("addBorder");
                that.byId("CLASSV").getLabelControl().removeStyleClass("addBorder");
                that.byId("CUSTOMER_GROUPV").getLabelControl().removeStyleClass("addBorder");
                that.byId("GEN_TYPEV").getLabelControl().removeStyleClass("addBorder");
                that.byId("DATE_RANGEV").getLabelControl().removeStyleClass("addBorder");
                that.byId("SINGLE_DATEV").getLabelControl().removeStyleClass("addBorder");
                that.byId("OPERATORV").getLabelControl().removeStyleClass("addBorder");
                //   that.byId("idRollingWeeksV").getLabelControl().removeStyleClass("addBorder");
                that.byId("Rolling_TimestampV").getLabelControl().removeStyleClass("addBorder");
                // that.byId("OVERRIDE_ASSIGNMENTV").getLabelControl().removeStyleClass("addBorder");
                that.byId("CRITICAL_ASSEMBLYV").getLabelControl().removeStyleClass("addBorder");
                that.byId("IMPACT_ANALYSISV").getLabelControl().removeStyleClass("addBorder");
                that.byId("DAILYV").getLabelControl().removeStyleClass("addBorder");
                that.byId("FULL_RUNV").getLabelControl().removeStyleClass("addBorder");
                that.byId("OptimizationV").getLabelControl().removeStyleClass("addBorder");
                that.byId("POptProfileV").getLabelControl().removeStyleClass("addBorder");
                that.byId("OptProfileV").getLabelControl().removeStyleClass("addBorder");
                // that.byId("OptAlgorithmV").getLabelControl().removeStyleClass("addBorder");
                // that.byId("OptFactorV").getLabelControl().removeStyleClass("addBorder");
                // that.byId("DsAlgorithmV").getLabelControl().removeStyleClass("addBorder");
                that.byId("SnapShotV").getLabelControl().removeStyleClass("addBorder");
                that.byId("SnapRV").getLabelControl().removeStyleClass("addBorder");
                that.byId("snapDescV").getLabelControl().removeStyleClass("addBorder");
                that.byId("HISTORY_WEEKSV").getLabelControl().removeStyleClass("addBorder");

            },

            onVariantSel:function(){
                that.variant = that.byId("idVarList").getSelectedItem().getCells();
            var selected = that.variant[0].getTitle();
            that.byId("idSave").setVisible(false);
                 sap.ui.core.BusyIndicator.show();
                // Calling service to get the Variant data
                this.getModel("JModel").read("/getVariantDetails", {
                    filters: [new Filter("VARIANT_NAME", FilterOperator.EQ, selected)],
                       headers: {
                    "x-user-id": that.getUser(),
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();                    
                       that.VariantData = oData.results;
                       that.byId("idVariant").setEditable(false);
                       that.byId("idVarDesc").setEditable(false);
                       that.byId("idVariant").setValue(that.variant[0].getTitle());
                       that.byId("idVarDesc").setValue(that.variant[0].getText());
                       that.OnClear();
                       that.setValues(that.VariantData);

                 },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });

            },

            onChangeVariant:function(oEvent){
                var variant = oEvent.getSource().getParent().getBindingContext().getObject();
            var selected = variant.VARIANT_NAME;
            var tooltip = oEvent.getSource().getTooltip();
            if(tooltip == "Delete"){
                    that.DeleteVariant(selected);
            } else {
                that.byId("idSave").setVisible(true);
                var selCell = parseInt(oEvent.getSource().getParent().getParent().sId.split("idVarList-")[1]);
                selCell !== undefined ? that.byId("idVarList").getItems()[selCell].setSelected(true) : that.byId("idVarList").removeSelections();
                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Variant data
                this.getModel("JModel").read("/getVariantDetails", {
                    filters: [new Filter("VARIANT_NAME", FilterOperator.EQ, selected)],
                       headers: {
                    "x-user-id": that.getUser(),
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();                    
                       that.VariantData = oData.results;
                    if(tooltip == "Edit"){
                       that.byId("idVariant").setEditable(false);
                       that.byId("idVarDesc").setEditable(false);
                       that.byId("idVariant").setValue(variant.VARIANT_NAME);
                       that.byId("idVarDesc").setValue(variant.VARIANT_DESC);
                       that.oGModel.setProperty("/type", "E");
                    } else if(tooltip == "Copy") {
                        that.byId("idVariant").setEditable(true);
                       that.byId("idVarDesc").setEditable(true);
                       that.byId("idVariant").setValue(variant.VARIANT_NAME + "_copy");
                       that.byId("idVarDesc").setValue(variant.VARIANT_DESC);
                       that.oGModel.setProperty("/type", "");
                    }
                    that.OnClear();
                       that.setValues(that.VariantData);

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
            } 

            },


            // getParameterData: function(activity){
            //     var template =  that.oGModel.getProperty("/selTemplate");
            //     var copyActivity = activity;

            //     sap.ui.core.BusyIndicator.show();
            //     that.getModel("JModel").read("/readTemplateItemsParams", {
            //         filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, template),
            //         new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")], and:true,
            //         success: function (oData) {
            //             sap.ui.core.BusyIndicator.hide();
            //             // that.TempParams = [];
            //             for (var i = 0; i < oData.results.length; i++) {
            //                 var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === oData.results[i].ACTIVITY_ID &&
            //                                                            e.ACT_POSITION === oData.results[i].ACT_POSITION );

            //                 var test = oData.results[i].PARAMETER_ID;
            //                     if(test === "LOCATION_ID" || test === "PRODUCT_ID"){
            //                         var temp = oData.results[i].VALUE;
            //                         var aray = Array.isArray(temp);
            //                         if(aray === false){

            //                         if(temp.includes(",") && temp !== ""){
            //                             oData.results[i].VALUE = oData.results[i].VALUE.split(",");
            //                         } else {
            //                             oData.results[i].VALUE = [];
            //                             oData.results[i].VALUE.push(temp);
            //                         }
            //                     }
            //                     }
            //                 if (index === -1) {
                                
            //                     var obj = {
            //                         TEMPLATE_ID: oData.results[i].TEMPLATE_ID,                                    
            //                         ACTIVITY_ID: oData.results[i].ACTIVITY_ID,
            //                         ACT_POSITION: oData.results[i].ACT_POSITION,
            //                         [test]: oData.results[i].VALUE,
            //                     }
            //                     that.TempParams.push(obj);
            //                 } else {
            //                     var test = oData.results[i].PARAMETER_ID;
            //                     that.TempParams[index][test] = oData.results[i].VALUE;
            //                 }
            //             }

            //             var obj = {
            //                 MF_LOCATION_ID: [],
            //                 LOCATION_ID: [],
            //                 PRODUCT_ID: [],
            //                 CONFIG_PRODUCT: [],
            //                 PARTIAL_PRODUCT:[],
            //                 PREDICTION_PROFILE: "",
            //                 FORECAST_ALGORITHM: "",
            //                 VERSION: "",
            //                 SCENARIO: "",
            //                 CUSTOMER_GROUP: "",
            //                 CLASS: "",
            //                 CRITICAL_ASSEMBLY: "",
            //                 IMPACT_ANALYSIS: "",
            //                 DAILY: "",
            //                 OVERRIDE_ASSIGNMENT: "",
            //                 GEN_TYPE: "",
            //                 MODEL_VERSION: "",
            //                 FROM_DATE: "",
            //                 TO_DATE: "",
            //                 OPERATOR: "",
            //                 SINGLE_DATE: "",
            //                 Rolling: "",
            //                 Rolling_Timestamp: "",
            //                 DsAlgorithm: "",
            //                 OptFactor: "",
            //                 OptAlgorithm: "",
            //                 SnapShot: "",
            //                 SnapShot_Desc: "",
            //                 HISTORY_WEEKS: ""
            //             }
                
            //             that.JobData = that.TempParams;
            //             // that.TempParams =[];
                        
                
            //             for (var i = 0; i < that.JobData.length; i++) {
                
            //                 Object.entries(that.JobData[i]).forEach(x => {
            //                     var test = x[0];
                
            //                     if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID" && x[0] !== "ACT_POSITION" && x[0] !== "actlevel" && 
            //                             x[0] !== "LEVEL" && x[0] !== "counter" && x[0] !== "newStep") {
                
            //                             if(x[0] === "MF_LOCATION_ID" || x[0] === "LOCATION_ID" || x[0] === "PRODUCT_ID" || x[0] === "PARTIAL_PRODUCT" || x[0] === "CONFIG_PRODUCT"){
                
            //                                 if(x[1].length > 0 || x[1] !== ""){
            //                                     if(x[0] === "PRODUCT_ID" || x[0] === "PARTIAL_PRODUCT" || x[0] === "CONFIG_PRODUCT"){
            //                                         x[1] = x[1].includes(",") === true ? x[1].split(","): x[1];
            //                                     }
            //                                     obj[test] = obj[test].concat(x[1]);
            //                                 }
            //                             } else {
            //                                 obj[test] = x[1];
            //                             }
                                    
            //                     }
            //                 })
            //             }
                
                
            //             obj.MF_LOCATION_ID =[...new Set(obj.MF_LOCATION_ID.filter(item => item !== ""))];
            //             obj.LOCATION_ID = [...new Set(obj.LOCATION_ID.filter(item => item !== ""))];
            //             obj.PRODUCT_ID = [...new Set(obj.PARTIAL_PRODUCT.filter(item => item !== ""))];
            //             var data =[];
            //             // obj.PARTIAL_PRODUCT = obj.PRODUCT_ID;
                
            //             obj.PRODUCT_ID.forEach(function(el){
            //                 var data = that.ConfProdall.filter(e=> e.PRODUCT_ID === el);
            //                 obj.CONFIG_PRODUCT.push(data[0].REF_PRODID);
            //             });
            //             obj.CONFIG_PRODUCT = [...new Set(obj.CONFIG_PRODUCT.filter(item => item !== ""))];
                
                
            //             that.setValues(obj);

            //         },
            //         error: function (error) {
            //             sap.ui.core.BusyIndicator.hide();
            //             MessageToast.show("Failed to get data");
            //         },
            //     });

            // },

            setValues: function (obj) {

                for(var i=0; i<obj.length; i++){
                    var param = obj[i].PARAMETER_ID;
                    var val = obj[i].VALUE;

                    switch (param) {
                        case "MF_LOCATION_ID":
                            if(val !== ""){
                                val = val.split(",");

                                // var temp = removeDuplicate(tempCprodData, 'cProd');
                                val.forEach(function (oItem, i) {
                                    that.byId("MFLInputV").addToken(
                                        new sap.m.Token({
                                            key: oItem,
                                            text: oItem,
                                            editable: false,
                    
                                        })
                                    );
                    
                                });
                            }
                            break;
                        case "LOCATION_ID":
                            if(val !== ""){
                                val = val.split(",");
                                val.forEach(function (oItem, i) {
                                            that.byId("DlocInputV").addToken(
                                                new sap.m.Token({
                                                    key: oItem,
                                                    text: oItem,
                                                    editable: false,
                            
                                                })
                                            );
                            
                                        });
                            }
                            break;
                        case "CONFIG_PRODUCT" : 
                            if(val !== ""){
                                val = val.split(",");
                                val.forEach(function (oItem, i) {
                                            that.byId("CprodInputV").addToken(
                                                new sap.m.Token({
                                                    key: oItem,
                                                    text: oItem,
                                                    editable: false,                
                                                })
                                            );                
                                        });
                            }
                            break;
                        case "PARTIAL_PRODUCT" :
                            if(val !== ""){
                                val = val.split(",");
                                val.forEach(function (oItem, i) {
                                        that.byId("PprodInputV").addToken(
                                            new sap.m.Token({
                                                key: oItem,
                                                text: oItem,
                                                editable: false,                
                                            })
                                        );                
                                    });
                            }
                            break;
                        case "CUSTOMER_GROUP" :
                            if(val !== ""){
                                val = val.split(",");
                                val.forEach(function (oItem, i) {
                                            that.byId("custGrpInputV").addToken(
                                                new sap.m.Token({
                                                    key: oItem,
                                                    text: oItem,
                                                    editable: false,                
                                                })
                                            );                
                                        });
                            }
                            break;   
                        case "PREDICTION_PROFILE" :
                            if(val !== ""){
                                that.byId("PrePFInputV").setValue(val);
                            }
                            break;
                        case "FORECAST_ALGORITHM" : 
                            if(val !== ""){
                                that.byId("ForeAlgInputV").setValue(val);
                            }
                            break;
                        case "VERSION" : 
                            if(val !== ""){
                                that.byId("idverV").setValue(val);
                            }
                            break;
                        case "SCENARIO" : 
                            if(val !== ""){
                                that.byId("idscenV").setValue(val);
                            }
                            break;
                        case "CLASS" : 
                            if(val !== ""){
                                
                                val = val.split(",");

                                // var temp = removeDuplicate(tempCprodData, 'cProd');
                                val.forEach(function (oItem, i) {
                                    that.byId("classInputV").addToken(
                                        new sap.m.Token({
                                            key: oItem,
                                            text: oItem,
                                            editable: false,
                    
                                        })
                                    );
                    
                                });                            
                            }
                            break;
                        case "FROM_DATE" : 
                            if(val !== ""){
                                that.byId("FromDateV").setValue(val);
                                // that.byId("ToDateV").setValue(obj.TO_DATE);
                            }
                            break;
                        case "TO_DATE" : 
                            if(val !== ""){
                                that.byId("ToDateV").setValue(val);
                            }
                            break;
                        case "SINGLE_DATE" : 
                           
                                that.byId("singleDtV").setValue(val);
                            
                            break;
                        case "Rolling_Timestamp" : 
                            if(val !== ""){
                                that.byId("idRollingWeeksV").setValue(val);
                            }
                            break;
                        case "HISTORY_WEEKS" : 
                            if(val !== ""){
                                that.byId("idWeeksV").setValue(val);
                            }
                            break;
                        case "CRITICAL_ASSEMBLY" : 
                            if(val === "X" || val === "true" || val === true){
                               that.byId("idCriticalV").setSelected(true);
                            } else {
                                that.byId("idCriticalV").setSelected(false);
                            }
                            break;
                        case "IMPACT_ANALYSIS" : 
                            if( val === "true" || val === true){
                               that.byId("idImpactV").setSelected(true);
                            } else {
                                that.byId("idImpactV").setSelected(false);
                            }
                            break;
                        case "DAILY" : 
                            if( val === "true" || val === true){
                               that.byId("idDailyV").setSelected(true);
                            } else {
                                that.byId("idDailyV").setSelected(false);
                            }
                            break;
                        case "FULL_RUN" : 
                            if( val === "true" || val === true){
                               that.byId("idFullrunV").setSelected(true);
                            } else {
                                that.byId("idFullrunV").setSelected(false);
                            }
                            break;
                         
                        case "Rolling" : 
                            if( val === "" || val === false || val === "false"){
                                obj.Rolling = false;
                                that.byId("idRollingWeeksV").setVisible(false);
                                that.byId("FromDateV").setEditable(true);
                                that.byId("ToDateV").setEditable(true);
                                that.byId("idRollingV").setSelected(false);
                            } else if (val === "true" || val === true) {
                                obj.SnapShot = true;
                                that.byId("idRollingWeeksV").setVisible(true);
                                that.byId("FromDateV").setEditable(false);
                                that.byId("ToDateV").setEditable(false);
                                that.byId("idRollingV").setSelected(true);
                            }                            
                            break;
                        case "SnapShot" : 
                            if( val === "" || val === false){
                                that.byId("idSnapShotV").setSelected(false);
                                that.byId("idSnapDescV").setVisible(false);
                                that.byId("SnapRV").setVisible(false);
                                that.byId("snapDescV").setVisible(false);
                            } else if (val === "true" || val == true || val == "C") {
                                that.byId("idSnapShotV").setSelected(true);
                                that.byId("SnapRV").setVisible(true);
                                that.byId("idSnapRadioV").setSelectedButton(that.byId("createV"));
                                that.byId("snapDescV").setVisible(true);
                                that.byId("idSnapDescV").setVisible(true);
                            }
                            else if(val == "U"){
                                that.byId("idSnapShotV").setSelected(true);
                                that.byId("idSnapRadioV").setSelectedButton(that.byId("updateV"));
                                that.byId("snapDescV").setVisible(true);
                                that.byId("idSnapDescV").setVisible(true);
                            }
                            break;
                        case "SnapShot_Desc" : 
                            that.byId("idSnapDescV").setValue(val);
                            
                            break;
                        case "OPERATOR" : 
                             that.byId("idOperatorV").setSelectedKey(val);
                             break;
                        case "MODEL_VERSION" :
                            that.byId("idModelVerV").setSelectedKey(val);
                            break;
                        case "GEN_TYPE" : 
                            that.byId("GenidTypeV").setSelectedKey(val);
                            break;
                        case "Optimizations" :
                            if (val === true || val === "true") {
                                that.byId("PidOptimizationV").setSelected(true);
                                that.byId("PidOptProfileV").setEnabled(true);
                            } else {
                                that.byId("PidOptimizationV").setSelected(false);
                                that.byId("PidOptProfileV").setEnabled(false);
                            }
                            break;
                        case "POptProfile" : 
                            that.byId("PidOptProfileV").setSelectedKey(val);
                            break;
                        case "OptProfile" : 
                            that.byId("idOptProfileV").setSelectedKey(val);
                            break;
                    }
                
                

                
                // if (obj.Rolling === "" || obj.Rolling === "false" || obj.Rolling === false) {
                //     obj.Rolling = false;
                // } else if (obj.Rolling === "true" || obj.Rolling === true) {
                //     obj.Rolling = true;
                //     that.byId("idRollingWeeksV").setVisible(true);
                //     that.byId("FromDateV").setEditable(false);
                //     that.byId("ToDateV").setEditable(false);
                // }
                // that.byId("idSnapShotV").setSelected(obj.SnapShot);
                // that.byId("idSnapDescV").setValue(obj.SnapShot_Desc);
                // that.byId("idRollingV").setSelected(obj.Rolling);

                // that.byId("idOperatorV").setSelectedKey(obj.OPERATOR);
                // that.byId("idModelVerV").setSelectedKey(obj.MODEL_VERSION);
                // that.byId("GenidTypeV").setSelectedKey(obj.GEN_TYPE);
                // // that.byId("PidDSAlgV").setSelectedKey(obj.DsAlgorithm);
                // // that.byId("PidOptFctV").setSelectedKey(obj.OptFactor);
                // // that.byId("PidOptAlgV").setSelectedKey(obj.OptAlgorithm);
                // if (obj.Optimization === true || obj.Optimization === "true") {
                //     that.byId("PidOptimizationV").setSelected(true);
                //     that.byId("PidOptProfileV").setEnabled(true);
                // } else {
                //     that.byId("PidOptimizationV").setSelected(false);
                //     that.byId("PidOptProfileV").setEnabled(false);
                // }
                // that.byId("PidOptProfileV").setSelectedKey(obj.POptProfile);
                // that.byId("idOptProfileV").setSelectedKey(obj.OptProfile);

                }
                
                
                // that.byId("idscenV").setValue(obj.SCENARIO);
                // that.byId("classInputV").setValue(obj.CLASS);
                // that.byId("FromDateV").setValue(obj.FROM_DATE);
                // that.byId("ToDateV").setValue(obj.TO_DATE);
                // that.byId("singleDtV").setValue(obj.SINGLE_DATE);
                // that.byId("idRollingWeeksV").setValue(obj.Rolling_Timestamp);
                // that.byId("idWeeksV").setValue(obj.HISTORY_WEEKS);
                // if (obj.CRITICAL_ASSEMBLY === "X") {
                //     that.byId("idCriticalV").setSelected(true);
                // } else {
                //     that.byId("idCriticalV").setSelected(false);
                // }
                // if(obj.IMPACT_ANALYSIS === true || obj.IMPACT_ANALYSIS === "true"){
                //     that.byId("idImpactV").setSelected(true);
                // } else {
                //     that.byId("idImpactV").setSelected(false);
                // }
                // if(obj.DAILY === true || obj.DAILY === "true"){
                //     that.byId("idDailyV").setSelected(true);
                // } else {
                //     that.byId("idDailyV").setSelected(false);
                // }
                
                // if (obj.SnapShot === "" || obj.SnapShot === "false") {
                //     obj.SnapShot = false;
                // } else if(obj.SnapShot === "true"){
                //     obj.SnapShot = true;
                // }
                // if (obj.Rolling === "" || obj.Rolling === "false") {
                //     obj.Rolling = false;
                // } else if(obj.Rolling === "true" ){
                //     obj.Rolling = true;
                // }
                // that.byId("idSnapShotV").setSelected(obj.SnapShot);
                // that.byId("idSnapDescV").setValue(obj.SnapShot_Desc);
                // that.byId("idRollingV").setSelected(obj.Rolling);
        
                // that.byId("idOperatorV").setSelectedKey(obj.OPERATOR);
                // that.byId("idModelVerV").setSelectedKey(obj.MODEL_VERSION);
                // that.byId("GenidTypeV").setSelectedKey(obj.GEN_TYPE);
                
        
            },

            // onTempNameChange:function(){
            //     var TempId = that.byId("idTemp").getValue();
            //     var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    
            //     var SChType = specials.test(TempId);
            //     that.byId("idTemp").setValue(TempId.toUpperCase());
            //     if (SChType === true) {
            //         MessageToast.show("Special characters are not allowed");
            //         that.byId("idTemp").setValueState("Error");
            //         that.byId("idFooter").setVisible(false);
            //     } else {

            //         that.byId("idTemp").setValueState("None");
            //         that.byId("idFooter").setVisible(true);
            //     }

            // },

            // Open the template creation fragment to add the stpes
            // onMaintain:function(){
            //     // that.TempJSON = [];
            //     var TempId = that.byId("idTemp").getValue();
            //     // TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
            //     // TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());
            //     var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    
            //     var SChType = specials.test(TempId);
    
            //     if (SChType === true) {
            //         MessageToast.show("Special characters are not allowed");
            //         return;
            //     }

            //     that.byId("idTemp").setValue(TempId);
            //     var selType = that.oGModel.getProperty("/type");
            //     var index = 0;
            //     if(TempId !== "" && TempId.length < 50){
            //         that.TempJSON = $.extend(true, [], that.oModel.oData.results);
            //     that.TemplateModel.setData({
            //             results: that.TempJSON,
            //         });
            //         sap.ui.getCore().byId("idTabTemplate").setModel(that.TemplateModel);
            //         sap.ui.getCore().byId("idTabTemplate").removeSelections(true);

            //         if(that.TempJSON.length > 0){
            //             that.getParamsData();
            //             that.maintainFlag = 'X';
            //         } else {
            //             that.maintainFlag = '';
            //         }
            //         sap.ui.core.BusyIndicator.show();
            //         that.getModel("JModel").read("/readTemplates", {
            //             filters: [
            //                 new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
            //             ],
            //             success: function (oData) {
            //             sap.ui.core.BusyIndicator.hide();
            //             that.Templates = oData.results;
            //             var selKey = that.oGModel.getProperty("/auth");
            //             if(selKey === "I"){
        
            //                 var TableData = oData.results.filter(function (aComp) {
            //                   return aComp.LEVEL === "I" ;
            //               });
        
            //               that.TemplateModelSel.setData({
            //                 results: TableData,
            //             });
            //             sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);
        
            //               } else if(selKey === "E"){
            //                 var TableData = oData.results.filter(function (aComp) {
            //                   return aComp.LEVEL === "E" ;
            //               });
        
            //               that.TemplateModelSel.setData({
            //                 results: TableData,
            //             });
            //             sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);
        
            //               }



            //             // that.TemplateModelSel.setData({
            //             //     results: oData.results,
            //             // });
            //             // sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);
                        
            //             if(selType !== "E"){
            //              index = oData.results.findIndex(e => e.TEMPLATE_ID === TempId);
            //             } else {
            //                 index = -1;
            //             }

            //             if(index === -1){
            //                 that._templateDialog.open();
                          
            //                 that.TempParams.forEach(function(row){
            //                     row.newStep = "";
            //                 });
            //             } else {
            //                 MessageToast.show("Given template name is already in use, Please change the name.");
            //                 }
            
            //             },
            //             error: function (error) {
            //             sap.ui.core.BusyIndicator.hide();
            //             MessageToast.show("Failed to get data");
            //             },
            //         });
            //     } else {
            //         MessageToast.show("Please maintain Job Template name which should be length lessthen 50 characters");
            //     }
            // },

            getParamsData:function(){
                that = this;
                var manuLocation = [];
                var demandLocation = [];
                var ConfProd = [];
                var product = [];
                var custGroupData = [];
                var classData = [];
                // var demandLocation = core.byId("MFLInputVU").getTokens();
                // var product = core.byId("CprodInputVU").getTokens();

                // Manufacturing Locations
                if (that.byId("MFLInputV").getTokens().length > 0) {
                    var maloc = that.byId("MFLInputV").getTokens();
                    for (var i = 0; i < maloc.length; i++) {
                        var obj = {
                            FACTORY_LOC: maloc[i].getText()
                        };
                        manuLocation.push(obj);
                    }

                } 
            

                that.oGModel.setProperty("/manuLocation", manuLocation);

                // Demand Locations
                if (that.byId("DlocInputV").getTokens().length > 0) {
                    var deLoc = that.byId("DlocInputV").getTokens();
                    for (var i = 0; i < deLoc.length; i++) {
                        var obj = {
                            FACTORY_LOC: deLoc[i].getKey(),
                            DEMAND_LOC: deLoc[i].getText(),

                        };
                        demandLocation.push(obj);
                    }
                }
            

                that.oGModel.setProperty("/demandLocation", demandLocation);

                // Conf Products
                if (that.byId("CprodInputV").getTokens().length > 0) {
                    var pro = that.byId("CprodInputV").getTokens();
                    for (var i = 0; i < pro.length; i++) {
                        var obj = {
                            DEMAND_LOC: pro[i].getKey(),
                            REF_PRODID: pro[i].getText()
                        };
                        ConfProd.push(obj);                        

                    }
                    
                }
            
                that.oGModel.setProperty("/ConfProd", ConfProd);

                // Products
                if (that.byId("PprodInputV").getTokens().length > 0) {
                    var pro = that.byId("PprodInputV").getTokens();
                    for (var i = 0; i < pro.length; i++) {
                        var obj = {
                            REF_PRODID: pro[i].getKey(),
                            PRODUCT_ID: pro[i].getText()
                        };
                        product.push(obj);
                    }
                }
            
                that.oGModel.setProperty("/product", product);

                if (that.byId("custGrpInputV").getTokens().length > 0) {
                    var pro = that.byId("custGrpInputV").getTokens();
                    for (var i = 0; i < pro.length; i++) {
                        var obj = {
                            CUSTOMER_GROUP: pro[i].getKey()
                        };
                        custGroupData.push(obj);
                    }
                }
                    that.oGModel.setProperty("/custGroupData", custGroupData);

                   var critical =  '';
                   if(that.byId("idCriticalV").getSelected() == true){
                        critical = "X";
                   }

                   
                   if (that.byId("classInputV").getTokens().length > 0) {
                    var cls = that.byId("classInputV").getTokens();
                    for (var i = 0; i < cls.length; i++) {
                        var obj = {
                            CLASS: cls[i].getKey()
                        };
                        classData.push(obj);
                    }
                }
                    that.oGModel.setProperty("/classData", classData);

                    var  snapS = ""
                    if(that.byId("idSnapShotV").getSelected() == true){
                     snapS = that.byId("idSnapRadioV").getSelectedButton().getText() == 'Create' ? 'C' : 'U';

                }

                var that = that;
                var otherParams = {

                    PREDICTION_PROFILE: that.byId("PrePFInputV").getValue(),
                    FORECAST_ALGORITHM : that.byId("ForeAlgInputV").getValue(),
                    VERSION: that.byId("idverV").getValue(),
                    SCENARIO: that.byId("idscenV").getValue(),
                    // CLASS: that.byId("classInputV").getValue(),
                    // CUSTOMER_GROUP: that.byId("custGrpInputV").getValue(),
                    FROM_DATE: that.byId("FromDateV").getValue(),
                    TO_DATE: that.byId("ToDateV").getValue(),
                    SINGLE_DATE: that.byId("singleDtV").getValue(),
                    HISTORY_WEEKS: that.byId("idWeeksV").getValue(),
                    // OVERRIDE_ASSIGNMENT: that.byId("idOverrideV").getSelected(),
                    CRITICAL_ASSEMBLY: critical,
                    IMPACT_ANALYSIS: that.byId("idImpactV").getSelected(),
                    DAILY: that.byId("idDailyV").getSelected(),
                    SnapShot: snapS,
                    SnapShot_Desc: that.byId("idSnapDescV").getValue(),
                    Rolling: that.byId("idRollingV").getSelected(),
                    Rolling_Timestamp: that.byId("idRollingWeeksV").getValue(),

                    OPERATOR: that.byId("idOperatorV").getSelectedKey(),
                    MODEL_VERSION: that.byId("idModelVerV").getSelectedKey(),
                    GEN_TYPE: that.byId("GenidTypeV").getSelectedKey(),
                    // DsAlgorithm: that.byId("PidDSAlg").getSelectedKey(),
                    // OptFactor: that.byId("PidOptFct").getSelectedKey(),
                    // OptAlgorithm: that.byId("PidOptAlg").getSelectedKey(),
                    FULL_RUN : that.byId("idFullrunV").getSelected(),
                    Optimizations : that.byId("PidOptimizationV").getSelected(),
                    POptProfile:  that.byId("PidOptProfileV").getSelectedKey(),
                    OptProfile: that.byId("idOptProfileV").getSelectedKey()
                    



                    

                }
                that.oGModel.setProperty("/otherParams", otherParams);



            },

            OnClear:function(oEvent){
                    if(oEvent && oEvent.getSource().getText() == "Create"){
                         that.oGModel.setProperty("/type", "");
                         that.byId("idSave").setVisible(true);
                        that.byId("idVarList").removeSelections(true)
                        that.byId("idVariant").setEditable(true);
                       that.byId("idVarDesc").setEditable(true);
                       that.byId("idVariant").setValue();
                       that.byId("idVarDesc").setValue();
                    }

                that.byId("MFLInputV").setValue();
                that.byId("DlocInputV").setValue();
                that.byId("CprodInputV").setValue();
                that.byId("PprodInputV").setValue();
                // that.byId("MODEL_VERSION").setValue();
                that.byId("PrePFInputV").setValue();
                that.byId("ForeAlgInputV").setValue();
                that.byId("idverV").setValue();
                that.byId("idscenV").setValue();
                that.byId("classInputV").setValue();
                that.byId("custGrpInputV").setValue();
                that.byId("FromDateV").setValue();
                that.byId("ToDateV").setValue();
                that.byId("singleDtV").setValue();
                that.byId("idRollingWeeksV").setValue();
                that.byId("idSnapDescV").setValue();
                that.byId("idWeeksV").setValue();
                // that.byId("idOverrideV").setSelected(false);
                that.byId("idCriticalV").setSelected(false);
                that.byId("idImpactV").setSelected(false);
                that.byId("idDailyV").setSelected(false);
                that.byId("idSnapShotV").setSelected(false);
                that.byId("idRollingV").setSelected(false);
                that.byId("idFullrunV").setSelected(false);
                that.byId("PidOptimizationV").setSelected(false);
                that.byId("snapDescV").setVisible(false);
                that.byId("SnapRV").setVisible(false);
                that.byId("idRollingWeeksV").setVisible(false);


                that.byId("CprodInputV").removeAllTokens();
                that.byId("MFLInputV").removeAllTokens();
                that.byId("PprodInputV").removeAllTokens();
                that.byId("DlocInputV").removeAllTokens();
                that.byId("custGrpInputV").removeAllTokens();
                that.byId("classInputV").removeAllTokens();
                that.byId("PidOptProfileV").setSelectedKey(that.byId("PidOptProfileV").getItems()[0]);
                that.byId("idOptProfileV").setSelectedKey(that.byId("idOptProfileV").getItems()[0]);

                    that.removeStyleclass();
            },

            onListSearch:function(oEvent){
            var sQuery = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    sId = that.byId("idVarList").getVisible(),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";
                // Location
                if (sId == true) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("VARIANT_NAME", FilterOperator.Contains, sQuery),
                                    new Filter( "VARIANT_DESC", FilterOperator.Contains, sQuery
                                    ),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.byId("idVarList").getBinding("items").filter(oFilters);
                    // Location
                } else  {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("ACTIVITY_ID", FilterOperator.Contains, sQuery),
                                    new Filter("ACTIVITY_DESC", FilterOperator.Contains,sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    that.byId("idJobList").getBinding("items").filter(oFilters);
                    // Product
                }


            },


            setData: function(){
                var otherparams = that.oGModel.getProperty("/otherParams");
                var obj = {
                    MF_LOCATION_ID: [],
                    LOCATION_ID: [],
                    PRODUCT_ID: [],
                    CONFIG_PRODUCT: [],
                    PREDICTION_PROFILE: otherparams.PREDICTION_PROFILE,
                    FORECAST_ALGORITHM: otherparams.FORECAST_ALGORITHM,
                    VERSION: otherparams.VERSION,
                    SCENARIO: otherparams.SCENARIO,
                    CUSTOMER_GROUP: [],
                    CLASS: otherparams.CLASS,
                    CRITICAL_ASSEMBLY: otherparams.CRITICAL_ASSEMBLY,
                    IMPACT_ANALYSIS: otherparams.IMPACT_ANALYSIS,
                    DAILY: otherparams.DAILY,
                    OVERRIDE_ASSIGNMENT: otherparams.OVERRIDE_ASSIGNMENT,
                    GEN_TYPE: otherparams.GEN_TYPE,
                    MODEL_VERSION: otherparams.MODEL_VERSION,
                    FROM_DATE: otherparams.FROM_DATE,
                    TO_DATE: otherparams.TO_DATE,
                    OPERATOR: otherparams.OPERATOR,
                    SINGLE_DATE: otherparams.SINGLE_DATE,
                    Rolling: otherparams.Rolling,
                    Rolling_Timestamp: otherparams.Rolling_Timestamp,
                    // DsAlgorithm: otherparams.DsAlgorithm,
                    // OptFactor: otherparams.OptFactor,
                    // OptAlgorithm: otherparams.OptAlgorithm,
                    SnapShot: otherparams.SnapShot,
                    SnapShot_Desc: otherparams.SnapShot_Desc,
                    HISTORY_WEEKS: otherparams.HISTORY_WEEKS
                }

                that.byId("PrePFInputV").setValue(obj.PREDICTION_PROFILE);
                that.byId("ForeAlgInputV").setValue(obj.FORECAST_ALGORITHM);
                that.byId("idverV").setValue(obj.VERSION);
                that.byId("idscenV").setValue(obj.SCENARIO);
                that.byId("classInputV").setValue(obj.CLASS);
                // that.byId("custGrpInputV").setValue(obj.CUSTOMER_GROUP);
            
                // that.byId("GenidTypeV").setValue(obj.GEN_TYPE);
                that.byId("FromDateV").setValue(obj.FROM_DATE);
                that.byId("ToDateV").setValue(obj.TO_DATE);
                that.byId("singleDtV").setValue(obj.SINGLE_DATE);
                that.byId("idRollingWeeksV").setValue(obj.Rolling_Timestamp);
                that.byId("GenidTypeV").setSelectedKey(obj.GEN_TYPE);
                that.byId("idModelVerV").setSelectedKey(obj.MODEL_VERSION);
                that.byId("idOperatorV").setSelectedKey(obj.OPERATOR);
                that.byId("PidDSAlg").setSelectedKey(obj.DsAlgorithm);
                that.byId("PidOptAlg").setSelectedKey(obj.OptAlgorithm);
                that.byId("PidOptFct").setSelectedKey(obj.OptFactor);
                // that.byId("idOverrideV").setSelected(obj.OVERRIDE_ASSIGNMENT);
                that.byId("idCriticalV").setSelected(obj.CRITICAL_ASSEMBLY);
                that.byId("idImpactV").setSelected(obj.IMPACT_ANALYSIS);
                that.byId("idDailyV").setSelected(obj.DAILY);
                that.byId("idRollingV").setSelected(obj.Rolling);
                that.byId("idSnapShotV").setSelected(obj.SnapShot);
                that.byId("idSnapDescV").setValue(obj.SnapShot_Desc);
                that.byId("idWeeksV").setValue(obj.idWeeksV);


                var MFdata = that.oGModel.getProperty("/manuLocation");
                var DLdata = that.oGModel.getProperty("/demandLocation");
                var CPdata = that.oGModel.getProperty("/ConfProd");
                var PPdata = that.oGModel.getProperty("/product");
                var CGdata = that.oGModel.getProperty("/customer");

                if (that.byId("MF_LOCATIONV").getVisible()) {
                    MFdata.forEach(function (oItem, i) {
                        that.byId("MFLInputV").addToken(
                            new sap.m.Token({
                                key: oItem.FACTORY_LOC,
                                text: oItem.FACTORY_LOC,
                                editable: false,
                            })
                        );        
                    });
                }

                if (that.byId("DM_LOCATIONV").getVisible()) {
                    DLdata.forEach(function (oItem, i) {
                        that.byId("DlocInputV").addToken(
                            new sap.m.Token({
                                key: oItem.FACTORY_LOC,
                                text: oItem.DEMAND_LOC,
                                editable: false,
                            })
                        );        
                    });
                }

                if (that.byId("CONFIG_PRODUCTV").getVisible()) {
                    CPdata.forEach(function (oItem, i) {
                        that.byId("CprodInputV").addToken(
                            new sap.m.Token({
                                key: oItem.DEMAND_LOC,
                                text: oItem.REF_PRODID,
                                editable: false,
                            })
                        );        
                    });
                }

                if (that.byId("PARTIAL_PRODUCTV").getVisible()) {
                    PPdata.forEach(function (oItem, i) {
                        that.byId("PprodInputV").addToken(
                            new sap.m.Token({
                                key: oItem.REF_PRODID,
                                text: oItem.PRODUCT_ID,
                                editable: false,
                            })
                        );        
                    });
                }

                if (that.byId("CUSTOMER_GROUPV").getVisible()) {
                    CGdata.forEach(function (oItem, i) {
                        that.byId("custGrpInputV").addToken(
                            new sap.m.Token({
                                key: oItem.CUSTOMER_GROUP,
                                text: oItem.CUSTOMER_GROUP,
                                editable: false,
                            })
                        );        
                    });
                }

            },


        //      // Highlighting the inputs on selection of step.
        // onActivityPress: function (oEvent) {
        //     var params = [];
        //     if (oEvent) {
        //         var selected = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText().trim();
        //         params = that.params.filter(el => el.ACTIVITY_ID === selected);
        //     }

        //     that.byId("MF_LOCATION").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("DM_LOCATION").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("CONFIG_PRODUCT").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("PARTIAL_PRODUCT").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("MODEL_VERSION").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("PREDICTION_PROFILE").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("FORECAST_ALGORITHM").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("VERSION").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("SCENARIO").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("CLASS").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("CUSTOMER_GROUP").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("GEN_TYPE").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("DATE_RANGE").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("SINGLE_DATE").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("OPERATOR").getLabelControl().removeStyleClass("addBorder");
        //     //   that.byId("idRollingWeeksV").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("Rolling_Timestamp").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("OVERRIDE_ASSIGNMENT").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("CRITICAL_ASSEMBLY").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("IMPACT_ANALYSIS").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("DAILY").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("OptAlgorithm").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("OptFactor").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("DsAlgorithm").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("SnapShot").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("SnapR").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("snapDesc").getLabelControl().removeStyleClass("addBorder");
        //     that.byId("HISTORY_WEEKS").getLabelControl().removeStyleClass("addBorder");

        //     for (var i = 0; i < params.length; i++) {

        //         switch (params[i].PARAMETER_ID) {
        //         case "MF_LOCATION":
        //             that.byId("MF_LOCATION").getLabelControl().addStyleClass("addBorder");
        //             that.byId("DM_LOCATION").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "DM_LOCATION":
        //             that.byId("DM_LOCATION").getLabelControl().addStyleClass("addBorder");
        //             that.byId("MF_LOCATION").getLabelControl().addStyleClass("addBorder");

        //             break;
        //         case "CONFIG_PRODUCT":
        //         case "PARTIAL_PRODUCT":
        //             that.byId("CONFIG_PRODUCT").getLabelControl().addStyleClass("addBorder");
        //             that.byId("PARTIAL_PRODUCT").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "MODEL_VERSION":
        //             that.byId("MODEL_VERSION").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "PREDICTION_PROFILE":
        //             that.byId("PREDICTION_PROFILE").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "FORECAST_ALGORITHM":
        //             that.byId("FORECAST_ALGORITHM").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "VERSION":
        //             that.byId("VERSION").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "SCENARIO":
        //             that.byId("SCENARIO").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "CLASS":
        //             that.byId("CLASS").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "CUSTOMER_GROUP":
        //             that.byId("CUSTOMER_GROUP").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "GEN_TYPE":
        //             that.byId("GEN_TYPE").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "DATE_RANGE":
        //             that.byId("DATE_RANGE").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "OPERATOR":
        //             that.byId("OPERATOR").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "Rolling_Timestamp":
        //             that.byId("Rolling_Timestamp").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "OVERRIDE_ASSIGNMENT":
        //             that.byId("OVERRIDE_ASSIGNMENT").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "CRITICAL_ASSEMBLY":
        //             that.byId("CRITICAL_ASSEMBLY").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "IMPACT_ANALYSIS":
        //             that.byId("IMPACT_ANALYSIS").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "DAILY":
        //             that.byId("DAILY").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "OptAlgorithm":
        //             that.byId("OptAlgorithm").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "OptFactor":
        //             that.byId("OptFactor").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "DsAlgorithm":
        //             that.byId("DsAlgorithm").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "SnapShot":
        //             that.byId("SnapShot").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "SnapR":
        //             that.byId("SnapR").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "snapDesc":
        //             that.byId("snapDesc").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         case "HISTORY_WEEKS":
        //             that.byId("HISTORY_WEEKS").getLabelControl().addStyleClass("addBorder");
        //             break;
        //         }
        //     }

        // },

        //     // Changing the parameters tab based on selected step in view
        //     onStepName:function(oEvent){
        //         // // if(oEvent){
        //             var object = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject();
        //         var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
        //         var step = that.byId("idStepList").getSelectedItems()[0].getCells();
        //         var counter = object.counter;
                
        //         // Inputs Visible
        //         that.byId("MF_LOCATION").setVisible(false);
        //         that.byId("DM_LOCATION").setVisible(false);
        //         that.byId("CONFIG_PRODUCT").setVisible(false);
        //         that.byId("PARTIAL_PRODUCT").setVisible(false);
        //         that.byId("MODEL_VERSION").setVisible(false);
        //         that.byId("PREDICTION_PROFILE").setVisible(false);
        //         that.byId("VERSION").setVisible(false);
        //         that.byId("SCENARIO").setVisible(false);
        //         that.byId("CLASS").setVisible(false);
        //         that.byId("CUSTOMER_GROUP").setVisible(false);
        //         that.byId("GEN_TYPE").setVisible(false);
        //         that.byId("OPERATOR").setVisible(false);
        //         that.byId("DATE_RANGE").setVisible(false);
        //         that.byId("SINGLE_DATE").setVisible(false);
        //         that.byId("Rolling_Timestamp").setVisible(false);
        //         that.byId("OVERRIDE_ASSIGNMENT").setVisible(false);
        //         that.byId("CRITICAL_ASSEMBLY").setVisible(false);
        //         that.byId("IMPACT_ANALYSIS").setVisible(false);
        //         that.byId("DAILY").setVisible(false);
        //         that.byId("OptAlgorithm").setVisible(false);
        //         that.byId("OptFactor").setVisible(false);
        //         that.byId("DsAlgorithm").setVisible(false);
        //         that.byId("SnapShot").setVisible(false);
        //         that.byId("SnapR").setVisible(false);
        //         that.byId("snapDesc").setVisible(false);

        //         that.byId("MFLInputV").setValue();
        //         that.byId("DlocInputV").setValue();
        //         that.byId("CprodInputV").setValue();
        //         that.byId("PprodInputV").setValue();
        //         // that.byId("MODEL_VERSION").setValue();
        //         that.byId("PrePFInputV").setValue();
        //         that.byId("ForeAlgInputV").setValue();
        //         that.byId("idverV").setValue();
        //         that.byId("idscenV").setValue();
        //         that.byId("classInputV").setValue();
        //         that.byId("custGrpInputV").setValue();
            
        //         // that.byId("GEN_TYPE").setValue();
        //         that.byId("FromDateV").setValue();
        //         that.byId("ToDateV").setValue();
        //         that.byId("singleDtV").setValue();
        //         that.byId("idRollingWeeksV").setValue();
        //         that.byId("idOverrideV").setSelected(false);
        //         that.byId("idCriticalV").setSelected(false);
        //         that.byId("idImpactV").setSelected(false);
        //         that.byId("idDailyV").setSelected(false);
        //         that.byId("idRollingV").setSelected(false);
        //         that.byId("idSnapDescV").setValue();

        //         that.byId("CprodInputV").removeAllTokens();
        //         that.byId("PprodInputV").removeAllTokens();

        //         var aData = that.ActivityItems;

        //         that.filterActivites = aData.filter(function (aComp) {
        //             return aComp.ACTIVITY_ID === selStep ;
        //         });

        //         var Exists=[];
        //         if(that.TempParams.length > 0){
        //             Exists = that.TempParams.filter(function (aComp) {
        //                 return aComp.ACTIVITY_ID === selStep && 
        //                        aComp.counter === counter; 

        //             });
        //         }
       
        //         if(selStep === "GENERATE_SEEDORDER"){
        //             var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
        //             that.byId("FromDateV").setMaxDate(tempDate);
        //             that.byId("ToDateV").setMaxDate(tempDate);
        //             that.byId("FromDateV").setMinDate(null);
        //             that.byId("ToDateV").setMinDate(null);
        //         } else if(selStep === "PURGE_PLANNING_DATA"){
        //             that.byId("FromDateV").setMaxDate(null);
        //             that.byId("ToDateV").setMaxDate(null);
        //             that.byId("FromDateV").setMinDate(null);
        //             that.byId("ToDateV").setMinDate(null);
        //         } else {
        //             that.byId("FromDateV").setMaxDate(null);
        //             that.byId("ToDateV").setMaxDate(null);
        //             that.byId("FromDateV").setMinDate(new Date());
        //             that.byId("ToDateV").setMinDate(new Date());
        //         }

        //         if(selStep === "PUBLISH_FORECAST_ORDERS"){
        //             that.byId("idModelVerV").setEditable(false);
                   
        //         } else {
        //             that.byId("idModelVerV").setEditable(true);
        //         }

        //         for(var i=0; i<that.filterActivites.length; i++){
        //             var id= that.filterActivites[i].PARAMETER_ID 
        //             that.byId(id).setVisible(true);

        //             if(Exists.length === 0){
        //                 var input = that.byId(id).getFields()[0].sId.split("--")[2];
        //                 if(id === "OVERRIDE_ASSIGNMENT" || id === "CRITICAL_ASSEMBLY" || id === "IMPACT_ANALYSIS" ||
        //                      id === "DAILY" || id === "SnapShot" ) {
        //                     that.byId(input).setSelected(false);
        //                 } else if(id !== "MODEL_VERSION" && id !== "GEN_TYPE") {
        //                     that.byId(input).setValue();
        //                 }
        //                 if(that.filterActivites[i].OPTION_SELECT === "M"){
        //                     that.byId(input).removeAllTokens();
        //                 }
        //             }
                    
        //             if(Exists.length > 0){
        //             var input = that.byId(id).getFields()[0].sId.split("--")[2];

        //             if(id.includes("MF_LOCATION")){

        //                 if(that.filterActivites[i].OPTION_SELECT === "S"){
        //                     that.byId(input).setValue(Exists[0].MF_LOCATION_ID);
        //                 } 
                        
        //                 if(selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION") ){
        //                     if(Exists[0].MF_LOCATION_ID !== ""){
        //                     that.PlancfgPara(Exists[0].MF_LOCATION_ID, Exists[0].GEN_TYPE);
        //                     }
        //                 }
        //             } else if(id.includes("DM_LOCATION")){

        //                 if(that.filterActivites[i].OPTION_SELECT === "S"){
        //                     that.byId(input).setValue(Exists[0].LOCATION_ID);
        //                 } else if(that.filterActivites[i].OPTION_SELECT === "M"){
        //                     var mulLoc = [];
        //                     var tempLoc = [];
        //                     // var mulLoc = Exists[0].LOCATION_ID;
        //                     // that.byId(input).removeAllTokens();

        //                     if(Exists[0].LOCATION_ID !== undefined ){
        //                         var temp = Exists[0].LOCATION_ID;
        //                         if(temp.includes(",") === true){
        //                             mulLoc = Exists[0].LOCATION_ID.split(",");
        //                         } else {
        //                             // mulLoc.push(Exists[0].LOCATION_ID);
        //                             mulLoc = Exists[0].LOCATION_ID;
        //                         }
        //                         that.byId(input).removeAllTokens();
        //                     var temp = "";
        //                         if(mulLoc !== "" && mulLoc.length > 0){
        //                     mulLoc.forEach(function (oItem) {
        //                         if(oItem !== ""){
        //                             temp = "X";
        //                         }
        //                             that.byId(input).addToken(
        //                                 new sap.m.Token({
        //                                     key: oItem,
        //                                     text: oItem,
        //                                     editable:false,

        //                                 })
        //                             );
        //                         });
        //                     }
        //                         if(temp === ""){
        //                             that.byId(input).removeAllTokens();
        //                         }
        //                     }
        //                 }

        //                 // if(selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION") ){
        //                 //     if(Exists[0].LOCATION_ID !== ""){
        //                 //     that.PlancfgPara(Exists[0].LOCATION_ID, Exists[0].GEN_TYPE);
        //                 //     }
        //                 // }
        //             }
        //             else if(id.includes("PRODUCT")){

        //                 if(that.filterActivites[i].OPTION_SELECT === "S"){
        //                     that.byId(input).setValue(Exists[0].PRODUCT_ID);
        //                 } else if(that.filterActivites[i].OPTION_SELECT === "M"){
        //                     var mulProd = [];
        //                     if(Exists[0].PRODUCT_ID !== undefined){
        //                         var temp = Exists[0].PRODUCT_ID;
        //                     if(temp.includes(",") === true){
        //                         mulProd = Exists[0].PRODUCT_ID.split(",");
        //                     } else {
        //                         // mulProd.push(Exists[0].PRODUCT_ID);
        //                         mulProd = Exists[0].PRODUCT_ID;
        //                     }
        //                     // var mulProd = Exists[0].PRODUCT_ID;
        //                     that.byId(input).removeAllTokens();
        //                     var temp = "";
        //                     if(mulProd !== "" && mulProd.length > 0){
        //                     mulProd.forEach(function (oItem) {
        //                         if(oItem !== ""){
        //                             temp = "X";
        //                         }
        //                             that.byId(input).addToken(
        //                                 new sap.m.Token({
        //                                     key: oItem,
        //                                     text: oItem,
        //                                     editable:false,

        //                                 })
        //                             );
        //                         });
        //                     }
        //                     if(temp === ""){
        //                         that.byId(input).removeAllTokens();
        //                     }
        //                 }
        //                 }
        //             } else if(id === "MODEL_VERSION"){
        //                 that.byId(input).setSelectedKey(Exists[0].MODEL_VERSION);
        //             } else if(id === "PREDICTION_PROFILE"){
        //                 that.byId(input).setValue(Exists[0].PREDICTION_PROFILE);
        //             } else if(id === "VERSION"){
        //                 that.byId(input).setValue(Exists[0].VERSION);
        //                 // if (selStep === "PUBLISH_FORECAST_ORDERS") {
        //                 //     that.byId("idverV").setEditable(false);
        //                 // } else {
        //                 //     that.byId("idverV").setEditable(true);
        //                 // }
        //             } else if(id === "SCENARIO"){
        //                 that.byId(input).setValue(Exists[0].SCENARIO);
        //                 // if (selStep === "PUBLISH_FORECAST_ORDERS") {
        //                 //     that.byId("idscenV").setEditable(false);
        //                 // } else {
        //                 //     that.byId("idscenV").setEditable(true);
        //                 // }
        //             } else if(id === "CLASS"){
        //                 // that.byId(input).setValue(Exists[0].CLASS);
        //                 var mulClass = [];
        //                     if(Exists[0].CLASS !== undefined){

        //                     if(Exists[0].CLASS.includes(",")){
        //                         mulClass = Exists[0].CLASS.split(",");
        //                     } else {
        //                         mulClass.push(Exists[0].CLASS);
        //                         // mulClass = Exists[0].CLASS;
        //                     }
        //                     // var mulClass = Exists[0].CLASS;
        //                     that.byId(input).removeAllTokens();
        //                     var temp = "";
        //                     if(mulClass !== undefined){
        //                     mulClass.forEach(function (oItem) {
        //                         if(oItem !== ""){
        //                             temp = "X";
        //                         }
        //                             that.byId(input).addToken(
        //                                 new sap.m.Token({
        //                                     key: oItem,
        //                                     text: oItem,
        //                                     editable:false,

        //                                 })
        //                             );
        //                         });
        //                     }
        //                     if(temp === ""){
        //                         that.byId(input).removeAllTokens();
        //                     }
        //                 }
                        
        //             } else if(id === "CUSTOMER_GROUP"){
        //                 that.byId(input).setValue(Exists[0].CUSTOMER_GROUP);
        //             } else if(id === "GEN_TYPE"){
        //                 that.byId(input).setSelectedKey(Exists[0].GEN_TYPE);
        //             } else if(id === "OVERRIDE_ASSIGNMENT"){
        //                 // if(Exists[0].OVERRIDE_ASSIG === "true"){
        //                 if(Exists[0].OVERRIDE_ASSIGNMENT === "true" || Exists[0].OVERRIDE_ASSIGNMENT === true){
        //                 that.byId(input).setSelected(true);
        //                 } else {
        //                     that.byId(input).setSelected(false);
        //                 }
        //             } else if(id === "CRITICAL_ASSEMBLY"){
        //                 if(Exists[0].CRITICAL_ASSEMBLY === "true" || Exists[0].CRITICAL_ASSEMBLY === true){
        //                     that.byId(input).setSelected(true);
        //                 } else {
        //                     that.byId(input).setSelected(false);
        //                 }
        //             }  else if(id === "IMPACT_ANALYSIS"){
        //                 if(Exists[0].IMPACT_ANALYSIS === "true" || Exists[0].IMPACT_ANALYSIS === true){
        //                     that.byId(input).setSelected(true);
        //                 } else {
        //                     that.byId(input).setSelected(false);
        //                 }
        //             }  else if(id === "DAILY"){
        //                 if(Exists[0].DAILY === "true" || Exists[0].DAILY === true){
        //                     that.byId(input).setSelected(true);
        //                 } else {
        //                     that.byId(input).setSelected(false);
        //                 }
        //             } else if(id === "OPERATOR"){
        //                 that.byId(input).setSelectedKey(Exists[0].OPERATOR);
        //             } else if(id === "DATE_RANGE"){
        //                 that.byId("FromDateV").setValue(Exists[0].FROM_DATE);
        //                 that.byId("ToDateV").setValue(Exists[0].TO_DATE);
        //             } else if(id === "SINGLE_DATE"){
        //                 that.byId("singleDtV").setValue(Exists[0].SINGLE_DATE);
        //             } else if(id === "Rolling_Timestamp"){
        //                 if(Exists[0].Rolling === "true" || Exists[0].Rolling === true){
        //                     that.byId("idRollingV").setSelected(true);
        //                     that.byId("FromDateV").setEditable(false);
        //                     that.byId("ToDateV").setEditable(false);
        //                     that.byId("idRollingWeeksV").setVisible(true);
        //                     that.byId("idRollingWeeksV").setValue(Exists[0].Rolling_Timestamp);
        //                     // that.byId(id).setVisible(true);
        //                 } else {
        //                     that.byId("idRollingV").setSelected(false);
        //                     that.byId("FromDateV").setEditable(true);
        //                     that.byId("ToDateV").setEditable(true);
        //                     that.byId("idRollingWeeksV").setValue();
        //                     that.byId("idRollingWeeksV").setVisible(false);
        //                     // that.byId(id).setVisible(false);
        //                 }
        //             } else if(id === "OptAlgorithm"){
        //                 that.byId(input).setSelectedKey(Exists[0].OptAlgorithm);
        //             } else if(id === "OptFactor"){
        //                 that.byId(input).setSelectedKey(Exists[0].OptFactor);
        //             } else if(id === "DsAlgorithm"){
        //                 that.byId(input).setSelectedKey(Exists[0].DsAlgorithm);
        //             } else if(id === "SnapShot"){
        //                 if(Exists[0].SnapShot === "" ){
        //                 that.byId("idSnapShotV").setSelected(false);
        //                 } else if(Exists[0].SnapShot === "U" ){
        //                     that.byId("SnapR").setVisible(true);
        //                     that.byId("idSnapShotV").setSelected(true);
        //                     that.byId("snapDesc").setVisible(false);
        //                     that.byId("idSnapRadioV").setSelectedButton(that.byId("update"));
        //                 } else if(Exists[0].SnapShot === "C"){
        //                     that.byId("idSnapShotV").setSelected(true);
        //                     that.byId("SnapR").setVisible(true);
        //                     that.byId("snapDesc").setVisible(true);
        //                     that.byId("idSnapRadioV").setSelectedButton(that.byId("createV"));
        //                     that.byId("idSnapDescV").setValue(Exists[0].SnapShot_Desc);
        //                 }
        //             } 
        //         }
                    
        //         }
        //         // Form Visible
        //         that.byId("idParameter").setVisible(true);
        //         // that.byId("idarrow").setVisible(true);
        //         that.maxACT_POSITION  = that.MaxStep;
        //         // that.getView().byId("stepLabel").setText( step[0].getText() + ' of '+ that.maxACT_POSITION);
        //         // that.byId("idarrowTitle").setText(step[1].getText());
        //         that.StepsSelFlag = "";
        //         that.byId("SINGLE_DATE").setVisible(false);
        //     },

        //     Previous:function(){

        //         let alabel =  parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
        //         if(alabel > 1){
        //             that.getView().byId("stepLabel").setText(`${alabel - 1} of `+ that.maxACT_POSITION)
        //         }
        //         if(that.byId("idStepList").getItems()[alabel -2]){
        //         that.byId("idStepList").getItems()[alabel -2].setSelected(true);
        //         that.onStepName();
        //         }

        //         that.tempIndex = "";

        //     },

        //     Next :function(){
        //         let alabel =  parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
        //         if(alabel < that.maxACT_POSITION){
        //             that.getView().byId("stepLabel").setText(`${alabel + 1} of `+ that.maxACT_POSITION)
        //         }
        //         if(that.byId("idStepList").getItems()[alabel]){
        //         that.byId("idStepList").getItems()[alabel].setSelected(true);
        //         that.onStepName();
        //         }
        //         that.tempIndex = "";

        //     },

            onSnapShotC: function(oEvent){
                var sel = that.byId("idSnapShotV").getSelected();
                that.byId("idSnapRadioV").setSelectedButton(that.byId("createV"));

                if(sel){
                    that.byId("SnapRV").setVisible(true);
                    that.byId("snapDescV").setVisible(true);

                } else {
                    that.byId("SnapRV").setVisible(false);
                    that.byId("snapDescV").setVisible(false);
                }
                
    
            },
    
            OnsnapSelect: function(){
                var selRadio = that.byId("idSnapRadioV").getSelectedButton().getText();
                                that.byId("idSnapDescV").setValue("");
                                
                    that.byId("SnapRV").setVisible(true);
                    that.byId("snapDescV").setVisible(true);
                // if(selRadio.includes("create")){
                //     that.byId("snapDescV").setVisible(true);
                    
                // } else {
                //     that.byId("snapDescV").setVisible(false);
                //     // that.TempParams[index].SnapShot = "U";
                //     // that.TempParams[index].SnapShot_Desc = "";
                // }
            },

            onDescChange:function(){

                var text = that.byId("idSnapDescV").getValue();
                if(text.length >= 59){
                    MessageToast("Text limit is 60 Characters")
                }

                
            },

            onWeekValues:function(){
                var value = that.byId("idWeeksV").getValue();

                if(value <= 0){
                    MessageToast.show("History weeks can not be lessthen 1");
                } else if(value > 156){
                    MessageToast.show("History weeks can not be greaterthen 156");
                }

            },

            onOptimise:function(oEvent){
                var selected = oEvent.getParameters().selected;

                if(selected){
                    that.byId("PidOptProfileV").setEnabled(true);
                } else {
                    that.byId("PidOptProfileV").setEnabled(false);
                }

                that.byId("PidOptProfileV").setSelectedKey(that.byId("PidOptProfileV").getItems()[0]);

            },


            /**
             * This function is called when click on input box to open value help dialogs.
             * This function will open the dialogs based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                that.oMFLocUni = that.byId("MFLInputV");
                that.oLocUni = that.byId("DlocInputV");
                that.oConfProdUni = that.byId("CprodInputV");
                that.oProdUni = that.byId("PprodInputV");

                // Location Dialog
                if (sId.includes("MFL")) {
                    that.oMFLocUni = that.byId("MFLInputV");
                    that.oLocUni = that.byId("DlocInputV");
                    that.oProdUni = that.byId("PprodInputV");

                    this.MFlocModel = new JSONModel();
                    this.MFlocModel.setSizeLimit(that.MFLocDataUni.length);
                    that.MFlocModel.setData({
                        MFLocitemsUni: that.MFLocDataUni
                    });
                    sap.ui.getCore().byId("MFLSlctListJSSMulT").setModel(that.MFlocModel);

                    var locTokens = that.oMFLocUni.getTokens();


                         for (var i = 0; i < locTokens.length; i++) {
                            for (var j = 0; j < that.MFLocDataUni.length; j++) {
                                if (that.MFLocDataUni[j].FACTORY_LOC === locTokens[i].getText()) {
                                    sap.ui.getCore().byId("MFLSlctListJSSMulT").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }
                    
                    this._valueHelpDialogMFLUni.open();
                    
                    // Location Dialog
                } else if (sId.includes("loc")) {
                    that.oMFLoc = that.byId("MFLInputV");
                    that.oLoc = that.byId("DlocInputV");
                    var Data = that.TotalDataUni;
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
                    sap.ui.getCore().byId("LocSlctListT").setGrowingThreshold(that.LocDataUni.length);

                    that.LocDataUni.forEach(el => {
                        el.LOCATION_ID = el.DEMAND_LOC;
                        el.LOCATION_DESC = el.DEMAND_DESC;
                    })

                    that.locModel.setData({
                        Locitems: that.LocDataUni
                    });
                    sap.ui.getCore().byId("LocSlctListT").setModel(that.locModel);

                    var locTokens = that.oLocUni.getTokens();

                    if (locTokens.length > 0) {
                        for (var i = 0; i < locTokens.length; i++) {
                            for (var j = 0; j < that.LocDataUni.length; j++) {
                                if (that.LocDataUni[j].LOCATION_ID === locTokens[i].getText()) {
                                    sap.ui.getCore().byId("LocSlctListT").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }
                    }
                    this._valueHelpDialogLoc.open();

                    // Product Dialog
                } else if (sId.includes("CprodInputV")) {

                    that.oMFLocUni = that.byId("MFLInputV");
                    that.oLocUni = that.byId("DlocInputV");
                    that.oProdUni = that.byId("PprodInputV");
                    that.oConfProdUni = that.byId("CprodInputV");

                    var Data = that.TotalDataUni;
                    sap.ui.getCore().byId("ConfProductSlctListT").setMultiSelect(true);
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
                                that.ConfProdDataUni = [];
                                that.ConfProdDataUni = that.DataUni;
                            }

                        }

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
                    sap.ui.getCore().byId("ConfProductSlctListT").setGrowingThreshold(that.ConfProdDataUni.length);

                    that.ConfprodModel.setData({
                        results: that.ConfProdDataUni
                    });
                    sap.ui.getCore().byId("ConfProductSlctListT").setModel(that.ConfprodModel);

                    var prodTokens = that.oConfProdUni.getTokens();

                    if (prodTokens.length > 0) {
                        // for (var i = 0; i < prodTokens.length; i++) {

                        //     var index = that.ProdDataUni.findIndex(e => e.PRODUCT_ID === prodTokens[i].getText() );
                        //     that.byId("prodSlctListJSS").getItems()[index].setSelected(true);
                        // }
                        for (var i = 0; i < prodTokens.length; i++) {
                            for (var j = 0; j < that.ConfProdDataUni.length; j++) {
                                if (that.ConfProdDataUni[j].REF_PRODID === prodTokens[i].getText()) {
                                    sap.ui.getCore().byId("ConfProductSlctListT").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }
                    }

                    
                    this._valueHelpDialogConfProd.open();

                } else if (sId.includes("PprodInputV")) {
                    
                   

                    var Data = that.TotalDataUni;
                    sap.ui.getCore().byId("prodSlctListT").setMultiSelect(true);
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
                    sap.ui.getCore().byId("prodSlctListT").setGrowingThreshold(that.ProdDataUni.length);

                    that.prodModel.setData({
                        results: that.ProdDataUni
                    });
                    sap.ui.getCore().byId("prodSlctListT").setModel(that.prodModel);

                    var prodTokens = that.oProdUni.getTokens();

                    if (prodTokens.length > 0) {
                       
                        for (var i = 0; i < prodTokens.length; i++) {
                            for (var j = 0; j < that.ProdDataUni.length; j++) {
                                if (that.ProdDataUni[j].PRODUCT_ID === prodTokens[i].getText()) {
                                    sap.ui.getCore().byId("prodSlctListT").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }
                    }

                    this._valueHelpDialogProd.open();
                    // Version Dialog
                } else if (sId.includes("ver")) {
                    that._valueHelpDialogVer.open();
                    // Scenario Dialog
                } else if (sId.includes("scen")) {
                    
                    var data = that.VerSecData;
                    var scenarioData = [];

                    that.oVerUni = that.byId("idverV");
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
                    
                } else if (sId.includes("PrePFInputV")) {
                    that._valueHelpDialogPPF.open();
                } else if (sId.includes("ForeAlgInputV")) {
                    var profiles = that.PredictionData;
                    var data = profiles.filter(el=> el.METHOD === "AES");
                    that.fapModel = new JSONModel();
                    that.fapModel.setData({
                        results: data
                    });
                    that._valueHelpDialogFAP.setModel(that.fapModel);

                    that._valueHelpDialogFAP.open();
                } else if (sId.includes("classInputV")) {
                    that.oMFLocUni = that.byId("MFLInputV");
                    that.oLocUni = that.byId("DlocInputV");
                    that.oConfProdUni = that.byId("CprodInputV");
                    that.oProdUni = that.byId("PprodInputV");

                    var classData = that.ClassData;
                
                    var locTokens = that.oMFLocUni.getTokens();
                    var prodTokens = that.oConfProdUni.getTokens();
                var newClassData = [];
                    if(locTokens.length > 0){
                        for(var i=0; i<locTokens.length; i++){

                            var temp = classData.filter(el=> el.LOCATION_ID === locTokens[i].getText());

                            if(temp.length > 0){
                                newClassData = newClassData.concat(temp);
                            }

                        }
                    } else {
                        newClassData = classData;
                    }

                    if(prodTokens.length > 0){
                        for(var i=0; i<prodTokens.length; i++){

                            var temp = classData.filter(el=> el.PRODUCT_ID === prodTokens[i].getText());

                            if(temp.length > 0){
                                newClassData = newClassData.concat(temp);
                            }

                        }
                    } else {
                        newClassData = newClassData;
                    }


                    that.classModel.setData({
                        results : newClassData
                    });
                    that.oClassList.setModel(that.classModel);

                    that.oClass = that.byId("classInputV");
                    var classTokens = that.oClass.getTokens();
                    classTokens = classTokens.length > 0 ? classTokens.split(",") : "";
                    // if(classTokens[0].getText().includes(",")){
                    //     classTokens = classTokens.split(",");
                    // }
        
                    
                        for (var i = 0; i < classTokens.length; i++) {
                            for (var j = 0; j < oData.results.length; j++) {
                                if (oData.results[j].CLASS_NUM === classTokens[i].getText()) {
                                    sap.ui.getCore().byId("ClassSlctListT").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }                
                    
                        this._valueHelpDialogClassDetails.open();





                } else if (sId.includes("custGrpInputV")) {
                   
                that.ocgUni = that.byId('custGrpInputV');
                    that._valueHelpDialogCustGroup.open();
                    var CGTokens = that.ocgUni.getTokens();
                     for (var i = 0; i < CGTokens.length; i++) {
                        for (var j = 0; j < that.custGroupValues.length; j++) {
                            if (that.custGroupValues[j].CUSTOMER_GROUP === CGTokens[i].getText()) {
                                sap.ui.getCore().byId("CustGroupSlctListT").getItems()[j].setSelected(true);
                                break;
                            }
                        }
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
                // Location Dialog
                if (sId.includes("MFL")) {
                    that._oCore
                        .byId(this._valueHelpDialogMFL.getId() + "-searchField")
                        .setValue("");
                    if (that.oMFLocList.getBinding("items")) {
                        that.oMFLocList.getBinding("items").filter([]);
                    }
                    // Product Dialog
                } else if (sId.includes("Loc") || sId.includes("loc")) {
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
                    if (that.oClassList.getBinding("items")) {
                        that.oClassList.getBinding("items").filter([]);
                    }
                }
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
                                    new Filter( "LOCATION_DESC", FilterOperator.Contains, sQuery
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
            handleSelection: function (oEvent) {
                var sId = oEvent.getParameter("id"),
                    aSelectedVer;

                //Location list
                if(sId.includes("MFL")){
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter([]);
                    // setTimeout(() => {

                    var aContexts = oEvent.getParameter("selectedContexts");
                    that.aSelectedLoc = [];

                    for (var i = 0; i < aContexts.length; i++) {
                        var index = parseInt(aContexts[i].sPath.split("/MFLocitemsUni/")[1]);

                        var obj = that.MFLocDataUni[index];

                        that.aSelectedLoc.push(obj);

                    }
                    that.oMFLocUni.removeAllTokens();
                    that.aSelectedLoc.forEach(function (oItem, i) {
                        that.oMFLocUni.addToken(
                            new sap.m.Token({
                                key: that.aSelectedLoc[i].FACTORY_LOC,
                                text: that.aSelectedLoc[i].FACTORY_LOC,
                                editable: false,

                            })
                        );

                    });

                } else if (sId.includes("Loc")) {
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

                } else if(sId.includes("ConfProduct")) {
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
                }  else if (sId.includes("prod")) {

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
                } else if(sId.includes("Ver")){
                    var aSelectedVer = oEvent.getParameter("selectedItems");
                    that.byId("idverV").setValue(aSelectedVer[0].getTitle());
                    that.byId("idscenV").setValue("");

                    // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    // counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    // Exists = that.TempParams.filter(function (aComp) {
                    //     return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    // });
                    // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    // that.TempParams[index].VERSION = aSelectedVer[0].getTitle();
                    // that.TempParams[index].SCENARIO  = "";    
                
                    

                } else if(sId.includes("scen")){
                    var aSelectedScen = oEvent.getParameter("selectedItems");
                    that.byId("idscenV").setValue(aSelectedScen[0].getTitle());

                    // var Exists =[];
                    // // var selStep = that.getView().byId("idarrowTitle").getText(),
                    // // Step = parseInt(that.getView().byId("stepLabel").getText().split("")[0]);

                    // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    //  counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    // Exists = that.TempParams.filter(function (aComp) {
                    //     return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    // });
                    // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    // that.TempParams[index].SCENARIO  = aSelectedScen[0].getTitle();     
                
                    // // if(index !== -1){
                    // //     that.TempParams[index].SCENARIO  = aSelectedScen[0].getTitle();                        
                    // // } 

                } else if(sId.includes("ppfSlctList")){
                    var aSelectedPPF = oEvent.getParameter("selectedItems");
                    that.byId("PrePFInputV").setValue(aSelectedPPF[0].getTitle());
                    // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    //  counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    // Exists = that.TempParams.filter(function (aComp) {
                    //     return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    // });
                    // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    // that.TempParams[index].PREDICTION_PROFILE = aSelectedPPF[0].getTitle();
               
                } else if (sId.includes("algoSlctList")) {
                    var aSelectedPPF = oEvent.getParameter("selectedItems");
                    that.byId("ForeAlgInputV").setValue(aSelectedPPF[0].getTitle());

                } else if(sId.includes("ClassSlctList")){
                    var aSelectedclass = oEvent.getParameter("selectedItems");
                    that.oClass = that.byId("classInputV");
                    // // that.byId("classInputV").setValue(aSelectedclass[0].getTitle());
                    // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    //  counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    // Exists = that.TempParams.filter(function (aComp) {
                    //     return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    // });
                    // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    // // that.TempParams[index].CLASS = aSelectedclass[0].getTitle();

                    var selClass = [];
                    that.oClass.removeAllTokens();
                        aSelectedclass.forEach(function (oItem) {
                                    if(oItem.getTitle() !== "ALL"){
                                        selClass.push(oItem.getTitle());
                                    }
                                    that.oClass.addToken(
                                        new sap.m.Token({
                                            key: oItem.getTitle(),
                                            text: oItem.getTitle(),
                                            editable:false,

                                        })
                                    );
                                });
                    // that.TempParams[index].CLASS = selClass;
               
                } else if(sId.includes("CustGroup")){

                    that.oCustGroup = that.byId("custGrpInputV");
                        var aSelectedCustGroup = oEvent.getParameter("selectedItems");
                        that.oCustGroup.removeAllTokens();
                        aSelectedCustGroup.forEach(function (oItem, i) {
                            that.oCustGroup.addToken(
                                new sap.m.Token({
                                    key: aSelectedCustGroup[i].getTitle(),
                                    text: aSelectedCustGroup[i].getTitle(),
                                    editable: false,

                                })
                            );

                        });
                    

                }
                that.handleClose(oEvent);
            },

            PlancfgPara:function(oLoc, gentype){

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
                                    "Types": [{ "name": "Restrictions", "key": "RT" },
                                              { "name": "Object Dependency", "key": "OD" }]
                                };              
                            } else if (oData.results[0].VALUE === "M2") {
                                // that.typeData = {
                                //     "Types": [{ "name": "Restrictions", "key": "RT" },
                                //               { "name": "Primary", "key": "PI" }]
                                // };
                                that.typeData = {
                                    "Types": [{ "name": "Primary", "key": "PI" }]
                                };
                            }
                            var jmodel = [];
                            jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                            
                            that.getView().byId("GenidTypeV").setModel(jmodel);
    
                            if(gentype !== ""){
                                that.byId("GenidTypeV").setSelectedKey(that.typeData.Types[0].key);
                            }
                            var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    that.TempParams[index].GEN_TYPE = that.typeData.Types[0].key;
                        }
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });
    
    
            },

        //     getDemandLocation:function(){
        //         // that.LocData = that.ManuLocData.filter(function (aComp) {
        //         //     return aComp.FACTORY_LOC === that.byId("MFLInputV").getValue() ;
        //         // });
        //         // that.LocData.forEach(el => {
        //         //     el.LOCATION_ID = el.DEMAND_LOC;
        //         //     el.LOCATION_DESC = el.DEMAND_DESC;
        //         // });

        //         this.getModel("BModel").read("/getfactorylocdesc", {
        //             filters: [new Filter("FACTORY_LOC", FilterOperator.EQ, that.byId("MFLInputV").getValue()) ],
        //             success: function (oData) {
        //                 sap.ui.core.BusyIndicator.hide();
        //                 that.LocData = oData.results;
    
        //                 function removeDuplicate(array, key) {
        //                     var check = new Set();
        //                     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
        //                 }
    
        //                 that.LocData = removeDuplicate(oData.results, 'DEMAND_LOC');
                        
        //                 that.LocData.forEach(el => {
        //                     el.LOCATION_ID = el.DEMAND_LOC;
        //                     el.LOCATION_DESC = el.DEMAND_DESC;
        //                 });
    
        //                 var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
        //         counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                
        //         var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

        //     var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
        //         var aData = that.ActivityItems;
        //     var filterActivites = aData.filter(function (aComp) {
        //         return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATION";
        //         });

        //         if (filterActivites[0].OPTION_SELECT === "M" ) {
        //             that.LocSelType = "M";
        //             sap.ui.getCore().byId("LocSlctListT").setMultiSelect(true);

        //             if (that.LocData.length > 0) {
        //                 that.LocData.unshift({
        //                     LOCATION_ID: "ALL",
        //                     LOCATION_DESC: "ALL",
        //                 });
        //             }
        //         } else if (filterActivites[0].OPTION_SELECT === "S" ) {
        //             that.LocSelType = "S";
        //             sap.ui.getCore().byId("LocSlctListT").setMultiSelect(false);
        //             sap.ui.getCore().byId("LocSlctListT").setRememberSelections(false);
        //         }
        //         that.locModel.setData({
        //             Locitems: that.LocData
        //         });
        //         that.oLocList.setModel(that.locModel);

        //         // that.oLoc.removeAllTokens();
        //         var locTokens = that.oLoc.getTokens();
        //         if(locTokens.length > 0){
        //             var tempPdata = locTokens[0].getText();
        //             if(tempPdata.includes(",") === true){
        //                 locTokens = locTokens[0].getText().split(",");
        //             }
        //         if(locTokens[0].getText() === "ALL" || locTokens.length === (that.LocData.length - 1)){
        //             this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
        //         } else {
        //             for (var i = 0; i < locTokens.length; i++) {
        //                 for (var j = 0; j < that.LocData.length; j++) {
        //                     if (that.LocData[j].LOCATION_ID === locTokens[i].getText()) {
        //                         sap.ui.getCore().byId("LocSlctListT").getItems()[j].setSelected(true);
        //                         break;
        //                     }
        //                 }
        //             }
                    
        //         }
        //     }
                        
        //             },
        //             error: function (oData, error) {
        //                 sap.ui.core.BusyIndicator.hide();
        //                 MessageToast.show("Failed to get location data");
        //             },
        //         });
                    
        //     //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
        //     //     counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                
        //     //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

        //     // var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
        //     //     var aData = that.ActivityItems;
        //     // var filterActivites = aData.filter(function (aComp) {
        //     //     return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATION";
        //     //     });

        //     //     if (filterActivites[0].OPTION_SELECT === "M" ) {
        //     //         that.LocSelType = "M";
        //     //         sap.ui.getCore().byId("LocSlctListT").setMultiSelect(true);

        //     //         if (that.LocData.length > 0) {
        //     //             that.LocData.unshift({
        //     //                 LOCATION_ID: "ALL",
        //     //                 LOCATION_DESC: "ALL",
        //     //             });
        //     //         }
        //     //     } else if (filterActivites[0].OPTION_SELECT === "S" ) {
        //     //         that.LocSelType = "S";
        //     //         sap.ui.getCore().byId("LocSlctListT").setMultiSelect(false);
        //     //         sap.ui.getCore().byId("LocSlctListT").setRememberSelections(false);
        //     //     }
        //     //     that.locModel.setData({
        //     //         Locitems: that.LocData
        //     //     });
        //     //     that.oLocList.setModel(that.locModel);

        //     //     // that.oLoc.removeAllTokens();
        //     //     var locTokens = that.oLoc.getTokens();
        //     //     if(locTokens.length > 0){
        //     //         var tempPdata = locTokens[0].getText();
        //     //         if(tempPdata.includes(",") === true){
        //     //             locTokens = locTokens[0].getText().split(",");
        //     //         }
        //     //     if(locTokens[0].getText() === "ALL" || locTokens.length === (that.LocData.length - 1)){
        //     //         this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
        //     //     } else {
        //     //         for (var i = 0; i < locTokens.length; i++) {
        //     //             for (var j = 0; j < that.LocData.length; j++) {
        //     //                 if (that.LocData[j].LOCATION_ID === locTokens[i].getText()) {
        //     //                     sap.ui.getCore().byId("LocSlctListT").getItems()[j].setSelected(true);
        //     //                     break;
        //     //                 }
        //     //             }
        //     //         }
                    
        //     //     }
        //     // }

        //     },

        //     getProducts:function(){
        //         //Single select or multi select

        //         var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
        //         var Step = that.byId("idStepList").getSelectedItems()[0].getCells()[0].getText();
        //             var aData = that.ActivityItems;
        //         var filterActivites = aData.filter(function (aComp) {
        //             return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID.includes("PRODUCT");
        //             });

        //             if (filterActivites[0].OPTION_SELECT === "M" ) {
        //                 if(filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT"){
        //                         that.oProd = that.byId("PprodInputV");
        //                     } else {
        //                         that.oProd = that.byId("CprodInputV");
        //                     }
        //                 // that.oProd.removeAllTokens();
        //                 this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
        //             } else {
        //                 if(filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT"){
        //                 that.byId("PprodInputV").setValue("");
        //                 that.oProd = that.byId("PprodInputV");
        //                 } else {
        //                     that.byId("CprodInputV").setValue("");
        //                     that.oProd = that.byId("CprodInputV");
        //                 }
        //             }
        //                 that.oLoc = that.byId("MFLInputV");

        //             var oFilters = [];
        //             that.TempLocData = [];
        //     if(that.byId("DM_LOCATION").getVisible() === true){
        //         // if (that.LocSelType === "M") {
        //             var aSelectedLoc = that.oLoc.getTokens();
        //             var temp = aSelectedLoc[0].getText();
        //             if(temp.includes(",") === true){
        //                 aSelectedLoc = aSelectedLoc,split(",");
        //             }
        //              for (var i = 0; i < aSelectedLoc.length; i++) {
        //                  if (aSelectedLoc[i].getText() !== "ALL") {
        //                     that.TempLocData.push(aSelectedLoc[i].getText());
        //                      sFilter = new sap.ui.model.Filter({
        //                          path: "LOCATION_ID",
        //                          operator: sap.ui.model.FilterOperator.EQ,
        //                          value1: aSelectedLoc[i].getText(),
        //                      });
        //                      oFilters.push(sFilter);
        //                  }
        //              }
        //         } else {
        //             that.TempLocData.push(that.oMFLoc.getValue());
        //             var sFilter = new sap.ui.model.Filter({
        //                 path: "LOCATION_ID",
        //                 operator: sap.ui.model.FilterOperator.EQ,
        //                 value1: that.oMFLoc.getValue(),
        //             });
        //             oFilters.push(sFilter);
        //         }


        //            var selectionType = filterActivites[0].OPTION_SELECT;
        //         if (filterActivites[0].PARAMETER_ID !== "PARTIAL_PRODUCT" ) {
        //             sap.ui.core.BusyIndicator.show();
        //             // Calling sercive to get the Product list
        //             this.getModel("BModel").read("/getLocProdDet", {
        //                 // filters: [ new Filter( "LOCATION_ID", FilterOperator.EQ, that.oLoc.getValue() ) ],
        //                 filters: oFilters,
        //                 success: function (oData) {
        //                     sap.ui.core.BusyIndicator.hide();
        //                     that.jobtypeProduct(oData, selectionType);
        //                 },
        //                 error: function (oData, error) {
        //                     sap.ui.core.BusyIndicator.hide();
        //                     MessageToast.show("error");
        //                 },
        //             });
        //         } else {
        //             sap.ui.core.BusyIndicator.show();
                    
        //                 that.getModel("BModel").callFunction("/getAllProdNew", {
        //                 method: "GET",
        //                 urlParameters: {
        //                     LOC: JSON.stringify(that.TempLocData),
        //                 },
        //                 success: function (oData) {
        //                     sap.ui.core.BusyIndicator.hide();
        //                     that.jobtypeProduct(oData, selectionType);
        //                 },
        //                 error: function (oData, error) {
        //                     sap.ui.core.BusyIndicator.hide();
        //                     MessageToast.show("error");
        //                 },
        //             });
        //         }


        //     },

        //     jobtypeProduct: function (data, type) {
        //         var aData = data,
        //         selectionType = type;


        //         if (selectionType === "M" ) {
        //             that.ProdSelType = "M";
        //             sap.ui.getCore().byId("prodSlctListT").setMultiSelect(true);

        //             if (data.results.length > 0) {
        //                 data.results.unshift({
        //                     PRODUCT_ID: "ALL",
        //                     PROD_DESC: "ALL",
        //                 });
        //             }
        //         } else if (selectionType === "S" ) {
        //             that.ProdSelType = "S";
        //             sap.ui.getCore().byId("prodSlctListT").setMultiSelect(false);
        //             sap.ui.getCore().byId("prodSlctListT").setRememberSelections(false);
        //         }

        //         that.prodModel = new JSONModel();
        //         that.prodModel.setSizeLimit(1000);


        //         function removeDuplicate(array, key) {
        //             var check = new Set();
        //             return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
        //         }
        //         that.prodModel = new JSONModel();
        //         that.prodModel.setSizeLimit(1000);
    
        //         that.prodModel.setData({
        //             results: removeDuplicate(data.results, 'PRODUCT_ID')
        //         });
                
        //         that.oProdList.setModel(that.prodModel);

        //         var prodTokens = that.oProd.getTokens();
        //         if(prodTokens.length > 0){
        //             var tempPdata = prodTokens[0].getText();
        //             if(tempPdata.includes(",") === true){
        //                 prodTokens = prodTokens[0].getText().split(",");
        //             }
        //             var Products = removeDuplicate(data.results, 'PRODUCT_ID');
        //     if(prodTokens[0].getText() === "ALL" || prodTokens.length === (Products.length - 1)){
        //         this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
        //     } else {
        //         for (var i = 0; i < prodTokens.length; i++) {
        //             for (var j = 0; j < Products.length; j++) {
        //                 if (Products[j].PRODUCT_ID === prodTokens[i].getText()) {
        //                     sap.ui.getCore().byId("prodSlctListT").getItems()[j].setSelected(true);
        //                     break;
        //                 }
        //             }
        //         }                
        //     }
        // }
                

        //     },

        //     /**
        //      * This function is called when Selecting or Unselecting of a items in Product dialog.
        //      * @param {object} oEvent -the event information.
        //      */
        //     handleDemdLocChange: function (oEvent) {
        //     var oSelected = oEvent.getParameter("listItem").getTitle();
        //     var aItems = sap.ui.getCore().byId("LocSlctListT").getItems();
        //     var oSelItems = this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].getSelectedItems();
        //     var tabItems = sap.ui.getCore().byId("LocSlctListT").getItems();
        //     if(tabItems[0].getTitle() === "ALL"){
        //     if (
        //         oSelected === "ALL" &&
        //         oEvent.getParameter("selected") &&
        //         aItems.length !== 1
        //     ) {
        //         this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
        //     } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
        //         this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].removeSelections();
        //     } else if (oSelected === "ALL" && aItems.length === 1) {
        //         sap.ui.getCore().byId("LocSlctListT").getItems()[0].setSelected(false);
        //     } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
        //         sap.ui.getCore().byId("LocSlctListT").getItems()[0].setSelected(false);
        //     } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
        //         sap.ui.getCore().byId("LocSlctListT").getItems()[0].setSelected(true);
        //     }
        // }
        // },

        //     /**
        //      * This function is called when Selecting or Unselecting of a items in Product dialog.
        //      * @param {object} oEvent -the event information.
        //      */
        // handleProdChange: function (oEvent) {
        //     var oSelected = oEvent.getParameter("listItem").getTitle();
        //     var aItems = sap.ui.getCore().byId("prodSlctListT").getItems();
        //     var oSelItems = this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();
        //     var tabItems = sap.ui.getCore().byId("prodSlctListT").getItems();
        //     if(tabItems[0].getTitle() === "ALL"){
        //     if (
        //         oSelected === "ALL" &&
        //         oEvent.getParameter("selected") &&
        //         aItems.length !== 1
        //     ) {
        //         this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
        //     } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
        //         this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
        //     } else if (oSelected === "ALL" && aItems.length === 1) {
        //         sap.ui.getCore().byId("prodSlctListT").getItems()[0].setSelected(false);
        //     } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
        //         sap.ui.getCore().byId("prodSlctListT").getItems()[0].setSelected(false);
        //     } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
        //         sap.ui.getCore().byId("prodSlctListT").getItems()[0].setSelected(true);
        //     }
        // }
        // },

        // handleClassChange: function (oEvent) {
        //     var oSelected = oEvent.getParameter("listItem").getTitle();
        //     var aItems = sap.ui.getCore().byId("ClassSlctListT").getItems();
        //     var oSelItems = this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].getSelectedItems();
        //     var tabItems = sap.ui.getCore().byId("ClassSlctListT").getItems();
        //     if(tabItems[0].getTitle() === "ALL"){
        //     if (
        //         oSelected === "ALL" &&
        //         oEvent.getParameter("selected") &&
        //         aItems.length !== 1
        //     ) {
        //         this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].selectAll();
        //     } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
        //         this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].removeSelections();
        //     } else if (oSelected === "ALL" && aItems.length === 1) {
        //         sap.ui.getCore().byId("ClassSlctListT").getItems()[0].setSelected(false);
        //     } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
        //         sap.ui.getCore().byId("ClassSlctListT").getItems()[0].setSelected(false);
        //     } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
        //         sap.ui.getCore().byId("ClassSlctListT").getItems()[0].setSelected(true);
        //     }
        // }
        // },

        

            /**
             * This function is called when Location and product is selected.
             * In this function we will get the Versions.
             */
            // getVersion: function (activity) {
            //     var verFlag = "";
            // if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
            //     that.oProd = that.byId("CprodInputV");
            //     verFlag = "X";
            // } else {
            //     that.oProd = that.byId("PprodInputV");
            //     verFlag = "";
            // }

            //     var loc = "";
            //     that.TempLocData = [];
            //     if(that.byId("DM_LOCATION").getVisible() === true){
            //         loc = that.oLoc.getTokens();
            //         var token = "X";
            //     } else {
            //         loc = that.oMFLoc.getValue();
            //         var token = "";
            //     }
                
            //     var selectionType;
            //     if(that.oProd.getValue() === "" && that.oProd.getTokens().length > 0){
            //         selectionType = "M";
            //     } else if(that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
            //         selectionType = "S";
            //     }
            //     var ActivityId = activity
            //     var oFilters = [];

            //     if(token === ""){
            //     var sFilter = new sap.ui.model.Filter({
            //         path: "LOCATION_ID",
            //         operator: sap.ui.model.FilterOperator.EQ,
            //         value1: loc,
            //     });
            //     oFilters.push(sFilter);
            //     that.TempLocData.push(loc);
            // } else {
            //     for (var i = 0; i < loc.length; i++) {
            //         if (loc[i].getText() !== "ALL") {
            //             sFilter = new sap.ui.model.Filter({
            //                 path: "LOCATION_ID",
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: loc[i].getText(),
            //             });
            //             oFilters.push(sFilter);
            //         that.TempLocData.push(loc[i].getText());

            //         }
            //     }
            // }

            // if(verFlag === ""){
            //     if (selectionType === "M") {
            //         var aSelectedProd = that.oProd.getTokens();
            //         for (var i = 0; i < aSelectedProd.length; i++) {
            //             if (aSelectedProd[i].getText() !== "ALL") {
            //                 sFilter = new sap.ui.model.Filter({
            //                     path: "PRODUCT_ID",
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: aSelectedProd[i].getText(),
            //                 });
            //                 oFilters.push(sFilter);
            //             }
            //         }
            //     } else if (selectionType === "S") {
            //         var sFilter = new sap.ui.model.Filter({
            //             path: "PRODUCT_ID",
            //             operator: sap.ui.model.FilterOperator.EQ,
            //             value1: that.oProd.getValue(),
            //         });
            //         oFilters.push(sFilter);
            //     }
            // } else {
            //     if (selectionType === "M") {
            //         var aSelectedProd = that.oProd.getTokens();
            //         for (var i = 0; i < aSelectedProd.length; i++) {
            //             if (aSelectedProd[i].getText() !== "ALL") {
            //                 sFilter = new sap.ui.model.Filter({
            //                     path: "REF_PRODID",
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: aSelectedProd[i].getText(),
            //                 });
            //                 oFilters.push(sFilter);
            //             }
            //         }
            //     } else if (selectionType === "S") {
            //         var sFilter = new sap.ui.model.Filter({
            //             path: "REF_PRODID",
            //             operator: sap.ui.model.FilterOperator.EQ,
            //             value1: that.oProd.getValue(),
            //         });
            //         oFilters.push(sFilter);
            //     }
            // }

            //     if (ActivityId === "PUBLISH_FORECAST_ORDERS") {
            //         sap.ui.core.BusyIndicator.show();
            //         // that.getModel("BModel").callFunction("/getAllVerScen", {
            //     //     method: "GET",
            //     //     urlParameters: {
            //             // LOCATION_ID: loc[0],
            //     //         // PRODUCT_ID : that.oProd.getValue()
            //     //     },
            //     that.getModel("BModel").callFunction("/getAllVerScenMulti", {
            //         method: "GET",
            //         urlParameters: {
            //             LOC: JSON.stringify(that.TempLocData)
            //         },

            //             success: function (oData, oResponse) {
            //                 sap.ui.core.BusyIndicator.hide();
            //                 var adata = [];
            //                 var prodToken = that.oProd.getTokens();
            //                 // for (var i = 0; i < oData.results.length; i++) {
            //                 //     for (var j = 0; j < prodToken.length; j++) {
            //                 //     if (oData.results[i].PRODUCT_ID === prodToken[j].getText()) {
            //                 //         adata.push({
            //                 //             "VERSION_NAME": oData.results[i].VERSION,
            //                 //             "VERSION": oData.results[i].VERSION
            //                 //         });
            //                 //     }
            //                 // }
            //                 // }
            //                 if(verFlag === ""){
            //                     for (var i = 0; i < oData.results.length; i++) {
            //                         for (var j = 0; j < prodToken.length; j++) {
            //                             if (oData.results[i].PRODUCT_ID === prodToken[j].getText()) {
            //                             adata.push({
            //                                 "VERSION_NAME": oData.results[i].VERSION,
            //                                 "VERSION": oData.results[i].VERSION
            //                             });
            //                         }
            //                     }
            //                     }
            //                 } else {
            //                     for (var i = 0; i < oData.results.length; i++) {
            //                         for (var j = 0; j < prodToken.length; j++) {
            //                             if (oData.results[i].REF_PRODID === prodToken[j].getText()) {
            //                             adata.push({
            //                                 "VERSION_NAME": oData.results[i].VERSION,
            //                                 "VERSION": oData.results[i].VERSION
            //                             });
            //                         }
            //                     }
            //                     }
            //                 }
            //                 function removeDuplicate(array, key) {
            //                     var check = new Set();
            //                     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //                 }
            //                 that.verModel.setData({
            //                     results: removeDuplicate(adata, 'VERSION')
            //                 });
            //                 // if (adata.length > 0) {
            //                     // that.verModel.setData({
            //                     //     results: adata
            //                     // });
            //                     that.oVerList.setModel(that.verModel);
            //                 // }
            //             },
            //             error: function (oResponse) {
            //                 sap.ui.core.BusyIndicator.hide();
            //                 sap.m.MessageToast.show("Failed to get Version!");
            //             },
            //         });

            //     // } else if(ActivityId === "IMPORT_IBP_DEMAND_FUTURE"){
            //     } else {

            //         this.getModel("BModel").read("/getVerScnmaster", {
            //             success: function (oData) {
            //                 function removeDuplicate(array, key) {
            //                     var check = new Set();
            //                     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //                 }
            //                 that.verModel = new JSONModel();
            //                 that.verModel.setData({
            //                     results: removeDuplicate(oData.results, 'VERSION')
            //                 });
    
            //                 that.oVerList.setModel(that.verModel);
            //             },
            //             error: function (oData, error) {
            //                 MessageToast.show("error");
            //             },
            //         });
    
    
            //     }  
            //     // else {
            //     //     sap.ui.core.BusyIndicator.show();
            //     //     // Calling sercive to get the IBP Versions list
            //     //     this.getModel("BModel").read("/getIbpVerScn", {
            //     //         filters: oFilters,
            //     //         success: function (oData) {
            //     //             sap.ui.core.BusyIndicator.hide();
            //     //             function removeDuplicate(array, key) {
            //     //                 var check = new Set();
            //     //                 return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //     //             }
            //     //             that.verModel.setData({
            //     //                 results: removeDuplicate(oData.results, 'VERSION')
            //     //             });

            //     //             that.oVerList.setModel(that.verModel);
            //     //         },
            //     //         error: function (oData, error) {
            //     //             sap.ui.core.BusyIndicator.hide();
            //     //             MessageToast.show("error");
            //     //         },
            //     //     });
            //     // }
            // },

            /**
             * This function is called when Version is selected.
             * In this function we will get the Scenario for the selected version.
             * @param {object} oEvent -the event information.
             */
            // getScenario: function (activity) {
                
            //     var verFlag = "";
            // if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
            //     that.oProd = that.byId("CprodInputV");
            //     var verFlag = "X";
            // } else {
            //     that.oProd = that.byId("PprodInputV");
            //     var verFlag = "";
            // }

            //     var loc = "";
            //     that.TempLocData = [];
            //     if(that.byId("DM_LOCATION").getVisible() === true){
            //         loc = that.oLoc.getTokens();
            //         var token = "X";
            //     } else {
            //         loc = that.oMFLoc.getValue();
            //         var token = "";
            //     }
                
            //     var selectionType;
            //     if(that.oProd.getValue() === "" && that.oProd.getTokens().length > 0){
            //         selectionType = "M";
            //     } else if(that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
            //         selectionType = "S";
            //     }
            //     var ActivityId = activity;
                
                
            //     var oFilters = [];
            //     if(token === ""){
            //         var sFilter = new sap.ui.model.Filter({
            //             path: "LOCATION_ID",
            //             operator: sap.ui.model.FilterOperator.EQ,
            //             value1: loc,
            //         });
            //         oFilters.push(sFilter);
            //         that.TempLocData.push(loc);
            //     } else {
            //         for (var i = 0; i < loc.length; i++) {
            //             if (loc[i].getText() !== "ALL") {
            //                 sFilter = new sap.ui.model.Filter({
            //                     path: "LOCATION_ID",
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: loc[i].getText(),
            //                 });
            //                 oFilters.push(sFilter);
            //             that.TempLocData.push(loc[i].getText());

            //             }
            //         }
            //     }

            //     var sFilter = new sap.ui.model.Filter({
            //         path: "VERSION",
            //         operator: sap.ui.model.FilterOperator.EQ,
            //         value1: that.byId("idverV").getValue(),
            //     });
            //     oFilters.push(sFilter);

            //     if(verFlag === ""){
            //         if (selectionType === "M") {
            //             var aSelectedProd = that.oProd.getTokens();
            //             for (var i = 0; i < aSelectedProd.length; i++) {
            //                 if (aSelectedProd[i].getText() !== "ALL") {
            //                     sFilter = new sap.ui.model.Filter({
            //                         path: "PRODUCT_ID",
            //                         operator: sap.ui.model.FilterOperator.EQ,
            //                         value1: aSelectedProd[i].getText(),
            //                     });
            //                     oFilters.push(sFilter);
            //                 }
            //             }
            //         } else if (selectionType === "S") {
            //             var sFilter = new sap.ui.model.Filter({
            //                 path: "PRODUCT_ID",
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: that.oProd.getValue(),
            //             });
            //             oFilters.push(sFilter);
            //         }
            //     } else {
            //         if (selectionType === "M") {
            //             var aSelectedProd = that.oProd.getTokens();
            //             for (var i = 0; i < aSelectedProd.length; i++) {
            //                 if (aSelectedProd[i].getText() !== "ALL") {
            //                     sFilter = new sap.ui.model.Filter({
            //                         path: "REF_PRODID",
            //                         operator: sap.ui.model.FilterOperator.EQ,
            //                         value1: aSelectedProd[i].getText(),
            //                     });
            //                     oFilters.push(sFilter);
            //                 }
            //             }
            //         } else if (selectionType === "S") {
            //             var sFilter = new sap.ui.model.Filter({
            //                 path: "REF_PRODID",
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: that.oProd.getValue(),
            //             });
            //             oFilters.push(sFilter);
            //         }
            //     }

            //     if (ActivityId === "PUBLISH_FORECAST_ORDERS") {
            //         sap.ui.core.BusyIndicator.show();
            //         // that.getModel("BModel").callFunction("/getAllVerScen", {
            //     //     method: "GET",
            //     //     urlParameters: {
            //             // LOCATION_ID: loc[0],
            //     //         // PRODUCT_ID : that.oProd.getValue()
            //     //     },
            //     that.getModel("BModel").callFunction("/getAllVerScenMulti", {
            //         method: "GET",
            //         urlParameters: {
            //             LOC: JSON.stringify(that.TempLocData)
            //         },

            //             success: function (oData, oResponse) {
            //                 sap.ui.core.BusyIndicator.hide();
            //                 var adata = [];
            //                 var prodToken = that.oProd.getTokens();
            //                 var version = that.byId("idverV").getValue();
            //                 if(verFlag === ""){
            //                     for (var i = 0; i < oData.results.length; i++) {
            //                         for (var j = 0; j < prodToken.length; j++) {
            //                             if (oData.results[i].PRODUCT_ID === prodToken[j].getText() &&
            //                                 oData.results[i].VERSION === version) {
            //                                 adata.push({
            //                                     "SCENARIO_NAME": oData.results[i].SCENARIO_NAME,
            //                                     "SCENARIO": oData.results[i].SCENARIO
            //                                 });
            //                             }
            //                         }
            //                     }
            //                 } else {                        
            //                     for (var i = 0; i < oData.results.length; i++) {
            //                         for (var j = 0; j < prodToken.length; j++) {
            //                             if (oData.results[i].REF_PRODID === prodToken[j].getText() &&
            //                                 oData.results[i].VERSION === version) {
            //                                 adata.push({
            //                                     "SCENARIO_NAME": oData.results[i].SCENARIO_NAME,
            //                                     "SCENARIO": oData.results[i].SCENARIO
            //                                 });
            //                             }
            //                         }
            //                     }   
            //                 }
            //                 function removeDuplicate(array, key) {
            //                     var check = new Set();
            //                     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //                 }
    
            //                 if (adata.length > 0) {
            //                     that.scenModel = new JSONModel();
            //                     that.scenModel.setData({
            //                         results: removeDuplicate(adata, 'SCENARIO')
            //                     });
    
            //                     that.oScenList.setModel(that.scenModel);
            //                 } else {
            //                     that.scenModel = new JSONModel();
            //                     that.scenModel.setData({
            //                         results: []
            //                     });
    
            //                     that.oScenList.setModel(that.scenModel);
            //                 }
            //                 // if (adata.length > 0) {
            //                 //     that.scenModel.setData({
            //                 //         results: adata
            //                 //     });

            //                 //     that.oScenList.setModel(that.scenModel);
            //                 // }
            //             },
            //             error: function (oResponse) {
            //                 sap.ui.core.BusyIndicator.hide();
            //                 sap.m.MessageToast.show("Failed to get Version!");
            //             },
            //         });

            //     // } else if(ActivityId === "IMPORT_IBP_DEMAND_FUTURE"){
            //     } else {

            //         this.getModel("BModel").read("/getVerScnmaster", {
            //             success: function (oData) {
    
            //                 var filterScenarios = oData.results.filter(function (aComp) {
            //                     return aComp.VERSION === that.byId("idverV").getValue() ;
            //                 });
    
            //                 function removeDuplicate(array, key) {
            //                     var check = new Set();
            //                     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //                 }
            //                 that.scenModel = new JSONModel();
            //                 that.scenModel.setData({
            //                     results: removeDuplicate(filterScenarios, 'SCENARIO')
            //                 });
            //                 // that.scenModel.setData(oData);
            //                 that.oScenList.setModel(that.scenModel);
            //             },
            //             error: function (oData, error) {
            //                 MessageToast.show("error");
            //             },
            //         });
    
    
            //     } 
            //     // else {
            //     //     sap.ui.core.BusyIndicator.show();
            //     //     // Calling sercive to get the IBP Versions list
            //     //     this.getModel("BModel").read("/getIbpVerScn", {
            //     //         filters: oFilters,
            //     //         success: function (oData) {
            //     //             sap.ui.core.BusyIndicator.hide();
            //     //             function removeDuplicate(array, key) {
            //     //                 var check = new Set();
            //     //                 return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            //     //             }
            //     //             that.scenModel.setData({
            //     //                 results: removeDuplicate(oData.results, 'SCENARIO')
            //     //             });
            //     //             // that.scenModel.setData(oData);
            //     //             that.oScenList.setModel(that.scenModel);
            //     //         },
            //     //         error: function (oData, error) {
            //     //             sap.ui.core.BusyIndicator.hide();
            //     //             MessageToast.show("error");
            //     //         },
            //     //     });
            //     // }

            // },
            
            getClass:function(oEvent){


                var verFlag = "";
                if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                    that.oProd = that.byId("CprodInputV");
                } else {
                    that.oProd = that.byId("PprodInputV");
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
                        that.classData = oData.results;
                        if (oData.results.length > 0) {
                            oData.results.unshift({
                                CLASS_NUM: "ALL",
                                CLASS_NAME: "ALL",
                            });
                        }
                        that.classModel.setData(oData);
                        that.oClassList.setModel(that.classModel);

                        that.oClass = that.byId("classInputV");
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
                                        sap.ui.getCore().byId("ClassSlctListT").getItems()[j].setSelected(true);
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

            // getCustGroup:function(){
            //     sap.ui.core.BusyIndicator.show();
            //     // Calling service to get the Customer data
            //     this.getModel("BModel").read("/getCustgroup", {
            //         success: function (oData) {
            //             sap.ui.core.BusyIndicator.hide();
            //             that.custGroupModel = new JSONModel();
            //             that.custGroupModel.setData(oData);
            //             that.oCustGroupList.setModel(that.custGroupModel);

                       
            //         },
            //         error: function (oData, error) {
            //             sap.ui.core.BusyIndicator.hide();
            //             MessageToast.show("failed to fetch the customer groups");
            //         },
            //     });

            // },

            // onModelChange:function(){
            //     var sel = that.byId("idModelVerV").getSelectedKey();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;
            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].MODEL_VERSION = sel;

            // },

            // OnGentypeChange:function(){
            //     var sel = that.byId("GenidTypeV").getSelectedKey();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].GEN_TYPE = sel;

            // },

            // onOverride:function(){
            //     var sel = that.byId("idOverrideV").getSelected();
                

            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;
                    
            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                
            //     that.TempParams[index].OVERRIDE_ASSIGNMENT = sel;

            // },

            // onCritical:function(){
            //     var sel = that.byId("idCriticalV").getSelected();
               
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].CRITICAL_ASSEMBLY = sel;

            // },

            // onImpact:function(){
            //     var sel = that.byId("idImpactV").getSelected();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].IMPACT_ANALYSIS = sel;

            // },

            // onDaily:function(){
            //     var sel = that.byId("idDailyV").getSelected();
               
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].DAILY = sel;

            // },

            onRolling:function(){
                var sel = that.byId("idRollingV").getSelected();
                
                // // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                // //     Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                // // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                // // that.TempParams[index].Rolling = sel;
                // that.byId("FromDateV").setValue();
                //     that.byId("ToDateV").setValue();
                if(sel){
                    that.byId("FromDateV").setEditable(false);
                    that.byId("ToDateV").setEditable(false);
                    that.byId("idRollingWeeksV").setValue();
                    that.byId("idRollingWeeksV").setVisible(true);
                } else {
                    that.byId("FromDateV").setEditable(true);
                    that.byId("ToDateV").setEditable(true);
                    that.byId("idRollingWeeksV").setValue();
                    that.byId("idRollingWeeksV").setVisible(false);
                }

            },

            onRollWeekchange:function(oEvent){
                var week = parseInt(that.byId("idRollingWeeksV").getValue());

            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //     Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                
                if(week > 0){
                    var newDate = new Date(new Date(). getTime() + week * 7 * 24 * 60 * 60 * 1000);
                        that.byId("FromDateV").setValue(new Date().toISOString().split("T")[0]);
                        that.byId("ToDateV").setValue(newDate.toISOString().split("T")[0]);
                        // that.TempParams[index].Rolling_Timestamp = week;
                        // that.TempParams[index].FROM_DATE = new Date().toISOString().split("T")[0];
                        // that.TempParams[index].TO_DATE = newDate.toISOString().split("T")[0];
                    
                } else {
                    MessageToast.show("Please maintain valid weeks");
                        that.byId("FromDateV").setValue();
                        that.byId("ToDateV").setValue();
                        // that.TempParams[index].Rolling_Timestamp = "";
                        // that.TempParams[index].FROM_DATE = "";
                        // that.TempParams[index].TO_DATE = "";
                }

            },


            // OnOptAlgChange:function(){
            //     var sel = that.byId("PidOptAlg").getSelectedKey();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].OptAlgorithm = sel;

            // },

            // OnOptFctChange:function(){
            //     var sel = that.byId("PidOptFct").getSelectedItem().getText();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].OptFactor = parseFloat(sel);

            // },

            // OnDsAlgChange:function(){
            //     var sel = that.byId("PidDSAlg").getSelectedKey();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].DsAlgorithm = sel;

            // },

            onOperatorChange:function(){
            //     var selOpr = that._oCore.byId("idOperatorV").getSelectedKey();
            // that._oCore.byId("singleDtV").setValue();
            // if (selOpr === "BT") {
            //     that._oCore.byId("SINGLE_DATE").setVisible(false);
            // } else {
            //     that._oCore.byId("SINGLE_DATE").setVisible(true);
            // }

            var selOpr = that.byId("idOperatorV").getSelectedKey();
            that.byId("singleDtV").setValue();
            if (selOpr === "BT") {
                that.byId("SINGLE_DATEV").setVisible(false);
            } else {
                that.byId("SINGLE_DATEV").setVisible(true);
            }
                


            },





            handleDateChange:function(oEvent){
                var FromDateV = that.byId("FromDateV").getValue();
                // var ToDateV = that.byId("ToDateV").getValue();
                // var Exists =[];
                // selStep = that.getView().byId("idarrowTitle").getText();

                var selDate  = oEvent.getParameters().id;

                if(selDate.includes("FromDateV")){
                    that.byId("ToDateV").setEditable(true);
                    that.byId("ToDateV").setMinDate(new Date(FromDateV));

                }
                

                // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep);

                // that.TempParams[index].FROM_DATE = FromDateV;
                //     that.TempParams[index].TO_DATE = ToDateV;

            },

            handleDateChange1:function(oEvent){
                var singleDate = that.byId("singleDtV").getValue();
                // selStep = that.getView().byId("idarrowTitle").getText();
                // var selDate  = oEvent.getParameters().id;
                // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep);
                // that.TempParams[index].SINGLE_DATE = singleDate;

            },

        // Saving Template, Temlate Steps, Parameters with values
        onSave:function(){
            if(that.oGModel.getProperty("/type") === "E"){
                // that.onSave1();
                that.onSaveTemplate();
            } else {
            sap.ui.core.BusyIndicator.show();
            var TempId = that.byId("idTemp").getValue();
            // TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
            TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());

            that.getModel("JModel").read("/readTemplates", {
                filters: [
                    new Filter("TEMPLATE_ID", FilterOperator.EQ, TempId),
                    new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                        ], and:true,
                success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                if(oData.results.length === 0){
                    // that.onSave1();
                    that.onSaveTemplate();
                } else {
                    MessageToast.show("Given template name is already in use, Please change the name.");
                   }
    
                },
                error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Failed to get data");
                },
            });
        }


        },

        onSaveVariant:function(){
            that.getParamsData();

            var User = "";

            if (sap.ushell.Container) {
                let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                User = (email) ? email : "";
            }
            var temp = that.byId("idVariant").getValue();
            var tempDesc = that.byId("idVarDesc").getValue();
                var VariantName = temp.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());
                var VariantDesc = tempDesc.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());

            // Parameter values
            var mfloc =that.oGModel.getProperty("/manuLocation");
            var dloc =that.oGModel.getProperty("/demandLocation");
            var confProd=that.oGModel.getProperty("/ConfProd");
            var prod=that.oGModel.getProperty("/product");
            var custGroupData=that.oGModel.getProperty("/custGroupData");
            var clsData=that.oGModel.getProperty("/classData");
            var others=that.oGModel.getProperty("/otherParams");
            var MF_LOCATION_ID = "",
                LOCATION_ID = "",
                CONFIG_PRODUCT = "",
                PARTIAL_PRODUCT = "",
                CUSTOMER_GROUP = "",
                CLASS    = "";

                function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }
                            
            mfloc = removeDuplicate(mfloc, 'FACTORY_LOC');
            mfloc.forEach(el => {
                if(MF_LOCATION_ID === ""){
                    MF_LOCATION_ID = el.FACTORY_LOC;
                } else {
                    MF_LOCATION_ID = MF_LOCATION_ID + "," + el.FACTORY_LOC;
                }
            });

            dloc = removeDuplicate(dloc, 'DEMAND_LOC');
            dloc.forEach(el => {
                if(LOCATION_ID === ""){
                    LOCATION_ID = el.DEMAND_LOC;
                } else {
                    LOCATION_ID = LOCATION_ID + "," + el.DEMAND_LOC;
                }
            });

            confProd = removeDuplicate(confProd, 'REF_PRODID');
            confProd.forEach(el => {
                if(CONFIG_PRODUCT === ""){
                    CONFIG_PRODUCT = el.REF_PRODID;
                } else {
                    if(!CONFIG_PRODUCT.includes(el.REF_PRODID)){
                        CONFIG_PRODUCT = CONFIG_PRODUCT + "," + el.REF_PRODID;
                    }
                    
                }
            });

            prod = removeDuplicate(prod, 'PRODUCT_ID');
            prod.forEach(el => {
                if(PARTIAL_PRODUCT === ""){
                    PARTIAL_PRODUCT = el.PRODUCT_ID;
                } else {
                    if(!PARTIAL_PRODUCT.includes(el.PRODUCT_ID)){
                        PARTIAL_PRODUCT = PARTIAL_PRODUCT + "," + el.PRODUCT_ID;
                    }
                }
            });

            custGroupData = removeDuplicate(custGroupData, 'CUSTOMER_GROUP');
            custGroupData.forEach(el => {
                if(CUSTOMER_GROUP === ""){
                    CUSTOMER_GROUP = el.CUSTOMER_GROUP;
                } else {
                    if(!CUSTOMER_GROUP.includes(el.CUSTOMER_GROUP)){
                        CUSTOMER_GROUP = CUSTOMER_GROUP + "," + el.CUSTOMER_GROUP;
                    }
                }
            });

            clsData = removeDuplicate(clsData, 'CLASS');
            clsData.forEach(el => {
                if(CLASS === ""){
                    CLASS = el.CLASS;
                } else {
                    if(!CLASS.includes(el.CLASS)){
                        CLASS = CLASS + "," + el.CLASS;
                    }
                }
            });

            others.MF_LOCATION_ID = MF_LOCATION_ID;
            others.LOCATION_ID = LOCATION_ID;
            others.CONFIG_PRODUCT = CONFIG_PRODUCT;
            others.PARTIAL_PRODUCT = PARTIAL_PRODUCT;
            // others.PRODUCT_ID = PARTIAL_PRODUCT;
            others.CUSTOMER_GROUP = CUSTOMER_GROUP;
            others.CLASS = CLASS;

            console.log(others);

            that.ParametersData = [];
            Object.entries(others).forEach(function(x, i) {


                const obj = {
                    "VARIANT_NAME": VariantName,
                    "VARIANT_DESC": VariantDesc,
                    "PARAMETER_ID": x[0],
                    "VALUE": x[1].toString()
                }
                that.ParametersData.push(obj);

            });

            console.log(that.ParametersData);
            var selType = that.oGModel.getProperty("/type");

            sap.ui.core.BusyIndicator.show();
            that.getModel("JModel").callFunction("/genVariantData", {
            method: "GET",
            urlParameters: {
                FLAG:selType,
                VARIANT_DATA: JSON.stringify(that.ParametersData)
            },
            success: function (oData) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show(oData.genVariantData);
                that.getVariant();
                
            },
            error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error to create Template");
            },
        });



        },


        DeleteVariant:function(variant){
        that.ParametersData = [];
            const obj = {
                    "VARIANT_NAME": variant,
                }
                that.ParametersData.push(obj);

            

            sap.ui.core.BusyIndicator.show();
            that.getModel("JModel").callFunction("/genVariantData", {
                method: "GET",
                urlParameters: {
                    FLAG:"D",
                    VARIANT_DATA: JSON.stringify(that.ParametersData)
                },
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show(oData.genVariantData);
                    that.getVariant();
                    
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error to create Template");
                }

             });

        },
            onSave1:function(){

                var parameters = that.TempParams;
                // var parameters = that.TemplateModel.getData().results;
                that.Parameters =[];
                // To get the user details
                var User = "";

                if (sap.ushell.Container) {
                    let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                    User = (email) ? email : "";
                }
                var temp = that.byId("idTemp").getValue();
                    // var tempplateName = temp.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
                    var tempplateName = temp.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());

                that.TempData.forEach(el =>{
                    // var temp = that.byId("idTemp").getValue();
                    // var tempplateName = temp.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
                    el.TEMPLATE_ID = tempplateName;

                    el.TEMPLATE_DESC = that.byId("idTempDesc").getValue();
                    el.VARIANT_NAME = "NA";
                })

                parameters.forEach(el => {
                    var length = 0;
                    Object.entries(el).forEach(x => {
                        
                        if (!x[0].includes("ACTIVITY_ID") && !x[0].includes("TEMPLATE_ID") && !x[0].includes("ACT_POSITION")
                        && !x[0].includes("counter") && !x[0].includes("newStep") && !x[0].includes("LEVEL")) {
                            // var temp = that.byId("idTemp").getValue();
                            // var tempplateName = temp.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase())
                            const obj = {
                                "TEMPLATE_ID": tempplateName,
                                "ACTIVITY_ID": el.ACTIVITY_ID,  
                                "ACT_POSITION" : el.ACT_POSITION,   
                                "LEVEL"        : el.LEVEL,
                                "PARAMETER_ID": x[0],
                                "VALUE": x[1].toString()
                            }
                            that.Parameters.push(obj);
                            length = 1;
                        }
                    })
                    if(length === 0){
                        const obj = {
                            // "TEMPLATE_ID": that.byId("idTemp").getValue(),
                            "TEMPLATE_ID": tempplateName,
                            "ACTIVITY_ID": el.ACTIVITY_ID,  
                            "ACT_POSITION" : el.ACT_POSITION,
                            "LEVEL"        : el.LEVEL,   
                            "PARAMETER_ID": "",
                            "VALUE": ""
                        }
                        that.Parameters.push(obj);
                    }
                })


                var selType = that.oGModel.getProperty("/type");

                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").callFunction("/genTemplateDetails", {
                method: "GET",
                urlParameters: {
                    FLAG:selType,
                    VARIANT : "",
                    TEMPDATA: JSON.stringify(that.TempData),
                        PARAMDATA:JSON.stringify(that.Parameters)
                },
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show(oData.genTemplateDetails);
                    that.onBack();
                    
                },
                error: function (error) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error to create Template");
                },
            });


            }
            
        });
    });
