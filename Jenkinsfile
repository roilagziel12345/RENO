pipeline {
  agent any

  options {
    disableConcurrentBuilds(abortPrevious: false)
    buildDiscarder(logRotator(numToKeepStr: '30'))
    timeout(time: 45, unit: 'MINUTES')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Detect Changed Dependency Manifests') {
      steps {
        sh '''
          set -eu

          mkdir -p .renovate-ci
          : > .renovate-ci/node-dirs.txt
          : > .renovate-ci/maven-dirs.txt
          : > .renovate-ci/python-dirs.txt

          if [ -n "${CHANGE_TARGET:-}" ]; then
            git fetch origin "${CHANGE_TARGET}" --depth=1
            base_ref="origin/${CHANGE_TARGET}"
          else
            base_ref="HEAD~1"
          fi

          git diff --name-only "$base_ref"...HEAD > .renovate-ci/changed-files.txt

          while IFS= read -r file; do
            case "$file" in
              */node_modules/*) ;;
              */package.json|package.json|*/package-lock.json|package-lock.json)
                dirname "$file" >> .renovate-ci/node-dirs.txt
                ;;
              */pom.xml|pom.xml)
                dirname "$file" >> .renovate-ci/maven-dirs.txt
                ;;
              */requirements.txt|requirements.txt)
                dirname "$file" >> .renovate-ci/python-dirs.txt
                ;;
            esac
          done < .renovate-ci/changed-files.txt

          sort -u .renovate-ci/node-dirs.txt -o .renovate-ci/node-dirs.txt
          sort -u .renovate-ci/maven-dirs.txt -o .renovate-ci/maven-dirs.txt
          sort -u .renovate-ci/python-dirs.txt -o .renovate-ci/python-dirs.txt

          echo "Node manifests:"
          cat .renovate-ci/node-dirs.txt
          echo "Maven manifests:"
          cat .renovate-ci/maven-dirs.txt
          echo "Python manifests:"
          cat .renovate-ci/python-dirs.txt
        '''
      }
    }

    stage('Test Node Manifests') {
      steps {
        sh '''
          set -eu

          while IFS= read -r dir; do
            [ -n "$dir" ] || continue
            echo "Running npm verification in $dir"
            npm --prefix "$dir" install
            npm --prefix "$dir" test
          done < .renovate-ci/node-dirs.txt
        '''
      }
    }

    stage('Test Maven Manifests') {
      steps {
        sh '''
          set -eu

          while IFS= read -r dir; do
            [ -n "$dir" ] || continue
            echo "Running Maven verification in $dir"
            mvn -f "$dir/pom.xml" test
          done < .renovate-ci/maven-dirs.txt
        '''
      }
    }

    stage('Test Python Manifests') {
      steps {
        sh '''
          set -eu

          while IFS= read -r dir; do
            [ -n "$dir" ] || continue
            echo "Running Python verification in $dir"
            python -m pip install -r "$dir/requirements.txt"
            if find "$dir" -maxdepth 2 \\( -name "test_*.py" -o -name "*_test.py" \\) | grep -q .; then
              python -m pytest "$dir"
            else
              echo "No pytest tests found under $dir; dependency install is the verification."
            fi
          done < .renovate-ci/python-dirs.txt
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: '.renovate-ci/*.txt', allowEmptyArchive: true
    }
  }
}
