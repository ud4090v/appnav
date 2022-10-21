sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"ula/mes/common/controller/baseController",
	"sap/ui/model/Filter",
	"ula/mes/order/model/model-ord",
	"ula/mes/order/model/model-app",
	"ula/mes/order/model/FilterUtil",
	"sap/ui/util/Storage",
	"sap/ui/core/Fragment",
	'sap/ui/model/Sorter',
	"ula/mes/common/model/Utils"
], function(JSONModel, Controller, Filter, mOrd, mApp, FilterUtil, Storage, Fragment, Sorter, CommonUtils) {
	"use strict";
	var controller, component;

	return Controller.extend("ula.mes.order.controller.ResultTable", {

		onPressAuth: function(oEvent) {
			// call model funct Import to trigger cal
		},

		onInit: function() {
			controller = this;
			component	= controller.getOwnerComponent();

			component.setModel(new JSONModel(), "FavouritesModel");

			CommonUtils.getPersonalizationValue("Favourites").then( function(data) {
				component.getModel("FavouritesModel").setProperty("/Map", data);
			} );
			//var f = this.getOwnerComponent().getComponentData().startupParameters;
			//if (f && f.mode) mApp.setMode( f.mode[0] );
			this.getView().setModel(mOrd.get(), "backend");

			this.getView().setModel(new JSONModel({
				Month: "",
				OrderSrc: "",
			}), "FilterModel");

			this.getView().setModel(new JSONModel(Storage.get("FilterModelHistoryList") || []), "FilterModelHistoryList");

		},

		applyFilter: function(oEVent) {
			var aHistory = Storage.get("FilterModelHistoryList") || [];

			var aFilters = FilterUtil.prepareFilters(this.getView().getModel("FilterModel").getData());

			aHistory.unshift(this.getView().getModel("FilterModel").getData());

			if (aHistory.length >= 5) {
				aHistory = aHistory.slice(0, 5);
			}


			Storage.put("FilterModelHistoryList", aHistory);
			this.getView().getModel("FilterModelHistoryList").setData(aHistory);

			this.byId("ordersTable").getBinding("items").filter(aFilters);
		},
//*
		loadHistory: function(oEvent) {
			var oHistoryFilter = oEvent.getSource().getBindingContext("FilterModelHistoryList").getObject();
			this.getView().getModel("FilterModel").setData(oHistoryFilter);
			var aFilters = FilterUtil.prepareFilters(oHistoryFilter);

			this.byId("ordersTable").getBinding("items").filter(aFilters);
		},

		onListItemPress: function(oEvent) {
			return mApp.navigate(oEvent.getSource().getBindingContext("backend").getObject());
		},
		handleSortButtonPressed: function () {

			var fnOpenDialog = function() {
				controller.byId("SortDialog").open();
			};

			if (!controller.byId("SortDialog")) {
				Fragment.load({
					id: controller.getView().getId(),
					name: "ula.mes.order.view.SortDialog",
					controller: controller
				}).then(function (oDialog) {
					controller.getView().addDependent(oDialog);
					fnOpenDialog();
				});
			} else {
				fnOpenDialog();
			}
		},
		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("ordersTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			if(oBinding!=undefined){
				oBinding.sort(aSorters);
			}
		},
		onReset : function(){
			controller.byId("Material").setValue("");
			controller.byId("OrderSrc").setValue("");			
			controller.byId("Tokenizer").destroyTokens();
			controller.getView().getModel("FilterModel").setData({});

			sap.ui.core.BusyIndicator.show(0);

			setTimeout(function(){
				controller.getView().setModel(new JSONModel({
					Month	: controller.byId("Material").getValue() || '',
					OrderSrc : controller.byId("OrderSrc").getValue() || ''
				}), "FilterModel1");

				var aFilters = FilterUtil.prepareFilters( controller.getView().getModel("FilterModel1").getData());
				controller.byId("ordersTable").getBinding("items").filter(aFilters);
				sap.ui.core.BusyIndicator.hide();

				Storage.put("FilterModelHistoryList", []);
			}, 200);
		},

		onFavList : function(oEvent) {			
			
			var	favMap   = 
				window.location.host.indexOf("localhost") === 0 ? 
				{  "50012311" : {}, "50012386" : {}, "50012379" : {} } : 
				component.getModel("FavouritesModel").getProperty("/Map"),

			aFavList = Object.keys(favMap).map(function (group){
				return new Filter("Group", 'EQ', group);
			});

			if ( oEvent.getParameter("pressed")) {
				controller.byId("ordersTable").getBinding("items").filter( new Filter( { filters: aFavList , and : false } ) );
			} else {
				controller.byId("ordersTable").getBinding("items").filter()
			}
		}
	});
});
