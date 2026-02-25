// // imageUpload.tsx (optional)
// // Delete this file because of it not in used.



// import { useEffect, useState } from "react";

// interface ImageUploadProps {
//   value: string;
//   onChange: (base64: string) => void;
//   disabled?: boolean;
// }

// export function ImageUplaod({ value, onChange, disabled }: ImageUploadProps) {
//   const [preview, setPreview] = useState<string | null>(null);

//   useEffect (()=> {
//     if (value) {
//       setPreview(value);
//     }
//   }, [value]);


// };


// import { useEffect, useState } from "react";

// interface ImageUploadProps {
//   // value?: string;
//   // onChange: (base64: string) => void;
//   onChange: (file: File | null) => void;
//   disabled?: boolean;
// }

// export function ImageUpload({
//   // value,
//   onChange,
//   disabled,
// }: ImageUploadProps) {
//   const [preview, setPreview] = useState<string | null>(null);

//   useEffect(() => {
//     if (value) {
//       setPreview(value);
//     }
//   }, [value]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Only image files allowed");
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       alert("Image must be under 2MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result as string;
//       setPreview(base64);
//       onChange(file);
//     };
//     reader.readAsDataURL(file);
//     e.target.value = "";
//   };

//   return (
//     <div className="space-y-2">
//       {preview ? (
//         <div className="h-32 w-32 overflow-hidden rounded-md border">
//           <img
//             src={preview}
//             alt="Preview"
//             className="h-full w-full object-cover"
//           />
//         </div>
//       ) : (
//         <div className="h-32 w-32 flex items-center justify-center rounded-md border text-xs text-muted-foreground">
//           No Image
//         </div>
//       )}

//       <input
//         type="file"
//         accept="image/png,image/jpeg,image/webp"
//         // onChange={handleFileChange}
//         onChange={(e) => onChange(e.target.files?.[0] || null)}
//         disabled={disabled}
//         className="block w-full text-xs"
//       />
//     </div>
//   );
// }


import { useState } from "react";

interface ImageUploadProps {
  onChange: (file: File | undefined) => void;
  disabled?: boolean;
}

export function ImageUpload({ onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="h-32 w-32 overflow-hidden rounded-md border">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-32 w-32 flex items-center justify-center rounded-md border text-xs text-muted-foreground">
          No Image
        </div>
      )}

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="block w-full text-xs"
      />
    </div>
  );
}