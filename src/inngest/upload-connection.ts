// app/actions/upload-connections.ts
"use server";

import { inngest } from "./client";

export async function uploadConnection(row: {
  firstName: string;
  lastName: string;
  url: string;
  company: string;
  position: string;
  connectedOn: string;
  userID: string;
}) {
  await inngest.send({
    name: "connection/add",
    data: {
      name: `${row.firstName} ${row.lastName}`,
      company: row.company,
      connectedOn: row.connectedOn,
      linkedinURL: row.url,
      position: row.position,
      userID: row.userID,
    },
  });
}
