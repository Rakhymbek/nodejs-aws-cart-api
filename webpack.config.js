module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  const externalModules = [
    'pg-native',
    'mysql',
    'sqlite3',
    'tedious',
    'better-sqlite3',
    'mysql2',
    'pg-query-stream',
    'oracledb',
  ];

  return {
    ...options,
    externals: [...options.externals, ...externalModules],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
