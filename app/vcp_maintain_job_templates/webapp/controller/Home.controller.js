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
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, library, Sorter, Dialog, Text, Button, MessageBox, Spreadsheet) {
        "use strict";
        var that, oGModel;
            var aResults;
          
      
    
        return BaseController.extend("vcpapp.vcptemplate.controller.Home", {
                onInit: function () {
                    that = this;
                    that.TemplateModel = new JSONModel();
                    that.TemplateModel.setSizeLimit(1000);
                    that.oGModel = that.getOwnerComponent().getModel("oGModel");
                    that.oGModel.setProperty("/auth", "");
                    that.oGModel.setProperty("/LayerGroup", "");
                    that.skip = 0;
                    that.oLocData = [];
                    that.ConfProdall =[];
                    that.allLoc = "";
                    that.allProd = "";
                    that.oGModel.setProperty("/homeAllLocationData", that.oLocData);
                    that.oGModel.setProperty("/homeAllLocationProductData", that.ConfProdall);
                //     var temp1 = "error";
                //     var temp = that.userPreference();
                //   Promise.all([temp]).then(function(results){
                //     if(results[0] === "SU"){
                //       var temp1 = that.getAllLocaions();
                      
                //   }
                //   })

                //   if(temp1 === "SL"){
                //     Promise.all([temp1]).then(function(results){
                //       var temp2 = that.getAProducts();
                //   })
                // }
                that.userPreference();
                    //  that.getAllLocaions();
                    //   that.getAProducts();
                    that.getEnable();
                },
                userPreference:function(){
                //  return new Promise((resolve, reject) => {
                  sap.ui.core.BusyIndicator.show();
                  that.getOwnerComponent().getModel("BModel").read("/getUserPreferences", {    
                                       
                      success: function (oData) {
                        
                          var MAX_RECORDS = oData.results.filter(el=> el.PARAMETER === "MAX_RECORDS");
                                  that.oGModel.setProperty("/MaxCount", MAX_RECORDS[0].PARAMETER_VALUE);
                          // // resolve("SU");
                          //  that.getAllLocaions();
                          //  that.getAProducts();
                          that.myP2 = new Promise((resolve, reject) => {
                              that.getAllLocaions(resolve, reject);
                          });
                          
                          that.myP3 = new Promise((resolve, reject) => {
                              that.getAProducts(resolve, reject);
                          });
                      },
                      error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                         console.log(error);
                        //  reject("error");
                      },
                  });
                // })
      
              },
    
                onAfterRendering:function(){
                  

                 that.oGModel = that.getOwnerComponent().getModel("oGModel");
                    sap.ui.core.BusyIndicator.show();
                    that.getModel("JModel").read("/readTemplates", {
                      filters: [new Filter("VARIANT_NAME", FilterOperator.EQ, "NA")
                        ], 
                        success: function (oData) {
                          sap.ui.core.BusyIndicator.hide();

                          that.DataTemplate = oData.results;
                          if(that.oGModel.getProperty("/auth") === "I"){
                            // that.byId("templateList").getColumns()[4].setVisible(true);
                            that.byId("LayerGroup").setVisible(true);
                            
                            // var TableData = oData.results;
                            var TableData = oData.results.filter(function (aComp) {
                              return aComp.LEVEL === "I" ;
                          });
                          } else if(that.oGModel.getProperty("/auth") === "E") {
                            // that.byId("templateList").getColumns()[4].setVisible(false);
                            that.byId("LayerGroup").setVisible(false);

                            var TableData = oData.results.filter(function (aComp) {
                              return aComp.LEVEL === "E" ;
                          });
                          }
                          that.byId("idLayer").setSelectedKey(that.oGModel.getProperty("/auth"));

                          // if(that.byId("idLayer").getSelectedKey() === "A"){
                          //   var TableData = oData.results;
                          // }



                          that.TemplateModel.setData({
                            templatesresults: TableData,
                          });
                          that.byId("templateList").setModel(that.TemplateModel);
                          var emptyData = [];
                          that.byId("headSearch").setValue();
                          that.byId("idSteps").setValue(0);
                          // that.byId("idStype").setSelectedKey("GT");
                          // that.byId("idG").setSelected(true);
                          that.byId("templateList").getBinding("items").filter(emptyData);
                          that.byId("templateList").removeSelections();
                          that.byId("idG1").setSelected(true);

                          
    
              
                        },
                        error: function (error) {
                          sap.ui.core.BusyIndicator.hide();
                          MessageToast.show("Failed to get data");
                        },
                      });
    
                },

                onLayerCode:function(oEvent){
                  var selKey = that.byId("idLayer").getSelectedKey();
                  var tempdata = that.DataTemplate;
                  if(selKey === "A"){
                    var TableData = tempdata
                    // that.TemplateModel.setData({
                    //   templatesresults: tempdata,
                    // });
                    // that.byId("templateList").setModel(that.TemplateModel);

                  } else if(selKey === "I"){

                    var TableData = tempdata.filter(function (aComp) {
                      return aComp.LEVEL === "I" ;
                  });

                    // that.TemplateModel.setData({
                    //   templatesresults: TableData,
                    // });
                    // that.byId("templateList").setModel(that.TemplateModel);

                  } else if(selKey === "E"){
                    var TableData = tempdata.filter(function (aComp) {
                      return aComp.LEVEL === "E" ;
                  });

                    // that.TemplateModel.setData({
                    //   templatesresults: TableData,
                    // });
                    // that.byId("templateList").setModel(that.TemplateModel);

                  }
                  that.TemplateModel.setData({
                    templatesresults: TableData,
                  });
                  that.byId("templateList").setModel(that.TemplateModel);


                },
    
                /**
             * Called when it routes to create job page.
             * @param {object} oEvent -the event information.
             */
                onCreateTemplate: function (oEvent) {
                  that.oGModel.setProperty("/type", "");
                  that.oGModel.setProperty("/selTemplate", "");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                if(that.allLoc === "X" && that.allProd === "X"){
                  oRouter.navTo("Template", {}, true);
                }
              },
               onVariant: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                // if(that.allLoc === "X" && that.allProd === "X"){
                  oRouter.navTo("Variant", {}, true);
                // }
              },
    
              onCopyTemplate:function(oEvent){
                if(that.byId("templateList").getSelectedItems().length  > 0){
    
                var template = that.byId("templateList").getSelectedItems()[0].getCells()[0].getText();
                var tempDesc = that.byId("templateList").getSelectedItems()[0].getCells()[1].getText();
                that.oGModel.setProperty("/LayerGroup", that.byId("templateList").getSelectedItems()[0].getCells()[4].getText());
                that.oGModel.setProperty("/selTemplate", template);
                that.oGModel.setProperty("/selTemplateDesc", tempDesc);
                var button = oEvent.getSource().getText();
                if(button === "Edit"){
                  that.oGModel.setProperty("/type", "E");
                } else {
                  that.oGModel.setProperty("/type", "C");
                }
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                if(that.allLoc === "X" && that.allProd === "X"){
                  oRouter.navTo("Template", {}, true);
                }
                
              } else {
                sap.m.MessageToast.show("Please select atleast one item");
    
              }
    
              },
    
              onDeleteTemplate:function(){
                if(that.byId("templateList").getSelectedItems().length  > 0){

    
                var template = that.byId("templateList").getSelectedItems()[0].getCells()[0].getText();
                var LayerCode = that.byId("templateList").getSelectedItems()[0].getCells()[3].getText();
    
                var CurrentDate = new Date();
                CurrentDate = new Date(CurrentDate.setTime(CurrentDate.getTime() + (CurrentDate.getTimezoneOffset() * 60 * 1000)));
                const padL = (nr, _len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
                  var deletionTime = `${
                    CurrentDate.getFullYear()}-${
                        padL(CurrentDate.getMonth()+1)}-${
                          padL(CurrentDate.getDate())} ${
                        padL(CurrentDate.getHours())}:${
                        padL(CurrentDate.getMinutes())}:${
                        padL(CurrentDate.getSeconds())}`
    
                        const obj={
                          TEMPLATE_ID:template,
                          deletionTime:deletionTime
                      }
                     
                      var sText =  "Are you sure you want to Delete this Slected activity_id: " + " " + (obj.TEMPLATE_ID);
                      sap.m.MessageBox.warning(sText, {
                        title: "Conformation",
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        onClose: function (oAction) {
                          if(oAction === sap.m.MessageBox.Action.YES){
                            if(LayerCode !== "Global"){
                              // sap.ui.core.BusyIndicator.show();
                                    that.getModel("JModel").callFunction("/removeTemplate", {
                                        method: "GET",
                                        urlParameters: {
                                          TemplateData: JSON.stringify(obj)
                                        },
                                          headers: {
                                          "x-user-id": that.getUser(),
                                          },
                                        success: function (oData, oResponse) {
                                            sap.ui.core.BusyIndicator.hide();
                                            if(oData.removeTemplate == '403'){
                                                sap.m.MessageToast.show("Unauthorized to delete the template");
                                            }
                                            else{
                                             sap.m.MessageToast.show(oData.removeTemplate);
                                            that.onAfterRendering();
                                            }
                                        
                                        },
                                        error: function (oResponse) {
                                            sap.ui.core.BusyIndicator.hide();
                                            sap.m.MessageToast.show("Failed to delete Template");
                                        },
                                    });
                            } else {
                              sap.m.MessageToast.show("Global Templates cannot be deleted");
                            }

                          }
                        }
                      })
    
            
              } else {
                sap.m.MessageToast.show("Please select atleast one item");
              }
    
              },
    
              onhandlePress:function(oEvent){
                var selItem = that.byId("templateList").getSelectedItems()[0].getBindingContext().getObject().LAYER_CODE;
    
                if(selItem === "Global"){
                  that.byId("idDel").setEnabled(false);
                  that.byId("idEdit").setEnabled(false);
                } else {
                  var auth = that.oGModel.getProperty("/authentication");
                  if(auth[0].CREATE_CHK == "disabled"){
                    that.byId("create").setEnabled(false);
                    that.byId("idCopy").setEnabled(false);
                  } else {
                    that.byId("create").setEnabled(true);
                    that.byId("idCopy").setEnabled(true);
                  }
                  if(auth[0].UPDATE_CHK == "disabled"){
                  that.byId("idEdit").setEnabled(false);
                  } else {
                    that.byId("idEdit").setEnabled(true);
                  }
                  if (auth[0].DELETE_CHK === "disabled") {
                      that.byId("idDel").setEnabled(false);
                  } else {
                    that.byId("idDel").setEnabled(true);
                  }
                }
              },
    
    
              onStepCount:function(oEvent){
                var sId = oEvent.getParameter("id");
    
                var step = that.byId("idSteps").getValue(),
                    sType = "";
                    var  oFilters=[],
                    sQuery = that.byId("headSearch").getValue();
                    
                    sQuery = sQuery.trim();
                    step = step.trim();
                  if(that.byId("idG").getParent().getItems()[0].getSelected()){
                    sType = "GT"
                  } else {
                    sType = "LT"
                  }
    
                  if(sType === "LT"){
                      oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("STEPS", FilterOperator.LT, step),
                            ],
                            and: false,
                        })
                    );
                  } else if(sType === "GT") {
                      oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("STEPS", FilterOperator.GT, step),
                            ],
                            and: false,
                        })
                    );
                  }
    
                  
                if(sQuery !== ""){
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
                      that.byId("templateList").getBinding("items").filter(oFilters);
    
    
              },
    
    
              handleSearch:function(){
                var oFilters = [],
                    sQuery = that.byId("headSearch").getValue();
    
                    sQuery = sQuery.trim();
                if(sQuery !== ""){
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
                      that.byId("templateList").getBinding("items").filter(oFilters);
    
              },
              getEnable:function(){
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
                        if(aResults.length > 0){
                          var isUserLoggedIn = true; 
                        }
                        if (isUserLoggedIn) {

                          that.oGModel.setProperty("/auth", aResults[0].LEVEL);
                          that.oGModel.setProperty("/authentication", aResults);

                            // if(aResults[0].CREATE_CHK == "disabled"){
                            //   that.byId("create").setEnabled(false);
                            //   that.byId("idCopy").setEnabled(false);
                            // } else {
                            //   that.byId("create").setEnabled(true);
                            //   that.byId("idCopy").setEnabled(true);
                            // }
                            // if(aResults[0].UPDATE_CHK == "disabled"){
                            // that.byId("idEdit").setEnabled(false);
                            // } else {
                            //   that.byId("idEdit").setEnabled(true);
                            // }
                            // if (aResults[0].DELETE_CHK === "disabled") {
                            //     that.byId("idDel").setEnabled(false);
                            // } else {
                            //   that.byId("idDel").setEnabled(true);
                            // }
                           
                           
                        } 
                        else{
                          that.byId("idDel").setEnabled(false);
                          that.byId("create").setEnabled(false);
                          that.byId("idCopy").setEnabled(false);
                          that.byId("idEdit").setEnabled(false);
                        }

                    //     that.getAllLocaions();
                    // that.getAProducts();
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    },
                });
            },

          //   getAllLocaions: function () {
          //     // new Promise((resolve, reject) => {
          //     // Calling service to get the Factory location, Demand loaction, config and partial products data
          //     sap.ui.core.BusyIndicator.show();
          //     var topCount = that.oGModel.getProperty("/MaxCount");
          //     this.getOwnerComponent().getModel("BModel").read("/getfactorylocdesc", {
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
          //                 // reject("error");
          //                 that.getAllLocaions();
          //             } else {
          //                 that.skip = 0;
          //                 that.oLocData = that.oLocData.concat(oData.results);
  
          //                 // that.TotalDataUni = that.oLocData;
  
          //                 // function removeDuplicate(array, key) {
          //                 //     var check = new Set();
          //                 //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
          //                 // }
  
          //                 // that.MFLocDataUni = removeDuplicate(that.oLocData, 'FACTORY_LOC');
  
          //                 that.oGModel.setProperty("/homeAllLocationData", that.oLocData);
          //                 that.allLoc = "X";
          //                 // resolve("SL");
          //             }
                      
  
          //         },
          //         error: function (oData, error) {
          //             sap.ui.core.BusyIndicator.hide();
          //             MessageToast.show("Failed to get data");
          //             // reject("error");
          //         },
          //     });
          //   // });
          // },
  
          // getAProducts:function(){
          //   // new Promise((resolve, reject) => {
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
          //                     // reject("error");
          //                     that.getAProducts();
          //                 } else {
          //                     that.skip = 0;
          //                     that.ConfProdall = that.ConfProdall.concat(oData.results);
          //                     // // oData.results = that.item
          //                     // // that.filterCheck(that.item);
          //                     // // that.arrayData = that.item;
          //                     // that.uniqConfprod= that.ConfProdall.filter(el=> el.CONFIGPROD_CHK === "X");
                             
          //                     // // function removeDuplicate(array, key) {
          //                     // //     var check = new Set();
          //                     // //     return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
          //                     // // }
          //                     // // oData.results = removeDuplicate(oData.results, 'REF_PRODID');
  
          //                     // // that._valueHelpDialogConfProd.setData(oData);
          //                     // // that.oConfProdList.setModel(that.ConfprodModel);
  
          //                     that.oGModel.setProperty("/homeAllLocationProductData", that.ConfProdall);
          //                     that.allProd = "X";
                              
          //                   // resolve("SP");
          //                     sap.ui.core.BusyIndicator.hide()
          //                 }
          //             },
          //             error: function (oData, error) {
          //                 sap.ui.core.BusyIndicator.hide();
          //                 // reject("error");
          //                 // MessageToast.show("error");
          //             },
          //         });
              
          //       // });
          // },


          getAllLocaions: function (resolve, reject) {
            // Calling service to get the Factory location, Demand loaction, config and partial products data
            sap.ui.core.BusyIndicator.show();
            
            this.getOwnerComponent().getModel("BModel").callFunction("/getfactorylocdescNew", {
                method: "GET",
                 headers: {
                 "x-user-id": that.getUser(),
                 },
                success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();

                    that.oLocData = JSON.parse(oData.getfactorylocdescNew);

                      if(that.oLocData.length >0){
                        that.oLocData = that.oLocData.filter(f=>f.CREATE == 1);
                      }
                        that.oGModel.setProperty("/homeAllLocationData", that.oLocData);
                        that.allLoc = "X";
                        resolve(true);
                    
                },
                error: function (oData, error) {
                    MessageToast.show("error");
                }
            });
        },

        getAProducts:function(resolve, reject){
            
                sap.ui.core.BusyIndicator.show();
               
            
                this.getOwnerComponent().getModel("BModel").callFunction("/genPartialProdNew", {
                    method: "GET",
                    
                    success: function (oData) {
                                sap.ui.core.BusyIndicator.hide();

    
                        that.ConfProdall = JSON.parse(oData.genPartialProdNew)
    
                            that.oGModel.setProperty("/homeAllLocationProductData", that.oLocData);
                             that.allProd = "X";
                            resolve(true);
                        
                    },
                    error: function (oData, error) {
                        MessageToast.show("error");
                    }
                });
        },

        onNavPress: function () {
            if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                // generate the Hash to display 
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "VCPDocument",
                        action: "Display"
                    }
                })) || "";
                var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
                oStorage.put("nodeId", 78);
                //Generate a  URL for the second application
                var url = window.location.href.split('#')[0] + hash;
                //Navigate to second app
                sap.m.URLHelper.redirect(url, true);
            }
        },








            });
        });
    