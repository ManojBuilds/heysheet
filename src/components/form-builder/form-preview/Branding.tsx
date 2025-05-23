import { FormData } from "@/types/form-builder";
import Link from "next/link";

const Branding = ({ formData }: { formData: FormData }) => {
  return (
    <div className="flex-shrink-0">
      <Link
        href={"/"}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style={{
          backgroundColor: formData.theme.backgroundSecondary,
          border: `1px solid ${formData.theme.borderColor}`,
        }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: formData.theme.textColorSecondary }}
        >
          Made with
        </span>
        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ color: formData.theme.primaryColor }}
        >
          HeySheet
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-1"
          >
            <path
              d="M13.5 6H5.25C4.65326 6 4.08097 6.23705 3.65901 6.65901C3.23705 7.08097 3 7.65326 3 8.25V18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H15.75C16.3467 21 16.919 20.7629 17.341 20.341C17.7629 19.919 18 19.3467 18 18.75V10.5M7.5 16.5L21 3M21 3H15.75M21 3V8.25"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default Branding;
