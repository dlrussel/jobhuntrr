<div>
  <h1>jobhuntrr</h1>
  <p>
    A web application built to help people manage their job search.
  </p>
</div>


## Development

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get
started:

- Username: `kody`
- Password: `kodylovesyou`

### Relevant code

This is a pretty simple note-taking app, but it's a good example of how you can
build a full stack app with Prisma and Remix. The main functionality is creating
users, logging in and out, and creating and deleting notes.

## Deployment

The Epic Stack comes with a GitHub Action that handles automatically deploying
your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note**: If you have more than one Fly account, ensure that you are signed
  > into the same account in the Fly CLI as you are in the browser. In your
  > terminal, run `fly auth whoami` and ensure the email matches the Fly account
  > signed into the browser.

  > **Note**: The following instructions will be improved soon. Eventually most
  > of these steps will be replaced with a simple `fly launch` command which
  > will prompt you for what you need. For now the steps below are manual.

  > **Warning**: This template is currently only configured to work for Fly v1
  > apps. If you just created your account you are probably running on Fly v2
  > which is ultimately preferable, but will require a few changes. This is
  > temporary and will be fixed soon. See
  > [#22](https://github.com/epicweb-dev/epic-stack/discussions/22) for more
  > info.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create jobhuntrr-0957
  fly apps create jobhuntrr-0957-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file.
  > Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the
  remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user
  settings on Fly and create a new
  [token](https://web.fly.io/user/personal_access_tokens/new), then add it to
  [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
  with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET`, `ENCRYPTION_SECRET`, and `INTERNAL_COMMAND_TOKEN` to
  your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) ENCRYPTION_SECRET=$(openssl rand -hex 32) INTERNAL_COMMAND_TOKEN=$(openssl rand -hex 32) --app jobhuntrr-0957
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) ENCRYPTION_SECRET=$(openssl rand -hex 32) INTERNAL_COMMAND_TOKEN=$(openssl rand -hex 32) --app jobhuntrr-0957-staging
  ```

  If you don't have openssl installed, you can also use
  [1Password](https://1password.com/password-generator) to generate a random
  secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- **Create an account on Mailgun.** (Can be deferred to later)

  NOTE: this is an optional step. During development the emails will be logged
  to the terminal and in production if you haven't set the proper environment
  variables yet you will get a warning until you set the environment variables.

  Create a Sending API Key (find it at
  `https://app.mailgun.com/app/sending/domains/YOUR_SENDING_DOMAIN/sending-keys`
  replacing `YOUR_SENDING_DOMAIN` with your sending domain) and set
  `MAILGUN_DOMAIN` and `MAILGUN_SENDING_KEY` environment variables in both prod
  and staging:

  ```sh
  fly secrets set MAILGUN_DOMAIN="mg.example.com" MAILGUN_SENDING_KEY="some-api-token-with-dashes" --app jobhuntrr-0957
  fly secrets set MAILGUN_DOMAIN="mg.example.com" MAILGUN_SENDING_KEY="some-api-token-with-dashes" --app jobhuntrr-0957-staging
  ```

- Create a persistent volume for the sqlite database for both your staging and
  production environments. Run the following (feel free to change the GB size
  based on your needs):

  ```sh
  fly volumes create data --size 1 --app jobhuntrr-0957
  fly volumes create data --size 1 --app jobhuntrr-0957-staging
  ```

Now that everything is set up you can commit and push your changes to your repo.
Every commit to your `main` branch will trigger a deployment to your production
environment, and every commit to your `dev` branch will trigger a deployment to
your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in the deployed application. You
can connect to the live database by running `fly ssh console -C database-cli`.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that
gets into the `main` branch will be deployed to production after running
tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Playwright

We use Playwright for our End-to-End tests in this project. You'll find those in
the `tests` directory. As you make changes, add to an existing file or create a
new file in the `tests` directory to test your changes.

To run these tests in development, run `npm run test:e2e:dev` which will start
the dev server for the app and run Playwright on it.

We have a fixture for testing authenticated features without having to go
through the login flow:

```ts
test('my test', async ({ page, login }) => {
	const user = await login()
	// you are now logged in
})
```

We also auto-delete the user at the end of your test. That way, we can keep your
local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`.
We have DOM-specific assertion helpers via
[`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your
editor to get a really great in-editor experience with type checking and
auto-complete. To run type checking across the whole project, run
`npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project.
It's recommended to install an editor plugin (like the
[VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))
to get auto-formatting on save. There's also a `npm run format` script you can
run to format all files in the project.

<!-- prettier-ignore-start -->
[build-badge]: https://img.shields.io/github/actions/workflow/status/epicweb-dev/epic-stack/deploy.yml?branch=main&logo=github&style=flat-square
[build]: https://github.com/epicweb-dev/epic-stack/actions?query=workflow%3Adeploy
[license-badge]: https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square
[license]: https://github.com/epicweb-dev/epic-stack/blob/main/LICENSE.md
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://kentcdodds.com/conduct
<!-- prettier-ignore-end -->
