module.exports = () => {
    return {
        files: ['server.js', 'public/client.js','blogRouter.js','models.js','public/index.html'],
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