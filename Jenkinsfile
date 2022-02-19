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
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building docker image'
                    def BRANCH_NAME_STRIPPED = $BRANCH_NAME.replaceAll("_","")
                    docker.build("${JOB_NAME}:${BRANCH_NAMED_SCRIPT}")
                }
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
                sh("ssh jenkins@node.local /home/jenkins/deploybranch.sh $BRANCH_NAME $GIT_URL")
            }
        }
    }
}
