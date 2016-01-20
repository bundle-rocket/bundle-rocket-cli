/**
 * @file bundle dao
 * @author leon(ludafa@outlook.com)
 */

exports.list = function bundleList(token, appName) {
    getAppId(token, appName).then(function (appId) {
        var url = URL_APP + '/' + appId + '/bundles';
        var data = {
            pageNum: 1,
            pageSize: 5
        };
        sendRequest('get', url, data, token)
            .then(function (bundles) {
                // { count: 0, rows: [] }
                bundles.count === 0
                    ? console.log('You have not uploaded any bundle. Use '
                        + chalk.cyan('bundle-rocket bundle add <app-name> <bundle-version> <bundle-directory>')
                        + ' to upload a bundle.')
                    : printTable(
                        ['Bundle ID', 'Version', 'APP Version', 'Location'],
                        function (dataSource) {
                            bundles.forEach(function (item) {
                                dataSource.push([
                                    item.id,
                                    item.version,
                                    item.appVersion,
                                    item.location
                                ]);
                            });
                        }
                    );
            }, function (error) {
                console.log(chalk.yellow('[BUNDLE LIST] ' + error.status) + ' ' + error.info);
            });
    }, function (error) {
        console.log(chalk.yellow('[GET APP] ' + error.status) + ' ' + error.info);
    });
}

exports.get = function () {

};

function upload(token, appId, appVersion, bundleVersion, bundleDir, bundleSize) {
    var url = URL_APP + '/' + appId + '/bundles';
    var formData = {
        appVersion: appVersion,
        bundleVersion: bundleVersion,
        bundleSize: bundleSize,
        bundle: fs.createReadStream(bundleDir)
    };
    request.post({
        url: url,
        headers: {
            authorization: 'Bearer ' + token
        },
        formData: formData
    }, function (err, response, body) {
        if (err) {
            return console.error('Upload failed, please try again');
        }
        if (response.statusCode === 200) {
            console.log(body);
        }
        else {
            console.log(chalk.yellow('[UPLOAD] ' + response.statusCode) + ' ' + body);
        }
    });
}

exports.add = function (token, appName, bundleVersion, bundleDir) {

    getAppId(token, appName).then(function (appId) {
        var bundleStat = fs.statSync(bundleDir);
        if (bundleStat.isFile()) {
            upload(token, appId, '0.0.1', bundleVersion, bundleDir, bundleStat.size);
        }
        else if (bundleStat.isDirectory()) {
            // TODO 处理文件夹批量上传的情况
        }
    }, function (error) {
        console.log(chalk.yellow('[GET APP] ' + error.status) + ' ' + error.info);
    });

};

exports.remove = function () {

};
