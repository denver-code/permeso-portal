# Permeso portal
## Prerequisites

Before getting started, ensure you have the following prerequisites:

- Node.js 14 or higher
- npm or yarn package manager

```bash
  npm install
  # or
  yarn install
```

- Run the development server:

```bash
  npm run dev
  # or
  yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Set Up Firebase

<https://console.firebase.google.com/>

- Log in with your Google account.
- Click on `Go to console` button.
- Click `Add Project` card.
- Give your project a name.
- Click on `Continue` button.
- Disable `Google Analytics for this project` (unless you wish to use it).
- Click `Create project` button.
- Click on the web icon button to create your web app. It will show a text popup `Web`.
- Register app by giving it a nickname and click `Register app` button.
- Where package.json is located, in your cli, type `npm i firebase`.
- Copy configuration file. Make a new file in `src` called `firebase` called `firebase.js`.
- In project root, create a file and name it `.env`.
- Make sure you add `.env.local` to your `.gitignore` so you don't expose your variables in git repo.
- Follow the instructions here at <https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#loading-environment-variables> to add your variables from firebase.js into this file.

Example...

```md
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

- Create `env` file and paste these variables with your own information.
- Click on `Continue on console` button
- On your project homepage, choose a product to add to your app. First, click on `Authentication`.
- Under `Get started with Firebase Auth by adding your first sign-in method` select `Email/Password`.

You should now be setup to use Firebase.

## Authentication

- In `src/firebase` directory, exists the directory `auth` containing the logic for `signin` and `signup`.

## Folder Structure

The folder structure of this project is organized as follows:

- `pages`: Contains the Next.js pages for server-side rendering.
- `components`: Holds the reusable React components.
- `lib`: Includes utility functions and modules.
- `public`: Stores static assets such as images, fonts, and stylesheets.
- `styles`: Contains global styles and Tailwind CSS configuration.
- `firebase`: Houses the Firebase configuration and Firebase-related functions.

## Deployment

## Contributing


## License

