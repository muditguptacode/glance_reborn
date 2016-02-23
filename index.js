var eightbyeight = require('eightbyeight');
var matrixDisplay = [];
var RGBPanel = require('./rgb-panel.js');
//init all 8x8 matrix displays 
for(var i=0; i<8;i++)
{
    matrixDisplay.push(new eightbyeight(0x70+i, 1));
    matrixDisplay[i].allOn();
}


var rgbPanel = new RGBPanel('/dev/ttyUSB0', 115200);

rgbPanel.init(function()
{
    rgbPanel.drawString('ABCDEFG', 0, 0, 7, 7, 7);
});