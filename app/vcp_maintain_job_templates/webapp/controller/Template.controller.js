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
 
    return BaseController.extend("vcpapp.vcptemplate.controller.Template", {
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



                // Declaring Value Help Dialogs and Template Dialog.
                this._oCore = sap.ui.getCore();
                if (!this._templateDialog) {
                    this._templateDialog = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.TemplateCreation",
                        this
                    );
                    this.getView().addDependent(this._templateDialog);
                }
                if (!this._templateSelDialog) {
                    this._templateSelDialog = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.TemplateSelection",
                        this
                    );
                    this.getView().addDependent(this._templateSelDialog);
                }

                
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

                 var selType = that.oGModel.getProperty("/type");
                var selKey = that.oGModel.getProperty("/auth");
                that.selectedGroup = that.oGModel.getProperty("/LayerGroup");

                if(selKey === undefined || selType === undefined){
                    that.onBack();
                    return;
                } else {
                that.oModel.setData({
                    results: [],
                  });
                // that.byId("idStepList").setModel(that.oModel);
                // that.byId("idTemp").setValue();
                // that.byId("idTempDesc").setValue();
                // that.byId("idParameter").setVisible(false);
                // // that.byId("idarrow").setVisible(false);
                // // that.byId("idPatern").setSelectedKey("SR");
                // // that.byId("idLableEve").setVisible(false);
                // that.byId("idTemp").setEditable(true);


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


                    

                that.byId("FromDate").setMinDate(new Date());
                that.byId("ToDate").setMinDate(new Date());
                that.byId("ToDate").setEditable(false);
                that.byId("FromDate").$().find('INPUT').attr('disabled', true);
                that.byId("ToDate").$().find('INPUT').attr('disabled', true);

                // // Calling service to get the Location data
                // sap.ui.core.BusyIndicator.show();
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
                //     },
                //     error: function (oData, error) {
                //         sap.ui.core.BusyIndicator.hide();
                //         MessageToast.show("error");
                //     },
                // });


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
                                    "$top": 30000
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
                                      that.byId("PidOptProfile").setModel(that.POptmodel);
                                      that.byId("idOptProfile").setModel(that.Optmodel);
                                      that.byId("PidOptProfile").setSelectedKey(Optimizations[0].PROFILE);
                                      that.byId("idOptProfile").setSelectedKey(Optimizationsnew[0].PROFILE);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });

                that.byId("idStepList").setModel(that.oModel);
                that.byId("idTemp").setValue();
                that.byId("idTempDesc").setValue();
                that.byId("idParameter").setVisible(false);
                // that.byId("idarrow").setVisible(false);
                // that.byId("idPatern").setSelectedKey("SR");
                // that.byId("idLableEve").setVisible(false);
                that.byId("idTemp").setEditable(true);

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
                    this.getView().byId("GenidType").setModel(jmodel);

                if(selType === "C"){
                    that.byId("idTemp").setValue(template + " copy");
                    that.byId("idTempDesc").setValue(templateDesc);
                    that.copyData();
                } else if(selType === "E"){
                    that.byId("idTemp").setValue(template);
                    that.byId("idTempDesc").setValue(templateDesc);
                    that.byId("idTemp").setEditable(false);
                    that.copyData();
                }

                if(selType === "E"){
                    that.byId("idPage").setTitle("Edit Job Template");
                } else {
                    that.byId("idPage").setTitle("New Job Template");
                }

            }
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

            

            moveUp:function(oEvent){
                var aData=sap.ui.getCore().byId("idTabTemplate").getModel().getData().results;
                aData.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                that.TemplateModel.getData().results.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
               var path=Number(sap.ui.getCore().byId("idTabTemplate").getSelectedContextPaths()[0].split("/results/")[1]);
               if(path == 0){
                return;
               }
               var changedItem=aData.splice(path,1);
               aData.splice(path-1,0,changedItem[0]);
                var newpath = path +1;

               that.TemplateModel.getData().results[path - 1].ACT_POSITION = path;
               that.TemplateModel.getData().results[path - 1].counter = path;
               that.TemplateModel.getData().results[path].ACT_POSITION = newpath
               that.TemplateModel.getData().results[path].counter = newpath

            //    that.TempJSON[path - 1].ACT_POSITION = path;
            //    that.TempJSON[path - 1].counter = path;                   
            //    that.TempJSON[path].ACT_POSITION = newpath;                 
            //    that.TempJSON[path].counter = newpath;

               
               

               that.TemplateModel.setData(aData,"/results");
               that.TempJSON = [];
               that.TempJSON = that.TemplateModel.getData().results;

               that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
               that.TempParams[path].ACT_POSITION = path;
               that.TempParams[path].counter = path;                   
               that.TempParams[path - 1].ACT_POSITION = newpath;                 
               that.TempParams[path - 1].counter = newpath;
            
               sap.ui.getCore().byId("idTabTemplate").getSelectedItem().setSelected(false);
               sap.ui.getCore().byId("idTabTemplate").getItems()[path-1].setSelected(true);
            },

            moveDown:function(){
                var aData=sap.ui.getCore().byId("idTabTemplate").getModel().getData().results;
                aData.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                that.TemplateModel.getData().results.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
               var path=Number(sap.ui.getCore().byId("idTabTemplate").getSelectedContextPaths()[0].split("/results/")[1]);
               if(path == aData.length - 1){
                return;
               }
               
               var changedItem=aData.splice(path,1);
               aData.splice(path+1,0,changedItem[0]);

               var paramItem = that.TempParams.splice(path,1);
               that.TempParams.splice(path+1,0,paramItem[0]);


                var newpath = path + 1;
               that.TemplateModel.getData().results[path].ACT_POSITION = newpath;
               that.TemplateModel.getData().results[path].counter = newpath;
            //    that.TempJSON[path].ACT_POSITION = newpath;
            //    that.TempJSON[path].counter = newpath;
                that.TempParams[path].ACT_POSITION = newpath;
                that.TempParams[path].counter = newpath;    
               path = path +1;
               that.TemplateModel.getData().results[path].ACT_POSITION = path + 1;
               that.TemplateModel.getData().results[path].counter = path + 1;
            //    that.TempJSON[path].ACT_POSITION = path + 1 ;
            //    that.TempJSON[path].counter = path + 1 ;
               that.TempParams[path].ACT_POSITION = path + 1 ;
               that.TempParams[path].counter = path + 1 ;

               that.TemplateModel.setData(aData,"/results");
               that.TempJSON = [];
               that.TempJSON = that.TemplateModel.getData().results;   
            //    that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);                     
            
               sap.ui.getCore().byId("idTabTemplate").getSelectedItem().setSelected(false);
               sap.ui.getCore().byId("idTabTemplate").getItems()[path].setSelected(true);
            },

            copyData:function(){
                var template =  that.oGModel.getProperty("/selTemplate");
                that.TempData = [];
                if(template !== ""){
                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").read("/readTemplateItems", {
                    filters: [ new Filter( "TEMPLATE_ID", FilterOperator.EQ, template ),
                    new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")], and:true,
                    success: function (oData) {
                      sap.ui.core.BusyIndicator.hide();

                    oData.results = oData.results.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                    that.TempJSON = oData.results;
                        var counter = 1
                    that.TempJSON.forEach(el => {
                        el.counter = counter;
                        counter = counter + 1;
                    });
                    // To get the user details
                    var User = "";
    
                    if (sap.ushell.Container) {
                        let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                        User = (email) ? email : "";
                    }
                    var Items = sap.ui.getCore().byId("idTabTemplate").getItems();
                    var TempData = [];
    
                    var TempId = that.byId("idTemp").getValue();
                    that.MaxStep = that.TempJSON[that.TempJSON.length - 1].ACT_POSITION
    
                    for(var i=0; i<that.TempJSON.length; i++){
                            var temp = {
                                    TEMPLATE_ID : TempId,
                                    ACTIVITY_ID : that.TempJSON[i].ACTIVITY_ID,
                                    STEP_NAME : that.TempJSON[i].STEP_NAME,
                                    ACT_POSITION : that.TempJSON[i].ACT_POSITION,
                                    MAXSTEP : that.MaxStep,
                                    CREATED_BY : User,
                                    LAYER_CODE : "Private",
                                    LEVEL      : that.TempJSON[i].LEVEL,
                                    counter : that.TempJSON[i].counter

                                };
    
                            var objActivity = {
                                    ACTIVITY_ID : that.TempJSON[i].ACTIVITY_ID,
                                    ACT_POSITION : that.TempJSON[i].ACT_POSITION,
                                    LEVEL       : that.TempJSON[i].LEVEL,
                                    counter : that.TempJSON[i].counter,
                                    newStep : "X",

                                }
                            TempData.push(temp);
                            that.TempParams.push(objActivity);
                            temp = {};
                    }
    
                        that.onTempCancel();
    
                        that.oModel.setData({
                            results: TempData,
                          });
                          that.TempData = TempData;
                        that.byId("idStepList").setModel(that.oModel);
                        that.byId("idStepList").removeSelections(true);
                        that.StepsSelFlag = "X";
                        that.byId("idParameter").setVisible(false);
                        // that.byId("idarrow").setVisible(false);
                        that.getActivityItems();
                        that.getParameterData(that.TempParams);
          
                    },
                    error: function (error) {
                      sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Failed to get data");
                    },
                  });

                }
            },

            getParameterData: function(activity){
                var template =  that.oGModel.getProperty("/selTemplate");
                var copyActivity = activity;

                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").read("/readTemplateItemsParams", {
                             headers: {
                    "x-user-id": that.getUser(),
                    },
                    filters: [new Filter("TEMPLATE_ID", FilterOperator.EQ, template),
                    new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")], and:true,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        // that.TempParams = [];
                        for (var i = 0; i < oData.results.length; i++) {
                            var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === oData.results[i].ACTIVITY_ID &&
                                                                       e.ACT_POSITION === oData.results[i].ACT_POSITION );

                            var test = oData.results[i].PARAMETER_ID;
                                if(test === "LOCATION_ID" || test === "PRODUCT_ID"){
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

                        var obj = {
                            MF_LOCATION_ID: [],
                            LOCATION_ID: [],
                            PRODUCT_ID: [],
                            CONFIG_PRODUCT: [],
                            PARTIAL_PRODUCT:[],
                            PREDICTION_PROFILE: "",
                            FORECAST_ALGORITHM: "",
                            VERSION: "",
                            SCENARIO: "",
                            CUSTOMER_GROUP: "",
                            CLASS: "",
                            CRITICAL_ASSEMBLY: "",
                            IMPACT_ANALYSIS: "",
                            DAILY: "",
                            OVERRIDE_ASSIGNMENT: "",
                            GEN_TYPE: "",
                            MODEL_VERSION: "",
                            FROM_DATE: "",
                            TO_DATE: "",
                            OPERATOR: "",
                            SINGLE_DATE: "",
                            Rolling: "",
                            Rolling_Timestamp: "",
                            FULL_RUN: "",
                            // DsAlgorithm: "",
                            // OptFactor: "",
                            // OptAlgorithm: "",
                            Optimization:"",
                            POptProfile:"",
                            OptProfile:"",
                            SnapShot: "",
                            SnapShot_Desc: "",
                            HISTORY_WEEKS: ""
                        }
                
                        that.JobData = that.TempParams;
                        // that.TempParams =[];
                        
                
                        for (var i = 0; i < that.JobData.length; i++) {
                
                            Object.entries(that.JobData[i]).forEach(x => {
                                var test = x[0];
                
                                if (x[0] !== "TEMPLATE_ID" && x[0] !== "ACTIVITY_ID" && x[0] !== "ACT_POSITION" && x[0] !== "actlevel" && 
                                        x[0] !== "LEVEL" && x[0] !== "counter" && x[0] !== "newStep") {
                
                                        if(x[0] === "MF_LOCATION_ID" || x[0] === "LOCATION_ID" || x[0] === "PRODUCT_ID" || x[0] === "PARTIAL_PRODUCT" || x[0] === "CONFIG_PRODUCT"){
                
                                            if(x[1].length > 0 || x[1] !== ""){
                                                if(x[0] === "PRODUCT_ID" || x[0] === "PARTIAL_PRODUCT" || x[0] === "CONFIG_PRODUCT"){
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
                        obj.PRODUCT_ID = [...new Set(obj.PARTIAL_PRODUCT.filter(item => item !== ""))];
                        var data =[];
                        // obj.PARTIAL_PRODUCT = obj.PRODUCT_ID;
                
                        obj.PRODUCT_ID.forEach(function(el){
                            var data = that.ConfProdall.filter(e=> e.PRODUCT_ID === el);
                            if(data.length>0){
                            obj.CONFIG_PRODUCT.push(data[0].REF_PRODID);
                            }
                           
                        });
                        obj.CONFIG_PRODUCT = [...new Set(obj.CONFIG_PRODUCT.filter(item => item !== ""))];
                
                
                        that.setValues(obj);

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

            },

            setValues: function (obj) {
                
        
                function removeDuplicate(array, key) {
                    var check = new Set();
                    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                }
        
                if (that.byId("MF_LOCATION").getVisible()) {

                    if(obj.MF_LOCATION_ID.length > 0){
                if(obj.MF_LOCATION_ID[0].includes(",") && obj.MF_LOCATION_ID.length === 1){
                    obj.MF_LOCATION_ID = obj.MF_LOCATION_ID[0].split(",");
                } else {
                    var tempMF = obj.MF_LOCATION_ID;
                    for(var s=0; s<tempMF.length; s++){
                        if(tempMF[s].includes(",")){
                            obj.MF_LOCATION_ID = obj.MF_LOCATION_ID.concat(tempMF[s].split(","));
                        } else {
                            var index = obj.MF_LOCATION_ID.findIndex(el=> el === tempMF[s]);
                            if(index === -1){
                            obj.MF_LOCATION_ID = obj.MF_LOCATION_ID.concat(tempMF[s]);
                            }
                        }
                    }
                }

                // var temp = removeDuplicate(tempCprodData, 'cProd');
                    obj.MF_LOCATION_ID.forEach(function (oItem, i) {
                        that.byId("MFLInput").addToken(
                            new sap.m.Token({
                                key: oItem,
                                text: oItem,
                                editable: false,
        
                            })
                        );
        
                    });
                }
            }
        
        
                var tempLocData = [];
                that.mfData = obj.MF_LOCATION_ID;
                // that.locData = obj.LOCATION_ID;
                that.locData = [];
                if(obj.LOCATION_ID.length > 0){
                if(obj.LOCATION_ID[0].includes(",") && obj.LOCATION_ID.length === 1){
                    that.locData = obj.LOCATION_ID[0].split(",");
                } else {
                    var tempLoc = obj.LOCATION_ID;
                    for(var s=0; s<tempLoc.length; s++){
                        if(tempLoc[s].includes(",")){
                            that.locData = that.locData.concat(tempLoc[s].split(","));
                        } else {
                            // that.locData = that.locData.concat(tempLoc[s]);
                            var index = that.locData.findIndex(el=> el === tempLoc[s]);
                            if(index === -1){
                            that.locData = that.locData.concat(tempLoc[s]);
                            }
                        }
                    }
                }
                for(var l=0; l<that.locData.length; l++){
        
                    for(var m=0; m<that.mfData.length; m++){
                        var data = that.TotalDataUni.filter(el=> el.FACTORY_LOC === that.mfData[m] && 
                                                            el.DEMAND_LOC === that.locData[l]);
                        if(data.length > 0){
                            that.byId("DlocInput").addToken(
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
            }
        
        
                var tempCprodData = [];
                if(obj.CONFIG_PRODUCT === undefined){
                    obj.CONFIG_PRODUCT = [];
                }
                that.cProdData = [];
                if(obj.CONFIG_PRODUCT.length > 0){
                if(obj.CONFIG_PRODUCT[0].includes(",") && obj.CONFIG_PRODUCT.length === 1){
                    that.cProdData = obj.CONFIG_PRODUCT[0].split(",");
                } else {
                    for(var s=0; s<obj.CONFIG_PRODUCT.length; s++){
                        if(obj.CONFIG_PRODUCT[s].includes(",")){
                            that.cProdData = that.cProdData.concat(obj.CONFIG_PRODUCT[s].split(","));
                        } else {
                            // that.cProdData = that.cProdData.concat(obj.CONFIG_PRODUCT[s]);
                            var index = that.cProdData.findIndex(el=> el === obj.CONFIG_PRODUCT[s]);
                            if(index === -1){
                                that.cProdData = that.cProdData.concat(obj.CONFIG_PRODUCT[s]);
                            }
                        }
                    }
                }

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
                    that.byId("CprodInput").addToken(
                        new sap.m.Token({
                            key: temp[t].loc,
                            text: temp[t].cProd,
                            editable: false,
        
                        })
                    );
                }

            }
        
        
                var tempPprodData = [];
                that.pProdData = obj.PARTIAL_PRODUCT;
                if(obj.PARTIAL_PRODUCT.length > 0){
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
                    that.byId("PprodInput").addToken(
                        new sap.m.Token({
                            key: temp[t].cProd,
                            text: temp[t].pProd,
                            editable: false,
        
                        })
                    );
                }
            }
                }
        
        
        
                that.byId("PrePFInput").setValue(obj.PREDICTION_PROFILE);
                that.byId("ForeAlgInput").setValue(obj.FORECAST_ALGORITHM);
                that.byId("idver").setValue(obj.VERSION);
                that.byId("idscen").setValue(obj.SCENARIO);
                that.byId("classInput").setValue(obj.CLASS);
                that.byId("custGrpInput").setValue(obj.CUSTOMER_GROUP);
                that.byId("FromDate").setValue(obj.FROM_DATE);
                that.byId("ToDate").setValue(obj.TO_DATE);
                that.byId("singleDt").setValue(obj.SINGLE_DATE);
                that.byId("idRollingWeeks").setValue(obj.Rolling_Timestamp);
                that.byId("idWeeks").setValue(obj.HISTORY_WEEKS);
                if (obj.CRITICAL_ASSEMBLY === "X") {
                    that.byId("idCritical").setSelected(true);
                } else {
                    that.byId("idCritical").setSelected(false);
                }
                if(obj.OVERRIDE_ASSIGNMENT === true || obj.OVERRIDE_ASSIGNMENT === "true"){
                    that.byId("idOverride").setSelected(true);
                } else {
                    that.byId("idOverride").setSelected(false);
                }
                if(obj.IMPACT_ANALYSIS === true || obj.IMPACT_ANALYSIS === "true"){
                    that.byId("idImpact").setSelected(true);
                } else {
                    that.byId("idImpact").setSelected(false);
                }
                if(obj.DAILY === true || obj.DAILY === "true"){
                    that.byId("idDaily").setSelected(true);
                } else {
                    that.byId("idDaily").setSelected(false);
                }

                          
                
                if (obj.SnapShot === "" || obj.SnapShot === "false") {
                    obj.SnapShot = false;
                } else if(obj.SnapShot === "true"){
                    obj.SnapShot = true;
                }
                if (obj.Rolling === "" || obj.Rolling === "false") {
                    obj.Rolling = false;
                } else if(obj.Rolling === "true" ){
                    obj.Rolling = true;
                }
                that.byId("idSnapShot").setSelected(obj.SnapShot);
                that.byId("idSnapDesc").setValue(obj.SnapShot_Desc);
                that.byId("idRolling").setSelected(obj.Rolling);
        
                that.byId("idOperator").setSelectedKey(obj.OPERATOR);
                that.byId("idModelVer").setSelectedKey(obj.MODEL_VERSION);
                that.byId("GenidType").setSelectedKey(obj.GEN_TYPE);
                // that.byId("PidDSAlg").setSelectedKey(obj.DsAlgorithm);
                // that.byId("PidOptFct").setSelectedKey(obj.OptFactor);
                // that.byId("PidOptAlg").setSelectedKey(obj.OptAlgorithm);
                if(obj.FULL_RUN === true || obj.FULL_RUN === "true"){
                  that.byId("idFullrun").setSelected(true);
                    } else {
                    that.byId("idFullrun").setSelected(false);
                }   
                
                            if (obj.Optimizations == "true" || obj.Optimizations == true) {
                                that.byId("PidOptimization").setSelected(true);
                                that.byId("PidOptProfile").setEnabled(true);
                            } else {
                                that.byId("PidOptimization").setSelected(false);
                                that.byId("PidOptProfile").setEnabled(false);
                            }
                            that.byId("PidOptProfile").setSelectedKey(obj.POptProfile);
                            that.byId("idOptProfile").setSelectedKey(obj.OptProfile);
        
            },

            onTempNameChange:function(){
                var TempId = that.byId("idTemp").getValue();
                var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    
                var SChType = specials.test(TempId);
                that.byId("idTemp").setValue(TempId.toUpperCase());
                if (SChType === true) {
                    MessageToast.show("Special characters are not allowed");
                    that.byId("idTemp").setValueState("Error");
                    that.byId("idFooter").setVisible(false);
                } else {

                    that.byId("idTemp").setValueState("None");
                    that.byId("idFooter").setVisible(true);
                }

            },

            // Open the template creation fragment to add the stpes
            onMaintain:function(){
                // that.TempJSON = [];
                var TempId = that.byId("idTemp").getValue();
                // TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
                // TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());
                var specials = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    
                var SChType = specials.test(TempId);
    
                if (SChType === true) {
                    MessageToast.show("Special characters are not allowed");
                    return;
                }

                that.byId("idTemp").setValue(TempId);
                var selType = that.oGModel.getProperty("/type");
                var index = 0;
                if(TempId !== "" && TempId.length < 50){
                    that.TempJSON = $.extend(true, [], that.oModel.oData.results);
                that.TemplateModel.setData({
                        results: that.TempJSON,
                    });
                    sap.ui.getCore().byId("idTabTemplate").setModel(that.TemplateModel);
                    sap.ui.getCore().byId("idTabTemplate").removeSelections(true);

                    if(that.TempJSON.length > 0){
                        that.getParamsData();
                        that.maintainFlag = 'X';
                    } else {
                        that.maintainFlag = '';
                    }
                    sap.ui.core.BusyIndicator.show();
                    that.getModel("JModel").read("/readTemplates", {
                        filters: [
                            new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                        ],
                        success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.Templates = oData.results;
                        var selKey = that.oGModel.getProperty("/auth");
                        if(selKey === "I"){
        
                            var TableData = oData.results.filter(function (aComp) {
                              return aComp.LEVEL === "I" ;
                          });
        
                          that.TemplateModelSel.setData({
                            results: TableData,
                        });
                        sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);
        
                          } else if(selKey === "E"){
                            var TableData = oData.results.filter(function (aComp) {
                              return aComp.LEVEL === "E" ;
                          });
        
                          that.TemplateModelSel.setData({
                            results: TableData,
                        });
                        sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);
        
                          }



                        // that.TemplateModelSel.setData({
                        //     results: oData.results,
                        // });
                        // sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);
                        
                        if(selType !== "E"){
                         index = oData.results.findIndex(e => e.TEMPLATE_ID === TempId);
                        } else {
                            index = -1;
                        }

                        if(index === -1){
                            that._templateDialog.open();
                          
                            that.TempParams.forEach(function(row){
                                row.newStep = "";
                            });
                        } else {
                            MessageToast.show("Given template name is already in use, Please change the name.");
                            }
            
                        },
                        error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                        },
                    });
                } else {
                    MessageToast.show("Please maintain Job Template name which should be length lessthen 50 characters");
                }
            },

            getParamsData:function(){
                that = this;
                var manuLocation = [];
                var demandLocation = [];
                var ConfProd = [];
                var product = [];
                // var demandLocation = core.byId("DlocInputU").getTokens();
                // var product = core.byId("CprodInputU").getTokens();

                // Manufacturing Locations
                if(that.byId("MF_LOCATION").getVisible() === true){
                if (that.byId("MFLInput").getTokens().length > 0) {
                    var maloc = that.byId("MFLInput").getTokens();
                    for (var i = 0; i < maloc.length; i++) {
                        var obj = {
                            FACTORY_LOC: maloc[i].getText()
                        };
                        manuLocation.push(obj);
                    }

                } 
            }

                that.oGModel.setProperty("/manuLocation", manuLocation);

                // Demand Locations
                if(that.byId("DM_LOCATION").getVisible() === true){
                if (that.byId("DlocInput").getTokens().length > 0) {
                    var deLoc = that.byId("DlocInput").getTokens();
                    for (var i = 0; i < deLoc.length; i++) {
                        var obj = {
                            FACTORY_LOC: deLoc[i].getKey(),
                            DEMAND_LOC: deLoc[i].getText(),

                        };
                        demandLocation.push(obj);
                    }
                }
            }

                that.oGModel.setProperty("/demandLocation", demandLocation);

                // Conf Products
                if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                if (that.byId("CprodInput").getTokens().length > 0) {
                    var pro = that.byId("CprodInput").getTokens();
                    for (var i = 0; i < pro.length; i++) {
                        var obj = {
                            DEMAND_LOC: pro[i].getKey(),
                            REF_PRODID: pro[i].getText()
                        };
                        ConfProd.push(obj);                        

                    }
                    
                }
            }
                that.oGModel.setProperty("/ConfProd", ConfProd);

                // Products
                if(that.byId("PARTIAL_PRODUCT").getVisible() === true){
                if (that.byId("PprodInput").getTokens().length > 0) {
                    var pro = that.byId("PprodInput").getTokens();
                    for (var i = 0; i < pro.length; i++) {
                        var obj = {
                            REF_PRODID: pro[i].getKey(),
                            PRODUCT_ID: pro[i].getText()
                        };
                        product.push(obj);
                    }
                }
            }
                that.oGModel.setProperty("/product", product);


                var that = that;
                var otherParams = {

                    PREDICTION_PROFILE: that.byId("PrePFInput").getValue(),
                    FORECAST_ALGORITHM : that.byId("ForeAlgInput").getValue(),
                    VERSION: that.byId("idver").getValue(),
                    SCENARIO: that.byId("idscen").getValue(),
                    CLASS: that.byId("classInput").getValue(),
                    CUSTOMER_GROUP: that.byId("custGrpInput").getValue(),
                    FROM_DATE: that.byId("FromDate").getValue(),
                    TO_DATE: that.byId("ToDate").getValue(),
                    SINGLE_DATE: that.byId("singleDt").getValue(),
                    Rolling_Timestamp: that.byId("idRollingWeeks").getValue(),
                    HISTORY_WEEKS: that.byId("idWeeks").getValue(),
                    OVERRIDE_ASSIGNMENT: that.byId("idOverride").getSelected(),
                    CRITICAL_ASSEMBLY: that.byId("idCritical").getSelected(),
                    IMPACT_ANALYSIS: that.byId("idImpact").getSelected(),
                    DAILY: that.byId("idDaily").getSelected(),
                    SnapShot: that.byId("idSnapShot").getSelected(),
                    SnapShot_Desc: that.byId("idSnapDesc").getValue(),
                    Rolling: that.byId("idRolling").getSelected(),

                    OPERATOR: that.byId("idOperator").getSelectedKey(),
                    MODEL_VERSION: that.byId("idModelVer").getSelectedKey(),
                    GEN_TYPE: that.byId("GenidType").getSelectedKey(),
                    // DsAlgorithm: that.byId("PidDSAlg").getSelectedKey(),
                    // OptFactor: that.byId("PidOptFct").getSelectedKey(),
                    // OptAlgorithm: that.byId("PidOptAlg").getSelectedKey(),
                    FULL_RUN : that.byId("idFullrun").getSelected(),
                    Optimizations : that.byId("PidOptimization").getSelected(),
                    POptProfile:  that.byId("PidOptProfile").getSelectedKey(),
                    OptProfile: that.byId("idOptProfile").getSelectedKey()

                }
                that.oGModel.setProperty("/otherParams", otherParams);



            },

        // Close the template creation fragment
            onTempCancel:function(){
                that._templateDialog.close();
            },

            // Search for the template ID in Template Selection Fragment
            onTemplateSearch:function(oEvent){

                var query = oEvent.getParameter("newValue");
                query = query ? query.trim() : "";
                var oBinding = sap.ui.getCore().byId("idTabTempSel").getBinding("items");
        
                var oFilter = new Filter({
                    filters: [
                        new Filter("TEMPLATE_ID", FilterOperator.Contains, query),
                        new Filter("STEPS", FilterOperator.EQ, query)
                    ],
                    and: false
                });
                oBinding.filter([oFilter]);
        
            },

        // On click on add button in Template Creation Fragment to open Template selection Fragment

            onaddTemp:function(){
                
                sap.ui.getCore().byId("idTempSel").setValue();
                var oBinding = sap.ui.getCore().byId("idTabTempSel").getBinding("items");
                oBinding.filter([]);
                sap.ui.getCore().byId("idTabTempSel").removeSelections(true);
                if(that.oGModel.getProperty("/auth") === "I"){
                    sap.ui.getCore().byId("LayerGroup1").setVisible(true);
                } else if(that.oGModel.getProperty("/auth") === "E"){
                    sap.ui.getCore().byId("LayerGroup1").setVisible(false);
                } else {
                    sap.ui.getCore().byId("LayerGroup1").setVisible(false);
                }
                var selType = that.oGModel.getProperty("/type");

                if((selType === "E" && that.selectedGroup === "E") || (selType === "C" && that.selectedGroup === "E") ){
                    sap.ui.getCore().byId("idLayer1").setEnabled(false);
                    sap.ui.getCore().byId("idLayer1").setSelectedKey("E");

                } else {
                    sap.ui.getCore().byId("idLayer1").setEnabled(true);                    
                    sap.ui.getCore().byId("idLayer1").setSelectedKey("I");
                }

                if((selType === "" || selType === undefined) && that.selectedGroup === "E"){
                    sap.ui.getCore().byId("idLayer1").setSelectedKey("E");
                } else if((selType === "" || selType === undefined) && that.selectedGroup === "I"){
                    sap.ui.getCore().byId("idLayer1").setSelectedKey("I");
                } else if((selType === "" || selType === undefined) && that.selectedGroup === ""){
                    sap.ui.getCore().byId("idLayer1").setSelectedKey(that.oGModel.getProperty("/auth"));
                }

                if(selType === "E" || selType === "C" || sap.ui.getCore().byId("idTabTemplate").getItems().length > 0){
                    sap.ui.getCore().byId("idLayer1").setEnabled(false);
                }
                
                that._templateSelDialog.open();
                that.filterTemplateData();

            },

            // Close the template selection fragment
            onSelCancel:function(){
                that._templateSelDialog.close();
            },

            onLayerCode1:function(oEvent){
                var preSelItem = oEvent.getParameters().previousSelectedItem.getKey();
                var selKey = sap.ui.getCore().byId("idLayer1").getSelectedKey();
                var temp = sap.ui.getCore().byId("idTabTemplate").getItems();
                var selType = that.oGModel.getProperty("/type");
                var refreshFlag = "";
                if(preSelItem !== selKey){
                if(temp.length !== 0 && selType === ""){
                    refreshFlag = "X";
                } else {
                    refreshFlag = "";
                }

                if(refreshFlag === "X"){
                var sText =  "If you change the group selected items will be lost. do you want to continue.?";
                      sap.m.MessageBox.warning(sText, {
                        title: "Information",
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        onClose: function (oAction) {
                          if(oAction === sap.m.MessageBox.Action.YES){

                            that.TemplateModel.setData({
                                results: [],
                              });
                              sap.ui.getCore().byId("idTabTemplate").setModel(that.TemplateModel);
                              that.TempJSON = [];
                            that.filterTemplateData();
                          } else {
                            sap.ui.getCore().byId("idLayer1").setSelectedKey(preSelItem);
                          }
                        }
                      })

                    }


                    if(refreshFlag === ""){
                        that.filterTemplateData();
                }
            }
                
            },


            filterTemplateData:function(){
                var selKey = sap.ui.getCore().byId("idLayer1").getSelectedKey();
                  var tempdata = that.Templates;
                  if(selKey === "I"){

                    var TableData = tempdata.filter(function (aComp) {
                      return aComp.LEVEL === "I" ;
                  });

                //   that.TemplateModelSel.setData({
                //     results: TableData,
                // });
                // sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);

                  } else if(selKey === "E"){
                    var TableData = tempdata.filter(function (aComp) {
                      return aComp.LEVEL === "E" ;
                  });

                //   that.TemplateModelSel.setData({
                //     results: TableData,
                // });
                // sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);

                  }

                  that.TemplateModelSel.setData({
                    results: TableData,
                });
                sap.ui.getCore().byId("idTabTempSel").setModel(that.TemplateModelSel);

            },

            // Getting steps for the selected template from the template selection
            onJobTemSel:function(oEvent){
                sap.ui.getCore().byId("idTempSel").setValue();
                var oBinding = sap.ui.getCore().byId("idTabTempSel").getBinding("items");
                oBinding.filter([]);
                var SelValue = sap.ui.getCore().byId("idTabTempSel").getSelectedItems();
                that.TemplateItems = [];
                var oFilters = [];
                var aData = that.TemplateModel.oData.results;
                var frozenflag = "";

                that.selectedGroup = sap.ui.getCore().byId("idLayer1").getSelectedKey();
                
                if(SelValue.length > 0){
                for(var i=0; i<SelValue.length; i++){
                    if((SelValue[i].getCells()[0].getText() === "DYNAMIC_FROZEN" && SelValue.length > 1) 
                    || (SelValue[i].getCells()[0].getText() === "DYNAMIC_FROZEN" && that.TempJSON.length > 0 )){
                         frozenflag = "X";
                    } else if((SelValue[i].getCells()[0].getText() === "GENERATE_SEEDORDER" && SelValue.length > 1) 
                    || (SelValue[i].getCells()[0].getText() === "GENERATE_SEEDORDER" && that.TempJSON.length > 0 ) ){
                        frozenflag = "X";
                    }
                    var sFilter = new sap.ui.model.Filter({
                        path: "TEMPLATE_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: SelValue[i].getCells()[0].getText(),
                    });
                    oFilters.push(sFilter);
                }
                var sFilter = new sap.ui.model.Filter({
                    path: "VARIANT_NAME",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: "NA",
                });
                oFilters.push(sFilter);
                if(frozenflag === ""){
                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").read("/readTemplateItems", {
                    filters : oFilters,
                    success: function (oData) {
                      sap.ui.core.BusyIndicator.hide();

                      that.onSelCancel();
                      for(var i=0; i<oData.results.length; i++){
                        that.TemplateItems.push(oData.results[i]);
                      }
                      
                      that.updateTemplateItems(that.TemplateItems);
          
                    },
                    error: function (error) {
                      sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Failed to get data");
                    },
                  });
                } else {
                    MessageToast.show("You cannot add Dynamic Frozen/Firm (OR) Generate SeedOrder with other activites");
                    sap.ui.getCore().byId("idTabTempSel").removeSelections(true);
                }
                } else {
                    MessageToast.show("Select an activity to add");
                }
            
            },


            // adding selected template steps to the new template steps in template creation fragment 
            updateTemplateItems:function(items){
                var Items = items;
                if(that.TempJSON.length === 0){
                    var step = 1;
                } else {
                var step = that.TempJSON.length + 1;
                }
                var counter = Math.max(...that.TempJSON.map(o => o.counter));
                if(counter === -Infinity){
                    counter = 0;
                }
                for(var i=0; i<Items.length; i++){
                    counter = counter + 1;
                    var tempData = that.TempJSON.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === Items[i].ACTIVITY_ID ;
                    });
                    var activityLevel = 0;

                    if(tempData.length > 0){
                        activityLevel = tempData.length;
                    }
                        
                    var obj = {
                        ACT_POSITION: step,
                        STEP_NAME : Items[i].STEP_NAME,
                        ACTIVITY_ID : Items[i].ACTIVITY_ID,
                        counter  : counter,
                        LEVEL    : Items[i].LEVEL,
                        actlevel : activityLevel
                    };
                    that.TempJSON.push(obj);

                    var objActivity = {
                        ACTIVITY_ID : Items[i].ACTIVITY_ID,
                        ACT_POSITION : step,
                        LEVEL      : Items[i].LEVEL,
                        newStep : "X",
                        counter :  counter,
                        actlevel : activityLevel
                    };

                    that.TempParams.push(objActivity);

                    step = step + 1;
                    

                }

                that.TemplateModel.setData({
                    results: that.TempJSON,
                  });
                  sap.ui.getCore().byId("idTabTemplate").setModel(that.TemplateModel);
                  sap.ui.getCore().byId("idTabTemplate").removeSelections(true);

            },

            onRemoveActivity:function(oEvent){
                var selected = oEvent.getSource().getParent().getCells()[2].getText();
                var selStep = parseInt(oEvent.getSource().getParent().getCells()[0].getText());
                var index = that.TempJSON.findIndex(e => e.ACTIVITY_ID === selected && e.ACT_POSITION === selStep);
                var value = that.TempParams.findIndex(e => e.ACTIVITY_ID === selected && e.ACT_POSITION === selStep);

               that.TempJSON.splice(index, 1);
               if(value !== -1){
                    that.TempParams.splice(value, 1);
               }
               for(var i=index; i<that.TempJSON.length; i++){
                that.TempJSON[i].ACT_POSITION = that.TempJSON[i].ACT_POSITION - 1;           
                that.TempJSON[i].counter = that.TempJSON[i].counter - 1;           
               }

               for(var i=index; i<that.TempParams.length; i++){   
                that.TempParams[i].ACT_POSITION = that.TempParams[i].ACT_POSITION - 1;              
                that.TempParams[i].counter = that.TempParams[i].counter - 1;                 
               }

               that.TempJSON.forEach(function (oItem) {
                oItem.MAXSTEP = that.TempJSON.length;
            });

               that.TemplateModel.setData({
                results: that.TempJSON,
              });
              sap.ui.getCore().byId("idTabTemplate").setModel(that.TemplateModel);
                

            },

            // saving the template with steps and closing fragment
            onsaveJobTemp:function(oEvent){

                var parameters = that.TempParams;
                var aData = that.TemplateModel.oData.results;
                // To get the user details
                var User = "";
                that.TempData = [];

                if (sap.ushell.Container) {
                    let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                    User = (email) ? email : "";
                }
                var Items = sap.ui.getCore().byId("idTabTemplate").getItems();
                var TempData = [];

                var TempId = that.byId("idTemp").getValue();
                // TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
                TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());
                if(aData.length > 0){
                that.MaxStep = aData[aData.length - 1].ACT_POSITION
                } else {
                    that.MaxStep = 0;
                }

                var TempParamData = that.TempParams;
                that.TempParams = [];
                
                for(var i=0; i<aData.length; i++){
                    
                        var temp = {
                                TEMPLATE_ID : TempId,
                                ACTIVITY_ID : aData[i].ACTIVITY_ID,
                                STEP_NAME : aData[i].STEP_NAME,
                                ACT_POSITION : aData[i].ACT_POSITION,
                                MAXSTEP : that.MaxStep,
                                CREATED_BY : User,
                                LAYER_CODE : "Private",
                                LEVEL      : aData[i].LEVEL,
                                counter : aData[i].counter
                            };
                            var counter = aData[i].counter;
                        var objActivity = {
                                ACTIVITY_ID : aData[i].ACTIVITY_ID,
                                ACT_POSITION : aData[i].ACT_POSITION,
                                LEVEL      : aData[i].LEVEL,
                                newStep : "X",
                                counter :  aData[i].counter
                            };
                        TempData.push(temp);


                        // var data = TempParamData.filter(function (aComp) {
                        //     return aComp.ACTIVITY_ID === aData[i].ACTIVITY_ID ;
                        // });


                //         if(data.length === 1){
                //         var index = TempParamData.findIndex(e => e.ACTIVITY_ID === aData[i].ACTIVITY_ID && 
                //                                                  e.counter === aData[i].counter);
                        
                //     if(index === -1){
                //         that.TempParams.push(objActivity);
                //     } else {
                //         that.TempParams.push(TempParamData[index]);
                //     }
                // } else {

                // }




                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === aData[i].ACTIVITY_ID && 
                                                                e.counter === aData[i].counter);
                    if(index === -1){
                        

                        var paramIndex = TempParamData.findIndex(e => e.ACTIVITY_ID === aData[i].ACTIVITY_ID && 
                                                                 e.counter === aData[i].counter);
                    //     if(paramIndex !== -1){
                    //     for(var temp = paramIndex; temp<that.TempParams.length; temp++){
                    //         that.TempParams[temp].ACT_POSITION = that.TempParams[temp].ACT_POSITION + 1;
                    //         that.TempParams[temp].counter = that.TempParams[temp].counter + 1;
                    //     }
                    // }
                    if(paramIndex !== -1){ 
                        that.TempParams.push(TempParamData[paramIndex]);

                    } else {
                        that.TempParams.push(objActivity);
                    }
                        that.TempParams = that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION );
                        
                    }
                        temp = {};
                        objActivity = {};
                }

                    that.onTempCancel();
                    TempData = TempData.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION );

                    TempData.forEach(el => {
                        var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === el.ACTIVITY_ID && 
                                                                   e.counter === el.counter);

                        that.TempParams[index].ACT_POSITION = el.ACT_POSITION;                                                                   
                    });


                    that.oModel.setData({
                        results: TempData,
                      });
                      that.TempData = TempData;
                    that.byId("idStepList").setModel(that.oModel);
                    that.byId("idStepList").removeSelections(true);
                    that.StepsSelFlag = "X";
                    // that.byId("idParameter").setVisible(false);
                    // that.byId("idarrow").setVisible(false);
                    that.onActivityPress();
                    that.getActivityItems();

            },
            
            // Reading service to get the steps activity(like single select or multi select)
            getActivityItems:function(){
                sap.ui.core.BusyIndicator.show();
                that.getModel("JModel").read("/readActivityItems", {
                    // filters: [ new Filter( "TEMPLATE_ID", FilterOperator.EQ, SelValue )
                    //         ],
                    filters: [ new Filter( "PARAMETER_ID", FilterOperator.NE, "" )
                        ],
                    success: function (oData) {
                      sap.ui.core.BusyIndicator.hide();

                      that.ActivityItems = oData.results;

                        // for(var i= 0 ; i<that.TempParams.length; i++){
                //         var temp = that.ActivityItems.filter(function (aComp) {
                //             return aComp.ACTIVITY_ID === that.TempParams[i].ACTIVITY_ID ;
                //         });
                //         if(that.TempParams[i].newStep === "X"){
                //         for(var j=0; j<temp.length; j++){
                //             if(temp[j].PARAMETER_ID.includes("MF_LOCATION")){
                //                 that.TempParams[i].MF_LOCATION_ID = "";
                //             } else if(temp[j].PARAMETER_ID.includes("DM_LOCATION")){
                //                 that.TempParams[i].LOCATION_ID = "";
                //             } else if(temp[j].PARAMETER_ID.includes("PRODUCT")){
                //                 that.TempParams[i].PRODUCT_ID = "";
                //             } else if(temp[j].PARAMETER_ID.includes("MODEL_VERSION")){
                //                 that.TempParams[i].MODEL_VERSION = "Active";
                //             } else if(temp[j].PARAMETER_ID.includes("PREDICTION_PROFILE")){
                //                 that.TempParams[i].PREDICTION_PROFILE = "";
                //             } else if(temp[j].PARAMETER_ID.includes("VERSION")){
                //                 // if(that.TempParams[i].ACTIVITY_ID !== "PUBLISH_FORECAST_ORDERS"){
                //                     that.TempParams[i].VERSION = "";
                //                 // } else {
                //                 //     that.TempParams[i].VERSION = "__BASELINE";
                //                 // }
                //             } else if(temp[j].PARAMETER_ID.includes("SCENARIO")){
                                
                //                 // if(that.TempParams[i].ACTIVITY_ID !== "PUBLISH_FORECAST_ORDERS"){
                //                     that.TempParams[i].SCENARIO = "";
                //                 // } else {
                //                 //     that.TempParams[i].SCENARIO = "_PLAN";
                //                 // }
                //             } else if(temp[j].PARAMETER_ID.includes("CLASS")){
                //                 that.TempParams[i].CLASS = "";
                //             } else if(temp[j].PARAMETER_ID.includes("CUSTOMER_GROUP")){
                //                 that.TempParams[i].CUSTOMER_GROUP = "";
                //             }  else if(temp[j].PARAMETER_ID.includes("GEN_TYPE")){
                //                 that.TempParams[i].GEN_TYPE = "OD";
                //             } else if(temp[j].PARAMETER_ID.includes("OVERRIDE_ASSIGNMENT")){
                //                 that.TempParams[i].OVERRIDE_ASSIGNMENT = false;
                //             } else if(temp[j].PARAMETER_ID.includes("CRITICAL_ASSEMBLY")){
                //                 that.TempParams[i].CRITICAL_ASSEMBLY = false;
                //             } else if(temp[j].PARAMETER_ID.includes("IMPACT_ANALYSIS")){
                //                 that.TempParams[i].IMPACT_ANALYSIS = false;
                //             } else if(temp[j].PARAMETER_ID.includes("DAILY")){
                //                 that.TempParams[i].DAILY = false;
                //             } else if(temp[j].PARAMETER_ID.includes("OPERATOR")){
                //                 that.TempParams[i].OPERATOR = "BT";
                //             } else if(temp[j].PARAMETER_ID.includes("DATE_RANGE")){
                //                 that.TempParams[i].FROM_DATE = "";
                //                 that.TempParams[i].TO_DATE = "";
                //             } else if(temp[j].PARAMETER_ID.includes("SINGLE_DATE")){
                //                 that.TempParams[i].SINGLE_DATE = "";
                //             } else if(temp[j].PARAMETER_ID.includes("Rolling_Timestamp")){
                //                 that.TempParams[i].Rolling_Timestamp = "";
                //                 that.TempParams[i].Rolling = "";
                //             } else if(temp[j].PARAMETER_ID.includes("OptAlgorithm")){
                //                 that.TempParams[i].OptAlgorithm = "None";
                //             } else if(temp[j].PARAMETER_ID.includes("OptFactor")){
                //                 that.TempParams[i].OptFactor = 0.9;
                //             } else if(temp[j].PARAMETER_ID.includes("DsAlgorithm")){
                //                 that.TempParams[i].DsAlgorithm = "None";
                //             } else if(temp[j].PARAMETER_ID.includes("SnapShot")){
                //                 that.TempParams[i].SnapShot = "";
                //                 that.TempParams[i].SnapShot_Desc = "";
                //             }

                //         }
                //     }

                // }

                that.onCommonParams();
                if(that.maintainFlag === 'X'){
                    that.setData();
                }
          
                    },
                    error: function (error) {
                      sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Failed to get data");
                    },
                  });

            },


            onCommonParams:function(){

                that.byId("idParameter").setVisible(true);
                // Inputs Visible
                that.byId("MF_LOCATION").setVisible(false);
                that.byId("DM_LOCATION").setVisible(false);
                that.byId("CONFIG_PRODUCT").setVisible(false);
                that.byId("PARTIAL_PRODUCT").setVisible(false);
                that.byId("MODEL_VERSION").setVisible(false);
                that.byId("PREDICTION_PROFILE").setVisible(false);
                that.byId("FORECAST_ALGORITHM").setVisible(false);
                that.byId("VERSION").setVisible(false);
                that.byId("SCENARIO").setVisible(false);
                that.byId("CLASS").setVisible(false);
                that.byId("CUSTOMER_GROUP").setVisible(false);
                that.byId("GEN_TYPE").setVisible(false);
                that.byId("DATE_RANGE").setVisible(false);
                that.byId("SINGLE_DATE").setVisible(false);
                that.byId("OPERATOR").setVisible(false);
                that.byId("idRollingWeeks").setVisible(false);
                that.byId("Rolling_Timestamp").setVisible(false);
                that.byId("OVERRIDE_ASSIGNMENT").setVisible(false);
                that.byId("CRITICAL_ASSEMBLY").setVisible(false);
                that.byId("IMPACT_ANALYSIS").setVisible(false);
                that.byId("DAILY").setVisible(false);
                // that.byId("OptAlgorithm").setVisible(false);
                // that.byId("OptFactor").setVisible(false);
                // that.byId("DsAlgorithm").setVisible(false);
                that.byId("SnapShot").setVisible(false);
                that.byId("SnapR").setVisible(false);
                that.byId("snapDesc").setVisible(false);
                that.byId("HISTORY_WEEKS").setVisible(false);
                that.byId("FULL_RUN").setVisible(false);
                that.byId("Optimization").setVisible(false);
                that.byId("POptProfile").setVisible(false);
                that.byId("OptProfile").setVisible(false);

                that.byId("MFLInput").setValue();
                that.byId("DlocInput").setValue();
                that.byId("CprodInput").setValue();
                that.byId("PprodInput").setValue();
                // that.byId("MODEL_VERSION").setValue();
                that.byId("PrePFInput").setValue();
                that.byId("ForeAlgInput").setValue();
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
                that.byId("idFullrun").setSelected(false);
                that.byId("idSnapShot").setSelected(false);
                that.byId("idRolling").setSelected(false);

                that.byId("CprodInput").removeAllTokens();
                that.byId("DlocInput").removeAllTokens();
                that.byId("PprodInput").removeAllTokens();
                that.byId("MFLInput").removeAllTokens();

                var params = [];
                that.params = [];
                that.TempParams.sort((a, b) => a.ACT_POSITION - b.ACT_POSITION);
                var tempData = that.TempParams;

                var aData = that.ActivityItems;
                var temp = [];
                for (var t = 0; t < tempData.length; t++) {

                    temp = aData.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === tempData[t].ACTIVITY_ID;
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
                    if (el.PARAMETER_ID !== "" && el.PARAMETER_ID !== " " && el.PARAMETER_ID !== undefined && el.PARAMETER_ID !== null ) {
                        var id = el.PARAMETER_ID

                        that.byId(id).setVisible(true);

                    }
                });

                var tempdata = that.Parameters.filter(el => el.PARAMETER_ID === "CONFIG_PRODUCT" ||  el.PARAMETER_ID === "PARTIAL_PRODUCT");
                if (tempdata.length > 0) {
                    that.byId("PARTIAL_PRODUCT").setVisible(true);
                    that.byId("CONFIG_PRODUCT").setVisible(true);
                }

                var tempdata = that.Parameters.filter(el => el.PARAMETER_ID === "MF_LOCATION" ||  el.PARAMETER_ID === "DM_LOCATION");
                if (tempdata.length > 0) {
                    that.byId("MF_LOCATION").setVisible(true);
                    that.byId("DM_LOCATION").setVisible(true);
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
                    CUSTOMER_GROUP: otherparams.CUSTOMER_GROUP,
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
                    FULL_RUN: otherparams.FULL_RUN,
                    Optimization: otherparams.Optimization,
                    POptProfile: otherparams.POptProfile,
                    OptProfile: otherparams.OptProfile,
                    SnapShot: otherparams.SnapShot,
                    SnapShot_Desc: otherparams.SnapShot_Desc,
                    HISTORY_WEEKS: otherparams.HISTORY_WEEKS
                }

                that.byId("PrePFInput").setValue(obj.PREDICTION_PROFILE);
                that.byId("ForeAlgInput").setValue(obj.FORECAST_ALGORITHM);
                that.byId("idver").setValue(obj.VERSION);
                that.byId("idscen").setValue(obj.SCENARIO);
                that.byId("classInput").setValue(obj.CLASS);
                that.byId("custGrpInput").setValue(obj.CUSTOMER_GROUP);
            
                // that.byId("GenidType").setValue(obj.GEN_TYPE);
                that.byId("FromDate").setValue(obj.FROM_DATE);
                that.byId("ToDate").setValue(obj.TO_DATE);
                that.byId("singleDt").setValue(obj.SINGLE_DATE);
                that.byId("idRollingWeeks").setValue(obj.Rolling_Timestamp);
                that.byId("GenidType").setSelectedKey(obj.GEN_TYPE);
                that.byId("idModelVer").setSelectedKey(obj.MODEL_VERSION);
                that.byId("idOperator").setSelectedKey(obj.OPERATOR);
                // that.byId("PidDSAlg").setSelectedKey(obj.DsAlgorithm);
                // that.byId("PidOptAlg").setSelectedKey(obj.OptAlgorithm);
                // that.byId("PidOptFct").setSelectedKey(obj.OptFactor);

                

                that.byId("idOverride").setSelected(obj.OVERRIDE_ASSIGNMENT);
                that.byId("idCritical").setSelected(obj.CRITICAL_ASSEMBLY);
                that.byId("idImpact").setSelected(obj.IMPACT_ANALYSIS);
                that.byId("idDaily").setSelected(obj.DAILY);
                that.byId("idRolling").setSelected(obj.Rolling);
                that.byId("idSnapShot").setSelected(obj.SnapShot);
                that.byId("idSnapDesc").setValue(obj.SnapShot_Desc);
                that.byId("idWeeks").setValue(obj.idWeeks);
               
                    that.byId("idFullrun").setSelected(obj.FULL_RUN);
                    that.byId("PidOptimization").setSelected(obj.Optimization);
                    that.byId("PidOptProfile").setSelectedKey(obj.POptProfile);
                    that.byId("idOptProfileV").setSelectedKey(obj.OptProfile);
                
                            

                


                var MFdata = that.oGModel.getProperty("/manuLocation");
                var DLdata = that.oGModel.getProperty("/demandLocation");
                var CPdata = that.oGModel.getProperty("/ConfProd");
                var PPdata = that.oGModel.getProperty("/product");

                if (that.byId("MF_LOCATION").getVisible()) {
                    MFdata.forEach(function (oItem, i) {
                        that.byId("MFLInput").addToken(
                            new sap.m.Token({
                                key: oItem.FACTORY_LOC,
                                text: oItem.FACTORY_LOC,
                                editable: false,
                            })
                        );        
                    });
                }

                if (that.byId("DM_LOCATION").getVisible()) {
                    DLdata.forEach(function (oItem, i) {
                        that.byId("DlocInput").addToken(
                            new sap.m.Token({
                                key: oItem.FACTORY_LOC,
                                text: oItem.DEMAND_LOC,
                                editable: false,
                            })
                        );        
                    });
                }

                if (that.byId("CONFIG_PRODUCT").getVisible()) {
                    CPdata.forEach(function (oItem, i) {
                        that.byId("CprodInput").addToken(
                            new sap.m.Token({
                                key: oItem.DEMAND_LOC,
                                text: oItem.REF_PRODID,
                                editable: false,
                            })
                        );        
                    });
                }

                if (that.byId("PARTIAL_PRODUCT").getVisible()) {
                    PPdata.forEach(function (oItem, i) {
                        that.byId("PprodInput").addToken(
                            new sap.m.Token({
                                key: oItem.REF_PRODID,
                                text: oItem.PRODUCT_ID,
                                editable: false,
                            })
                        );        
                    });
                }

            },


             // Highlighting the inputs on selection of step.
        onActivityPress: function (oEvent) {
            var params = [];
            if (oEvent) {
                var selected = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText().trim();
                params = that.params.filter(el => el.ACTIVITY_ID === selected);
            }

            that.byId("MF_LOCATION").getLabelControl().removeStyleClass("addBorder");
            that.byId("DM_LOCATION").getLabelControl().removeStyleClass("addBorder");
            that.byId("CONFIG_PRODUCT").getLabelControl().removeStyleClass("addBorder");
            that.byId("PARTIAL_PRODUCT").getLabelControl().removeStyleClass("addBorder");
            that.byId("MODEL_VERSION").getLabelControl().removeStyleClass("addBorder");
            that.byId("PREDICTION_PROFILE").getLabelControl().removeStyleClass("addBorder");
            that.byId("FORECAST_ALGORITHM").getLabelControl().removeStyleClass("addBorder");
            that.byId("VERSION").getLabelControl().removeStyleClass("addBorder");
            that.byId("SCENARIO").getLabelControl().removeStyleClass("addBorder");
            that.byId("CLASS").getLabelControl().removeStyleClass("addBorder");
            that.byId("CUSTOMER_GROUP").getLabelControl().removeStyleClass("addBorder");
            that.byId("GEN_TYPE").getLabelControl().removeStyleClass("addBorder");
            that.byId("DATE_RANGE").getLabelControl().removeStyleClass("addBorder");
            that.byId("SINGLE_DATE").getLabelControl().removeStyleClass("addBorder");
            that.byId("OPERATOR").getLabelControl().removeStyleClass("addBorder");
            //   that.byId("idRollingWeeks").getLabelControl().removeStyleClass("addBorder");
            that.byId("Rolling_Timestamp").getLabelControl().removeStyleClass("addBorder");
            that.byId("OVERRIDE_ASSIGNMENT").getLabelControl().removeStyleClass("addBorder");
            that.byId("CRITICAL_ASSEMBLY").getLabelControl().removeStyleClass("addBorder");
            that.byId("IMPACT_ANALYSIS").getLabelControl().removeStyleClass("addBorder");
            that.byId("DAILY").getLabelControl().removeStyleClass("addBorder");
            // that.byId("OptAlgorithm").getLabelControl().removeStyleClass("addBorder");
            // that.byId("OptFactor").getLabelControl().removeStyleClass("addBorder");
            // that.byId("DsAlgorithm").getLabelControl().removeStyleClass("addBorder");
            that.byId("SnapShot").getLabelControl().removeStyleClass("addBorder");
            that.byId("SnapR").getLabelControl().removeStyleClass("addBorder");
            that.byId("snapDesc").getLabelControl().removeStyleClass("addBorder");
            that.byId("HISTORY_WEEKS").getLabelControl().removeStyleClass("addBorder");

            that.byId("FULL_RUN").getLabelControl().removeStyleClass("addBorder");
                    
                    that.byId("Optimization").getLabelControl().removeStyleClass("addBorder");
                   
                    that.byId("POptProfile").getLabelControl().removeStyleClass("addBorder");
                    
                    that.byId("OptProfile").getLabelControl().removeStyleClass("addBorder");

            for (var i = 0; i < params.length; i++) {

                switch (params[i].PARAMETER_ID) {
                case "MF_LOCATION":
                    that.byId("MF_LOCATION").getLabelControl().addStyleClass("addBorder");
                    that.byId("DM_LOCATION").getLabelControl().addStyleClass("addBorder");
                    break;
                case "DM_LOCATION":
                    that.byId("DM_LOCATION").getLabelControl().addStyleClass("addBorder");
                    that.byId("MF_LOCATION").getLabelControl().addStyleClass("addBorder");

                    break;
                case "CONFIG_PRODUCT":
                case "PARTIAL_PRODUCT":
                    that.byId("CONFIG_PRODUCT").getLabelControl().addStyleClass("addBorder");
                    that.byId("PARTIAL_PRODUCT").getLabelControl().addStyleClass("addBorder");
                    break;
                case "MODEL_VERSION":
                    that.byId("MODEL_VERSION").getLabelControl().addStyleClass("addBorder");
                    break;
                case "PREDICTION_PROFILE":
                    that.byId("PREDICTION_PROFILE").getLabelControl().addStyleClass("addBorder");
                    break;
                case "FORECAST_ALGORITHM":
                    that.byId("FORECAST_ALGORITHM").getLabelControl().addStyleClass("addBorder");
                    break;
                case "VERSION":
                    that.byId("VERSION").getLabelControl().addStyleClass("addBorder");
                    break;
                case "SCENARIO":
                    that.byId("SCENARIO").getLabelControl().addStyleClass("addBorder");
                    break;
                case "CLASS":
                    that.byId("CLASS").getLabelControl().addStyleClass("addBorder");
                    break;
                case "CUSTOMER_GROUP":
                    that.byId("CUSTOMER_GROUP").getLabelControl().addStyleClass("addBorder");
                    break;
                case "GEN_TYPE":
                    that.byId("GEN_TYPE").getLabelControl().addStyleClass("addBorder");
                    break;
                case "DATE_RANGE":
                    that.byId("DATE_RANGE").getLabelControl().addStyleClass("addBorder");
                    break;
                case "OPERATOR":
                    that.byId("OPERATOR").getLabelControl().addStyleClass("addBorder");
                    break;
                case "Rolling_Timestamp":
                    that.byId("Rolling_Timestamp").getLabelControl().addStyleClass("addBorder");
                    break;
                case "OVERRIDE_ASSIGNMENT":
                    that.byId("OVERRIDE_ASSIGNMENT").getLabelControl().addStyleClass("addBorder");
                    break;
                case "CRITICAL_ASSEMBLY":
                    that.byId("CRITICAL_ASSEMBLY").getLabelControl().addStyleClass("addBorder");
                    break;
                case "IMPACT_ANALYSIS":
                    that.byId("IMPACT_ANALYSIS").getLabelControl().addStyleClass("addBorder");
                    break;
                case "DAILY":
                    that.byId("DAILY").getLabelControl().addStyleClass("addBorder");
                    break;
                // case "OptAlgorithm":
                //     that.byId("OptAlgorithm").getLabelControl().addStyleClass("addBorder");
                //     break;
                // case "OptFactor":
                //     that.byId("OptFactor").getLabelControl().addStyleClass("addBorder");
                //     break;
                // case "DsAlgorithm":
                //     that.byId("DsAlgorithm").getLabelControl().addStyleClass("addBorder");
                //     break;
                case "SnapShot":
                    that.byId("SnapShot").getLabelControl().addStyleClass("addBorder");
                    break;
                case "SnapR":
                    that.byId("SnapR").getLabelControl().addStyleClass("addBorder");
                    break;
                case "snapDesc":
                    that.byId("snapDesc").getLabelControl().addStyleClass("addBorder");
                    break;
                case "HISTORY_WEEKS":
                    that.byId("HISTORY_WEEKS").getLabelControl().addStyleClass("addBorder");
                    break;
                case "FULL_RUN":
                    that.byId("FULL_RUN").getLabelControl().addStyleClass("addBorder");
                    break;
                case "Optimization":
                    that.byId("Optimization").getLabelControl().addStyleClass("addBorder");
                    break;
                case "POptProfile":
                    that.byId("POptProfile").getLabelControl().addStyleClass("addBorder");
                    break;
                case "OptProfile":
                    that.byId("OptProfile").getLabelControl().addStyleClass("addBorder");
                    break;
                }
            }

        },

            // Changing the parameters tab based on selected step in view
            onStepName:function(oEvent){
                // // if(oEvent){
                    var object = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject();
                var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
                var step = that.byId("idStepList").getSelectedItems()[0].getCells();
                var counter = object.counter;
                
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
                that.byId("OPERATOR").setVisible(false);
                that.byId("DATE_RANGE").setVisible(false);
                that.byId("SINGLE_DATE").setVisible(false);
                that.byId("Rolling_Timestamp").setVisible(false);
                that.byId("OVERRIDE_ASSIGNMENT").setVisible(false);
                that.byId("CRITICAL_ASSEMBLY").setVisible(false);
                that.byId("IMPACT_ANALYSIS").setVisible(false);
                that.byId("DAILY").setVisible(false);
                // that.byId("OptAlgorithm").setVisible(false);
                // that.byId("OptFactor").setVisible(false);
                // that.byId("DsAlgorithm").setVisible(false);
                that.byId("SnapShot").setVisible(false);
                that.byId("SnapR").setVisible(false);
                that.byId("snapDesc").setVisible(false);
                that.byId("FULL_RUN").setVisible(false);
                that.byId("Optimization").setVisible(false);
                that.byId("POptProfile").setVisible(false);
                that.byId("OptProfile").setVisible(false);

                that.byId("MFLInput").setValue();
                that.byId("DlocInput").setValue();
                that.byId("CprodInput").setValue();
                that.byId("PprodInput").setValue();
                // that.byId("MODEL_VERSION").setValue();
                that.byId("PrePFInput").setValue();
                that.byId("ForeAlgInput").setValue();
                that.byId("idver").setValue();
                that.byId("idscen").setValue();
                that.byId("classInput").setValue();
                that.byId("custGrpInput").setValue();
            
                // that.byId("GEN_TYPE").setValue();
                that.byId("FromDate").setValue();
                that.byId("ToDate").setValue();
                that.byId("singleDt").setValue();
                that.byId("idRollingWeeks").setValue();
                that.byId("idOverride").setSelected(false);
                that.byId("idCritical").setSelected(false);
                that.byId("idImpact").setSelected(false);
                that.byId("idDaily").setSelected(false);
                that.byId("idFullrun").setSelected(false);
                that.byId("idRolling").setSelected(false);
                that.byId("idSnapDesc").setValue();

                that.byId("CprodInput").removeAllTokens();
                that.byId("PprodInput").removeAllTokens();

                var aData = that.ActivityItems;

                that.filterActivites = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === selStep ;
                });

                var Exists=[];
                if(that.TempParams.length > 0){
                    Exists = that.TempParams.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === selStep && 
                               aComp.counter === counter; 

                    });
                }
       
                if(selStep === "GENERATE_SEEDORDER"){
                    var tempDate = new Date(new Date().setDate(new Date().getDate() - 1));
                    that.byId("FromDate").setMaxDate(tempDate);
                    that.byId("ToDate").setMaxDate(tempDate);
                    that.byId("FromDate").setMinDate(null);
                    that.byId("ToDate").setMinDate(null);
                } else if(selStep === "PURGE_PLANNING_DATA"){
                    that.byId("FromDate").setMaxDate(null);
                    that.byId("ToDate").setMaxDate(null);
                    that.byId("FromDate").setMinDate(null);
                    that.byId("ToDate").setMinDate(null);
                } else {
                    that.byId("FromDate").setMaxDate(null);
                    that.byId("ToDate").setMaxDate(null);
                    that.byId("FromDate").setMinDate(new Date());
                    that.byId("ToDate").setMinDate(new Date());
                }

                if(selStep === "PUBLISH_FORECAST_ORDERS"){
                    that.byId("idModelVer").setEditable(false);
                   
                } else {
                    that.byId("idModelVer").setEditable(true);
                }

                for(var i=0; i<that.filterActivites.length; i++){
                    var id= that.filterActivites[i].PARAMETER_ID 
                    that.byId(id).setVisible(true);

                    if(Exists.length === 0){
                        var input = that.byId(id).getFields()[0].sId.split("--")[2];
                        if(id === "OVERRIDE_ASSIGNMENT" || id === "CRITICAL_ASSEMBLY" || id === "IMPACT_ANALYSIS" ||
                             id === "DAILY" || id === "SnapShot" ) {
                            that.byId(input).setSelected(false);
                        } else if(id !== "MODEL_VERSION" && id !== "GEN_TYPE") {
                            that.byId(input).setValue();
                        }
                        if(that.filterActivites[i].OPTION_SELECT === "M"){
                            that.byId(input).removeAllTokens();
                        }
                    }
                    
                    if(Exists.length > 0){
                    var input = that.byId(id).getFields()[0].sId.split("--")[2];

                    if(id.includes("MF_LOCATION")){

                        if(that.filterActivites[i].OPTION_SELECT === "S"){
                            that.byId(input).setValue(Exists[0].MF_LOCATION_ID);
                        } 
                        
                        if(selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION") ){
                            if(Exists[0].MF_LOCATION_ID !== ""){
                            that.PlancfgPara(Exists[0].MF_LOCATION_ID, Exists[0].GEN_TYPE);
                            }
                        }
                    } else if(id.includes("DM_LOCATION")){

                        if(that.filterActivites[i].OPTION_SELECT === "S"){
                            that.byId(input).setValue(Exists[0].LOCATION_ID);
                        } else if(that.filterActivites[i].OPTION_SELECT === "M"){
                            var mulLoc = [];
                            var tempLoc = [];
                            // var mulLoc = Exists[0].LOCATION_ID;
                            // that.byId(input).removeAllTokens();

                            if(Exists[0].LOCATION_ID !== undefined ){
                                var temp = Exists[0].LOCATION_ID;
                                if(temp.includes(",") === true){
                                    mulLoc = Exists[0].LOCATION_ID.split(",");
                                } else {
                                    // mulLoc.push(Exists[0].LOCATION_ID);
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

                        // if(selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION") ){
                        //     if(Exists[0].LOCATION_ID !== ""){
                        //     that.PlancfgPara(Exists[0].LOCATION_ID, Exists[0].GEN_TYPE);
                        //     }
                        // }
                    }
                    else if(id.includes("PRODUCT")){

                        if(that.filterActivites[i].OPTION_SELECT === "S"){
                            that.byId(input).setValue(Exists[0].PRODUCT_ID);
                        } else if(that.filterActivites[i].OPTION_SELECT === "M"){
                            var mulProd = [];
                            if(Exists[0].PRODUCT_ID !== undefined){
                                var temp = Exists[0].PRODUCT_ID;
                            if(temp.includes(",") === true){
                                mulProd = Exists[0].PRODUCT_ID.split(",");
                            } else {
                                // mulProd.push(Exists[0].PRODUCT_ID);
                                mulProd = Exists[0].PRODUCT_ID;
                            }
                            // var mulProd = Exists[0].PRODUCT_ID;
                            that.byId(input).removeAllTokens();
                            var temp = "";
                            if(mulProd !== "" && mulProd.length > 0){
                            mulProd.forEach(function (oItem) {
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
                    } else if(id === "MODEL_VERSION"){
                        that.byId(input).setSelectedKey(Exists[0].MODEL_VERSION);
                    } else if(id === "PREDICTION_PROFILE"){
                        that.byId(input).setValue(Exists[0].PREDICTION_PROFILE);
                    } else if(id === "VERSION"){
                        that.byId(input).setValue(Exists[0].VERSION);
                        // if (selStep === "PUBLISH_FORECAST_ORDERS") {
                        //     that.byId("idver").setEditable(false);
                        // } else {
                        //     that.byId("idver").setEditable(true);
                        // }
                    } else if(id === "SCENARIO"){
                        that.byId(input).setValue(Exists[0].SCENARIO);
                        // if (selStep === "PUBLISH_FORECAST_ORDERS") {
                        //     that.byId("idscen").setEditable(false);
                        // } else {
                        //     that.byId("idscen").setEditable(true);
                        // }
                    } else if(id === "CLASS"){
                        // that.byId(input).setValue(Exists[0].CLASS);
                        var mulClass = [];
                            if(Exists[0].CLASS !== undefined){

                            if(Exists[0].CLASS.includes(",")){
                                mulClass = Exists[0].CLASS.split(",");
                            } else {
                                mulClass.push(Exists[0].CLASS);
                                // mulClass = Exists[0].CLASS;
                            }
                            // var mulClass = Exists[0].CLASS;
                            that.byId(input).removeAllTokens();
                            var temp = "";
                            if(mulClass !== undefined){
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
                            }
                            if(temp === ""){
                                that.byId(input).removeAllTokens();
                            }
                        }
                        
                    } else if(id === "CUSTOMER_GROUP"){
                        that.byId(input).setValue(Exists[0].CUSTOMER_GROUP);
                    } else if(id === "GEN_TYPE"){
                        that.byId(input).setSelectedKey(Exists[0].GEN_TYPE);
                    } else if(id === "OVERRIDE_ASSIGNMENT"){
                        // if(Exists[0].OVERRIDE_ASSIG === "true"){
                        if(Exists[0].OVERRIDE_ASSIGNMENT === "true" || Exists[0].OVERRIDE_ASSIGNMENT === true){
                        that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if(id === "CRITICAL_ASSEMBLY"){
                        if(Exists[0].CRITICAL_ASSEMBLY === "true" || Exists[0].CRITICAL_ASSEMBLY === true){
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    }  else if(id === "IMPACT_ANALYSIS"){
                        if(Exists[0].IMPACT_ANALYSIS === "true" || Exists[0].IMPACT_ANALYSIS === true){
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    }  else if(id === "DAILY"){
                        if(Exists[0].DAILY === "true" || Exists[0].DAILY === true){
                            that.byId(input).setSelected(true);
                        } else {
                            that.byId(input).setSelected(false);
                        }
                    } else if(id === "OPERATOR"){
                        that.byId(input).setSelectedKey(Exists[0].OPERATOR);
                    } else if(id === "DATE_RANGE"){
                        that.byId("FromDate").setValue(Exists[0].FROM_DATE);
                        that.byId("ToDate").setValue(Exists[0].TO_DATE);
                    } else if(id === "SINGLE_DATE"){
                        that.byId("singleDt").setValue(Exists[0].SINGLE_DATE);
                    } else if(id === "Rolling_Timestamp"){
                        if(Exists[0].Rolling === "true" || Exists[0].Rolling === true){
                            that.byId("idRolling").setSelected(true);
                            that.byId("FromDate").setEditable(false);
                            that.byId("ToDate").setEditable(false);
                            that.byId("idRollingWeeks").setVisible(true);
                            that.byId("idRollingWeeks").setValue(Exists[0].Rolling_Timestamp);
                            // that.byId(id).setVisible(true);
                        } else {
                            that.byId("idRolling").setSelected(false);
                            that.byId("FromDate").setEditable(true);
                            that.byId("ToDate").setEditable(true);
                            that.byId("idRollingWeeks").setValue();
                            that.byId("idRollingWeeks").setVisible(false);
                            // that.byId(id).setVisible(false);
                        }
                    // } else if(id === "OptAlgorithm"){
                    //     that.byId(input).setSelectedKey(Exists[0].OptAlgorithm);
                    // } else if(id === "OptFactor"){
                    //     that.byId(input).setSelectedKey(Exists[0].OptFactor);
                    // } else if(id === "DsAlgorithm"){
                    //     that.byId(input).setSelectedKey(Exists[0].DsAlgorithm);
                    } else if(id === "SnapShot"){
                        if(Exists[0].SnapShot === "" ){
                        that.byId("idSnapShot").setSelected(false);
                        } else if(Exists[0].SnapShot === "U" ){
                            that.byId("SnapR").setVisible(true);
                            that.byId("idSnapShot").setSelected(true);
                            that.byId("snapDesc").setVisible(false);
                            that.byId("idSnapRadio").setSelectedButton(that.byId("update"));
                        } else if(Exists[0].SnapShot === "C"){
                            that.byId("idSnapShot").setSelected(true);
                            that.byId("SnapR").setVisible(true);
                            that.byId("snapDesc").setVisible(true);
                            that.byId("idSnapRadio").setSelectedButton(that.byId("createSR"));
                            that.byId("idSnapDesc").setValue(Exists[0].SnapShot_Desc);
                        } else if(id === "DAILY"){
                            if(Exists[0].DAILY === "true" || Exists[0].DAILY === true){
                                that.byId(input).setSelected(true);
                            } else {
                                that.byId(input).setSelected(false);
                            }
                        } 
                    } 
                }
                    
                }
                // Form Visible
                that.byId("idParameter").setVisible(true);
                // that.byId("idarrow").setVisible(true);
                that.maxACT_POSITION  = that.MaxStep;
                // that.getView().byId("stepLabel").setText( step[0].getText() + ' of '+ that.maxACT_POSITION);
                // that.byId("idarrowTitle").setText(step[1].getText());
                that.StepsSelFlag = "";
                that.byId("SINGLE_DATE").setVisible(false);
            },

            Previous:function(){

                let alabel =  parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                if(alabel > 1){
                    that.getView().byId("stepLabel").setText(`${alabel - 1} of `+ that.maxACT_POSITION)
                }
                if(that.byId("idStepList").getItems()[alabel -2]){
                that.byId("idStepList").getItems()[alabel -2].setSelected(true);
                that.onStepName();
                }

                that.tempIndex = "";

            },

            Next :function(){
                let alabel =  parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                if(alabel < that.maxACT_POSITION){
                    that.getView().byId("stepLabel").setText(`${alabel + 1} of `+ that.maxACT_POSITION)
                }
                if(that.byId("idStepList").getItems()[alabel]){
                that.byId("idStepList").getItems()[alabel].setSelected(true);
                that.onStepName();
                }
                that.tempIndex = "";

            },

            onSnapshot: function(oEvent){
                var sel = that.byId("idSnapShot").getSelected();
                that.byId("idSnapRadio").setSelectedButton(that.byId("createSR"));

                // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                //     counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);
    
                if(sel){
                    that.byId("SnapR").setVisible(true);
                    that.byId("snapDesc").setVisible(true);

                        // that.TempParams[index].SnapShot = "C";
                        // that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();

                } else {
                    that.byId("SnapR").setVisible(false);
                    that.byId("snapDesc").setVisible(false);
                    // that.TempParams[index].SnapShot = "";
                    // that.TempParams[index].SnapShot_Desc = "";
                }
    
            },
    
            OnsnapSelect: function(){
                var selRadio = that.byId("idSnapRadio").getSelectedButton().getText();

                // var selStep = that.getView().byId("idarrowTitle").getText(),
                // step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                                    
                // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                if(selRadio === "createSR"){
                    that.byId("snapDesc").setVisible(true);
                    // that.TempParams[index].SnapShot = "C";
                    // that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();
                } else {
                    that.byId("snapDesc").setVisible(false);
                    // that.TempParams[index].SnapShot = "U";
                    // that.TempParams[index].SnapShot_Desc = "";
                }
            },

            onDescChange:function(){

                var text = that.byId("idSnapDesc").getValue();
                if(text.length >= 59){
                    MessageToast("Text limit is 60 Characters")
                }

                // if(that.tempIndex === ""){
                //      var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                //         counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                        
                //         that.tempIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);
                //     }
                //         that.TempParams[that.tempIndex].SnapShot_Desc = that.byId("idSnapDesc").getValue();

            },

            onWeekValues:function(){
                var value = that.byId("idWeeks").getValue();

                if(value <= 0){
                    MessageToast.show("History weeks can not be lessthen 1");
                } else if(value > 156){
                    MessageToast.show("History weeks can not be greaterthen 156");
                }

            },

             onOptimise:function(oEvent){
                var selected = oEvent.getParameters().selected;

                if(selected){
                    that.byId("PidOptProfile").setEnabled(true);
                } else {
                    that.byId("PidOptProfile").setEnabled(false);
                }

                that.byId("PidOptProfile").setSelectedKey(that.byId("PidOptProfile").getItems()[0]);

            },


            /**
             * This function is called when click on input box to open value help dialogs.
             * This function will open the dialogs based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");
                that.oMFLocUni = that.byId("MFLInput");
                that.oLocUni = that.byId("DlocInput");
                that.oConfProdUni = that.byId("CprodInput");
                that.oProdUni = that.byId("PprodInput");

                // Location Dialog
                if (sId.includes("MFL")) {
                    that.oMFLocUni = that.byId("MFLInput");
                    that.oLocUni = that.byId("DlocInput");
                    that.oProdUni = that.byId("PprodInput");

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
                    that.oMFLoc = that.byId("MFLInput");
                    that.oLoc = that.byId("DlocInput");
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
                } else if (sId.includes("CprodInput")) {

                    that.oMFLocUni = that.byId("MFLInput");
                    that.oLocUni = that.byId("DlocInput");
                    that.oProdUni = that.byId("PprodInput");
                    that.oConfProdUni = that.byId("CprodInput");

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
                                if (that.ConfProdDataUni[j].PRODUCT_ID === prodTokens[i].getText()) {
                                    sap.ui.getCore().byId("ConfProductSlctListT").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }
                    }

                    
                    this._valueHelpDialogConfProd.open();

                } else if (sId.includes("PprodInput")) {
                    
                   

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

                    that.oVerUni = that.byId("idver");
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
                    that._valueHelpDialogPPF.open();
                } else if (sId.includes("ForeAlgInput")) {
                    var profiles = that.PredictionData;
                    var data = profiles.filter(el=> el.METHOD === "AES");
                    that.fapModel = new JSONModel();
                    that.fapModel.setData({
                        results: data
                    });
                    that._valueHelpDialogFAP.setModel(that.fapModel);

                    that._valueHelpDialogFAP.open();
                } else if (sId.includes("classInput")) {
                    that.oMFLocUni = that.byId("MFLInput");
                    that.oLocUni = that.byId("DlocInput");
                    that.oConfProdUni = that.byId("CprodInput");
                    that.oProdUni = that.byId("PprodInput");

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

                    that.oClass = that.byId("classInput");
                    var classTokens = that.oClass.getTokens();
                    if(classTokens[0].getText().includes(",")){
                        classTokens = classTokens.split(",");
                    }
        
                    
                        for (var i = 0; i < classTokens.length; i++) {
                            for (var j = 0; j < oData.results.length; j++) {
                                if (oData.results[j].CLASS_NUM === classTokens[i].getText()) {
                                    sap.ui.getCore().byId("ClassSlctListT").getItems()[j].setSelected(true);
                                    break;
                                }
                            }
                        }                
                    
                        this._valueHelpDialogClassDetails.open();





                    // that.oMFLoc = that.byId("MFLInput");
                    // that.oLoc = that.byId("DlocInput");
                    // if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                    //     that.oProd = that.byId("CprodInput");
                    // } else {
                    //     that.oProd = that.byId("PprodInput");
                    // }
                    // if(that.byId("DM_LOCATION").getVisible() === true){
    
                    //     if ((that.oLoc.getTokens().length !== 0 || that.oLoc.getValue()) && 
                    //          (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) ) {
                    //         that.getClass();
                    //             this._valueHelpDialogClassDetails.open();
                    //     } else {
                    //         MessageToast.show("Select Location");
                    //     }
                    // } else {
                    //     if (that.oMFLoc.getValue() && (that.oProd.getTokens().length !== 0 || that.oProd.getValue())) {
                    //         that.getClass();
                    //         this._valueHelpDialogClassDetails.open();
                    // } else {
                    //     MessageToast.show("Select Location and Product");
                    // }
                    // }
                } else if (sId.includes("custGrpInput")) {
                    that.getCustGroup();
                                this._valueHelpDialogCustGroup.open();
                    // that.oMFLoc = that.byId("MFLInput");
                    // that.oLoc = that.byId("DlocInput");
                    // if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                    //     that.oProd = that.byId("CprodInput");
                    // } else {
                    //     that.oProd = that.byId("PprodInput");
                    // }

                    // if(that.byId("DM_LOCATION").getVisible() === true){
    
                    //     if ((that.oLoc.getTokens().length !== 0 || that.oLoc.getValue()) && 
                    //          (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) ) {
                    //         that.getCustGroup();
                    //             this._valueHelpDialogCustGroup.open();
                    //     } else {
                    //         MessageToast.show("Select Location");
                    //     }
                    // } else {
                    //     if (that.oMFLoc.getValue() && (that.oProd.getTokens().length !== 0 || that.oProd.getValue())) {
                    //         that.getCustGroup();
                    //         this._valueHelpDialogCustGroup.open();
                    // } else {
                    //     MessageToast.show("Select Location and Product");
                    // }
                    // }
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
                    that.byId("idver").setValue(aSelectedVer[0].getTitle());
                    that.byId("idscen").setValue("");

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
                    that.byId("idscen").setValue(aSelectedScen[0].getTitle());

                    var Exists =[];
                    // var selStep = that.getView().byId("idarrowTitle").getText(),
                    // Step = parseInt(that.getView().byId("stepLabel").getText().split("")[0]);

                    var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                     counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    Exists = that.TempParams.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    });
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    that.TempParams[index].SCENARIO  = aSelectedScen[0].getTitle();     
                
                    // if(index !== -1){
                    //     that.TempParams[index].SCENARIO  = aSelectedScen[0].getTitle();                        
                    // } 

                } else if(sId.includes("ppfSlctList")){
                    var aSelectedPPF = oEvent.getParameter("selectedItems");
                    that.byId("PrePFInput").setValue(aSelectedPPF[0].getTitle());
                    // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    //  counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    // Exists = that.TempParams.filter(function (aComp) {
                    //     return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    // });
                    // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    // that.TempParams[index].PREDICTION_PROFILE = aSelectedPPF[0].getTitle();
               
                } else if (sId.includes("algoSlctList")) {
                    var aSelectedPPF = oEvent.getParameter("selectedItems");
                    that.byId("ForeAlgInput").setValue(aSelectedPPF[0].getTitle());

                } else if(sId.includes("ClassSlctList")){
                    var aSelectedclass = oEvent.getParameter("selectedItems");
                    that.oClass = that.byId("classInput");
                    // that.byId("classInput").setValue(aSelectedclass[0].getTitle());
                    var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                     counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    Exists = that.TempParams.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    });
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    // that.TempParams[index].CLASS = aSelectedclass[0].getTitle();

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
                    that.TempParams[index].CLASS = selClass;
               
                } else if(sId.includes("CustGroup")){
                    var aSelectedCustGroup = oEvent.getParameter("selectedItems");
                    that.byId("custGrpInput").setValue(aSelectedCustGroup[0].getTitle());

                    var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    Exists = that.TempParams.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    });
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    that.TempParams[index].CUSTOMER_GROUP = aSelectedCustGroup[0].getTitle();
                
                    

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
                            
                            that.getView().byId("GenidType").setModel(jmodel);
    
                            if(gentype !== ""){
                                that.byId("GenidType").setSelectedKey(that.typeData.Types[0].key);
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
    
                        var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

            var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
                var aData = that.ActivityItems;
            var filterActivites = aData.filter(function (aComp) {
                return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATION";
                });

                if (filterActivites[0].OPTION_SELECT === "M" ) {
                    that.LocSelType = "M";
                    sap.ui.getCore().byId("LocSlctListT").setMultiSelect(true);

                    if (that.LocData.length > 0) {
                        that.LocData.unshift({
                            LOCATION_ID: "ALL",
                            LOCATION_DESC: "ALL",
                        });
                    }
                } else if (filterActivites[0].OPTION_SELECT === "S" ) {
                    that.LocSelType = "S";
                    sap.ui.getCore().byId("LocSlctListT").setMultiSelect(false);
                    sap.ui.getCore().byId("LocSlctListT").setRememberSelections(false);
                }
                that.locModel.setData({
                    Locitems: that.LocData
                });
                that.oLocList.setModel(that.locModel);

                // that.oLoc.removeAllTokens();
                var locTokens = that.oLoc.getTokens();
                if(locTokens.length > 0){
                    var tempPdata = locTokens[0].getText();
                    if(tempPdata.includes(",") === true){
                        locTokens = locTokens[0].getText().split(",");
                    }
                if(locTokens[0].getText() === "ALL" || locTokens.length === (that.LocData.length - 1)){
                    this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
                } else {
                    for (var i = 0; i < locTokens.length; i++) {
                        for (var j = 0; j < that.LocData.length; j++) {
                            if (that.LocData[j].LOCATION_ID === locTokens[i].getText()) {
                                sap.ui.getCore().byId("LocSlctListT").getItems()[j].setSelected(true);
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
                    
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //     counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                
            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

            // var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
            //     var aData = that.ActivityItems;
            // var filterActivites = aData.filter(function (aComp) {
            //     return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID === "DM_LOCATION";
            //     });

            //     if (filterActivites[0].OPTION_SELECT === "M" ) {
            //         that.LocSelType = "M";
            //         sap.ui.getCore().byId("LocSlctListT").setMultiSelect(true);

            //         if (that.LocData.length > 0) {
            //             that.LocData.unshift({
            //                 LOCATION_ID: "ALL",
            //                 LOCATION_DESC: "ALL",
            //             });
            //         }
            //     } else if (filterActivites[0].OPTION_SELECT === "S" ) {
            //         that.LocSelType = "S";
            //         sap.ui.getCore().byId("LocSlctListT").setMultiSelect(false);
            //         sap.ui.getCore().byId("LocSlctListT").setRememberSelections(false);
            //     }
            //     that.locModel.setData({
            //         Locitems: that.LocData
            //     });
            //     that.oLocList.setModel(that.locModel);

            //     // that.oLoc.removeAllTokens();
            //     var locTokens = that.oLoc.getTokens();
            //     if(locTokens.length > 0){
            //         var tempPdata = locTokens[0].getText();
            //         if(tempPdata.includes(",") === true){
            //             locTokens = locTokens[0].getText().split(",");
            //         }
            //     if(locTokens[0].getText() === "ALL" || locTokens.length === (that.LocData.length - 1)){
            //         this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
            //     } else {
            //         for (var i = 0; i < locTokens.length; i++) {
            //             for (var j = 0; j < that.LocData.length; j++) {
            //                 if (that.LocData[j].LOCATION_ID === locTokens[i].getText()) {
            //                     sap.ui.getCore().byId("LocSlctListT").getItems()[j].setSelected(true);
            //                     break;
            //                 }
            //             }
            //         }
                    
            //     }
            // }

            },

            getProducts:function(){
                //Single select or multi select

                var selStep = that.byId("idStepList").getSelectedItems()[0].getCells()[2].getText();
                var Step = that.byId("idStepList").getSelectedItems()[0].getCells()[0].getText();
                    var aData = that.ActivityItems;
                var filterActivites = aData.filter(function (aComp) {
                    return aComp.ACTIVITY_ID === selStep && aComp.PARAMETER_ID.includes("PRODUCT");
                    });

                    if (filterActivites[0].OPTION_SELECT === "M" ) {
                        if(filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT"){
                                that.oProd = that.byId("PprodInput");
                            } else {
                                that.oProd = that.byId("CprodInput");
                            }
                        // that.oProd.removeAllTokens();
                        this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
                    } else {
                        if(filterActivites[0].PARAMETER_ID === "PARTIAL_PRODUCT"){
                        that.byId("PprodInput").setValue("");
                        that.oProd = that.byId("PprodInput");
                        } else {
                            that.byId("CprodInput").setValue("");
                            that.oProd = that.byId("CprodInput");
                        }
                    }
                        that.oLoc = that.byId("DlocInput");

                    var oFilters = [];
                    that.TempLocData = [];
            if(that.byId("DM_LOCATION").getVisible() === true){
                // if (that.LocSelType === "M") {
                    var aSelectedLoc = that.oLoc.getTokens();
                    var temp = aSelectedLoc[0].getText();
                    if(temp.includes(",") === true){
                        aSelectedLoc = aSelectedLoc,split(",");
                    }
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
                    that.TempLocData.push(that.oMFLoc.getValue());
                    var sFilter = new sap.ui.model.Filter({
                        path: "LOCATION_ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: that.oMFLoc.getValue(),
                    });
                    oFilters.push(sFilter);
                }


                   var selectionType = filterActivites[0].OPTION_SELECT;
                if (filterActivites[0].PARAMETER_ID !== "PARTIAL_PRODUCT" ) {
                    sap.ui.core.BusyIndicator.show();
                    // Calling sercive to get the Product list
                    this.getModel("BModel").read("/getLocProdDet", {
                        // filters: [ new Filter( "LOCATION_ID", FilterOperator.EQ, that.oLoc.getValue() ) ],
                        filters: oFilters,
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.jobtypeProduct(oData, selectionType);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else {
                    sap.ui.core.BusyIndicator.show();
                    
                        that.getModel("BModel").callFunction("/getAllProdNew", {
                        method: "GET",
                        urlParameters: {
                            LOC: JSON.stringify(that.TempLocData),
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            that.jobtypeProduct(oData, selectionType);
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                }


            },

            jobtypeProduct: function (data, type) {
                var aData = data,
                selectionType = type;


                if (selectionType === "M" ) {
                    that.ProdSelType = "M";
                    sap.ui.getCore().byId("prodSlctListT").setMultiSelect(true);

                    if (data.results.length > 0) {
                        data.results.unshift({
                            PRODUCT_ID: "ALL",
                            PROD_DESC: "ALL",
                        });
                    }
                } else if (selectionType === "S" ) {
                    that.ProdSelType = "S";
                    sap.ui.getCore().byId("prodSlctListT").setMultiSelect(false);
                    sap.ui.getCore().byId("prodSlctListT").setRememberSelections(false);
                }

                that.prodModel = new JSONModel();
                that.prodModel.setSizeLimit(1000);


                function removeDuplicate(array, key) {
                    var check = new Set();
                    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                }
                that.prodModel = new JSONModel();
                that.prodModel.setSizeLimit(1000);
    
                that.prodModel.setData({
                    results: removeDuplicate(data.results, 'PRODUCT_ID')
                });
                
                that.oProdList.setModel(that.prodModel);

                var prodTokens = that.oProd.getTokens();
                if(prodTokens.length > 0){
                    var tempPdata = prodTokens[0].getText();
                    if(tempPdata.includes(",") === true){
                        prodTokens = prodTokens[0].getText().split(",");
                    }
                    var Products = removeDuplicate(data.results, 'PRODUCT_ID');
            if(prodTokens[0].getText() === "ALL" || prodTokens.length === (Products.length - 1)){
                this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
            } else {
                for (var i = 0; i < prodTokens.length; i++) {
                    for (var j = 0; j < Products.length; j++) {
                        if (Products[j].PRODUCT_ID === prodTokens[i].getText()) {
                            sap.ui.getCore().byId("prodSlctListT").getItems()[j].setSelected(true);
                            break;
                        }
                    }
                }                
            }
        }
                

            },

            /**
             * This function is called when Selecting or Unselecting of a items in Product dialog.
             * @param {object} oEvent -the event information.
             */
            handleDemdLocChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("LocSlctListT").getItems();
            var oSelItems = this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].getSelectedItems();
            var tabItems = sap.ui.getCore().byId("LocSlctListT").getItems();
            if(tabItems[0].getTitle() === "ALL"){
            if (
                oSelected === "ALL" &&
                oEvent.getParameter("selected") &&
                aItems.length !== 1
            ) {
                this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].selectAll();
            } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
                this._valueHelpDialogLoc.getAggregation("_dialog").getContent()[1].removeSelections();
            } else if (oSelected === "ALL" && aItems.length === 1) {
                sap.ui.getCore().byId("LocSlctListT").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("LocSlctListT").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("LocSlctListT").getItems()[0].setSelected(true);
            }
        }
        },

            /**
             * This function is called when Selecting or Unselecting of a items in Product dialog.
             * @param {object} oEvent -the event information.
             */
        handleProdChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("prodSlctListT").getItems();
            var oSelItems = this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].getSelectedItems();
            var tabItems = sap.ui.getCore().byId("prodSlctListT").getItems();
            if(tabItems[0].getTitle() === "ALL"){
            if (
                oSelected === "ALL" &&
                oEvent.getParameter("selected") &&
                aItems.length !== 1
            ) {
                this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].selectAll();
            } else if (oSelected === "ALL" && !oEvent.getParameter("selected")) {
                this._valueHelpDialogProd.getAggregation("_dialog").getContent()[1].removeSelections();
            } else if (oSelected === "ALL" && aItems.length === 1) {
                sap.ui.getCore().byId("prodSlctListT").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("prodSlctListT").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("prodSlctListT").getItems()[0].setSelected(true);
            }
        }
        },

        handleClassChange: function (oEvent) {
            var oSelected = oEvent.getParameter("listItem").getTitle();
            var aItems = sap.ui.getCore().byId("ClassSlctListT").getItems();
            var oSelItems = this._valueHelpDialogClassDetails.getAggregation("_dialog").getContent()[1].getSelectedItems();
            var tabItems = sap.ui.getCore().byId("ClassSlctListT").getItems();
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
                sap.ui.getCore().byId("ClassSlctListT").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && !oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("ClassSlctListT").getItems()[0].setSelected(false);
            } else if (oSelected !== "ALL" && oEvent.getParameter("selected") && aItems.length - 1 === oSelItems.length) {
                sap.ui.getCore().byId("ClassSlctListT").getItems()[0].setSelected(true);
            }
        }
        },

        

            /**
             * This function is called when Location and product is selected.
             * In this function we will get the Versions.
             */
            getVersion: function (activity) {
                var verFlag = "";
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
                if(that.oProd.getValue() === "" && that.oProd.getTokens().length > 0){
                    selectionType = "M";
                } else if(that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                    selectionType = "S";
                }
                var ActivityId = activity
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

                if (ActivityId === "PUBLISH_FORECAST_ORDERS") {
                    sap.ui.core.BusyIndicator.show();
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
                            sap.ui.core.BusyIndicator.hide();
                            var adata = [];
                            var prodToken = that.oProd.getTokens();
                            // for (var i = 0; i < oData.results.length; i++) {
                            //     for (var j = 0; j < prodToken.length; j++) {
                            //     if (oData.results[i].PRODUCT_ID === prodToken[j].getText()) {
                            //         adata.push({
                            //             "VERSION_NAME": oData.results[i].VERSION,
                            //             "VERSION": oData.results[i].VERSION
                            //         });
                            //     }
                            // }
                            // }
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
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Failed to get Version!");
                        },
                    });

                // } else if(ActivityId === "IMPORT_IBP_DEMAND_FUTURE"){
                } else {

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
                //     sap.ui.core.BusyIndicator.show();
                //     // Calling sercive to get the IBP Versions list
                //     this.getModel("BModel").read("/getIbpVerScn", {
                //         filters: oFilters,
                //         success: function (oData) {
                //             sap.ui.core.BusyIndicator.hide();
                //             function removeDuplicate(array, key) {
                //                 var check = new Set();
                //                 return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                //             }
                //             that.verModel.setData({
                //                 results: removeDuplicate(oData.results, 'VERSION')
                //             });

                //             that.oVerList.setModel(that.verModel);
                //         },
                //         error: function (oData, error) {
                //             sap.ui.core.BusyIndicator.hide();
                //             MessageToast.show("error");
                //         },
                //     });
                // }
            },

            /**
             * This function is called when Version is selected.
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
                if(that.oProd.getValue() === "" && that.oProd.getTokens().length > 0){
                    selectionType = "M";
                } else if(that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                    selectionType = "S";
                }
                var ActivityId = activity;
                
                
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

                if (ActivityId === "PUBLISH_FORECAST_ORDERS") {
                    sap.ui.core.BusyIndicator.show();
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
                            sap.ui.core.BusyIndicator.hide();
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
                            // if (adata.length > 0) {
                            //     that.scenModel.setData({
                            //         results: adata
                            //     });

                            //     that.oScenList.setModel(that.scenModel);
                            // }
                        },
                        error: function (oResponse) {
                            sap.ui.core.BusyIndicator.hide();
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
                //     sap.ui.core.BusyIndicator.show();
                //     // Calling sercive to get the IBP Versions list
                //     this.getModel("BModel").read("/getIbpVerScn", {
                //         filters: oFilters,
                //         success: function (oData) {
                //             sap.ui.core.BusyIndicator.hide();
                //             function removeDuplicate(array, key) {
                //                 var check = new Set();
                //                 return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
                //             }
                //             that.scenModel.setData({
                //                 results: removeDuplicate(oData.results, 'SCENARIO')
                //             });
                //             // that.scenModel.setData(oData);
                //             that.oScenList.setModel(that.scenModel);
                //         },
                //         error: function (oData, error) {
                //             sap.ui.core.BusyIndicator.hide();
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
                        that.classData = oData.results;
                        if (oData.results.length > 0) {
                            oData.results.unshift({
                                CLASS_NUM: "ALL",
                                CLASS_NAME: "ALL",
                            });
                        }
                        that.classModel.setData(oData);
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

            getCustGroup:function(){
                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Customer data
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

            },

            onModelChange:function(){
                var sel = that.byId("idModelVer").getSelectedKey();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].MODEL_VERSION = sel;

            },

            // OnGentypeChange:function(){
            //     var sel = that.byId("GenidType").getSelectedKey();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].GEN_TYPE = sel;

            // },

            // onOverride:function(){
            //     var sel = that.byId("idOverride").getSelected();
                

            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;
                    
            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                
            //     that.TempParams[index].OVERRIDE_ASSIGNMENT = sel;

            // },

            // onCritical:function(){
            //     var sel = that.byId("idCritical").getSelected();
               
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].CRITICAL_ASSEMBLY = sel;

            // },

            // onImpact:function(){
            //     var sel = that.byId("idImpact").getSelected();
                
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].IMPACT_ANALYSIS = sel;

            // },

            // onDaily:function(){
            //     var sel = that.byId("idDaily").getSelected();
               
            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //         Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            //     var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
            //     that.TempParams[index].DAILY = sel;

            // },

            onRolling:function(){
                var sel = that.byId("idRolling").getSelected();
                
                // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                //     Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                // that.TempParams[index].Rolling = sel;
                that.byId("FromDate").setValue();
                    that.byId("ToDate").setValue();
                if(sel){
                    that.byId("FromDate").setEditable(false);
                    that.byId("ToDate").setEditable(false);
                    that.byId("idRollingWeeks").setValue();
                    that.byId("idRollingWeeks").setVisible(true);
                } else {
                    that.byId("FromDate").setEditable(true);
                    that.byId("ToDate").setEditable(true);
                    that.byId("idRollingWeeks").setValue();
                    that.byId("idRollingWeeks").setVisible(false);
                }

            },

            onRollWeekchange:function(oEvent){
                var week = parseInt(that.byId("idRollingWeeks").getValue());

            //     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
            //     Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                
                if(week > 0){
                    var newDate = new Date(new Date(). getTime() + week * 7 * 24 * 60 * 60 * 1000);
                        that.byId("FromDate").setValue(new Date().toISOString().split("T")[0]);
                        that.byId("ToDate").setValue(newDate.toISOString().split("T")[0]);
                        // that.TempParams[index].Rolling_Timestamp = week;
                        // that.TempParams[index].FROM_DATE = new Date().toISOString().split("T")[0];
                        // that.TempParams[index].TO_DATE = newDate.toISOString().split("T")[0];
                    
                } else {
                    MessageToast.show("Please maintain valid weeks");
                        that.byId("FromDate").setValue();
                        that.byId("ToDate").setValue();
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
                var selOpr = that._oCore.byId("idOperator").getSelectedKey();
            that._oCore.byId("singleDt").setValue();
            if (selOpr === "BT") {
                that._oCore.byId("SINGLE_DATE").setVisible(false);
            } else {
                that._oCore.byId("SINGLE_DATE").setVisible(true);
            }
                // var sel = that.byId("idOperator").getSelectedKey();
                
                // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                //     Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;
                // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                // that.TempParams[index].OPERATOR = sel;
                // that.TempParams[index].FROM_DATE = "";
                // that.TempParams[index].TO_DATE = "";
                // that.TempParams[index].SINGLE_DATE = "";

                // that.byId("FromDate").setValue();
                // that.byId("ToDate").setValue();
                // that.byId("singleDt").setValue();

                // that.byId("FromDate").setMinDate(null);
                // that.byId("ToDate").setMinDate(null);
                // that.byId("singleDt").setMinDate(null);
                // that.byId("FromDate").setMaxDate(null);
                // that.byId("ToDate").setMaxDate(null);
                // that.byId("singleDt").setMaxDate(null);

                // if(sel === "BT"){
                //     that.byId("DATE_RANGE").setVisible(true);
                //     that.byId("SINGLE_DATE").setVisible(false);

                // } else {
                //     that.byId("DATE_RANGE").setVisible(false);
                //     that.byId("SINGLE_DATE").setVisible(true);
                // }


            },





            handleDateChange:function(oEvent){
                var fromDate = that.byId("FromDate").getValue();
                var toDate = that.byId("ToDate").getValue();
                var Exists =[];
                // selStep = that.getView().byId("idarrowTitle").getText();

                var selDate  = oEvent.getParameters().id;

                if(selDate.includes("FromDate")){
                    that.byId("ToDate").setEditable(true);
                    that.byId("ToDate").setMinDate(new Date(fromDate));

                }
                

                // var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep);

                // that.TempParams[index].FROM_DATE = fromDate;
                //     that.TempParams[index].TO_DATE = toDate;

            },

            handleDateChange1:function(oEvent){
                var singleDate = that.byId("singleDt").getValue();
                selStep = that.getView().byId("idarrowTitle").getText();
                var selDate  = oEvent.getParameters().id;
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep);
                that.TempParams[index].SINGLE_DATE = singleDate;

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

        onSaveTemplate:function(){
            that.getParamsData();

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
            });

            var Level = that.TempData[0].LEVEL;
            that.templateName = that.byId("idTemp").getValue();

            console.log(that.TempData);

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
            others.PRODUCT_ID = PARTIAL_PRODUCT;

            console.log(others);

            that.ParametersData = [];
            Object.entries(others).forEach(function(x, i) {


                const obj = {
                    "TEMPLATE_ID": that.templateName,
                    "VARIANT_NAME": "NA",
                    "ACTIVITY_ID": that.templateName,  
                    "ACT_POSITION" : i + 1,   
                    "LEVEL"        : Level,
                    "PARAMETER_ID": x[0],
                    "VALUE": x[1].toString()
                }
                that.ParametersData.push(obj);

            });

            console.log(that.ParametersData);
            var selType = that.oGModel.getProperty("/type");

            sap.ui.core.BusyIndicator.show();
            that.getModel("JModel").callFunction("/genTemplateDetails", {
            method: "GET",
            urlParameters: {
                FLAG:selType,
                VARIANT : "",
                TEMPDATA: JSON.stringify(that.TempData),
                    PARAMDATA:JSON.stringify(that.ParametersData)
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
