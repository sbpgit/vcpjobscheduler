sap.ui.define([
	"vcpapp/vcpjobschedulersequence/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator) {
	"use strict";
	var that, oGModel;

	return BaseController.extend("vcpapp.vcpjobschedulersequence.controller.ItemMaster", {
		

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf vcpapp.vcpjobschedulersequence.view.ItemMaster
		 */
		onInit: function () {
			that = this;
			that.oListModel = new JSONModel();
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("data", "refreshMaster", this.refreshMaster, this);
			this.bus.publish("nav", "toBeginPage", {viewName: this.getView().getProperty("viewName")});
		},

		/** 
		 * Called when the App is closed or the page is replaced
		 */
		onExit: function () {
			this.bus.unsubscribe("data", "refreshMaster", this.refreshMaster, this);
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf vcpapp.vcpjobschedulersequence.view.ItemMaster
		 */
		onAfterRendering: function () {
			oGModel = this.getModel("oGModel");
			// this.i18n = this.getResourceBundle();
			that.oList = this.byId("idVariantList");
			that.oList.removeSelections();
			this.byId("idVariantSearch").setValue();
			if (that.oList.getBinding("items")) {
				that.oList.getBinding("items").filter([]);
			}

			that.getData();

			//Authorization to hide&show Job feed
			//  that.byId("btnCreateJobFeed").setVisible(false);
			// let aData = oGModel.getProperty("/homeAllLocationData");
			// if(aData && aData.length>0){
			//  if(aData.findIndex(f=>f.CREATE == 1) != -1){//Show create job
            //      that.byId("btnCreateJobFeed").setVisible(true);
            //      }
			// }
		},
		getData:function(){
			sap.ui.core.BusyIndicator.show();
            that.getModel("JSModel").read("/readTemplates", {
				filters: [
                    new Filter("VARIANT_NAME", FilterOperator.NE, 'NA'),
                    // new Filter("VARIANT_NAME", FilterOperator.NE, ""),
                ],
                and: true,
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					oData.results = oData.results.filter(el=> el.VARIANT_NAME !== "");
					oGModel.setProperty("/Data", oData.results);
					that.oListModel.setData({
						Variantresults: oData.results
					});
					that.oList.setModel(that.oListModel);
					jQuery("#" + that.getView().byId("idVariantSearch").getId() + "-I").focus();


				},
				error: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed to get variant data");
				}
			});	
		},
		/** 
		 * Called when something is entered into the search field
		 * @param {object} oEvent -the event information
		 */
		variantSearch: function (oEvent) {
			// that.setCurrentSelectedItem();
			var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query"),
				oBinding = that.oList.getBinding("items"),
				aFilters = [];

			if (sQuery && sQuery.trim() !== "") {
				sQuery = sQuery.trim();
				aFilters.push(new Filter({
					filters: [
						new Filter("VARIANT_NAME", FilterOperator.Contains, sQuery)
					],
					and: false
				}));
			}
			if (oBinding) {
				oBinding.filter(aFilters);
			}
		},

		/** 
		 * Called when a spool item is pressed
		 * @param {object} oEvent - the event info
		 */
		onhandleVariantPress: function (oEvent) {
			var oBinding = "";
			// var oBinding = oEvent.getParameter("listItem").getBindingContext();
			if(oEvent.getSource().getBindingContext()){
				 oBinding = oEvent.getSource().getBindingContext().getObject();
			} else {
				oBinding = oEvent.getSource().getSelectedItems()[0].getBindingContext().getObject();
			}
			
			var selButton = oEvent.getParameters().id;
			// if(selButton.includes("idEditJF")){
			// 	oGModel.setProperty("/copy", "");
			// } else {
			// 	oGModel.setProperty("/copy", "X");
			// }

			if(selButton.includes("idCopy")){
				oGModel.setProperty("/copy", "X");
				oGModel.setProperty("/VariantNameFlag", "X");
			} else {
				oGModel.setProperty("/copy", "");
				oGModel.setProperty("/VariantNameFlag", "");
			}

			
			// oGModel.setProperty("/selVariant", oBinding.getProperty());
			oGModel.setProperty("/selVariant", oBinding);
			oGModel.setProperty("/variantEditFlag", "X");


			var table = that.byId("idVariantList").getItems();

			for(var t=0; t<table.length; t++){

				if(table[t].getCells()[0].getText() === oBinding.VARIANT_NAME){
					that.byId("idVariantList").setSelectedItem(table[t],true);
					break;
				}

			}
			

			this.getOwnerComponent().runAsOwner(function () {
				if (!that.oDetailView) {
					try {
						that.oDetailView = sap.ui.view({
							viewName: "vcpapp.vcpjobschedulersequence.view.ItemDetail",
							type: "XML"
						});
						that.bus.publish("flexible", "addDetailPage", that.oDetailView);
						that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					} catch (e) {
						// MessageToast.show(that.i18n.getText("getItemDetailErr"));
						that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					
					that.oDetailView.onAfterRendering();
					}
				} else {
					that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					
					that.oDetailView.onAfterRendering();
					
				}
			});
		},

		CreateVarient:function(oEvent){


			oGModel.setProperty("/selVariant", "");
			oGModel.setProperty("/variantEditFlag", "");
			oGModel.setProperty("/VariantNameFlag", "X");
			that.oList.removeSelections();
			this.getOwnerComponent().runAsOwner(function () {
				if (!that.oDetailView) {
					try {
						that.oDetailView = sap.ui.view({
							viewName: "vcpapp.vcpjobschedulersequence.view.ItemDetail",
							type: "XML"
						});
						that.bus.publish("flexible", "addDetailPage", that.oDetailView);
						that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					} catch (e) {
						// MessageToast.show(that.i18n.getText("getItemDetailErr"));
						that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					
					that.oDetailView.onAfterRendering();
					}
				} else {
					that.bus.publish("nav", "toDetailPage", {viewName: that.oDetailView.getViewName()});
					
					that.oDetailView.onAfterRendering();
					
				}
			});

		},

		/** 
		 * Function to refresh the data based on some activity
		 * from the detail level
		 */
		refreshMaster: function () {
			this.onAfterRendering();
		},

		
		OnDelete: function (oEvent) {
			var selvariant = oEvent.getSource().getParent().getBindingContext().getObject().VARIANT_NAME;

			// Getting the conformation popup before deleting		
			var text = "Do you want to remove job feed" + " - " + selvariant;
			sap.m.MessageBox.show(
				text, {

					title: "Conformation",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {

							sap.ui.core.BusyIndicator.show();
								that.getModel("JSModel").callFunction("/deleteVariant", {
									method: "GET",
									urlParameters: {
										VARIANT_NAME : selvariant
									},
									success: function (oData) {
										sap.ui.core.BusyIndicator.hide();
										MessageToast.show("Job Feed Deleted successfuly");
										that.byId("idVariantList").removeSelections();
										that.bus.publish("flexible", "exitScreen");
										that.onAfterRendering();
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

			
		}








	});
});