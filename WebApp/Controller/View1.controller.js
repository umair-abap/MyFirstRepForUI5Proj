sap.ui.define(["tv/sd/abap/Controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "tv/sd/abap/util/formatter"
],
   function(BaseController,Filter,FilterOperator,formatter){
     return BaseController.extend("tv.sd.abap.Controller.View1",{
         formatter: formatter,
         /*Create a blank Object to hold the router Object when we reach to this view*/
         oRouter: null,
         onInit: function(){
            /*Get the Router Object using the Component Object in the "this.oRouter"*/
            this.oRouter = this.getOwnerComponent().getRouter();
         },
         onSearch: function(oEvent){
             var sVal = oEvent.getParameter("query");
             var oFilter = new Filter(
                 "Ernam",
                 FilterOperator.Contains,
                 sVal
             );
             var oBindingOfListItems = this.getView().byId("idList").getBinding("items");
             oBindingOfListItems.filter(oFilter);
         },
         onItemPress:function(oEvent){
            var oListItem = oEvent.getParameter("listItem");
            var sPath = oListItem.getBindingContextPath();
            /*The Path look like as Element Path "fruits/3", "/fruits/4"*/
            /*Extract the Id from the Path ==> ABAP:- SPLIT text BY '/' INTO itab*/
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            /*Navigate to "detail" route*/
            /*Also Pass the item sIndex to the fruitId*/
            this.oRouter.navTo("route2",{
                deliveryId: sIndex
            });
         },
         onDelete: function(oEvent){
             /*Get the Object of Item which user clicked to delete*/
             var oListItemToBeDeleted = oEvent.getParameter("listItem");
             debugger;
             /*Get the source object i.e. Object of List Control*/
             var oList = oEvent.getSource();
             /*Delete the item now*/
             oList.removeItem(oListItemToBeDeleted);
         },
         onMultiDelete: function(){
             var aLITBD = this.getView().byId("idList").getSelectedItems();
             var oList = this.getView().byId("idList");
             for (var i = 0; i < aLITBD.length; i++) {
                 oList.removeItem(aLITBD[i]);
             }
         },
         onAdd: function(){
            this.oRouter.navTo("add");
         }
     });
   }
);