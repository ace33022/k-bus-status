/**
 *
 * @description K-Bus Status
 *
 * @version 2018/10/05 初始版本。
 *
 * @author ace
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator|Navigator | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation|Navigator.geolocation | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation|Geolocation | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition|Geolocation.getCurrentPosition() | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition|Geolocation.watchPosition() | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/clearWatch|Geolocation.clearWatch() | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API|Geolocation API | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Position|Position | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions|PositionOptions | MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Coordinates|Coordinates | MDN}
 *
 * @see {@link http://requirejs.org/|RequireJS}
 *
 * @see {@link https://jquery.com/|jQuery}
 *
 * @see {@link https://getbootstrap.com/|Bootstrap · The most popular HTML, CSS, and JS library in the world.}
 *
 * @see {@link http://underscorejs.org/|Underscore.js}
 * @see {@link https://github.com/jashkenas/underscore|jashkenas/underscore: JavaScript's utility _ belt}
 *
 * @see {@link http://backbonejs.org/|Backbone.js}
 * @see {@link https://github.com/jashkenas/backbone|jashkenas/backbone: Give your JS App some Backbone with Models, Views, Collections, and Events}
 * @see {@link https://github.com/jashkenas/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites|Tutorials, blog posts and example sites · jashkenas/backbone Wiki}
 *
 * @see {@link https://www.openstreetmap.org/|OpenStreetMap}
 * @see {@link https://en.wikipedia.org/wiki/OpenStreetMap|OpenStreetMap - Wikipedia}
 *
 * @see {@link https://leafletjs.com/|Leaflet - a JavaScript library for interactive maps}
 * @see {@link https://github.com/Leaflet/Leaflet|Leaflet/Leaflet: JavaScript library for mobile-friendly interactive maps}
 *
 * @see {@link https://leafletjs.com/reference-1.3.4.html|Documentation - Leaflet - a JavaScript library for interactive maps}
 * @see {@link https://leafletjs.com/reference-1.4.0.html|Documentation - Leaflet - a JavaScript library for interactive maps}
 *
 * @see {@link https://leafletjs.com/examples/layers-control/|Layer Groups and Layers Control - Leaflet - a JavaScript library for interactive maps}
 * @see {@link https://leafletjs.com/examples/custom-icons/|Markers With Custom Icons - Leaflet - a JavaScript library for interactive maps}
 *
 * @see {@link https://www.tutorialspoint.com/leafletjs|LeafletJS Tutorial}
 *
 */

