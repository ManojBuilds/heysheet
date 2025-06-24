import { BellIcon, FileSpreadsheetIcon } from "lucide-react";
import CodeSnippet from "./CodeSnippet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConfigureIntegration from "@/components/integrations/configure-integrations";
import { FormSettings } from "./FormSettings";
import { Button } from "@/components/ui/button";
import DeleteFormButton from "./delete-form-button";
import FileUploadSettings from "@/components/FileUploadSettings";
import { updateForm } from "@/actions";
import { FormDetails as IFormDetails } from "@/types/form-details";
import CodeBlock from "@/components/code-block";

export const FormDetails = ({
  data,
  endpointUrl,
  appUrl,
  id,
}: {
  data: IFormDetails;
  endpointUrl: string;
  appUrl: string;
  id: string;
}) => {
  const formEmbeddingCode = `<iframe 
src="${process.env.NEXT_PUBLIC_APP_URL}/f/${id}"
width="100%"
height="400"
style="border: none;"
title="Heysheet Form Embed"
loading="lazy"
></iframe>
`;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="text-muted-foreground flex items-center gap-1">
          <BellIcon className="w-4 h-4" />
          {data.submission_count === 0
            ? "No submissions yet"
            : `${data.submission_count} Responses Collected`}{" "}
        </p>
        <p className="text-sm text-muted-foreground">
          Manage your form settings, connected spreadsheet, and integration
          options.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connected spreadsheet</CardTitle>
          <CardDescription>
            Responses are automatically saved to this spreadsheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href={`https://docs.google.com/spreadsheets/d/${data.spreadsheet_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button leftIcon={<FileSpreadsheetIcon className="w-5 h-5" />}>
              Open {data.sheet_name} Spreadsheet
            </Button>
          </a>
        </CardContent>
      </Card>
      <FormSettings
        endpointUrl={endpointUrl}
        formBuilderUrl={`${appUrl}/form-builder/${id}`}
        sharablePublicUrl={`${appUrl}/f/${id}`}
        formId={id}
        redirectUrl={data.redirect_url ?? ""}
      />
      <FileUploadSettings
        form={{
          id: id,
          file_upload_enabled: data.file_upload.enabled,
          file_upload_max_files: data.file_upload.max_files,
          file_upload_allowed_types: data.file_upload.allowed_file_types,
        }}
        onSave={async (config) => {
          await updateForm(
            {
              file_upload: {
                enabled: config.file_upload_enabled,
                max_files: config.file_upload_max_files,
                allowed_file_types: config.file_upload_allowed_types,
              },
            },
            id,
          );
        }}
      />

      <ConfigureIntegration data={data} />
      <CodeSnippet endpointUrl={endpointUrl} />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>
            Embed Your Form Anywhere
          </CardTitle>
          <CardDescription>
            Easily embed this form into your website by copying and pasting the code below. It’s responsive, lightweight, and works out of the box.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={formEmbeddingCode} lang="html" />
        </CardContent>
      </Card>
      <DeleteFormButton id={id} isActive={data.is_active} />
    </div>
  );
};
