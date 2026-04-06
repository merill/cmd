// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '[cmd.ms]',
  tagline: 'cmd.ms: The Microsoft cloud command line for Microsoft 365 | Azure | Security!',
  url: 'https://cmd.ms',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'merill', // Usually your GitHub org/user name.
  projectName: 'cmd', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/docs', // Serve the docs at /docs, homepage is custom TUI
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/merill/cmd/tree/main/website',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '[cmd.ms]',
        logo: {
          alt: 'cmd.ms Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            label: 'merill.net',
            href: 'https://merill.net',
            position: 'right',
          },
          {
            label: 'Entra News',
            href: 'https://entra.news',
            position: 'right',
          },
          {
            label: 'Entra Chat',
            href: 'https://entra.chat',
            position: 'right',
          },
          {
            label: 'Graph X-Ray',
            href: 'https://graphxray.merill.net',
            position: 'right',
          },
          {
            label: 'Maester',
            href: 'https://maester.dev',
            position: 'right',
          },
          {
            label: 'Lokka',
            href: 'https://lokka.dev',
            position: 'right',
          },
          {
            href: 'https://github.com/merill/cmd',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
            position: 'right',
          },
          {
            href: 'https://twitter.com/merill',
            className: 'header-twitter-link',
            'aria-label': 'Twitter',
            position: 'right',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'About me',
                to: 'https://merill.net/about/',
              },
            ],
          },
          {
            title: 'My Projects',
            items: [
              {
                label: 'Graph X-Ray',
                href: 'https://graphxray.merill.net',
              },
              {
                label: 'Graph Permissions Explorer',
                href: 'https://graphpermissions.merill.net',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://merill.net',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/merill',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Merill Fernando.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

    themes: [
      // ... Your other themes.

    ],

    plugins: [
      async function myPlugin(context, options) {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            // Appends TailwindCSS and AutoPrefixer.
            postcssOptions.plugins.push(require("tailwindcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      },
    ],
};

module.exports = config;
