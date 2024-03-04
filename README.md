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
