sap.ui.define(["tv/sd/abap/Controller/BaseController",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
],
  function (BaseController, Fragment, Filter, FilterOperator) {
    return BaseController.extend("tv.sd.abap.Controller.View2", {
      oRouter: null,
      oSupplierPopup: null,
      
      onInit: function () {
        /*Step.1:- Get Router Object*/
        this.oRouter = this.getOwnerComponent().getRouter();
        /*Step.2:- Register this Route, We attach the RMH event to a new herculis function
         Also pass the controller object to that function*/
        this.oRouter.getRoute("route2").attachMatched(this.herculis, this);
      },
      herculis: function (oEvent) {
        /*Step.1:- Extract the id*/
        var sIndex = oEvent.getParameter("arguments").deliveryId;
        /*Step.2:- Rebuild the Path*/
        var sPath = "/" + sIndex;
        /*Step.3:- Get the current view object*/
        var oView2 = this.getView();
        /*Step.4:- Bind Element*/
        oView2.bindElement(sPath, {
          expand: 'To_Supplier'
        });
      },
      onItemPress: function (oEvent) {
        sPath = oEvent.getParameter("listItem").getBindingContextPath();
        /*Extract the ID from the sPath*/
        var sIndex = sPath.split("/")[sPath.split("/").length - 1];
        /*Navigate to route "supplier" and also pass the Item Index to the 
         dynamic variable "supplierId" of "supplier" route.
        */
        this.oRouter.navTo("route3", {
          supplierId: sIndex
        });
      },
      onFilter: function () {
        /*Declare a Local Variable which is accesible inside the async function*/
        var that = this;
        /*Fragment is a Standard SAP UI5 API which has "load" function to load our Fragment*/
        if (!this.oSupplierPopup) {    //It is like "IF lo_alv IS BOUND in ABAP"
          Fragment.load({
            id: "supplier",
            fragmentName: "tv.sd.abap.Fragments.popup",
            type: "XML",
            controller: this
          }).then(function (oFragment) {
            /*"then" is a keyword to indicate that promise was fulfiled i.e. fragment loaded*/
            /*"that" is a copy of current Controller Class Object "this"*/
            that.oSupplierPopup = oFragment;
            that.oSupplierPopup.setTitle("Select Supplier(s)");
            /*Allow access of our model to Fragment*/
            that.getView().addDependent(that.oSupplierPopup);
            /*Aggregatin Binding - Bind Data to the Popup*/
            that.oSupplierPopup.bindAggregation("items", {
              path: '/supplier',
              template: new sap.m.StandardListItem({
                icon: 'sap-icon://supplier',
                title: '{name}',
                description: '{sinceWhen}'
              })
            });
            /*Enable Multi Select in the Popup values*/
            that.oSupplierPopup.setMultiSelect(true);
            /*Display the Popup*/
            that.oSupplierPopup.open();
          });
        } else {
          /*If the Fragment Object is already loaded then it will directly open the popup*/
          /*Display the Popup*/
          this.oSupplierPopup.open();
        }
      },
      oField: null,
      onF4Help: function (oEvent) {
        debugger;
        /*The moment user hit F4 on a field, we will capture the object of that cell field in
         a Global Variable*/
        this.oField = oEvent.getSource();

        /*Declare a Local Variable which is accesible inside the async function*/
        var that = this;
        /*Fragment is a Standard SAP UI5 API which has "load" function to load our Fragment*/
        if (!this.oCityPopup) {    //It is like "IF lo_alv IS BOUND in ABAP"
          Fragment.load({
            id: "city",
            fragmentName: "tv.sd.abap.Fragments.popup",
            type: "XML",
            controller: this
          }).then(function (oFragment) {
            /*"then" is a keyword to indicate that promise was fulfiled i.e. fragment loaded*/
            /*"that" is a copy of current Controller Class Object "this"*/
            that.oCityPopup = oFragment;
            that.oCityPopup.setTitle("Select Supplier(s)");
            /*Allow access of our model to Fragment*/
            that.getView().addDependent(that.oCityPopup);
            /*Aggregatin Binding - Bind Data to the Popup*/
            that.oCityPopup.bindAggregation("items", {
              path: '/SupplierSet',
              template: new sap.m.StandardListItem({
                icon: 'sap-icon://supplier',
                title: '{Kunnr}',
                description: '{Name1}'
              })
            });
            /*Display the Popup*/
            that.oCityPopup.open();
          });
        } else {
          /*If the Fragment Object is already loaded then it will directly open the popup*/
          /*Display the Popup*/
          this.oCityPopup.open();
        }
      },
      onConfirm: function (oEvent) {
        /*Get the ID of the Object with which user interacted*/
        var sId = oEvent.getSource().getId();
        /*Check if the ID contains City*/
        ////For F4 Help
        if (sId.indexOf("city") != -1) {
          /*Step.1: Get the selected value by user*/
          sVal = oEvent.getParameter("selectedItem").getTitle();
          /*Step.2: Set this value to our Input field*/
          this.oField.setValue(sVal);
        }
        ////For Filter Button
        else {
          var aSelectedItems = oEvent.getParameter("selectedItems");

          /*Loop these items and construct a Array Filter*/
          var aFilter = [];
          for (let i = 0; i < aSelectedItems.length; i++) {
            const element = aSelectedItems[i];
            var sText = element.getTitle();
            aFilter.push(new Filter("name", FilterOperator.EQ, sText));
          }
          var oFilter = new Filter({
            filters: aFilter,
            and: false
          });
          /*Get the Table Object*/
          var oTable = this.getView().byId("idTable");
          /*Inject the Filter into the Table*/
          oTable.getBinding("items").filter(oFilter);
        }
      }
    });
  }
);