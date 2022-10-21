jQuery.sap.registerModulePath("ula/mes/common", "/sap/bc/ui5_ui5/sap/zmes_common");
sap.ui.define([
	"sap/base/util/UriParameters",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"ula/mes/order/model/models",
	"sap/f/library",
	"ula/mes/common/model/Utils"
], function(UriParameters, UIComponent, JSONModel, modelController, library, CommonUtils) {
	"use strict";

	var Component = UIComponent.extend("ula.mes.order.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			var self = this;
			
			UIComponent.prototype.init.apply(this, arguments);
			//CommonUtils.loadPersonalization( this.getManifestEntry("sap.app").id, this );
			// CommonUtils.loadPersonalization( CommonUtils.PersonalizationID, this );
			$.when(modelController.initializeModels(this))
				.then(function(response) {

					modelController.getMain().get().attachRequestCompleted(function(oEvent) {
						sap.ui.getCore().getEventBus().publish("mesOrder", "loadCompleted");
					})

					/*
					modelController.getMain().getContext()
						.done(function(oData, response) {
							var _ctx = modelController.getApp();
							_ctx.setContextData(oData);
							self.getRouter().initialize();
						})
						*/
					self.getRouter().initialize();
				});
		}
	});
	return Component;
});
