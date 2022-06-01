import { t } from "../../i18n/i18next";

// URL errors
const URLErrorTypes = {
    protocalSyntaxError: t('imageUrlWithHttpErrMessage'),
    imageTypeErrorPS: t('svgAndPngImageErrMessage'),
    imageTypeErrorP: t('pngImageErrMessage'),
    imageOnLoadError: t('imageOnLoadErrMessage'),
    imageSizeError: t('incorrectImageDimensionErrMessage')
}

// mininum dimension requirement for different Logo images
const getLogoMinDimension = (currLogoCategory: string): number => {
  switch (currLogoCategory) {
    case 'web': {
      return 64;
    }
    case 'favicon': {
      return 32;
    }
    case 'mobile': {
      return 75;
    }
  }
}

// filetype requirement for different Logo images
const getLogoFileTypesAndErrorMsg = (currLogoCategory: string): { requiredFileTypes: Array<string>, errorMsg: string } => {
  switch (currLogoCategory) {
    case 'web':
      return { requiredFileTypes: ['image/png', 'image/svg+xml'], errorMsg: URLErrorTypes.imageTypeErrorPS };
    case 'favicon':
    case 'mobile':
      return { requiredFileTypes: ['image/png'], errorMsg: URLErrorTypes.imageTypeErrorP };
  }
}

// check strings beginning with 'http(s)://'
const isValidExternalLinkProtocol = (url: string): boolean => {
  if (!url) {
    return true;
  }

  const validProtocolsRegex = /^https?:\/\//i;
  const trimmedUrl = url.trim();

  return validProtocolsRegex.test(trimmedUrl);
}

// check Content-Type for file type and verify with logo category requirements
// also checks for invalid URL via Image object, to ensure we check this early to provide correct error msg
const validateImageFileTypeFromUrl = (url: string, callback: any, currLogoCategory: string): Promise<boolean> => new Promise((resolve) => {
  const { requiredFileTypes, errorMsg } = getLogoFileTypesAndErrorMsg(currLogoCategory);
  let img = new Image();
  let xhttp = new XMLHttpRequest();
  img.onerror = () => {
    callback(false, URLErrorTypes.imageOnLoadError);
  };
  xhttp.open('HEAD', url);
  xhttp.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        const contentType = this.getResponseHeader("Content-Type")
        if (requiredFileTypes.includes(contentType)) {
          resolve(true);
        } else {
          callback(false, errorMsg);
        }
      }
  };
  img.src = url;
  xhttp.send();
});

// check image dimension 
const validateImageDimensionFromUrl = (url: string, callback: any, currLogoCategory: string): Promise<boolean> => new Promise((resolve) => {
  const logoMinDimension: number = getLogoMinDimension(currLogoCategory);
  const img = new Image();
  img.onload = () => { 
    if (img.width < logoMinDimension || img.height < logoMinDimension) {
      callback(false, URLErrorTypes.imageSizeError);
    } else {
      resolve(true);
    }
  }
  img.src = url;
});

export const validateUrl = async (url: string, callback: any, currLogoCategory: string): Promise<void> => {
  if (!url) {
    callback(true, '');
    return;
  }

  if (!isValidExternalLinkProtocol(url)) {
    callback(false, URLErrorTypes.protocalSyntaxError);
    return;
  }

  // check for valid filetype, which is an async process so we must await it
  const isValidFiletype = await validateImageFileTypeFromUrl(url, callback, currLogoCategory);
  // only check for valid dimensions after we've already checked for valid filetype, this is to prevent double loading an invalid image
  const isValidDimensions = isValidFiletype && await validateImageDimensionFromUrl(url, callback, currLogoCategory);

  // reset error message as long as all checks passed
  if (isValidDimensions) {
    callback(true, '');
  }
}


