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
                that.MFlocModel = new JSONModel();
                that.locModel = new JSONModel();
                that.prodModel = new JSONModel();
                that.ConfprodModel = new JSONModel();
                that.ppfModel = new JSONModel();
                that.fapModel = new JSONModel();
                that.verModel = new JSONModel();
                that.scenModel = new JSONModel();
                that.classModel = new JSONModel();
                that.MFlocModelUni = new JSONModel();

                that.custGroupModel = new JSONModel();
                that.varinatModel = new JSONModel();

                that.oGModel = that.getOwnerComponent().getModel("oGModel");

                that.oModel.setSizeLimit(2000);
                that.TemplateModel.setSizeLimit(2000);
                that.stepsModel.setSizeLimit(2000);
                that.TemplateModelSel.setSizeLimit(2000);
                // that.locModel.setSizeLimit(2000);
                // that.prodModel.setSizeLimit(2000);
                that.ppfModel.setSizeLimit(2000);
                that.fapModel.setSizeLimit(2000);
                that.classModel.setSizeLimit(2000);
                that._oCore = sap.ui.getCore();

            },

            onAfterRendering: async function () {
                // //need to remove this line
                // that.oGModel.setProperty("/auth", "I");
                if (that.oGModel.getProperty("/auth") === undefined || that.oGModel.getProperty("/auth") === null ||
                    that.oGModel.getProperty("/auth") === "") {
                    sap.ui.core.BusyIndicator.show();
                    var flag = "";
                    that.onBack("", flag);
                    return;
                } else {
                    that.TempParams = [];
                    that.MFLocDataUni = [];
                    sap.ui.core.BusyIndicator.show();
                    that.oGModel.setProperty("/CommonParam", "");

                    that.byId("idTempValue").setValue();
                    that.byId("idJobname").setValue();
                    that.byId("idJobSchtype").setSelectedKey("Im");
                    that.byId("idWeek").setSelectedKey("0");
                    that.byId("idyear").setValue();
                    that.byId("idmnth").setValue();
                    that.byId("iddate").setValue();
                    that.byId("idhrs").setValue();
                    that.byId("idmin").setValue();
                    // that.byId("idarrow").setVisible(false);
                    // that.byId("idParameter").setVisible(false);
                    that.byId("idCronValues").setVisible(false);

                    that.Edit = that.oGModel.getProperty("/EditFlag");
                    that.EditData = that.oGModel.getProperty("/editData");
                    // that.byId("idarrowTitle").setText("");
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
                        "Value": "Any Value",
                    }, {
                        "Expression": "*/a",
                        "Usage": "anywhere",
                        "Value": "any a-th value",
                    }, {
                        "Expression": "a:b",
                        "Usage": "anywhere",
                        "Value": "Values in the range a to b.",
                    }, {
                        "Expression": "a:b/c",
                        "Usage": "anywhere",
                        "Value": "Every c-th value between a and b.",
                    }, {
                        "Expression": "a.y",
                        "Usage": "Day of the week",
                        "Value": "On the a-th occurrence of the weekday y (a = -5 to 5)",
                    }, {
                        "Expression": "a,b,c",
                        "Usage": "anywhere",
                        "Value": "a or b or c",
                    },];

                    var jmodel = new sap.ui.model.json.JSONModel(that.typeData);
                    // this.getView().byId("GenidType").setModel(jmodel);

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

                    that.byId("PidOptProfileU").setEnabled(false);

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
                        that.byId("idcreateJob").setVisible(true);
                        // that.byId("idUniversal").setVisible(true);

                        that.byId("idupdate").setVisible(false);
                        that.byId("idJobSchtype").setEnabled(true);
                        // that.byId("ideditJob").setVisible(false);

                    } else if (that.Edit === "X") {
                        that.byId("page").setTitle("Update Job");
                        that.byId("idJobname").setEditable(false);
                        that.byId("idTempValue").setEditable(false);
                        that.byId("idcreateJob").setVisible(false);
                        // that.byId("idUniversal").setVisible(false);
                        that.byId("idupdate").setVisible(true);
                        that.byId("idJobSchtype").setEnabled(false);
                        // that.byId("ideditJob").setVisible(true);
                    }


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
                    if (!this._valueHelpDialogConfProd) {
                        this._valueHelpDialogConfProd = sap.ui.xmlfragment(
                            "vcpapp.vcpjobschedulersequence.view.confProdDialog",
                            this
                        );
                        this.getView().addDependent(this._valueHelpDialogConfProd);
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

                    if (!this._valueHelpDialogVariant) {
                        this._valueHelpDialogVariant = sap.ui.xmlfragment(
                            "vcpapp.vcpjobschedulersequence.view.VariantDialog",
                            this
                        );
                        this.getView().addDependent(this._valueHelpDialogVariant);
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
                    this.oProdList = this._oCore.byId("prodSlctListJSS");
                    this.oConfProdList = this._oCore.byId("ConfProductSlctListJSS");
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

                    this.oMFLocListUni = this._oCore.byId("MFLSlctListJSSMul");

                    this.oVariList = this._oCore.byId("variantSlctListJSS");

                    that.oLocData = that.oGModel.getProperty("/homeAllLocationData");
                    that.ConfProdall = that.oGModel.getProperty("/homeAllLocationProductData");

                    if(that.oLocData.length >0){
                        that.oLocData = that.oLocData.filter(f=>f.CREATE == 1);
                    }
                    if(that.ConfProdall.length >0){
                        that.ConfProdall = that.ConfProdall.filter(f=>f.CREATE == 1);
                    }
                    that.skip = 0;

                    that.TotalDataUni = that.oLocData;
                    function removeDuplicate(array, key) {
                        var check = new Set();
                        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    }
                    that.MFLocDataUni = removeDuplicate(that.oLocData, 'FACTORY_LOC');

                    that.uniqConfprod = that.ConfProdall.filter(el => el.CONFIGPROD_CHK === "X");

                    // // Calling service to get the Location data
                    // // this.getModel("BModel").read("/getMfLocation", {
                    // this.getModel("BModel").read("/getMFMaster", {
                    //     success: function (oData) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         that.ManuLocData = oData.results;

                    //         function removeDuplicate(array, key) {
                    //             var check = new Set();
                    //             return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    //         }
                    //         that.MFLocData = removeDuplicate(oData.results, 'FACTORY_LOC');
                    //         that.MFlocModel.setData({
                    //             MFLocitems: that.MFLocData
                    //         });
                    //         that.oMFLocList.setModel(that.MFlocModel);
                    //         that.oLocData = [];
                    //         that.ConfProdall = [];
                    //         that.skip = 0;
                    //         that.getAllLocaions();
                    //         that.getProducts();
                    //     },
                    //     error: function (oData, error) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         MessageToast.show("Failed to get location data");
                    //     },
                    // });




                    // try{
                    //     await 
                    
                            sap.ui.core.BusyIndicator.show();
                            var myP1 = new Promise((resolve, reject) => {
                            that.getModel("JSModel").read("/readTemplates", {
                                filters: [
                                    new Filter("VARIANT_NAME", FilterOperator.EQ, "NA"),
                                    // new Filter("TEMPLATE_ID", FilterOperator.EQ, TempId),
                                ],
                                success: function (oData) {
                                    // sap.ui.core.BusyIndicator.hide();
                                    that.TemplateDetail = oData.results;

                                    if (that.oGModel.getProperty("/auth") === "E") {
                                        var tempData = oData.results.filter(obj => obj.LEVEL !== "I");
                                    } else {
                                        var tempData = oData.results
                                    }
                                    that.TemplateModel = new JSONModel();
                                    that.TemplateModel.setData({
                                        TemplateItems: tempData,
                                    });
                                    sap.ui.getCore().byId("TempSlctListJSS").setModel(that.TemplateModel);
                                    resolve(true);

                                },
                                error: function (error) {
                                    sap.ui.core.BusyIndicator.hide();
                                    MessageToast.show("Failed to get templates data");
                                },
                            });

                        });
                    
                

                    // sap.ui.core.BusyIndicator.show();
                    var myP2 = new Promise((resolve, reject) => {
                    that.getModel("JSModel").read("/readActivityHeader", {
                        // filters: [ new Filter( "TEMPLATE_ID", FilterOperator.EQ, SelValue )
                        //         ],
                        success: function (oData) {
                            // sap.ui.core.BusyIndicator.hide();

                            that.ActivityHeader = oData.results;
                            resolve(true);

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get activities data");
                        },
                    });

                });

                    // sap.ui.core.BusyIndicator.show();
                    var myP3 = new Promise((resolve, reject) => {

                    that.getModel("JSModel").read("/readActivityItems", {
                        filters: [new Filter("PARAMETER_ID", FilterOperator.NE, "")],
                        success: function (oData) {
                            // sap.ui.core.BusyIndicator.hide();

                            that.ActivityItems = oData.results;
                            resolve(true);

                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get activity item data");
                        },
                    });
                });

                var myP4 = new Promise((resolve, reject) => {
                    that.getModel("BModel").read("/getPlancfgPara", {
                        filters: [
                            new Filter("PARAMETER_ID", FilterOperator.EQ, "20"),
                            new Filter("PARAMETER_ID", FilterOperator.EQ, "21"),
                        ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            function removeDuplicate(array, key) {
                                var check = new Set();
                                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                            }

                            that.DefaultVersce = removeDuplicate(oData.results, 'PARAMETER_ID');
                            resolve(true);

                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                            sap.ui.core.BusyIndicator.hide();
                        },
                    });
                });
                var myP5 = new Promise((resolve, reject) => {
                    // calling service to get the version scenario data
                    this.getModel("BModel").read("/getVerScnmaster", {
                        success: function (oData) {
                            // sap.ui.core.BusyIndicator.hide();
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
                            resolve(true);
                        },
                        error: function (oData, error) {
                            MessageToast.show("error");
                            sap.ui.core.BusyIndicator.hide();
                        },
                    });
                });

                var myP6 = new Promise((resolve, reject) => {
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

                    // this.getModel("BModel").read("/getLocProdDetNew", {
                    //     success: function (oData) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         var data = JSON.parse(oData.getLocProdDetNew);
                    //         that.AllLocProdDataConf = data;
                    //     },
                    //     error: function (oData, error) {
                    //         sap.ui.core.BusyIndicator.hide();
                    //         MessageToast.show("Failed to get products data");
                    //     },
                    // });

                    // Calling service to get the Profiles data
                    this.getModel("BModel").read("/getProfiles", {
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.PredictionData = oData.results;
                            that.ppfModel = new JSONModel();
                            oData.results = oData.results.filter(el => el.METHOD !== "AES");
                            that.ppfModel.setData(oData);
                            that._valueHelpDialogPPF.setModel(that.ppfModel);

                            var data = oData.results.filter(el => el.METHOD === "AES");
                            that.fapModel = new JSONModel();
                            that.fapModel.setData({
                                results: data
                            });
                            that._valueHelpDialogFAP.setModel(that.fapModel);
                                resolve(true);
                            // if(that.Edit === "X"){
                            // that.JobEdit();
                            // }
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get Prediction profiles data");
                        },
                    });
                });

                var myP7 = new Promise((resolve, reject) => {
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
                });


                var myP8 = new Promise((resolve, reject) => {
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
                                      that.byId("PidOptProfileU").setModel(that.POptmodel);
                                      that.byId("idOptProfileU").setModel(that.Optmodel);
                                      that.byId("PidOptProfileU").setSelectedKey(Optimizations[0].PROFILE);
                                      that.byId("idOptProfileU").setSelectedKey(Optimizationsnew[0].PROFILE);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                });

                 var myP9 = new Promise((resolve, reject) => {
                    sap.ui.core.BusyIndicator.show();
                    // Calling service to get the profile data
                    this.getModel("BModel").read("/getProfileLocProd", {
                        // filters: [
                        //     new Filter("PRODUCT_ID", FilterOperator.EQ, "NA")
                        // ],
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            
                            that.ProfileData = [...oData.results];
                            
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                });

        var myP10 = new Promise((resolve, reject) => {
                    sap.ui.core.BusyIndicator.show();
                this.getModel("BModel").read("/getCustgroup", {
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.custGroupModel = new JSONModel();
                            that.custGroupValues = [...oData.results];
                            that.custGroupModel.setData(oData);
                            that.oCustGroupList.setModel(that.custGroupModel);

                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("failed to fetch the customer groups");
                        },
                    });

                    this.getModel("JSModel").read("/getVariantData", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();                  
                        that.VariantModel = new JSONModel();
                        that.VariantModel.setData({
                            results: oData.results
                        });
                        that.oVariList.setModel(that.VariantModel);

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
                    });

                var RefInterval = 1000;
                var Interval = setInterval(async () => {

                    if (myP1 && myP2 && myP3 && myP4 && myP5 && myP6 && myP7 && myP8 && myP9 && myP10) {

                        clearInterval(Interval);
                        Interval = null;

                    if (that.TotalDataUni.length > 0 && that.ConfProdall.length > 0) {
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
                                    // var filt = that.oGModel.getProperty("/CommonFilter");
                                    // if (filt === "X") {
                                    //     that.CommonFilEdit();
                                    // } else {
                                    //     that.JobEdit();
                                    // }

                                    that.TemplateItems = oData.results;
                                    that.CommonFilEdit();

                                },
                                error: function (error) {
                                    sap.ui.core.BusyIndicator.hide();
                                    MessageToast.show("Failed to get job details data");
                                },
                            });

                        }
                    }
                }

                },RefInterval);
                // } catch (error) {
                //     console.error("An error occurred while calling the services:", error);
                // }
                }

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

            //         },
            //         error: function (oData, error) {
            //             sap.ui.core.BusyIndicator.hide();
            //             MessageToast.show("Failed to get data");
            //         },
            //     });

            // },

            // getProducts:function(){

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

            //                     that.getProducts();
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
                if (this._templateDialog) {
                    that.destroy();
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
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
                this._valueHelpDialog.destroy();
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
                this._valueHelpDialog = "";
                this._valueHelpDialogClassDetails = "";
                this._valueHelpDialogCustGroup = "";
                this._valueHelpDialogMFLUni = "";
                that._valueHelpDialogConfProd = "";
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
                    ],
                    and: true,
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

                tempData.forEach(function (el, i) {
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === el.ACTIVITY_ID);

                    if (index === -1) {
                        that.TempParams.push(tempData[i]);
                    } else {

                        Object.entries(el).forEach(x => {
                            if (x[0] === "LOCATION_ID") {
                                if (!that.TempParams[index].LOCATION_ID.includes(x[1])) {
                                    that.TempParams[index].LOCATION_ID = that.TempParams[index].LOCATION_ID + "," + x[1];
                                }
                                if (that.TempParams[index].LOCATION_ID === that.TempParams[index].MF_LOCATION_ID) {
                                    delete that.TempParams[index].LOCATION_ID;
                                }

                            } else if (x[0].includes("PRODUCT")) {
                                var isArray = Array.isArray(that.TempParams[index].PRODUCT_ID);
                                if (isArray) {
                                    if (!that.TempParams[index].PRODUCT_ID.includes("ALL")) {
                                        that.TempParams[index].PRODUCT_ID = that.TempParams[index].PRODUCT_ID.toString() + "," + x[1].toString();
                                    }
                                    1
                                } else {
                                    if (!that.TempParams[index].PRODUCT_ID.includes("ALL")) {
                                        that.TempParams[index].PRODUCT_ID = that.TempParams[index].PRODUCT_ID + "," + x[1];
                                    }
                                }

                            }

                        })
                    }
                })
                that.TempParams.forEach(function (el, s) {
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
                        setTimeout(() => {
                            that.byId("scheduleStep").mAggregations._nextButton.setText("Parameters");
                        }, 0);
                    }

                }
            },
            onHelpPress: function () {
                that.help = new JSONModel();
                that.help.setData({
                    results: that.CronValueTypes
                });
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

                    // that.byId("TempTypeStep")._oNextButton.setText("Scheduling Options");
                    // oStep.mAggregations._nextButton.setText("Demand Locations");
                    that.byId("TempTypeStep").mAggregations._nextButton.setText("Scheduling Options");

                    if (that.Edit !== "X") {
                        that.byId("idcreateJob").setVisible(true);
                        that.byId("idupdate").setVisible(false);
                    } else {
                        that.byId("idcreateJob").setVisible(false);
                        that.byId("idupdate").setVisible(true);
                    }
                    // that.byId("idUniversal").setVisible(true);
                    this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                    that.byId("scheduleStep").setValidated(false);

                } else {
                    this.byId("CreateWizard").invalidateStep(this.byId("TempTypeStep"));
                    that.byId("TempTypeStep").setValidated(false);
                    if (that.Edit !== "X") {
                        that.byId("idcreateJob").setVisible(false);
                        that.byId("idupdate").setVisible(false);
                    } else {
                        that.byId("idcreateJob").setVisible(false);
                        that.byId("idupdate").setVisible(false);
                    }
                    // that.byId("idUniversal").setVisible(false);
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

                    setTimeout(() => {
                        that.byId("scheduleStep").mAggregations._nextButton.setText("Parameters");
                    }, 0);

                    if (that.Edit !== "X") {
                        that.byId("idcreateJob").setVisible(true);
                        that.byId("idupdate").setVisible(false);
                    } else {
                        that.byId("idcreateJob").setVisible(false);
                        that.byId("idupdate").setVisible(true);
                    }
                    // that.byId("idUniversal").setVisible(true);
                } else {
                    this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                    that.byId("scheduleStep").setValidated(false);

                    this.byId("CreateWizard").invalidateStep(this.byId("TempTypeStep"));
                    that.byId("TempTypeStep").setValidated(false);

                    if (that.Edit !== "X") {
                        that.byId("idcreateJob").setVisible(false);
                        that.byId("idupdate").setVisible(false);
                    } else {
                        that.byId("idcreateJob").setVisible(false);
                        that.byId("idupdate").setVisible(false);
                    }
                    // that.byId("idUniversal").setVisible(false);
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
                that.byId("idcreateJob").setVisible(false);
                that.byId("idupdate").setVisible(false);
                that.byId("idJodFeed").setVisible(false);
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
                    setTimeout(() => {
                        that.byId("scheduleStep").mAggregations._nextButton.setText("Parameters");
                    }, 0);

                    // this.byId("CreateWizard").validateStep(this.byId("idParameters"));
                    // that.byId("idParameters").setValidated(true);
                    this.byId("CreateWizard").invalidateStep(this.byId("idParameters"));
                    that.byId("idParameters").setValidated(false);
                    that.byId("parameterData").setVisible(true);
                    if (that.Edit !== "X") {
                        that.byId("idcreateJob").setVisible(true);
                        that.byId("idupdate").setVisible(false);
                        that.onCommonParams();
                    } else {
                        that.byId("idcreateJob").setVisible(false);
                        that.byId("idupdate").setVisible(true);
                    }
                    that.byId("idJodFeed").setVisible(true);


                    // if (that.Edit !== "X") {
                    //     that.onCommonParams();
                    // }
                } else {
                    this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                    that.byId("scheduleStep").setValidated(false);

                    this.byId("CreateWizard").invalidateStep(this.byId("idParameters"));
                    that.byId("idParameters").setValidated(false);

                    // that.byId("idarrow").setVisible(false);
                    // that.byId("idParameter").setVisible(false);
                    MessageToast.show("Please maintain valid data");
                    // that.byId("idcreateJob").setVisible(false);
                    // that.byId("idUniversal").setVisible(false);
                    that.byId("parameterData").setVisible(false);
                }

            },

            onSnapShot: function (oEvent) {
                var flag = that.oGModel.getProperty("/CommonParam");
                // if (flag === "") {
                //     var sel = that.byId("idSnapShot").getSelected();
                //     that.byId("idSnapRadio").setSelectedButton(that.byId("create"));

                //     var selStep = that.getView().byId("idarrowTitle").getText(),
                //         step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                //     var temp = "",
                //         tempDesc = "";

                //     if (sel) {
                //         that.byId("SnapR").setVisible(true);
                //         that.byId("snapDesc").setVisible(true);
                //         that.TempParams[index].SnapShot = "C";
                //         that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();
                //         temp = "C";
                //         tempDesc = that.byId("idSnapDesc").getValue();
                //     } else {
                //         that.byId("SnapR").setVisible(false);
                //         that.byId("snapDesc").setVisible(false);
                //         that.TempParams[index].SnapShot = "";
                //         that.TempParams[index].SnapShot_Desc = "";
                //     }

                //     that.ChnageData(temp, selStep, "SnapShot");
                //     that.ChnageData(tempDesc, selStep, "SnapShot_Desc");
                // } else {
                var sel = that.byId("idSnapShotU").getSelected();
                that.byId("idSnapRadioU").setSelectedButton(that.byId("createU"));
                if (sel) {
                    that.byId("SnapRU").setVisible(true);
                    that.byId("snapDescU").setVisible(true);
                } else {
                    that.byId("SnapRU").setVisible(false);
                    that.byId("snapDescU").setVisible(false);
                }
                // }

            },

            OnsnapSelect: function () {
                var flag = that.oGModel.getProperty("/CommonParam");
                // if (flag === "") {
                //     var selRadio = that.byId("idSnapRadio").getSelectedButton().getText();
                //     var selStep = that.getView().byId("idarrowTitle").getText(),
                //         step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                //     var temp = "",
                //         tempDesc = "";
                //     if (selRadio === "Create") {
                //         that.byId("snapDesc").setVisible(true);
                //         that.TempParams[index].SnapShot = "C";
                //         that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();
                //         temp = "C";
                //         tempDesc = that.byId("idSnapDesc").getValue();
                //     } else {
                //         that.byId("snapDesc").setVisible(false);
                //         that.TempParams[index].SnapShot = "U";
                //         that.TempParams[index].SnapShot_Desc = "";
                //         temp = "U";
                //         tempDesc = "";
                //     }
                //     that.ChnageData(temp, selStep, "SnapShot");
                //     that.ChnageData(tempDesc, selStep, "SnapShot_Desc");
                // } else {
                var selRadio = that._oCore.byId("idSnapRadio").getSelectedButton().getText();
                if (selRadio === "Create") {
                    that._oCore.byId("snapDescU").setVisible(true);
                } else {
                    that._oCore.byId("snapDescU").setVisible(false);
                }
                // }
            },

            onDescChange: function () {
                // var flag = that.oGModel.getProperty("/CommonParam");
                // if (flag === "") {

                //     if (that.tempIndex === "") {
                //         var selStep = that.getView().byId("idarrowTitle").getText(),
                //             step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);

                //         that.tempIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);
                //     }
                //     that.TempParams[that.tempIndex].SnapShot_Desc = that.byId("idSnapDesc").getValue();

                //     that.ChnageData(that.byId("idSnapDesc").getValue(), selStep, "SnapShot_Desc");
                // }
                var text = that.byId("idSnapDescU").getValue();
                if (text.length >= 59) {
                    MessageToast("Text limit is 60 Characters")
                }

            },
            onWeekValues: function () {
                var value = that.byId("idWeeksU").getValue();

                if (value < 0) {
                    that.byId("idWeeksU").setValue('');
                    // MessageToast.show("History weeks can not be lessthen 1");
                } else if (value > 156) {
                    MessageToast.show("History weeks can not be greaterthen 156");
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
                // if (flag === "") {
                //     if (sId.includes("Temp")) {
                //         that._templateDialog.open();
                //     }

                // } else {
                if (sId.includes("MFL")) {
                    this.MFlocModelUni = new JSONModel();
                    this.MFlocModelUni.setSizeLimit(that.MFLocDataUni.length);
                    that.MFlocModelUni.setData({
                        MFLocitemsUni: that.MFLocDataUni
                    });
                    sap.ui.getCore().byId("MFLSlctListJSSMul").setModel(that.MFlocModelUni);

                    this._valueHelpDialogMFLUni.open();

                    that.oMFLocUni = that.byId("MFLInputU");
                    that.oLocUni = that.byId("DlocInputU");
                    that.oProdUni = that.byId("PprodInputU");

                    var locTokens = that.oMFLocUni.getTokens();

                    // for (var i = 0; i < locTokens.length; i++) {

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
                    // }

                } else if (sId.includes("loc")) {

                    that.oMFLocUni = that.byId("MFLInputU");
                    that.oLocUni = that.byId("DlocInputU");
                    that.oProdUni = that.byId("PprodInputU");
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

                } else if (sId.includes("CprodInputU")) {

                    that.oMFLocUni = that.byId("MFLInputU");
                    that.oLocUni = that.byId("DlocInputU");
                    that.oProdUni = that.byId("PprodInputU");
                    that.oConfProdUni = that.byId("CprodInputU");

                    var Data = that.TotalDataUni;
                    sap.ui.getCore().byId("ConfProductSlctListJSS").setMultiSelect(true);
                    that.ConfProdDataUni = [];
                    that.ProdDataUniTemp = [];

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

                } else if (sId.includes("PprodInputU")) {

                    that.oMFLocUni = that.byId("MFLInputU");
                    that.oLocUni = that.byId("DlocInputU");
                    that.oConfProdUni = that.byId("CprodInputU");
                    that.oProdUni = that.byId("PprodInputU");

                    var Data = that.TotalDataUni;
                    sap.ui.getCore().byId("prodSlctListJSS").setMultiSelect(true);
                    that.ProdDataUni = [];
                    that.ProdDataUniTemp = [];

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
                        that.ProdDataUniTemp = [];
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
                    that.ProdDataUni.forEach(el => {
                        var index = that.ConfProdall.findIndex(e => e.PRODUCT_ID === el.PRODUCT_ID &&
                            e.CONFIGPROD_CHK !== "X");
                        if (index !== -1) {
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

                    that.oVerUni = that.byId("idverU");
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
                } else if (sId.includes("PrePFInput")) {
                    var profiles = that.PredictionData;
                    var profiles = profiles.filter(el => el.METHOD !== "AES");
                    that.ppfModel = new JSONModel();
                    that.ppfModel.setData({
                        results: profiles
                    });
                    that._valueHelpDialogPPF.setModel(that.ppfModel);

                    that._valueHelpDialogPPF.open();
                } else if (sId.includes("ForeAlgInput")) {
                    var profiles = that.PredictionData;
                    var data = profiles.filter(el => el.METHOD === "AES");
                    that.fapModel = new JSONModel();
                    that.fapModel.setData({
                        results: data
                    });
                    that._valueHelpDialogFAP.setModel(that.fapModel);

                    that._valueHelpDialogFAP.open();
                } else if (sId.includes("classInput")) {
                    that.oMFLocUni = that.byId("MFLInputU");
                    that.oLocUni = that.byId("DlocInputU");
                    that.oProdUni = that.byId("PprodInputU");
                    that.oClassList = that.byId("classInputU");

                    sap.ui.core.BusyIndicator.show();
                    // Calling service to get the Customer data
                    this.getModel("BModel").read("/getProdClass", {
                        urlParameters: {
                            "$skip": 0,
                            "$top": 30000
                        },
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

                            that.oClass = that.byId("classInputU");
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
                } else if (sId.includes("custGrpInput")) {
                    that.ocgUni = that.byId('custGrpInputU');
                    that._valueHelpDialogCustGroup.open();
                    var CGTokens = that.ocgUni.getTokens();
                     for (var i = 0; i < CGTokens.length; i++) {
                        for (var j = 0; j < that.custGroupValues.length; j++) {
                            if (that.custGroupValues[j].CUSTOMER_GROUP === CGTokens[i].getText()) {
                                sap.ui.getCore().byId("CustGroupSlctListJSS").getItems()[j].setSelected(true);
                                break;
                            }
                        }
                    }

                    
                } else if (sId.includes("Temp")) {
                    that._templateDialog.open();
                } else if (sId.includes("idMulVar")) {
                    that._valueHelpDialogVariant.open();
                }

                // }
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
                    if (flag === "") {
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
                } else if (sId.includes("variant")) {
                    that._oCore
                        .byId(this._valueHelpDialogVariant.getId() + "-searchField")
                        .setValue("");
                    if (that.oVariList.getBinding("items")) {
                        that.oVariList.getBinding("items").filter([]);
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

                    if (flag === "") {
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
                } else if (sId.includes("ConfProduct")) {
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
                                    new Filter("REF_PRODID", FilterOperator.Contains, sQuery),
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

                } else if (sId.includes("algoSlctList")) {
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
                    that.oFAPList.getBinding("items").filter(oFilters);

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

                } else if (sId.includes("variant")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("VARIANT_NAME", FilterOperator.Contains, sQuery),
                                    new Filter("VARIANT_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }

                    that.oVariList.getBinding("items").filter(oFilters);

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
                if (sId.includes("TempSlctList")) {
                    
                    if (sId.includes("TempSlctList")) {
                        that.oGModel.setProperty("/CommonParam", "X");
                        that.onActivityPress();
                        var aSelectedTemp = oEvent.getParameter("selectedItems");
                        that.byId("idTempValue").setValue(aSelectedTemp[0].getTitle());
                        that.byId("idJobname").setValue(aSelectedTemp[0].getDescription());
                        that.LEVEL = aSelectedTemp[0].getInfo();

                        if (that.LEVEL === "External" || that.LEVEL === "") {
                            that.LEVEL = "E";
                        } else if (that.LEVEL === "Internal") {
                            that.LEVEL = "I";
                        }

                        var Temp = that.TemplateDetail.filter(el => el.TEMPLATE_ID === aSelectedTemp[0].getTitle());
                        that.templevel = Temp[0].LEVEL;
                        that.LayerCode = Temp[0].LAYER_CODE;
                        that.templateName = Temp[0].TEMPLATE_ID;
                        that.templateDesc = Temp[0].TEMPLATE_DESC;

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
                            new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                            ],
                            and: true,
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

                        if(that.byId("idMulVar").getValue() == ""){
                        sap.ui.core.BusyIndicator.show();
                        that.getModel("JSModel").read("/readTemplateItemsParams", {
                             headers: {
                            "x-user-id": that.getUser(),
                             },
                            filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, aSelectedTemp[0].getTitle()),
                            new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                            ],
                            and: true,
                            success: function (oData) {
                                sap.ui.core.BusyIndicator.hide();
                                that.TempParams = [];
                                that.UniParamaters = oData.results;
                                for (var i = 0; i < oData.results.length; i++) {
                                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === oData.results[i].ACTIVITY_ID &&
                                        e.ACT_POSITION === oData.results[i].ACT_POSITION);
                                    // if (oData.results[i].ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS") {
                                    //     that.PublishFO = that.PublishFO + 1;
                                    // }

                                    if (oData.results[i].PARAMETER_ID === "LOCATION_ID" || oData.results[i].PARAMETER_ID === "PRODUCT_ID") {
                                        var temp = oData.results[i].VALUE;
                                        var aray = Array.isArray(temp);
                                        if (aray === false) {
                                            if (temp.includes(",") && temp !== "") {
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

                                // that.divideDatatoSend();

                                // if (that.PublishFO > 0) {
                                //     that.getUserData();
                                // }
                                // //   that.TempParams = oData.results;
                                if (that.byId("CreateWizard")._aStepPath.length === 3) {
                                    that.onValidation();
                                }

                                if (that.TempParams.length > 0) {
                                    that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                                    // if(that.TempParams[0].ACTIVITY_ID === "GENERATE_SEEDORDER"){
                                    //     var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                                    //     that.byId("FromDate").setMaxDate(tempDate);
                                    //     that.byId("ToDate").setMaxDate(tempDate);
                                    //     that.byId("FromDate").setMinDate(null);
                                    //     that.byId("ToDate").setMinDate(null);
                                    // } else if(that.TempParams[0].ACTIVITY_ID === "PURGE_PLANNING_DATA"){
                                    //     that.byId("FromDate").setMinDate(null);
                                    //     that.byId("ToDate").setMinDate(null);
                                    //     that.byId("FromDate").setMaxDate(null);
                                    //     that.byId("ToDate").setMaxDate(null);
                                    // } else {
                                    // that.byId("FromDate").setMaxDate(null);
                                    // that.byId("ToDate").setMaxDate(null);
                                    // that.byId("FromDate").setMinDate(new Date());
                                    // that.byId("ToDate").setMinDate(new Date());
                                    // }
                                }

                            },
                            error: function (error) {
                                sap.ui.core.BusyIndicator.hide();
                                MessageToast.show("Failed to get data");
                            },
                        });
                    } else {
                        that.onVariantSel();
                    }

                    }
                // } else {
                } else if (sId.includes("MFL")) {
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
                        that.byId("idverU").setValue(aSelectedScen[0].getTitle());
                    } else if (sId.includes("scen")) {
                        var aSelectedScen = oEvent.getParameter("selectedItems");
                        that.byId("idscenU").setValue(aSelectedScen[0].getTitle());
                    } else if (sId.includes("CustGroupSlctList")) {
                        // var aSelectedCustGroup = oEvent.getParameter("selectedItems");
                        // that.byId("custGrpInputU").setValue(aSelectedCustGroup[0].getTitle());

                    that.oCustGroup = that.byId("custGrpInputU");
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
                        
                    } else if (sId.includes("ppfSlctList")) {
                        var aSelectedPPF = oEvent.getParameter("selectedItems");
                        that.byId("PrePFInputU").setValue(aSelectedPPF[0].getTitle());

                    } else if (sId.includes("algoSlctList")) {
                        var aSelectedPPF = oEvent.getParameter("selectedItems");
                        that.byId("ForeAlgInputU").setValue(aSelectedPPF[0].getTitle());
                    }  else if (sId.includes("variantSlctListJSS")) {
                        var aSelectedVar = oEvent.getParameter("selectedItems");
                        that.byId("idMulVar").setValue(aSelectedVar[0].getCells()[0].getTitle());
                        that.onVariantSel();
                    }
 
                // }
                that.handleClose(oEvent);

            },

             onVariantSel:function(){
                var selected = that.byId("idMulVar").getValue();
                 sap.ui.core.BusyIndicator.show();
                // Calling service to get the Variant data
                this.getModel("JSModel").read("/getVariantDetails", {
                    filters: [new Filter("VARIANT_NAME", FilterOperator.EQ, selected)],
                     headers: {
                 "x-user-id": that.getUser(),
                 },
                    success: function (oData) {
                         sap.ui.core.BusyIndicator.hide();
                                that.TempParams = [];
                                that.UniParamaters = oData.results;
                                for (var i = 0; i < oData.results.length; i++) {
                                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === oData.results[i].ACTIVITY_ID &&
                                        e.ACT_POSITION === oData.results[i].ACT_POSITION);
                                    if (oData.results[i].PARAMETER_ID === "LOCATION_ID" || oData.results[i].PARAMETER_ID === "PRODUCT_ID") {
                                        var temp = oData.results[i].VALUE;
                                    var aray = Array.isArray(temp);
                                        if (aray === false) {
                                            if (temp.includes(",") && temp !== "") {
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
                                if (that.byId("CreateWizard")._aStepPath.length === 3) {
                                    that.onValidation();
                                }

                                if (that.TempParams.length > 0) {
                                    that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                                }

                 },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });

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
                    setTimeout(() => {
                        that.byId("scheduleStep").mAggregations._nextButton.setText("Parameters");
                    }, 0);

                    this.byId("CreateWizard").validateStep(this.byId("TempTypeStep"));
                    that.byId("TempTypeStep").setValidated(true);

                    that.byId("FormToolbar").setVisible(true);
                    that.byId("idJobname").setValueState("None");
                    // that.byId("idarrow").setVisible(true);
                    // that.byId("idParameter").setVisible(true);
                    // that.byId("idcreateJob").setVisible(true);
                    // that.byId("idUniversal").setVisible(true);
                } else {
                    this.byId("CreateWizard").invalidateStep(this.byId("scheduleStep"));
                    that.byId("scheduleStep").setValidated(false);

                    this.byId("CreateWizard").invalidateStep(this.byId("TempTypeStep"));
                    that.byId("TempTypeStep").setValidated(false);

                    that.byId("FormToolbar").setVisible(false);
                    that.byId("idJobname").setValueState("Error");
                    that.byId("idJobname").setValueStateText("Special characters are not allowed");

                    // that.byId("idarrow").setVisible(false);
                    // that.byId("idParameter").setVisible(false);
                    // that.byId("idcreateJob").setVisible(false);
                    // that.byId("idUniversal").setVisible(false);
                }

            },

            handleDateChange: function (oEvent) {
                // var flag = that.oGModel.getProperty("/CommonParam");
                var selDate = oEvent.getParameters().id;

                var fromDate = that.byId("FromDateU").getValue();
                var toDate = that.byId("ToDateU").getValue();
                if (selDate.includes("FromDateU")) {
                    that.byId("ToDateU").setEditable(true);
                    that.byId("ToDateU").setMinDate(new Date(fromDate));
                }

            },

            onOperatorChange: function (oEvent) {
                // var flag = that.oGModel.getProperty("/CommonParam");

                var selOpr = that._oCore.byId("idOperatorU").getSelectedKey();
                that._oCore.byId("singleDtU").setValue();
                if (selOpr === "BT") {
                    that._oCore.byId("SINGLE_DATEU").setVisible(false);
                } else {
                    that._oCore.byId("SINGLE_DATEU").setVisible(true);
                }

            },

            onRolling: function () {

                var sel = that.byId("idRollingU").getSelected();
                if (sel) {
                    that.byId("idRollingWeeksU").setValue();
                    that.byId("idRollingWeeksU").setVisible(true);

                    that.byId("FromDateU").setEditable(false);
                    that.byId("ToDateU").setEditable(false);

                } else {
                    that.byId("idRollingWeeksU").setValue();
                    that.byId("idRollingWeeksU").setVisible(false);
                    that.byId("FromDateU").setEditable(true);
                    that.byId("ToDateU").setEditable(true);
                }
            },

            onRollWeekchange: function (oEvent) {

                var week = parseInt(that.byId("idRollingWeeksU").getValue());

                var newDate = new Date(new Date().getTime() + week * 7 * 24 * 60 * 60 * 1000);
                var fromDate = new Date().toISOString().split("T")[0];
                var toDate = "";
                if (!isNaN(newDate)) {
                    toDate = newDate.toISOString().split("T")[0];
                }
                if (week > 0) {
                    that.byId("FromDateU").setValue(fromDate);
                    that.byId("ToDateU").setValue(toDate);

                } else {
                    MessageToast.show("Please maintain valid weeks");
                    that.byId("FromDateU").setValue();
                    that.byId("ToDateU").setValue();

                }

            },

            onOptimise:function(oEvent){
                var selected = oEvent.getParameters().selected;

                if(selected){
                    that.byId("PidOptProfileU").setEnabled(true);
                } else {
                    that.byId("PidOptProfileU").setEnabled(false);
                }

                that.byId("PidOptProfileU").setSelectedKey(that.byId("PidOptProfileU").getItems()[0]);

            },

            createJob: function (sequenceID) {
                // // var actionText = "/jobs/jobCreation";//changed from jobCreation
                // var actionText = "/jobs/ParalleljobCreation";//changed from jobCreation
                //If any of location,Product has create access, Only then allow creation
                if(that.oLocData == 0){
                    return sap.m.MessageToast.show("User not authorized to Create Jobs");
                }
                var uniFlag = that.oGModel.getProperty("/CommonParam");
                if (uniFlag === "") {
                    // To trigger normal jobs
                    var actionText = "/jobs/ParalleljobCreation"; //changed from jobCreation
                } else if (uniFlag === "X") {
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
                    dsSDate = new Date(new Date().setSeconds(new Date().getSeconds() + 15));
                    // dsSDate = new Date(new Date().setMinutes(new Date().getMinutes() + 1));
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
                        if (year !== "") {
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
                        that.week = week;
                        // Hour 
                        if (hour === "") {
                            hour = "*";
                        } else {
                            // hour = "*%2F" + hour;
                            // hour = "*/" + hour;
                            hour = hour;
                        }
                        var hourConversion = "";
                        if ((hour !== "*" && !hour.includes("*/")) || week !== "*") {
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

                        if (mnth !== "*" || date !== "*" || hour !== "*") {
                            if (min === "*") {
                                min = "0";
                            }
                        }
                        var MinChange = "";
                        if (mnth === "*" && date === "*" && week === "*" && hour === "*" && !min.includes("*/")) {
                            MinChange = "X";
                        }
                        that.min = min;

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

                    if (hourConversion === "X") {
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
                            } else {
                                originalDate.setTime(originalDate.getTime() - (that.zHours + that.zMin));
                            }

                            var selWeek = originalDate.getDay();
                            var week = "*";
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
                            that.week = week;
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

                        if (fullWeek !== "*") {
                            var nextTuesday = getNextWeekdayByName(fullWeek);
                        } else {
                            if (hour !== "*" && !hour.includes("*/")) {

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

                                var opr = (targetTimeZone.split("UTC")[1]).slice(0, 1);
                                var hours = ((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[0];
                                var min = ((targetTimeZone.split("UTC")[1]).slice(1)).split(":")[1];
                                var mHours = hours * 60 * 60 * 1000;
                                var mMins = min * 60 * 1000;

                                if (opr == "-") {
                                    originalDate.setTime(originalDate.getTime() - (mHours + mMins));
                                } else {
                                    originalDate.setTime(originalDate.getTime() + (mHours + mMins));
                                }

                                var convertedDate = originalDate.toLocaleString('en-US', {
                                    dateStyle: "medium",
                                    timeStyle: "medium",
                                    hour12: false
                                });

                                convertedDate = new Date(convertedDate);

                                that.hour = convertedDate.getHours();
                                that.min = convertedDate.getMinutes();
                            }
                        }
                        // Formating the recurring data
                        Cron = year + " " + mnth + " " + date + " " + that.week + " " + that.hour + " " + that.min + " " + "0";
                    }

                    if (MinChange === "X") {
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
                        } else {
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

                that.finalList = finalList;
                var jobid = "1";

                that.saveJobDetails(jobid, that.SaveTemplateDetails);

                // sap.ui.core.BusyIndicator.show();
                // that.getOwnerComponent().getModel("JModel").callFunction("/addJobCreation", {
                //     method: "GET",
                //     urlParameters: {
                //         jobDetails: JSON.stringify(finalList)
                //     },
                //     success: function (oData) {
                //         sap.ui.core.BusyIndicator.hide();
                //         // sap.m.MessageToast.show(oData.addJobCreation.jobId + ": Job Created");
                //         that.jobCreated = oData.addJobCreation.jobId;
                //         // that.testClick2(oData.addJobCreation.sequenceId)
                //         that.saveJobDetails(oData.addJobCreation.jobId, that.SaveTemplateDetails);
                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide();
                //         sap.m.MessageToast.show("Error While publishing data!");
                //     },
                // });

            },

            saveJobDetails: function (Jobid, jobData) {
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
                    `${startDate.getFullYear()}-${padL(startDate.getMonth() + 1)}-${padL(startDate.getDate())} ${padL(startDate.getHours())}:${padL(startDate.getMinutes())}:${padL(startDate.getSeconds())}`
                var JEndDate =
                    `${EndDate.getFullYear()}-${padL(EndDate.getMonth() + 1)}-${padL(EndDate.getDate())} ${padL(EndDate.getHours())}:${padL(EndDate.getMinutes())}:${padL(EndDate.getSeconds())}`
                var SStartDate =
                    `${StartDate1.getFullYear()}-${padL(StartDate1.getMonth() + 1)}-${padL(StartDate1.getDate())} ${padL(StartDate1.getHours())}:${padL(StartDate1.getMinutes())}:${padL(StartDate1.getSeconds())}`
                var SEndDate =
                    `${sEndDate1.getFullYear()}-${padL(sEndDate1.getMonth() + 1)}-${padL(sEndDate1.getDate())} ${padL(sEndDate1.getHours())}:${padL(sEndDate1.getMinutes())}:${padL(sEndDate1.getSeconds())}`

                if (oJobschType === "onetime") {
                    var Rec_value = new Date(that.RECURRENCE_VALUE);
                    var sRec_value =
                        `${Rec_value.getFullYear()}-${padL(Rec_value.getMonth() + 1)}-${padL(Rec_value.getDate())} ${padL(Rec_value.getHours())}:${padL(Rec_value.getMinutes())}:${padL(Rec_value.getSeconds())}`

                    that.RECURRENCE_VALUE = sRec_value;
                }

                // if(that.Edit === "X"){
                //     var seq = that.JobData[0].SEQUENCE_ID;
                // } else {
                //     var seq = that.sSequence
                // }
                var totSteps = aData.length;

                aData.forEach(function (row) {
                    if (that.Edit === "X") {
                        if (that.JobData.length > 0) {
                            var jobdata = that.JobData.filter(function (aComp) {
                                return aComp.JOB_ID === JobId && aComp.ACTIVITY_ID === row.ACTIVITY_ID && aComp.ACT_POSITION === row.ACT_POSITION;
                            });
                            row.SUBJOB_ID = jobdata[0].SUBJOB_ID;
                            row.SCHEDULE_ID = jobdata[0].SCHEDULE_ID;
                        }
                        // else {
                        //     row.SUBJOB_ID = null;
                        //     row.SCHEDULE_ID = "";
                        // }
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
                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").callFunction("/genJobDetails", {
                    method: "GET",
                    urlParameters: {
                        Flag: that.Edit,
                        JobDATA: JSON.stringify(aData)
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        if (that.Edit === "X") {
                            // sap.m.MessageToast.show("Schedule updated");
                            that.updateSchedule();
                        } else {
                        // var flag = "X";
                        
                        // sap.m.MessageToast.show(that.jobCreated + ": Job Created");
                        // that.onBack("", flag);
                        sap.ui.core.BusyIndicator.show();
                that.getOwnerComponent().getModel("JModel").callFunction("/addJobCreation", {
                    method: "GET",
                    urlParameters: {
                        jobDetails: JSON.stringify(that.finalList)
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        // // sap.m.MessageToast.show(oData.addJobCreation.jobId + ": Job Created");
                        that.jobCreated = oData.addJobCreation.jobId;
                        // // that.testClick2(oData.addJobCreation.sequenceId)
                        // that.saveJobDetails(oData.addJobCreation.jobId, that.SaveTemplateDetails);
                        var seq = [{SEQUENCE_ID : that.sSequence,
                                    JOB_ID : that.jobCreated
                        }]

                        that.getModel("JSModel").callFunction("/genJobDetails", {
                            method: "GET",
                            urlParameters: {
                                Flag: "U",
                                JobDATA: JSON.stringify(seq)
                            },
                            success: function (oData) {
                                sap.ui.core.BusyIndicator.hide();
                                // if(oData.genJobDetails === "Job Updated Successfully"){
                                    var flag = "X";                                
                                    sap.m.MessageToast.show(that.jobCreated + ": Job Created");
                                    that.onBack("", flag);
                                // }

                            },
                            error: function (error) {
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("Error While publishing data!");
                            },
                        });
                         
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error While publishing data!");
                    },
                });
                        }
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
                        SEQUENCE_ID: JSON.stringify(that.sSequence),
                        JOB_ID: that.JobData[0].JOB_ID
                    },
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Schedule updated");
                        var flag = "X";
                        that.onBack("", flag);
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


            // Enabling the parameters for the selected Template
            onCommonParams: function () {

                var template = that.byId("idTempValue").getValue(),
                    jobName = that.byId("idJobname").getValue();

                if (template !== "" && jobName !== "") {

                    // Inputs Visible
                    that.byId("MF_LOCATIONU").setVisible(false);
                    that.byId("DM_LOCATIONU").setVisible(false);
                    that.byId("CONFIG_PRODUCTU").setVisible(false);
                    that.byId("PARTIAL_PRODUCTU").setVisible(false);
                    that.byId("MODEL_VERSIONU").setVisible(false);
                    that.byId("PREDICTION_PROFILEU").setVisible(false);
                    that.byId("FORECAST_ALGORITHMU").setVisible(false);
                    that.byId("VERSIONU").setVisible(false);
                    that.byId("SCENARIOU").setVisible(false);
                    that.byId("CLASSU").setVisible(false);
                    that.byId("CUSTOMER_GROUPU").setVisible(false);
                    that.byId("GEN_TYPEU").setVisible(false);
                    that.byId("DATE_RANGEU").setVisible(false);
                    that.byId("SINGLE_DATEU").setVisible(false);
                    that.byId("OPERATORU").setVisible(false);
                    that.byId("idRollingWeeksU").setVisible(false);
                    that.byId("Rolling_TimestampU").setVisible(false);
                    // that.byId("OVERRIDE_ASSIGNMENTU").setVisible(false);
                    that.byId("CRITICAL_ASSEMBLYU").setVisible(false);
                    that.byId("IMPACT_ANALYSISU").setVisible(false);
                    that.byId("DAILYU").setVisible(false);
                    that.byId("FULL_RUNU").setVisible(false);                    
                    that.byId("OptimizationU").setVisible(false);
                    that.byId("POptProfileU").setVisible(false);
                    that.byId("OptProfileU").setVisible(false);
                    // that.byId("OptAlgorithmU").setVisible(false);
                    // that.byId("OptFactorU").setVisible(false);
                    // that.byId("DsAlgorithmU").setVisible(false);
                    that.byId("SnapShotU").setVisible(false);
                    that.byId("SnapRU").setVisible(false);
                    that.byId("snapDescU").setVisible(false);
                    that.byId("HISTORY_WEEKSU").setVisible(false);

                    that.byId("MFLInputU").setValue();
                    that.byId("DlocInputU").setValue();
                    that.byId("CprodInputU").setValue();
                    that.byId("PprodInputU").setValue();
                    // that.byId("MODEL_VERSION").setValue();
                    that.byId("PrePFInputU").setValue();
                    that.byId("ForeAlgInputU").setValue();
                    that.byId("idverU").setValue();
                    that.byId("idscenU").setValue();
                    that.byId("classInputU").setValue();
                    // that.byId("custGrpInputU").setValue();
                    that.byId("FromDateU").setValue();
                    that.byId("ToDateU").setValue();
                    that.byId("singleDtU").setValue();
                    that.byId("idRollingWeeksU").setValue();
                    that.byId("idSnapDescU").setValue();
                    that.byId("idWeeksU").setValue();
                    // that.byId("idOverrideU").setSelected(false);
                    that.byId("idCriticalU").setSelected(false);
                    that.byId("idImpactU").setSelected(false);
                    that.byId("idDailyU").setSelected(false);
                    that.byId("idFullrunU").setSelected(false);
                    that.byId("idSnapShotU").setSelected(false);
                    that.byId("idRollingU").setSelected(false);
                    that.byId("PidOptimizationU").setSelected(false);

                    that.byId("CprodInputU").removeAllTokens();
                    that.byId("DlocInputU").removeAllTokens();
                    that.byId("PprodInputU").removeAllTokens();
                    that.byId("MFLInputU").removeAllTokens();
                    that.byId("custGrpInputU").removeAllTokens();

                    //   that.byId("MF_LOCATIONU").addStyleClass("addBorder");

                    //  var params = that.UniParamaters;
                    var params = [];
                    that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                    var tempData = that.TempParams;
                    that.actModel = new JSONModel();
                    // that.actModel.setData({
                    //     Activityresults: that.TempParams
                    // });
                    that.actModel.setData({
                        Activityresults: that.TemplateItems
                    });
                    that.byId("idActivityData").setModel(that.actModel);

                    that.ValidUserFlag = "";
                    var tempUser = that.TemplateItems.filter(el=> el.ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS");
                    if(tempUser.length > 0){
                        that.getUserData();
                    }
                    var aData = that.ActivityItems;
                    var temp = [];
                    for (var t = 0; t <  that.TemplateItems.length; t++) {

                        temp = aData.filter(function (aComp) {
                            return aComp.ACTIVITY_ID ===  that.TemplateItems[t].ACTIVITY_ID;
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
                        if (el.PARAMETER_ID !== "" && el.PARAMETER_ID !== " " && el.PARAMETER_ID !== undefined && el.PARAMETER_ID !== null && el.PARAMETER_ID !==
                            "actlevelU") {
                            var id = el.PARAMETER_ID + "U";

                            if(id !== "OptFactorU" && id !== "DsAlgorithmU" && id !== "OptAlgorithmU" && id !== "CUSTOMER_GROUPU"){

                            that.byId(id).setVisible(true);
                            }

                        }
                    });

                    var tempdata = that.Parameters.filter(el => el.PARAMETER_ID === "CONFIG_PRODUCT" || el.PARAMETER_ID === "PARTIAL_PRODUCT");
                    if (tempdata.length > 0) {
                        that.byId("PARTIAL_PRODUCTU").setVisible(true);
                        that.byId("CONFIG_PRODUCTU").setVisible(true);
                    }

                    // var tempdata = that.Parameters.filter(el => el.PARAMETER_ID === "MF_LOCATION" || el.PARAMETER_ID === "DM_LOCATION");
                    // if (tempdata.length > 0) {
                    //     that.byId("MF_LOCATIONU").setVisible(true);
                    //     that.byId("DM_LOCATIONU").setVisible(true);
                    // }

                    if (that.byId("DATE_RANGEU").getVisible()) {
                        var newDate = new Date(new Date().getTime() + 104 * 7 * 24 * 60 * 60 * 1000);
                        var fromDate = new Date().toISOString().split("T")[0];
                        var toDate = newDate.toISOString().split("T")[0];

                        that.byId("FromDateU").setValue(fromDate);
                        that.byId("ToDateU").setValue(toDate);

                    }

                    if (that.byId("VERSIONU").getVisible()) {
                        for (var i = 0; i < that.DefaultVersce.length; i++) {
                            if (that.DefaultVersce[i].PARAMETER_ID === 20) {
                                that.byId("idverU").setValue(that.DefaultVersce[i].VALUE);
                            } else {
                                that.byId("idscenU").setValue(that.DefaultVersce[i].VALUE);
                            }
                        }

                    }
                    // that.byId("CONFIG_PRODUCTU").setVisible(false);
                    that.oGModel.setProperty("/CommonParam", "X");
                    if (that.Edit === "") {
                        that.setObjData();
                    }
                    // this._CommonParamsDialog.open();

                } else {
                    sap.m.MessageToast.show("Please maintain Template and Job Name");
                    that.oGModel.setProperty("/CommonParam", "");
                }

            },
            setObjData: function () {
                
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
                    FULL_RUN : "",
                    OVERRIDE_ASSIGNMENT: "",
                    GEN_TYPE: "",
                    MODEL_VERSION: "",
                    FROM_DATE: "",
                    TO_DATE: "",
                    OPERATOR: "",
                    SINGLE_DATE: "",
                    Rolling: "",
                    Rolling_Timestamp: "",
                    Optimizations: "",
                    POptProfile: "",
                    OptProfile:"",
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

                            if (x[0] === "MF_LOCATION_ID" || x[0] === "LOCATION_ID" || x[0] === "PRODUCT_ID" || x[0] === "CONFIG_PRODUCT") {

                                if (x[1].length > 0 || x[1] !== "") {
                                    if (x[0] === "MF_LOCATION_ID") {
                                        x[1] = x[1].includes(",") === true ? x[1].split(",") : x[1];
                                    }
                                    if (x[0] === "LOCATION_ID") {
                                        x[1] = x[1].includes(",") === true ? x[1].split(",") : x[1];
                                    }
                                    if (x[0] === "CONFIG_PRODUCT") {
                                        x[1] = x[1].includes(",") === true ? x[1].split(",") : x[1];
                                    }
                                    if (x[0] === "PRODUCT_ID") {
                                        x[1] = x[1].includes(",") === true ? x[1].split(",") : x[1];
                                    }
                                    obj[test] = obj[test].concat(x[1]);
                                }
                            } else {
                                obj[test] = x[1];
                            }

                        }
                    })
                }


                obj.MF_LOCATION_ID = [...new Set(obj.MF_LOCATION_ID.filter(item => item !== ""))];
                obj.LOCATION_ID = [...new Set(obj.LOCATION_ID.filter(item => item !== ""))];
                // obj.REF_PRODID = [...new Set(obj.REF_PRODID)];
                obj.PRODUCT_ID = [...new Set(obj.PRODUCT_ID.filter(item => item !== ""))];
                var data = [];
                obj.PARTIAL_PRODUCT = obj.PRODUCT_ID;

                obj.PRODUCT_ID.forEach(function (el) {
                    var data = that.ConfProdall.filter(e => e.PRODUCT_ID === el);
                    if(data.length>0){
                    obj.CONFIG_PRODUCT.push(data[0].REF_PRODID);
                    }
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

                if (that.byId("DATE_RANGEU").getVisible()) {
                    var newDate = new Date(new Date().getTime() + 104 * 7 * 24 * 60 * 60 * 1000);
                    var fromDate = new Date().toISOString().split("T")[0];
                    var toDate = newDate.toISOString().split("T")[0];

                    that.byId("FromDateU").setValue(fromDate);
                    that.byId("ToDateU").setValue(toDate);
                    that.byId("FromDateU").setMinDate(new Date());
                    that.byId("ToDateU").setMinDate(new Date(fromDate));

                }

            },

            onHandleClose: function () {
                that.oGModel.setProperty("/CommonParam", "");
                // that._CommonParamsDialog.close();
                if (that.Edit === "X") {
                    that.onBack();
                }
            },

            // Highlighting the inputs on selection of step.
            onActivityPress: function (oEvent) {
                var params = [];
                if (oEvent) {
                    var selected = that.byId("idActivityData").getSelectedItems()[0].getCells()[0].getText().split(".")[1].trim();
                    params = that.params.filter(el => el.ACTIVITY_ID === selected);
                }

                that.byId("MF_LOCATIONU").getLabelControl().removeStyleClass("addBorder");
                that.byId("DM_LOCATIONU").getLabelControl().removeStyleClass("addBorder");
                that.byId("CONFIG_PRODUCTU").getLabelControl().removeStyleClass("addBorder");
                that.byId("PARTIAL_PRODUCTU").getLabelControl().removeStyleClass("addBorder");
                that.byId("MODEL_VERSIONU").getLabelControl().removeStyleClass("addBorder");
                that.byId("PREDICTION_PROFILEU").getLabelControl().removeStyleClass("addBorder");
                that.byId("FORECAST_ALGORITHMU").getLabelControl().removeStyleClass("addBorder");
                that.byId("VERSIONU").getLabelControl().removeStyleClass("addBorder");
                that.byId("SCENARIOU").getLabelControl().removeStyleClass("addBorder");
                that.byId("CLASSU").getLabelControl().removeStyleClass("addBorder");
                that.byId("CUSTOMER_GROUPU").getLabelControl().removeStyleClass("addBorder");
                that.byId("GEN_TYPEU").getLabelControl().removeStyleClass("addBorder");
                that.byId("DATE_RANGEU").getLabelControl().removeStyleClass("addBorder");
                that.byId("SINGLE_DATEU").getLabelControl().removeStyleClass("addBorder");
                that.byId("OPERATORU").getLabelControl().removeStyleClass("addBorder");
                //   that.byId("idRollingWeeksU").getLabelControl().removeStyleClass("addBorder");
                that.byId("Rolling_TimestampU").getLabelControl().removeStyleClass("addBorder");
                // that.byId("OVERRIDE_ASSIGNMENTU").getLabelControl().removeStyleClass("addBorder");
                that.byId("CRITICAL_ASSEMBLYU").getLabelControl().removeStyleClass("addBorder");
                that.byId("IMPACT_ANALYSISU").getLabelControl().removeStyleClass("addBorder");
                that.byId("DAILYU").getLabelControl().removeStyleClass("addBorder");
                that.byId("FULL_RUNU").getLabelControl().removeStyleClass("addBorder");
                that.byId("OptimizationU").getLabelControl().removeStyleClass("addBorder");
                that.byId("POptProfileU").getLabelControl().removeStyleClass("addBorder");
                that.byId("OptProfileU").getLabelControl().removeStyleClass("addBorder");
                // that.byId("OptAlgorithmU").getLabelControl().removeStyleClass("addBorder");
                // that.byId("OptFactorU").getLabelControl().removeStyleClass("addBorder");
                // that.byId("DsAlgorithmU").getLabelControl().removeStyleClass("addBorder");
                that.byId("SnapShotU").getLabelControl().removeStyleClass("addBorder");
                that.byId("SnapRU").getLabelControl().removeStyleClass("addBorder");
                that.byId("snapDescU").getLabelControl().removeStyleClass("addBorder");
                that.byId("HISTORY_WEEKSU").getLabelControl().removeStyleClass("addBorder");

                for (var i = 0; i < params.length; i++) {

                    switch (params[i].PARAMETER_ID) {
                        case "MF_LOCATION":
                            that.byId("MF_LOCATIONU").getLabelControl().addStyleClass("addBorder");
                            that.byId("DM_LOCATIONU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "DM_LOCATION":
                            that.byId("DM_LOCATIONU").getLabelControl().addStyleClass("addBorder");
                            that.byId("MF_LOCATIONU").getLabelControl().addStyleClass("addBorder");

                            break;
                        case "CONFIG_PRODUCT":
                        case "PARTIAL_PRODUCT":
                            that.byId("CONFIG_PRODUCTU").getLabelControl().addStyleClass("addBorder");
                            that.byId("PARTIAL_PRODUCTU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "MODEL_VERSION":
                            that.byId("MODEL_VERSIONU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "PREDICTION_PROFILE":
                            that.byId("PREDICTION_PROFILEU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "FORECAST_ALGORITHM":
                            that.byId("FORECAST_ALGORITHMU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "VERSION":
                            that.byId("VERSIONU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "SCENARIO":
                            that.byId("SCENARIOU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "CLASS":
                            that.byId("CLASSU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "CUSTOMER_GROUP":
                            that.byId("CUSTOMER_GROUPU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "GEN_TYPE":
                            that.byId("GEN_TYPEU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "DATE_RANGE":
                            that.byId("DATE_RANGEU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "OPERATOR":
                            that.byId("OPERATORU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "Rolling_Timestamp":
                            that.byId("Rolling_TimestampU").getLabelControl().addStyleClass("addBorder");
                            break;
                        // case "OVERRIDE_ASSIGNMENT":
                        //     that.byId("OVERRIDE_ASSIGNMENTU").getLabelControl().addStyleClass("addBorder");
                        //     break;
                        case "CRITICAL_ASSEMBLY":
                            that.byId("CRITICAL_ASSEMBLYU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "IMPACT_ANALYSIS":
                            that.byId("IMPACT_ANALYSISU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "DAILY":
                            that.byId("DAILYU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "FULL_RUN":
                            that.byId("FULL_RUNU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "Optimization":
                            that.byId("OptimizationU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "POptProfile":
                            that.byId("POptProfileU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "OptProfile":
                            that.byId("OptProfileU").getLabelControl().addStyleClass("addBorder");
                            break;
                        // case "OptAlgorithm":
                        //     that.byId("OptAlgorithmU").getLabelControl().addStyleClass("addBorder");
                        //     break;
                        // case "OptFactor":
                        //     that.byId("OptFactorU").getLabelControl().addStyleClass("addBorder");
                        //     break;
                        // case "DsAlgorithm":
                        //     that.byId("DsAlgorithmU").getLabelControl().addStyleClass("addBorder");
                        //     break;
                        case "SnapShot":
                            that.byId("SnapShotU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "SnapR":
                            that.byId("SnapRU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "snapDesc":
                            that.byId("snapDescU").getLabelControl().addStyleClass("addBorder");
                            break;
                        case "HISTORY_WEEKS":
                            that.byId("HISTORY_WEEKSU").getLabelControl().addStyleClass("addBorder");
                            break;
                    }
                }

            },

            // Generating the steps based on parameters selectuion
            generateJobData: function (oEvent) {

                var aDataCheck = [];
                var predPr = that.byId("PREDICTION_PROFILEU").getVisible(),
                    foralgo = that.byId("FORECAST_ALGORITHMU").getVisible(),
                    ver = that.byId("VERSIONU").getVisible(),
                    sce = that.byId("SCENARIOU").getVisible();
                // var hWeeks = that.byId("HISTORY_WEEKSU").getVisible();
                that.saveData = oEvent.getParameter("id");
                var paramFlag = "";
                // if (predPr === true && that.byId("PrePFInputU").getValue() === "") {
                //     paramFlag = "X";
                // }
                // if (foralgo === true && that.byId("ForeAlgInputU").getValue() === "") {
                //     paramFlag = "X";
                // }
                if (ver === true && that.byId("idverU").getValue() === "") {
                    paramFlag = "X";
                }
                if (sce === true && that.byId("idscenU").getValue() === "") {
                    paramFlag = "X";
                }
                // if (hWeeks === true) {

                //     var value = that.byId("idWeeksU").getValue();

                //     if (value <= 0) {
                //         paramFlag = "X";
                //     } else if (value > 156) {
                //         paramFlag = "X";
                //     }
                // }
                if (paramFlag === "") {
                    // var tempData = that.TempParams;
                    var tempData = that.TemplateItems;

                    var aData = that.ActivityItems;
                    var temp = [];
                    var temp = [];
                    var s4string = "";
                    var string = "";
                    var array = [];
                    for (var t = 0; t < tempData.length; t++) {
                        var act = tempData[t].ACTIVITY_ID;
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
                            if (act === "IMPORT_VERSION_SCENARIO" || act === "PURGE_ALERTS_DATA" || act === 'SNAPSHOT_LAG' || act === "GENERATE_TELESCOPIC_PERIODS") {
                                // string = act;
                                array.push(string);
                                string = "";
                            } else if (act === "EXPORT_IBP_CLASS" || act === "EXPORT_IBP_CUSTOMERGROUP" ||
                                act === "EXPORT_IBP_LOCATION" || act === "EXPORT_IBP_PRODUCT" || act === "EXPORT_IBP_LOCATION_PRODUCT") {
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
                                    next === "EXPORT_IBP_LOCATION" || next === "EXPORT_IBP_PRODUCT" || next === "EXPORT_IBP_LOCATION_PRODUCT") {
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
                                next === "EXPORT_IBP_LOCATION" || next === "EXPORT_IBP_PRODUCT" || next === "EXPORT_IBP_LOCATION_PRODUCT" || 
                                act === "EXPORT_IBP_CLASS" || act === "EXPORT_IBP_CUSTOMERGROUP" ||
                                act === "EXPORT_IBP_LOCATION" || act === "EXPORT_IBP_PRODUCT" || act === "EXPORT_IBP_LOCATION_PRODUCT") {
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
                                        
                       
                       var isVisible = that.byId("DM_LOCATIONU").getVisible();
                       var hasTokens = core.byId("DlocInputU").getTokens().length > 0;
                       var isVisibleP = that.byId("CONFIG_PRODUCTU").getVisible();
                       var hasTokensP = core.byId("CprodInputU").getTokens().length > 0;
                       var isVisiblePa = that.byId("PARTIAL_PRODUCTU").getVisible();
                       var hasTokensPa = core.byId("PprodInputU").getTokens().length > 0;
                       
                       var ManuFlag = core.byId("MFLInputU").getTokens().length > 0 ? "": "X";
                       var DemandFlag = isVisible ? "" : hasTokens ? "X" : "";
                       var ConProdFlag = (isVisibleP && hasTokensP) ? "" : "X";
                       var ParProdFlag = (isVisiblePa && hasTokensPa) ? "" : "X";
                    

                    // Manufacturing Locations
                    if (that.byId("MF_LOCATIONU").getVisible() === true) {
                        if (core.byId("MFLInputU").getTokens().length > 0) {
                            var maloc = core.byId("MFLInputU").getTokens();
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
                    if (that.byId("DM_LOCATIONU").getVisible() === true) {
                        if (core.byId("DlocInputU").getTokens().length > 0) {
                            var deLoc = core.byId("DlocInputU").getTokens();
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
                    if (that.byId("CONFIG_PRODUCTU").getVisible() === true) {
                        if (core.byId("CprodInputU").getTokens().length > 0) {
                            var pro = core.byId("CprodInputU").getTokens();
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

// commented when added DemandFlag to remove the demand locations which are not selected for Products

                            // for (var i = 0; i < pro.length; i++) {
                            //     var d = that.TotalDataUni.filter(el=> el.REF_PRODID === pro[i].getText() && el.REF_PRODID === el.PRODUCT_ID);

                            //     tempDataCP = tempDataCP.concat(d);
                                
                            // }

                            // for (var i = 0; i < tempDataCP.length; i++) {
                            //     var obj = {
                            //         DEMAND_LOC: tempDataCP[i].DEMAND_LOC,
                            //         REF_PRODID: tempDataCP[i].REF_PRODID
                            //     };
                            //     ConfProd.push(obj);
                            // }
                    
                            if (that.byId("DM_LOCATIONU").getVisible() === true) {
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

                                     function removeDuplicate(array, key) {
                                            var check = new Set();
                                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                                        }
                                    manuLocation = removeDuplicate(manuLocation, 'FACTORY_LOC');
                                }

                                if(demandLocation.length == 0){                                    
                                    manuLocation = [];
                                }
                            }
                        } else {

                            var prod = that.TotalDataUni;
                            if(that.byId("MF_LOCATIONU").getVisible() === true && that.byId("DM_LOCATIONU").getVisible() === true){
                            var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);                            
                            prod = prod.filter(item => idsInArray1.includes(item.FACTORY_LOC));
                            var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                            prod = prod.filter(item => idsInArray.includes(item.DEMAND_LOC));

                            ConfProd = prod.filter((value, index, self) =>
                                index === self.findIndex((obj) => obj.FACTORY_LOC === value.FACTORY_LOC &&
                                                                  obj.DEMAND_LOC === value.DEMAND_LOC &&
                                                                  obj.REF_PRODID === value.REF_PRODID)
                            );
                            } else if(that.byId("MF_LOCATIONU").getVisible() === true && that.byId("DM_LOCATIONU").getVisible() === false){
                                var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);                            
                                prod = prod.filter(item => idsInArray1.includes(item.FACTORY_LOC));

                                ConfProd = prod.filter((value, index, self) =>
                                    index === self.findIndex((obj) => obj.FACTORY_LOC === value.FACTORY_LOC &&
                                                                      obj.REF_PRODID === value.REF_PRODID)
                                );


                            // } else if(that.byId("MF_LOCATIONU").getVisible() === false && that.byId("DM_LOCATIONU").getVisible() === true){

                            }

                        //     if(that.byId("DM_LOCATIONU").getVisible() === true){
                        //     var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                        //     prod = prod.filter(item => idsInArray.includes(item.DEMAND_LOC));

                        //     ConfProd = prod.filter((value, index, self) =>
                        //         index === self.findIndex((obj) => obj.DEMAND_LOC === value.DEMAND_LOC &&
                        //                                           obj.REF_PRODID === value.REF_PRODID)
                        //     );
                        // }
                        }
                    }

                    if(DemandFlag == "X"){
                        var demandDataTemp = [];
                        demandLocation.forEach(el=> {
                            var index = ConfProd.findIndex(e=> e.DEMAND_LOC === el.DEMAND_LOC);
                            if(index !== -1){
                                var obj = {
                                    FACTORY_LOC: el.FACTORY_LOC,
                                    DEMAND_LOC: el.DEMAND_LOC
                                };
                                demandDataTemp.push(obj);
                            }
                        })

                        function removeDuplicate(array, key) {
                            var check = new Set();
                            return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                        }
                        demandDataTemp = removeDuplicate(demandDataTemp, 'DEMAND_LOC');
                        demandLocation = demandDataTemp;

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


                    that.oGModel.setProperty("/ConfProd", ConfProd);

                    // Products
                    if (that.byId("PARTIAL_PRODUCTU").getVisible() === true) {
                        if (core.byId("PprodInputU").getTokens().length > 0) {
                            var pro = core.byId("PprodInputU").getTokens();
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
                            prod = prod.filter(el => el.PRODUCT_ID !== el.REF_PRODID);
                            prod.forEach(el => {                                
                                var obj = {
                                    REF_PRODID: el.REF_PRODID,
                                    PRODUCT_ID: el.PRODUCT_ID
                                };
                                product.push(obj);
                            });

                        }
                    }

                    // if(ConProdFlag == "X"){
                    //     var confProdDataTemp = [];
                    //     ConfProd.forEach(el=> {
                    //         var index = product.findIndex(e=> e.REF_PRODID === el.REF_PRODID);
                    //         if(index !== -1){
                    //             var obj = {
                    //                 DEMAND_LOC: el.DEMAND_LOC,
                    //                 REF_PRODID : el.REF_PRODID
                    //             };
                    //             confProdDataTemp.push(obj);
                    //         }
                    //     })
                    //     function removeDuplicate(array, key) {
                    //         var check = new Set();
                    //         return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    //     }
                    //     confProdDataTemp = removeDuplicate(confProdDataTemp, 'REF_PRODID');
                    //     ConfProd = confProdDataTemp;
                    // }
                    that.oGModel.setProperty("/product", product);

                // var custGroup = core.byId("custGrpInputU").getTokens();
                // var selCustGroup = "";
                //     if(custGroup.length > 0){
                //     selCustGroup = "(" +  custGroup.map(cust => `'${cust.getKey()}'`).join(',') + ")";
                // }
                var selCustGroup = "ALL";
                var snapS = "";

                if(core.byId("idSnapShotU").getSelected() == true){
                    snapS = that.byId("idSnapRadioU").getSelectedButton().getText() == 'Create' ? 'C' : 'U';

                }
                    var core = that;
                    var otherParams = {

                        PREDICTION_PROFILE: core.byId("PrePFInputU").getValue(),
                        FORECAST_ALGORITHM: core.byId("ForeAlgInputU").getValue(),
                        VERSION: core.byId("idverU").getValue(),
                        SCENARIO: core.byId("idscenU").getValue(),
                        CLASS: core.byId("classInputU").getValue(),
                        // CUSTOMER_GROUP: core.byId("custGrpInputU").getValue(),
                        CUSTOMER_GROUP: selCustGroup,
                        FROM_DATE: core.byId("FromDateU").getValue(),
                        TO_DATE: core.byId("ToDateU").getValue(),
                        SINGLE_DATE: core.byId("singleDtU").getValue(),
                        Rolling_Timestamp: core.byId("idRollingWeeksU").getValue(),
                        HISTORY_WEEKS: core.byId("idWeeksU").getValue(),
                        // OVERRIDE_ASSIGNMENT: core.byId("idOverrideU").getSelected(),
                        CRITICAL_ASSEMBLY: core.byId("idCriticalU").getSelected(),
                        IMPACT_ANALYSIS: core.byId("idImpactU").getSelected(),
                        DAILY: core.byId("idDailyU").getSelected(),
                        FULL_RUN: core.byId("idFullrunU").getSelected(),
                        SnapShot: snapS,
                        SnapShot_Desc: core.byId("idSnapDescU").getValue(),
                        Rolling: core.byId("idRollingU").getSelected(),
                        // OptProfile:core.byId("PidOptProfileU").getSelected(),
                        Optimizations:core.byId("PidOptimizationU").getSelected(),
                        POptProfile:core.byId("PidOptProfileU").getSelectedKey(),
                        // POptProfile:core.byId("PidOptProfileU").getSelectedKey(),
                        OptProfile:core.byId("idOptProfileU").getSelectedKey(),

                        OPERATOR: core.byId("idOperatorU").getSelectedKey(),
                        MODEL_VERSION: core.byId("idModelVerU").getSelectedKey(),
                        GEN_TYPE: core.byId("GenidTypeU").getSelectedKey(),
                        // DsAlgorithm: core.byId("PidDSAlgU").getSelectedKey(),
                        // OptFactor: core.byId("PidOptFctU").getSelectedKey(),
                        // OptAlgorithm: core.byId("PidOptAlgU").getSelectedKey(),

                    }
                    that.oGModel.setProperty("/otherParams", otherParams);

                    // // commented for adding Conf PRod
                    // var idsInArray = product.map(item => item.PRODUCT_ID);
                    // var data = that.TotalDataUni.filter(item => idsInArray.includes(item.PRODUCT_ID));
                    // var idsInArray1 = manuLocation.map(item => item.FACTORY_LOC);
                    // var idsInArray = demandLocation.map(item => item.DEMAND_LOC);
                    // var prod1 = data.filter(item => idsInArray1.includes(item.FACTORY_LOC));
                    // var productData = prod1.filter(item => idsInArray.includes(item.DEMAND_LOC));

                    // // if (productData.length <= 0) {
                    // //     sap.m.MessageToast.show("Select Products with combination of Locations");
                    // //     return;
                    // // }

                    // function removeDuplicate(array, key) {
                    //     var check = new Set();
                    //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                    // }
                    // productData = removeDuplicate(productData, 'REF_PRODID');

                    // // end

                    var FinalDataArray = [],
                        cArray = [];
                    var mdObj = {};
                    var parObj = {};
                    var confObj = {};

                   if(manuLocation.length == 0 && demandLocation.length == 0 && ConfProd.length == 0 && product.length == 0){
                        FinalDataArray.push(otherParams);
                   }

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

                                // parObj = {
                                //     ...mdObj,
                                //     ...cobj,
                                //     ...otherParams
                                // }
                                var string = "";
                                // // var PP = that.ConfProdall.filter(el=> el.REF_PRODID === cProd[c].REF_PRODID &&
                                // //                                                  el.CONFIGPROD_CHK !== "X");
                                // var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                                //                                         el.DEMAND_LOC === dLoc[d].DEMAND_LOC &&
                                //                                         el.PRODUCT_ID !== el.REF_PRODID);
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
                                    // var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                                    //                                         el.DEMAND_LOC === dLoc[d].DEMAND_LOC &&
                                    //                                         el.REF_PRODID === cProd[c].REF_PRODID &&
                                    //                                         el.PRODUCT_ID !== cProd[c].REF_PRODID);
                                    var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                                                                                el.DEMAND_LOC === dLoc[d].DEMAND_LOC &&
                                                                                el.REF_PRODID === cProd[c].REF_PRODID );
                                    if (PP.length > 0) {

                                        PP.forEach(e => {
                                            var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
                                            if (index !== -1) {
                                                // if (string === "") {
                                                //     string = cProd[c].REF_PRODID + "," + product[index].PRODUCT_ID;
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



                                    // // var prd = product.filter(el => el.DEMAND_LOC === dLoc[d].DEMAND_LOC );
                                    // var preProd = "";
                                    // var currProd = "";
                                    // var string = "";
                                    // var configProd = "";

                                    // for (var p = 0; p < productData.length; p++) {
                                    //     string = "";
                                    //     // var PP = that.TotalDataUni.filter(el => el.FACTORY_LOC === manuLocation[m].FACTORY_LOC &&
                                    //     //     el.DEMAND_LOC === dLoc[d].DEMAND_LOC &&
                                    //     //     el.REF_PRODID === productData[p].REF_PRODID);
                                    //     var PP = that.ConfProdall.findIndex(el=> el.REF_PRODID === cProd[c].REF_PRODID &&
                                    //                                              el.CONFIGPROD_CHK !== "X")
                                    //     if (PP.length > 0) {
                                    //         PP.forEach(e => {
                                    //             var index = product.findIndex(el => el.PRODUCT_ID === e.PRODUCT_ID);
                                    //             if (index !== -1) {
                                    //                 if (string === "") {
                                    //                     string = product[index].PRODUCT_ID;
                                    //                 } else {
                                    //                     if (!string.includes("product[index].PRODUCT_ID")) {
                                    //                         string = string + "," + product[index].PRODUCT_ID;
                                    //                     }
                                    //                 }
                                    //             }
                                    //         });
                                    //         var cobj = {
                                    //             // REF_PRODID: productData[p].REF_PRODID,
                                    //             PRODUCT_ID: string
                                    //         }
                                    //         parObj = {
                                    //             ...mdObj,
                                    //             ...cobj,
                                    //             ...otherParams
                                    //         }

                                    //         FinalDataArray.push(parObj);
                                    //         string = "";
                                    //     }

                                    // }

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
                        var JobRunFlag = "";
                        var errorLocData = "";
                        if (array[a].includes("IMPORT_S4") || array[a].includes("EXPORT_IBP_CLASS") || array[a].includes("EXPORT_IBP_CUSTOMERGROUP") ||
                            array[a].includes("EXPORT_IBP_LOCATION") || array[a].includes("EXPORT_IBP_PRODUCT") || array[a] === "IMPORT_VERSION_SCENARIO" || 
                            array[a] === "GENERATE_TELESCOPIC_PERIODS" || array[a] === "PURGE_ALERTS_DATA"  || array[a] === 'SNAPSHOT_LAG') {
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
                                                TEMPLATE_ID: that.byId("idJobname").getValue(),
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
                                                TEMPLATE_ID: that.byId("idJobname").getValue(),
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
                                    TEMPLATE_ID: that.byId("idJobname").getValue(),
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
                                    TEMPLATE_ID: that.byId("idJobname").getValue(),
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
                            var JobRunFlag = "";
                            var errorLocData = "";
                            for (var i = 0; i < FinalDataArray.length; i++) {
                                let loc = FinalDataArray[i].LOCATION_ID;
                                  JobRunFlag = "";
                                  errorLocData = "";
                                for (var a = 0; a < activity.length; a++){
                                    
                                    if(activity[a] == "GENERATE_OPTIMIZATIONS"){
                                        if(FinalDataArray[i].OptProfile === "None"){
                                            var data = that.ProfileData.filter(el=> el.LOCATION_ID == loc && el.PRODUCT_ID == "NA");
                                            
                                         JobRunFlag = data.length > 0 ? data[0].OPTIMIZATION_PROFILE !== ""  && data[0].OPTIMIZATION_PROFILE !== null ? "" : "X" : "X";
                                         if(JobRunFlag == "X"){
                                            break;
                                         }
                                        }

                                    } else if(activity[a] == "PREDICTION"){
                                            if(FinalDataArray[i].POptProfile === "None"){
                                            var data = that.ProfileData.filter(el=> el.LOCATION_ID == loc && el.PRODUCT_ID == "NA");
                                            
                                         JobRunFlag = data.length > 0 ? data[0].OPTIMIZATION_PROFILE !== "" && data[0].OPTIMIZATION_PROFILE !== null ? "" : "X" : "X";
                                         if(JobRunFlag == "X"){
                                            break;
                                         }
                                        }
                                    } else if(activity[a] == "STATFORECAST_FOR_CHAR_VALUES"){
                                        if(FinalDataArray[i].FORECAST_ALGORITHM == ""){
                                            var data = that.ProfileData.filter(el=> el.LOCATION_ID == loc && el.PRODUCT_ID == "NA");
                                            
                                         JobRunFlag = data.length > 0 ? data[0].FORECASTING_PROFILE !== "" && data[0].FORECASTING_PROFILE !== null ? "" : "X" : "X";
                                         if(JobRunFlag == "X"){
                                            break;
                                         }
                                        }

                                    } else if(activity[a] == "MODEL_GENERATION"){
                                        if(FinalDataArray[i].PREDICTION_PROFILE == ""){
                                            var data = that.ProfileData.filter(el=> el.LOCATION_ID == loc && el.PRODUCT_ID == "NA");
                                            
                                         JobRunFlag = data.length > 0 ? data[0].PREDICTION_PROFILE !== "" && data[0].PREDICTION_PROFILE !== null ? "" : "X" : "X";
                                         if(JobRunFlag == "X"){
                                            break;
                                         }
                                        }
                                    }
                                }
                            if(JobRunFlag == ""){
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
                                            // } else if (test === "DM_LOCATION") {
                                            //     stepObj.LOCATION_ID = FinalDataArray[i].LOCATION_ID;
                                        } else if (test.includes("PRODUCT")) {
                                            var index = that.currParams.findIndex(el => el.PARAMETER_ID === "PARTIAL_PRODUCT");
                                            if (index !== -1) {
                                                stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");;
                                            } else {
                                                stepObj.PRODUCT_ID = FinalDataArray[i].REF_PRODID;
                                            }
                                            // stepObj.PRODUCT_ID = FinalDataArray[i].REF_PRODID;
                                            // stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");
                                            // } else if (test === "PARTIAL_PRODUCT") {
                                            //     stepObj.PRODUCT_ID = FinalDataArray[i].PRODUCT_ID.split(",");
                                        } else if (test === "PREDICTION_PROFILE") {
                                            stepObj.PREDICTION_PROFILE = FinalDataArray[i].PREDICTION_PROFILE;
                                            stepObj.OVERRIDE_ASSIGNMENT = FinalDataArray[i].PREDICTION_PROFILE == ""? false : true;
                                        } else if (test === "FORECAST_ALGORITHM") {
                                            stepObj.FORECAST_ALGORITHM = FinalDataArray[i].FORECAST_ALGORITHM;
                                            stepObj.OVERRIDE_ASSIGNMENT = FinalDataArray[i].FORECAST_ALGORITHM == ""? false : true;
                                        } else if (test === "VERSION") {
                                            stepObj.VERSION = FinalDataArray[i].VERSION;
                                        } else if (test === "SCENARIO") {
                                            stepObj.SCENARIO = FinalDataArray[i].SCENARIO;
                                        } else if (test === "CUSTOMER_GROUP") {
                                            stepObj.CUSTOMER_GROUP = FinalDataArray[i].CUSTOMER_GROUP;
                                        } else if (test === "CLASS") {
                                            stepObj.CLASS = FinalDataArray[i].CLASS;
                                        } else if (test === "CRITICAL_ASSEMBLY") {
                                            var criticalCheck = "";
                                            if (FinalDataArray[i].CRITICAL_ASSEMBLY === "true" || FinalDataArray[i].CRITICAL_ASSEMBLY === true ||
                                                FinalDataArray[i].CRITICAL_ASSEMBLY === "X") {
                                                criticalCheck = "X";
                                            }
                                            stepObj.CRITICAL_ASSEMBLY = criticalCheck;
                                        } else if (test === "IMPACT_ANALYSIS") {
                                            if (FinalDataArray[i].IMPACT_ANALYSIS === "true" || FinalDataArray[i].IMPACT_ANALYSIS === true) {
                                                stepObj.IMPACT_ANALYSIS = true;
                                            } else {
                                                stepObj.IMPACT_ANALYSIS = false;
                                            }
                                        } else if (test === "DAILY") {
                                            if (FinalDataArray[i].DAILY === "true" || FinalDataArray[i].DAILY === true) {
                                                stepObj.DAILY = true;
                                            } else {
                                                stepObj.DAILY = false;
                                            }
                                        } else if (test === "FULL_RUN") {
                                            if (FinalDataArray[i].FULL_RUN === "true" || FinalDataArray[i].FULL_RUN === true) {
                                                stepObj.FULL_RUN = true;
                                            } else {
                                                stepObj.FULL_RUN = false;
                                            }
                                        // } else if (test === "OVERRIDE_ASSIGNMENT") {
                                        //     if (FinalDataArray[i].OVERRIDE_ASSIGNMENT === "true" || FinalDataArray[i].OVERRIDE_ASSIGNMENT === true) {
                                        //         stepObj.OVERRIDE_ASSIGNMENT = true;
                                        //     } else {
                                        //         stepObj.OVERRIDE_ASSIGNMENT = false;
                                        //     }
                                        } else if (test === "GEN_TYPE") {
                                            stepObj.GEN_TYPE = FinalDataArray[i].GEN_TYPE;
                                        } else if (test === "MODEL_VERSION") {
                                            stepObj.MODEL_VERSION = FinalDataArray[i].MODEL_VERSION;
                                        } else if (test === "DATE_RANGE") {
                                            stepObj.FROM_DATE = FinalDataArray[i].FROM_DATE;
                                            stepObj.TO_DATE = FinalDataArray[i].TO_DATE;
                                        } else if (test === "OPERATOR") {
                                            var operator = that.byId("idOperatorU").getSelectedKey();
                                            stepObj.OPERATOR = operator;
                                        } else if (test === "SINGLE_DATE") {
                                            stepObj.SINGLE_DATE = FinalDataArray[i].SINGLE_DATE;
                                        } else if (test === "Rolling_Timestamp") {
                                            stepObj.Rolling = that.byId("idRollingU").getSelected();
                                            stepObj.Rolling_Timestamp = parseInt(FinalDataArray[i].Rolling_Timestamp);
                                        // } else if (test === "DsAlgorithm") {
                                        //     var DSAlgo = that.byId("PidDSAlgU").getSelectedKey();
                                        //     stepObj.DsAlgorithm = DSAlgo;
                                        // } else if (test === "OptFactor") {
                                        //     var OPTfact = that.byId("PidOptFctU").getSelectedKey();
                                        //     stepObj.OptFactor = parseFloat(OPTfact);
                                        // } else if (test === "OptAlgorithm") {
                                        //     var OPTalgo = that.byId("PidOptAlgU").getSelectedKey();
                                        //     stepObj.OptAlgorithm = OPTalgo;
                                        } else if (test === "Optimization") {
                                            // var Optimization = that.byId("PidOptProfileU").getSelected();
                                            var Optimization = that.byId("PidOptimizationU").getSelected();
                                            stepObj.Optimization = Optimization;
                                        } else if (test === "POptProfile") {
                                            // var OPTProfile = that.byId("PidOptProfileU").getSelected();
                                            var POPTProfile = that.byId("PidOptProfileU").getSelectedKey();
                                            stepObj.POptProfile = POPTProfile;
                                             stepObj.OVERRIDE_ASSIGNMENT = POPTProfile == "None"? false : true;
                                        } else if (test === "OptProfile") {
                                            // var OPTProfile = that.byId("PidOptProfileU").getSelected();
                                            var OPTProfile = that.byId("idOptProfileU").getSelectedKey();
                                            stepObj.OptProfile = OPTProfile;
                                             stepObj.OVERRIDE_ASSIGNMENT = OPTProfile == "None"? false : true;
                                        } else if (test === "SnapShot") {
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
                                        } else if (test === "HISTORY_WEEKS") {
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

                                    

                                    var tempObj = {
                                        ...stepObj,
                                        ACTIVITY_ID: activity[t]
                                    }


                                    var aDIndex = aDataCheck.findIndex(el=> el.MF_LOCATION_ID === tempObj.MF_LOCATION_ID &&
                                                                            el.DEMAND_LOC    === tempObj.DEMAND_LOC &&
                                                                            el.PRODUCT_ID     === tempObj.PRODUCT_ID &&
                                                                            el.ACTIVITY_ID    === activity[t] );
                                    if(aDIndex === -1){
                                        aDataCheck.push(tempObj);
                                    
                                        step = step + 1;
                                        substep = substep + 1;

                                    var obj = {
                                        TEMPLATE_ID: that.byId("idJobname").getValue(),
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
                                        TEMPLATE_ID: that.byId("idJobname").getValue(),
                                        ACTIVITY_ID: activity[t],
                                        STEP_DATA: stepObj,
                                        ACTION_URL: Action[0].ACTION_URL,
                                        SET: set,
                                        STEP: step,
                                        SUBSTEP: substep,
                                        MANDATORY: "",
                                        MAIN_STEP: mainstep,

                                    }

                                    if (activity[t] === "PUBLISH_FORECAST_ORDERS") {
                                        var User = "";
                                        if (sap.ushell.Container) {
                                            let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                                            User = (email) ? email : "";
                                        }
                                        obj.PARAM_VALUE.VALIDUSER = that.sCFUserDestination;
                                        obj.PARAM_VALUE.USER_ID = User;
                
                                        obj1.STEP_DATA.VALIDUSER = that.sCFUserDestination;
                                        obj1.STEP_DATA.USER_ID = User;
                                    }

                                    TemplateDetails.push(obj);
                                    JobcreationData.push(obj1);
                                }

                                }
                            } else {
                                errorLocData = errorLocData == "" ? loc : errorLocData + "," + loc;
                            }
                            }
                        }

                    }

                    console.log(TemplateDetails);
                    console.log(JobcreationData);



                if(errorLocData == ""){
                        that.sSequence = "";
                    if (that.Edit === "") {
                        that.sSequence = "Sequence_" + new Date().getTime();
                    } else {
                        that.sSequence = that.JobData[0].SEQUENCE_ID;
                    }

                    that.oGModel.setProperty("/saveData", that.saveData);
                    that.oGModel.setProperty("/TemplateDetails", TemplateDetails);
                    that.oGModel.setProperty("/JobcreationData", JobcreationData);

                    if ((that.saveData.includes("idcreateJob") || that.saveData.includes("idupdate")) && JobcreationData.length > 0) {
                        that.saveJObData(that.saveData, TemplateDetails, JobcreationData);
                    } else if(JobcreationData.length > 0) {
                        if (!this._StepSelDialog) {
                            this._StepSelDialog = sap.ui.xmlfragment(
                                "vcpapp.vcpjobschedulersequence.view.StepSelDialog",
                                this
                            );
                            this.getView().addDependent(this._StepSelDialog);
                        }
                        sap.ui.getCore().byId("idVarName").setValue();
                        that._StepSelDialog.open();
                    } else {
                        sap.m.MessageToast.show("No steps are generated to schedule job")
                    }
                } else {
                    var text = "For the Location(s) " + errorLocData + " profile maintenance is incomplete, jobs will not generate for this location(s). Do you want to continue.?"
                    sap.m.MessageBox.show(
                        text, {
                        title: "Confirmation!",
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.YES) {
                                if(JobcreationData.length > 0) {
                                    that.sSequence = "";
                                    if (that.Edit === "") {
                                        that.sSequence = "Sequence_" + new Date().getTime();
                                    } else {
                                        that.sSequence = that.JobData[0].SEQUENCE_ID;
                                    }

                                    that.oGModel.setProperty("/saveData", that.saveData);
                                    that.oGModel.setProperty("/TemplateDetails", TemplateDetails);
                                    that.oGModel.setProperty("/JobcreationData", JobcreationData);

                                    if ((that.saveData.includes("idcreateJob") || that.saveData.includes("idupdate")) && JobcreationData.length > 0) {
                                        that.saveJObData(that.saveData, TemplateDetails, JobcreationData);
                                    } else if(JobcreationData.length > 0) {
                                        if (!this._StepSelDialog) {
                                            this._StepSelDialog = sap.ui.xmlfragment(
                                                "vcpapp.vcpjobschedulersequence.view.StepSelDialog",
                                                this
                                            );
                                            this.getView().addDependent(this._StepSelDialog);
                                        }
                                        sap.ui.getCore().byId("idVarName").setValue();
                                        that._StepSelDialog.open();
                                    } else {
                                        sap.m.MessageToast.show("No steps are generated to schedule job")
                                    }
                                } else {
                                        sap.m.MessageToast.show("No steps are generated to schedule job")
                                    }
                            }

                        }
                    }
                    );

                }

                    // that.sSequence = "";
                    // if (that.Edit === "") {
                    //     that.sSequence = "Sequence_" + new Date().getTime();
                    // } else {
                    //     that.sSequence = that.JobData[0].SEQUENCE_ID;
                    // }

                    // that.oGModel.setProperty("/saveData", that.saveData);
                    // that.oGModel.setProperty("/TemplateDetails", TemplateDetails);
                    // that.oGModel.setProperty("/JobcreationData", JobcreationData);

                    // if ((that.saveData.includes("idcreateJob") || that.saveData.includes("idupdate")) && JobcreationData.length > 0) {
                    //     that.saveJObData(that.saveData, TemplateDetails, JobcreationData);
                    // } else if(JobcreationData.length > 0) {
                    //     if (!this._StepSelDialog) {
                    //         this._StepSelDialog = sap.ui.xmlfragment(
                    //             "vcpapp.vcpjobschedulersequence.view.StepSelDialog",
                    //             this
                    //         );
                    //         this.getView().addDependent(this._StepSelDialog);
                    //     }
                    //     sap.ui.getCore().byId("idVarName").setValue();
                    //     that._StepSelDialog.open();
                    // } else {
                    //     sap.m.MessageToast.show("No steps are generated to schedule job")
                    // }

                    




                } else {
                    // if (value <= 0) {
                    //     MessageToast.show("History weeks can not be lessthen 1");

                    // } else if (value > 156) {
                    //     MessageToast.show("History weeks can not be greaterthen 156");

                    // } else {
                    //     sap.m.MessageToast.show("Please Select profile /version / scenario/ forecast algorithem is visible");
                    // }
                    sap.m.MessageToast.show("Please Select profile /version / scenario/ forecast algorithm if any visible");

                }

            },

            oncloseVariant: function () {
                that._StepSelDialog.close();
            },
            onvariantNameChange: function () {
                that.variantName = sap.ui.getCore().byId("idVarName").getValue().toUpperCase();

                var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;

                var validate = specials.test(that.variantName);
                sap.ui.getCore().byId("idVarName").setValue(that.variantName);

                if (validate === true) {
                    sap.m.MessageToast.show("Special characters are not allowed for Job Variant name");
                }
            },

            onConfirmVariant: function () {
                that.variantName = sap.ui.getCore().byId("idVarName").getValue();

                var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;

                var validate = specials.test(that.variantName);

                if (validate === false) {
                    that.sSequence = that.variantName;
                    that._StepSelDialog.close();
                    that.saveJObData();
                    // that.InsertTemplate();
                } else {
                    sap.m.MessageToast.show("Please enter valid Job Variant name");
                }


            },

            saveJObData: function (button, TemplateDetails, JobcreationData) {
                that.saveData = that.oGModel.getProperty("/saveData");
                var TemplateDetails = that.oGModel.getProperty("/TemplateDetails");
                var JobcreationData = that.oGModel.getProperty("/JobcreationData");
                console.log(TemplateDetails);
                console.log(JobcreationData);
                var oModel = that.getOwnerComponent().getModel('JModel');
                sap.ui.core.BusyIndicator.show();
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
                        sap.ui.core.BusyIndicator.hide();
                        if (that.saveData.includes("idcreateJob")) {
                            //new add//
                            if (that.Edit !== "X") {
                                that.SaveTemplateDetails = TemplateDetails;
                                that.createJob(oData.insertJobData);
                            } else {
                                that.saveJobDetails("", TemplateDetails);
                            }
                        } else {
                            that.InsertTemplate();
                        }

                        // //Now create job
                        // that.createJob(oData.insertJobData);
                        // // sap.m.MessageToast.show("success");
                    },
                    error: function (oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Failed");
                    },
                });
            },
            InsertTemplate: function () {

                var tempDetails = that.oGModel.getProperty("/tempDetails");
                var paramdata = [];
                that.TempData = [];
                that.ParametersData = [];

                for (var i = 0; i < tempDetails.length; i++) {
                    if (tempDetails[i].includes(",")) {
                        var temp = tempDetails[i].split(",");
                    } else {
                        var temp = tempDetails[i];
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
                var tempplateName = tempDetails[0].TEMPLATE_ID;
                //    var jobFeedname = "test";


                paramdata.forEach(function (el, i) {
                    var tempObj = {
                        ACTIVITY_ID: el,
                        ACT_POSITION: i + 1,
                        CREATED_BY: User,
                        LAYER_CODE: layercode,
                        LEVEL: Level,
                        MAXSTEP: maxstpe,
                        STEP_NAME: el,
                        TEMPLATE_DESC: that.templateDesc,
                        TEMPLATE_ID: that.templateName,
                        VARIANT_NAME: that.variantName
                    }

                    that.TempData.push(tempObj);

                });

                // Parameter values
                var mfloc = that.oGModel.getProperty("/manuLocation");
                var dloc = that.oGModel.getProperty("/demandLocation");
                var confProd = that.oGModel.getProperty("/ConfProd");
                var prod = that.oGModel.getProperty("/product");
                var others = that.oGModel.getProperty("/otherParams");
                var MF_LOCATION_ID = "",
                    LOCATION_ID = "",
                    CONFIG_PRODUCT = "",
                    PARTIAL_PRODUCT = "";

                mfloc.forEach(el => {
                    if (MF_LOCATION_ID === "") {
                        MF_LOCATION_ID = el.FACTORY_LOC;
                    } else {
                        MF_LOCATION_ID = MF_LOCATION_ID + "," + el.FACTORY_LOC;
                    }
                });
                dloc.forEach(el => {
                    if (LOCATION_ID === "") {
                        LOCATION_ID = el.DEMAND_LOC;
                    } else {
                        LOCATION_ID = LOCATION_ID + "," + el.DEMAND_LOC;
                    }
                });
                confProd.forEach(el => {
                    if (CONFIG_PRODUCT === "") {
                        CONFIG_PRODUCT = el.REF_PRODID;
                    } else {
                        if (!CONFIG_PRODUCT.includes(el.REF_PRODID)) {
                            CONFIG_PRODUCT = CONFIG_PRODUCT + "," + el.REF_PRODID;
                        }

                    }
                });
                prod.forEach(el => {
                    if (PARTIAL_PRODUCT === "") {
                        PARTIAL_PRODUCT = el.PRODUCT_ID;
                    } else {
                        if (!PARTIAL_PRODUCT.includes(el.PRODUCT_ID)) {
                            PARTIAL_PRODUCT = PARTIAL_PRODUCT + "," + el.PRODUCT_ID;
                        }
                    }
                });

                others.MF_LOCATION_ID = MF_LOCATION_ID;
                others.LOCATION_ID = LOCATION_ID;
                others.CONFIG_PRODUCT = CONFIG_PRODUCT;
                others.PARTIAL_PRODUCT = PARTIAL_PRODUCT;

                console.log(others);


                Object.entries(others).forEach(function (x, i) {


                    const obj = {
                        "TEMPLATE_ID": that.templateName,
                        "VARIANT_NAME": that.variantName,
                        "ACTIVITY_ID": that.templateName,
                        "ACT_POSITION": i + 1,
                        "LEVEL": Level,
                        "PARAMETER_ID": x[0],
                        "VALUE": x[1].toString()
                    }
                    that.ParametersData.push(obj);

                });

                console.log(that.ParametersData);


                sap.ui.core.BusyIndicator.show();
                that.getModel("JSModel").callFunction("/genTemplateDetails", {
                    method: "GET",
                    urlParameters: {
                        FLAG: "C",
                        VARIANT: "X",
                        TEMPDATA: JSON.stringify(that.TempData),
                        PARAMDATA: JSON.stringify(that.ParametersData)
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







            },

            CommonFilEdit: function () {
                var data = that.oGModel.getProperty("/editData");

                that.byId("idTempValue").setValue(that.JobData[0].TEMPLATE_ID);
                that.byId("idJobname").setValue(data.JOB_NAME);
                that.onJobnamevalidation();

                that.MaxStep = data.TOTAL_STEPS;
                that.onSelTemp();
                that.onRecurrence();
                var templateName = that.byId("idTempValue").getValue();
                sap.ui.core.BusyIndicator.show();
                // that.getModel("JSModel").read("/readTemplateItems", {
                //     filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, that.JobData[0].TEMPLATE_ID),
                //               new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                //             ], and:true,
                that.getModel("JSModel").read("/readTemplateItems", {
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, templateName),
                    new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                    ],
                    and: true,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();

                        that.TemplateItems = oData.results;
                        that.TemplateItems = that.TemplateItems.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);

                        // var temp = that.TemplateItems.filter(function (aComp) {
                        //     return aComp.ACTIVITY_ID === "PUBLISH_FORECAST_ORDERS";
                        // });
                        // that.MaxStep = that.TempParams.length;
                        // // that.divideDatatoSend();

                        // if (temp.length > 0) {
                        //     that.getUserData();
                        // }

                        // if (that.byId("CreateWizard")._aStepPath.length === 3) {
                        //     that.onValidation();
                        // }

                        //     },
                        //     error: function (error) {
                        //         sap.ui.core.BusyIndicator.hide();
                        //         MessageToast.show("Failed to get template items data");
                        //     },
                        // });

                        var obj = {
                            MF_LOCATION_ID: [],
                            LOCATION_ID: [],
                            REF_PRODID: [],
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
                            Optimizations: "",
                            POptProfile: "", 
                            OptProfile:"",
                            // DsAlgorithm: "",
                            OptFactor: "",
                            OptAlgorithm: "",
                            SnapShot: "",
                            SnapShot_Desc: "",
                            HISTORY_WEEKS: ""
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
                                            if (index === -1) {
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

                            if (index === -1) {
                                that.TempParams.push(tempData[i]);
                            }

                        }

                        obj.MF_LOCATION_ID = [...new Set(obj.MF_LOCATION_ID)];
                        obj.LOCATION_ID = [...new Set(obj.LOCATION_ID)];
                        // obj.REF_PRODID = [...new Set(obj.REF_PRODID)];
                        obj.PRODUCT_ID = [...new Set(obj.PRODUCT_ID)];
                        var data = [];
                        obj.PARTIAL_PRODUCT = obj.PRODUCT_ID;

                        obj.PRODUCT_ID.forEach(function (el) {
                            var data = that.ConfProdall.filter(e => e.PRODUCT_ID === el);
                            if(data.length){
                            obj.CONFIG_PRODUCT.push(data[0].REF_PRODID);
                            }
                            // data.push({REF_PRODID:that.ConfProdall.find(o => o.PRODUCT_ID === el)?.REF_PRODID});

                        });

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
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get template items data");
                    },
                });

            },

            // setValues: function (obj) {
            //     var core = that;

            //     if (that.byId("MF_LOCATIONU").getVisible()) {
            //         obj.MF_LOCATION_ID.forEach(function (oItem, i) {
            //             that.byId("MFLInputU").addToken(
            //                 new sap.m.Token({
            //                     key: oItem,
            //                     text: oItem,
            //                     editable: false,

            //                 })
            //             );

            //         });
            //     }

            //     if (that.byId("DM_LOCATIONU").getVisible()) {
            //         obj.LOCATION_ID.forEach(function (oItem, i) {
            //             that.byId("DlocInputU").addToken(
            //                 new sap.m.Token({
            //                     key: oItem,
            //                     text: oItem,
            //                     editable: false,

            //                 })
            //             );

            //         });

            //     }

            //     if (that.byId("CONFIG_PRODUCTU").getVisible()) {
            //         obj.PRODUCT_ID.forEach(function (oItem, i) {
            //             that.byId("CprodInputU").addToken(
            //                 new sap.m.Token({
            //                     key: oItem,
            //                     text: oItem,
            //                     editable: false,

            //                 })
            //             );

            //         });

            //     }
            //     if (that.byId("PARTIAL_PRODUCTU").getVisible()) {
            //         obj.PRODUCT_ID.forEach(function (oItem, i) {
            //             that.byId("PprodInputU").addToken(
            //                 new sap.m.Token({
            //                     key: oItem,
            //                     text: oItem,
            //                     editable: false,

            //                 })
            //             );

            //         });

            //     }

            //     core.byId("PrePFInputU").setValue(obj.PREDICTION_PROFILE);
            //     core.byId("idverU").setValue(obj.VERSION);
            //     core.byId("idscenU").setValue(obj.SCENARIO);
            //     core.byId("classInputU").setValue(obj.CLASS);
            //     core.byId("custGrpInputU").setValue(obj.CUSTOMER_GROUP);
            //     core.byId("FromDateU").setValue(obj.FROM_DATE);
            //     core.byId("ToDateU").setValue(obj.TO_DATE);
            //     core.byId("singleDtU").setValue(obj.SINGLE_DATE);
            //     core.byId("idRollingWeeksU").setValue(obj.Rolling_Timestamp);
            //     core.byId("idWeeksU").setValue(obj.HISTORY_WEEKS);
            //     if (obj.CRITICAL_ASSEMBLY === "X") {
            //         core.byId("idCriticalU").setSelected(true);
            //     } else {
            //         core.byId("idCriticalU").setSelected(false);
            //     }
            //     if(obj.OVERRIDE_ASSIGNMENT === true || obj.OVERRIDE_ASSIGNMENT === "true"){
            //         core.byId("idOverrideU").setSelected(true);
            //     } else {
            //         core.byId("idOverrideU").setSelected(false);
            //     }
            //     if(obj.IMPACT_ANALYSIS === true || obj.IMPACT_ANALYSIS === "true"){
            //         core.byId("idImpactU").setSelected(true);
            //     } else {
            //         core.byId("idImpactU").setSelected(false);
            //     }
            //     if(obj.DAILY === true || obj.DAILY === "true"){
            //         core.byId("idDailyU").setSelected(true);
            //     } else {
            //         core.byId("idDailyU").setSelected(false);
            //     }

            //     if (obj.SnapShot === "") {
            //         obj.SnapShot = false;
            //     }
            //     if (obj.Rolling === "") {
            //         obj.Rolling = false;
            //     }
            //     core.byId("idSnapShotU").setSelected(obj.SnapShot);
            //     core.byId("idSnapDescU").setValue(obj.SnapShot_Desc);
            //     core.byId("idRollingU").setSelected(obj.Rolling);

            //     core.byId("idOperatorU").setSelectedKey(obj.OPERATOR);
            //     core.byId("idModelVerU").setSelectedKey(obj.MODEL_VERSION);
            //     core.byId("GenidTypeU").setSelectedKey(obj.GEN_TYPE);
            //     core.byId("PidDSAlgU").setSelectedKey(obj.DsAlgorithm);
            //     core.byId("PidOptFctU").setSelectedKey(obj.OptFactor);
            //     core.byId("PidOptAlgU").setSelectedKey(obj.OptAlgorithm);

            // },
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

                if (that.byId("MF_LOCATIONU").getVisible()) {
                    obj.MF_LOCATION_ID.forEach(function (oItem, i) {
                        that.byId("MFLInputU").addToken(
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
                for (var l = 0; l < that.locData.length; l++) {

                    for (var m = 0; m < that.mfData.length; m++) {
                        var data = that.TotalDataUni.filter(el => el.FACTORY_LOC === that.mfData[m] &&
                            el.DEMAND_LOC === that.locData[l]);
                        if (data.length > 0) {
                            that.byId("DlocInputU").addToken(
                                new sap.m.Token({
                                    key: that.mfData[m],
                                    text: that.locData[l],
                                    editable: false,

                                })
                            );
                            var newobj = {
                                mfloc: that.mfData[m],
                                loc: that.locData[l]
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
                //                 that.byId("DlocInputU").addToken(
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



                // if (that.byId("DM_LOCATIONU").getVisible()) {
                //     obj.LOCATION_ID.forEach(function (oItem, i) {
                //         that.byId("DlocInputU").addToken(
                //             new sap.m.Token({
                //                 key: oItem,
                //                 text: oItem,
                //                 editable: false,

                //             })
                //         );

                //     });

                // }

                var tempCprodData = [];
                if (obj.CONFIG_PRODUCT === undefined) {
                    obj.CONFIG_PRODUCT = [];
                }
                that.cProdData = obj.CONFIG_PRODUCT;
                for (var l = 0; l < that.cProdData.length; l++) {

                    for (var m = 0; m < tempLocData.length; m++) {
                        var data = that.TotalDataUni.filter(el => el.FACTORY_LOC === tempLocData[m].mfloc &&
                            el.DEMAND_LOC === tempLocData[m].loc && el.PRODUCT_ID === that.cProdData[l]);
                        if (data.length > 0) {

                            var newobj1 = {
                                mfloc: tempLocData[m].mfloc,
                                loc: tempLocData[m].loc,
                                cProd: that.cProdData[l]
                            }
                            tempCprodData.push(newobj1);
                        }

                    }

                }


                var temp = removeDuplicate(tempCprodData, 'cProd');

                for (var t = 0; t < temp.length; t++) {
                    that.byId("CprodInputU").addToken(
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
                //             that.byId("CprodInputU").addToken(
                //                 new sap.m.Token({
                //                     key: data[0].DEMAND_LOC,
                //                     text: oItem,
                //                     editable: false,

                //                 })
                //             );

                //         });
                // }

                // if (that.byId("CONFIG_PRODUCTU").getVisible()) {
                //     obj.CONFIG_PRODUCT.forEach(function (oItem, i) {
                //         that.byId("CprodInputU").addToken(
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
                for (var l = 0; l < that.pProdData.length; l++) {

                    for (var m = 0; m < tempCprodData.length; m++) {
                        var data = that.TotalDataUni.filter(el => el.FACTORY_LOC === tempCprodData[m].mfloc &&
                            el.DEMAND_LOC === tempCprodData[m].loc && el.REF_PRODID === tempCprodData[m].cProd);
                        if (data.length > 0) {

                            var newobj1 = {
                                mfloc: tempCprodData[m].mfloc,
                                loc: tempCprodData[m].loc,
                                cProd: tempCprodData[m].cProd,
                                pProd: that.pProdData[l]
                            }
                            tempPprodData.push(newobj1);
                        }

                    }

                }

                var temp = removeDuplicate(tempPprodData, 'pProd');

                for (var t = 0; t < temp.length; t++) {
                    if (temp[t].pProd !== "") {
                        that.byId("PprodInputU").addToken(
                            new sap.m.Token({
                                key: temp[t].cProd,
                                text: temp[t].pProd,
                                editable: false,

                            })
                        );
                    }
                }


                // if (that.byId("PARTIAL_PRODUCTU").getVisible()) {
                //     obj.PARTIAL_PRODUCT.forEach(function (oItem, i) {
                //         that.byId("PprodInputU").addToken(
                //             new sap.m.Token({
                //                 key: oItem,
                //                 text: oItem,
                //                 editable: false,

                //             })
                //         );

                //     });

                // }

                // // that.byId("custGrpInputU").setValue(obj.CUSTOMER_GROUP);
                // if(obj.CUSTOMER_GROUP != ""){
                //     obj.CUSTOMER_GROUP = obj.CUSTOMER_GROUP.split(",");
                // if (that.byId("CUSTOMER_GROUPU").getVisible()) {

                //     obj.CUSTOMER_GROUP.forEach(function (oItem, i) {
                //         that.byId("custGrpInputU").addToken(
                //             new sap.m.Token({
                //                 key: oItem,
                //                 text: oItem,
                //                 editable: false,

                //             })
                //         );

                //     });
                // }
                // }


                that.byId("PrePFInputU").setValue(obj.PREDICTION_PROFILE);
                that.byId("ForeAlgInputU").setValue(obj.FORECAST_ALGORITHM);
                that.byId("idverU").setValue(obj.VERSION);
                that.byId("idscenU").setValue(obj.SCENARIO);
                that.byId("classInputU").setValue(obj.CLASS);
                // that.byId("custGrpInputU").setValue(obj.CUSTOMER_GROUP);
                that.byId("FromDateU").setValue(obj.FROM_DATE);
                that.byId("ToDateU").setValue(obj.TO_DATE);
                that.byId("singleDtU").setValue(obj.SINGLE_DATE);
                that.byId("idRollingWeeksU").setValue(obj.Rolling_Timestamp);
                that.byId("idWeeksU").setValue(obj.HISTORY_WEEKS);
                if (obj.CRITICAL_ASSEMBLY === "X" || obj.CRITICAL_ASSEMBLY === "true" || obj.CRITICAL_ASSEMBLY === true) {
                    that.byId("idCriticalU").setSelected(true);
                } else {
                    that.byId("idCriticalU").setSelected(false);
                }
                // if (obj.OVERRIDE_ASSIGNMENT === true || obj.OVERRIDE_ASSIGNMENT === "true") {
                //     that.byId("idOverrideU").setSelected(true);
                // } else {
                //     that.byId("idOverrideU").setSelected(false);
                // }
                if (obj.IMPACT_ANALYSIS === true || obj.IMPACT_ANALYSIS === "true") {
                    that.byId("idImpactU").setSelected(true);
                } else {
                    that.byId("idImpactU").setSelected(false);
                }
                if (obj.DAILY === true || obj.DAILY === "true") {
                    that.byId("idDailyU").setSelected(true);
                } else {
                    that.byId("idDailyU").setSelected(false);
                }

                if (obj.FULL_RUN === true || obj.DAILY === "true") {
                    that.byId("idFullrunU").setSelected(true);
                } else {
                    that.byId("idFullrunU").setSelected(false);
                }

                if (obj.SnapShot === "" || obj.SnapShot === "false") {
                    obj.SnapShot = false;
                } else if (obj.SnapShot === "true") {
                    obj.SnapShot = true;
                }
                if (obj.Rolling === "" || obj.Rolling === "false" || obj.Rolling === false) {
                    obj.Rolling = false;
                } else if (obj.Rolling === "true" || obj.Rolling === true) {
                    obj.Rolling = true;
                    that.byId("idRollingWeeksU").setVisible(true);
                    that.byId("FromDateU").setEditable(false);
                    that.byId("ToDateU").setEditable(false);
                }
                if( obj.SnapShot === "" || obj.SnapShot === false){
                                that.byId("idSnapShotU").setSelected(false);
                                that.byId("idSnapDescU").setVisible(false);
                                that.byId("SnapRU").setVisible(false);
                                that.byId("snapDescU").setVisible(false);
                            } else if (obj.SnapShot === "true" || obj.SnapShot == true || obj.SnapShot == "C") {
                                that.byId("idSnapShotU").setSelected(true);
                                that.byId("SnapRU").setVisible(true);
                                that.byId("idSnapRadioU").setSelectedButton(that.byId("createU"));
                                that.byId("snapDescU").setVisible(true);
                                that.byId("idSnapDescU").setVisible(true);
                            }
                            else if(obj.SnapShot == "U"){
                                that.byId("idSnapShotU").setSelected(true);
                                that.byId("idSnapRadioU").setSelectedButton(that.byId("updateU"));
                                that.byId("snapDescU").setVisible(true);
                                that.byId("idSnapDescU").setVisible(true);
                            }
                that.byId("idSnapDescU").setValue(obj.SnapShot_Desc);
                that.byId("idRollingU").setSelected(obj.Rolling);

                that.byId("idOperatorU").setSelectedKey(obj.OPERATOR);
                that.byId("idModelVerU").setSelectedKey(obj.MODEL_VERSION);
                that.byId("GenidTypeU").setSelectedKey(obj.GEN_TYPE);
                // that.byId("PidDSAlgU").setSelectedKey(obj.DsAlgorithm);
                // that.byId("PidOptFctU").setSelectedKey(obj.OptFactor);
                // that.byId("PidOptAlgU").setSelectedKey(obj.OptAlgorithm);
                if (obj.Optimization === true || obj.Optimization === "true" || obj.Optimizations === true || obj.Optimizations === "true") {
                    that.byId("PidOptimizationU").setSelected(true);
                    that.byId("PidOptProfileU").setEnabled(true);
                } else {
                    that.byId("PidOptimizationU").setSelected(false);
                    that.byId("PidOptProfileU").setEnabled(false);
                }
                that.byId("PidOptProfileU").setSelectedKey(obj.POptProfile);
                that.byId("idOptProfileU").setSelectedKey(obj.OptProfile);

            },

        });
    });