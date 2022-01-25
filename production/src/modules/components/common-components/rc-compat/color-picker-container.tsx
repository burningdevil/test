import * as React from 'react';
import ColorPicker from '@mstr/rc/lib/color-picker/color-picker';
import { useState } from 'react';
import './color-picker-container.scss';
import { COLOR, DIRECTION, TABS } from './color-picker-helpers/enums';
import { useEffect } from 'react';
import {
  getGradientLinearBackgroundString,
  isColorGradient,
  gradientEquals,
  getSplitFavorites,
} from './color-picker-helpers/utils';

const ColorPickerContainer: React.FC<any> = (props) => {
  const {
    onChange,
    onChangeOpacity,
    onChangeGradient,
    onChangeFavorite,
    onPopoverVisibleChange,
    useOpacity,
    opacity,
    chosenTab,
    value,
    colorGuideHexVals,
    paletteHexVals,
    customVals,
    className,
    popoverClassName,
    allowResetDefault,
    useGradient,
    isGradient,
    gradientConfig,
    gradientStyle: propsGradientStyle,
    disabled,
    ariaLabel,
    displayMode,
    tooltipText,
    maxFavorite,
    locale,
  } = props;
  const [colorValue, changeValue] = useState(value);
  const [isVisible, changeVisible] = useState(false);
  const [opacityValue, changeOpacityValue] = useState(opacity);
  const [customHexVals, changeCustomVals] = useState(customVals);
  const [isGradientVal, changeIsGradient] = useState(isGradient);
  const [gradientConfigVal, changeGradientConfig] = useState(gradientConfig);
  const [isIndeterminate, changeIsIndeterminate] = useState(
    value === COLOR.INDETERMINATE
  );
  const [solidFavorites, changeSolidFavorites] = useState(
    getSplitFavorites(customHexVals).solidFavorites
  );
  const [gradientFavorites, changeGradientFavorites] = useState(
    getSplitFavorites(customHexVals).gradientFavorites
  );
  const [isSolidFavoriteFull, changeSolidFavoriteFull] = useState(
    solidFavorites && solidFavorites.length >= maxFavorite
  );
  const [isGradientFavoriteFull, changeGradientFavoriteFull] = useState(
    gradientFavorites && gradientFavorites.length >= maxFavorite
  );

  // Enums to tell the onChangeFavorite function if the value should be added or removed
  const SHOULD_ADD = true;
  const SHOULD_REMOVE = false;

  // listen for props to update
  useEffect(() => {
    changeValue(value);
    changeIsIndeterminate(value === COLOR.INDETERMINATE);
  }, [value]);

  useEffect(() => {
    changeGradientConfig(gradientConfig);
  }, [gradientConfig]);

  useEffect(() => {
    changeIsGradient(isGradient);
  }, [isGradient]);

  useEffect(() => {
    changeOpacityValue(opacity);
  }, [opacity]);

  useEffect(() => {
    changeCustomVals(customVals);
  }, [customVals]);

  useEffect(() => {
    const {
      solidFavorites: solidFavoriteColors,
      gradientFavorites: gradientFavoriteColors,
    } = getSplitFavorites(customHexVals);

    changeSolidFavorites(solidFavoriteColors);
    changeGradientFavorites(gradientFavoriteColors);

    // Check here if maxFavorite needs to change
    changeSolidFavoriteFull(
      maxFavorite && solidFavoriteColors.length === maxFavorite
    );
    changeGradientFavoriteFull(
      maxFavorite && gradientFavoriteColors.length === maxFavorite
    );
  }, [customHexVals, maxFavorite]);

  /**
   * Callback function for colors
   * @param {String | Object} newValue - New color to use
   * @param {Boolean} shouldNotApplyChange - Whether or not the onChange should do anything. This is
   * required because we need to send our value to the onChange of the third party color picker more
   * often than when we would call it normally, and then it calls the onChange here.
   */
  function change(newValue: any, shouldNotApplyChange: any) {
    if (shouldNotApplyChange) {
      return;
    }
    if (isColorGradient(newValue)) {
      // Instead of writing hex value we need to send an object
      const { colorA, colorB, direction } = newValue;
      onChangeGradientConfig({ colorA, colorB, direction });
      return;
    }
    changeValue(
      newValue.hex ? newValue.hex.toUpperCase() : newValue.toUpperCase()
    );
    changeIsGradient(false);
    onChange(
      newValue.hex ? newValue.hex.toUpperCase() : newValue.toUpperCase()
    );
    changeIsIndeterminate(newValue === COLOR.INDETERMINATE);
  }

  /**
   * This function is to open/close the color picker when Keyboard event is triggered.
   * @param {DOM Event} event - keyboard event
   */

  const changeCustomFavorites = (
    shouldAdd: any,
    filterFunction: any,
    tabFavorites: any,
    changeTabFavorites: any,
    changeFavoriteFull: any,
    val: any
  ) => {
    if (shouldAdd) {
      // Add new value to individual favorites array
      const newFavorites = [...tabFavorites, val];
      changeTabFavorites(newFavorites);
      // If the favorite palette is now full for solid colors, remove the add button
      if (maxFavorite && newFavorites.length >= maxFavorite) {
        changeFavoriteFull(true);
      }
      // Add new value to all favorites
      return [...customHexVals, val];
    }

    // Case where we are removing
    changeTabFavorites(tabFavorites.filter(filterFunction));
    changeFavoriteFull(false); // Favorite should never be full after removing a value

    return customHexVals.filter(filterFunction);
  };
  const onAddCustomVals = (val: any) => {
    let hasGradient;

    if (isGradientVal) {
      // We need to check if this gradient exists by checking the if custom values already have this gradient value
      hasGradient = !!customHexVals.find((currColor: any) =>
        gradientEquals(currColor, val)
      );
    } else {
      val = val.toUpperCase();
    }
    // Only add a new color to the custom vals if it isn't already in the array
    if (customHexVals.indexOf(val) < 0 || (isGradientVal && !hasGradient)) {
      const isAdd = true;
      let newFavorite;
      if (isGradientVal) {
        newFavorite = changeCustomFavorites(
          isAdd,
          undefined, // Don't need a filter function
          gradientFavorites,
          changeGradientFavorites,
          changeGradientFavoriteFull,
          val
        );
      } else {
        newFavorite = changeCustomFavorites(
          isAdd,
          undefined, // Don't need a filter function
          solidFavorites,
          changeSolidFavorites,
          changeSolidFavoriteFull,
          val
        );
      }
      changeCustomVals(newFavorite);
      onChangeFavorite(val, SHOULD_ADD);
    }
  };
  const onRemoveCustomVals = (val: any) => {
    const isRemove = false;
    let newFavorite;

    if (isGradientVal) {
      newFavorite = changeCustomFavorites(
        isRemove,
        (item: any) =>
          !(
            item.colorA === val.colorA &&
            item.colorB === val.colorB &&
            item.direction === val.direction
          ),
        gradientFavorites,
        changeGradientFavorites,
        changeGradientFavoriteFull,
        val
      );
    } else {
      newFavorite = changeCustomFavorites(
        isRemove,
        (item: any) => item !== val.toUpperCase(),
        solidFavorites,
        changeSolidFavorites,
        changeSolidFavoriteFull,
        val
      );
    }

    changeCustomVals(newFavorite);
    onChangeFavorite(val, SHOULD_REMOVE);
  };
  const onChangeOpacityVal = (o: any) => {
    changeOpacityValue(o);
    onChangeOpacity(o);
  };

  const onChangeGradientConfig = (config: any) => {
    changeIsGradient(true);
    changeGradientConfig(config);
    onChangeGradient(config);
  };
  const onResetDefault = () => {
    onChange('DEFAULT');
  };

  const linearGradientString =
    getGradientLinearBackgroundString(gradientConfigVal);
  const gradientStyle = isGradientVal
    ? { background: `linear-gradient(${linearGradientString})` }
    : {};

  return (
    <div className='color-picker-container'>
      <ColorPicker
        hidden={false}
        className={className}
        chosenTab={chosenTab}
        useOpacity={useOpacity}
        allowResetDefault={allowResetDefault}
        opacity={opacityValue}
        onOpacityChange={onChangeOpacityVal}
        onResetDefault={onResetDefault}
        useGradient={useGradient}
        gradientStyle={gradientStyle}
        isGradient={isGradientVal}
        gradientConfig={gradientConfigVal}
        changeIsGradient={changeIsGradient}
        onChangeGradient={onChangeGradientConfig}
        value={colorValue}
        onChange={change}
        colorGuideHexVals={colorGuideHexVals}
        customHexVals={customHexVals}
        addCustomVals={onAddCustomVals}
        removeCustomVals={onRemoveCustomVals}
        paletteHexVals={paletteHexVals}
        isSolidFavoriteFull={isSolidFavoriteFull}
        isGradientFavoriteFull={isGradientFavoriteFull}
        locale={locale}
        solidFavorites={solidFavorites}
        gradientFavorites={gradientFavorites}
      />
    </div>
  );
};
export default ColorPickerContainer;
