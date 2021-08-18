pipeline {
    agent any
    stages {
        stage("Build") {
            step {
                echo 'Building Frontend'
                sh 'cd client && npm run build'
                echo 'Compiling Backend'
                sh 'cd server && npm run build'
            }
        }
    }
}