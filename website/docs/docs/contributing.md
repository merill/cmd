---
sidebar_position: 2
title: ✍️ Contributing
---

### Adding a new command to [cmd.ms]

To add a new command to [cmd.ms] for your favorite Microsoft blade or portal you can either submit a form or better yet, create a pull request in GitHub.

* To submit the form please head over to [Request a new command](https://github.com/merill/cmd/issues/new?assignees=&labels=enhancement&template=new-command-request.md&title=)
* The preferable option is to create a pull request which updates the [commands.csv](https://github.com/merill/cmd/blob/main/website/config/commands.csv)

#### Command naming convention

##### Azure

* Try to use the same name used in [Azure CLI](https://learn.microsoft.com/cli/azure/reference-index?view=azure-cli-latest) for the resource.
* If you feel the name is too long, include an alias to the CLI name so it easily discoverable.

#### App Specific Blades / Pages

* When a command is deep linking to an app specific blade (e.g. Users blade in Azure AD), include the app's two letter prefix (e.g. **ad**ca.cmd.ms).
* If this is a new app, you can suggest a new two letter prefix for the app.

#### PR Checklist

* Verify that your new command/alias does not already exist.
* If the app has a legacy or alternate name, include it in the Keyword column so it is searchable.
* Only include links to Microsoft portals.