Configurations.loadJS(Configurations.requirejsFile, function() {

	requirejs.config(tw.ace33022.RequireJSConfig);

	requirejs(["tw.ace33022.util.browser.FormUtils", "tw.ace33022.util.browser.ReUtils", "toastr", "leaflet.EasyButton"], function(FormUtils, ReUtils, toastr) {

		function updateMarker(routeId, data) {

			var divIcon, marker;

			var index;

			var layerExisted = false;

			for (index = 0; index < baseLayerGroup.getLayers().length; index++) {

				if (data["bus_id"] === baseLayerGroup.getLayers()[index]["busId"]) {

					layerExisted = true;

					baseLayerGroup.getLayers()[index].setLatLng(L.latLng(data["latitude"], data["longitude"]));
				}

				if (layerExisted) break;
			}

			if (layerExisted === false) {

				divIcon = L.divIcon({"iconSize": [25, 16], "className": "bus-marker", "html": '<b>' + routeId + '</b>'});
				marker = new L.marker([data["latitude"], data["longitude"]], {"icon": divIcon});

				marker.routeId = routeId;
				marker.busId = data["bus_id"];

				marker.addTo(baseLayerGroup);
			}
		}

		function removeMarker(routeId, data) {

			var index;

			var arrRemoveLayer = new Array();

			for (index = 0; index < baseLayerGroup.getLayers().length; index++) {

				if (routeId == baseLayerGroup.getLayers()[index]["routeId"]) {

					if (typeof data.find(function(element) { return baseLayerGroup.getLayers()[index]["busId"] === element["bus_id"]; }) === 'undefined') arrRemoveLayer.push(baseLayerGroup.getLayers()[index]);
				}
			}

			arrRemoveLayer.forEach(function(currentValue, index) { baseLayerGroup.removeLayer(currentValue); });
		}

		var selfPosition = {	// 文化中心

			"latitude": 22.629064073498643,
			"longitude": 120.31848907470705
		};

		var easySuggestionButton = L.easyButton({

			states: [
				{
					"stateName": "suggestion",
					"title": "give me suggestion",
					"icon": "fa-comments",
					"onClick": function(btn, map) {

						requirejs(["tw.ace33022.util.browser.FormUtils"], function(FormUtils) {

							FormUtils.showTextareaModal({

								"title": "問題回報／建議事項",
								"callback": function(value) {

									var errorCode;

									FormUtils.showMarqueebar(

										'資料處理中‧‧‧',
										function(closeMarqueebar) {

											jQuery.ajax({

												// "contentType": "application/json; charset=utf-8",
												"dataType": "json",
												"url": "https://script.google.com/macros/s/AKfycbyb8uWw9-q_z_wN3fwUd1sqk4bTRrfqYjpV152K-A/exec",
												"data": value,
												"type": "POST",
												"success": function(data, textStatus, jqXHR) {

													errorCode = data["error_code"];

													closeMarqueebar();
												},
												"error": function(jqXHR, textStatus, errorThrown) {

													closeMarqueebar();
												}
											});
										},
										function() {

											if (typeof errorCode != 'undefined') {

												if (errorCode === 0) {

													FormUtils.showMessage('感謝您的建議！！');
												}
												else {

													FormUtils.showMessage('資料處理過程有誤！');
												}
											}
											else {

												FormUtils.showMessage('資料處理過程有誤！');
											}
										}
									);
								}
							});
						});
					}
				}
			]
		});

		/**
		 *
		 * @see {@link http://api.jquery.com/jquery.each/|jQuery.each() | jQuery API Documentation}
		 * @see {@link http://api.jquery.com/each/|.each() | jQuery API Documentation}
		 *
		 * @see {@link https://blog.miniasp.com/post/2009/03/25/location-href-and-location-replace-in-practice|細談 location.href 與 location.replace 的差別與實務應用 | The Will Will Web}
		 *
		 * @see {@link http://seanbearusb.blogspot.com/2016/06/bs3-button-group.html|熊伯的外接硬碟: BS3 Button Group}
		 *
		 */
		var easySelectBusIdButton = L.easyButton({

			states: [
				{
					"stateName": "select-bus-id",
					"title": "select bus id",
					"icon": "fa-check",
					"onClick": function(btn, map) {

						requirejs(["tw.ace33022.util.browser.FormUtils"], function(FormUtils) {

							var arrAllBusId = ["3", "5", "6", "7", "11", "12", "15", "16", "23", "24", "25", "26", "28", "29", "30", "33", "35", "36", "37", "38", "39", "50", "52", "53", "56", "60", "62", "69", "70", "72", "73", "76", "77", "81", "82", "83", "87", "88", "90", "92", "96", "97", "98", "99", "100"];

							var result = false;

							var btnConfirmId = 'btnConfirm' + Math.random().toString(36).substr(2, 6);

							var modalHeader, modalBody, modalFooter;
							var baseModal;

							var btnToolbar = jQuery('<div class="btn-toolbar" role="toolbar"></div>');

							arrAllBusId.forEach(function(element) {

								btnToolbar.append('<input type="button" class="btn" style="margin-top: 2px; margin-bottom: 2px;" value="' + element + '" />');
							});

							tag = '<div class="modal-header">'
									+ '  <h4 class="modal-title" style="text-align: center;">公車代號</h4>'
									+ '</div>';
							modalHeader = jQuery(tag);

							modalBody = jQuery('<div class="modal-body"></div>');
							modalBody.append(btnToolbar);

							arrBusId.forEach(function(element) { modalBody.find('input[value="' + element + '"]').addClass('btn-primary'); });

							tag = '<div class="modal-footer">'
									+ '  <button type="button" id="' + btnConfirmId + '" class="btn btn-primary">確認</button>'
									+ '  <input type="button" class="btn" data-dismiss="modal" value="取消" />'
									+ '</div>';
							modalFooter = jQuery(tag);

							baseModal = FormUtils.addBaseModal(modalHeader, modalBody, modalFooter);

							modalBody.find('input[type="button"]').on('click', function(event) {

								if (jQuery(this).hasClass('btn-primary') === true) {

									jQuery(this).removeClass('btn-primary');
								}
								else {

									// limit 10 selection
									if (modalBody.find('.btn-primary').length < 10) jQuery(this).addClass('btn-primary');
								}
							});

							baseModal.on('shown.bs.modal', function() {

								jQuery('#' +btnConfirmId).on('click', function(event) {

									result = true;

									baseModal.modal('hide');
								});
							});

							baseModal.on('hidden.bs.modal', function() {

								var url = new String(location.origin + location.pathname) + '?';
								
								modalBody.find('.btn-primary').each(function(index, element) {

									if (index !== 0) url += '&';

									url += 'bus_id=' + jQuery(element).prop('value');
								});

								jQuery(this).remove();

								if ((result === true) && (modalBody.find('.btn-primary').length !== 0)) {

									FormUtils.showConfirmMessage(

										'重新以選擇的資料載入網頁(建議加入我的最愛方便日後查詢)？',
										function() {

											location.replace(url);
										},
										function() {
										}
									);
								}
							});

							baseModal.modal('show');
						});
					}
				}
			]
		});

		var mapId = 'map' + Math.random().toString(36).substr(2, 6);
		var map = null;
		var baseLayerGroup = new L.layerGroup();

		var arrBusId = new Array();

		if (typeof ReUtils.getURLParameters()["parameters"]["bus_id"] !== 'undefined') arrBusId = ReUtils.getURLParameters()["parameters"]["bus_id"];

		if (arrBusId.length == 0) arrBusId = ["70", "81", "100"];

		var tag;

		jQuery('body').append('<div class="container-fluid" style="height: 100%;"></div>');

		if ((location.protocol == 'http:') || (location.protocol == 'https:')) {

			tag = '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>'
					+ '<!-- k-bus-status -->'
					+ '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2244483882494685"	data-ad-slot="1204238754"	data-ad-format="auto" data-full-width-responsive="true"></ins>'
					+ '<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>';
			jQuery(jQuery('.container-fluid')[0]).append(tag);
			
			jQuery(jQuery('.container-fluid')[0]).append('<div id="' + mapId + '" class="row" style="height: 85%;"></div>');
		}
		else {
		
			jQuery(jQuery('.container-fluid')[0]).append('<div id="' + mapId + '" class="row" style="height: 100%;"></div>');
		}

		map = L.map(mapId);

		// set map tiles source
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

				// attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
				maxZoom: 18
			}
		).addTo(map);

		baseLayerGroup.addTo(map);

		easySelectBusIdButton.addTo(map);
		easySuggestionButton.addTo(map);

		map.setView([selfPosition["latitude"], selfPosition["longitude"]], 16);

		if (typeof window.navigator.geolocation !== 'undefined') {

			window.navigator.geolocation.getCurrentPosition(

				function(position) {

					selfPosition = {

						"latitude": position.coords.latitude,
						"longitude": position.coords.longitude
					};

					map.setView([selfPosition["latitude"], selfPosition["longitude"]], 16);
				},
				function(positionError) {

				}
			);
		}

		/**
		 *
		 * @see {@link https://www.w3schools.com/jsref/met_win_setinterval.asp|Window setInterval() Method}
		 *
		 * @see {@link https://api.jquery.com/jQuery.parseXML/|jQuery.parseXML() | jQuery API Documentation}
		 *
		 */
		setInterval(

			function() {

				// var url = 'https://data.kcg.gov.tw/dataset/bus-real-time-dynamic/resource/a53853fe-469f-4a82-a832-5d9e4aa5e5e7/proxy';
				var url = 'https://script.google.com/macros/s/AKfycbxbaDyua8RnpdNqNZ6WRN69hm4W7KwG72LW_ljA/exec?';

				arguments[0].forEach(function(element, index) {

					if (index !== 0) url += '&';

					url += 'bus_id=' + element;
				});

				jQuery.ajax({

					"url": url,
					// "dataType": "xml",
					"dataType": "json",
					"success": function(data, textStatus, jqXHR) {

						if (data["error_code"] === 0) {

							jQuery.each(data["data"], function(name, value) {

								value.forEach(function(element) { updateMarker(name, element); });

								removeMarker(name, value);
							});
						}
						else {

							// console.log(data["error_message"]);
						}
					},
					"error": function(jqXHR, textStatus, errorThrown) {

						console.log('error');
					}
				});
			},
			10 * 1000,
			arrBusId
		);
	});
});