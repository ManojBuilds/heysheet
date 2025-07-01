"use server";

import { Client } from "@notionhq/client";
import { createClient } from "@/lib/supabase/server";
import { type CreateDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

export const getNotionAccount = async (notionAccountId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notion_accounts")
    .select("*")
    .eq("id", notionAccountId)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Appends a new row to a Notion database.
 * Automatically discovers database properties and maps form data to the corresponding
 * Notion property types.
 */
export const appendToNotionDatabase = async (
  accessToken: string,
  databaseId: string,
  data: Record<string, any>,
) => {
  const notion = new Client({ auth: accessToken });
  let { properties: dbProperties } = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const properties: Record<string, any> = {};
  const titleKey = Object.keys(dbProperties).find(
    (k) => dbProperties[k].type === "title",
  );
  if (titleKey) {
    const dataTitleKey = Object.keys(data).find(
      (k) => k.toLowerCase() === titleKey.toLowerCase(),
    );
    if (dataTitleKey && dataTitleKey !== titleKey) {
      data[titleKey] = data[dataTitleKey];
      delete data[dataTitleKey];
    }
  } else {
    throw new Error("Database is missing a title property.");
  }

  const inferPropertyType = (value: any): Record<string, any> => {
    if (Array.isArray(value)) return { multi_select: {} };
    if (typeof value === 'boolean') return { checkbox: {} };
    if (typeof value === 'number') return { number: {} };
    if (typeof value === 'string') {
      if (/^[\s\S]*@[\s\S]*\.[\s\S]*/.test(value)) return { email: {} };
      if (/^https?:\/\//.test(value)) return { url: {} };
      if (/^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/.test(value)) return { phone_number: {} };
      if (!isNaN(Date.parse(value)) && /\d{4}-\d{2}-\d{2}/.test(value)) return { date: {} };
    }
    return { rich_text: {} };
  };

  const newProperties: Record<string, any> = {};
  for (const [field, value] of Object.entries(data)) {
    if (!dbProperties[field]) {
      newProperties[field] = inferPropertyType(value);
    }
  }

  if (Object.keys(newProperties).length > 0) {
    const updatedDb = await notion.databases.update({
      database_id: databaseId,
      properties: newProperties,
    });
    dbProperties = updatedDb.properties;
  }


  for (const [field, value] of Object.entries(data)) {
    const prop = dbProperties[field];
    if (!prop || value == null) continue;
    try {
      switch (prop.type) {
        case "title":
          properties[field] = { title: [{ text: { content: String(value) } }] };
          break;
        case "rich_text":
          properties[field] = {
            rich_text: [{ text: { content: String(value) } }],
          };
          break;
        case "number":
          const num = parseFloat(value);
          if (!isNaN(num)) properties[field] = { number: num };
          break;
        case "select":
          properties[field] = { select: { name: String(value) } };
          break;
        case "multi_select":
          const items = Array.isArray(value)
            ? value.map(String)
            : String(value)
                .split(",")
                .map((s) => s.trim());
          properties[field] = { multi_select: items.map((name) => ({ name })) };
          break;
        case "date":
          const d = new Date(value);
          if (!isNaN(d.getTime()))
            properties[field] = { date: { start: d.toISOString() } };
          break;
        case "checkbox":
          properties[field] = { checkbox: Boolean(value) };
          break;
        case "url":
          if (String(value).startsWith("http"))
            properties[field] = { url: String(value) };
          break;
        case "email":
          if (String(value).includes("@"))
            properties[field] = { email: String(value) };
          break;
        case "phone_number":
          properties[field] = { phone_number: String(value) };
          break;
        case "people":
          const people = Array.isArray(value) ? value : [value];
          properties[field] = { people: people.map((id) => ({ id })) };
          break;
        case "relation":
          const rels = Array.isArray(value) ? value : [value];
          properties[field] = { relation: rels.map((id) => ({ id })) };
          break;
        default:
          // unsupported: files, rollup, formula, created_time, last_edited_time, etc.
          break;
      }
    } catch (err) {
      console.error(`Failed to map property ${field}:`, err);
    }
  }

  if (!properties[titleKey]) {
    throw new Error(`Title property '${titleKey}' is required in data.`);
  }

  return notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
};

/**
 * Creates a new Notion database using a full set of property definitions.
 * Also inserts a test row covering every property type for QA.
 */
export const createNotionDatabase = async (
  accessToken: string,
  pageId: string,
  title: string,
  propDefinitions: CreateDatabaseParameters["properties"],
) => {
  const notion = new Client({ auth: accessToken });

  const fullProps = {
    ...propDefinitions,
  };

  const hasTitleProperty = Object.values(fullProps).some(
    (prop) => "title" in prop,
  );

  if (!hasTitleProperty) {
    fullProps["Name"] = { title: {} };
  }

  const db = await notion.databases.create({
    parent: { type: "page_id", page_id: pageId },
    title: [{ type: "text", text: { content: title } }],
    properties: fullProps,
  });

  // await notion.pages.create({
  //   parent: { database_id: db.id },
  //   properties: {
  //     title: { title: [{ text: { content: "Test Title" } }] },
  //     Description: { rich_text: [{ text: { content: "Sample rich text" } }] },
  //     Count: { number: 123 },
  //     Category: { select: { name: "Option A" } },
  //     Tags: { multi_select: [{ name: "X" }, { name: "Y" }] },
  //     Due: { date: { start: new Date().toISOString() } },
  //     Done: { checkbox: true },
  //     Link: { url: "https://example.com" },
  //     Contact: { email: "test@example.com" },
  //     Phone: { phone_number: "+1234567890" },
  //     Assignees: { people: [] },
  //   },
  // });

  return db;
};

/**
 * cURL examples to POST form data:
 *
 * 1) JSON body:
 *
 * curl -X POST http://localhost:3000/api/s/H07yJwW6fV \
 *   -H 'Content-Type: application/json' \
 *   -d '{
 *     "notionAccountId": "<id>",
 *     "databaseId": "<dbId>",
 *     "title": "Hello",
 *     "Description": "World",
 *     "Count": 42,
 *     "Category": "Option A",
 *     "Tags": ["X","Y"],
 *     "Due": "2025-07-15T00:00:00Z",
 *     "Done": false,
 *     "Link": "https://example.com",
 *     "Contact": "user@example.com",
 *     "Phone": "+911234567890"
 *   }'
 *
 * 2) multipart/form-data (including file upload):
 *
 * curl -X POST http://localhost:3000/api/s/H07yJwW6fV \
 *   -F "notionAccountId=<id>" \
 *   -F "databaseId=<dbId>" \
 *   -F "title=WithFile" \
 *   -F "file=@/path/to/myfile.pdf" \
 *   -F "Description=Uploaded with file"
 */

export const createNotionPage = async (
  accessToken: string,
  title: string,
  parentPageId?: string,
) => {
  const notion = new Client({ auth: accessToken });

  const properties: Record<string, any> = {
    title: {
      title: [{ text: { content: title } }],
    },
  };

  const parent = parentPageId
    ? { page_id: parentPageId, type: "page_id" as const }
    : {
        workspace: true,
      };

      const response = await notion.pages.create({
    // @ts-expect-error - Notion API is missing this property
    parent,
    properties,
  });

  return response;
};

export const listNotionPages = async (accessToken: string) => {
  const notion = new Client({ auth: accessToken });
  const response = await notion.search({
    filter: {
      property: "object",
      value: "page",
    },
  });
  return response.results.map((page: any) => {
    let title = "Untitled Page";
    if (page.properties) {
      const titleProperty = Object.values(page.properties).find(
        (prop: any) =>
          prop.type === "title" &&
          Array.isArray((prop as any).title) &&
          (prop as any).title.length > 0 &&
          (prop as any).title[0]?.plain_text,
      );
      if (titleProperty) {
        title = (titleProperty as any).title[0].plain_text;
      }
    }
    return {
      id: page.id,
      title,
    };
  });
};

export const listNotionDatabases = async (accessToken: string) => {
  const notion = new Client({ auth: accessToken });
  const response = await notion.search({
    filter: {
      property: "object",
      value: "database",
    },
  });
  return response.results.map((db: any) => ({
    id: db.id,
    title:
      Array.isArray(db.title) && db.title.length > 0
        ? db.title[0].plain_text
        : "Untitled Database",
  }));
};
