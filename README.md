# Setup Guide for Palestirnative Project

Welcome to the setup guide for the Palestirnative project! We're delighted you're here to contribute. Follow these steps to get your development environment ready. 🚀

## Prerequisites

Before we begin, ensure you have the following prerequisites installed on your system:

### MongoDB 🍃
MongoDB is our primary database. Install it by following the instructions on the MongoDB official documentation:
- [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)

### Deno 🦕
Deno is a secure runtime for JavaScript and TypeScript. You can install it using the instructions on the official Deno website:
- [Deno Installation Guide](https://docs.deno.com/runtime/manual/getting_started/installation)

Those shouldn't take more than a handful of commands 🤞.

## Setup Local Database

1. Download the database dump from Dropbox:
   ```shell
    curl -JLO -o "$HOME/Downloads/db dump.zip" "https://www.dropbox.com/scl/fi/z08tuylkk9sszs4tqtlir/db-dump.zip?rlkey=4rz2jofdfdlvdkvk16cicty35&dl=0"
    ```

2. Unzip the downloaded file:
    ```shell
    unzip "$HOME/Downloads/db dump.zip"
    ```

3. Restore the database using mongorestore:
    ```shell
    mongorestore --db palestirnative $HOME/Downloads/db dump/palestirnative
    ```

## Clone the Repository

🔽 Clone the Palestirnative repo to get the source code on your local machine:
```shell
git clone https://github.com/palestirnative/palestirnative.git
```

## Navigate to the Repository

🔽 Change directory to the cloned repository:

```shell
cd palestirnative
```
## Environment Configuration

🔐 Create a .env file in the root directory of the project if it doesn't already exist. This file will store your environment variables.
```shell
cp .env.sample .env
```

Start the Project
🎉 Now, let's start the project with Deno:
```shell
deno task start
```

You should now have the Palestirnative project up and running on your local machine!

Happy coding! 😊👨‍💻

## How to contribute

### 1. Pick an issue or start your idea

So first step to contribute is to know what you want to your PR to do. For that you can either work on an idea
you have or open the list of issues to pick one.

### 2. Code in your branch

Make your work in your branch.

### 3. Commit convention

When you are about to commit, make sure your commit message follows the convention. Which is:
```
type: make something in the code
```

Where type is one of the following:
* `feat`: For any new feature
* `fix`: For any bug fix
* `chore`: For any other changes

Note that the commit message should be short, concise and in lowercase.

### 3. Create a PR

Create the PR and make sure it is set to be merged to `develop` branch.
* Make sure you add a good description of your PR so that the reviewer can understand it.
* Pick a reviewer
* Wait until it is approved to merge it
