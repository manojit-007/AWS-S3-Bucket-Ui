const { S3Client } = require("@aws-sdk/client-s3");

const getS3Client = (awsAccessKey, awsSecretKey, awsRegion) => {
  return new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
    },
  });
};

module.exports = { getS3Client };
