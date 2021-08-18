pipeline {
    agent any
    tools {nodejs "latest"}
    stages {
        stage("Preflight") {
            steps {
                echo sh(returnStdout: true, script: 'env')
                sh 'node -v'
            }
        }
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