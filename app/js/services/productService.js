'use strict';
four51.app.factory('ProductService', function($resource, $451){
    var productAPI = $resource($451.api('Product/:interopID'), {interopID: '@ID'}, {'search': {method: 'GET', isArray:true}});
    console.log('cached declared');
    function cacheProduct(product){
        $451.cache("product-" + product.InteropID, product, true)
    }
    function getCachedProduct(interopID){
        return $451.cache("product-" + interopID, true)
    }
    return {
        search: function(categoryInteropID, searchTerm){
            if(!categoryInteropID && !searchTerm)
                return null;

            console.log('calling product search: category:' + categoryInteropID + ' search: ' + searchTerm)
            return productAPI.search({'CategoryInteropID': categoryInteropID, 'SearchTerms': searchTerm ? searchTerm : ''}, function(data){
                for(var i = 0; i < data.length; i++){
                    if(!getCachedProduct(data[i].InteropID)){
                        cacheProduct(data[i]);
                    }
                }
                return data;
            });
        },
        getOne: function(interopID){

            var cached = getCachedProduct(interopID);
            if(!cached){
                return productAPI.get({interopID: interopID}, function(data){
                    console.log('putting prodcut to the cache')
                    cacheProduct(data);
                });
            }
            else{
                console.log('returning cached product')
                return cached;
            }

        }
    }
});