import { FormComponent, FormPage, FormTheme } from "@/types/form-builder";
import { cn } from "@/lib/utils";

interface FormDisplayProps {
  title: string;
  theme: FormTheme;
  components: FormComponent[];
  pages: FormPage[];
  activePage: string;
}

export function FormDisplay({
  title,
  theme,
  components,
  pages,
  activePage,
}: FormDisplayProps) {
  const currentPageComponents = components.filter(
    (component) => component.pageId === activePage
  );

  return (
    <div
      className="w-full rounded-lg border bg-card p-6 shadow-sm"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: theme.primaryColor }}
      >
        {title}
      </h1>

      <div className="space-y-6">
        {currentPageComponents.map((component) => (
          <div
            key={component.id}
            className={cn(
              "rounded-lg border bg-white p-4 shadow-sm",
              component.required && "border-l-4",
              component.required && `border-l-[${theme.primaryColor}]`
            )}
          >
            <h3 className="text-lg font-medium mb-2">{component.title}</h3>
            {component.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {component.description}
              </p>
            )}
            {/* TODO: Add form input components based on component.type */}
          </div>
        ))}
      </div>
    </div>
  );
}