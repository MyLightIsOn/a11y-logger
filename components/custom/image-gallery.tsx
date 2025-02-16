"use client";

import React, { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export default function ImageGallery(props) {
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: "#" + props.galleryID,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div className="pswp-gallery grid grid-cols-2 gap-2" id={props.galleryID}>
      {props.images.map((image, index) => (
        <a
          className={
            "border border-muted-foreground aspect-square flex justify-center items-center overflow-hidden"
          }
          href={image.largeURL}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          key={props.galleryID + "-" + index}
          target="_blank"
          rel="noreferrer"
        >
          <img src={image.thumbnailURL} alt="" className={"max-w-none"} />
          {/*<img className={"w-fit h-fit"} src={image.thumbnailURL} alt="" />*/}
        </a>
      ))}
    </div>
  );
}
