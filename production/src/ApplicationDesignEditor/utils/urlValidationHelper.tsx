import { t } from "../../i18n/i18next";

// URL errors
const URLErrorTypes = {
    emptyError: t('emptyImageUrlErrMessage'),
    protocalSyntaxError: t('imageUrlWithHttpErrMessage'),
    imageTypeErrorPS: t('svgAndPngImageErrMessage'),
    imageTypeErrorP: t('pngImageErrMessage'),
    imageOnLoadError: t('imageOnLoadErrMessage'),
    imageSizeError: t('incorrrectImageDimensionErrMessage')
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

// check strings beginning with 'http(s)://'
const isValidExternalLinkProtocol = (url: string): boolean => {
  if (!url) {
    return true;
  }

  const validProtocolsRegex = /^https?:\/\//i;
  const trimmedUrl = url.trim();

  return validProtocolsRegex.test(trimmedUrl);
}

// check image dimension 
export const  validateImageDimensionFromUrl = (url: string, callback: any, currLogoCategory: string): void => {
  const logoMinDimension: number = getLogoMinDimension(currLogoCategory);
  const img = new Image();
 
  img.onload = function () { 
    if (img.width < logoMinDimension || img.height < logoMinDimension) {
      callback(false, URLErrorTypes.imageSizeError);
    } else {
      callback(true, '');
    }
  }
  
  img.onerror = () => {
    callback(false, URLErrorTypes.imageOnLoadError);
  };

  img.src = url;
 }

export const validateUrl = (url: string, callback: any, currLogoCategory: string): boolean => {
  if (!url) {
    callback(false, URLErrorTypes.emptyError);
    return false;
  }

  if (!isValidExternalLinkProtocol(url)) {
    callback(false,URLErrorTypes.protocalSyntaxError);
    return false;
  }

  // todo: implement image format check

  validateImageDimensionFromUrl(url, callback, currLogoCategory);

  // reset error message
  callback(true, '');
  return true;
}


