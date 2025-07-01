import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Client } from "npm:@notionhq/client@3.1.3";

Deno.serve(async (req) => {
  try {
    const { accessToken, databaseId, data } = await req.json();

    if (!accessToken || !databaseId || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const notion = new Client({ auth: accessToken });
    const db = await notion.databases.retrieve({ database_id: databaseId });
    const dbProperties = db.properties;

    const titlePropertyName = Object.keys(dbProperties).find(
      (key) => dbProperties[key].type === "title"
    );

    if (!titlePropertyName) {
      return new Response(
        JSON.stringify({ error: "No title property in database" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const properties: Record<string, any> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && dbProperties[key]) {
        const value = data[key];
        const property = dbProperties[key];
        if (value === null || typeof value === "undefined") continue;
        try {
          switch (property.type) {
            case "title":
              properties[key] = {
                title: [{ text: { content: String(value) } }],
              };
              break;
            case "rich_text":
              properties[key] = {
                rich_text: [{ text: { content: String(value) } }],
              };
              break;
            case "number":
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                properties[key] = { number: numValue };
              }
              break;
            case "select":
              if (typeof value === "string" && value.trim() !== "") {
                properties[key] = { select: { name: value } };
              }
              break;
            case "multi_select":
              let values: string[];
              if (Array.isArray(value)) {
                values = value.map(String);
              } else if (typeof value === "string") {
                values = value.split(",").map((s) => s.trim());
              } else {
                values = [String(value)];
              }
              properties[key] = {
                multi_select: values.map((name) => ({ name })),
              };
              break;
            case "date":
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                properties[key] = { date: { start: date.toISOString() } };
              }
              break;
            case "checkbox":
              properties[key] = { checkbox: Boolean(value) };
              break;
            case "url":
              if (typeof value === "string" && value.startsWith("http")) {
                properties[key] = { url: value };
              }
              break;
            case "email":
              if (typeof value === "string" && value.includes("@")) {
                properties[key] = { email: value };
              }
              break;
            case "phone_number":
              if (typeof value === "string") {
                properties[key] = { phone_number: value };
              }
              break;
            default:
              break;
          }
        } catch (error) {
          // Ignore property errors
        }
      }
    }

    if (!properties[titlePropertyName]) {
      return new Response(
        JSON.stringify({ error: `The title property "${titlePropertyName}" must be provided in the data.` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const notionRes = await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
    });

    return new Response(JSON.stringify({ success: true, page: notionRes }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
