import { useEffect } from "react";

export default function useMetaArgs(args) {
  useEffect(() => {
    const { title, description, keywords } = args;

    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.setAttribute("name", "description");
        newMeta.setAttribute("content", description);
        document.head.appendChild(newMeta);
      }
    }

    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.setAttribute("name", "keywords");
        newMeta.setAttribute("content", keywords);
        document.head.appendChild(newMeta);
      }
    }
    // Clean up on unmount
    return () => {
      if (title) {
        document.title = "Clinicare";
      }
      if (description) {
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription) {
          metaDescription.remove();
        }
      }
      if (keywords) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.remove();
        }
      }
    };
  }, [args.title, args.description, args.keywords,args]);
}

// its for your seo (search engine optimization) and it can only be used on pages