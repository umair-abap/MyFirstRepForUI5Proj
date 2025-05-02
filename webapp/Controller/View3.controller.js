sap.ui.define(["tv/sd/abap/Controller/BaseController",
               "sap/ui/core/routing/History"
],
    function(BaseController, History){
        return BaseController.extend("tv.sd.abap.Controller.View3",{
            /*Declare Global Variable to get the Router Object in the future*/
            oRouter: null,
            onInit: function(){
                /*Get Router Object*/
                this.oRouter = this.getOwnerComponent().getRouter();
                /*Register the Route Object, Attach the RMH event to a new herculis function
                  and Pass controller object to that function
                */
               this.oRouter.getRoute("route3").attachMatched(this.herculis, this);
            },
            herculis: function(oEvent){
                /*Step.1: Extract the ID*/
                var sIndex = oEvent.getParameter("arguments").supplierId;
                /*Step.2: Rebuild the Path*/
                var sPath = "/supplier/"+sIndex;
                /*Step.3: Get the SimpleForm Object from the View3*/
                var oSimpleForm = this.getView().byId("idSimpleForm");
                /*Step.4: Bind the Element*/
                oSimpleForm.bindElement(sPath);
            },
            onBack: function(){
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();
                
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("route2", {
                        fruitId: 0
                    }, true);
                }                          
            }
        });
    }
);