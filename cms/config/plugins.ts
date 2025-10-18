export default () => ({
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: process.env.GCS_BUCKET, // e.g. algorhythmics-cms-media
        publicFiles: true, // set false to use signed URLs in admin
        uniform: true, // if the bucket has Uniform access enabled
        basePath: '', // optional subfolder in the bucket
        // baseUrl: `https://storage.googleapis.com/${process.env.GCS_BUCKET}`, // optional override
      },
    },
  },
});
