# Joshua C. Lossner - Personal Website & AI Music Experimentation

![Project Banner](public/banner.png)

Welcome to my personal website, a fusion of my professional journey, personal interests, and experimentation with Artificial Intelligence (AI) in music creation. This platform serves as both an online resume and a showcase of my ventures into AI-generated content, offering a seamless experience for visitors to explore my work, education, and projects.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
  - [For Users](#for-users)
  - [For Developers](#for-developers)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Project Overview

This project is a **Next.js** application that serves as my personal website, integrating sections for my resume, including education and experience, and a unique music category where I showcase AI-generated music. The content is dynamically generated from Markdown files stored in my notes library, organized into various categories. These Markdown files are processed to create interactive **Post Cards**, which are displayed in the main feed and can be filtered by categories and tags.

## Features

- **Responsive Design**: Optimized for various devices and screen sizes.
- **Dynamic Content**: Content is generated from Markdown files, allowing easy updates and scalability.
- **AI-Generated Music Player**: A dynamic music player that allows users to play, pause, skip tracks, and view album art.
- **Filterable Post Feed**: Users can filter posts based on categories and tags for a personalized browsing experience.
- **Resume Integration**: Dedicated sections for education and professional experience.
- **Dark Mode Support**: Toggle between light and dark themes for better readability.
- **SEO Optimized**: Meta tags and structured content for improved search engine visibility.
- **Deployment Ready**: Easily deployable on platforms like Vercel.

## Architecture

The application follows a **client-server** architecture, leveraging **Next.js** for server-side rendering (SSR) and static site generation (SSG). The core components include:

- **Frontend**: Built with React and styled using Tailwind CSS, ensuring a modern and responsive UI.
- **Backend/API**: Custom API routes to handle data fetching, especially for dynamic content like music playlists.
- **Database**: SQLite is used to store and manage post data, ensuring fast read/write operations.
- **Content Management**: Markdown files serve as the primary content source, allowing for easy content creation and management.
- **State Management**: React Context API manages the state for the music player and other global states.

### Key Components

- **Post Cards**: Interactive cards that display post content, metadata, and allow for expansion to read more.
- **Dynamic Music Player**: A feature-rich music player that handles playlists, playback controls, and displays album art.
- **API Routes**: Custom Next.js API routes to fetch and manage documents, music posts, and playlists.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Frontend**: React, Tailwind CSS
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Markdown Processing**: ReactMarkdown, Remark GFM, Rehype Raw
- **Database**: SQLite, [sqlite3](https://www.npmjs.com/package/sqlite3)
- **State Management**: React Context API
- **Deployment**: Vercel

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) package manager
- [Git](https://git-scm.com/) for version control

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/personal-website.git
   cd personal-website
   ```

2. **Install Dependencies**

   Using **npm**:

   ```bash
   npm install
   ```

   Or using **Yarn**:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**

   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   GITHUB_USERNAME=your_github_username
   GITHUB_REPO=your_github_repo
   GITHUB_TOKEN=your_github_token
   S3_BASE_URL_ALBUMS=https://your-s3-bucket-url.com/albums
   ```

   - **GITHUB_USERNAME**: Your GitHub username.
   - **GITHUB_REPO**: The name of your GitHub repository where Markdown files are stored.
   - **GITHUB_TOKEN**: Personal access token for GitHub API access.
   - **S3_BASE_URL_ALBUMS**: Base URL for your S3 bucket storing album art.

4. **Run the Development Server**

   Using **npm**:

   ```bash
   npm run dev
   ```

   Or using **Yarn**:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3001](http://localhost:3001) in your browser to view the website.

## Usage

### For Users

- **Browse Posts**: Explore various posts categorized under different sections like Blog, Music, Education, etc.
- **Filter Content**: Use category buttons or click on tags to filter the main feed for a tailored experience.
- **Music Player**: Listen to AI-generated music using the dynamic music player. Control playback with play, pause, skip, shuffle, and repeat functionalities.
- **Resume Sections**: View detailed information about my education and professional experience.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.

### For Developers

- **Adding Content**: Add new posts by creating Markdown files in the `content` directory. Ensure proper frontmatter for metadata.
- **Managing Music**: Upload audio files to the `public/audio/site-playlist/<genre>` directories and update the database accordingly.
- **Styling**: Customize styles using Tailwind CSS classes in the component files or extend the `globals.css`.
- **API Extensions**: Enhance or add new API routes in the `pages/api` directory as needed.
- **Database Management**: Interact with the SQLite database located at `posts.db` using provided scripts or directly via SQLite tools.

## Project Structure
personal-website/
│
├── components/
│ ├── ArticleCard.js
│ ├── DynamicMusicPlayer.js
│ ├── DynamicMusicPlayerContent.js
│ ├── MusicPlayer.js
│ └── PostCard.js
│
├── lib/
│ ├── db.js
│ └── posts.js
│
├── pages/
│ ├── api/
│ │ ├── fetch-documents.js
│ │ ├── music.js
│ │ ├── music-by-genre.js
│ │ ├── music-by-tag.js
│ │ └── music-posts.js
│ ├── index.js
│ └── music.js
│
├── scripts/
│ └── fetchDocuments.js
│
├── styles/
│ └── globals.css
│
├── utils/
│ └── categories.js
│
├── content/
│ └── ... (Markdown files)
│
├── public/
│ ├── audio/
│ │ └── site-playlist/
│ ├── album-art/
│ └── ...
│
├── .gitignore
├── package.json
├── README.md
└── ...

### Key Directories and Files

- **components/**: Reusable React components such as `PostCard`, `DynamicMusicPlayer`, `DynamicMusicPlayerContent`, and `MusicPlayer`.
- **lib/**: Utility libraries for database interactions and post management (`db.js`, `posts.js`).
- **pages/**: Next.js page components and API routes. This includes the main pages like `index.js` and `music.js`, as well as API endpoints under the `api/` directory.
- **scripts/**: Automation scripts for tasks like fetching and processing documents (`fetchDocuments.js`).
- **styles/**: Global and component-specific CSS styles using Tailwind CSS (`globals.css`).
- **utils/**: Utility functions and constants, such as category definitions (`categories.js`).
- **content/**: Markdown files serving as the content source for posts. These are dynamically processed to generate Post Cards.
- **public/**: Static assets including audio files (`public/audio/site-playlist/`) and album art (`public/album-art/`).

## API Endpoints

### `/api/fetch-documents`

- **Description**: Triggers the `fetchDocuments` script to fetch and process Markdown files from GitHub.
- **Method**: `GET`
- **Response**:
  - `200 OK`: Documents fetched successfully.
  - `500 Internal Server Error`: Failed to fetch documents.
  ### `/api/music`

- **Description**: Fetches the music playlist based on the specified directory.
- **Method**: `GET`
- **Query Parameters**:
  - `directory` (required): The genre or category directory.
- **Response**:
  - `200 OK`: Returns the playlist.
  - `500 Internal Server Error`: Failed to load playlist.

### `/api/music-posts`

- **Description**: Retrieves music posts from the database.
- **Method**: `GET`
- **Response**:
  - `200 OK`: Returns the list of music posts.
  - `500 Internal Server Error`: Failed to fetch music posts.

### `/api/music-by-tag`

- **Description**: Fetches music posts filtered by a specific tag.
- **Method**: `GET`
- **Query Parameters**:
  - `tag` (required): The tag to filter music posts.
- **Response**:
  - `200 OK`: Returns the filtered playlist.
  - `400 Bad Request`: Missing tag parameter.
  - `500 Internal Server Error`: Failed to fetch music by tag.

### `/api/music-by-genre`

- **Description**: Fetches music posts filtered by a specific genre.
- **Method**: `GET`
- **Query Parameters**:
  - `genre` (required): The genre to filter music posts.
- **Response**:
  - `200 OK`: Returns the filtered playlist.
  - `400 Bad Request`: Missing genre parameter.
  - `500 Internal Server Error`: Failed to fetch music by genre.

## Scripts

### `npm run dev`

- **Description**: Starts the development server on port `3001`.
- **Command**:

  ```bash
  npm run dev
  ```

### `npm run build`

- **Description**: Builds the application for production.
- **Command**:

  ```bash
  npm run build
  ```

### `npm run start`

- **Description**: Starts the production server on port `3001`.
- **Command**:

  ```bash
  npm run start
  ```

### `npm run lint`

- **Description**: Runs ESLint to analyze code for potential errors and code style issues.
- **Command**:

  ```bash
  npm run lint
  ```

### `npm run fetch-documents`

- **Description**: Executes the `fetchDocuments` script to fetch and process Markdown files.
- **Command**:

  ```bash
  npm run fetch-documents
  ```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

env
GitHub Configuration
GITHUB_USERNAME=your_github_username
GITHUB_REPO=your_github_repository
GITHUB_TOKEN=your_github_personal_access_token
AWS S3 Configuration for Album Art
S3_BASE_URL_ALBUMS=https://your-s3-bucket-url.com/albums

- **GITHUB_USERNAME**: Your GitHub username.
- **GITHUB_REPO**: The name of your GitHub repository containing Markdown files.
- **GITHUB_TOKEN**: Personal access token with appropriate permissions for GitHub API access.
- **S3_BASE_URL_ALBUMS**: Base URL for your AWS S3 bucket where album art images are stored.

## Deployment

The application is optimized for deployment on [Vercel](https://vercel.com/), the platform behind Next.js. Follow these steps to deploy:

1. **Push to GitHub**

   Ensure your code is pushed to a GitHub repository.

2. **Connect to Vercel**

   - Log in to [Vercel](https://vercel.com/) and import your GitHub repository.
   - Set the environment variables in Vercel's dashboard under the project settings.

3. **Deploy**

   Vercel will automatically build and deploy your application. It provides a live URL where your website is accessible.

For more details, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment).

## Contributing

Contributions are welcome! To contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Create a Pull Request**

   Submit a pull request detailing your changes.

### Codebase Terms

To facilitate collaboration, here are some key terms used within the codebase:

- **Post Card**: A component that represents a single post, displaying its title, subtitle, description, and other metadata. It can expand to show more content.
- **Music Player**: The dynamic music player component that handles playback controls, playlist management, and displays album art.
- **Playlist**: A collection of music tracks managed by the Music Player, allowing users to play, pause, skip, and navigate through tracks.
- **Category**: A classification for posts, such as 'Blog', 'Music', 'Education', etc., used to filter and organize content.
- **Tag**: A keyword associated with posts for finer-grained filtering within categories.
- **API Route**: Backend endpoints defined in the `pages/api` directory to handle data fetching and processing.

## License

[MIT](LICENSE)

## Contact

Joshua C. Lossner – [joshua.lossner@example.com](mailto:joshua.lossner@example.com)

Project Link: [https://github.com/yourusername/personal-website](https://github.com/yourusername/personal-website)

## Acknowledgements

- [Next.js](https://nextjs.org/) for providing a robust framework.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [React Icons](https://react-icons.github.io/react-icons/) for the icon library.
- [Vercel](https://vercel.com/) for seamless deployment solutions.
- Open-source contributors and the community for their invaluable resources and support.