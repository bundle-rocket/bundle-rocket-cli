

const stream = require('stream');

const fs = require('fs');
const path = require('path');

function getHash(stream) {

    const duplex = new stream.Duplex({

        read(size) {
            console.log(size);
        },

        write(chunk, enc, next) {
            console.log('write', chunk);
            this.push(chunk);
            next();
        }

    });

    const shasum = require('crypto').createHash('md5');

    return new Promise(function (resolve, reject) {

        stream.on('data', function (data) {
            shasum.update(data);
            duplex.write(data);
        });

        stream.on('end', function () {
            duplex.end();
            resolve({
                stream: duplex,
                shasum: shasum.digest('hex')
            });
        });

    });

}

getHash(fs.createReadStream(path.join(__dirname, 'findConfig.js'))).then(function ({stream, shasum}) {
    console.log(shasum);
});
