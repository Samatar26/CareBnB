const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;

module.exports = {
  method: 'GET',
  path: '/sign-s3',
  handler: (request, reply) => {
    const s3 = new aws.S3({ region: 'eu-west-2', signatureVersion: 'v4' });
    const fileName = request.query['file-name'];
    const fileType = request.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `${fileName}`,
      ContentType: fileType,
      ACL: 'public-read',
    };


    const list_params = { Bucket: S3_BUCKET };
    s3.listObjects(list_params, (err, data) => {
      console.log(data);
      const bucketContents = data.Contents;
      for (let i = 0; i < bucketContents.length; i++) {
        const urlParams = { Bucket: S3_BUCKET, Key: bucketContents[i].Key };
        s3.getSignedUrl('getObject', urlParams, (err, url) => {
          console.log('the url of the image is', url);
        });
      }
    });

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return reply(err);
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      };
      return reply(returnData).code(200);
    });
  },
};
