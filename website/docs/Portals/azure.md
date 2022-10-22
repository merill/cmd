---
title: Azure
hide_table_of_contents: true
---
import { CommandsTable } from "@site/src/components/CommandsTable";
import { commands } from "@site/src/tableHome/commands.table";
import { columns } from "@site/src/tableHome/columns.portal.table";

<CommandsTable
columns={columns}
data={ commands }
applyFilter = 'Azure'
/>