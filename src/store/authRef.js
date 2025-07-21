let logoutFunction = () => {
    console.warn('Logout function not initialized yet');
  };
  
  export const setLogout = (fn) => {
    logoutFunction = fn;
  };
  
  export const callLogout = () => {
    logoutFunction();
  };
  