export default () => {
  if (process.env.GCS_BUCKET) {
    return {
      upload: {
        config: {
          provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
          providerOptions: {
            bucketName: process.env.GCS_BUCKET,
            publicFiles: true,
            uniform: true,
            basePath: '',
          },
        },
      },
    };
  }

  // Default to the built-in local provider when bucket config is missing (e.g. during local dev)
  return {
    upload: {
      config: {
        provider: 'local',
        providerOptions: {},
      },
    },
  };
};
