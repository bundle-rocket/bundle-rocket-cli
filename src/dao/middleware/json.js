/**
 * @file fetch json middleware
 * @author leon(ludafa@outlook.com)
 */

module.exports = function (response) {

    return response.json()
        .then(function (data) {

            if (response.ok) {
                return data;
            }

            throw data;

        }, function () {
            throw {
                status: response.status,
                message: response.statusText
            };
        });

};
