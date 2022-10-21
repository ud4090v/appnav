sap.ui.define([
	"ula/mes/order/model/model-app",
	"ula/mes/order/model/model-ord",
	"ula/mes/common/model/modelsController"
],

	function(mApp, mOrd, mController) {
		"use strict";

		return {
			initializeModels: function(controller) {

				var _promise = $.Deferred();
				var _modelsInitialized = [];
				var _root = controller;

				//	_modelsInitialized.push(mController.init({model:mConfig}));
				mController.init({ model: mApp, owner: _root })
					.done(function(model) {
						mController.init({ model: mOrd, param: _root.getMetadata().getConfig() })
							.done(function(model) {
								(model)?model.init():false;
							});

					});

				//				mController.init({ model: mDevice, owner: _root });


				$.when.apply($, _modelsInitialized).then(function(data) {
					_promise.resolve(data);
				})

				return _promise;

			},

			getMain: function() {
				return mOrd;
			},
			getApp: function() {
				return mApp;
			}
		};
	});