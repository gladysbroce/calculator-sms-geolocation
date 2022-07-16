/***
File Description: JS File for SMS Functionality
***/

/**
 * Send SMS using Cordova SMS Plugin
 */
var app = {
    sendSms: function() {
        // Success callback
        var success = function (hasPermission) {
            var number = document.getElementById('numberTxt').value.toString();
            var message = document.getElementById('messageTxt').value;
            
            var options = {
                replaceLineBreaks: false,
                android: {
                    intent: '' // Direct from app
                }
            };

            // Send message success callback
            var sendSuccess = function () {
                // Clear fields
                document.getElementById('numberTxt').value = '';
                document.getElementById('messageTxt').value = '';
                
                alert('Message sent successfully.');
            };
            
            // Send message error callback
            var sendError = function (e) {
                alert('Message Failed: ' + e); 
            };
            
            // If has permission to send SMS
            if (hasPermission) {
                // Send SMS direct from app
                sms.send(number, message, options, sendSuccess, sendError);
            }
            // Else, request for permission
            else {
                sms.requestPermission(function() {
                    // If permission is accepted
                    alert('SMS permission accepted.');
                    // Send SMS direct from app
                    sms.send(number, message, options, sendSuccess, sendError);
                }, function(e) {
                    // If permission is denied
                    alert('SMS permission not accepted. Will now switch to native SMS app.');
                    
                    var sendIntentSuccess = function () {
                        // Clear fields
                        document.getElementById('numberTxt').value = '';
                        document.getElementById('messageTxt').value = '';
                    };
                    
                    var optionsIntent = {
                        replaceLineBreaks: false,
                        android: {
                            intent: 'INTENT'  // From native messaging app
                        }
                    };
                    // Send SMS from native messaging app
                    sms.send(number, message, optionsIntent, sendIntentSuccess, sendError);
                });
            }
        };
        
        // Error callback
        var error = function (e) { alert('Something went wrong: ' + e); };
        
        // Check for permission
        sms.hasPermission(success, error);
    }
};