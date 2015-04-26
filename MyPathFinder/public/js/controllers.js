'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
        .controller('MyCtrl1', ['$scope', '$resource', '$filter', function($scope, $resource,$filter) {
        	
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        	$scope.refresh = function() {
        		$scope.properties_to_be_matched=[];
        	    $scope.sortingOrder = "niin";
        	    $scope.reverse = false;
        	    $scope.filteredItems = [];
        	    $scope.groupedItems = [];
        	    $scope.itemsPerPage = 5;
        	    $scope.pagedItems = [];
        	    $scope.currentPage = 0;
                $scope.query = "";
                $scope.results = {};
                $scope.nsnUri = '';
                $scope.nsnsInClass = [];
                $scope.nsnProperties = [];
                $scope.nsnConstraints = [];
                $scope.nsnClasses = [];
                $scope.nsnSuppliers = [];
                $scope.specs = [];
                $scope.similarParts = [];
                $scope.similarMap = [];
                $scope.similarPropMap = {};
                $scope.similarsupplierMap = {};
                $scope.finalNIINs = [];
                $scope.input_prop = {};
                $scope.no_of_prop_processed = 0;
                $scope.no_of_prop = 0;
                
                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                $scope.loadCurrentLocation();               
                $scope.geocoder = new google.maps.Geocoder();
                
                //for(var req in $scope.ajaxrequests)
                //	req.abort();
                
                //$scope.ajaxrequests = [];
        	};
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        	$scope.properties_to_be_matched=[];
        	
        	$( "#search_similar" ).click(function() {
        		
        		$("input:checkbox").each(function(){
        		    var $this = $(this);

        		    if($this.is(":checked")){
        		    	$scope.properties_to_be_matched.push($this.attr("id"));
        		    }
        		});
                   $scope.querysimilarParts();  
        		});
        	
			
	     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
        	    $scope.sortingOrder = "niin";
        	    $scope.reverse = false;
        	    $scope.filteredItems = [];
        	    $scope.groupedItems = [];
        	    $scope.itemsPerPage = 5;
        	    $scope.pagedItems = [];
        	    $scope.currentPage = 0;
        	    
        	    
            
             
             
             $scope.search = function () {
            	 //alert($scope.finalNIINs.length);
            	 //alert($scope.query);
                 $scope.filteredItems = $filter('filter')($scope.finalNIINs, function (item) {
                     for(var attr in item) {
                         if (searchMatch(item[attr], $scope.query))
                             return true;
                     }
                     return false;
                 });
                 
                 
                 //alert($scope.filteredItems.length);
                 // take care of the sorting order
                 if ($scope.sortingOrder !== '') {
                     $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                 }
                 
                 //alert($scope.filteredItems.length);
                 $scope.currentPage = 0;
                 // now group by pages
                 $scope.groupToPages();
             };
             
             
        	    var searchMatch = function (haystack, needle) {
        	        if (!needle) {
        	            return true;
        	        }
        	        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        	    };
        	    
        	    // calculate page in place
        	    $scope.groupToPages = function () {
        	        $scope.pagedItems = [];
        	        
        	        for (var i = 0; i < $scope.filteredItems.length; i++) {
        	            if (i % $scope.itemsPerPage === 0) {
        	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
        	            } else {
        	                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
        	            }
        	        }
        	    };
        	    
        	    $scope.range = function (start, end) {
        	        var ret = [];
        	        if (!end) {
        	            end = start;
        	            start = 0;
        	        }
        	        for (var i = start; i < end; i++) {
        	            ret.push(i);
        	        }
        	        return ret;
        	    };
        	    
        	    $scope.prevPage = function () {
        	        if ($scope.currentPage > 0) {
        	            $scope.currentPage--;
        	        }
        	    };
        	    
        	    $scope.nextPage = function () {
        	        if ($scope.currentPage < $scope.pagedItems.length - 1) {
        	            $scope.currentPage++;
        	        }
        	    };
        	    
        	    $scope.setPage = function () {
        	        $scope.currentPage = this.n;
        	    };

        	    // functions have been describe process the data for display
        	    

        	    // change sorting order
        	    $scope.sort_by = function(newSortingOrder) {
        	        if ($scope.sortingOrder == newSortingOrder)
        	            $scope.reverse = !$scope.reverse;

        	        $scope.sortingOrder = newSortingOrder;

        	        // icon setup
        	        $('th i').each(function(){
        	            // icon reset
        	            $(this).removeClass().addClass('icon-sort');
        	        });
        	        if ($scope.reverse)
        	            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-up');
        	        else
        	            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-down');
        	    };
        	
        	
        	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			
        	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        	var mapOptions = {
        	        zoom: 4,
        	        //zoomControl: true,
        	        center: new google.maps.LatLng(40.0000, -98.0000),
        	        mapTypeId: google.maps.MapTypeId.TERRAIN
        	    };
        		$scope.origin ="";
        	    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        	    $scope.markers = [];
        	    
        	    
        	    var infoWindow = new google.maps.InfoWindow();
        	    
        	    $scope.loadCurrentLocation = function (){
        	    	google.maps.event.trigger($scope.map, 'resize');
        	    	 if(navigator.geolocation) {
        	 		    navigator.geolocation.getCurrentPosition(function(position) {
        	 		     $scope.origin = new google.maps.LatLng(position.coords.latitude,
        	 		                                       position.coords.longitude);
        	 		     var marker = new google.maps.Marker({
        			          map: $scope.map,
        			          position: $scope.origin,
        			          icon :'http://maps.google.com/mapfiles/ms/micons/yen.png',
        			          title: "Current Location" 
        			      }); 	       
        			      $scope.map.setCenter($scope.origin);
        			      
        			     
        			      //getDistance();
        			    }, function() {
        			      handleNoGeolocation(true);
        			    });
        			  } else {
        			    // Browser doesn't support Geolocation
        			    handleNoGeolocation(false);
        			  }
        	    };
        	    
        	    $scope.getMarker = function (address) {  
        	    	$scope.geocoder.geocode( { 'address': address}, function(results, status) {
        	  	    if (status == google.maps.GeocoderStatus.OK) {
        	  	    	var marker = new google.maps.Marker({
        	  	    	map: $scope.map,
        	  	        position: results[0].geometry.location,
        	  	        title: address 
        	  	      });
        	  	    } else {
        	  	    	//alert('Geocode was not successful for the following reason: ' + status);
        	  	    }
        	  	  });
        	  	};	

        	    $scope.getMarker_Similar_Locations = function(address,NIN){
        	    	$scope.geocoder.geocode( { 'address': address}, function(results, status) {
            	  	    if (status == google.maps.GeocoderStatus.OK) {
            	  	    	var marker = new google.maps.Marker({
            	  	    	map: $scope.map,
            	  	        position: results[0].geometry.location,
            	  	        icon :'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            	  	        title: address +" \n Nin# = " + NIN
            	  	      });
            	  	    } else {
            	  	    	//alert('Geocode was not successful for the following reason: ' + status);
            	  	    }
            	  	});
        	    };
        	    
        	    
        	    $scope.getDistance = function (uri,address) {
        	    	/*var v = $scope.similarsupplierMap[uri].pop();
        	    	$scope.similarsupplierMap[uri].push(v);*/
        	    	var dest = address;
        	    	
        	    	/* To calculate the distance from current location to different locations   */
        	    	var service = new google.maps.DistanceMatrixService();
        	    	var dist = service.getDistanceMatrix(
        	    		     	{		
        	    		     		origins: [$scope.origin],
        	    		     		destinations :[dest],
        	    		     		travelMode: google.maps.TravelMode.DRIVING,
        	    		     		avoidHighways: false,
        	    		     		avoidTolls: false,
        	    		     		unitSystem: google.maps.UnitSystem.IMPERIAL
        	    		     	}, 
        	    		     	function (response, status) {
        	            	    	       	            	        
        	            	    	if(status=="OK") {
        	            	    		var origins = response.originAddresses;
        	            	            var destinations = response.destinationAddresses;
        	            	    		var results = response.rows[0].elements;
        	            	    		var d = null;
        	            	    		var d_val = null;
        	            	    		for(var i =0 ; i< results.length;i++){
        	            	    				if(results[i].distance != null ){
        	            	    					d = results[i].distance.text;
        	            	    					d_val = results[i].distance.value;
        	            	    					break;
        	            	    				}
        	            	    			}
        	            	    			            	    		  	            	    		
        	            	    		
        	            	    		if(d != null){
        	            	    			
        	            	    			for(var i =0; i< $scope.finalNIINs.length ; i++){
        	            	    				if($scope.finalNIINs[i].niin == uri){
        	            	    					if($scope.finalNIINs[i].min_dist == "-"){
        	            	    						$scope.finalNIINs[i].min_dist = d;
        	            	    						$scope.finalNIINs[i].min_dist_val = d_val;
        	            	    					}
        	            	    					else{
        	            	    						if($scope.finalNIINs[i].min_dist_val > d_val){
            	            	    						$scope.finalNIINs[i].min_dist = d;
            	            	    						$scope.finalNIINs[i].min_dist_val = d_val;
        	            	    						}
        	            	    					}
        	            	    					break;
        	            	    				}
        	            	    			}
        	            	    			
            	            	    		var v = $scope.similarsupplierMap[uri];
            	            	    		for(var i =0 ; v!= null && i <v.length ;i++){
            	            	    			if(v[i].addr == address){
            	            	    				v[i].dist = d;
            	            	    			}           	            	    			            	            	    				
            	            	    		}
        	            	    		}       	            	            
        	            	    	} 
        	            	    	else {
        	            	            alert("Error: " + status);
        	            	            return 0;
        	            	        }
        	            	    }
        	    		 	);
        	    };
        	    
        	    /*callback function to get the supplier distance */
        	    
        	    $scope.getSupplierDistance = function () {
        	    	var v = $scope.nsnSuppliers.pop();
        	    	//$scope.nsnSuppliers.push(v);
        	    	var dest = v.addr;
        	    	
        	    	/* To calculate the distance from current location to different locations   */
        	    	var service = new google.maps.DistanceMatrixService();
        	    	var dist = service.getDistanceMatrix(
        	    		     	{		
        	    		     		origins: [$scope.origin],
        	    		     		destinations :[dest],
        	    		     		travelMode: google.maps.TravelMode.DRIVING,
        	    		     		avoidHighways: false,
        	    		     		avoidTolls: false,
        	    		     		unitSystem: google.maps.UnitSystem.IMPERIAL
        	    		     	}, 
        	    		     	function (response, status) {
        	            	    	       	            	        
        	            	    	if(status=="OK") {
        	            	    		var origins = response.originAddresses;
        	            	            var destinations = response.destinationAddresses;
        	            	    		var results = response.rows[0].elements;
        	            	    		
        	            	    		var d = results[0].distance.text;
        	            	    		if(d != null){
        	            	    			
            	            	    		//var a = $scope.nsnSuppliers.pop();
            	            	    		v.dist = d;
            	            	    		//alert("address = " + a.addr +"\n distance = " + a.dist);
            	            	    		$scope.nsnSuppliers.push(v);
            	            	    		
        	            	    		}
        	            	    		
        	            	            
        	            	    	} 
        	            	    	else {
        	            	            alert("Error: " + status);
        	            	            return 0;
        	            	        }
        	            	    }
        	    		 	);
        	    };
        	     
        	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                $scope.query = "";
                $scope.results = {};
                $scope.nsn = '010077988';
                $scope.nsnUri = '';
                $scope.nsnsInClass = [];
                $scope.nsnProperties = [];
                $scope.nsnConstraints = [];
                $scope.nsnClasses = [];
                $scope.nsnSuppliers = [];
                $scope.specs = [];
                $scope.similarParts = [];
                $scope.similarMap = [];
                $scope.similarPropMap = {};
                $scope.similarsupplierMap = {};
                $scope.finalNIINs = [];
                $scope.input_prop = {};
                $scope.no_of_prop_processed = 0;
                $scope.no_of_prop = 0;
                $scope.ajaxrequests = [];
                $scope.maxresult = 15;
                $scope.queryResource =
                        $resource('http://api.xsb.com/sparql/query', {}, {
                            post: {method: 'POST',
                                headers: {'Accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded'}
                            }});
                $scope.cnsResource =
                        $resource('http://api.xsb.com/company-name-standardizer/api/name/:name', {}, {
                            get: {method: 'GET',
                                headers: {'Accept': 'text/plain'},
                                transformResponse: function(data, headersGetter) {
                                    return {"stdName": data};
                                }
                            }});
                $scope.pnsResource =
                        $resource('http://api.xsb.com/partnumber-standardizer/api/partNumber/:pn', {}, {
                            get: {method: 'GET',
                                headers: {'Accept': 'text/plain'},
                                transformResponse: function(data, headersGetter) {
                                    return {"stdPn": data};
                                }
                            }});
                $scope.loadNsn = function(nsn) {
                    $scope.nsn = nsn;
                    $scope.queryNsn();
                };
                $scope.queryNsn = function() {
                	
                    var query = "SELECT * { ?n <http://xsb.com/swiss/product#nationalItemId> \"" + $scope.nsn + "\" } limit 100";
                    
                    $scope.nsnUri = "";
                    $scope.queryResource.post({}, $.param({query: query}),
                            function(e) {
                                $scope.results = e.results;
                                if (e.results && e.results.bindings && e.results.bindings[0] && e.results.bindings[0].n.value) {
                                	$scope.refresh();
                                    $scope.nsnUri = e.results.bindings[0].n.value;
                                    $scope.queryNsnProperties();
                                    $scope.nsnClasses = [];
                                    $scope.querySuperClasses($scope.nsnClasses, $scope.nsnUri);
                                    $scope.querySuppliers();
                                } else {
                                    $scope.nsnUri = 'N/A';
                                }
                            },
                            function(e) {
                            }
                    );
                    
                    
                };
                $scope.queryNsnProperties = function() {
                    var query = "SELECT distinct ?pr ?p ?v ?vr {  \n\
                                               <" + $scope.nsnUri + "> (rdfs:subClassOf)* ?a . \n\
                                               ?a owl:onProperty ?pr . FILTER(?pr != <http://xsb.com/swiss/product#HAS_UNSTANDARDIZED_ATTRIBUTE>) \n\
                                               ?a (owl:hasValue) ?vr .\n\
                                               ?pr rdfs:label ?p .\n\
                                               OPTIONAL { ?vr rdfs:label ?v }  .\n\
                                    } order by ?p ?vr";
                    
                    $scope.nsnProperties = 'loading';
                    $scope.queryResource.post({}, $.param({"query": query}),
                            function(e) {
                                $scope.nsnProperties = [];
                                for (var i = 0; i < e.results.bindings.length; i++) {                               	 
                                    var name = e.results.bindings[i].p.value;
                                    var value = null;
                                    if (e.results.bindings[i].vr.type === "literal") {
                                        value = e.results.bindings[i].vr.value;
                                    } else if (e.results.bindings[i].v) {
                                        value = (e.results.bindings[i].v.value);
                                    }
                                    if (value && name) {
                                    	$scope.input_prop[name] = {"prop": e.results.bindings[i].pr.value,
                                    			        "value": e.results.bindings[i].vr.value
                                    	};
                                        $scope.nsnProperties.push({
                                            "name": name,
                                            "value": value
                                        });
                                    }
                                }
                                //$scope.queryEvenMoreNsnProperties();
                                //$scope.loadCurrentLocation();
                                //$scope.querysimilarParts();                                
                                
                            },
                            function(e) {
                            }
                    );
                };
                
                $scope.querysimilarParts = function() {
                    $scope.similarParts = [] ;
                    var similarPropMap = {};
                    $scope.no_of_prop = $scope.properties_to_be_matched.length;
                    $scope.no_of_prop_processed = 0;
                	for (var i = 0; i < $scope.no_of_prop; i++){
                		var m = $scope.properties_to_be_matched[i];
                		 var query = "SELECT distinct ?c ?p {  \n\
                             ?a owl:onProperty <" + $scope.input_prop[m].prop  + "> . \n\
                             ?a owl:hasValue <" + $scope.input_prop[m].value + "> . <"+ $scope.input_prop[m].prop +">  rdfs:label ?p . \n\
                             ?c rdfs:subClassOf ?a .}\n\
                              order by ?c ?p";
                     
                     $scope.finalNIINs = 'loading';
                     var req = $scope.queryResource.post({}, $.param({"query": query}),
                    		 function(e) {
		                    	 for (var i = 0; i < e.results.bindings.length; i++) {		                    		 
		                    		 var niin = e.results.bindings[i].c.value;
		                    		 var prop = e.results.bindings[i].p.value;
                                     $scope.similarParts.push({
                                         "prop": prop,
                                         "niin": niin
                                     });
                                     
                                     if($scope.similarMap[niin] != null)
                                    	 $scope.similarMap[niin].push(prop);
                                     else
                                    	 $scope.similarMap[niin] = new Array(prop); 
                                     
		                    	 }
		                    	 $scope.no_of_prop_processed++;
		                    	 //alert($scope.no_of_prop +  " --" + $scope.no_of_prop_processed);
		                    	 if($scope.no_of_prop_processed == $scope.no_of_prop)
		                    		 $scope.findCommon();		                    	 
		                     },
		                     function(e) {
		                     }                     
                     );
                     
                     $scope.ajaxrequests.push(req);
             
                	}
                	
                   
                };  
                
                $scope.querySuperClasses = function(list, classUri) {
                    var query = "SELECT ?c ?cr ?cd { <" + classUri + "> rdfs:subClassOf ?cr . \n\
                                               ?cr rdfs:label ?c . \n\
                                               OPTIONAL { ?cr <http://purl.org/dc/terms/description> ?cd } .\n\
                                    } limit 1";
                    
                    $scope.queryResource.post({}, $.param({"query": query}),
                            function(e) {
                                $scope.results = e.results;
                                for (var i = 0; i < e.results.bindings.length; i++) {
                                    var v = {
                                        "label": e.results.bindings[i].c.value,
                                        "uri": e.results.bindings[i].cr.value
                                    };
                                    if (e.results.bindings[0].cd)
                                        v["description"] = e.results.bindings[0].cd.value;

                                    $scope.nsnClasses.unshift(
                                            v
                                            );
                                    $scope.querySuperClasses(list, e.results.bindings[0].cr.value);
                                }
                            },
                            function(e) {
                            }
                    );
                };
                $scope.querySuppliers = function() {
                    var query = "SELECT DISTINCT ?v {\n\
                                  ?n <http://xsb.com/swiss/logistics#hasProductNIIN> <" + $scope.nsnUri + "> . \
                                  ?n <http://xsb.com/swiss/logistics#hasReferenceNumber> ?v \
                                }";
                  
                    $scope.nsnSuppliers = "loading";
                    $scope.queryResource.post({}, $.param({"query": query}),
                            function(e) {
                                $scope.nsnSuppliers = [];
                                for (var i = 0; i < e.results.bindings.length; i++) {
                                    $scope.querySupplierInfo(e.results.bindings[i].v.value);
                                }
                            },
                            function(e) {
                            }
                    );
                };
                $scope.querySupplierInfo = function(refNum) {
                    var query = "SELECT DISTINCT ?cn ?pn (concat(?street, ' ', ?locality, ' ', ?region) as ?ca) {\n\
                                  <" + refNum + "> <http://xsb.com/swiss/logistics#hasPartNumber> ?pn . \n\
                                  <" + refNum + "> <http://xsb.com/swiss/logistics#hasCage> ?cage . \n\
                                  ?cage <http://xsb.com/swiss/logistics#hasCageName> ?cn . optional { ?cage <http://www.w3.org/2006/vcard/ns#hasAddress> ?address . \n\
                                             ?address <http://www.w3.org/2006/vcard/ns#street-address> ?street . \n\
                                             ?address <http://www.w3.org/2006/vcard/ns#locality> ?locality . \n\
                                             ?address <http://www.w3.org/2006/vcard/ns#region> ?region } .\n\
								}";
                   
                    $scope.queryResource.post({}, $.param({"query": query}),
                            function(e) {
                                for (var i = 0; i < e.results.bindings.length && e.results.bindings[i].ca != null; i++) {
                                    var v = {
                                        "name": e.results.bindings[i].cn.value,
                                        "pn": e.results.bindings[i].pn.value,
                                        "addr": e.results.bindings[i].ca.value,
                                        "mapurl":"https://www.google.com/maps/embed/v1/search?q=" + encodeURIComponent(e.results.bindings[i].ca.value) + "&key=AIzaSyCrShHOFj5dchG6L05NNxGSNDOw4qseFlw",
                                        "dist": "-"
                                        
                                    };
                                    $scope.stdName(v);
                                    $scope.stdPn(v);
                                    $scope.nsnSuppliers.push(v);
                                    $scope.getMarker(v.addr);
                                    $scope.getSupplierDistance();
                                    
                                }
                            },
                            function(e) {
                            }
                    );
                };
                $scope.stdName = function(obj) {
                    $scope.cnsResource.get({"name": (obj.name)},
                    function(e) {
                        obj.stdName = (e.stdName);
                    },
                            function(e) {
                            }
                    );
                };
                $scope.stdPn = function(obj) {
                    $scope.pnsResource.get({"pn": encodeURIComponent(obj.pn)},
                    function(e) {
                        obj.stdPn = decodeURIComponent(e.stdPn);
                    },
                            function(e) {
                            }
                    );
                };
                
                $scope.findCommon = function(map){
                	//alert("only once");
                	$scope.finalNIINs = [];
                	var i =0;
                    for(var v in $scope.similarMap){
                    	if($scope.similarMap[v].length >= $scope.no_of_prop){
                    		i++;                    		
                    		var prop = $scope.similarMap[v].filter(function(item, i, ar){ return ar.indexOf(item) === i; });
                    		$scope.finalNIINs.push({"niin":v,"prop":prop,"min_dist":"-","min_dist_val":"-","price":"-"});
                    		//$scope.similarPropMap[v] = prop;
                    		
                    		
                    		$scope.similarsupplierMap[v] = 'loading';
                    		$scope.queryPartSuppliers(v);
                    		$scope.queryUnitPrice(v);
                    		if(i>$scope.maxresult)
                    			break;
                    	}                    		                        
                    }
                    
                $scope.search(); 
                	
                };
                
                $scope.queryPartSuppliers = function(uri) {
                    var query = "SELECT DISTINCT ?v {\n\
                        ?n <http://xsb.com/swiss/logistics#hasProductNIIN> <" + uri + "> . \
                        ?n <http://xsb.com/swiss/logistics#hasReferenceNumber> ?v \
                      }";
                    
                    var req = $scope.queryResource.post({}, $.param({"query": query}),
                            function(e) {
                	        		$scope.similarsupplierMap[uri] = [];
	                                for (var i = 0; i < e.results.bindings.length; i++) {
	                                    $scope.queryPartSupplierInfo(uri,e.results.bindings[i].v.value);
	                                }
                            },
                            function(e) {
                            }
                    );
                    
                    $scope.ajaxrequests.push(req);
                };
                
                $scope.queryUnitPrice = function(uri) {
                    var query = "SELECT DISTINCT ?v {\n\
                        ?n <http://xsb.com/swiss/logistics#hasProductNIIN> <" + uri + "> . \
                        ?n <http://xsb.com/swiss/logistics#hasUnitPrice> ?v \
                      }";
                    var req = $scope.queryResource.post({}, $.param({"query": query}),
                            function(e) {
                    				for(var i =0; i< $scope.finalNIINs.length ; i++){
                    					if($scope.finalNIINs[i].niin == uri){
                    						if(e.results.bindings[0] != null)
                    							$scope.finalNIINs[i].price = e.results.bindings[0].v.value;
                    						break;
                    						}
          
                    				}
                    		},
                    	    function(e) {
                    		}
                    );
                };
                
                $scope.queryPartSupplierInfo = function(uri,refNum) {
                    var query = "SELECT DISTINCT ?cn ?pn (concat(?street, ' ', ?locality, ' ', ?region) as ?ca) {\n\
                                  <" + refNum + "> <http://xsb.com/swiss/logistics#hasPartNumber> ?pn . \n\
                                  <" + refNum + "> <http://xsb.com/swiss/logistics#hasCage> ?cage . \n\
                                  ?cage <http://xsb.com/swiss/logistics#hasCageName> ?cn . optional { ?cage <http://www.w3.org/2006/vcard/ns#hasAddress> ?address . \n\
                                             ?address <http://www.w3.org/2006/vcard/ns#street-address> ?street . \n\
                                             ?address <http://www.w3.org/2006/vcard/ns#locality> ?locality . \n\
                                             ?address <http://www.w3.org/2006/vcard/ns#region> ?region } .\n\
								}";
                    
                                        
                    var req = $scope.queryResource.post({}, $.param({"query": query}),
                            function(e) {
                                for (var i = 0; i < e.results.bindings.length && e.results.bindings[i].ca != null; i++) {
                                    var v = {
                                        "name": e.results.bindings[i].cn.value,
                                        "addr": e.results.bindings[i].ca.value,
                                        "dist" : "-",
                                        };
                                    var NinIndex = uri.search("#");
                                    var nin = "";
                                    if(NinIndex != -1){
                                    	nin = uri.substring(NinIndex+1);
                                    	if(nin.length > 0){
                                    		
                                    		$scope.similarsupplierMap[uri].push(v);
                                    		$scope.getDistance(uri,v.addr);
                                            $scope.getMarker_Similar_Locations(v.addr,nin);
                                    	}
                                    }
                                    else{
                                    	alert(uri);
                                    }
                                }
                                  
                            },
                            function(e) {
                            }
                    );
                    $scope.ajaxrequests.push(req); 
                    
                };
            }])
        ;