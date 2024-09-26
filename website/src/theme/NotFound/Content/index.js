import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { CommandsTable } from "@site/src/components/CommandsTable";
import { commands } from "@site/src/tableHome/commands.table";
import { columns } from "@site/src/tableHome/columns.table";

export default function NotFoundContent({ className }) {
  return (
    <main className={clsx("container margin-vert--xl", className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="hero__title">
            <Translate
              id="theme.NotFound.title"
              description="The title of the 404 page"
            >
              Command Not Found
            </Translate>
          </Heading>
          <p>
            <Translate
              id="theme.NotFound.p1"
              description="The first paragraph of the 404 page"
            >
              Use the table below to look up the command.
            </Translate>
          </p>
          <p>
            If the command you want is not yet available in <b>cmd.ms</b> you
            can use the{" "}
            <a href="https://github.com/merill/cmd/issues/new?assignees=&labels=enhancement&template=new-command-request.md&title=">
              Propose New Command form
            </a>{" "}
            to make a request.
          </p>
        </div>
        <div className="col col--offset-0">
          <CommandsTable columns={columns} data={commands} applyFilter="" />
        </div>
      </div>
    </main>
  );
}
