pipeline {
    agent any

    environment {
        NODE_VERSION = '18.17.0'
        EC2_HOST = 'ec2-34-229-225-27.compute-1.amazonaws.com'
        EC2_USER = 'ubuntu'
        DEPLOY_DIR = '/var/www/personal-website'
        PATH = "/usr/local/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/joshua-lossner/personal-website.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                withCredentials([file(credentialsId: 'test-env-local', variable: 'ENV_FILE')]) {
                    script {
                        def envContent = readFile(env.ENV_FILE)
                        writeFile file: '.env.local', text: envContent
                    }
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key-test']) {
                    // Copy files to EC2
                    sh "scp -r .next ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}"
                    sh "scp -r pages ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}"
                    sh "scp -r utils components ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}"
                    sh "scp next.config.js ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}"
                    sh "scp package*.json ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}"
                    sh "scp .env.local ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}"
                    
                    // Copy public directory if it exists
                    sh '''
                        if [ -d "public" ]; then
                            scp -r public ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}
                        else
                            echo "public directory does not exist, skipping..."
                        fi
                    '''
                    
                    // Deploy and start the application
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd ${DEPLOY_DIR}
                            npm ci
                            echo "Fetching documents..."
                            npm run fetch-documents
                            echo "Setting permissions..."
                            chmod -R 755 .
                            sudo chown -R ${EC2_USER}:${EC2_USER} .
                            echo "Stopping existing pm2 process..."
                            pm2 stop personal-website || true
                            pm2 delete personal-website || true
                            echo "Starting the application..."
                            pm2 start npm --name "personal-website" -- start
                            pm2 save
                            echo "Application started"
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}