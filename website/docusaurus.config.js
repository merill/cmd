// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'cmd.ms',
  tagline: 'The command line for Microsoft 365 | Azure | Security!',
  url: 'https://cmd.ms',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
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
          routeBasePath: '/', // Serve the docs at the site's root
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
        title: 'cmd.ms',
        logo: {
          alt: 'cmd.ms Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://merill.net',
            label: 'merill.net',
            position: 'left',
          },
          {
            href: 'https://graphxray.merill.net',
            label: 'Graph X-Ray',
            position: 'left',
          },
          {
            href: 'https://graphpermissions.merill.net',
            label: 'Graph Permissions Explorer',
            position: 'left',
          },
          {
            href: 'https://github.com/merill/cmd',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
            position: 'right',
          },
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
        copyright: `Copyright © ${new Date().getFullYear()} <a href='https://twitter.com/merill' target='_blank'>Merill Fernando</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
