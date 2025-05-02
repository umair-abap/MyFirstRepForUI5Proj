sap.ui.define(["sap/ui/core/UIComponent"],
    function(UIComponent){
        return UIComponent.extend("tv.sd.abap.Component",{
            /*Connecting Component.js to msnifest.json*/
            metadata:{
                "manifest":"json"
            },
            /*Instantiate the Base Class Constructor*/
            init:function(){
                UIComponent.prototype.init.apply(this);
                /*Get Rotuing Object*/
                var oRouter = this.getRouter();
                /*Initialize*/
                oRouter.initialize();
            },
            /*Destroy Function*/
            destroy: function(){

            }
        });
    }
);