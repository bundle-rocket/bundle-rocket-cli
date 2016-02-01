/**
 * @file bundle dao
 * @author leon(ludafa@outlook.com)
 */

const logger = require('../logger.js');
const json = require('./middleware/json.js');

// exports.list = function bundleList(token, appName) {
//     getAppId(token, appName).then(function (appId) {
//         var url = URL_APP + '/' + appId + '/bundles';
//         var data = {
//             pageNum: 1,
//             pageSize: 5
//         };
//         sendRequest('get', url, data, token)
//             .then(function (bundles) {
//                 // { count: 0, rows: [] }
//                 bundles.count === 0
//                     ? console.log('You have not uploaded any bundle. Use '
//                         + chalk.cyan('bundle-rocket bundle add <app-name> <bundle-version> <bundle-directory>')
//                         + ' to upload a bundle.')
//                     : printTable(
//                         ['Bundle ID', 'Version', 'APP Version', 'Location'],
//                         function (dataSource) {
//                             bundles.forEach(function (item) {
//                                 dataSource.push([
//                                     item.id,
//                                     item.version,
//                                     item.appVersion,
//                                     item.location
//                                 ]);
//                             });
//                         }
//                     );
//             }, function (error) {
//                 console.log(chalk.yellow('[BUNDLE LIST] ' + error.status) + ' ' + error.info);
//             });
//     }, function (error) {
//         console.log(chalk.yellow('[GET APP] ' + error.status) + ' ' + error.info);
//     });
// }

// exports.get = function () {

// };

// function upload(token, appId, appVersion, bundleVersion, bundleDir, bundleSize) {
//     var url = URL_APP + '/' + appId + '/bundles';
//     var formData = {
//         appVersion: appVersion,
//         bundleVersion: bundleVersion,
//         bundleSize: bundleSize,
//         bundle: fs.createReadStream(bundleDir)
//     };
//     request.post({
//         url: url,
//         headers: {
//             authorization: 'Bearer ' + token
//         },
//         formData: formData
//     }, function (err, response, body) {
//         if (err) {
//             return console.error('Upload failed, please try again');
//         }
//         if (response.statusCode === 200) {
//             console.log(body);
//         }
//         else {
//             console.log(chalk.yellow('[UPLOAD] ' + response.statusCode) + ' ' + body);
//         }
//     });
// }

const tar = require('tar-fs');
const FormData = require('form-data');

function createHash(bundlePath) {

    return new Promise(function (resolve, reject) {

        const stream = tar.pack(bundlePath).pipe(require('zlib').createGzip());
        const shasum = require('crypto').createHash('md5');

        let buffer = [];

        stream.on('data', function (data) {
            shasum.update(data);
            buffer.push(data);
        });

        stream.on('end', function () {
            resolve({
                buffer: Buffer.concat(buffer),
                shasum: shasum.digest('hex')
            });
        });

        stream.on('error', function (error) {
            reject(error);
        });

    });

}

exports.publish = function (token, bundle, options) {

    const {registry} = options;
    const {appName, bundleVersion, appVersion, bundlePath} = bundle;

    return createHash(bundlePath)
        .then(function ({shasum, buffer}) {

            const form = new FormData();

            form.append('appName', appName);
            form.append('appVersion', appVersion);
            form.append('bundleVersion', bundleVersion);
            form.append('shasum', shasum);
            form.append('bundle', buffer, {
                filename: 'bundle.tar.gz'
            });

            return fetch(`${registry}/bundles`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: form
            });

        })
        .then(json);

};

exports.deploy = function (accessToken, version, appName, options) {

    const {registry} = options;

    return fetch(`${registry}/apps/${appName}/${version}`, {
        method: 'PATCH',
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }).then(json);

};

