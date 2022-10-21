sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"ula/mes/common/crypt/lza"
],
	function(JSONModel, lza) {
		"use strict";

		return {
			'id': "app",
			'owner': null,
			'mode': "DEF",
			'navLinks': [],
			'navTarget': {},
			'create': function(oCaller, oParam) {
				var f = oCaller.getComponentData().startupParameters;
				this.mode = (f && f.mode) ? f.mode[0] : "DEF";
				this.navLinks['MAINT'] = { 'semobj': 'ZMES_ORDER', 'intent': 'maintain' };
				this.navLinks['DEF'] = { 'semobj': 'ZMES_ORDER', 'intent': 'maintain' };
				this.navTarget = (this.navLinks[this.mode]) ? this.navLinks[this.mode] : null;
				return $.Deferred().resolve(new JSONModel({
					cssClass: sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact",
					userId: "",
					firstName: "",
					lastName: "",
					fullName: "",
					email: "",
					mode: this.mode,  //default - Authoring
					busy: false,
					delay: 0,
					layout: "OneColumn",
					//layout : "TwoColumnsMidExpanded",
					previousLayout: "",
					actionButtonsInfo: {
						midColumn: {
							fullScreen: false
						}
					}
				})
				);

			},
			'getNav': function() {
				return this.navTarget;
			},
			'set': function(model, owner) {
				this['owner'] = owner || sap.ui.getCore();
				this['owner']['setModel'](model, this.id);
			},
			'setContextData': function(oData) {
				this['get']()['oData'] = oData;
				this['get']()['oData'].mode = this.mode;
				this['get']()['oData'].busy = false;
				this['get']()['oData'].delay = 0;
				this['get']()['oData'].layout = "OneColumn";
				this['get']()['oData'].previousLayout = "";
				this['get']()['oData'].actionButtonsInfo = {
					midColumn: {
						fullScreen: false
					}
				};

				this['get']().refresh(true);
			},
			'get': function() {
				return this['owner']['getModel'](this.id);
			},
			setMode: function(mode) {
				this['get']().setProperty("/mode", mode);
			},
			getMode: function(mode) {
				return this['get']().oData.mode;
			},
			'setAppNotBusy': function() {
				this['get']().setProperty("/busy", false);
				this['get']().setProperty("/delay", false);
			},
			'setLayoutTwoColumns': function() {
				this['get']().setProperty("/layout", "TwoColumnsMidExpanded");
			},
			'setLayoutOneColumn': function() {
				this['get']().setProperty("/layout", "OneColumn");
				//				this.get().setProperty("/layout", "TwoColumnsMidExpanded");
			},
			'toggleFullScreen': function() {
				var _layout = this['get']();
				var bFullScreen = _layout.getProperty("/actionButtonsInfo/midColumn/fullScreen");
				_layout.setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
				if (!bFullScreen) {
					_layout.setProperty("/previousLayout", _layout.getProperty("/layout"));
					_layout.setProperty("/layout", "MidColumnFullScreen");
				} else {
					// reset to previous layout
					_layout.setProperty("/layout", _layout.getProperty("/previousLayout"));
				}
			},
			'navigate': function(oCtx, caller) {
				var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

				return (this.navTarget)?oCrossAppNav.toExternal({
					target: { semanticObject: this.navTarget.semobj, action: this.navTarget.intent },
					params: { "OrderNo": oCtx.OrderNo, "OrderRevNo": oCtx.OrderRevNo,  caller: lza.compressToEncodedURIComponent(this.owner.sId) }
				}):false;

			}

		};
	});