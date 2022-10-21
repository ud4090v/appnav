sap.ui.define([
	"ula/mes/common/controller/baseController",
	"ula/mes/order/model/model-app"
], function(Controller, mApp) {
	"use strict";


	return Controller.extend("ula.mes.order.controller.App", {

		onInit: function() {
			var self = this;
			this.formatter.loadPersonalization( this.formatter.PersonalizationID, this.getOwnerComponent());
			this.getOwnerComponent().getService("ShellUIService").then(
				function(oService){
					oService.setTitle(self.getResourceBundle().getText("appTitle_"+mApp.getMode()))
				}
			)
		}

	});
});