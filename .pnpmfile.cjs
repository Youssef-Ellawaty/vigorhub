module.exports = {
  hooks: {
    readPackage(pkg, context) {
      // Force tailwindcss to v3 if it's trying to install v4
      if (pkg.name === 'tailwindcss' && pkg.version?.startsWith('4')) {
        pkg.version = '^3.4.1';
      }
      return pkg;
    },
  },
};
