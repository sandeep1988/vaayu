angular.module('app').factory('ToasterService', (toaster) => {
  
    this.clear = function(toasterId, toastId) {
        if (angular.isObject(toasterId)) {
          $rootScope.$emit('toaster-clearToasts', toasterId.toasterId, toasterId.toastId);
        } else {
          $rootScope.$emit('toaster-clearToasts', toasterId, toastId);
        }
      };
    return {
        showToast: (type, title, body, timeout) => {
            console.log('ToasterService');
            toaster.pop({type, title, body, timeout});
        },
        hideToast:() => {
            toaster.pop();
            console.log('Toaster hideToast')
        },
        clearToast: () => {
            toaster.clear(this.hideToast, this.showError, this.showSuccess)
        },
        showToast: (type, title, body) => {
            console.log('ToasterService');
            toaster.pop({type, title, body, timeout:3000});
        },
        showSuccess: (title, body) => {
            console.log('ToasterService show Success');
            toaster.pop({ type: 'success', title, body, timeout: 3000 });
        },
        showError: (title, body) => {
            console.log('ToasterService Error');
            toaster.pop({type: 'error', title, body, timeout: 3000 });
        },
        showError_html: (title, body) => {
            console.log('ToasterService');
            toaster.pop({type: 'error', title, body, timeout: 3000, bodyOutputType: 'trustedHtml'});
        },
        showToast_html: (type, title, body) => {
            console.log('ToasterService');
            toaster.pop({type: type, title, body, timeout: 3000, bodyOutputType: 'trustedHtml'});
        }
    };
});