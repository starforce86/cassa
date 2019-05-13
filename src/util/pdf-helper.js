import React from 'react';
import { getFormPdf } from '../action/lookup';
import { RNS3 } from 'react-native-aws3';
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION } from 'react-native-dotenv'
var AWS = require('aws-sdk');

AWS.config = {
    "accessKeyId": AWS_ACCESS_KEY,
    "secretAccessKey": AWS_SECRET_KEY,
    "region": AWS_REGION
};


const Buffer = global.Buffer || require('buffer').Buffer;

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

export function pdfhelper() {

    return {
        createPdf: async function(form, fileName, token, callback) {
            var payload = {
                form: form,
                name: fileName
            };
            const filepath = await getFormPdf(payload, token);
            callback(filepath);
        },
        uploadBase64: async function(base64, key) {
            console.log("# In uploadBase64")
            return new Promise((resolve, reject) => {
                buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                var data = {
                    Bucket: 'cassa-io',
                    Key: key,
                    Body: buf,
                    ContentType: 'image/png',
                    ACL: 'public-read'
                };
                s3.upload(data, function (err, data) {
                    //alert(JSON.stringify(err));
                    console.log("# In s3.upload", JSON.stringify(err))
                    if (err) {
                        reject(err);
                    } if (data) {
                        resolve(data.Location);
                    }
                });
            });
        },
        upload: async function (path, name, isBase64) {
            const file = {
                uri: path,
                name: name,
                type: "image/png"
            }
            const options = {
                keyPrefix: "photos/",
                bucket: "cassa-io",
                region: AWS_REGION,
                accessKey: AWS_ACCESS_KEY,
                secretKey: AWS_SECRET_KEY,
                successActionStatus: 201
            }
            return new Promise((resolve, reject) => {
                console.log("# Inside upload ...");
                RNS3.put(file, options).then(response => {
                    if (response.status !== 201)
                      throw new Error("Failed to upload image to S3");
                    console.log("Successfully uploaded")
                    resolve(response.body);
                    /**
                     * {
                     *   postResponse: {
                     *     bucket: "your-bucket",
                     *     etag : "9f620878e06d28774406017480a59fd4",
                     *     key: "uploads/image.png",
                     *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
                     *   }
                     * }
                     */
                  }).catch(err => reject(err));
            });
        }
    }
}