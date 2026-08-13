sap.ui.define([
	"vcpapp/vcpjobschedulersequence/controller/BaseController"
], function (BaseController) {
	"use strict";
	var that, oGModel;
	return BaseController.extend("vcpapp.vcpjobschedulersequence.controller.Details", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf vcpapp.vcpjobschedulersequence.view.Details
		 */
		onInit: function () {
			that = this;
			that.oGModel = that.getOwnerComponent().getModel("oGModel");
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("flexible", "addBeginPage", this.addBeginPage, this);
			this.bus.subscribe("flexible", "addDetailPage", this.addDetailPage, this);
			this.bus.subscribe("nav", "toBeginPage", this.toBeginPage, this);
			this.bus.subscribe("nav", "toDetailPage", this.toDetailPage, this);
			this.bus.subscribe("nav", "backToBegin", this.backToBegin, this);

			this.bus.subscribe("flexible", "setMasterPage", this.setMasterPage, this);
            this.bus.subscribe("flexible", "buttonVisible", this.buttonVisible, this);
            this.bus.subscribe("flexible", "exitScreen", this.exitScreen, this);

			this.oFlexibleColumnLayout = this.byId("fcl");
			this.getRouter().getRoute("Details").attachPatternMatched(this._onPatternMatched, this);
		},

		// onAfterRendering:function(){
		// 	that.byId("fcl").mAggregations._midColumnForwardArrow.setIcon("sap-icon://decline");
		// 	// that.byId("fcl").mAggregations._midColumnForwardArrow.attachBrowserEvent("click", that.exitScreen.bind(that));
		// 	that.byId("fcl").mAggregations._midColumnForwardArrow.attachPress("click", that.exitScreen.bind(that));

		// },

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf vcpapp.vcpjobschedulersequence.view.Details
		 */
		onExit: function () {
			this.bus.unsubscribe("flexible", "addBeginPage", this.addBeginPage, this);
			this.bus.unsubscribe("flexible", "addDetailPage", this.addDetailPage, this);
			this.bus.unsubscribe("nav", "toBeginPage", this.toBeginPage, this);
			this.bus.unsubscribe("nav", "toDetailPage", this.toDetailPage, this);
			this.bus.unsubscribe("nav", "backToBegin", this.backToBegin, this);
		},

		/** 
		 * Navigates to Home page
		 */
		onNavBack: function (flag) {
			if(flag !== "X"){
				that.bus.publish("data", "Destroy");
			}
			this.getRouter().navTo("Home", {}, true);
		},

		/** 
		 * To set the master page
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		addBeginPage: function (sChannel, sEvent, oView) {
			this.oFlexibleColumnLayout.addBeginColumnPage(oView);
		},

		/** 
		 * Lazy loader for the mid page - only on demand (when the user clicks)
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		addDetailPage: function (sChannel, sEvent, oView) {
			var aPages = this.oFlexibleColumnLayout.getMidColumnPages();
			var flag = false;
			for (var i = 0; i < aPages.length; i++) {
				if (aPages[i].getProperty("viewName") === oView.getViewName()) {
					flag = true;
					break;
				} else {
					flag = false;
				}
			}
			if (!flag) {
				this.oFlexibleColumnLayout.addMidColumnPage(oView);
			}
		},

		/** 
		 * To initialize master page
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		toBeginPage: function (sChannel, sEvent, oView) {
			var aPages = this.oFlexibleColumnLayout.getBeginColumnPages();
			for (var i = 0; i < aPages.length; i++) {
				if (aPages[i].getProperty("viewName") === oView.viewName) {
					this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[i]);
				}
			}
		},

		/** 
		 * To get the required detail page
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		toDetailPage: function (sChannel, sEvent, oView) {
			var aPages = this.oFlexibleColumnLayout.getMidColumnPages();
			for (var i = 0; i < aPages.length; i++) {
				if (aPages[i].getProperty("viewName") === oView.viewName) {
					this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[i]);
				}
			}
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
		},

		/** 
		 * To show only the master page
		 */
		backToBegin: function () {
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},

		/** 
		 * Called when the URL matches pattern "Details"
		 * @constructor 
		 */
		_onPatternMatched: function () {
			that = this;
			that.oGModel = that.getOwnerComponent().getModel("oGModel");
			if(that.oGModel.getProperty("/auth") === undefined || that.oGModel.getProperty("/auth") === null || 
            that.oGModel.getProperty("/auth") === ""){
                sap.ui.core.BusyIndicator.show();
			var flag = "X";
                that.onNavBack(flag);
                return;
            } else {
			
				this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
				var aPages = this.oFlexibleColumnLayout.getBeginColumnPages();
				if (aPages.length < 1) {
					this.getOwnerComponent().runAsOwner(function () {
						this.masterView = sap.ui.view({
							viewName: "vcpapp.vcpjobschedulersequence.view.ItemMaster",
							type: "XML"
						});
						this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView);
					}.bind(this));
				} else {
					this.oFlexibleColumnLayout.toBeginColumnPage(aPages[0]);
					// aPages[0].onAfterRendering();
				}
			}
			
		},

		buttonVisible:function(){
			that.byId("fcl").mAggregations._midColumnForwardArrow.setVisible(true);
			that.byId("fcl").mAggregations._midColumnForwardArrow.setIcon("sap-icon://decline");
			// that.byId("fcl").mAggregations._midColumnForwardArrow.attachBrowserEvent("click", that.exitScreen.bind(that));
			that.byId("fcl").mAggregations._midColumnForwardArrow.attachPress("click", that.exitScreen.bind(that));
		},
		exitScreen:function(){
			that.byId("fcl").mAggregations._midColumnForwardArrow.setVisible(false);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		
				
		}
	});
});