#!/usr/bin/env groovy
import hudson.model.*

node {
    def version = ''
    try {
        this.notifyBuild('STARTED')
        stage('Checkout') {
            git credentialsId: 'b74a476d-7464-429c-ab8e-7ebbe03bcd1f', url: 'git@gitlab.com:qaobee/qaobee-tracking.git'
            sh 'git fetch --tags'
            version = this.version()
            echo("Building $version")
        }

        stage("Build $version") {
            sh 'rm -fr node_modules'
            sh 'npm cache clean'
            sh 'npm run clean'
            sh 'npm install'
            sh 'npm run build'
        }

        stage("Quality $version") {
            sh 'npm run lint'
            sh "npm run sonar-scanner"
        }


        stage("Doc $version") {
            sh 'gulp jsdoc'
            sh 'git_stats generate -o build/docs/git'
            sh './gradlew gitChangelogTask'
            publishHTML(target: [
                    allowMissing         : false,
                    alwaysLinkToLastBuild: false,
                    keepAll              : true,
                    reportDir            : 'build/docs/jsdoc',
                    reportFiles          : 'index.html',
                    reportName           : "JSdoc"
            ])
            publishHTML(target: [
                    allowMissing         : false,
                    alwaysLinkToLastBuild: false,
                    keepAll              : true,
                    reportDir            : 'build/docs/git',
                    reportFiles          : 'index.html',
                    reportName           : "GitStats"
            ])
            publishHTML(target: [
                    allowMissing         : false,
                    alwaysLinkToLastBuild: false,
                    keepAll              : true,
                    reportDir            : 'build/docs/changelog',
                    reportFiles          : 'index.html',
                    reportName           : "Changelog"
            ])
        }
    } catch (e) {
        // If there was an exception thrown, the build failed
        currentBuild.result = "FAILED"
        throw e
    } finally {
        // Success or failure, always send notifications
        this.notifyBuild(currentBuild.result)
    }
}

def version() {
    def v = sh(returnStdout: true, script: 'git describe --abbrev=0 --tags').trim().substring(1).tokenize('.').toArray()
    def gitVersion = [
            major: v[0].toInteger(),
            minor: v[1].toInteger(),
            patch: v[2].toInteger() + 1
    ]
    return 'v' + gitVersion.values().join('.')
}


def notifyBuild(String buildStatus = 'STARTED') {
    // build status of null means successful
    buildStatus = buildStatus ?: 'SUCCESSFUL'
    String subject = "${buildStatus}: Job ${env.JOB_NAME} [${env.BUILD_NUMBER}]"
    String summary = "${subject} (${env.BUILD_URL})"
    // Override default values based on build status
    if (buildStatus == 'STARTED') {
        color = 'YELLOW'
        colorCode = '#FFFF00'
    } else if (buildStatus == 'SUCCESSFUL') {
        color = 'GREEN'
        colorCode = '#00FF00'
    } else if (buildStatus == 'PUBLISHED') {
        color = 'BLUE'
        colorCode = '#0000FF'
    } else {
        color = 'RED'
        colorCode = '#FF0000'
    }

    // Send notifications
    this.notifySlack(colorCode, summary, buildStatus)
}

def notifySlack(color, message, buildStatus) {
    String slackURL = 'https://hooks.slack.com/services/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'
    String payload = "{\"username\": \"QSwarm-Web\",\"attachments\":[{\"title\": \"${env.JOB_NAME} ${buildStatus}\",\"color\": \"${color}\",\"text\": \"${message}\"}]}"
    def cmd = "curl -X POST -H 'Content-type: application/json' --data '${payload}' ${slackURL}"
    print cmd
    sh cmd
}