---
title: My Pages
hide_table_of_contents: true
---

import { CommandsTable } from "@site/src/components/CommandsTable";
import { commands } from "@site/src/tableHome/commands.table";
import { columns } from "@site/src/tableHome/columns.table";

<CommandsTable
columns={columns}
data={ commands }
applyFilter = 'My Pages'
/>
