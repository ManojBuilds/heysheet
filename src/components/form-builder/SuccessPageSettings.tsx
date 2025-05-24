import { FormData } from "@/types/form-builder";
import RichTextEditor from "../rich-text-editor/RichTextEditor";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const SuccessPageSettings = ({
  formData,
  updateSuccessPage,
}: {
  formData: FormData;
  updateSuccessPage: (updates: Partial<FormData["successPage"]>) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Success Page Title</Label>
        <Input
          value={formData.successPage?.title || "Thanks for your submission!"}
          onChange={(e) => updateSuccessPage({ title: e.target.value })}
          placeholder="Enter success page title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={
            formData.successPage?.description ||
            "Your response has been recorded."
          }
          onChange={(e) => updateSuccessPage({ description: e.target.value })}
          placeholder="Enter success message"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Additional Instructions (Optional)</Label>
        <RichTextEditor
          value={formData.successPage?.customContent || ""}
          onChange={(value) => updateSuccessPage({ customContent: value })}
          theme={formData.theme}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Add any additional instructions or next steps for form submitters
        </p>
      </div>
    </div>
  );
};

export default SuccessPageSettings;
