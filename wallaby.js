module.exports = () => {
    return {
        files: ['public/index.html', 'public/index.js', 'server.js','models.js'],
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