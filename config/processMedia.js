var s3 = require('s3');

var processMedia = {};

/*
Creating AWS S3 client for file upload and download. Defaults set until further
change needed.
*/

  var client = s3.createClient({
    maxAsyncS3: 20,                            // this is the default
    s3RetryCount: 3,                           // this is the default
    s3RetryDelay: 1000,                        // this is the default
    multipartUploadThreshold: 20971520,        // this is the default (20 MB)
    multipartUploadSize: 15728640,             // this is the default (15 MB)
    s3Options: {
      accessKeyId: process.env.AWSKEY,
      secretAccessKey: process.env.AWSSecret,
      region: "us-east-1",
      signatureVersion:"v3"
      // endpoint: 's3.yourdomain.com',
      // sslEnabled: false
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    }
  });
  console.log('client created');

/*
Function to upload a file to AWS S3, return "true" if the file was uploaded
successfully, otherwise return "false".
*/

processMedia.uploadFile = function(picture, companyName){
  console.log(companyName)
  var params = {
    localFile: picture,

    s3Params: {
      Bucket: "vetit",
      ACL: "bucket-owner-full-control",
      ContentType: "image/png",
      Key: companyName
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    }
  };
  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
    return false;
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
    uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
    return "https://s3-us-west-2.amazonaws.com/vetit/"+companyName;
  });
}

/*
Function to download a file to AWS S3, return "true" if the file was downloaded
successfully, otherwise return "false".
*/

processMedia.downloadFile = function(picture){
  var params = {
    localFile: picture,

    s3Params: {
      Bucket: "vetit",
      Key: process.env.AWSSecret
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    }
  };
  var downloader = client.downloadFile(params);
  downloader.on('error', function(err) {
    console.error("unable to download:", err.stack);
    return false;
  });
  downloader.on('progress', function() {
    console.log("progress", downloader.progressAmount, downloader.progressTotal);
  });
  downloader.on('end', function() {
    console.log("done downloading");
    return true;
  });

}

module.exports = processMedia;