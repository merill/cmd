---
title: Security
sidebar_class_name: security
hide_table_of_contents: true
custom_edit_url: null
---

import { CommandsTable } from "@site/src/components/CommandsTable";
import { commands } from "@site/src/tableHome/commands.table";
import { columns } from "@site/src/tableHome/columns.table";
import Icon from '/static/img/security-header.svg';

# <Icon/> Security

<CommandsTable
applyFilter = 'Security'
columns={columns}
data={commands}
columnsToHide = {['category']}
/>
