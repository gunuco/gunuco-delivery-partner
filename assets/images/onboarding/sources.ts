/** Local relative requires — Metro resolves these reliably (aliases do not). */
export const onboardingBannerSources = {
  hub: require('./banner-hub.jpg'),
  personal: require('./banner-personal.jpg'),
  photo: require('./banner-photo.jpg'),
  location: require('./banner-location.jpg'),
  vehicle: require('./banner-vehicle.jpg'),
  documents: require('./banner-documents.jpg'),
  docUpload: require('./banner-doc-upload.jpg'),
  bank: require('./banner-bank.jpg'),
  training: require('./banner-training.jpg'),
  review: require('./banner-review.png'),
  status: require('./banner-status.png'),
} as const;
