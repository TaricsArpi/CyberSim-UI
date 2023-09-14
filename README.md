# ndi-cybersim-ui

## To set up the project on your local environment run the following commands:

```
# Clone the project by running git clone.
$ git clone <REPO_LINK>
# Install the node dependencies by running
$ npm install
# Create a .env file based on .env.example
$ cp .env.example .env
# Start the React App on localhost:3000
$ npm start
```

## Migration

Go to `<host>/migrate` (eg. if you're running the APP locally: [`localhost:3000/migrate`](http://localhost:3000/migrate)) and fill in the form with the relevant AirTable details, then click "Migrate the database".

## For some basic source code explanation see the [wiki page](https://github.com/nditech/CyberSim-UI/wiki)

# CyberSim-UI Deployment Guide

- The CyberSim Game comprises two distinct applications: a Node.js-based backend API and a React-based frontend UI. This guide specifically covers the deployment process for the UI React application. For instructions on deploying the backend application, please refer to the [CyberSim-Backend README](https://github.com/nditech/CyberSim-Backend#readme).

- Main deployment steps in order:

1. [Set up the S3 bucket for static website hosting](#s3-eg-ndicybersimdemcloudorg)
2. [Set up the CodePipeline](#codepipeline-eg-ndicybersim-ui)
3. [During setting up the "Build" stage set up the CodeBuild project if it doesn't already exists](#codebuild-ndicybersim-codebuild)

## Environment Component Naming Convention

The environment component name follows this format: `<ACCOUNT_ALIAS>@<COMPONENT_NAME>`.

## GitHub Repository (nditech/CyberSim-UI)

All local repository changes are pushed to new branches in the GitHub remote repository. These changes are reviewed and merged into the 'master' branch.

## CodePipeline (e.g., ndi@CyberSim-UI)

A separate CodePipeline project is created for each production environment. The pipeline consists of 3 stages:

### SOURCE

1. Set the _Source provider_ to "GitHub (Version 2)" and connect to the following repository: [nditech/CyberSim-UI](https://github.com/nditech/CyberSim-UI). Branch name should be `master`.
2. Keep the _Start the pipeline on source code change_ option checked to trigger automatic builds on AWS whenever changes are pushed to the `master` branch. (Troubleshooting: Manually trigger a release in CodePipeline)
3. Leave the _Output artifact format_ on the default "CodePipeline default".

### BUILD

1. Set the _Build provider_ to "AWS CodeBuild".
2. [Select the "CyberSim-Codebuild" build project or create it if it doesn't already exists.](#codebuild-ndicybersim-codebuild)
3. Add `REACT_APP_API_URL` environment variable here and set its value to the live URL of the corresponding backend API as plaintext. (e.g.: https://cybersimbackend.demcloud.org)
4. Leave the _Build type_ on "Single build".

### DEPLOY

1. Set the _Deploy provider_ to "Amazon S3".
2. [Select the bucket you have set up in the first step for static website hosting.](#s3-eg-ndicybersimdemcloudorg). Each environment has its own separate bucket.
3. Set _Extract file before deploy_ to "true".
4. No _Deployment path_ or additional configurations are needed.

## CodeBuild (ndi@CyberSim-Codebuild)

A single CodeBuild project is created to build changes for each environment. After a change is triggered in CodePipeline (manually or automatically), the source code is transferred to CodeBuild, and the steps defined in the `buildspec.yml` file are executed. These steps include the installation of Node, npm packages, and the bundling of the React app into static files. Once the build is completed, CodePipeline initiates deployment by transferring the output files in the build directory to S3.

To create the CodeBuild project please follow these steps:

1. Leave the _Restrict number of concurrent builds this project can start_ unchecked.
2. For _Environment_ settings:
3. Use a "Managed image". Please refer to the [buildspec.yml](./buildspec.yml) file to check the Node version the build uses (currently Node 18) and set up the build image accordingly (recommended: `aws/codebuild/amazonlinux2-x86_64-standard:5.0`). For more information about compatible runtimes, check this [table](https://docs.aws.amazon.com/codebuild/latest/userguide/available-runtimes.html).
4. _Image version_ should be the latest.
5. Recommended _Environment type_ is "Linux EC2" without privileges and no additional settings needed. For more information please refer to this [table](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html).
6. Leave the _Build specification_ on "Use a buildspec file".
7. No batch configuration is needed.

Frequent errors:

- **`npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.`**

Troubleshooting:

1. Please check the error log for the specific Node version the build environment uses. (e.g. v18.6.0).
2. On your local environment please install the exact same version of node with `nvm install vX.X.X`. After the installation check the currently used version with the `node -v` command. If it doesn't match the just installed version run the following command: `nvm use vX.X.X`.
3. Delete the `package-lock.json` file.
4. Run `npm install` :warning: **twice** :warning:!
5. Push the updated `package-lock.json` and rerun the CodeBuild.

## S3 (e.g., ndi@cybersim.demcloud.org)

A different S3 bucket is created for each environment. Public access is enabled on these buckets, which are configured for static website hosting.

To create a new bucket for static website hosting, follow these steps:

1. Set the ACLs to disabled (default).
2. Set "Block all public access" (and all its sub-settings) to "false" (Note: Don't forget to acknowledge this setting).
3. Disable versioning.
4. Encryption type: SSE-S3, disabled bucket key.

After creating the bucket:

1. Under the bucket's "Properties" tab, enable static website hosting. The index document should be `index.html`.
2. Under the bucket's "Permissions" tab, add the following bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<YOUR_BUCKET_NAME>/*"
    }
  ]
}
```

## Known runtime warnings

- @babel include warning message:

  - One of your dependencies, babel-preset-react-app, is importing the
    "@babel/plugin-proposal-private-property-in-object" package without
    declaring it in its dependencies. This is currently working because
    "@babel/plugin-proposal-private-property-in-object" is already in your
    node_modules folder for unrelated reasons, but it may break at any time.

    babel-preset-react-app is part of the create-react-app project, which
    is not maintianed anymore. It is thus unlikely that this bug will
    ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to
    your devDependencies to work around this error. This will make this message
    go away.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
