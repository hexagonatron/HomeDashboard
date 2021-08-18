pipeline {
    agent any
    stages {
        stage("Preflight") {
            steps {
                echo 'Node version'
                sh 'node -v'
                echo 'NPM version'
                sh 'npm -v'
            }
        }
        stage("Build") {
            steps {
                echo 'Building Application'
                sh 'npm run build'
            }
        }
    }
}