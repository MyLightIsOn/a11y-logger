"use client";
import React, { useState, useRef } from "react";
import { StrapiImage } from "./strapi-image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImagePickerProps {
  id: string;
  name: string;
  label: string;
  showCard?: boolean;
  defaultValue?: string;
  multiple?: boolean;
  setSelectedImages?: any;
}

function generateDataUrl(file: File, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsDataURL(file);
}

function ImagePreview({ dataUrl }: { readonly dataUrl: string }) {
  return (
    <StrapiImage
      src={dataUrl}
      alt="preview"
      height={200}
      width={200}
      className="rounded-lg w-full object-cover"
    />
  );
}

function IssueImagePreview({ dataUrl }: { readonly dataUrl: string }) {
  return (
    <StrapiImage
      src={dataUrl}
      alt="preview"
      height={200}
      width={200}
      className="object-cover"
    />
  );
}

function SingleImageCard({
  dataUrl,
  fileInput,
}: {
  readonly dataUrl: string;
  readonly fileInput: React.RefObject<HTMLInputElement>;
}) {
  const imagePreview = dataUrl ? (
    <ImagePreview dataUrl={dataUrl} />
  ) : (
    <p>No image selected</p>
  );

  return (
    <div className="w-full relative">
      <div className=" flex items-center space-x-4 rounded-md border p-4">
        {imagePreview}
      </div>
      <button
        onClick={() => fileInput.current?.click()}
        className="w-full absolute inset-0"
        type="button"
      ></button>
    </div>
  );
}

function MultipleImageCard({
  dataUrl,
  fileInput,
}: {
  readonly dataUrl: Array<string>;
  readonly fileInput: React.RefObject<HTMLInputElement>;
}) {
  const imagePreview: React.JSX.Element[] = [];

  if (dataUrl) {
    dataUrl.map((url: string) => {
      const el = <IssueImagePreview dataUrl={url} key={url} />;

      imagePreview.push(el);
    });
  }

  return (
    <div className="w-full relative">
      <div className=" flex items-center space-x-4 rounded-md border p-4">
        {!dataUrl && <p>No image selected</p>}
        {imagePreview}
      </div>
      <button
        onClick={() => fileInput.current?.click()}
        className="w-full absolute inset-0"
        type="button"
      ></button>
    </div>
  );
}

export default function ImagePicker({
  id,
  name,
  label,
  defaultValue,
  multiple,
  setSelectedImages,
}: Readonly<ImagePickerProps>) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(defaultValue ?? null);
  const [multipleDataUrl, setMultipleDataUrl] =
    useState<Array<string> | null>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const files = e.target.files;
      let fileArray = [];
      if (!files) return;

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = () => {
          fileArray.push(reader.result as string);
          setMultipleDataUrl(fileArray);
        };
      }

      setSelectedImages(files);
    } else {
      const file = e.target.files?.[0];
      if (file) generateDataUrl(file, setDataUrl);
    }
  };

  return (
    <React.Fragment>
      <div className="hidden">
        <Label htmlFor={name}>{label}</Label>
        <Input
          type="file"
          id={id}
          name={name}
          onChange={handleFileChange}
          ref={fileInput}
          accept="image/*"
          multiple={multiple}
        />
      </div>
      {!multiple && (
        <SingleImageCard dataUrl={dataUrl ?? ""} fileInput={fileInput} />
      )}
      {multiple && (
        <MultipleImageCard
          dataUrl={multipleDataUrl ?? ""}
          fileInput={fileInput}
        />
      )}
    </React.Fragment>
  );
}
