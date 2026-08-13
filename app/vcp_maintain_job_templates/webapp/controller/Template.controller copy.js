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
                
                if (!this._valueHelpDialogPPF) {
                    this._valueHelpDialogPPF = sap.ui.xmlfragment(
                        "vcpapp.vcptemplate.view.PredDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogPPF);
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
              

            },
        

            onAfterRendering:function(){

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
                that.byId("idStepList").setModel(that.oModel);
                that.byId("idTemp").setValue();
                that.byId("idTempDesc").setValue();
                that.byId("idParameter").setVisible(false);
                that.byId("idarrow").setVisible(false);
                that.byId("idPatern").setSelectedKey("SR");
                that.byId("idLableEve").setVisible(false);
                that.byId("idTemp").setEditable(true);


                that._valueHelpDialogProd.setTitleAlignment("Center");
                that._valueHelpDialogLoc.setTitleAlignment("Center");
                that._valueHelpDialogPPF.setTitleAlignment("Center");
                that._valueHelpDialogVer.setTitleAlignment("Center");
                that._valueHelpDialogScen.setTitleAlignment("Center");
                that._valueHelpDialogClassDetails.setTitleAlignment("Center");
                that._valueHelpDialogCustGroup.setTitleAlignment("Center");

                this.oProdList = this._oCore.byId(
                    this._valueHelpDialogProd.getId() + "-list"
                );
                this.oMFLocList = this._oCore.byId(
                    this._valueHelpDialogMFL.getId() + "-list"
                );
                this.oLocList = this._oCore.byId(
                    this._valueHelpDialogLoc.getId() + "-list"
                );
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

                that.TempJSON =[];
                that.TempParams =[];
                that.tempIndex = "";

                

                

                that.byId("FromDate").setMinDate(new Date());
                that.byId("ToDate").setMinDate(new Date());
                that.byId("ToDate").setEditable(false);
                that.byId("FromDate").$().find('INPUT').attr('disabled', true);
                that.byId("ToDate").$().find('INPUT').attr('disabled', true);

                // Calling service to get the Location data
                sap.ui.core.BusyIndicator.show();
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
                        MessageToast.show("error");
                    },
                });


                sap.ui.core.BusyIndicator.show();
                // Calling service to get the Profiles data
                this.getModel("BModel").read("/getProfiles", {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        that.ppfModel.setData(oData);
                        that._valueHelpDialogPPF.setModel(that.ppfModel);
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
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
            oRouter.navTo("Home", {}, true);
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
                        that.byId("idarrow").setVisible(false);
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

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get data");
                    },
                });

            },

            // Open the template creation fragment to add the stpes
            onMaintain:function(){
                // that.TempJSON = [];
                var TempId = that.byId("idTemp").getValue();
                // TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
                TempId = TempId.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toUpperCase());
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
                    that.byId("idParameter").setVisible(false);
                    that.byId("idarrow").setVisible(false);
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

                        for(var i= 0 ; i<that.TempParams.length; i++){
                        var temp = that.ActivityItems.filter(function (aComp) {
                            return aComp.ACTIVITY_ID === that.TempParams[i].ACTIVITY_ID ;
                        });
                        if(that.TempParams[i].newStep === "X"){
                        for(var j=0; j<temp.length; j++){
                            if(temp[j].PARAMETER_ID.includes("MF_LOCATION")){
                                that.TempParams[i].MF_LOCATION_ID = "";
                            } else if(temp[j].PARAMETER_ID.includes("DM_LOCATION")){
                                that.TempParams[i].LOCATION_ID = "";
                            } else if(temp[j].PARAMETER_ID.includes("PRODUCT")){
                                that.TempParams[i].PRODUCT_ID = "";
                            } else if(temp[j].PARAMETER_ID.includes("MODEL_VERSION")){
                                that.TempParams[i].MODEL_VERSION = "Active";
                            } else if(temp[j].PARAMETER_ID.includes("PREDICTION_PROFILE")){
                                that.TempParams[i].PREDICTION_PROFILE = "";
                            } else if(temp[j].PARAMETER_ID.includes("VERSION")){
                                // if(that.TempParams[i].ACTIVITY_ID !== "PUBLISH_FORECAST_ORDERS"){
                                    that.TempParams[i].VERSION = "";
                                // } else {
                                //     that.TempParams[i].VERSION = "__BASELINE";
                                // }
                            } else if(temp[j].PARAMETER_ID.includes("SCENARIO")){
                                
                                // if(that.TempParams[i].ACTIVITY_ID !== "PUBLISH_FORECAST_ORDERS"){
                                    that.TempParams[i].SCENARIO = "";
                                // } else {
                                //     that.TempParams[i].SCENARIO = "_PLAN";
                                // }
                            } else if(temp[j].PARAMETER_ID.includes("CLASS")){
                                that.TempParams[i].CLASS = "";
                            } else if(temp[j].PARAMETER_ID.includes("CUSTOMER_GROUP")){
                                that.TempParams[i].CUSTOMER_GROUP = "";
                            }  else if(temp[j].PARAMETER_ID.includes("GEN_TYPE")){
                                that.TempParams[i].GEN_TYPE = "OD";
                            } else if(temp[j].PARAMETER_ID.includes("OVERRIDE_ASSIGNMENT")){
                                that.TempParams[i].OVERRIDE_ASSIGNMENT = false;
                            } else if(temp[j].PARAMETER_ID.includes("CRITICAL_ASSEMBLY")){
                                that.TempParams[i].CRITICAL_ASSEMBLY = false;
                            } else if(temp[j].PARAMETER_ID.includes("IMPACT_ANALYSIS")){
                                that.TempParams[i].IMPACT_ANALYSIS = false;
                            } else if(temp[j].PARAMETER_ID.includes("DAILY")){
                                that.TempParams[i].DAILY = false;
                            } else if(temp[j].PARAMETER_ID.includes("OPERATOR")){
                                that.TempParams[i].OPERATOR = "BT";
                            } else if(temp[j].PARAMETER_ID.includes("DATE_RANGE")){
                                that.TempParams[i].FROM_DATE = "";
                                that.TempParams[i].TO_DATE = "";
                            } else if(temp[j].PARAMETER_ID.includes("SINGLE_DATE")){
                                that.TempParams[i].SINGLE_DATE = "";
                            } else if(temp[j].PARAMETER_ID.includes("Rolling_Timestamp")){
                                that.TempParams[i].Rolling_Timestamp = "";
                                that.TempParams[i].Rolling = "";
                            } else if(temp[j].PARAMETER_ID.includes("OptAlgorithm")){
                                that.TempParams[i].OptAlgorithm = "None";
                            } else if(temp[j].PARAMETER_ID.includes("OptFactor")){
                                that.TempParams[i].OptFactor = 0.9;
                            } else if(temp[j].PARAMETER_ID.includes("DsAlgorithm")){
                                that.TempParams[i].DsAlgorithm = "None";
                            } else if(temp[j].PARAMETER_ID.includes("SnapShot")){
                                that.TempParams[i].SnapShot = "";
                                that.TempParams[i].SnapShot_Desc = "";
                            }

                        }
                    }

                }
          
                    },
                    error: function (error) {
                      sap.ui.core.BusyIndicator.hide();
                      MessageToast.show("Failed to get data");
                    },
                  });

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
                that.byId("OptAlgorithm").setVisible(false);
                that.byId("OptFactor").setVisible(false);
                that.byId("DsAlgorithm").setVisible(false);
                that.byId("SnapShot").setVisible(false);
                that.byId("SnapR").setVisible(false);
                that.byId("snapDesc").setVisible(false);

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
            
                // that.byId("GEN_TYPE").setValue();
                that.byId("FromDate").setValue();
                that.byId("ToDate").setValue();
                that.byId("singleDt").setValue();
                that.byId("idRollingWeeks").setValue();
                that.byId("idOverride").setSelected(false);
                that.byId("idCritical").setSelected(false);
                that.byId("idImpact").setSelected(false);
                that.byId("idDaily").setSelected(false);
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
                    } else if(id === "OptAlgorithm"){
                        that.byId(input).setSelectedKey(Exists[0].OptAlgorithm);
                    } else if(id === "OptFactor"){
                        that.byId(input).setSelectedKey(Exists[0].OptFactor);
                    } else if(id === "DsAlgorithm"){
                        that.byId(input).setSelectedKey(Exists[0].DsAlgorithm);
                    } else if(id === "SnapShot"){
                        if(Exists[0].SnapShot === "" ){
                        that.byId("idSnapshot").setSelected(false);
                        } else if(Exists[0].SnapShot === "U" ){
                            that.byId("SnapR").setVisible(true);
                            that.byId("idSnapshot").setSelected(true);
                            that.byId("snapDesc").setVisible(false);
                            that.byId("idSnapRadio").setSelectedButton(that.byId("update"));
                        } else if(Exists[0].SnapShot === "C"){
                            that.byId("idSnapshot").setSelected(true);
                            that.byId("SnapR").setVisible(true);
                            that.byId("snapDesc").setVisible(true);
                            that.byId("idSnapRadio").setSelectedButton(that.byId("create"));
                            that.byId("idSnapDesc").setValue(Exists[0].SnapShot_Desc);
                        }
                    } 
                }
                    
                }
                // Form Visible
                that.byId("idParameter").setVisible(true);
                that.byId("idarrow").setVisible(true);
                that.maxACT_POSITION  = that.MaxStep;
                that.getView().byId("stepLabel").setText( step[0].getText() + ' of '+ that.maxACT_POSITION);
                that.byId("idarrowTitle").setText(step[1].getText());
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
                var sel = that.byId("idSnapshot").getSelected();
                that.byId("idSnapRadio").setSelectedButton(that.byId("create"));

                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);
    
                if(sel){
                    that.byId("SnapR").setVisible(true);
                    that.byId("snapDesc").setVisible(true);

                        that.TempParams[index].SnapShot = "C";
                        that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();

                } else {
                    that.byId("SnapR").setVisible(false);
                    that.byId("snapDesc").setVisible(false);
                    that.TempParams[index].SnapShot = "";
                    that.TempParams[index].SnapShot_Desc = "";
                }
    
            },
    
            OnsnapSelect: function(){
                var selRadio = that.byId("idSnapRadio").getSelectedButton().getText();

                var selStep = that.getView().byId("idarrowTitle").getText(),
                step = parseInt(that.getView().byId("stepLabel").getText().split("of")[0]);
                                    
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === step);

                if(selRadio === "Create"){
                    that.byId("snapDesc").setVisible(true);
                    that.TempParams[index].SnapShot = "C";
                    that.TempParams[index].SnapShot_Desc = that.byId("idSnapDesc").getValue();
                } else {
                    that.byId("snapDesc").setVisible(false);
                    that.TempParams[index].SnapShot = "U";
                    that.TempParams[index].SnapShot_Desc = "";
                }
            },

            onDescChange:function(){

                if(that.tempIndex === ""){
                     var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                        counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                        
                        that.tempIndex = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);
                    }
                        that.TempParams[that.tempIndex].SnapShot_Desc = that.byId("idSnapDesc").getValue();

            },


            /**
             * This function is called when click on input box to open value help dialogs.
             * This function will open the dialogs based on sId.
             * @param {object} oEvent -the event information.
             */
            handleValueHelp: function (oEvent) {
                var sId = oEvent.getParameter("id");

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
                    // Location Dialog
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
                        that.oMFLoc = that.byId("MFLInput");
                        that.oLoc = that.byId("DlocInput");

                    if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                        that.oProd = that.byId("CprodInput");
                    } else {
                        that.oProd = that.byId("PprodInput");
                    }
                    if ((that.oMFLoc.getValue() || that.oLoc.getValue())  && (that.oProd.getTokens().length !== 0 || that.oProd.getValue() ) ) {
                        var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID;
                        that.getVersion(selStep);
                            that._valueHelpDialogVer.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                    // Scenario Dialog
                } else if (sId.includes("scen")) {
                    
                        that.oMFLoc = that.byId("MFLInput");
                        that.oLoc = that.byId("DlocInput");

                    if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                        that.oProd = that.byId("CprodInput");
                    } else {
                        that.oProd = that.byId("PprodInput");
                    }
                    if (
                        (that.oMFLoc.getValue() || that.oLoc.getValue())  &&
                        (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) && that.byId("idver").getValue()
                    ) {
                        var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID;
                        that.getScenario(selStep);
                            that._valueHelpDialogScen.open();                     
                    } else {
                        MessageToast.show("Select Location, Product and Version");
                    }
                } else if (sId.includes("PrePFInput")) {
                    that._valueHelpDialogPPF.open();
                } else if (sId.includes("classInput")) {
                    that.oMFLoc = that.byId("MFLInput");
                    that.oLoc = that.byId("DlocInput");
                    if(that.byId("CONFIG_PRODUCT").getVisible() === true){
                        that.oProd = that.byId("CprodInput");
                    } else {
                        that.oProd = that.byId("PprodInput");
                    }
                    if(that.byId("DM_LOCATION").getVisible() === true){
    
                        if ((that.oLoc.getTokens().length !== 0 || that.oLoc.getValue()) && 
                             (that.oProd.getTokens().length !== 0 || that.oProd.getValue()) ) {
                            that.getClass();
                                this._valueHelpDialogClassDetails.open();
                        } else {
                            MessageToast.show("Select Location");
                        }
                    } else {
                        if (that.oMFLoc.getValue() && (that.oProd.getTokens().length !== 0 || that.oProd.getValue())) {
                            that.getClass();
                            this._valueHelpDialogClassDetails.open();
                    } else {
                        MessageToast.show("Select Location and Product");
                    }
                    }
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
                    that.oMFLocList.getBinding("items").filter(oFilters);
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
                    var aSelectedLoc = oEvent.getParameter("selectedItems");
                    that.oMFLoc.setValue(aSelectedLoc[0].getTitle());
                    that.oLoc = that.byId("DlocInput");

                    that.byId("idver").setValue("");
                    that.byId("idscen").setValue("");
                    that.byId("classInput").setValue("");
                        
                    var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    that.TempParams[index].MF_LOCATION_ID = aSelectedLoc[0].getTitle();
                    if(that.TempParams[index].LOCATION_ID !== undefined){
                        that.TempParams[index].LOCATION_ID = "";
                    }
                    if(that.TempParams[index].PRODUCT_ID !== undefined){
                        that.TempParams[index].PRODUCT_ID = "";
                    }
                //     if(selStep !== "PUBLISH_FORECAST_ORDERS"){
                    if(that.TempParams[index].VERSION !== undefined){
                        that.TempParams[index].VERSION = "";
                        that.TempParams[index].SCENARIO = "";
                    }
                //     that.byId("idver").setValue("");
                //     that.byId("idscen").setValue("");
                // }
                    if(that.TempParams[index].CLASS !== undefined){
                        that.TempParams[index].CLASS = "";
                    }
                    if(selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION") ){
                        that.PlancfgPara(aSelectedLoc[0].getTitle(), "");
                    }

                    that.oLoc.removeAllTokens();

                    if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                        that.oProd = that.byId("CprodInput");
                        that.oProd.setValue("");
                    } else {
                        that.oProd = that.byId("PprodInput");
                        that.oProd.removeAllTokens();
                    }
                    
                    // if(that.TempParams[index].LOCATION_ID !== undefined){
                    // var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    //         counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                           
                    //         var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    //         if(that.LocSelType === "S"){
                    //             that.oLoc.setValue(aSelectedLoc[0].getTitle());
                    //             that.TempParams[index].LOCATION_ID = aSelectedLoc[0].getTitle();
                    //         } else {
                    //             that.oLoc.removeAllTokens();
                    //             that.LocData = that.ManuLocData.filter(function (aComp) {
                    //                 return aComp.FACTORY_LOC === that.byId("MFLInput").getValue() ;
                    //             });
                    //             that.selDLoc = [];
                    //             that.LocData.forEach(function (oItem) {
                    //                 that.oLoc.addToken(
                    //                     new sap.m.Token({
                    //                         key: oItem.DEMAND_LOC,
                    //                         text: oItem.DEMAND_LOC,
                    //                         editable:false,
                
                    //                     })
                    //                 );
                    //                 that.selDLoc.push( oItem.DEMAND_LOC);
                    //             });
                
                    //             that.TempParams[index].LOCATION_ID = that.selDLoc;
                                // if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                                //     that.oProd = that.byId("CprodInput");
                                // } else {
                                //     that.oProd = that.byId("PprodInput");
                                // }
                                
                                
                                // if(that.oProd.getValue() === "" && that.oProd.getTokens().length > 0){
                                //     that.oProd.removeAllTokens();
                                // } else if(that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                                //     that.oProd.setValue("");
                                // }
                                
                            // }
                        // }

                } else if (sId.includes("Loc")) {
                    var aSelectedLoc = oEvent.getParameter("selectedItems");
                    // that.oLoc.setValue(aSelectedLoc[0].getTitle());

                    if (that.byId("CONFIG_PRODUCT").getVisible() === true) {
                        that.oProd = that.byId("CprodInput");
                    } else {
                        that.oProd = that.byId("PprodInput");
                    }
                    
                    
                    if(that.oProd.getValue() === "" && that.oProd.getTokens().length > 0){
                        that.oProd.removeAllTokens();
                    } else if(that.oProd.getValue() !== "" && that.oProd.getTokens().length === 0) {
                        that.oProd.setValue("");
                    }
                        that.byId("idver").setValue("");
                        that.byId("idscen").setValue("");
                        that.byId("classInput").setValue("");

                            var selDLoc =[];

                        var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                            counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                           
                            var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                            if(that.LocSelType === "S"){
                                that.oLoc.setValue(aSelectedLoc[0].getTitle());
                                that.TempParams[index].LOCATION_ID = aSelectedLoc[0].getTitle();
                            } else {
                                that.oLoc.removeAllTokens();
                                aSelectedLoc.forEach(function (oItem) {
                                    if(oItem.getTitle() !== "ALL"){
                                        selDLoc.push(oItem.getTitle());
                                    
                                    that.oLoc.addToken(
                                        new sap.m.Token({
                                            key: oItem.getTitle(),
                                            text: oItem.getTitle(),
                                            editable:false,

                                        })
                                    );
                                }
                                    // selDLoc.push(oItem.getTitle());
                                });
                                // if(aSelectedLoc[0].getTitle() === "ALL"){
                                //     selDLoc = "ALL";
                                // }
                                
                            }

                            
                            that.TempParams[index].LOCATION_ID = selDLoc;
                            if(that.TempParams[index].PRODUCT_ID !== undefined){
                                 that.TempParams[index].PRODUCT_ID = "";
                            }
                        //     if(selStep !== "PUBLISH_FORECAST_ORDERS"){
                            if(that.TempParams[index].VERSION !== undefined){
                                that.TempParams[index].VERSION = "";
                                that.TempParams[index].SCENARIO = "";
                            }
                        //     that.byId("idver").setValue("");
                        // that.byId("idscen").setValue("");
                        // }
                            if(that.TempParams[index].CLASS !== undefined){
                                that.TempParams[index].CLASS = "";
                            }

                            // if(selStep.includes("PREDICTION") || selStep.includes("MODEL_GENERATION") ){
                            //     that.PlancfgPara(aSelectedLoc[0].getTitle(), "");
                            // }

                       

                } else if(sId.includes("prod")) {
                    var aSelectedProd = oEvent.getParameter("selectedItems");
                    var selProd = [];
                    that.byId("idver").setValue("");
                        that.byId("idscen").setValue("");
                        that.byId("classInput").setValue("");
                    if(that.ProdSelType === "M"){
                    that.oProd.removeAllTokens();
                                aSelectedProd.forEach(function (oItem) {
                                    if(oItem.getTitle() !== "ALL"){
                                        selProd.push(oItem.getTitle());
                                    }
                                    that.oProd.addToken(
                                        new sap.m.Token({
                                            key: oItem.getTitle(),
                                            text: oItem.getTitle(),
                                            editable:false,

                                        })
                                    );
                                });
                    } else {
                        that.oProd.setValue(aSelectedProd[0].getTitle());
                        selProd = aSelectedProd[0].getTitle();
                    }

                        var Exists =[];
                    //    var  selStep = that.getView().byId("idarrowTitle").getText(),
                    //     Step = parseInt(that.getView().byId("stepLabel").getText().split("")[0]);
                        var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                        counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                        Exists = that.TempParams.filter(function (aComp) {
                            return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                        });
                        var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                        that.TempParams[index].PRODUCT_ID = selProd;
                        
                        
                        // if(selStep !== "PUBLISH_FORECAST_ORDERS"){
                            if(that.TempParams[index].VERSION !== undefined){
                                that.TempParams[index].VERSION = "";
                                that.TempParams[index].SCENARIO = "";
                            }
                        //     that.byId("idver").setValue("");
                        // that.byId("idscen").setValue("");
                        // }
                        if(that.TempParams[index].CLASS !== undefined){
                            that.TempParams[index].CLASS = "";
                        }
                        // if(that.TempParams[index].SCENARIO !== undefined){
                        //     that.TempParams[index].SCENARIO = "";
                        // }
                        // // that.getVersion(that.ProdSelType, selStep);

                } else if(sId.includes("Ver")){
                    var aSelectedVer = oEvent.getParameter("selectedItems");
                    that.byId("idver").setValue(aSelectedVer[0].getTitle());
                    that.byId("idscen").setValue("");

                    var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    Exists = that.TempParams.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    });
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    that.TempParams[index].VERSION = aSelectedVer[0].getTitle();
                    that.TempParams[index].SCENARIO  = "";    
                
                    

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
                    var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                     counter = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().counter;
                    Exists = that.TempParams.filter(function (aComp) {
                        return aComp.ACTIVITY_ID === selStep && aComp.counter === counter;
                    });
                    var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.counter === counter);

                    that.TempParams[index].PREDICTION_PROFILE = aSelectedPPF[0].getTitle();
               
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

            OnGentypeChange:function(){
                var sel = that.byId("GenidType").getSelectedKey();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].GEN_TYPE = sel;

            },

            onOverride:function(){
                var sel = that.byId("idOverride").getSelected();
                

                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;
                    
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                
                that.TempParams[index].OVERRIDE_ASSIGNMENT = sel;

            },

            onCritical:function(){
                var sel = that.byId("idCritical").getSelected();
               
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].CRITICAL_ASSEMBLY = sel;

            },

            onImpact:function(){
                var sel = that.byId("idImpact").getSelected();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].IMPACT_ANALYSIS = sel;

            },

            onDaily:function(){
                var sel = that.byId("idDaily").getSelected();
               
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].DAILY = sel;

            },

            onRolling:function(){
                var sel = that.byId("idRolling").getSelected();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].Rolling = sel;
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

                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

            var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                
                if(week > 0){
                    var newDate = new Date(new Date(). getTime() + week * 7 * 24 * 60 * 60 * 1000);
                        that.byId("FromDate").setValue(new Date().toISOString().split("T")[0]);
                        that.byId("ToDate").setValue(newDate.toISOString().split("T")[0]);
                        that.TempParams[index].Rolling_Timestamp = week;
                        that.TempParams[index].FROM_DATE = new Date().toISOString().split("T")[0];
                        that.TempParams[index].TO_DATE = newDate.toISOString().split("T")[0];
                    
                } else {
                    MessageToast.show("Please maintain valid weeks");
                        that.byId("FromDate").setValue();
                        that.byId("ToDate").setValue();
                        that.TempParams[index].Rolling_Timestamp = "";
                        that.TempParams[index].FROM_DATE = "";
                        that.TempParams[index].TO_DATE = "";
                }

            },


            OnOptAlgChange:function(){
                var sel = that.byId("PidOptAlg").getSelectedKey();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].OptAlgorithm = sel;

            },

            OnOptFctChange:function(){
                var sel = that.byId("PidOptFct").getSelectedItem().getText();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].OptFactor = parseFloat(sel);

            },

            OnDsAlgChange:function(){
                var sel = that.byId("PidDSAlg").getSelectedKey();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].DsAlgorithm = sel;

            },

            onOperatorChange:function(){
                var sel = that.byId("idOperator").getSelectedKey();
                
                var selStep = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACTIVITY_ID,
                    Step = that.byId("idStepList").getSelectedItems()[0].getBindingContext().getObject().ACT_POSITION;
                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep && e.ACT_POSITION === Step);
                that.TempParams[index].OPERATOR = sel;
                that.TempParams[index].FROM_DATE = "";
                that.TempParams[index].TO_DATE = "";
                that.TempParams[index].SINGLE_DATE = "";

                that.byId("FromDate").setValue();
                that.byId("ToDate").setValue();
                that.byId("singleDt").setValue();

                that.byId("FromDate").setMinDate(null);
                that.byId("ToDate").setMinDate(null);
                that.byId("singleDt").setMinDate(null);
                that.byId("FromDate").setMaxDate(null);
                that.byId("ToDate").setMaxDate(null);
                that.byId("singleDt").setMaxDate(null);

                if(sel === "BT"){
                    that.byId("DATE_RANGE").setVisible(true);
                    that.byId("SINGLE_DATE").setVisible(false);

                } else {
                    that.byId("DATE_RANGE").setVisible(false);
                    that.byId("SINGLE_DATE").setVisible(true);
                }

            },





            handleDateChange:function(oEvent){
                var fromDate = that.byId("FromDate").getValue();
                var toDate = that.byId("ToDate").getValue();
                var Exists =[],
                selStep = that.getView().byId("idarrowTitle").getText();

                var selDate  = oEvent.getParameters().id;

                if(selDate.includes("FromDate")){
                    that.byId("ToDate").setEditable(true);
                    that.byId("ToDate").setMinDate(new Date(fromDate));

                }

                var index = that.TempParams.findIndex(e => e.ACTIVITY_ID === selStep);

                that.TempParams[index].FROM_DATE = fromDate;
                    that.TempParams[index].TO_DATE = toDate;

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
                that.onSave1();
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
                    that.onSave1();
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
