module.exports = {
  apps: [
    {
      name: 'zoonotify',
      script: './lib/bundle.js',
      exp_backoff_restart_delay: 500,
      out_file: process.env['ZN_LOG'],
      error_file: process.env['ZN_LOG'],
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      env: {
        NODE_APP_INSTANCE: ''
      }
    }
  ]
};
