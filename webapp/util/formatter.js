sap.ui.define([],
    function(){
      return {
          getStatus: function(status){
            switch (status) {
                case 'A':
                    return 'Available'; 
                    break;  
                    
                case 'D':
                    return 'Discontinued'
                    break;  
                    
                case 'O':
                    return 'Out Of Stock'
                    break;  
                    
                case 'P':
                    return 'Pending'
                    break;                        
            }                      
          },
          getState: function(value){
              switch (value) {
                  case 'A':
                      return 'Success';
                      break;
                  case 'D':
                      return 'Error'
                      break;
                  case 'O':
                      return 'Warning'
                      break;
                  case 'P':
                      return 'Warning'                            
                      break;
              }
          }
      }
    }
);