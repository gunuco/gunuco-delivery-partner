/** Local relative requires — Metro resolves these reliably (aliases do not). */
export const authImageSources = {
  loginHero: require('./login-hero.jpg'),
  loginFooter: require('./login-footer.png'),
  otpHero: require('./otp-hero.jpg'),
  otpFooter: require('./otp-footer.jpg'),
} as const;
