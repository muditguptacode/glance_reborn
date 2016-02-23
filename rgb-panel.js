var serialport = require('serialport').SerialPort;
var fonts = require('./font.js');


function RGBPanel(port, baudrate)
{
    this.port = port || '/dev/ttyUSB0';
    this.baudrate = baudrate || 115200;
    this.rgbMatrixDisplay = null;
    
    //scope binding statements
    this.init = this.init.bind(this);
    this.decimalToBinary = this.decimalToBinary.bind(this);
    this.drawString = this.drawString.bind(this);
    this.drawChar = this.drawChar.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
}

RGBPanel.prototype.init = function(callback)
{
    //init the 16x32 rgb matrix
    this.rgbMatrixDisplay = new serialport(this.port, {baudrate: this.baudrate});
    this.rgbMatrixDisplay.open(function(error)
    {
        if(error)
        {
            console.log("ERROR");
        }    
        else
        {
            setTimeout(function(self)
            {
                if(callback)callback();
            }, 2000, this);
        }
    });
}

RGBPanel.prototype.decimalToBinary = function(dec,length)
{
  var out = "";
  while(length--)
    out += (dec >> length ) & 1;    
  return out;  
}

RGBPanel.prototype.drawString = function(characterString, x, y, r, g, b, clearInterval, scrollInterval)
{
    if(characterString.length > 5)
    {
        setTimeout(function(self)
        {
            for(var characterIndex in characterString)
            {
                self.drawChar(characterString[characterIndex], x+(characterIndex*6), y, 0, 0, 0);
            }
        }, clearInterval, this);
        
        setTimeout(function(self)
        {
            self.drawString(characterString.slice(1, characterString.length), x, y, r, g, b, scrollInterval)
        }, scrollInterval, this);
    }
    for(var characterIndex in characterString)
    {
        this.drawChar(characterString[characterIndex], x+(characterIndex*6), y, r, g, b);
    }
       
}

RGBPanel.prototype.clearDisplay = function()
{
    for(var x=0;x<32;x++)
    {    
        for(var y=0;y<16;y++)
        {    
            this.rgbMatrixDisplay.write(x+","+y+","+0+","+0+","+0+"*");
        }
    }
}

RGBPanel.prototype.drawChar = function(character, x, y, r, g, b)
{
    r = r || 7;
    g = g || 7;
    b = b || 7;
    var chr = character.charCodeAt(0);
    var a = chr * 5;
    for(var i=a;i<a+5;i++)
    {    
        for(var j=0;j<7;j++)
        {    
            if(this.decimalToBinary(fonts[i], 8)[7-j] == '1')
            {
                this.rgbMatrixDisplay.write((x+i-a)+","+(y+j)+","+r+","+g+","+b+"*");
            }
        }
    }
}

module.exports = RGBPanel;