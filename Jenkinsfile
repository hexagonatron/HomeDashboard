pipeline {
    agent any
    stages {
        stage("Build") {
            steps {
                echo 'Building Frontend'
                sh 'cd client && npm run build'
                echo 'Compiling Backend'
                sh 'cd server && npm run build'
            }
        }
    }
}