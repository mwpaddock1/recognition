module.exports = () => {
    return {
        files: ['public/index.html', 'public/index.js', 'public/render.js','server.js','models.js', 'auth/strategies.js', 'auth/router.js','auth/index.js', 'users/index.js', 'users/models.js', 'users/router.js', 'config.js'],
        tests: ['test/**/*.js'],
        testFramework: 'mocha',
        env: {type: 'node',
          runner: 'node'
    },
       workers: {
           initial: 1,
           regular: 1,
           restart: true
       }
    }
}