sap.ui.define(["tv/sd/abap/Controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],
    function (BaseController, JSONModel, MessageBox, MessageToast, Fragment) {
        return BaseController.extend("tv.sd.abap.Controller.Add", {
            oRouter: null,
            oLocalModel: null,
            onInit: function () {
                /*Step.1 Get Router Object*/
                this.oRouter = this.getOwnerComponent().getRouter();
                /*Step.2 Register this Route, We will attach the the RMH event to new herculis function
                         Also pass the controller object to that function
                */
                this.oRouter.getRoute("add").attachMatched(this.herculis, this);
                /*Creating a Local Model*/
                this.oLocalModel = new JSONModel({
                    "Delivery": {
                        "Vbeln": "",
                        "Ernam": "M.NAIDU",
                        "Netwr": "8597.00",
                        "Waerk": "SAR",
                        "Lfart": "LB",
                        "Vgbel": "4500000003"
                    }
                });
                /*Setting the Local Model to the Add View*/
                this.getView().setModel(this.oLocalModel, "local");
            },
            herculis: function (oEvent) {
                this.setMode("Create");
            },
            onSave: function () {
                /*Step.1: Extract the Payload*/
                var payload = this.oLocalModel.getProperty("/Delivery");
                /*Step.2: Prechecks*/
                if (!payload.Vbeln) {
                    MessageBox.error("Please enter Delivery");
                }
                /*Step.3: Get the OData model object*/
                var oDataModel = this.getOwnerComponent().getModel();
                if (this.mode === 'Create') {
                    /*Step.4: Call the backend using OData-CREATE*/
                    oDataModel.create("/DeliveryHeaderSet",
                        payload,
                        {
                            success: function (data) {
                                MessageToast.show("Delivery Created Suscessfully");
                            },
                            error: function (oError) {
                                MessageBox.error("Something went Wrong");
                            }
                        }
                    );
                } else {
                    /*Step.5: Call the backend using OData-UPDATE*/
                    oDataModel.update("/DeliveryHeaderSet('" + this.vbeln + "')",
                        payload,
                        {
                            success: function (data) {
                                MessageToast.show("Delivery Updated Suscessfully");
                            },
                            error: function (oError) {
                                MessageBox.error("Something went Wrong");
                            }
                        }
                    );
                }
            },
            onClear: function () {
                this.oLocalModel.setProperty("/Delivery", {
                    "Vbeln": "",
                    "Ernam": "",
                    "Netwr": "",
                    "Waerk": "",
                    "Lfart": "",
                    "Vgbel": ""
                });
                this.setMode("Create");
            },
            vbeln: null,
            onSubmit: function (oEvent) {
                /*Step.1: Get the Delivery entered by the user*/
                sVal = oEvent.getParameter("value");
                /*Step.2: Assign the value of Delivery to Global Variable*/
                this.vbeln = sVal;
                /*Step.3: Create a Path for Single OData READ call*/
                var sPath = "/DeliveryHeaderSet('" + sVal + "')";
                /*Step.4: Get the OData Model*/
                oDataModel = this.getOwnerComponent().getModel();
                /*Step.5: Copy var this to that*/
                var that = this;
                /*Step.6: Make a READ call using OData model object*/
                oDataModel.read(sPath, {
                    success: function (data) {
                        that.oLocalModel.setProperty("/Delivery", data);
                        that.setMode("Edit");
                    },
                    error: function (oError) {
                        MessageToast.show("Please continue creating the new Delivery");
                        that.setMode("Create");
                    }
                });
            },
            mode: "Create",
            setMode: function (sMode) {
                if (sMode === 'Create') {
                    /*Making Delivery field editable*/
                    this.getView().byId("idDelivery").setEnabled(true);
                    /*Changing Save button text to Save*/
                    this.getView().byId("idSave").setText("Save");
                    /*Disabling Delete Button*/
                    this.getView().byId("idDelete").setEnabled(false);
                } else {
                    /*Making Delivery field non-editable*/
                    this.getView().byId("idDelivery").setEnabled(false);
                    /*Changing Save button text to Save*/
                    this.getView().byId("idSave").setText("Update");
                    /*Enabling Delete Button*/
                    this.getView().byId("idDelete").setEnabled(true);
                }
                this.mode = sMode;
            },
            onDelete: function (oEvent) {
                oDataModel = this.getOwnerComponent().getModel();
                oDataModel.remove("/DeliveryHeaderSet('" + this.vbeln + "')", {
                    success: function () {
                        MessageBox.confirm('Delivery has been deleted successfully');
                    },
                    error: function () {
                        MessageToast.error("Something went wrong");
                    }
                });
            },
            getMostExpDel: function () {
                var cat = this.oLocalModel.getProperty("/Delivery/Lfart");
                var oDataModel = this.getOwnerComponent().getModel();
                var that = this;
                oDataModel.callFunction('/GetMostExpensiveDelivery', {
                    urlParameters: {
                        I_Category: cat
                    },
                    success: function (data) {
                        that.oLocalModel.setProperty("/Delivery", data);
                    },
                    error: function () {
                        MessageToast.error('Sometghing went wrong');
                    }
                });
            },
            oField: null,
            oDeliveryPopup: null,
            onF4Help: function (oEvent) {
                /*The moment user hit F4 on a field, we will capture the object of that cell field in
                 a Global Variable*/
                this.oField = oEvent.getSource();

                /*Declare a Local Variable which is accesible inside the async function*/
                var that = this;
                /*Fragment is a Standard SAP UI5 API which has "load" function to load our Fragment*/
                if (!this.oDeliveryPopup) {    //It is like "IF lo_alv IS BOUND in ABAP"
                    Fragment.load({
                        id: "Delivery",
                        fragmentName: "tv.sd.abap.Fragments.popup",
                        type: "XML",
                        controller: this
                    }).then(function (oFragment) {
                        /*"then" is a keyword to indicate that promise was fulfiled i.e. fragment loaded*/
                        /*"that" is a copy of current Controller Class Object "this"*/
                        that.oDeliveryPopup = oFragment;
                        that.oDeliveryPopup.setTitle("Select Delivery");
                        /*Allow access of our model to Fragment*/
                        that.getView().addDependent(that.oDeliveryPopup);
                        /*Aggregatin Binding - Bind Data to the Popup*/
                        that.oDeliveryPopup.bindAggregation("items", {
                            path: '/DeliveryHeaderSet',
                            template: new sap.m.StandardListItem({
                                // icon: 'sap-icon://supplier',
                                title: '{Vbeln}',
                                description: '{Ernam}'
                            })
                        });
                        /*Display the Popup*/
                        that.oDeliveryPopup.open();
                    });
                } else {
                    /*If the Fragment Object is already loaded then it will directly open the popup*/
                    /*Display the Popup*/
                    this.oDeliveryPopup.open();
                }
            },
            onConfirm: function (oEvent) {
                /*Get the ID of the Object with which user interacted*/
                var sId = oEvent.getSource().getId();
                /*Step.1: Get the selected Title by user*/
                sTitle = oEvent.getParameter("selectedItem").getTitle();
                /*Step.2: Get the selected Description by user*/
                sDes   = oEvent.getParameter("selectedItem").getDescription();
                /*Step.3: Set sTitle to Delivery field*/
                this.oLocalModel.setProperty("/Delivery/Vbeln", sTitle);
                /*Step.4: Set sVal to Created By field*/
                this.oLocalModel.setProperty("/Delivery/Ernam", sDes);
            }
        });
    }
);