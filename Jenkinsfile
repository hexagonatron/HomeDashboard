pipeline {
    agent any
    stages {
        stage("Preflight") {
            steps {
                echo 'Node version'
                sh 'node -v'
                echo ''
                echo 'NPM version'
                sh 'npm -v'
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