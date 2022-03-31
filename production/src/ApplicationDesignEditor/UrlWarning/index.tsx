import { t } from "../../i18n/i18next";

// URL errors
const URLErrorTypes = {
    emptyError: t('enterValidImageUrlErrMessage'),
    protocalSyntaxError: t('imageUrlWithHttpErrMessage'),
    imageTypeErrorPS: t('svgAndPngImageErrMessage'),
    imageTypeErrorP: t('pngImageErrMessage'),
    imageOnLoadError: t('imageOnLoadErrMessage')
}

// mininum dimension requirement for different Logo images
const getLogoMinDimension = (currLogoCategory: string): number => {
  let min: number;
  switch (currLogoCategory) {
    case 'web': {
      min = 64;
      break;
    }
    case 'favicon': {
      min = 32;
      break;
    }
    case 'mobile': {
      min = 75;
      break;
    }
  }
  return min;
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
const  validateImageDimensionFromUrl = (url: string, callback: any, currLogoCategory: string): void => {
  const logoMinDimension: number = getLogoMinDimension(currLogoCategory);
  const img = new Image();
 
  img.onload = function () { 
    if (img.width < logoMinDimension || img.height < logoMinDimension) {
      callback(false, t('incorrrectImageDimensionErrMessage', { logoMinDimension: logoMinDimension }));
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

  if ((currLogoCategory === 'web') && !url.match(/\.(svg|png)$/)) {
    callback(false, URLErrorTypes.imageTypeErrorPS);
    return false;
  } 

  if ((currLogoCategory === 'favicon' || currLogoCategory === 'mobile') && !url.match(/\.png$/)) {
    callback(false, URLErrorTypes.imageTypeErrorP);
    return false;
  } 

  validateImageDimensionFromUrl(url, callback, currLogoCategory);
  return true;
}


