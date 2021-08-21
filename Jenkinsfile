pipeline {
    agent any
    stages {
        stage('Preflight') {
            steps {
                echo 'Node version'
                sh 'node -v'
                echo 'NPM version'
                sh 'npm -v'
            }
        }
        stage('Build') {
            steps {
                echo 'Building Application'
                // sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing application'
                sh 'npm run test'
            }
        }
        stage('Deploy Branch') {
            when {
                branch "feature/*"
            }
            steps {
                echo "${env}"
                echo sh(script: 'env', returnStdout: true)
                echo 'Deploying branch to node server'
                sh("ssh jenkins@node.local << /home/jenkins/deploybranch.sh $BRANCH_NAME")
                sh 'ssh jenkins@node.local << ls'
            }
        }
    }
}
