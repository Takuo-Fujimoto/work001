import $ from 'jquery';


const serverHost = 'http://localhost:8080/SpringTest';
// const serverHost = '/destinations/SpringTest/';

export function callService(apiUrl, settings) {
    settings.url = serverHost + apiUrl;
    let resultData = {};
    if (!settings.success) {
        settings.success = function(data, textStatus, jqXHR) {
            resultData = data;
        };
    }
    if (!settings.error) {
        settings.error = function(jqXHR, textStatus, errorThrown) {
            console.error('Service Call error');
            alert('service Error');
        }
    }
    $.ajax(settings);
    return resultData;
}
