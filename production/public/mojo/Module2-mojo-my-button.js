(function () {
  mstrmojo.requiresCls("mstrmojo.Button");

  /**
   * Sample button widget.
   *
   * @extends mstrmojo.Button
   * @mixes mstrmojo._HandlesClick
   */
  mstrmojo.MyButton = mstrmojo.declare(
      mstrmojo.Button,

      [ ],

      {
          scriptClass: 'mstrmojo.MyButton',

          text: "Click me - I'm a button",

          getValue: function getValue() {
              return this.text;
          }
      }
  );
}());